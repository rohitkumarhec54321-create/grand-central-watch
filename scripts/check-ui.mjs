import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/khushikumari/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:3000';
const manifest=JSON.parse(fs.readFileSync('public/watch-gallery/manifest.json'));
const prefix=new URL(base).pathname.replace(/\/$/,'');
const allowed=new Set(manifest.flatMap(x=>[`${prefix}/watch-gallery/${x.id}.webp`,`${prefix}/watch-gallery/${x.id}-small.webp`]));
const errors=[];fs.mkdirSync('work/ui-qa',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:960},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
 for (const width of [1440,390]) {
  await page.setViewportSize({width,height:width===390?844:960});
  for (const route of ['/','/services','/collection','/shop','/our-story','/visit','/journal','/client-care','/craft']) {
   await page.goto(base+route,{waitUntil:'networkidle'});
   assert.equal(await page.locator('main').count(),1,route);assert.equal(await page.locator('h1').count(),1,route);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${route} overflow at ${width}`);
   for (const src of await page.locator('img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')))) assert(allowed.has(src)||(route==='/'&&src.startsWith(prefix+'/gc01/')),`Unexpected image ${src}`);
   const menu=page.getByRole('button',{name:'Open navigation menu'});await menu.click();await page.getByRole('dialog').waitFor();
   assert(await page.getByRole('navigation',{name:'All pages'}).isVisible());await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});assert(await menu.evaluate(el=>el===document.activeElement));
  }
 }
 await page.goto(base,{waitUntil:'networkidle'});await page.getByRole('button',{name:'Search the site'}).click();
 await page.getByRole('searchbox').fill('warranty');assert(await page.locator('.search-results a').count()>0);
 await page.getByRole('button',{name:'Clear site search'}).click();assert.equal(await page.getByRole('searchbox').inputValue(),'');await page.keyboard.press('Escape');
 await page.locator('#watch-portraits').scrollIntoViewIfNeeded();for(const img of await page.locator('.selected-portrait-grid img').all())await img.evaluate(el=>el.decode());await page.screenshot({path:'work/ui-qa/gallery-mobile.png'});
 assert.equal(await page.locator('[data-gallery-id]').count(),8);
 for (const item of manifest) { const img=page.locator(`[data-gallery-id="${item.id}"] img`);await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode()); }
 await page.getByRole('button',{name:'Inspect The warmth of a classic'}).click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Close image viewer'}).focus();await page.keyboard.press('ArrowLeft');await page.waitForFunction(()=>/08\s*\/\s*8/.test(document.querySelector('.lightbox-controls').textContent));await page.keyboard.press('Escape');
 await page.goto(base+'/collection',{waitUntil:'networkidle'});await page.getByRole('searchbox').fill('no-match-xyz');assert.equal(await page.locator('.product-card').count(),0);await page.getByRole('button',{name:'Clear filters'}).click();assert.equal(await page.locator('.product-card').count(),14);
 await page.locator('.catalog-inspect').first().click();await page.getByRole('dialog').waitFor();assert(await page.getByRole('link',{name:'View official listing'}).isVisible());await page.keyboard.press('Escape');
 await page.screenshot({path:'work/ui-qa/collection-mobile.png'});
 await page.goto(base+'/client-care',{waitUntil:'networkidle'});const q=page.locator('[data-slot=accordion-trigger]').first();await q.click();assert.equal(await q.getAttribute('aria-expanded'),'true');await q.click();assert.equal(await q.getAttribute('aria-expanded'),'false');
 assert.deepEqual(errors,[]);console.log('Passed: nine routes at desktop/mobile sizes, image allowlist, menus and focus restoration, search clearing, eight-image viewer, collection filtering/details and FAQ toggles.');
} finally {await browser.close()}
