'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const SmoothScrollContext = createContext<Lenis | undefined>(undefined);
export const usePageScroll = () => useContext(SmoothScrollContext);

/** Shared motion owns one Lenis instance; the standalone sequence can still own its own. */
export default function EditorialMotion({children}:{children:React.ReactNode}) {
  const [scroll,setScroll]=useState<Lenis>();
  const pathname = usePathname();
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const updateScroll = () => ScrollTrigger.update();
    const media = gsap.matchMedia();
    let refreshRaf = 0;
    const pageTrigger = ScrollTrigger.create({ start:0, end:'max', onUpdate:self=>{
      if(progress.current) progress.current.style.transform=`translateY(${self.progress*Math.max(0,innerHeight-48)}px)`;
    }});
    // Expanding accordions and filtering products change page length after initial layout.
    let height=0;
    const resize = new ResizeObserver(()=>{
      const next=document.body.scrollHeight;
      if(next===height)return;
      height=next;cancelAnimationFrame(refreshRaf);
      refreshRaf=requestAnimationFrame(()=>ScrollTrigger.refresh());
    });
    resize.observe(document.body);
    media.add('(prefers-reduced-motion: no-preference)', () => {
      let raf=0;
      const lenis=new Lenis({lerp:.1,smoothWheel:true,autoRaf:false,anchors:true});
      setScroll(lenis);
      lenis.on('scroll',updateScroll);
      const tick=(time:number)=>{lenis.raf(time);raf=requestAnimationFrame(tick)};
      raf=requestAnimationFrame(tick);
      const context = gsap.context(() => {
        gsap.from('.hero-copy > *', { y:24, autoAlpha:0, duration:1.1, stagger:.12, ease:'power2.out', clearProps:'all' });
        gsap.from('.hero-art', { autoAlpha:0, y:18, duration:1.6, delay:.12, ease:'power2.out', clearProps:'all' });
        gsap.utils.toArray<HTMLElement>('[data-editorial-reveal], .detail-section-heading, .detail-subheading, .detail-end').forEach(element => {
          gsap.from(element, { y:28, autoAlpha:0, duration:.9, ease:'power2.out', clearProps:'all', scrollTrigger:{ trigger:element, start:'top 94%', once:true } });
        });
        gsap.utils.toArray<HTMLElement>('[data-image-reveal]').forEach(element=>{
          gsap.from(element,{clipPath:'inset(8% 0 8% 0)',duration:1.3,ease:'power2.out',clearProps:'clipPath',scrollTrigger:{trigger:element,start:'top 90%',once:true}});
          const img=element.querySelector('img');
          if(img)gsap.fromTo(img,{scale:1.08},{scale:1,duration:1.7,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 90%',once:true}});
        });
        gsap.utils.toArray<HTMLElement>('.arrival-steps li').forEach((element,i)=>gsap.from(element,{y:25,autoAlpha:0,duration:.8,delay:i*.09,clearProps:'all',scrollTrigger:{trigger:element,start:'top 93%',once:true}}));
        gsap.utils.toArray<HTMLElement>('.service-facts strong').forEach(element=>gsap.from(element,{y:16,autoAlpha:0,duration:1,clearProps:'all',scrollTrigger:{trigger:element,start:'top 93%',once:true}}));
      });
      return () => {context.revert();cancelAnimationFrame(raf);lenis.off('scroll',updateScroll);lenis.destroy();setScroll(undefined);};
    });
    ScrollTrigger.refresh();
    return () => {media.revert();pageTrigger.kill();resize.disconnect();cancelAnimationFrame(refreshRaf)};
  }, [pathname]);
  return <SmoothScrollContext.Provider value={scroll}>{children}<div className="global-scroll-track" aria-hidden="true"><div ref={progress}/></div></SmoothScrollContext.Provider>;
}
