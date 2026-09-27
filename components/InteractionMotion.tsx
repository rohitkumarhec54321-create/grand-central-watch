'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

/** Magnetic targets keep their native click, tab and focus behavior. */
export default function InteractionMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const selector = '.gc-cta, .solid-link, .editorial-link, .gc-text-link, [data-magnetic]';
      let targets: HTMLElement[] = [], raf = 0, x = 0, y = 0;
      const active = new Set<HTMLElement>();
      const collect = () => { targets = Array.from(document.querySelectorAll<HTMLElement>(selector)); };
      collect();
      const observer = new MutationObserver(collect);
      observer.observe(document.body, { childList: true, subtree: true });
      const reset = (el: HTMLElement) => { gsap.to(el, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.45)', overwrite: true }); active.delete(el); };
      const draw = () => {
        raf = 0;
        targets.forEach(el => {
          const rect = el.getBoundingClientRect();
          const dx = x - (rect.left + rect.width / 2 - Number(gsap.getProperty(el, 'x')));
          const dy = y - (rect.top + rect.height / 2 - Number(gsap.getProperty(el, 'y')));
          if (rect.width && Math.abs(dx) < rect.width / 2 + 28 && Math.abs(dy) < rect.height / 2 + 28) {
            active.add(el);
            gsap.to(el, { x: Math.max(-13, Math.min(13, dx * .16)), y: Math.max(-10, Math.min(10, dy * .2)), duration: .35, ease: 'power3.out', overwrite: true });
          } else if (active.has(el)) reset(el);
        });
      };
      const move = (event: PointerEvent) => { x = event.clientX; y = event.clientY; if (!raf) raf = requestAnimationFrame(draw); };
      const leave = () => active.forEach(reset);
      document.addEventListener('pointermove', move, { passive: true });
      document.documentElement.addEventListener('pointerleave', leave);
      return () => { observer.disconnect(); cancelAnimationFrame(raf); document.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); targets.forEach(el => { gsap.killTweensOf(el); gsap.set(el, { clearProps: 'transform' }); }); };
    });
    return () => media.revert();
  }, [pathname]);
  return null;
}
