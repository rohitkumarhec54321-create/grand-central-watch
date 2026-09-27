# Grand Central Watch — A Study in Time

A concept redesign of Grand Central Watch — NYC's watch repair institution since 1952.

**[Live portfolio](https://rohitkumarhec54321-create.github.io/grand-central-watch/)** · **[Official business website](https://centralwatch.com/)**

This is an **unaffiliated portfolio/concept project**, not the official Grand Central Watch site. GC—01 is an original digital watch study, not a retail product. Product purchases, repair inquiries, and official business information link to centralwatch.com; this project does not accept payments or collect inquiries.

## The experience

- An articulated GC—01 watch assembly with seven scroll-controlled camera chapters, exploded parts, macro views and reassembly.
- Four material finishes with live Three.js color interpolation and a dedicated finish preview.
- A searchable, filterable shop: five featured timepieces, five microbrands and four additional watches/accessories/jewelry listings. Prices, references, and outgoing links are data-driven.
- Scroll-scrubbed split typography, staggered catalog rows, cursor-driven card tilt, magnetic calls to action, sequential diagram line drawing, and a cursor-responsive press strip.
- A heritage and service chapter, three-step repair process, location information, and an eight-publication press strip.
- Eight user-supplied visual studies with responsive WebP assets and an accessible, keyboard-operated image viewer.
- Nine routes: Home, Shop, Collection, Services, Our Story, Craft, Visit, Journal and Client Care. Collection remains available for existing links.

## Technology

Next.js 16 App Router · React 19 · TypeScript · Three.js / glTF · GSAP + ScrollTrigger · Lenis · Tailwind CSS 4 + scoped editorial CSS · Base UI dialogs · GitHub Actions / GitHub Pages.

The watch uses Three.js directly. Camera and assembly transforms follow normalized scroll progress; material interpolation is separate from scroll choreography. There is no backend requirement: Next.js exports static HTML into `out/`.

## Local development

Use Node.js **22.13 or newer** and pnpm **11**.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`. All static assets live under `public/`. The eight selected gallery images are documented in `public/watch-gallery/manifest.json`; the original model and its fallback renders are in `public/gc01/`.

## Build and verify

```sh
pnpm typecheck
pnpm build
node scripts/check-site.mjs
```

To reproduce the GitHub Pages build locally:

```sh
NEXT_PUBLIC_BASE_PATH=/grand-central-watch pnpm build
NEXT_PUBLIC_BASE_PATH=/grand-central-watch node scripts/check-site.mjs
```

`next.config.ts` enables static export, trailing-slash routes and an optional build-time base path. `lib/paths.ts` applies that prefix to media and fetch URLs; Next.js handles its own `Link` routes.

Browser checks are in `scripts/check-ui.mjs`, `scripts/check-gc01-browser.mjs`, and `scripts/check-motion.mjs`. Point `PREVIEW_URL` at the running build, and set `PLAYWRIGHT_MODULE` and `CHROME_PATH` for your local Playwright/Chromium installation. These checks cover desktop/mobile layouts, product filtering, dialog keyboard behavior, motion reversal, the seven film chapters and reduced-motion/network-failure fallbacks.

## Publishing

`.github/workflows/pages.yml` builds and checks the static export on every push to `main`, uploads `out/`, and deploys it to GitHub Pages. In repository Settings → Pages, the publishing source is **GitHub Actions**. The configured project prefix is `/grand-central-watch`; update both the workflow and live link if renaming the repository.

## Accessibility and performance

Motion responds to `prefers-reduced-motion`. Touch devices do not receive magnetic/tilt effects; small screens and data-saving devices use same-model stills instead of loading WebGL. The main film handles loading timeouts, lost WebGL contexts and sustained expensive rendering. The additional finish preview is lazy-initialized near the viewport and renders only while visible. The press strip has a pause control. Native links and buttons, visible focus states, semantic landmarks, image descriptions, dialog focus restoration and filter status announcements remain available throughout.

## Business data and imagery

The 14 catalog listings, prices, founding year, location, service steps and press names were checked against [Grand Central Watch](https://centralwatch.com/) on **September 28, 2026**. Individual source URLs are included in `lib/catalog.json`; prices and inventory are snapshots, not live commerce data. Supporting links include the [repair services](https://centralwatch.com/repair-services), [location](https://centralwatch.com/our-location), and [press archive](https://centralwatch.com/press-articles).

The gallery contains supplied concept/reference renders. It is deliberately separate from the catalog: those images are not represented as photographs of the listed inventory. Movement diagrams are conceptual, not technical servicing instructions. Brand names and trademarks belong to their respective owners; this repository does not imply endorsement or grant rights to third-party imagery.
