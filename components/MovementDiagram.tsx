'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export default function MovementDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'bottom 48%', scrub: true } });
      ref.current!.querySelectorAll<SVGGElement>('.diagram-callout').forEach((group, i) => {
        timeline.fromTo(group.querySelector('path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'none' }, i * .7)
          .fromTo(group.querySelector('text'), { opacity: .15 }, { opacity: 1, duration: .6, ease: 'none' }, i * .7 + .4);
      });
    });
    return () => media.revert();
  }, []);
  return <div className="movement-diagram" ref={ref}>
    <div><span className="detail-kicker">A VISUAL READING / SCROLL TO TRACE</span><h3>Energy. Release. Rhythm.</h3><p>The gear train transmits energy. The escapement releases it in measured impulses. The balance wheel sets the rhythm.</p></div>
    <svg viewBox="0 0 1000 310" role="img" aria-label="Sequential diagram: gear train, escapement and balance wheel, connected along the path of energy">
      <g className="diagram-wheel" transform="translate(115 155)"><circle r="60"/><circle r="36"/>{Array.from({length:12},(_,i)=><path key={i} transform={`rotate(${i*30})`} d="M0 -51 V-69 M0 -36 V-12"/>)}<circle r="8"/></g>
      <g className="diagram-wheel" transform="translate(500 155)"><path d="M-50 32 L0 -38 L50 32 M-25 -3 L-57 -26 M25 -3 L57 -26"/><circle r="8"/></g>
      <g className="diagram-wheel" transform="translate(870 155)"><circle r="60"/><circle r="48"/><circle r="32"/><circle r="17"/><path d="M-60 0H60 M0 -60V60"/></g>
      <g className="diagram-callout"><path pathLength="1" d="M115 95V48H300 M175 155H435"/><text x="110" y="30">01 / GEAR TRAIN</text></g>
      <g className="diagram-callout"><path pathLength="1" d="M500 187V250H665 M565 155H810"/><text x="450" y="278">02 / ESCAPEMENT</text></g>
      <g className="diagram-callout"><path pathLength="1" d="M870 95V48H695"/><text x="695" y="30">03 / BALANCE WHEEL</text></g>
    </svg>
    <span className="diagram-note">Conceptual path of energy · not a technical service schematic</span>
  </div>;
}
