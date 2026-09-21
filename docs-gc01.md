# GC—01 cinematic product study

The homepage is an original digital design study, explicitly identified as a concept. It does not invent specifications, prices, availability or a retail relationship for Grand Central Watch. The inquiry links lead to the existing visit and collection pages. The existing business pages and the full supplied-image gallery at `/craft` remain available.

## Interaction

`components/GC01Landing.tsx` uses native page scrolling and GSAP ScrollTrigger. A sticky full-viewport stage contains a lazily imported Three.js scene. Seven editorial chapters share a deterministic camera and part-position timeline. Scroll updates set the current pose immediately; a requestAnimationFrame loop draws it and adds a small idle movement. There is no smooth-scroll controller or eased scrub delay on this page.

The GLB contains 28 independently animated assemblies: case, bezel, crystal, dial, hands, crown, movement, caseback and twenty bracelet links. Submeshes are batched by material within each assembly. The original asset is approximately 2.8 MiB, 60 meshes and 62,224 triangles. The script `scripts/create-gc01-model.mjs` regenerates it; `public/gc01/model-manifest.json` lists the parts.

Four finishes update the same model's materials and use matching rendered WebP thumbnails. All finish controls, chapter controls, the design-notes disclosure and navigation are keyboard accessible. Footer navigation retains the existing routes.

## Performance and accessibility

Three.js and the GLB are not loaded for widths below 900px, reduced motion, data saving or devices reporting two or fewer logical processors. Mobile uses four still-render chapters. Reduced motion/data-saving and failed or persistently slow WebGL use an unpinned static hero. The static details below the film remain available in all modes. A failed model request times out after 15 seconds. Context loss falls back to the static view. Rendering pauses while offscreen or hidden; idle rendering is capped near 30 fps, with current scroll changes drawn on the next animation frame. Pixel ratio is capped at 1.5. All observers, triggers, frame callbacks and GPU resources are cleaned up on unmount.

## Regenerating renders

Run `node scripts/create-gc01-model.mjs`, then `node scripts/render-gc01.mjs`. The latter needs Playwright and a local Chromium/Chrome executable; provide `PLAYWRIGHT_MODULE` and `CHROME_PATH` if they differ from the defaults in the script. The renderer shares the live scene and camera timeline, outputs PNGs. Convert these to WebP with Pillow (quality 91, method 6) or an equivalent encoder, then remove the PNG intermediates from public assets. Publish only the WebP renders and GLB.

The geometry and visual direction are original work generated for this project. The lettering uses Three.js's Helvetiker regular example font, available at https://threejs.org/examples/fonts/helvetiker_regular.typeface.json. Its embedded typeface license and copyright remain in the JSON source. No supplied photo is presented as a render of the concept model. All earlier supplied images remain in the separate craft gallery.
