/* eslint-disable next/no-img-element -- Images are pre-optimized WebP assets for the static export. */
'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './ui/dialog';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import catalog from '@/lib/catalog.json';
export type Product = (typeof catalog)[number];
export const currency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
export function filterProducts(
  items: Product[],
  category: string,
  query: string,
  sort: string,
) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const result = items.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      words.every((word) =>
        `${p.name} ${p.model}`.toLowerCase().includes(word),
      ),
  );
  return sort === 'low'
    ? result.sort((a, b) => a.price - b.price)
    : sort === 'high'
      ? result.sort((a, b) => b.price - a.price)
      : result;
}
export default function CollectionExplorer({
  preview = false,
}: {
  preview?: boolean;
}) {
  const [category, setCategory] = useState('all'),
    [query, setQuery] = useState(''),
    [sort, setSort] = useState('featured');
  const [selected, setSelected] = useState<Product | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const shown = preview
    ? catalog.slice(0, 3)
    : filterProducts(catalog, category, query, sort);
  const categories = [
    ['all', 'All pieces'],
    ['pre-owned', 'Featured Timepieces'],
    ['micro-brand', 'Microbrands'],
    ['accessories', 'More to Explore'],
  ];
  const grid = useRef<HTMLDivElement>(null);
  const signature = shown.map(p => p.id).join(',');
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const cards = Array.from(grid.current!.querySelectorAll<HTMLElement>('.product-card'));
      // Each row has its own range, so lower rows remain readable on tall grids.
      const columns = innerWidth < 700 ? 1 : innerWidth < 1100 ? 2 : 3;
      for (let i = 0; i < cards.length; i += columns) {
        const row = cards.slice(i, i + columns);
        gsap.fromTo(row, { y: 65, opacity: .1 }, { y: 0, opacity: 1, stagger: .14, ease: 'none',
          scrollTrigger: { trigger: row[0], start: 'top 98%', end: 'top 62%', scrub: true } });
      }
    });
    return () => media.revert();
  }, [signature]);
  return (
    <div className="collection-explorer">
      {!preview && (
        <>
          <fieldset
            className="filter-categories"
            aria-label="Filter collection"
          >
            {categories.map(([id, label]) => (
              <button
                key={id}
                aria-pressed={category === id}
                onClick={() => setCategory(id)}
              >
                {label}
              </button>
            ))}
          </fieldset>
          <div className="collection-controls">
            <label className="inline-search">
              <Search size={18} />
              <span className="sr-only">Search featured collection</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by brand or reference"
              />
            </label>
            <label className="sort-control">
              Sort by{' '}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </label>
          </div>
          {(query || category !== 'all' || sort !== 'featured') && (
            <button
              className="clear-filters"
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('all');
                setSort('featured');
              }}
            >
              Clear filters <X size={14} />
            </button>
          )}
          <p className="result-count" aria-live="polite">
            {shown.length} {shown.length === 1 ? 'piece' : 'pieces'} in this
            selection
          </p>
        </>
      )}
      <div className="product-grid catalog-text-grid" ref={grid}>
        {shown.map((p, i) => (
          <article key={p.id} className="product-card">
            <button className="catalog-inspect" type="button"
              onPointerMove={event => {
                if (!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
                const el = event.currentTarget, rect = el.getBoundingClientRect();
                gsap.to(el, { '--tilt-x': `${-(event.clientY - rect.top - rect.height / 2) / rect.height * 9}deg`, '--tilt-y': `${(event.clientX - rect.left - rect.width / 2) / rect.width * 9}deg`, duration: .35, overwrite: true });
              }}
              onPointerLeave={event => gsap.to(event.currentTarget, { '--tilt-x': '0deg', '--tilt-y': '0deg', duration: .8, ease: 'elastic.out(1,.5)', overwrite: true })}
              onClick={event => { opener.current = event.currentTarget; setSelected(p); }}
              aria-label={`Inspect ${p.name} ${p.model}`}>
              <span className="catalog-card-top"><small>{categories.find(([id]) => id === p.category)?.[1]}</small><span>{String(i + 1).padStart(2, '0')}</span></span>
              <span className="catalog-reference"><strong>{p.name}</strong><span>{p.model || 'Selected by Grand Central Watch'}</span></span>
              <span className="catalog-description">{p.description}</span>
              <span className="catalog-card-bottom"><span className="catalog-price">{currency(p.price)}</span><span className="catalog-arrow" aria-hidden="true">↗</span></span>
              <span className="catalog-inspect-label">INSPECT THE PIECE</span>
            </button>
          </article>
        ))}
      </div>
      {!shown.length && (
        <div className="empty-selection">
          <h3>A different reference?</h3>
          <p>
            Try another search, or ask the atelier about pieces beyond the
            online collection.
          </p>
          <button
            className="solid-link"
            onClick={() => {
              setCategory('all');
              setQuery('');
              setSort('featured');
            }}
          >
            Reset the selection
          </button>
        </div>
      )}
      <p className="catalog-note">
        Official listings verified September 28, 2026. Prices are in USD.
        Confirm current price, condition, and availability on the individual
        listing.
      </p>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          className="atelier-dialog product-dialog product-dialog-text"
          finalFocus={opener}
          showCloseButton={false}
          data-lenis-prevent
        >
          <DialogClose
            className="product-close icon-button"
            aria-label="Close product details"
          >
            <X size={23} />
          </DialogClose>
          {selected && (
            <>
              <div className="product-dialog-copy">
                <span className="atelier-label">
                  THE GRAND CENTRAL WATCH COLLECTION
                </span>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>
                  {selected.model || 'Selected by Grand Central Watch'}
                </DialogDescription>
                <p className="product-price">{currency(selected.price)}</p>
                <p>
                  {selected.description} Explore the official listing for specifications and current availability.
                </p>
                <a className="solid-link" href={selected.url}>
                  View official listing <ArrowUpRight size={17} />
                </a>
                <small>Continue to centralwatch.com</small>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
