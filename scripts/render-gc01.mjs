const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ||
    '/Users/khushikumari/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
);
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const base = process.cwd();
const scene = ts.transpileModule(fs.readFileSync('lib/gc01/scene.ts', 'utf8'), {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
}).outputText;
const html = `<!doctype html><html><head><script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script></head><body style="margin:0"><canvas width="1200" height="1400" style="width:1200px;height:1400px"></canvas><script type="module">import {createWatchStudio} from '/scene.js';window.ready=createWatchStudio(document.querySelector('canvas'),{transparent:true,pixelRatio:1}).then(studio=>{window.studio=studio;studio.resize(1200,1400);studio.render(0,false)});</script></body></html>`;
const server = http.createServer((req, res) => {
  let file;
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    return res.end(html);
  }
  if (req.url === '/scene.js') {
    res.setHeader('Content-Type', 'text/javascript');
    return res.end(scene);
  }
  if (req.url.startsWith('/three/'))
    file = path.join(base, 'node_modules/three', req.url.slice(7));
  else if (req.url === '/gc01/gc01.glb')
    file = path.join(base, 'public/gc01/gc01.glb');
  if (!file || !fs.existsSync(file)) {
    res.statusCode = 404;
    return res.end();
  }
  res.setHeader(
    'Content-Type',
    file.endsWith('.js') ? 'text/javascript' : 'application/octet-stream',
  );
  res.end(fs.readFileSync(file));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({
    executablePath:
      process.env.CHROME_PATH ||
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--enable-unsafe-swiftshader'],
  });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 1400 },
  });
  page.on('pageerror', (e) => console.error(e));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => window.ready);
  for (const [name, p, finish] of [
    ['hero', 0, 'steel'],
    ['exploded', 0.28, 'steel'],
    ['profile', 0.42, 'steel'],
    ['crown', 0.51, 'steel'],
    ['dial', 0.62, 'steel'],
    ['movement', 0.74, 'steel'],
    ['reassembled', 1, 'steel'],
    ['steel', 0, 'steel'],
    ['noir', 0, 'noir'],
    ['gold', 0, 'gold'],
    ['two-tone', 0, 'two-tone'],
  ]) {
    const image = await page.evaluate(
      ({ p, finish }) => {
        window.studio.setProgress(p);
        window.studio.setFinish(finish);
        window.studio.render(0, false);
        return document
          .querySelector('canvas')
          .toDataURL('image/png')
          .split(',')[1];
      },
      { p, finish },
    );
    fs.writeFileSync(`public/gc01/${name}.png`, Buffer.from(image, 'base64'));
    console.log('Rendered', name);
  }
} finally {
  await browser?.close();
  server.close();
}
