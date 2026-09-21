# Grand Central Watch — Longines scroll film

The homepage now features the supplied Longines image (`ChatGPT Image Sep 2, 2026, 07_01_16 AM.png`) and the matching `claud video.mp4` render sequence. The earlier GC—01 model, assets, finish selector and model-generation scripts have been removed.

`components/LonginesLanding.tsx` keeps the ivory art direction and uses the exact supplied photograph for its opening and static fallback. Native scroll moves from a subtle push into the photograph to 131 cached frames covering the dial, crystal/case separation, crown, caseback and luminous finish. This is a pre-rendered image sequence, not a reconstructed GLB from a single photograph. The supplied film determines the motion and resolution.

Frames load in batches of four, only near the section. All frames decode before the extended scroll track activates. Mobile uses 480px frames; desktop uses 720px. A single requestAnimationFrame callback draws only changed frames, with repaint on resize. Reduced motion, low memory, data-saving, a failed load, a 30-second loading timeout, or sustained slow draws restore the supplied static image without the extended pin. Resources and scroll observers are released on unmount.

The perspective selector contains only views of the same Longines watch. The other seven pages and all sixteen supplied images remain available. Run the existing development/build commands below. Browser checks are in `scripts/check-longines-browser.mjs`.

## Earlier standalone sequence component

# Grand Central Watch — ScrollWatchSequence

Next.js 16 App Router, TypeScript, Tailwind CSS 4, GSAP ScrollTrigger, and Lenis. The expanded luxury website includes eight routes. The live centralwatch.com website was not modified; transactions continue through its real inquiry, shop, account, and contact destinations.

## Run

```sh
pnpm install
pnpm dev
pnpm build
```

The production build is a static Next.js export in `out/`. Serve that directory with any static web server. `next start` is not used for static exports.

## Drop into an existing Next.js page

Copy `components/ScrollWatchSequence.tsx`, `components/ScrollWatchSequence.css`, `components/ui/progress.tsx`, `components/ui/toggle.tsx`, `lib/utils.ts`, and `public/watch-sequence/` to your project. The small UI primitives use the starter's `@/lib/utils` alias. Install `gsap`, `lenis`, `@base-ui/react`, `class-variance-authority`, `clsx`, and `tailwind-merge`. Tailwind CSS 4 should already be configured in your host page.

```tsx
import ScrollWatchSequence from '@/components/ScrollWatchSequence';

export default function Page() {
  return (
    <main>
      <Hero />
      <ScrollWatchSequence />
      <SimpleAtFirstGlance />
    </main>
  );
}
```

Load Playfair Display with normal and italic styles through `next/font/google` in your layout and apply its `--font-playfair` variable to the body. The component falls back to Georgia. Optional font variables are `--font-geist-sans` and `--font-geist-mono`. See `app/layout.tsx` for a complete example.

Keep the sticky component outside ancestors with overflow scrolling, transforms, or containment that establish a different scrolling context. Its own CSS is scoped with `watch-` names. Page progress is portaled to `document.body` to remain at the full-page edge.

### Existing smooth-scroll setup

The component creates and cleans up a page-level Lenis instance by default. If your site already owns Lenis, pass that instance through `lenisInstance`, or use `smoothScroll={false}` and let your existing scroll provider drive the document. Mount only one page progress indicator (`showPageProgress={false}` hides duplicates).

```tsx
<ScrollWatchSequence smoothScroll={false} scrollScreens={5.5} />
```

The tracker and chips are chapter navigation buttons. They seek immediately to the corresponding scroll position. Ordinary scrolling remains smooth through Lenis; frames map directly to that actual position with no extra easing.

## Supplied footage and limitations

- Default source: **claud video.mp4**, 26.12 seconds, 720×720, 25 fps. It is not the 30-second source described in the brief.
- Extracted **131 WebP frames** at 5 fps, named `frame_0001.webp` through `frame_0131.webp`. Desktop frames retain the source's 720px resolution. Mobile frames are 480px.
- The supplied reel's actual order is dial/front views → case/crystal explosion → detail of separated case layers → exterior/crown macros → caseback → assembled watch/lume. It does not contain the exact requested movement/gears macro or a continuous final reassembly collapse. Extraction preserves this footage; it does not create missing 3D shots.
- `watch-assembly-cinematic.mp4` is 14.37 seconds and depicts the different carbon-lume watch seen in the reference images. It has not been mixed into the Longines sequence.
- The requested carbon-lume eyebrow is retained verbatim as art direction; it is not a material specification for the depicted Longines watch.
- The exact provided step labels are retained. Their descriptions and frame thresholds follow the available footage. Supply a revised reel for the precise six-shot narrative, then update `chapters` and `totalFrames`.
- The ticking sound is a locally generated, seamless two-second mechanical-style loop. Playback begins only when the visitor enables sound; it pauses when the section exits or the tab is hidden.

### Default chapter thresholds (zero-based frames)

| Step | Frame | Approximate source time |
|---|---:|---:|
| Orbit Open | 0 | 0s |
| Crystal Lift | 30 | 6s |
| Axis Rebuild | 44 | 8.8s |
| Macro Seal | 61 | 12.2s |
| Inspect | 84 | 16.8s |
| Reassemble | 108 | 21.6s |

## Asset preparation

Use Python with Pillow and FFmpeg installed:

```sh
python scripts/prepare-watch-assets.py '/path/to/reel.mp4'
# Optional: --ffmpeg /absolute/path/to/ffmpeg
```

The script samples evenly across the full duration, selects 120–150 frames near 5 fps, and creates desktop/mobile WebPs, a poster, and a manifest. After replacing a source, set the component's `totalFrames` from that manifest and review chapter thresholds. `framePath`, `mobileFramePath`, `poster`, `audioSrc`, and `chapters` can also point to a CDN or alternate sequence. Cross-origin frame URLs must permit CORS.

## Performance and accessibility

- IntersectionObserver starts loading within one viewport of the section. Six simultaneous fetch/decode operations at most. Only the poster loads before proximity.
- All selected-resolution frames are decoded into a cache before interaction. A minimal progress indicator stays visible until ready. The 720px cache can occupy about 259 MiB decoded; the 480px mobile cache about 115 MiB. WebP transfer is much smaller. Devices reporting 2 GB RAM or less use the still view.
- ScrollTrigger `onUpdate` sets `Math.round(progress * (totalFrames - 1))`; a single queued `requestAnimationFrame` draws that frame. Duplicate indices are skipped. Resize redraws are intentional.
- Canvas scales to cover its centered visual area. Backing pixels are capped at 1600px on the longest edge and DPR 1.5.
- Eight slow draws (>24 ms) in a 24-draw window trigger a static-image fallback. Canvas/decode/network failures, Save-Data, reduced motion, and `forceStatic` also use the static view. Runtime timing is a heuristic; test on your target devices.
- Static mode removes the extended scroll distance and chapter controls. Captions do not animate for reduced motion. Preference changes toward reduced motion apply immediately; reload to re-enable animation.
- Fetches, image bitmaps, observers, RAF callbacks, owned Lenis, and component-owned ScrollTriggers are cleaned up on unmount. No global trigger destruction or GSAP ticker settings are used.
- Audio is off by default. Navigation uses native keyboard-accessible buttons with focus rings and current-step semantics.

## Verification

Production build and TypeScript checking are included in the delivery validation. Asset counts, decoding, and chapter boundaries are checked separately. Physical-device performance has not been measured.

## Expanded visual field notes

`components/WatchDetails.tsx` and its scoped `WatchDetails.css` add four editorial sections on `/craft`: carbon-lume assembly, movement anatomy, Longines exterior studies, and separate IWC/Hublot design references. All 16 supplied images appear on that page with descriptive captions and alt text. Every image opens a full-screen accessible dialog with previous/next controls, left/right arrow navigation, Escape dismissal, and focus restoration.

The image viewer uses `components/ui/dialog.tsx`, `components/ui/button.tsx`, and `lucide-react`, in addition to the shared UI dependencies. Copy `public/watch-gallery/` when integrating the expanded sections. A source-to-asset mapping is recorded in `public/watch-gallery/manifest.json`. `scripts/prepare-gallery.py` produces 900px responsive previews and full images up to 1920px without cropping their compositions.

The 32 optimized gallery WebPs total approximately 3.8 MiB; each visitor loads the appropriate responsive size, with full images requested when needed. Gallery images are lazy-loaded and have intrinsic dimensions to preserve layout. The primary 131-frame Longines component remains available separately.

The educational copy describes general mechanical principles, with an on-page link to Longines’ explanation of mechanical movements. Supplied concept diagrams and their embedded annotations are not presented as verified model specifications or service instructions.

## Atelier redesign

The third version introduces a full studio hero, centered wordmark, Cormorant Garamond editorial typography, muted metallic labels, and an ivory/obsidian palette. Playfair Display remains the scroll section’s display face. The sequence canvas now uses a deliberate square studio frame capped at 720px, preventing the excessive enlargement and arbitrary cropping visible in the supplied screen recording. Chapter changes use a brief entrance dissolve with immediate removal of inactive captions, avoiding overlapping text during fast scrubbing.

All 16 reference images remain available in asymmetric editorial compositions and the full-screen viewer. `components/EditorialMotion.tsx` provides restrained entrance animations through GSAP with reduced-motion support and cleanup. Include this file and the updated `app/layout.tsx`, `app/globals.css`, and both component stylesheets when using the complete redesigned demo.

## Complete atelier expansion (September 9, 2026)

Eight static routes: home, service/restoration, collection, our story, visit/contact, journal, client care, and craft. `CONTENT-SOURCES.md` maps the content to official sources and documents the dated 14-product snapshot. The native store retains full inventory, account, checkout, inquiry, and newsletter operations.

The site includes a full-screen keyboard-accessible menu, site search, category filtering, combined brand/reference searches, price sorting, product inspection dialogs, a searchable 43-brand directory, grouped animated FAQs, a New York local clock, address copying with an error state, and the full client resource directory.

Motion now spans hero staging, route entrance reveals, image masks and scale settles, service steps, statistic reveals, navigation entrances, hover inspection, product filtering entrances, accordion height transitions, links, and a global page-progress indicator. `EditorialMotion` owns a single Lenis provider. `WatchExperience` passes it to the independent sequence component to prevent competing smooth-scroll instances and synchronize chapter jumps. All motion respects reduced-motion settings.

Fixed stalled-loading fallback (45-second maximum), asynchronous audio cancellation after leaving the section, external Lenis listener cleanup, short-viewport static fallback, mobile control positioning, and the gallery return link after its move to `/craft`. Body-size changes refresh scroll distances through ResizeObserver, including FAQ expansion and filtered catalog changes.

Validation: production static build and TypeScript passed; scoped correctness/accessibility lint passed; `scripts/check-site.mjs` checks every generated internal page link and anchor, image path, all 16 studies, catalog search/category/sort/empty states, and address separation. `scripts/check-sequence.mjs` verifies all forward/reverse frame mappings and chapter boundaries. Browser interaction and physical-device performance testing remain unperformed.
