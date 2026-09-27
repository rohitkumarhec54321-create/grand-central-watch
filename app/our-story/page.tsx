import KineticHeading from '@/components/KineticHeading';
import { assetPath } from '@/lib/paths';
/* eslint-disable next/no-img-element -- Images are pre-optimized WebP assets for the static export. */
import type { Metadata } from 'next';
import Link from 'next/link';
import PageIntro from '@/components/PageIntro';
export const metadata: Metadata = {
  title: 'Our Story | Grand Central Watch',
  description:
    'The Kivel family and three generations of watchmaking inside Grand Central Terminal since 1952.',
};
export default function Story() {
  return (
    <main id="main-content" className="paper-page">
      <PageIntro
        label="OUR STORY"
        title="New York moves."
        em="We keep its time."
      >
        Three generations of the Kivel family. A watchmaking tradition rooted in
        Grand Central Terminal.
      </PageIntro>
      <figure className="story-image image-reveal" data-image-reveal>
        <img
          src={assetPath("/watch-gallery/movement-balance.webp")}
          alt="Conceptual macro illustration of a balance wheel and annotated mechanical movement"
          width={2048}
          height={2048}
          loading="lazy"
        />
        <figcaption>
          A STUDY OF THE CRAFT / CONCEPTUAL MOVEMENT ILLUSTRATION
        </figcaption>
      </figure>
      <section className="content-section story-body">
        <span className="story-year" data-editorial-reveal>
          1952
        </span>
        <div data-editorial-reveal>
          <span className="atelier-label">
            A SMALL STALL. A LASTING TRADITION.
          </span>
          <KineticHeading text={"Built on craft.\nCarried by family."} className="kinetic-section"/>
          <p>
            Max Kivel opened Grand Central Watch in 1952. The small terminal
            stall grew into a family business spanning three generations, with a
            dedicated workshop above the terminal.
          </p>
          <p>
            Today, under CEO Steve Kivel, the team combines experienced
            watchmakers, modern equipment, and an extensive archive of vintage
            parts to care for everyday watches and family heirlooms.
          </p>
          <p>
            The boutique also buys and sells selected timepieces. Each watch
            offered for sale is inspected and prepared by the team.
          </p>
          <Link className="editorial-link" href="/visit">
            Find us in the terminal <span>→</span>
          </Link>
        </div>
      </section>
      <section className="heritage-band content-section" data-editorial-reveal>
        <span className="atelier-label">70 YEARS · CELEBRATED IN 2022</span>
        <KineticHeading text={"Some things improve\nwith time."} className="kinetic-section"/>
        <a
          className="editorial-link"
          href="https://centralwatch.com/70th-anniversary-"
        >
          Explore the anniversary archive <span>↗</span>
        </a>
      </section>
    </main>
  );
}
