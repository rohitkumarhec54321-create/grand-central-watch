'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Progressive enhancement: content stays visible without JavaScript or with reduced motion. */
export default function EditorialMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.from('.hero-copy > *', { y: 24, autoAlpha: 0, duration: 1.2, stagger: .12, ease: 'power2.out', clearProps: 'all' });
        gsap.from('.hero-art', { autoAlpha: 0, y: 18, duration: 1.7, delay: .12, ease: 'power2.out', clearProps: 'all' });
        gsap.utils.toArray<HTMLElement>('[data-editorial-reveal], .detail-section-heading, .detail-subheading, .detail-end').forEach(element => {
          gsap.from(element, { y: 30, autoAlpha: 0, duration: 1, ease: 'power2.out', clearProps: 'all', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
        });
      });
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return null;
}
