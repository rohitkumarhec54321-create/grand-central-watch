/* eslint-disable next/no-img-element -- Images are pre-optimized WebP assets for the static export. */
'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog';
import './WatchDetails.css';

export const GALLERY = [
  {
    id: 'gold-dress',
    title: 'The warmth of a classic',
    family: 'Gold-tone dress watch · concept study',
    detail:
      'A forest-green dial meets gold-toned Roman numerals, a fine red seconds hand, and burgundy leather. Warm light traces the round case and the texture of the strap.',
    alt: 'Gold-toned dress watch with a forest-green Roman numeral dial, red seconds hand and burgundy leather strap against a warm dark backdrop',
    width: 1672,
    height: 941,
  },
  {
    id: 'iwc-portrait',
    title: 'A different kind of instrument',
    family: 'IWC · design reference',
    detail:
      'An olive dial and textile strap give this chronograph study a distinct character. Three subdials, a day-date display, and two pushers add visual complexity around the central hands.',
    alt: 'Three-quarter IWC chronograph rendering with olive dial, three subdials and green textile strap',
    width: 1402,
    height: 1122,
  },
  {
    id: 'longines-front',
    title: 'A face made to be read',
    family: 'Longines · exterior study',
    detail:
      'Cream-colored numerals and broad hands stand out against the black dial. The small-seconds display sits below the center, while a ridged bezel frames the composition.',
    alt: 'Front rendering of a Longines watch with black dial, cream numerals and a brown leather strap',
    width: 1122,
    height: 1402,
  },
  {
    id: 'movement-overview',
    title: 'The rhythm beneath the dial',
    family: 'Movement study',
    detail:
      'A close view brings the gear train, ruby-colored bearings, and coiled regulating assembly into focus. The luminous annotations guide the eye through this conceptual mechanism.',
    alt: 'Annotated macro rendering of gold gears, jewel bearings and an escapement inside a dark watch',
    width: 2048,
    height: 2048,
  },
  {
    id: 'movement-balance',
    title: 'An oscillating heart',
    family: 'Movement study · 03',
    detail:
      'A tightly coiled spring and gold-colored balance rim dominate this close-up. Surrounding annotations identify neighboring components and make the depth of the assembly visible.',
    alt: 'Detailed illustration of a gold balance wheel and coiled spring with jewel bearings and gear train labels',
    width: 2048,
    height: 2048,
  },
  {
    id: 'movement-architecture',
    title: 'A map of the mechanism',
    family: 'Movement study · 01',
    detail:
      'This annotated illustration places the gear train, escapement, balance assembly, and bearings in one view. Use it as a visual guide to the vocabulary of a mechanical movement.',
    alt: 'Annotated movement illustration labeling gear train, escapement, jewel bearings, mainspring and balance wheel',
    width: 2048,
    height: 2048,
  },
  {
    id: 'movement-energy',
    title: 'Follow the path of energy',
    family: 'Movement study · 02',
    detail:
      'Gold-toned wheels sit between the larger assemblies, with a turquoise line connecting points of interest. The composition helps distinguish the transmission train from the regulating parts.',
    alt: 'Macro movement illustration with gold gears, purple jewel bearings and a turquoise energy-path overlay',
    width: 2048,
    height: 2048,
  },
  {
    id: 'movement-hairspring',
    title: 'The finest line',
    family: 'Movement study · 04',
    detail:
      'The hairspring is the visual center of this study: a fine spiral within the balance assembly. Nearby wheels and bearing points provide a sense of its scale within the movement.',
    alt: 'Annotated schematic-style movement rendering highlighting the hairspring, balance wheel, escapement and jewel bearings',
    width: 2048,
    height: 2048,
  },
] as const;

export default function WatchDetails() {
  const [selected, setSelected] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const item = selected === null ? null : GALLERY[selected];
  const move = (direction: number) =>
    setSelected((index) =>
      index === null
        ? null
        : (index + direction + GALLERY.length) % GALLERY.length,
    );
  const photo = (index: number, className = '') => {
    const entry = GALLERY[index];
    return (
      <figure
        className={`detail-photo ${className}`}
        key={entry.id}
        data-gallery-id={entry.id}
      >
        <button
          type="button"
          className="detail-image-button"
          aria-label={`Inspect ${entry.title}`}
          onClick={(event) => {
            opener.current = event.currentTarget;
            setSelected(index);
          }}
        >
          <img
            src={`/watch-gallery/${entry.id}-small.webp`}
            srcSet={`/watch-gallery/${entry.id}-small.webp 900w, /watch-gallery/${entry.id}.webp ${Math.min(1920, entry.width)}w`}
            sizes={
              className.includes('wide')
                ? '(max-width: 767px) 90vw, 88vw'
                : '(max-width: 767px) 90vw, 44vw'
            }
            width={entry.width}
            height={entry.height}
            loading="lazy"
            decoding="async"
            alt={entry.alt}
          />
          <span className="detail-expand" aria-hidden="true">
            INSPECT <span>↗</span>
          </span>
        </button>
        <figcaption>
          <span className="detail-kicker">{entry.family}</span>
          <h3>{entry.title}</h3>
          <p>{entry.detail}</p>
        </figcaption>
      </figure>
    );
  };
  return (
    <div className="watch-details">
      <nav className="detail-index" aria-label="Gallery sections">
        <span>THE SELECTED STUDIES · 08 IMAGES</span>
        <a href="#watch-portraits">01 / Timepieces</a>
        <a href="#movement-anatomy">02 / The movement</a>
      </nav>
      <section
        className="detail-section selected-portraits"
        id="watch-portraits"
        aria-labelledby="portraits-title"
      >
        <div className="detail-section-heading">
          <div>
            <p className="detail-kicker">01 / THREE EXPRESSIONS</p>
            <h2 id="portraits-title">
              The face of
              <br />
              <em>time.</em>
            </h2>
          </div>
          <p className="detail-lede">
            Gold-toned warmth. An olive chronograph. Steel and leather. Three
            visual studies, each with its own character. Select an image to look
            closer.
          </p>
        </div>
        <div className="selected-portrait-grid">
          {[0, 1, 2].map((index) => photo(index))}
        </div>
      </section>
      <section
        className="detail-section movement-section"
        id="movement-anatomy"
        aria-labelledby="movement-title"
      >
        <div className="detail-section-heading">
          <div>
            <p className="detail-kicker">02 / BENEATH THE DIAL</p>
            <h2 id="movement-title">
              A world
              <br />
              <em>within.</em>
            </h2>
          </div>
          <p className="detail-lede">
            Five close studies of the gear train, balance, hairspring and jewel
            bearings. Open each image to explore its annotations without
            cropping.
          </p>
        </div>
        <div className="selected-movement-feature">{photo(3)}</div>
        <div className="detail-grid selected-movement-grid">
          {[4, 5, 6, 7].map((index) => photo(index))}
        </div>
        <p className="detail-image-note">
          Conceptual illustrations; the annotations are visual studies, not
          verified service specifications.
        </p>
        <div className="detail-end">
          <Link href="/#watch-sequence">
            Return to the watch film <span>↑</span>
          </Link>
        </div>
      </section>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          className="detail-lightbox"
          showCloseButton={false}
          finalFocus={opener}
          data-lenis-prevent
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              move(1);
            }
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              move(-1);
            }
          }}
        >
          {item && (
            <>
              <div className="lightbox-header">
                <span className="detail-kicker">{item.family}</span>
                <DialogClose
                  className="lightbox-close"
                  aria-label="Close image viewer"
                >
                  CLOSE <span>×</span>
                </DialogClose>
              </div>
              <div className="lightbox-image">
                <img
                  src={`/watch-gallery/${item.id}.webp`}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                />
              </div>
              <div className="lightbox-bottom">
                <div>
                  <DialogTitle className="lightbox-title">
                    {item.title}
                  </DialogTitle>
                  <DialogDescription className="lightbox-description">
                    {item.detail}
                  </DialogDescription>
                </div>
                <div className="lightbox-controls">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <span aria-live="polite">
                    {String((selected ?? 0) + 1).padStart(2, '0')} /{' '}
                    {GALLERY.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    aria-label="Next image"
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
