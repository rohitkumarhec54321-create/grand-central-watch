import ScrollWatchSequence from '@/components/ScrollWatchSequence';
import WatchDetails from '@/components/WatchDetails';

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="https://centralwatch.com/" aria-label="Grand Central Watch home"><span>GRAND CENTRAL</span><strong>WATCH<span className="brand-dot">.</span></strong></a>
        <span className="header-note">NEW YORK WATCHMAKERS · EST. 1952</span>
        <a className="header-link" href="https://centralwatch.com/">Visit the atelier <span>↗</span></a>
      </header>
      <section className="intro-strip" aria-label="Introduction"><span>THE ART OF WATCHMAKING</span><p>There’s a world beneath the dial.</p><a href="#watch-sequence">Take a closer look <span>↓</span></a></section>
      <ScrollWatchSequence />
      <section id="simple-at-first-glance" className="closing-section">
        <span className="technical-label">PRECISION, FROM THE INSIDE OUT</span>
        <h2>Simple at first glance.<br /><em>Extraordinary within.</em></h2>
        <p>A case protects. A crystal reveals. A movement gives it life.<br />Explore the layers, surfaces, and mechanisms that make a watch more than its face.</p>
        <a href="#case-assembly">Explore the details <span>↓</span></a>
      </section>
      <WatchDetails />
      <footer className="site-footer"><span>GRAND CENTRAL WATCH</span><span>NEW YORK · SINCE 1952</span><a href="#watch-sequence">Back to the movement ↑</a></footer>
    </main>
  );
}
