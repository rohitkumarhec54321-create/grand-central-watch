'use client';

import { useRef, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import './WatchDetails.css';

export const GALLERY = [
  { id: 'movement-overview', title: 'The rhythm beneath the dial', family: 'Movement study', detail: 'A close view brings the gear train, ruby-colored bearings, and coiled regulating assembly into focus. The luminous annotations guide the eye through this conceptual mechanism.', alt: 'Annotated macro rendering of gold gears, jewel bearings and an escapement inside a dark watch', width: 2048, height: 2048 },
  { id: 'crystal-lift', title: 'The first separation', family: 'Carbon-lume concept', detail: 'The bezel rises first, followed by the transparent crystal. With the dial exposed, blue hands and the openworked layers become the center of attention.', alt: 'Carbon-patterned watch with its bezel and transparent crystal lifted above the blue-accented dial', width: 1672, height: 941 },
  { id: 'exploded-perspective', title: 'Depth, revealed', family: 'Carbon-lume concept', detail: 'An oblique exploded view separates the front ring, crystal, dial, and layered plates. Follow the alignment through the center to see how the visual structure fits together.', alt: 'Oblique exploded carbon watch rendering with separate dial, crystal and multiple mechanical plates', width: 1672, height: 941 },
  { id: 'exploded-axis', title: 'One axis. Many layers.', family: 'Carbon-lume concept', detail: 'An extended assembly study places the case at the center, with components suspended on either side. The blue centerline makes the relationship between each layer easy to trace.', alt: 'Wide exploded watch assembly with a central carbon case and mechanical layers along a blue horizontal axis', width: 1672, height: 941 },
  { id: 'carbon-hero', title: 'Everything, in its place', family: 'Carbon-lume concept', detail: 'The complete design returns to a single silhouette. A dark woven case texture, blue accents, and an open dial preserve a view into the mechanism.', alt: 'Fully assembled blue-accented carbon concept watch surrounded by fine orbital lines', width: 1672, height: 941 },
  { id: 'longines-front', title: 'A face made to be read', family: 'Longines · exterior study', detail: 'Cream-colored numerals and broad hands stand out against the black dial. The small-seconds display sits below the center, while a ridged bezel frames the composition.', alt: 'Front rendering of a Longines watch with black dial, cream numerals and a brown leather strap', width: 1122, height: 1402 },
  { id: 'iwc-portrait', title: 'A different kind of instrument', family: 'IWC · design reference', detail: 'An olive dial and textile strap give this chronograph study a distinct character. Three subdials, a day-date display, and two pushers add visual complexity around the central hands.', alt: 'Three-quarter IWC chronograph rendering with olive dial, three subdials and green textile strap', width: 1402, height: 1122 },
  { id: 'longines-perspective', title: 'Character in the profile', family: 'Longines · exterior study', detail: 'A three-quarter view reveals the case shoulders, the projection of the crown, and the curve of the strap. Brushed and polished-looking surfaces catch the studio light differently.', alt: 'Angled Longines watch rendering showing steel case shoulders, ridged bezel, crown and leather strap', width: 1402, height: 1122 },
  { id: 'longines-views', title: 'The complete exterior', family: 'Longines · six-view study', detail: 'Front, side, back, strap, and angled views describe the object as a whole. Compare the dial-side profile with the engraved caseback and the buckle treatment.', alt: 'Six-panel Longines contact sheet showing front, front right, side, front left, caseback and strap buckle', width: 1402, height: 1122 },
  { id: 'iwc-orbit', title: 'Around the instrument', family: 'IWC · orbit study', detail: 'The central dial is surrounded by alternate viewpoints. Moving around the circle reveals the relationship between the case, strap, crown, and chronograph pushers.', alt: 'IWC chronograph orbit reference with a central watch surrounded by angle-labeled front side and back views', width: 1536, height: 1024 },
  { id: 'iwc-views', title: 'A silhouette from every side', family: 'IWC · multi-view study', detail: 'A front-to-back reference strip pairs close perspectives with a smaller rotation sequence. Look for changes in the apparent case depth and the position of the controls.', alt: 'IWC chronograph contact sheet with five large perspectives and a row of nine rotation views', width: 1402, height: 1122 },
  { id: 'hublot-views', title: 'Architecture on display', family: 'Hublot · design reference', detail: 'A skeleton-style dial, exposed bezel fasteners, and a dark strap create a more architectural expression. The detail panels move from the face to the controls, caseback, and clasp.', alt: 'Hublot Big Bang reference collage showing a skeleton chronograph dial, black case, side controls, exhibition caseback and clasp', width: 1402, height: 1122 },
  { id: 'movement-architecture', title: 'A map of the mechanism', family: 'Movement study · 01', detail: 'This annotated illustration places the gear train, escapement, balance assembly, and bearings in one view. Use it as a visual guide to the vocabulary of a mechanical movement.', alt: 'Annotated movement illustration labeling gear train, escapement, jewel bearings, mainspring and balance wheel', width: 2048, height: 2048 },
  { id: 'movement-energy', title: 'Follow the path of energy', family: 'Movement study · 02', detail: 'Gold-toned wheels sit between the larger assemblies, with a turquoise line connecting points of interest. The composition helps distinguish the transmission train from the regulating parts.', alt: 'Macro movement illustration with gold gears, purple jewel bearings and a turquoise energy-path overlay', width: 2048, height: 2048 },
  { id: 'movement-balance', title: 'An oscillating heart', family: 'Movement study · 03', detail: 'A tightly coiled spring and gold-colored balance rim dominate this close-up. Surrounding annotations identify neighboring components and make the depth of the assembly visible.', alt: 'Detailed illustration of a gold balance wheel and coiled spring with jewel bearings and gear train labels', width: 2048, height: 2048 },
  { id: 'movement-hairspring', title: 'The finest line', family: 'Movement study · 04', detail: 'The hairspring is the visual center of this study: a fine spiral within the balance assembly. Nearby wheels and bearing points provide a sense of its scale within the movement.', alt: 'Annotated schematic-style movement rendering highlighting the hairspring, balance wheel, escapement and jewel bearings', width: 2048, height: 2048 },
] as const;

export default function WatchDetails() {
  const [selected, setSelected] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const item = selected === null ? null : GALLERY[selected];
  const move = (direction: number) => setSelected(index => index === null ? null : (index + direction + GALLERY.length) % GALLERY.length);
  const photo = (index: number, className = '') => {
    const entry = GALLERY[index];
    return <figure className={`detail-photo ${className}`} key={entry.id} data-gallery-id={entry.id}>
      <button type="button" className="detail-image-button" aria-label={`Inspect ${entry.title}`} onClick={event => { opener.current = event.currentTarget; setSelected(index); }}>
        <img src={`/watch-gallery/${entry.id}-small.webp`} srcSet={`/watch-gallery/${entry.id}-small.webp 900w, /watch-gallery/${entry.id}.webp ${Math.min(1920, entry.width)}w`} sizes={className.includes('wide') ? '(max-width: 767px) 90vw, 88vw' : '(max-width: 767px) 90vw, 44vw'} width={entry.width} height={entry.height} loading="lazy" decoding="async" alt={entry.alt} />
        <span className="detail-expand" aria-hidden="true">INSPECT <span>↗</span></span>
      </button>
      <figcaption><span className="detail-kicker">{entry.family}</span><h3>{entry.title}</h3><p>{entry.detail}</p></figcaption>
    </figure>;
  };
  return <div className="watch-details">
    <nav className="detail-index" aria-label="Watchmaking details"><span>THE COLLECTED STUDIES</span><a href="#case-assembly">01 / Assembly</a><a href="#movement-anatomy">02 / Movement</a><a href="#longines-study">03 / Exterior</a><a href="#design-studies">04 / Perspectives</a></nav>

    <section className="detail-section assembly-section" id="case-assembly" aria-labelledby="assembly-title">
      <div className="detail-section-heading"><div><p className="detail-kicker">01 / THE ARCHITECTURE OF A TIMEPIECE</p><h2 id="assembly-title">A whole world.<br /><em>Taken apart.</em></h2></div><div className="detail-lede"><p>Before a timepiece becomes one object, it is a collection of carefully aligned layers. These carbon-lume concept studies make that hidden architecture visible.</p><span className="detail-note">Carbon-lume concept studies</span></div></div>
      {photo(3, 'detail-wide assembly-panorama')}
      <div className="detail-grid">{photo(1)}{photo(2)}</div>
      <div className="assembly-finale">{photo(4, 'detail-wide')}<div className="assembly-quote"><span className="detail-kicker">FROM SEPARATION TO SILHOUETTE</span><p>Every layer.<br />One timepiece.</p></div></div>
    </section>

    <section className="detail-section movement-section" id="movement-anatomy" aria-labelledby="movement-title">
      <div className="detail-section-heading"><div><p className="detail-kicker">02 / INSIDE THE MOVEMENT</p><h2 id="movement-title">Energy becomes<br /><em>time.</em></h2></div><p className="detail-lede">A mechanical watch stores energy, passes it through a train of wheels, and releases it in controlled steps. A balance and its fine spring provide the rhythm.</p></div>
      <div className="movement-feature">{photo(0)}<div className="mechanism-notes"><span className="detail-kicker">FOUR PARTS OF THE STORY</span><ol>
        <li><span>01</span><div><h3>Store.</h3><h4>The mainspring</h4><p>Winding coils the mainspring, storing the energy that powers the movement as it unwinds.</p></div></li>
        <li><span>02</span><div><h3>Transfer.</h3><h4>The gear train</h4><p>A connected set of wheels carries power through the movement toward the escapement.</p></div></li>
        <li><span>03</span><div><h3>Release.</h3><h4>The escapement</h4><p>The escapement controls the release of energy and supplies impulses to sustain the balance.</p></div></li>
        <li><span>04</span><div><h3>Regulate.</h3><h4>The balance & hairspring</h4><p>The balance swings back and forth as its spring expands and contracts, establishing the movement’s rhythm.</p></div></li>
      </ol><a className="detail-source" href="https://www.longines.com/en-se/universe/blog/understanding-automatic-and-quartz-movements" target="_blank" rel="noreferrer">Further reading: Longines on mechanical movements ↗</a></div></div>
      <div className="detail-subheading"><h3>Closer still.</h3><p>Four annotated studies of the parts beneath the dial.</p></div>
      <div className="detail-grid movement-grid">{[12,13,14,15].map(index => photo(index))}</div>
      <p className="detail-image-note">These supplied illustrations are conceptual studies. Their embedded labels and numerical overlays are visual annotations, not service instructions or verified specifications for the watches shown.</p>
    </section>

    <section className="detail-section longines-section" id="longines-study" aria-labelledby="longines-title">
      <div className="detail-section-heading"><div><p className="detail-kicker">03 / THE EXTERIOR STUDY</p><h2 id="longines-title">Read the face.<br /><em>Follow the form.</em></h2></div><p className="detail-lede">The Longines references return us to the exterior: contrasting hands, a textured bezel, sculpted case shoulders, and the quiet detail of a leather strap.</p></div>
      <div className="detail-grid longines-portraits">{photo(5)}{photo(7)}</div>
      <div className="exterior-notes"><div><span>01 / LEGIBILITY</span><h3>Contrast with a purpose.</h3><p>Follow the hands against the dark dial, then find the small-seconds display.</p></div><div><span>02 / SURFACE</span><h3>Light reveals the finish.</h3><p>Look at how the bezel ridges and broad case surfaces catch different highlights.</p></div><div><span>03 / CONSTRUCTION</span><h3>More than a front view.</h3><p>The back, buckle, and side profile complete the picture of the timepiece.</p></div></div>
      {photo(8, 'detail-wide longines-contact')}
    </section>

    <section className="detail-section design-section" id="design-studies" aria-labelledby="design-title">
      <div className="detail-section-heading"><div><p className="detail-kicker">04 / DIFFERENT DESIGN LANGUAGES</p><h2 id="design-title">One craft.<br /><em>Many expressions.</em></h2></div><div className="detail-lede"><p>Different watches reveal different priorities. Explore the instrument-like IWC references, then the open architecture of the Hublot study.</p><span className="detail-note">IWC & Hublot · independent design studies</span></div></div>
      <div className="iwc-layout">{photo(6, 'iwc-portrait')}<div className="iwc-context"><span className="detail-kicker">IWC / PILOT-STYLE CHRONOGRAPH</span><h3>Built around<br />the information.</h3><p>The olive dial balances several displays within a clear circular frame. White markings establish contrast; the textile strap carries the same color beyond the case.</p><dl><div><dt>At the center</dt><dd>Broad hands, three subdials, and a day-date window.</dd></div><div><dt>At the edge</dt><dd>A crown and two pushers change the side profile.</dd></div><div><dt>In the round</dt><dd>Orbit and reference sheets reveal the case and strap from multiple angles.</dd></div></dl></div></div>
      <div className="detail-grid">{photo(9)}{photo(10)}</div>
      <div className="hublot-layout"><div><span className="detail-kicker">HUBLOT / SKELETON-STYLE CHRONOGRAPH</span><h3>The mechanism<br />joins the face.</h3><p>Here, the visible mechanism becomes part of the dial’s composition. Repeated fasteners, layered surfaces, and strong contrast give the exterior a distinctly architectural character.</p><p className="detail-note">Inspect the side controls, caseback, and clasp in the detail panels.</p></div>{photo(11)}</div>
      <div className="detail-end"><span className="detail-kicker">A CONTINUING APPRECIATION</span><p>The more you look,<br /><em>the more you see.</em></p><a href="#watch-sequence">Return to the scroll experience <span>↑</span></a></div>
    </section>

    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className="detail-lightbox" showCloseButton={false} finalFocus={opener} data-lenis-prevent onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } }}>
        {item && <><div className="lightbox-header"><span className="detail-kicker">{item.family}</span><DialogClose className="lightbox-close" aria-label="Close image viewer">CLOSE <span>×</span></DialogClose></div><div className="lightbox-image"><img src={`/watch-gallery/${item.id}.webp`} alt={item.alt} width={item.width} height={item.height} /></div><div className="lightbox-bottom"><div><DialogTitle className="lightbox-title">{item.title}</DialogTitle><DialogDescription className="lightbox-description">{item.detail}</DialogDescription></div><div className="lightbox-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous image">←</button><span aria-live="polite">{String((selected ?? 0)+1).padStart(2,'0')} / 16</span><button type="button" onClick={() => move(1)} aria-label="Next image">→</button></div></div></>}
      </DialogContent>
    </Dialog>
  </div>;
}
