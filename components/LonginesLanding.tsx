'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LonginesLanding.css';

const COUNT = 131;
const HERO = '/watch-gallery/longines-perspective.webp';
const chapters = [
  {
    at: 0,
    label: 'THE COMPLETE WATCH',
    title: 'The art of\nproportion.',
    copy: 'A black dial. A fluted steel bezel.\nThe warmth of stitched brown leather.',
    word: 'LONGINES',
  },
  {
    at: 0.12 + (30 / 130) * 0.88,
    label: 'CRYSTAL & CASE',
    title: 'Beauty,\nlayer by layer.',
    copy: 'The crystal lifts. The case opens.\nA different perspective on familiar details.',
    word: 'UNFOLD',
  },
  {
    at: 0.12 + (44 / 130) * 0.88,
    label: 'THE ASSEMBLY',
    title: 'Every layer.\nConsidered.',
    copy: 'Follow the separated elements along their axis, from the crystal to the case.',
    word: 'INSPECT',
  },
  {
    at: 0.12 + (61 / 130) * 0.88,
    label: 'CROWN & CONTOUR',
    title: 'Character\nin the details.',
    copy: 'Light traces the fluted bezel, the crown and the polished contours of the case.',
    word: 'CONTOUR',
  },
  {
    at: 0.12 + (84 / 130) * 0.88,
    label: 'THE REVERSE SIDE',
    title: 'Another side\nto the story.',
    copy: 'Turn the watch over. Discover the caseback, the buckle and the curve of the leather.',
    word: 'SIGNATURE',
  },
  {
    at: 0.12 + (108 / 130) * 0.88,
    label: 'THE FINAL REVEAL',
    title: 'A different\nkind of light.',
    copy: 'The complete watch returns.\nThe luminous dial emerges from the dark.',
    word: 'AFTERLIGHT',
  },
] as const;
type Frame = ImageBitmap | HTMLImageElement;
const release = (frame: Frame) => {
  if ('close' in frame) frame.close();
};

export default function LonginesLanding() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const jump = useRef<(p: number) => void>(() => {});
  const [mode, setMode] = useState<'loading' | 'ready' | 'static'>('loading');
  const [loaded, setLoaded] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [view, setView] = useState(0);
  const perspectives = [
    {
      label: 'Three-quarter',
      src: HERO,
      text: 'Steel, leather and a sculpted silhouette.',
      size: [1402, 1122],
    },
    {
      label: 'The dial',
      src: '/watch-gallery/longines-front.webp',
      text: 'Cream-toned numerals. Small seconds. A clear point of view.',
      size: [1122, 1402],
    },
    {
      label: 'The caseback',
      src: '/watch-sequence/frames/frame_0090.webp',
      text: 'The reverse side, captured in the supplied render film.',
      size: [720, 720],
    },
  ];

  useEffect(() => {
    const root = section.current!,
      viewport = stage.current!,
      surface = canvas.current!;
    gsap.registerPlugin(ScrollTrigger);
    const context = surface.getContext('2d', { alpha: false });
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width: 899px)').matches;
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const lightweight = compact || (device.deviceMemory ?? 8) <= 4;
    const directory = lightweight
      ? '/watch-sequence/mobile'
      : '/watch-sequence/frames';
    const decodeWidth = lightweight ? 480 : 720;
    const frames: Frame[] = [];
    const abort = new AbortController();
    let disposed = false,
      staticMode = false,
      ready = false,
      started = false;
    let progress = 0,
      target = 0,
      drawn = -1,
      pending = 0,
      active = 0,
      draws = 0,
      slow = 0;
    let trigger: ScrollTrigger | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let refreshRaf = 0;
    const refresh = () => {
      cancelAnimationFrame(refreshRaf);
      refreshRaf = requestAnimationFrame(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
    };
    const fallback = () => {
      if (disposed || staticMode) return;
      staticMode = true;
      ready = false;
      abort.abort();
      clearTimeout(timeout);
      cancelAnimationFrame(pending);
      trigger?.kill();
      frames.forEach(release);
      frames.length = 0;
      viewport.style.setProperty('--film-opacity', '0');
      viewport.style.setProperty('--photo-opacity', '1');
      viewport.style.setProperty('--photo-scale', '1');
      setMode('static');
      setChapter(0);
      refresh();
    };
    const draw = () => {
      pending = 0;
      if (!ready || disposed || staticMode || !context) return;
      const crossfade = Math.max(0, Math.min(1, (progress - 0.065) / 0.055));
      viewport.style.setProperty('--film-opacity', String(crossfade));
      viewport.style.setProperty('--photo-opacity', String(1 - crossfade));
      viewport.style.setProperty(
        '--photo-scale',
        String(1 + Math.min(progress, 0.12) * 0.5),
      );
      viewport.style.setProperty('--line-progress', String(progress));
      if (drawn === target) return;
      const frame = frames[target];
      if (!frame) return;
      const start = performance.now();
      try {
        context.drawImage(frame, 0, 0, surface.width, surface.height);
        drawn = target;
        surface.dataset.frame = String(target);
        if (performance.now() - start > 24) slow++;
        if (++draws >= 24) {
          if (slow >= 8) {
            fallback();
            return;
          }
          draws = 0;
          slow = 0;
        }
      } catch {
        fallback();
      }
    };
    const schedule = () => {
      if (!pending && ready) pending = requestAnimationFrame(draw);
    };
    const resize = () => {
      const width = Math.max(
        1,
        Math.round(
          Math.min(
            surface.clientWidth * Math.min(devicePixelRatio || 1, 1.5),
            decodeWidth,
          ),
        ),
      );
      surface.width = width;
      surface.height = width;
      drawn = -1;
      schedule();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(surface);
    resize();
    const update = (value: number) => {
      progress = value;
      target = Math.round(
        Math.max(0, Math.min(1, (value - 0.12) / 0.88)) * (COUNT - 1),
      );
      const next = Math.max(
        0,
        chapters.findLastIndex((item) => value >= item.at - 0.00001),
      );
      if (next !== active) {
        active = next;
        setChapter(next);
      }
      schedule();
    };
    const decode = async (index: number) => {
      const response = await fetch(
        `${directory}/frame_${String(index + 1).padStart(4, '0')}.webp`,
        { signal: abort.signal },
      );
      if (!response.ok) throw new Error('Frame unavailable');
      const blob = await response.blob();
      let frame: Frame;
      if (typeof createImageBitmap === 'function')
        frame = await createImageBitmap(blob, {
          resizeWidth: decodeWidth,
          resizeQuality: 'high',
        });
      else {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        try {
          await img.decode();
          frame = img;
        } finally {
          URL.revokeObjectURL(url);
        }
      }
      if (disposed || staticMode) release(frame);
      else frames[index] = frame;
    };
    const load = async () => {
      if (started || staticMode || disposed) return;
      started = true;
      timeout = setTimeout(fallback, 30000);
      try {
        for (let offset = 0; offset < COUNT; offset += 4) {
          if (disposed || staticMode) return;
          await Promise.all(
            Array.from({ length: Math.min(4, COUNT - offset) }, (_, i) =>
              decode(offset + i),
            ),
          );
          if (disposed || staticMode) return;
          setLoaded(Math.min(COUNT, offset + 4));
        }
        clearTimeout(timeout);
        ready = true;
        setMode('ready');
        // CSS expands the scroll track only after the complete sequence is cached.
        refreshRaf = requestAnimationFrame(() => {
          if (disposed || staticMode) return;
          trigger = ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            invalidateOnRefresh: true,
            onUpdate: (self) => update(self.progress),
            onRefresh: (self) => update(self.progress),
          });
          jump.current = (p) => {
            if (trigger)
              window.scrollTo({
                top: trigger.start + (trigger.end - trigger.start) * p,
                behavior: 'instant',
              });
          };
          ScrollTrigger.refresh();
          update(trigger.progress);
          schedule();
          if (location.hash === '#perspectives')
            document.getElementById('perspectives')?.scrollIntoView();
        });
      } catch {
        if (!disposed) fallback();
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void load();
      },
      { rootMargin: '100% 0px' },
    );
    const onMotionChange = () => {
      if (reduce.matches) fallback();
    };
    reduce.addEventListener('change', onMotionChange);
    if (
      reduce.matches ||
      device.connection?.saveData ||
      (device.deviceMemory ?? 8) <= 2 ||
      !context
    )
      fallback();
    else observer.observe(root);
    return () => {
      disposed = true;
      abort.abort();
      clearTimeout(timeout);
      cancelAnimationFrame(pending);
      cancelAnimationFrame(refreshRaf);
      observer.disconnect();
      resizeObserver.disconnect();
      reduce.removeEventListener('change', onMotionChange);
      trigger?.kill();
      jump.current = () => {};
      frames.forEach(release);
    };
  }, []);

  const active = chapters[chapter];
  return (
    <main className="longines" id="main-content" data-mode={mode}>
      <a className="lw-skip" href="#perspectives">
        Skip the watch film
      </a>
      <h1 className="sr-only">Longines. A study in steel and leather.</h1>
      <section
        id="watch-sequence"
        className={`lw-film ${mode === 'ready' ? 'is-ready' : ''}`}
        ref={section}
        aria-label="Scroll-controlled Longines watch film"
      >
        <div className="lw-stage" ref={stage} id="page-top">
          <header className="lw-header">
            <nav aria-label="Page sections">
              <a
                className="lw-dot active"
                href="#watch-sequence"
                aria-label="The watch film"
              />
              <a
                className="lw-dot"
                href="#perspectives"
                aria-label="Explore the details"
              />
            </nav>
            <Link className="lw-brand" href="/">
              GRAND CENTRAL
              <br />
              <strong>WATCH</strong>
            </Link>
            <span>
              NEW YORK
              <br />
              THE COLLECTED STUDIES
            </span>
          </header>
          <div
            className={`lw-word ${chapter ? 'is-detail' : ''}`}
            aria-hidden="true"
          >
            {active.word}
          </div>
          <div className="lw-image-stage">
            <img
              className="lw-hero"
              src={HERO}
              width={1402}
              height={1122}
              alt="Longines watch with black dial, fluted steel bezel and stitched brown leather strap, from your supplied reference"
              fetchPriority="high"
            />
            <canvas
              ref={canvas}
              className="lw-canvas"
              role="img"
              aria-label="Longines rotation, crystal and case separation, crown details, caseback and luminous reveal"
            />
          </div>
          <span className="lw-side-label">LONGINES / STEEL & LEATHER</span>
          <div className="lw-note" key={chapter}>
            <span className="lw-eyebrow">
              0{chapter + 1} / {active.label}
            </span>
            <h2>{active.title}</h2>
            <p>{active.copy}</p>
          </div>
          {mode === 'ready' && (
            <nav className="lw-chapters" aria-label="Film chapters">
              {chapters.map((item, i) => (
                <button
                  type="button"
                  key={item.label}
                  aria-label={item.label}
                  aria-current={chapter === i ? 'step' : undefined}
                  onClick={() => jump.current(item.at)}
                >
                  <span />
                  <span className="lw-tooltip">{item.label}</span>
                </button>
              ))}
            </nav>
          )}
          <div className="lw-bottom">
            <a href="#perspectives">
              Explore the details <span>↗</span>
            </a>
            <span role="status">
              {mode === 'loading'
                ? `PREPARING THE FILM · ${Math.round((loaded / COUNT) * 100)}%`
                : mode === 'ready'
                  ? 'SCROLL TO UNFOLD ↓'
                  : 'A STUDY IN STEEL & LEATHER'}
            </span>
            <span>0{chapter + 1} — 06</span>
          </div>
          <div className="lw-progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>
      <section className="lw-intro">
        <span className="lw-eyebrow">A CLOSER APPRECIATION</span>
        <h2>
          Steel. Leather.
          <br />
          <em>Character.</em>
        </h2>
        <div>
          <p>
            The contrast is the story: polished steel against textured leather,
            cream-toned numerals against a deep black dial. A watch that rewards
            a closer look.
          </p>
          <Link className="lw-link" href="/craft">
            Explore the complete studies <span>↗</span>
          </Link>
        </div>
      </section>
      <section
        className="lw-perspectives"
        id="perspectives"
        aria-labelledby="lw-perspectives-title"
      >
        <div className="lw-perspective-copy">
          <span className="lw-eyebrow">THREE PERSPECTIVES. ONE TIMEPIECE.</span>
          <h2 id="lw-perspectives-title">
            In the
            <br />
            <em>details.</em>
          </h2>
          <div
            className="lw-view-buttons"
            role="group"
            aria-label="Watch perspectives"
          >
            {perspectives.map((item, i) => (
              <button
                type="button"
                key={item.label}
                aria-pressed={view === i}
                onClick={() => setView(i)}
              >
                <span>0{i + 1}</span>
                {item.label}
                <span>↗</span>
              </button>
            ))}
          </div>
          <p aria-live="polite">{perspectives[view].text}</p>
        </div>
        <div className="lw-perspective-image">
          <img
            key={view}
            src={perspectives[view].src}
            alt={`Longines — ${perspectives[view].label}`}
            width={perspectives[view].size[0]}
            height={perspectives[view].size[1]}
            loading="lazy"
          />
        </div>
      </section>
      <section className="lw-invitation">
        <span className="lw-eyebrow">CONTINUE THE CONVERSATION</span>
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
        <Link className="lw-cta" href="/visit">
          Visit the atelier <span>↗</span>
        </Link>
        <Link className="lw-link" href="/collection">
          Explore available timepieces <span>↗</span>
        </Link>
      </section>
      <footer className="lw-footer">
        <Link className="lw-brand" href="/">
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
        <div>
          <span>
            Longines visual study · Supplied imagery and render footage.
          </span>
          <a href="#watch-sequence">Back to the beginning ↑</a>
        </div>
      </footer>
    </main>
  );
}
