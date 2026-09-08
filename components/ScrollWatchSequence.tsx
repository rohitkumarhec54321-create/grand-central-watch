'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Progress } from './ui/progress';
import { Toggle } from './ui/toggle';
import 'lenis/dist/lenis.css';
import './ScrollWatchSequence.css';

export type WatchChapter = { frame: number; label: string; title: string; description: string };
/** Zero-based thresholds match the supplied 26.12-second Longines reel. */
export const WATCH_CHAPTERS: readonly WatchChapter[] = [
  { frame: 0, label: 'Orbit Open', title: 'A different perspective.', description: 'Follow the contours. Discover every angle.' },
  { frame: 30, label: 'Crystal Lift', title: 'Beauty, layer by layer.', description: 'Crystal and case separate to reveal what lies beneath.' },
  { frame: 44, label: 'Axis Rebuild', title: 'Every part has its place.', description: 'Explore the layers aligned along a single axis.' },
  { frame: 61, label: 'Macro Seal', title: 'The detail is everything.', description: 'Trace the bezel, crown, and signature case details.' },
  { frame: 84, label: 'Inspect', title: 'A signature in steel.', description: 'Turn the timepiece over. Read the story on its caseback.' },
  { frame: 108, label: 'Reassemble', title: 'Whole again. Light within.', description: 'The complete timepiece returns for its luminous finale.' },
];

export type ScrollWatchSequenceProps = {
  id?: string;
  framePath?: string;
  mobileFramePath?: string;
  poster?: string;
  totalFrames?: number;
  chapters?: readonly WatchChapter[];
  /** Scroll distance in viewport heights, excluding the sticky viewport. */
  scrollScreens?: number;
  /** Pass an existing page Lenis instance, or disable ownership with smoothScroll=false. */
  lenisInstance?: Lenis;
  smoothScroll?: boolean;
  forceStatic?: boolean;
  showPageProgress?: boolean;
  audioSrc?: string;
  className?: string;
};

type CachedFrame = ImageBitmap | HTMLImageElement;
type Mode = 'loading' | 'ready' | 'static';
const release = (frame: CachedFrame) => { if ('close' in frame) frame.close(); };
export const frameForProgress = (progress: number, count: number) => Math.round(Math.max(0, Math.min(1, progress)) * (count - 1));
export const chapterForFrame = (frame: number, chapters: readonly WatchChapter[]) => Math.max(0, chapters.findLastIndex((chapter) => frame >= chapter.frame));

export default function ScrollWatchSequence({
  id = 'watch-sequence', framePath = '/watch-sequence/frames',
  mobileFramePath = '/watch-sequence/mobile', poster = '/watch-sequence/poster.webp',
  totalFrames = 131, chapters = WATCH_CHAPTERS, scrollScreens = 5.5,
  lenisInstance, smoothScroll = true, forceStatic = false, showPageProgress = true,
  audioSrc = '/watch-sequence/ticking.wav', className = '',
}: ScrollWatchSequenceProps) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const pageDot = useRef<HTMLDivElement>(null);
  const jump = useRef<(index: number) => void>(() => {});
  const audio = useRef<HTMLAudioElement>(null);
  const [mode, setMode] = useState<Mode>('loading');
  const [loaded, setLoaded] = useState(0);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [sound, setSound] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const titleId = useId();
  const safeCount = Math.max(2, Math.floor(totalFrames));

  useEffect(() => {
    const root = section.current, viewport = stage.current, surface = canvas.current;
    if (!root || !viewport || !surface) return;
    gsap.registerPlugin(ScrollTrigger);
    setMounted(true);
    setLoaded(0);
    setMode('loading');
    setActive(0);
    const abort = new AbortController();
    const images: CachedFrame[] = [];
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const constrained = (device.deviceMemory ?? 8) <= 2 || device.connection?.saveData;
    let disposed = false, isStatic = false, ready = false, loading = false;
    let target = 0, drawn = -1, pendingDraw = 0, lenisRaf = 0, refreshRaf = 0;
    let draws = 0, slowDraws = 0, currentChapter = 0;
    let ownedLenis: Lenis | undefined;
    let trigger: ScrollTrigger | undefined;
    let visible = false;
    const context = surface.getContext('2d', { alpha: false });
    const mobile = matchMedia('(max-width: 767px)').matches;
    const directory = mobile ? mobileFramePath : framePath;
    const decodeSize = mobile ? 480 : 720;

    const free = () => { images.forEach(release); images.length = 0; };
    const refresh = () => {
      cancelAnimationFrame(refreshRaf);
      refreshRaf = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh(); });
    };
    const fallback = () => {
      if (disposed || isStatic) return;
      isStatic = true; ready = false; abort.abort();
      cancelAnimationFrame(pendingDraw); pendingDraw = 0;
      cancelAnimationFrame(lenisRaf); ownedLenis?.destroy(); ownedLenis = undefined;
      trigger?.kill(); free(); setMode('static'); setActive(0); refresh();
    };
    const updateLabels = () => {
      const next = chapterForFrame(target, chapters);
      if (next !== currentChapter) { currentChapter = next; setActive(next); }
      if (counter.current) counter.current.textContent = `${String(target + 1).padStart(3, '0')} / ${safeCount}`;
    };
    const draw = () => {
      pendingDraw = 0;
      if (!ready || disposed || isStatic || drawn === target || !context) return;
      const image = images[target];
      if (!image) return;
      const start = performance.now();
      const width = image instanceof HTMLImageElement ? image.naturalWidth : image.width;
      const height = image instanceof HTMLImageElement ? image.naturalHeight : image.height;
      const scale = Math.max(surface.width / width, surface.height / height);
      try {
        context.drawImage(image, (surface.width - width * scale) / 2, (surface.height - height * scale) / 2, width * scale, height * scale);
        drawn = target; surface.dataset.frame = String(target);
        updateLabels();
        if (performance.now() - start > 24) slowDraws++;
        if (++draws >= 24) {
          if (slowDraws >= 8) { fallback(); return; }
          draws = 0; slowDraws = 0;
        }
      } catch { fallback(); }
    };
    const requestDraw = () => { if (!pendingDraw && ready && drawn !== target) pendingDraw = requestAnimationFrame(draw); };
    const resize = () => {
      const box = surface.getBoundingClientRect();
      const pixelRatio = Math.min(devicePixelRatio || 1, 1.5, 1600 / Math.max(box.width, box.height));
      surface.width = Math.max(1, Math.round(box.width * pixelRatio));
      surface.height = Math.max(1, Math.round(box.height * pixelRatio));
      drawn = -1; requestDraw();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(surface);
    resize();
    const pageTrigger = showPageProgress ? ScrollTrigger.create({
      start: 0, end: 'max', onUpdate: (self) => {
        if (pageDot.current) pageDot.current.style.top = `${20 + self.progress * (innerHeight - 40)}px`;
      },
    }) : undefined;

    const decode = async (index: number) => {
      const response = await fetch(`${directory}/frame_${String(index + 1).padStart(4, '0')}.webp`, { signal: abort.signal });
      if (!response.ok) throw new Error(`Frame ${index} unavailable`);
      const blob = await response.blob();
      let image: CachedFrame;
      if (typeof createImageBitmap === 'function') {
        image = await createImageBitmap(blob, { resizeWidth: decodeSize, resizeQuality: 'high' });
      } else {
        const url = URL.createObjectURL(blob);
        const img = new Image(); img.src = url;
        try { await img.decode(); image = img; } finally { URL.revokeObjectURL(url); }
      }
      if (disposed || isStatic) release(image); else images[index] = image;
    };
    const load = async () => {
      if (loading || isStatic || disposed) return;
      loading = true;
      try {
        // Six requests at a time, started only within one viewport of the section.
        // Every frame is decoded before scrubbing is enabled, so fast jumps never hit gaps.
        for (let offset = 0; offset < safeCount; offset += 6) {
          if (disposed || isStatic) return;
          await Promise.all(Array.from({ length: Math.min(6, safeCount - offset) }, (_, i) => decode(offset + i)));
          if (disposed || isStatic) return;
          setLoaded(Math.min(safeCount, offset + 6));
        }
        ready = true; setMode('ready'); requestDraw();
      } catch { if (!disposed) fallback(); }
    };

    if (forceStatic || motion.matches || constrained || !context || !chapters.length) fallback();
    else {
      if (smoothScroll && !lenisInstance) {
        ownedLenis = new Lenis({ lerp: 0.12, smoothWheel: true, autoRaf: false });
        const tick = (time: number) => {
          ownedLenis?.raf(time);
          if (!disposed && !isStatic) lenisRaf = requestAnimationFrame(tick);
        };
        lenisRaf = requestAnimationFrame(tick);
      }
      const scroll = lenisInstance ?? ownedLenis;
      scroll?.on('scroll', ScrollTrigger.update);
      trigger = ScrollTrigger.create({
        trigger: root, start: 'top top', end: () => `+=${Math.max(1, root.offsetHeight - viewport.offsetHeight)}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // No scrub tween or easing: the only mapping is progress → integer frame.
          target = frameForProgress(self.progress, safeCount);
          if (rail.current) rail.current.style.transform = `scaleY(${self.progress})`;
          requestDraw();
        },
      });
      target = frameForProgress(trigger.progress, safeCount);
      jump.current = (index) => {
        if (!ready || !trigger || !chapters[index]) return;
        const y = trigger.start + (trigger.end - trigger.start) * chapters[index].frame / (safeCount - 1);
        if (scroll) scroll.scrollTo(y, { immediate: true });
        else window.scrollTo({ top: y, behavior: 'instant' });
        ScrollTrigger.update();
      };
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) void load();
    }, { rootMargin: '100% 0px' });
    observer.observe(root);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { audio.current?.pause(); setSound(false); }
    });
    visibilityObserver.observe(viewport);
    const hideAudio = () => { if (document.hidden || !visible) { audio.current?.pause(); setSound(false); } };
    document.addEventListener('visibilitychange', hideAudio);
    const onMotionChange = () => { if (motion.matches) fallback(); };
    motion.addEventListener('change', onMotionChange);
    refresh();
    return () => {
      disposed = true; abort.abort();
      cancelAnimationFrame(pendingDraw); cancelAnimationFrame(lenisRaf); cancelAnimationFrame(refreshRaf);
      observer.disconnect(); visibilityObserver.disconnect(); resizeObserver.disconnect();
      motion.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', hideAudio);
      (lenisInstance ?? ownedLenis)?.off('scroll', ScrollTrigger.update);
      ownedLenis?.destroy(); trigger?.kill(); pageTrigger?.kill(); free();
      jump.current = () => {};
    };
  }, [framePath, mobileFramePath, safeCount, chapters, smoothScroll, lenisInstance, forceStatic, showPageProgress, scrollScreens]);

  useEffect(() => { const raf = requestAnimationFrame(() => ScrollTrigger.refresh()); return () => cancelAnimationFrame(raf); }, [mode]);

  const toggleSound = async (pressed: boolean) => {
    const player = audio.current;
    if (!player) return;
    if (!pressed) { player.pause(); setSound(false); return; }
    player.volume = 0.18;
    try { await player.play(); setSound(true); } catch { setSound(false); setAudioError(true); }
  };
  const jumpTo = (index: number) => jump.current(index);
  const current = chapters[active] ?? WATCH_CHAPTERS[0];
  return (
    <>
      <section ref={section} id={id} className={`watch-sequence ${className}`} data-mode={mode} aria-labelledby={titleId} style={{ '--scroll-screens': scrollScreens + 1 } as CSSProperties}>
        <div ref={stage} className="watch-stage">
          <div className="watch-stage-rule"><span>GRAND CENTRAL WATCH</span><span>AN INTERACTIVE STUDY</span></div>
          <img className="watch-poster" src={poster} alt="Longines Pilot Majetek watch with a black dial, polished steel case, and brown leather strap" loading="lazy" decoding="async" />
          <canvas ref={canvas} className="watch-canvas" aria-hidden="true" />
          <div className="watch-shade" />
          <header className="watch-heading">
            <p className="technical-label">SCROLL-CONTROLLED CARBON-LUME ASSEMBLY</p>
            <h2 id={titleId}><span className="watch-word">Unfold.</span>{' '}<span className="watch-word">Inspect.</span>{' '}<em className="watch-word">Reassemble.</em>{' '}<span className="watch-word">Seal.</span></h2>
            <p className="watch-intro">The beauty of precision,<br />revealed at your pace.</p>
          </header>
          <div className="watch-edition technical-label"><span>THE ANATOMY OF TIME</span><span>LONGINES · PILOT MAJETEK</span></div>
          <div className="watch-captions" aria-live="polite" aria-atomic="true">
            {chapters.map((chapter, index) => <div key={chapter.label} className="watch-caption" data-active={active === index} aria-hidden={active !== index}>
              <span className="technical-label">1.{index} / {chapter.label.toUpperCase()}</span>
              <h3>{chapter.title}</h3><p>{chapter.description}</p>
            </div>)}
          </div>
          {mode !== 'static' && <nav className="watch-tracker" aria-label="Assembly chapters"><span className="tracker-label technical-label">THE SEQUENCE</span><div className="watch-steps"><div className="step-line"><div ref={rail} /></div>{chapters.map((chapter, index) => <button key={chapter.label} type="button" className="watch-step" data-active={active === index} data-passed={active >= index} aria-current={active === index ? 'step' : undefined} disabled={mode !== 'ready'} onClick={() => jumpTo(index)}><span className="step-marker" /><span className="step-number">0{index + 1}</span><span>{chapter.label}</span></button>)}</div><span ref={counter} className="watch-counter technical-label">001 / {safeCount}</span></nav>}
          {mode === 'loading' && <div className="watch-loading" role="status"><span className="technical-label">PREPARING THE MOVEMENT</span><Progress aria-label="Loading watch frames" value={loaded / safeCount * 100} className="watch-load-progress" /><span className="technical-label">{Math.round(loaded / safeCount * 100)}%</span></div>}
          <div className="watch-bottom">
            <a href={`#${id}-end`} className="watch-scroll-cue technical-label">{mode === 'static' ? 'CONTINUE EXPLORING' : 'SCROLL TO EXPLORE'}<span>↓</span></a>
            {mode !== 'static' && <nav className="watch-tabs" aria-label="Jump to a chapter">{chapters.map((chapter, index) => <button key={chapter.label} type="button" className="watch-tab" data-active={active === index} disabled={mode !== 'ready'} aria-label={`Chapter ${index + 1}: ${chapter.label}`} aria-current={active === index ? 'step' : undefined} onClick={() => jumpTo(index)}><span>0{index + 1}</span><span className="tab-title">{chapter.label}</span></button>)}</nav>}
            {mode === 'static' && <span className="static-label technical-label">STILL VIEW</span>}
            <div className="watch-audio"><Toggle className="watch-sound" pressed={sound} onPressedChange={(value) => void toggleSound(value)} disabled={audioError} aria-label={sound ? 'Mute mechanical ticking' : 'Play mechanical ticking'}><span className="sound-bars" aria-hidden="true"><i /><i /><i /><i /></span>{audioError ? 'SOUND UNAVAILABLE' : sound ? 'SOUND ON' : 'SOUND OFF'}</Toggle><audio ref={audio} src={audioSrc} preload="none" loop onError={() => { setAudioError(true); setSound(false); }} /></div>
          </div>
          <span className="sr-only">{mode === 'static' ? 'Static image view. Animation is disabled for accessibility, data saving, or device performance.' : `Scroll to explore. Current chapter: ${current.label}.`}</span>
        </div>
      </section>
      <div id={`${id}-end`} />
      {mounted && showPageProgress && createPortal(<div className="watch-page-rail" aria-hidden="true"><div ref={pageDot} className="watch-page-dot" /></div>, document.body)}
    </>
  );
}
