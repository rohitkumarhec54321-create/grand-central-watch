import assert from 'node:assert/strict';
import fs from 'node:fs';
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ||
    '/Users/khushikumari/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
);
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--enable-unsafe-swiftshader'],
});
fs.mkdirSync('work/gc01-qa', { recursive: true });
const errors = [];
const inspect = (page) =>
  page.on('pageerror', (error) => errors.push(error.message));
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 960 },
  });
  inspect(page);
  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  await page.locator('.gc-canvas.is-ready').waitFor({ timeout: 25000 });
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.gc-canvas')).opacity === '1' && getComputedStyle(document.querySelector('.gc-poster')).opacity === '0');
  await page.screenshot({ path: 'work/gc01-qa/desktop-hero.png' });
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.evaluate(() => {
    const film = document.querySelector('.gc-film');
    scrollTo(0, film.offsetTop + (film.offsetHeight - innerHeight) * 0.28);
  });
  await page.waitForFunction(() =>
    document
      .querySelector('.gc-note .gc-eyebrow')
      ?.textContent.includes('THE ARCHITECTURE'),
  );
  await page.screenshot({ path: 'work/gc01-qa/desktop-exploded.png' });
  for (const [point, label] of [
    [0.42, 'CASE & CROWN'],
    [0.51, 'POINT OF CONTACT'],
    [0.62, 'DIAL & COMPLICATION'],
    [0.74, 'BENEATH THE SURFACE'],
    [1, 'RETURN TO THE ESSENTIAL'],
  ]) {
    await page.evaluate((point) => {
      const film = document.querySelector('.gc-film');
      scrollTo(0, film.offsetTop + (film.offsetHeight - innerHeight) * point);
    }, point);
    await page.waitForFunction(
      (label) =>
        document
          .querySelector('.gc-note .gc-eyebrow')
          ?.textContent.includes(label),
      label,
    );
  }
  await page.locator('#finishes').scrollIntoViewIfNeeded();
  for (const name of [
    'Midnight PVD',
    'Champagne gold',
    'Steel & gold',
    'Brushed steel',
  ]) {
    await page.getByRole('button', { name: `GC—01 ${name} finish` }).click();
    assert.equal(
      await page.locator('.gc-finish[aria-pressed="true"]').count(),
      1,
    );
    assert.equal(await page.locator('.gc-selection h3').textContent(), name);
  }
  await page.waitForFunction(() => [...document.querySelectorAll('.gc-finish img')].every(img => img.complete && img.naturalWidth > 0));
  await page.screenshot({ path: 'work/gc01-qa/desktop-finishes.png' });
  await page.getByRole('button', { name: 'The design notes' }).click();
  assert(await page.locator('#gc-design-notes').isVisible());
  await page.getByRole('button', { name: 'The design notes' }).click();
  assert(!(await page.locator('#gc-design-notes').isVisible()));
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  inspect(mobile);
  const mobileModels = [];
  mobile.on('request', (r) => {
    if (r.url().endsWith('.glb')) mobileModels.push(r.url());
  });
  await mobile.goto(base, { waitUntil: 'networkidle' });
  await mobile.waitForFunction(
    () => document.querySelector('.gc01')?.dataset.presentation === 'mobile',
  );
  await mobile.screenshot({ path: 'work/gc01-qa/mobile-hero.png' });
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await mobile.evaluate(() => {
    const f = document.querySelector('.gc-film');
    scrollTo(0, (f.offsetHeight - innerHeight) * 0.3);
  });
  await mobile.waitForFunction(
    () =>
      document.querySelector('.gc-poster')?.getAttribute('src') ===
      '/gc01/exploded.webp',
  );
  assert.equal(mobileModels.length, 0, 'Mobile must not download the GLB');
  const reduced = await browser.newPage({
    viewport: { width: 1440, height: 960 },
    reducedMotion: 'reduce',
  });
  inspect(reduced);
  const reducedModels = [];
  reduced.on('request', (r) => {
    if (r.url().endsWith('.glb')) reducedModels.push(r.url());
  });
  await reduced.goto(base, { waitUntil: 'networkidle' });
  await reduced.waitForFunction(
    () => document.querySelector('.gc01')?.dataset.presentation === 'static',
  );
  assert.equal(await reduced.locator('canvas').count(), 0);
  assert.equal(reducedModels.length, 0);
  assert(
    await reduced.evaluate(
      () => document.querySelector('.gc-film').offsetHeight <= innerHeight + 1,
    ),
  );
  const failed = await browser.newPage({
    viewport: { width: 1440, height: 960 },
  });
  inspect(failed);
  await failed.route('**/gc01/gc01.glb', (route) => route.abort());
  await failed.goto(base, { waitUntil: 'networkidle' });
  await failed.waitForFunction(
    () => document.querySelector('.gc01')?.dataset.presentation === 'static',
  );
  assert.equal(await failed.locator('canvas').count(), 0);
  assert.deepEqual(errors, []);
  console.log(
    'Passed: desktop WebGL, all seven scroll chapters, four finish selections, design notes, mobile stills without GLB, reduced motion without GLB, failed-model recovery, and zero browser exceptions.',
  );
} finally {
  await browser.close();
}
