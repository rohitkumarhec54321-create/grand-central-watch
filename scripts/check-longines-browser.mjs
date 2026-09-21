import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || '/Users/khushikumari/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:3000';
fs.mkdirSync('work/longines-qa',{recursive:true});
const errors=[];const modelRequests=[];
const inspect=page=>{page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/gc01/')||r.url().endsWith('.glb'))modelRequests.push(r.url())})};
try{
 const page=await browser.newPage({viewport:{width:1440,height:960}});inspect(page);
 await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>document.querySelector('.longines')?.dataset.mode==='ready');
 await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.frame==='0');
 assert.equal(await page.locator('.lw-hero').getAttribute('src'),'/watch-gallery/longines-perspective.webp');
 assert.equal(await page.locator('h1').count(),1);
 assert(!(await page.locator('body').innerText()).includes('GC—01'));
 await page.screenshot({path:'work/longines-qa/desktop-hero.png'});
 for(const p of [.4,.67,1,.12,0]){
  await page.evaluate(p=>{const f=document.querySelector('.lw-film');scrollTo(0,f.offsetTop+(f.offsetHeight-innerHeight)*p)},p);
  const expected=Math.round(Math.max(0,Math.min(1,(p-.12)/.88))*130);
  await page.waitForFunction(expected=>Number(document.querySelector('canvas').dataset.frame)===expected,expected);
 }
 await page.getByRole('button',{name:'CRYSTAL & CASE',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('canvas').dataset.frame==='30');
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.lw-note')).opacity==='1');
 await page.screenshot({path:'work/longines-qa/desktop-exploded.png'});
 await page.locator('#perspectives').scrollIntoViewIfNeeded();
 await page.getByRole('button',{name:'The dial',exact:false}).click();
 assert.equal(await page.locator('.lw-perspective-image img').getAttribute('src'),'/watch-gallery/longines-front.webp');
 await page.getByRole('button',{name:'The caseback',exact:false}).click();
 assert((await page.locator('.lw-perspective-image img').getAttribute('src')).includes('frame_0090'));
 assert.equal(await page.locator('.lw-view-buttons button[aria-pressed="true"]').count(),1);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});inspect(mobile);
 const mobileFrames=[];mobile.on('request',r=>{if(r.url().includes('/watch-sequence/mobile/'))mobileFrames.push(r.url())});
 await mobile.goto(base,{waitUntil:'networkidle'});await mobile.waitForFunction(()=>document.querySelector('.longines')?.dataset.mode==='ready');
 await mobile.screenshot({path:'work/longines-qa/mobile-hero.png'});
 assert.equal(mobileFrames.length,131);assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await mobile.getByRole('button',{name:'THE REVERSE SIDE',exact:true}).click();await mobile.waitForFunction(()=>document.querySelector('canvas').dataset.frame==='84');
 const reduced=await browser.newPage({viewport:{width:1440,height:960},reducedMotion:'reduce'});inspect(reduced);const requests=[];reduced.on('request',r=>{if(/watch-sequence\/(frames|mobile)/.test(r.url()))requests.push(r.url())});
 await reduced.goto(base,{waitUntil:'networkidle'});await reduced.waitForFunction(()=>document.querySelector('.longines')?.dataset.mode==='static');assert.equal(requests.length,0);assert(await reduced.evaluate(()=>document.querySelector('.lw-film').offsetHeight<=innerHeight+1));
 const failed=await browser.newPage({viewport:{width:1440,height:960}});inspect(failed);await failed.route('**/watch-sequence/frames/frame_0001.webp',r=>r.abort());await failed.goto(base,{waitUntil:'networkidle'});await failed.waitForFunction(()=>document.querySelector('.longines')?.dataset.mode==='static');
 assert.deepEqual(modelRequests,[]);assert.deepEqual(errors,[]);
 console.log('Passed: supplied Longines hero, all 131-frame scroll mapping including reverse, chapter navigation, three perspectives, mobile frame set, reduced motion, failed-frame fallback, and no old-model requests or browser exceptions.');
}finally{await browser.close()}
