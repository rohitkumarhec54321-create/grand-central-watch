'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Native text remains readable before hydration; motion reverses with scroll. */
export default function KineticHeading({ text, as: Tag = 'h2', className = '', id }: {
  text: string; as?: 'h1' | 'h2' | 'h3'; className?: string; id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const words = ref.current!.querySelectorAll('.kinetic-word');
      gsap.fromTo(words, { yPercent: 115, rotate: 7, opacity: .15 }, {
        yPercent: 0, rotate: 0, opacity: 1, stagger: .09, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 98%', end: 'top 48%', scrub: true },
      });
    });
    return () => media.revert();
  }, [text]);
  return <Tag ref={ref} id={id} className={`kinetic-heading ${className}`} aria-label={text}>
    {text.split('\n').map((line, i) => <span className="kinetic-line" aria-hidden="true" key={i}>
      {line.split(' ').map((word, j) => <span className="kinetic-mask" key={j}><span className="kinetic-word">{word}</span></span>)}
    </span>)}
  </Tag>;
}
