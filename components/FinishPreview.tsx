'use client';
import { useEffect, useRef, useState } from 'react';
import type { Finish } from '@/lib/gc01/config';
import { assetPath } from '@/lib/paths';
type Studio = Awaited<ReturnType<typeof import('@/lib/gc01/scene').createWatchStudio>>;
export default function FinishPreview({ finish }: { finish: Finish }) {
  const canvas = useRef<HTMLCanvasElement>(null), studio = useRef<Studio | null>(null), selected = useRef(finish);
  const [ready, setReady] = useState(false);
  selected.current = finish;
  useEffect(() => { studio.current?.setFinish(finish); }, [finish]);
  useEffect(() => {
    const el = canvas.current!;
    let disposed = false, visible = false, started = false, raf = 0, last = 0;
    const abort = new AbortController();
    const media = matchMedia('(prefers-reduced-motion: reduce), (max-width: 899px)');
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (media.matches || saveData || navigator.hardwareConcurrency <= 2) return;
    const observer = new IntersectionObserver(async ([entry]) => {
      visible = entry.isIntersecting;
      if (!visible || started) return;
      started = true;
      try {
        const { createWatchStudio } = await import('@/lib/gc01/scene');
        if (disposed) return;
        const value = await createWatchStudio(el, { signal: abort.signal, transparent: true, pixelRatio: 1 });
        if (disposed) { value.dispose(); return; }
        studio.current = value;
        value.resize(el.clientWidth, el.clientHeight);
        value.setProgress(0); value.setFinish(selected.current, false); value.render(0, false); setReady(true);
        const draw = (time: number) => {
          raf = requestAnimationFrame(draw);
          if (!visible || document.hidden || time - last < 32) return;
          last = time; value.render(time, false);
        };
        raf = requestAnimationFrame(draw);
      } catch { /* Same-model stills below remain usable when WebGL is unavailable. */ }
    }, { rootMargin: '100px' });
    observer.observe(el);
    const resize = new ResizeObserver(() => studio.current?.resize(el.clientWidth, el.clientHeight));
    resize.observe(el);
    const changed = () => { if (media.matches) { cancelAnimationFrame(raf); studio.current?.dispose(); studio.current = null; setReady(false); } };
    const lost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(raf); setReady(false); };
    media.addEventListener('change', changed); el.addEventListener('webglcontextlost', lost);
    return () => { disposed = true; abort.abort(); cancelAnimationFrame(raf); observer.disconnect(); resize.disconnect(); media.removeEventListener('change', changed); el.removeEventListener('webglcontextlost', lost); studio.current?.dispose(); studio.current = null; };
  }, []);
  return <div className="finish-preview" aria-label="Selected GC—01 finish preview">
    {(['steel','noir','gold','two-tone'] as Finish[]).map(item => <img key={item} src={assetPath(`/gc01/${item === 'steel' ? 'hero' : item}.webp`)} alt={item === finish ? `GC—01 concept in ${finish} finish` : ''} aria-hidden={item !== finish || ready} className={item === finish && !ready ? 'is-active' : ''} loading="lazy" width="1200" height="1400"/>)}
    <canvas ref={canvas} className={ready ? 'is-active' : ''} role="img" aria-label={`GC—01 concept in ${finish} finish`}/>
  </div>;
}
