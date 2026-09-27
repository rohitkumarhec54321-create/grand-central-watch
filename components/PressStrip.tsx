'use client';
import { useEffect, useRef, useState } from 'react';
import { press, OFFICIAL } from '@/lib/site-content';
export default function PressStrip() {
  const root = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null);
  const speed = useRef(1), [paused, setPaused] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, last = 0, offset = 0, current = 1, visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(root.current!);
    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      const delta = Math.min((time - last) / 1000, .05); last = time;
      if (media.matches || paused || !visible || document.hidden) return;
      current += (speed.current - current) * .04;
      const width = track.current!.scrollWidth / 2;
      if (width) { offset = (offset + delta * 30 * current + width) % width; track.current!.style.transform = `translateX(${-offset}px)`; }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, [paused]);
  return <div className="press-cinema" ref={root} onPointerMove={event => {
    const r = event.currentTarget.getBoundingClientRect(); speed.current = .3 + ((event.clientX - r.left) / r.width) * 1.8;
  }} onPointerLeave={() => { speed.current = 1; }}>
    <div className="press-caption"><span className="atelier-label">FEATURED IN · GRAND CENTRAL WATCH IN THE PRESS</span><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Resume press motion' : 'Pause press motion'}</button></div>
    <div className="press-window"><div className="press-track" ref={track}>{[0, 1].map(copy => <div className="press-copy" key={copy} aria-hidden={copy === 1 ? true : undefined}>{press.map(name => <span key={name}>{name}</span>)}</div>)}</div></div>
    <a className="editorial-link" href={`${OFFICIAL}/press-articles`}>Read the press archive <span>↗</span></a>
  </div>;
}
