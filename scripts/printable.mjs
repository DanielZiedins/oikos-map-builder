// Prints scripts/printable/oikos-map-template.html to
// public/downloads/oikos-map-template.pdf (plus a PNG preview of page 1 for the
// article). Not part of the build — run by hand after editing the template:
//
//   npm install --no-save puppeteer-core && node scripts/printable.mjs
//
// Uses the locally installed Google Chrome (set CHROME_PATH to override).
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'scripts/printable/oikos-map-template.html');
const outDir = resolve(root, 'public/downloads');
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

let puppeteer;
try {
  puppeteer = (await import('puppeteer-core')).default;
} catch {
  console.error('printable: needs puppeteer-core — run `npm install --no-save puppeteer-core` first.');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new' });
const page = await browser.newPage();
await page.goto(pathToFileURL(source).href, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: resolve(outDir, 'oikos-map-template.pdf'), format: 'Letter', printBackground: true, preferCSSPageSize: true });

// Preview of page 1 at 816×1056 CSS px (Letter at 96dpi).
await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 });
await page.screenshot({ path: resolve(outDir, 'oikos-map-template-preview.png'), clip: { x: 0, y: 0, width: 816, height: 1056 } });
await browser.close();
console.log('printable: wrote public/downloads/oikos-map-template.pdf and preview PNG');
