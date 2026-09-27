import assert from 'node:assert/strict';
import fs from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/Users/khushikumari/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const errors = [];
fs.mkdirSync('work/motion-qa', { recursive: true });
try {
 const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
 page.on('pageerror', e => errors.push(e.message));
 await page.goto(base + '/shop/', { waitUntil: 'networkidle' });
 assert.equal(await page.locator('.product-card').count(), 14);
 for (const [name, count] of [['Featured Timepieces', 5], ['Microbrands', 5], ['More to Explore', 4]]) {
  await page.getByRole('button', { name, exact: true }).click();
  assert.equal(await page.locator('.product-card').count(), count);
 }
 await page.getByRole('button', { name: 'All pieces', exact: true }).click();
 await page.getByRole('searchbox').fill('PAM01313');
 assert.equal(await page.locator('.product-card').count(), 1);
 assert((await page.locator('.catalog-price').textContent()).includes('6,500'));
 await page.getByRole('button', { name: 'Clear filters' }).click();
 const card = page.locator('.catalog-inspect').first(); await card.scrollIntoViewIfNeeded();
 const rect = await card.boundingBox(); await page.mouse.move(rect.x + rect.width * .8, rect.y + rect.height * .25);
 await page.waitForTimeout(450);
 assert.notEqual(await card.evaluate(el => getComputedStyle(el).getPropertyValue('--tilt-y').trim()), '0deg');
 await card.click(); await page.getByRole('dialog').waitFor();
 assert((await page.getByRole('link', { name: 'View official listing' }).getAttribute('href')).startsWith('https://centralwatch.com/'));
 await page.keyboard.press('Escape');
 await page.screenshot({ path: 'work/motion-qa/shop-desktop.png' });
 await page.goto(base, { waitUntil: 'networkidle' });
 const heading = page.locator('#shop-title .kinetic-word').first();
 const moveHeading = async fraction => {
  await page.evaluate(f => { const el=document.querySelector('#shop-title'); scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * f); }, fraction);
  await page.waitForTimeout(250);
  return heading.evaluate(el => getComputedStyle(el).transform);
 };
 const before = await moveHeading(.9), after = await moveHeading(.45), reversed = await moveHeading(.9);
 assert.notEqual(before, after, 'Typography must follow scroll position'); assert.equal(before, reversed, 'Typography must reverse with scroll');
 await page.evaluate(() => { const el=document.querySelector('#shop');scrollTo(0,el.getBoundingClientRect().top+scrollY+350); });
 await page.waitForTimeout(300); await page.screenshot({ path: 'work/motion-qa/home-shop-desktop.png' });
 const diagram = page.locator('.diagram-callout path').first();
 await page.evaluate(() => {const el=document.querySelector('.movement-diagram');scrollTo(0,el.getBoundingClientRect().top+scrollY-innerHeight*.8)});
 await page.waitForTimeout(200); const lineBefore=await diagram.evaluate(el=>getComputedStyle(el).strokeDashoffset);
 await page.evaluate(() => {const el=document.querySelector('.movement-diagram');scrollTo(0,el.getBoundingClientRect().bottom+scrollY-innerHeight*.4)});
 await page.waitForTimeout(200); assert.notEqual(await diagram.evaluate(el=>getComputedStyle(el).strokeDashoffset),lineBefore);
 await page.locator('#heritage').scrollIntoViewIfNeeded();await page.screenshot({ path:'work/motion-qa/heritage-desktop.png' });
 await page.locator('.press-cinema').scrollIntoViewIfNeeded();
 await page.getByRole('button',{name:'Pause press motion'}).click();
 const still=await page.locator('.press-track').evaluate(el=>el.style.transform);await page.waitForTimeout(250);
 assert.equal(await page.locator('.press-track').evaluate(el=>el.style.transform),still);
 await page.getByRole('button',{name:'Resume press motion'}).click();
 await page.waitForTimeout(250);assert.notEqual(await page.locator('.press-track').evaluate(el=>el.style.transform),still);
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});
 await page.locator('#shop-title').scrollIntoViewIfNeeded();
 assert.equal(await page.locator('#shop-title .kinetic-word').first().evaluate(el=>getComputedStyle(el).transform),'none');
 assert.equal(await page.locator('.press-copy').first().evaluate(el=>getComputedStyle(el).flexWrap),'wrap');
 assert.deepEqual(errors,[]);
 console.log('Passed: 14 products, 5/5/4 categories, reference search, product tilt, official-link modal, reversible kinetic type, sequential diagram scrubbing, press pause/resume and reduced-motion behavior.');
} finally { await browser.close(); }
