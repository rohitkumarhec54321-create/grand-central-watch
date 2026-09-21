'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chapters, finishes, type Finish } from '@/lib/gc01/config';
import './GC01Landing.css';

type Presentation = 'poster' | 'cinematic' | 'mobile' | 'static';
type Studio = Awaited<
  ReturnType<typeof import('@/lib/gc01/scene').createWatchStudio>
>;
const mobileChapters = [0, 1, 4, 6];

export default function GC01Landing() {
  const film = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const studio = useRef<Studio | null>(null);
  const progressLine = useRef<HTMLSpanElement>(null);
  const progress = useRef(0);
  const currentChapter = useRef(0);
  const [presentation, setPresentation] = useState<Presentation>('poster');
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [finish, setFinish] = useState<Finish>('steel');
  const [inFinishes, setInFinishes] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const chosen = finishes.find((item) => item.id === finish)!;

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = matchMedia('(max-width: 899px)');
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const choose = () => {
      setReady(false);
      setPresentation(
        reduce.matches ||
          connection?.saveData ||
          navigator.hardwareConcurrency <= 2
          ? 'static'
          : narrow.matches
            ? 'mobile'
            : 'cinematic',
      );
    };
    choose();
    reduce.addEventListener('change', choose);
    narrow.addEventListener('change', choose);
    return () => {
      reduce.removeEventListener('change', choose);
      narrow.removeEventListener('change', choose);
    };
  }, []);

  useEffect(() => {
    if (presentation === 'poster') return;
    gsap.registerPlugin(ScrollTrigger);
    const element = film.current!;
    const update = (value: number) => {
      progress.current = value;
      studio.current?.setProgress(value);
      if (progressLine.current)
        progressLine.current.style.transform = `scaleX(${value})`;
      const next =
        presentation === 'mobile'
          ? mobileChapters[Math.min(3, Math.floor(value * 4))]
          : Math.max(
              0,
              chapters.findLastIndex((item) => value >= item.at),
            );
      if (next !== currentChapter.current) {
        currentChapter.current = next;
        setChapter(next);
      }
    };
    update(0);
    const trigger =
      presentation === 'static'
        ? null
        : ScrollTrigger.create({
            trigger: element,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => update(self.progress),
            onRefresh: (self) => update(self.progress),
          });
    const endTrigger = ScrollTrigger.create({
      trigger: '#finishes',
      start: 'top center',
      end: 'bottom top',
      onToggle: (self) => setInFinishes(self.isActive),
    });
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      trigger?.kill();
      endTrigger.kill();
    };
  }, [presentation]);

  useEffect(() => {
    if (presentation !== 'cinematic' || !canvas.current) return;
    const controller = new AbortController();
    let disposed = false,
      frame = 0,
      visible = true,
      lastDraw = 0,
      lastProgress = -1,
      slowFrames = 0,
      draws = 0;
    let local: Studio | null = null;
    const element = canvas.current;
    const fallback = () => {
      if (!disposed) {
        setReady(false);
        setPresentation('static');
      }
    };
    const timeout = window.setTimeout(() => {
      controller.abort();
      fallback();
    }, 15000);
    const contextLost = (event: Event) => {
      event.preventDefault();
      fallback();
    };
    element.addEventListener('webglcontextlost', contextLost);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(element);
    const resize = new ResizeObserver(() => {
      local?.resize(element.clientWidth, element.clientHeight);
      lastProgress = -1;
    });
    resize.observe(element);
    void import('@/lib/gc01/scene')
      .then(({ createWatchStudio }) =>
        createWatchStudio(element, {
          signal: controller.signal,
          transparent: true,
        }),
      )
      .then((value) => {
        if (disposed) {
          value.dispose();
          return;
        }
        clearTimeout(timeout);
        local = value;
        studio.current = value;
        value.resize(element.clientWidth, element.clientHeight);
        value.setProgress(progress.current);
        value.render(0, false);
        setReady(true);
        const draw = (time: number) => {
          if (disposed) return;
          frame = requestAnimationFrame(draw);
          if (!visible || document.hidden) return;
          const changed = lastProgress !== progress.current;
          if (!changed && time - lastDraw < 32) return;
          const start = performance.now();
          value.render(time, true);
          lastProgress = progress.current;
          lastDraw = time;
          // Sustained expensive draws trigger the same-model static fallback.
          if (draws++ > 30) {
            if (performance.now() - start > 40) slowFrames++;
            else slowFrames = Math.max(0, slowFrames - 1);
            if (slowFrames >= 18) fallback();
          }
        };
        frame = requestAnimationFrame(draw);
      })
      .catch(() => {
        if (!disposed) fallback();
      });
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller.abort();
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      element.removeEventListener('webglcontextlost', contextLost);
      studio.current = null;
      local?.dispose();
    };
  }, [presentation]);

  useEffect(() => {
    studio.current?.setFinish(finish);
  }, [finish, ready]);
  useEffect(() => {
    if (presentation !== 'mobile') return;
    const next = mobileChapters[mobileChapters.indexOf(chapter) + 1];
    if (next === undefined) return;
    const img = new Image();
    img.src = `/gc01/${chapters[next].image}.webp`;
  }, [chapter, presentation]);

  function goToChapter(index: number) {
    const element = film.current;
    if (!element) return;
    const point =
      presentation === 'mobile'
        ? Math.max(0, mobileChapters.indexOf(index)) * 0.25
        : chapters[index].at;
    const top =
      element.getBoundingClientRect().top +
      window.scrollY +
      (element.offsetHeight - window.innerHeight) * (point + 0.001);
    window.scrollTo({ top, behavior: 'smooth' });
  }
  const active = chapters[chapter];
  const staticView = presentation === 'static' || presentation === 'poster';
  const poster =
    presentation === 'mobile' && chapter !== 0 && chapter !== 6
      ? active.image
      : finish === 'steel'
        ? 'hero'
        : finish;

  return (
    <main id="main-content" className="gc01" data-presentation={presentation}>
      <a className="gc-skip" href="#finishes">
        Skip the watch film
      </a>
      <h1 className="sr-only">GC—01. A Grand Central Watch design study.</h1>
      <section
        className={`gc-film ${staticView ? 'is-static' : ''} ${presentation === 'mobile' ? 'is-mobile' : ''}`}
        id="watch-sequence"
        ref={film}
        aria-label="GC—01, a study in watchmaking"
      >
        <div className="gc-stage" id="page-top">
          <header className="gc-header">
            <nav aria-label="Product sections">
              <a
                className={`gc-dot ${!inFinishes ? 'active' : ''}`}
                href="#watch-sequence"
                aria-label="The watch film"
              />
              <a
                className={`gc-dot ${inFinishes ? 'active' : ''}`}
                href="#finishes"
                aria-label="Choose a finish"
              />
            </nav>
            <Link className="gc-brand" href="/">
              GRAND CENTRAL
              <br />
              <strong>WATCH</strong>
            </Link>
            <span>
              NEW YORK
              <br />
              ATELIER STUDY NO. 01
            </span>
          </header>
          <div
            className={`gc-backdrop ${chapter > 0 && chapter < 6 ? 'is-detail' : ''}`}
            aria-hidden="true"
          >
            {staticView ? 'GC—01' : active.word}
          </div>
          <div className="gc-floor" aria-hidden="true" />
          <img
            className={`gc-poster ${ready ? 'is-hidden' : ''}`}
            src={`/gc01/${poster}.webp`}
            width="1200"
            height="1400"
            alt="GC—01 design study: a sculpted square case, charcoal dial, small seconds and articulated bracelet"
            fetchPriority="high"
          />
          {presentation === 'cinematic' && (
            <canvas
              ref={canvas}
              className={`gc-canvas ${ready ? 'is-ready' : ''}`}
              aria-label="Three-dimensional GC—01 watch assembly, controlled by scrolling"
              role="img"
            />
          )}
          <div className="gc-code">GC—01 / AUTOMATIC STUDY</div>
          <div
            className={`gc-note ${chapter > 0 ? 'is-chapter' : ''}`}
            key={staticView ? 'static' : chapter}
          >
            <span className="gc-eyebrow">
              0{staticView ? 1 : chapter + 1} /{' '}
              {staticView ? chapters[0].tag : active.tag}
            </span>
            <h2>
              {chapter === 0 || staticView ? chapters[0].title : active.title}
            </h2>
            <p>{staticView ? chapters[0].copy : active.copy}</p>
          </div>
          {!staticView && (
            <nav className="gc-chapters" aria-label="Watch film chapters">
              {(presentation === 'mobile'
                ? mobileChapters
                : chapters.map((_, i) => i)
              ).map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToChapter(index)}
                  aria-label={chapters[index].tag}
                  aria-current={chapter === index ? 'step' : undefined}
                >
                  <span />{' '}
                  <span className="gc-chapter-name">{chapters[index].tag}</span>
                </button>
              ))}
            </nav>
          )}
          <div className="gc-film-bottom">
            <a href="#finishes">
              Discover the finishes <span>↗</span>
            </a>
            <span>
              {presentation === 'cinematic' && !ready
                ? 'PREPARING THE STUDY'
                : staticView
                  ? 'THE GC—01 DESIGN STUDY'
                  : 'SCROLL TO EXPLORE'}{' '}
              <span>{presentation === 'cinematic' && !ready ? '·' : '↓'}</span>
            </span>
            <span>0{staticView ? 1 : chapter + 1} — 07</span>
          </div>
          <div className="gc-progress" aria-hidden="true">
            <span ref={progressLine} />
          </div>
        </div>
      </section>

      <section className="gc-introduction" aria-labelledby="gc-philosophy">
        <span className="gc-eyebrow">A NEW YORK POINT OF VIEW</span>
        <h2 id="gc-philosophy">
          Time, thoughtfully
          <br />
          <span>taken apart.</span>
        </h2>
        <div>
          <p>
            GC—01 is an exploration of form, proportion and the quiet
            intelligence of watchmaking. A circle within a softened square. A
            bracelet that follows the case. Nothing added without a reason.
          </p>
          <Link className="gc-text-link" href="/craft">
            Explore the watchmaker’s craft <span>↗</span>
          </Link>
        </div>
      </section>
      <section className="gc-details" aria-label="The GC—01 details">
        <article>
          <div className="gc-detail-image">
            <img
              src="/gc01/dial.webp"
              alt="GC—01 dial macro, showing faceted hands and small seconds"
              width="1200"
              height="1400"
              loading="lazy"
            />
          </div>
          <span className="gc-eyebrow">01 / THE FACE</span>
          <h3>Space to breathe.</h3>
          <p>
            A charcoal-toned dial, applied markers and a finely turned
            small-seconds register. A composition guided by restraint.
          </p>
        </article>
        <article>
          <div className="gc-detail-image">
            <img
              src="/gc01/movement.webp"
              alt="GC—01 exhibition back with modelled gears, bridges and jewel pivots"
              width="1200"
              height="1400"
              loading="lazy"
            />
          </div>
          <span className="gc-eyebrow">02 / THE INNER WORLD</span>
          <h3>Beauty beneath.</h3>
          <p>
            The exhibition back opens a second perspective: the geometry of
            gears, the span of a bridge, the rhythm of a mechanism.
          </p>
        </article>
      </section>

      <section
        id="finishes"
        className="gc-finishes"
        aria-labelledby="gc-finish-title"
      >
        <span className="gc-eyebrow">ONE FORM. FOUR EXPRESSIONS.</span>
        <h2 id="gc-finish-title">
          A matter of <em>character.</em>
        </h2>
        <p className="gc-finish-instruction">
          Choose the finish that feels like you.
        </p>
        <div className="gc-finish-display">
          <div className="gc-finish-word" aria-hidden="true">
            GC—01
          </div>
          <div
            className="gc-finish-grid"
            role="group"
            aria-label="Choose a GC—01 finish"
          >
            {finishes.map((item, index) => (
              <button
                className={`gc-finish ${finish === item.id ? 'is-selected' : ''}`}
                key={item.id}
                type="button"
                aria-pressed={finish === item.id}
                onClick={() => setFinish(item.id)}
              >
                <img
                  src={`/gc01/${item.id}.webp`}
                  alt={`GC—01 ${item.name} finish`}
                  width="1200"
                  height="1400"
                  loading="lazy"
                />
                <span className="gc-finish-label">
                  <span>0{index + 1}</span>
                  <span>{item.name}</span>
                  <i style={{ background: item.swatch }} aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="gc-selection" aria-live="polite">
          <span className="gc-eyebrow">YOUR EXPRESSION</span>
          <h3>{chosen.name}</h3>
          <p>{chosen.description}</p>
        </div>
        <button
          type="button"
          className="gc-details-toggle"
          aria-expanded={detailsOpen}
          aria-controls="gc-design-notes"
          onClick={() => setDetailsOpen(!detailsOpen)}
        >
          The design notes <span>{detailsOpen ? '−' : '+'}</span>
        </button>
        <div
          className="gc-design-notes"
          id="gc-design-notes"
          hidden={!detailsOpen}
        >
          <dl>
            <div>
              <dt>Form</dt>
              <dd>Soft square case · circular bezel</dd>
            </div>
            <div>
              <dt>Dial</dt>
              <dd>Charcoal tone · applied indices · small seconds</dd>
            </div>
            <div>
              <dt>Construction</dt>
              <dd>Crystal · dial · movement · exhibition back</dd>
            </div>
            <div>
              <dt>Bracelet</dt>
              <dd>Articulated three-part links</dd>
            </div>
          </dl>
          <p>
            An original digital design study. Finishes and mechanical details
            are illustrative; this is not a production specification or a watch
            offered for sale.
          </p>
        </div>
      </section>

      <section className="gc-invitation">
        <span className="gc-eyebrow">CONTINUE THE CONVERSATION</span>
        <h2>
          Good things
          <br />
          take <em>time.</em>
        </h2>
        <p>
          Discover the watches, the people
          <br />
          and the care behind Grand Central Watch.
        </p>
        <Link className="gc-cta" href="/visit">
          Visit the atelier <span>↗</span>
        </Link>
        <Link className="gc-text-link" href="/collection">
          Explore available timepieces <span>↗</span>
        </Link>
      </section>
      <footer className="gc-footer">
        <Link className="gc-brand" href="/">
          GRAND CENTRAL
          <br />
          <strong>WATCH</strong>
        </Link>
        <nav aria-label="Atelier navigation">
          <Link href="/our-story">Our story</Link>
          <Link href="/services">Watch care</Link>
          <Link href="/craft">The craft</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/client-care">Client care</Link>
        </nav>
        <div className="gc-footer-bottom">
          <span>GC—01 is an original digital concept, not a retail model.</span>
          <a href="#watch-sequence">Back to the beginning ↑</a>
        </div>
      </footer>
    </main>
  );
}
