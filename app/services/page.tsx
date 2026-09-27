import KineticHeading from '@/components/KineticHeading';
import { assetPath } from '@/lib/paths';
/* eslint-disable next/no-img-element -- Images are pre-optimized WebP assets for the static export. */
import type { Metadata } from 'next';
import Link from 'next/link';
import PageIntro from '@/components/PageIntro';
import BrandDirectory from '@/components/BrandDirectory';
import { prices, process, INQUIRY, REPAIR_FORM } from '@/lib/site-content';
export const metadata: Metadata = {
  title: 'Service & Restoration | Grand Central Watch',
  description:
    'Modern watch repair, vintage restoration, published starting prices, mail-in service, and the Grand Central Watch repair process.',
};
export default function Services() {
  return (
    <main id="main-content" className="paper-page">
      <PageIntro
        label="SERVICE & RESTORATION"
        title="For the years"
        em="still to come."
      >
        Modern precision. Vintage character. Individual attention to the watch
        in your care.
      </PageIntro>
      <nav className="chapter-nav" aria-label="Service sections">
        {[
          ['#expertise', 'Expertise'],
          ['#repair-process', 'The process'],
          ['#pricing', 'Starting prices'],
          ['#brands', 'Brands'],
          ['#mail-in', 'Mail-in service'],
        ].map(([url, label]) => (
          <a href={url} key={url}>
            {label}
          </a>
        ))}
      </nav>
      <section className="content-section service-introduction" id="expertise">
        <div className="image-reveal" data-image-reveal>
          <img
            src={assetPath("/watch-gallery/movement-architecture.webp")}
            alt="Conceptual illustration of a watch movement with labeled gears, escapement and balance wheel"
            width={2048}
            height={2048}
            loading="lazy"
          />
        </div>
        <div className="section-heading" data-editorial-reveal>
          <span className="atelier-label">EXPERIENCE, AT EVERY SCALE</span>
          <KineticHeading text={"The right hands.\nThe closest attention."} className="kinetic-section"/>
          <p>
            From a first service to the restoration of a family heirloom, every
            recommendation begins with a physical inspection.
          </p>
          <a className="solid-link" href={INQUIRY}>
            Begin a repair inquiry ↗
          </a>
          <Link className="editorial-link" href="/visit">
            Or visit us in person <span>→</span>
          </Link>
        </div>
      </section>
      <section className="content-section expertise-grid">
        <article data-editorial-reveal id="vintage-restoration">
          <span className="atelier-label">01 / PRESERVE</span>
          <h3>Vintage restoration</h3>
          <p>
            Original parts inventory supports restoration of older movements.
            Selected heirloom projects can include a Heritage Book documenting
            the watch and its restoration.
          </p>
        </article>
        <article data-editorial-reveal id="modern-watch-repair">
          <span className="atelier-label">02 / RENEW</span>
          <h3>Modern watch repair</h3>
          <p>
            Disassembly, cleaning, inspection, lubrication, reassembly,
            regulation, and testing. Cosmetic refinishing requires separate
            approval.
          </p>
        </article>
        <article data-editorial-reveal id="additional-services">
          <span className="atelier-label">03 / REFINE</span>
          <h3>The finishing details</h3>
          <p>
            Batteries, crystals, straps, sizing, appraisals, and jewelry repair.
            Ring sizing, chain soldering, clasp replacement, stone resetting,
            and pearl restringing are also available.
          </p>
        </article>
      </section>
      <section className="dark-panel content-section" id="repair-process">
        <div className="section-heading" data-editorial-reveal>
          <span className="atelier-label">THE SERVICE JOURNEY</span>
          <KineticHeading text={"Considered.\nAt every step."} className="kinetic-section"/>
        </div>
        <ol className="process-list">
          {process.map(([title, description], i) => (
            <li key={title} data-editorial-reveal>
              <span className="process-number">0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className="process-tick" aria-hidden="true">
                ↗
              </span>
            </li>
          ))}
        </ol>
        <div className="service-facts">
          <div>
            <strong>1–9</strong>
            <span>WEEKS · MOST APPROVED SERVICES</span>
          </div>
          <div>
            <strong>50%</strong>
            <span>DEPOSIT AFTER APPROVAL</span>
          </div>
          <div>
            <strong>24</strong>
            <span>MONTH LIMITED WARRANTY · FULL SERVICE</span>
          </div>
        </div>
      </section>
      <section className="content-section pricing-section" id="pricing">
        <div className="section-heading" data-editorial-reveal>
          <span className="atelier-label">A CLEAR STARTING POINT</span>
          <KineticHeading text={"Service,\nwith clarity."} className="kinetic-section"/>
          <p>
            Published starting prices in USD. Your individual estimate follows
            inspection. Declined estimates carry a $45–$275 evaluation fee.
          </p>
          <a
            className="editorial-link"
            href="https://centralwatch.com/repair-services"
          >
            Full service information <span>↗</span>
          </a>
        </div>
        <dl className="price-list">
          {prices.map(([name, price]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>
                ${price.toLocaleString('en-US')}
                <sup>+</sup>
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="content-section" id="brands">
        <div className="section-heading" data-editorial-reveal>
          <span className="atelier-label">
            MANY MAKERS. ONE STANDARD OF CARE.
          </span>
          <KineticHeading text={"A shared respect\nfor watchmaking."} className="kinetic-section"/>
        </div>
        <BrandDirectory />
      </section>
      <section className="content-section mail-section" id="mail-in">
        <div className="section-heading" data-editorial-reveal>
          <span className="atelier-label">FROM YOUR HOME TO OUR WORKSHOP</span>
          <KineticHeading text={"Care,\nfrom a distance."} className="kinetic-section"/>
          <p>
            New clients: send an inquiry and wait for confirmation and shipping
            instructions before mailing a watch.
          </p>
          <a className="solid-link" href={INQUIRY}>
            Request mail-in guidance ↗
          </a>
        </div>
        <div className="mail-instructions">
          <span className="atelier-label">REPAIR-SHIPPING ADDRESS</span>
          <address>
            Grand Central Watch
            <br />
            52 Vanderbilt Avenue, Suite 1010
            <br />
            New York, NY 10017
          </address>
          <p>
            Include the completed repair form and insure the package fully.
            Leave out boxes and manuals. Pay the balance before return shipping;
            return shipping charges apply.
          </p>
          <p>
            Choose return insurance on the form: USPS Priority Mail with no
            insurance or $500 coverage; FedEx with $2,000 or higher coverage.
            Carrier decisions govern claims.
          </p>
          <a className="editorial-link" href={REPAIR_FORM}>
            Download the repair form <span>↓</span>
          </a>
          <Link className="small-link" href="/client-care">
            Read warranty & mail-in questions →
          </Link>
        </div>
      </section>
    </main>
  );
}
