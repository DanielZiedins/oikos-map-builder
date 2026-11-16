import puppeteer from 'puppeteer-core';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
const DIST = '/Users/danielziedins/Downloads/oikos-map-builder/dist';
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
function serve(r) { const u = new URL(r.url()); if (u.pathname.startsWith('/api/')) return r.respond({ status: 204, body: '' });
  for (const c of [u.pathname.endsWith('/') ? u.pathname + 'index.html' : u.pathname, u.pathname + '.html']) { const p = join(DIST, c); if (existsSync(p)) { try { return r.respond({ status: 200, contentType: T[extname(p)] || 'application/octet-stream', body: readFileSync(p) }); } catch {} } }
  return r.respond({ status: 404, body: '' }); }
// usage: node shot.mjs out path width selector [selector...]
const [out, path, width, ...sels] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage(); await p.setBypassServiceWorker(true); await p.setViewport({ width: +width, height: 844 }); await p.setRequestInterception(true); p.on('request', serve);
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('https://www.oikosmap.com' + path, { waitUntil: 'networkidle0' });
let i = 0;
for (const sel of sels) {
  await p.evaluate((s) => { const el = document.querySelector(s); const y = el.getBoundingClientRect().top + scrollY - 80; scrollTo({ top: y, behavior: 'instant' }); }, sel);
  await new Promise(r => setTimeout(r, 1300));
  await p.screenshot({ path: `${out}-${i++}.png` });
}
await b.close(); process.exit(0);
