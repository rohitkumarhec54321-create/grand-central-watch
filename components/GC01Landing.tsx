'use client';
import { assetPath } from '@/lib/paths';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteHeader from './SiteHeader';
import WatchDetails from './WatchDetails';
import KineticHeading from './KineticHeading';
import ShopSection from './ShopSection';
import HeritageService from './HeritageService';
import FinishPreview from './FinishPreview';
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
  const chapterLine = useRef<HTMLSpanElement>(null);
  const progressLine = useRef<HTMLSpanElement>(null);
  const progress = useRef(0);
  const currentChapter = useRef(0);
  const [presentation, setPresentation] = useState<Presentation>('poster');
  const [ready, setReady] = useState(false);
  const [idleMotion, setIdleMotion] = useState(true);
  const idle = useRef(true);
  const [chapter, setChapter] = useState(0);
  const [finish, setFinish] = useState<Finish>('steel');
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
      const start = presentation === 'mobile' ? mobileChapters.indexOf(next) / 4 : chapters[next].at;
      const end = presentation === 'mobile' ? start + .25 : (chapters[next + 1]?.at ?? 1);
      if (chapterLine.current) chapterLine.current.style.transform = `scaleX(${Math.min(1, Math.max(0, (value - start) / (end - start)))})`;
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
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      trigger?.kill();
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
          value.render(time, idle.current);
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
    img.src = assetPath(`/gc01/${chapters[next].image}.webp`);
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
          <SiteHeader compact />
          {presentation === 'cinematic' && ready && (
            <button
              className="gc-motion-control"
              type="button"
              aria-pressed={!idleMotion}
              onClick={() => {
                idle.current = !idleMotion;
                setIdleMotion(!idleMotion);
              }}
            >
              {idleMotion ? 'Pause idle motion' : 'Resume idle motion'}
            </button>
          )}
          <div
            className={`gc-backdrop ${chapter > 0 && chapter < 6 ? 'is-detail' : ''}`}
            aria-hidden="true"
          >
            {staticView ? 'GC—01' : active.word}
          </div>
          <div className="gc-floor" aria-hidden="true" />
          <img
            className={`gc-poster ${ready ? 'is-hidden' : ''}`}
            src={assetPath(`/gc01/${poster}.webp`)}
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
            <span className="gc-chapter-counter">0{staticView ? 1 : chapter + 1} — 07<span className="gc-chapter-progress" aria-hidden="true"><span ref={chapterLine}/></span></span>
          </div>
          <div className="gc-progress" aria-hidden="true">
            <span ref={progressLine} />
          </div>
        </div>
      </section>

      <nav className="gc-section-links" aria-label="Explore this page">
        <a href="#finishes">Finishes</a>
        <a href="#collected-studies">Selected images</a>
        <a href="#shop">Shop</a>
        <a href="#heritage">Heritage</a>
        <Link href="/services">Watch care ↗</Link>
        <Link href="/visit">Visit the atelier ↗</Link>
      </nav>
      <section className="gc-introduction" aria-labelledby="gc-philosophy">
        <span className="gc-eyebrow">A NEW YORK POINT OF VIEW</span>
        <KineticHeading id="gc-philosophy" text={'Time, thoughtfully\ntaken apart.'} className="kinetic-compact"/>
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
      <section
        id="finishes"
        className="gc-finishes"
        aria-labelledby="gc-finish-title"
      >
        <span className="gc-eyebrow">ONE FORM. FOUR EXPRESSIONS.</span>
        <KineticHeading id="gc-finish-title" text="A matter of character." className="kinetic-compact"/>
        <p className="gc-finish-instruction">
          Choose a finish. Watch the material change in the light.
        </p>
        <div className="gc-finish-display">
          <div className="gc-finish-word" aria-hidden="true">
            GC—01
          </div>
          <FinishPreview finish={finish} />
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
                aria-label={`GC—01 ${item.name} finish`}
                onClick={(event) => {
                  setFinish(item.id);
                  if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
                    gsap.fromTo(event.currentTarget.querySelector('.gc-finish-swatch'), { scale: .78 }, { scale: 1, duration: .7, ease: 'elastic.out(1,.35)', overwrite: true });
                }}
              >
                <span
                  className="gc-finish-swatch"
                  style={{ background: item.swatch }}
                  aria-hidden="true"
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
          <a className="gc-text-link" href="#watch-sequence">
            View this finish in the film ↑
          </a>
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

      <div id="collected-studies">
        <WatchDetails />
      </div>
      <ShopSection />
      <HeritageService />
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
          <span>Unaffiliated portfolio concept. GC—01 is a digital study, not a retail model.</span>
          <a href="#watch-sequence">Back to the beginning ↑</a>
        </div>
      </footer>
    </main>
  );
}
