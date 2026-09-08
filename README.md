# Grand Central Watch — ScrollWatchSequence

Next.js 16 App Router, TypeScript, Tailwind CSS 4, GSAP ScrollTrigger, and Lenis. A standalone integration demo is in `app/page.tsx`; the live centralwatch.com website was not modified.

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

Production build and TypeScript checking are included in the delivery validation. Asset counts, decoding, and chapter boundaries are checked separately. Browser interaction and device-performance testing have not been performed.

## Expanded visual field notes

`components/WatchDetails.tsx` and its scoped `WatchDetails.css` add four editorial sections after “Simple at first glance”: carbon-lume assembly, movement anatomy, Longines exterior studies, and separate IWC/Hublot design references. All 16 supplied images appear in the page with descriptive captions and alt text. Every image opens a full-screen accessible dialog with previous/next controls, left/right arrow navigation, Escape dismissal, and focus restoration.

The image viewer uses `components/ui/dialog.tsx`, `components/ui/button.tsx`, and `lucide-react`, in addition to the shared UI dependencies. Copy `public/watch-gallery/` when integrating the expanded sections. A source-to-asset mapping is recorded in `public/watch-gallery/manifest.json`. `scripts/prepare-gallery.py` produces 900px responsive previews and full images up to 1920px without cropping their compositions.

The 32 optimized gallery WebPs total approximately 3.8 MiB; each visitor loads the appropriate responsive size, with full images requested when needed. Gallery images are lazy-loaded and have intrinsic dimensions to preserve layout. The primary 131-frame Longines interaction is unchanged.

The educational copy describes general mechanical principles, with an on-page link to Longines’ explanation of mechanical movements. Supplied concept diagrams and their embedded annotations are not presented as verified model specifications or service instructions.
