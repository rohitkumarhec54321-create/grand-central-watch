# Grand Central Watch

An eight-page Next.js website featuring the restored GC—01 3D watch film. Scroll drives its camera, assembly explosion, detail passes, and reassembly. Four finish swatches update the watch; an idle-motion control pauses the ambient movement. GC—01 is an original digital concept, not a retail product.

## Images

The gallery contains only the eight images in the latest user upload: the gold-tone dress watch, IWC portrait, Longines front portrait, and five movement studies. Optimized assets and their source mapping live in `public/watch-gallery/`. All eight appear on the homepage and `/craft`, with an accessible full-size viewer. Services and story pages reuse the supplied movement illustrations with accurate descriptions.

The restored animation keeps its own rendered mobile and reduced-motion fallbacks in `public/gc01/`; these are part of the GC—01 presentation. The replacement Longines frame sequence, unrelated gallery images, and external catalog/workshop photography have been removed. Collection listings retain their text, search, filters, prices, and links to the official store, without substituting unrelated watch images.

## Development

Requires Node.js 22.13 or newer and pnpm. Run `pnpm install`, then `pnpm dev`. `pnpm build` produces the static export in `out/`.

Core implementation: `components/GC01Landing.tsx`, `lib/gc01/scene.ts`, `lib/gc01/config.ts`. Shared navigation and search: `components/SiteHeader.tsx`. Shared reading, focus, touch-target, and responsive styles: `app/experience.css`. Image gallery: `components/WatchDetails.tsx`.

## Validation

- `pnpm typecheck` checks TypeScript.
- `node scripts/check-site.mjs` checks the built routes, local links, anchors, supplied images, and catalog filter logic.
- `pnpm check:experience` checks the 3D film and fallbacks against the local preview. The browser script accepts `PREVIEW_URL`, `CHROME_PATH`, and `PLAYWRIGHT_MODULE` overrides.

Existing routes: `/`, `/services`, `/collection`, `/our-story`, `/visit`, `/journal`, `/client-care`, `/craft`. The official centralwatch.com site is unchanged. Contact, purchase, and service requests continue through its linked destinations. Historic catalog prices are dated in the interface.

Sites hosting remains owner-private and uses the existing project in `.openai/hosting.json`. GitHub publication requires a separate authenticated GitHub session.
