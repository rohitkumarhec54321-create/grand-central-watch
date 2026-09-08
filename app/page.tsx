/* eslint-disable next/no-img-element -- Images are pre-optimized WebP assets for the static export. */
import WatchExperience from '@/components/WatchExperience';
import CollectionExplorer from '@/components/CollectionExplorer';
import Link from 'next/link';
import { INQUIRY, press } from '@/lib/site-content';


export default function Home() {
  return (
    <main id="main-content">
      <section className="atelier-hero" aria-labelledby="hero-title">
        <div className="hero-copy"><span className="atelier-label">NEW YORK WATCHMAKERS · SINCE 1952</span><h1 id="hero-title">Time.<br /><em>Considered.</em></h1><p>Expert repair. Thoughtful restoration.<br />Timepieces to treasure for a lifetime.</p><div className="hero-actions"><a className="solid-link" href={INQUIRY}>Care for your watch <span>↗</span></a><a className="editorial-link" href="#watch-sequence">Explore the craft <span>↓</span></a></div></div>
        <div className="hero-art"><img src="/watch-gallery/longines-perspective.webp" width="1402" height="1122" alt="Longines watch in polished steel with a black dial and brown leather strap" fetchPriority="high" /><span className="hero-art-label">LONGINES / A STUDY IN FORM</span></div>
        <div className="hero-baseline"><span>GRAND CENTRAL TERMINAL, NEW YORK</span><span>THE ART OF WATCHMAKING</span><span>SCROLL TO DISCOVER ↓</span></div>
      </section>
      <div className="sequence-preface"><span className="atelier-label">I. THE MOVEMENT</span><p>To understand the whole,<br /><em>look within.</em></p><span>Six perspectives.<br />One continuous exploration.</span></div>
      <WatchExperience />
      <section id="simple-at-first-glance" className="closing-section" data-editorial-reveal>
        <span className="atelier-label">THE BEAUTY OF WHAT YOU DON’T SEE</span>
        <h2>Simple at first glance.<br /><em>Extraordinary within.</em></h2>
        <p>A case protects. A crystal reveals. A movement gives it life.<br />Each detail belongs to something greater.</p>
        <Link className="editorial-link" href="/craft">The collected studies <span>↓</span></Link>
      </section>
      <section className="home-services content-section paper-page"><div className="section-heading" data-editorial-reveal><span className="atelier-label">AN INDIVIDUAL APPROACH</span><h2>Every watch.<br /><em>Its own story.</em></h2><p>From everyday companions to inherited treasures, the next chapter begins with care.</p></div><div className="home-service-links">{[['01','Repair & restore','Modern servicing, vintage restoration, and the finishing details.','/services'],['02','Find your timepiece','Serviced pre-owned watches and independent makers.','/collection'],['03','Visit the atelier','Inside Grand Central Terminal, beside Track 38.','/visit']].map(([number,title,copy,url])=><Link href={url} key={url} data-editorial-reveal><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><span>↗</span></Link>)}</div></section>
      <section className="home-collection content-section paper-page"><div className="section-heading row-heading" data-editorial-reveal><div><span className="atelier-label">FROM THE COLLECTION</span><h2>Time, <em>well chosen.</em></h2></div><Link className="editorial-link" href="/collection">Explore all selections <span>→</span></Link></div><CollectionExplorer preview /></section>
      <section className="home-story"><div className="image-reveal" data-image-reveal><img src="/official/workshop.webp" alt="Grand Central Watch watchmakers in the workshop" width="1440" height="960" loading="lazy" /></div><div className="section-heading" data-editorial-reveal><span className="atelier-label">THREE GENERATIONS · ONE CONTINUING STORY</span><h2>In the heart<br />of a city.<br /><em>For a lifetime.</em></h2><p>Founded by Max Kivel in 1952. Carried forward by three generations of the Kivel family, from a small terminal stall to a dedicated watchmaking workshop.</p><Link className="editorial-link" href="/our-story">Our story <span>→</span></Link></div></section>
      <div className="press-strip"><span className="atelier-label">IN GOOD COMPANY</span><div>{press.map(name=><Link href="/journal" key={name}>{name}</Link>)}</div></div>
      <section className="home-studies content-section" data-editorial-reveal><span className="atelier-label">THE COLLECTED STUDIES / 16 PLATES</span><h2>A world beneath<br /><em>the surface.</em></h2><p>Assembly. Architecture. Balance. Explore every supplied study in a dedicated, full-resolution gallery.</p><Link className="editorial-link" href="/craft">Inspect the complete studies <span>↗</span></Link></section>
    </main>
  );
}
