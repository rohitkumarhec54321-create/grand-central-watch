import ScrollWatchSequence from '@/components/ScrollWatchSequence';
import WatchDetails from '@/components/WatchDetails';
import EditorialMotion from '@/components/EditorialMotion';

export default function Home() {
  return (
    <main>
      <EditorialMotion />
      <header className="site-header">
        <nav className="header-nav" aria-label="Main navigation"><a href="#watch-sequence">The craft</a><a href="#case-assembly">The studies</a></nav>
        <a className="wordmark" href="https://centralwatch.com/" aria-label="Grand Central Watch home"><span>GRAND CENTRAL</span><strong>WATCH</strong><small>NEW YORK · 1952</small></a>
        <a className="header-link" href="https://centralwatch.com/">Visit the atelier <span>↗</span></a>
      </header>
      <section className="atelier-hero" aria-labelledby="hero-title">
        <div className="hero-copy"><span className="atelier-label">THE WATCHMAKER’S PERSPECTIVE</span><h1 id="hero-title">Time.<br /><em>Considered.</em></h1><p>A study in precision.<br />An appreciation of everything within.</p><a className="editorial-link" href="#watch-sequence">Discover the movement <span>↓</span></a></div>
        <div className="hero-art"><img src="/watch-gallery/longines-perspective.webp" width="1402" height="1122" alt="Longines watch in polished steel with a black dial and brown leather strap" fetchPriority="high" /><span className="hero-art-label">LONGINES / A STUDY IN FORM</span></div>
        <div className="hero-baseline"><span>GRAND CENTRAL TERMINAL, NEW YORK</span><span>THE ART OF WATCHMAKING</span><span>SCROLL TO DISCOVER ↓</span></div>
      </section>
      <div className="sequence-preface"><span className="atelier-label">I. THE MOVEMENT</span><p>To understand the whole,<br /><em>look within.</em></p><span>Six perspectives.<br />One continuous exploration.</span></div>
      <ScrollWatchSequence />
      <section id="simple-at-first-glance" className="closing-section" data-editorial-reveal>
        <span className="atelier-label">THE BEAUTY OF WHAT YOU DON’T SEE</span>
        <h2>Simple at first glance.<br /><em>Extraordinary within.</em></h2>
        <p>A case protects. A crystal reveals. A movement gives it life.<br />Each detail belongs to something greater.</p>
        <a className="editorial-link" href="#case-assembly">The collected studies <span>↓</span></a>
      </section>
      <WatchDetails />
      <footer className="site-footer"><a className="footer-signature" href="https://centralwatch.com/">Grand Central Watch</a><span>WATCHMAKERS IN NEW YORK<br />SINCE 1952</span><a href="#hero-title">Back to the beginning ↑</a></footer>
    </main>
  );
}
