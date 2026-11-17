// Local QA over the built site: serves dist/ under the production origin (so
// the analytics host gate and absolute URLs behave as in production), then
// checks every page type at phone and desktop width for horizontal overflow,
// stranded reveals, layout shift, script errors and axe violations, and
// exercises the interactive features. Usage: npm run build && npm run qa
// Screenshots land in the directory given by QA_OUT (default: OS temp dir).
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const OUT = process.env.QA_OUT || join(tmpdir(), 'oikos-qa');
mkdirSync(OUT, { recursive: true });
const ORIGIN = 'https://www.oikosmap.com';
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

function serve(request) {
  const url = new URL(request.url());
  if (url.pathname.startsWith('/api/')) return request.respond({ status: 204, body: '' });
  if (url.origin !== ORIGIN) return request.abort();
  for (const candidate of [url.pathname.endsWith('/') ? `${url.pathname}index.html` : url.pathname, `${url.pathname}.html`]) {
    const file = join(DIST, candidate);
    if (existsSync(file)) {
      try {
        return request.respond({ status: 200, contentType: TYPES[extname(file)] || 'application/octet-stream', body: readFileSync(file) });
      } catch {
        // A directory: try the next candidate.
      }
    }
  }
  return request.respond({ status: 404, body: '' });
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
let failures = 0;
function fail(message) {
  failures += 1;
  console.log(`  ✗ ${message}`);
}

async function open(path, width) {
  const page = await browser.newPage();
  await page.setBypassServiceWorker(true);
  await page.setViewport({ width, height: 844 });
  await page.setRequestInterception(true);
  page.on('request', serve);
  page.errors = [];
  page.on('pageerror', (error) => page.errors.push(error.message));
  page.on('console', (message) => ['error', 'warning'].includes(message.type()) && page.errors.push(message.text()));
  await page.evaluateOnNewDocument(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(ORIGIN + path, { waitUntil: 'networkidle0' });
  return page;
}

async function scrollThrough(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await sleep(80);
  }
  await sleep(900);
}

async function audit(page, label) {
  await scrollThrough(page);
  const result = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    stranded: [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).opacity !== '1').length,
    h1: document.querySelectorAll('h1').length,
    cls: Number(window.__cls.toFixed(4)),
  }));
  await page.evaluate(axeSource);
  const violations = await page.evaluate(async () => (await window.axe.run(document)).violations.map((v) => `${v.id}(${v.nodes.length}) ${v.nodes[0].target}`));
  // axe files any element with a pseudo-element overlay (every button here has
  // a shine sweep) under "incomplete", so it never judges their contrast. This
  // does the arithmetic directly for text sitting on its own solid background.
  const lowContrast = await page.evaluate(() => {
    const parse = (value) => { const m = value.match(/[\d.]+/g)?.map(Number) || []; return { r: m[0], g: m[1], b: m[2], a: m[3] ?? 1 }; };
    const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    // Self-test: a deliberately unreadable link must be caught on every run.
    const probe = document.createElement('a');
    probe.textContent = 'qa-probe';
    probe.style.cssText = 'color:#5c5047;background:#26201c;display:inline-block';
    document.body.appendChild(probe);
    const found = [];
    document.querySelectorAll('a, button, summary, label, p, span, li, small, strong, cite, figcaption, h1, h2, h3, h4, dt, dd').forEach((el) => {
      if (!el.offsetParent || el.disabled || el.closest('[aria-hidden="true"]')) return;
      const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('');
      if (!text) return;
      const style = getComputedStyle(el);
      const fg = parse(style.color);
      // Background: the element's own solid fill, else the nearest ancestor's
      // base colour (a gradient section still declares one underneath, which
      // is a fair stand-in for "is this text light-on-dark or dark-on-light").
      let bg = null;
      for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
        const nodeStyle = getComputedStyle(node);
        const colour = parse(nodeStyle.backgroundColor);
        if (colour.a === 1) { bg = colour; break; }
        if (colour.a > 0 || (node === el && nodeStyle.backgroundImage !== 'none')) return;
      }
      if (!bg) bg = { r: 255, g: 248, b: 236, a: 1 };
      if (fg.a < 0.99) {
        // Translucent text: composite it over the background first.
        fg.r = fg.r * fg.a + bg.r * (1 - fg.a); fg.g = fg.g * fg.a + bg.g * (1 - fg.a); fg.b = fg.b * fg.a + bg.b * (1 - fg.a);
      }
      if (Number(style.opacity) < 1) return;
      const [hi, lo] = [lum(fg), lum(bg)].sort((x, y) => y - x);
      const ratio = (hi + 0.05) / (lo + 0.05);
      const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700);
      if (ratio < (large ? 3 : 4.5)) found.push(`"${text.slice(0, 28)}" ${ratio.toFixed(2)}:1`);
    });
    probe.remove();
    return [...new Set(found)];
  });
  const bad = [];
  const probeSeen = lowContrast.some((item) => item.includes('qa-probe'));
  const realLow = lowContrast.filter((item) => !item.includes('qa-probe'));
  if (!probeSeen) bad.push('contrast self-test did not fire');
  if (realLow.length) bad.push(`low contrast: ${realLow.join(', ')}`);
  if (result.overflow > 0) bad.push(`overflows by ${result.overflow}px`);
  if (result.stranded) bad.push(`${result.stranded} reveal(s) stuck hidden`);
  if (result.h1 !== 1) bad.push(`${result.h1} h1s`);
  if (result.cls > 0.02) bad.push(`CLS ${result.cls}`);
  if (page.errors.length) bad.push(`errors: ${page.errors.join(' | ')}`);
  if (violations.length) bad.push(`axe: ${violations.join('; ')}`);
  if (bad.length) fail(`${label}: ${bad.join(' · ')}`);
  else console.log(`  ✓ ${label} (cls ${result.cls})`);
}

const articles = readFileSync(join(DIST, 'sitemap.xml'), 'utf8').match(/\/blog\/[a-z0-9-]+/g) || [];
const verseArticle = '/blog/bible-verses-to-pray-for-unsaved-loved-ones';
const newest = articles[articles.length - 1];
const pages = ['/', '/blog', verseArticle, newest, '/blog/oikos-evangelism-guide', '/blog/advent-prayer-calendar-for-your-oikos', '/blog/free-printable-oikos-map-template', '/about', '/faq', '/network', '/growth', '/connect'];

console.log('Pages');
for (const path of [...new Set(pages)]) {
  for (const width of [390, 1366]) {
    const page = await open(path, width);
    await audit(page, `${path} @${width}`);
    await page.close();
  }
}

console.log('Features');
for (const width of [390, 1366]) {
  // Prayer streak + prayer mode.
  let page = await open('/', width);
  await scrollThrough(page);
  const streak = await page.evaluate(async () => {
    document.querySelector('.prayer-streak-button')?.click();
    await new Promise((done) => setTimeout(done, 250));
    return [document.querySelector('.prayer-streak-top strong')?.textContent, localStorage.getItem('oikos-prayer-days-v1')];
  });
  if (!/1-day streak/.test(streak[0] || '')) fail(`streak @${width}: ${JSON.stringify(streak)}`);
  else console.log(`  ✓ streak @${width}`);

  const launch = await page.$('.prayer-walk-launch');
  if (!launch) fail(`prayer mode @${width}: no launch button`);
  else {
    await launch.evaluate((el) => el.click());
    await sleep(700);
    const first = await page.evaluate(() => ({
      name: document.querySelector('.prayer-walk h2')?.textContent,
      count: document.querySelector('.prayer-walk-top span')?.textContent,
      fixed: (() => { const r = document.querySelector('.prayer-walk').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.left), Math.round(r.width) === window.innerWidth, Math.round(r.height) === window.innerHeight]; })(),
      focus: document.activeElement?.className,
      overflow: document.querySelector('.prayer-walk').scrollWidth - window.innerWidth,
    }));
    await page.screenshot({ path: join(OUT, `walk-${width}.png`) });
    await page.evaluate(axeSource);
    const axe = await page.evaluate(async () => (await window.axe.run(document.querySelector('.prayer-walk'))).violations.map((v) => `${v.id} ${v.nodes[0].target}`));
    let steps = 0;
    while (steps < 40 && !(await page.$('.prayer-walk-done'))) {
      await page.keyboard.press('ArrowRight');
      await sleep(60);
      steps += 1;
    }
    await sleep(500);
    const doneText = await page.evaluate(() => document.querySelector('.prayer-walk-done h2')?.textContent);
    await page.screenshot({ path: join(OUT, `walk-done-${width}.png`) });
    await page.keyboard.press('Escape');
    await sleep(200);
    const closed = !(await page.$('.prayer-walk'));
    const ok = first.name && first.fixed[0] === 0 && first.fixed[2] && first.fixed[3] && /prayer-walk-next/.test(first.focus || '') && first.overflow <= 0 && doneText && closed && !axe.length && !page.errors.length;
    if (!ok) fail(`prayer mode @${width}: ${JSON.stringify({ first, steps, doneText, closed, axe, errors: page.errors })}`);
    else console.log(`  ✓ prayer mode @${width} (${first.count}, ${steps} steps)`);
  }
  await page.close();

  // Save image -> "what next" sheet -> prayer mode.
  page = await open('/', width);
  await scrollThrough(page);
  {
    const cdp = await page.createCDPSession();
    await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: OUT });
    await page.evaluate(() => document.querySelector('.map-save').click());
    await sleep(2200);
    const sheet = await page.evaluate(() => {
      const el = document.querySelector('.after-export');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { inView: r.top >= 0 && r.bottom <= window.innerHeight + 1 && r.right <= window.innerWidth + 1, buttons: el.querySelectorAll('.after-export-actions button').length, focus: document.activeElement?.className };
    });
    await page.screenshot({ path: join(OUT, `after-export-${width}.png`) });
    let axe = [];
    if (sheet) {
      await page.evaluate(axeSource);
      axe = await page.evaluate(async () => (await window.axe.run(document.querySelector('.after-export'))).violations.map((v) => `${v.id} ${v.nodes[0].target}`));
      await page.evaluate(() => document.querySelector('.after-export-primary').click());
      await sleep(500);
    }
    const walk = !!(await page.$('.prayer-walk'));
    const png = existsSync(join(OUT, 'my-oikos-map.png'));
    if (!sheet || !sheet.inView || sheet.buttons !== 3 || !walk || !png || axe.length || page.errors.length) fail(`save image @${width}: ${JSON.stringify({ sheet, walk, png, axe, errors: page.errors })}`);
    else console.log(`  ✓ save image + next step @${width}`);
  }
  await page.close();

  // Journal search.
  page = await open('/blog', width);
  await page.type('#journal-search', 'prayer walk');
  await sleep(250);
  const status = await page.evaluate(() => document.querySelector('.blog-filter-status').textContent);
  if (!/^1 article matching/.test(status)) fail(`journal search @${width}: ${status}`);
  else console.log(`  ✓ journal search @${width}`);
  await page.close();

  // Verse copy + verse image card.
  page = await open(verseArticle, width);
  const buttons = await page.evaluate(() => [document.querySelectorAll('.verse-copy:not(.verse-image)').length, document.querySelectorAll('.verse-image').length]);
  const client = await page.createCDPSession();
  await client.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: OUT });
  await page.evaluate(() => document.querySelector('.verse-image').click());
  await sleep(2500);
  const label = await page.evaluate(() => document.querySelector('.verse-image').textContent);
  if (buttons[0] < 5 || buttons[0] !== buttons[1] || !/Saved|Shared|Image/.test(label) || /Try again/.test(label) || page.errors.length) fail(`verse image @${width}: ${JSON.stringify({ buttons, label, errors: page.errors })}`);
  else console.log(`  ✓ verse image @${width} (${buttons[1]} buttons, "${label}")`);
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} problem(s). Screenshots: ${OUT}` : `\nAll clear. Screenshots: ${OUT}`);
process.exit(failures ? 1 : 0);
