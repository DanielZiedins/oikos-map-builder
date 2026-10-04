// Generates a 1200x630 social preview for every article: public/og/<slug>.png.
// Before this, every article shared with the same generic image, so a link in
// WhatsApp or Facebook looked identical whichever article it was.
//
// Run after adding or retitling an article:  npm run og
// scripts/build-blog.js refuses to build if an article has no image, so a new
// post cannot ship with a missing or generic preview.
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { readingPath, sortedPostsMeta } from '../src/content/posts-meta.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/og');
mkdirSync(outDir, { recursive: true });

const STAGE_COLOURS = { start: '#26201c', pray: '#14b8a6', care: '#e0a800', share: '#f45d48', disciple: '#516cf0' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// SVG has no text wrapping, so wrap by an approximate glyph width for Arial Bold.
function wrap(text, maxChars) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if ((line + ' ' + word).trim().length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line) lines.push(line);
  // Never strand a short word ("(A", "to", "a") at the end of a line: carry it
  // down so it reads with the phrase it belongs to.
  for (let i = 0; i < lines.length - 1; i += 1) {
    const words = lines[i].split(' ');
    const last = words[words.length - 1];
    if (words.length > 1 && last.replace(/[^A-Za-z]/g, '').length <= 2) {
      lines[i] = words.slice(0, -1).join(' ');
      lines[i + 1] = `${last} ${lines[i + 1]}`;
    }
  }
  return lines;
}

function layoutTitle(title) {
  // Shrink until the title fits in four lines.
  for (const [size, chars] of [[66, 24], [58, 28], [50, 32], [44, 36]]) {
    const lines = wrap(title, chars);
    if (lines.length <= 4) return { size, lines };
  }
  return { size: 40, lines: wrap(title, 40).slice(0, 4) };
}

for (const post of sortedPostsMeta) {
  const stage = readingPath.find((s) => s.slugs.includes(post.slug));
  const colour = STAGE_COLOURS[stage?.id] || '#9c3327';
  const { size, lines } = layoutTitle(post.title);
  const lineHeight = Math.round(size * 1.12);
  const blockTop = 250 - Math.round(((lines.length - 1) * lineHeight) / 2);

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#fff8ec"/>
  <path d="M0 120C170 50 330 44 480 104C650 172 770 160 930 72C1090-16 1200 14 1200 14V0H0Z" fill="#f3cf74" fill-opacity=".38"/>
  <path d="M0 580C210 470 380 490 540 420C690 356 840 336 1010 396C1120 436 1200 410 1200 410V630H0Z" fill="#14b8a6" fill-opacity=".14"/>
  <rect x="0" y="0" width="14" height="630" fill="${colour}"/>
  <g font-family="Arial, Helvetica, sans-serif">
    <text x="72" y="86" font-size="22" font-weight="900" letter-spacing="3.5" fill="#9c3327">THE OIKOS JOURNAL${stage ? ' · ' + esc(stage.label.toUpperCase()) : ''}</text>
    ${lines
      .map((l, i) => `<text x="70" y="${blockTop + i * lineHeight}" font-size="${size}" font-weight="900" fill="#26201c">${esc(l)}</text>`)
      .join('\n    ')}
    <text x="72" y="540" font-size="26" font-weight="700" fill="#5c5047">By Daniel Ziedins · ${esc(post.readingTime)}</text>
    <text x="72" y="584" font-size="26" font-weight="900" fill="#14857a">oikosmap.com</text>
  </g>
  <g transform="translate(1010 470)">
    <g stroke="#26201c" stroke-opacity=".28" stroke-width="4" stroke-linecap="round">
      <path d="M0 0 L0 -86"/><path d="M0 0 L80 -28"/><path d="M0 0 L50 70"/><path d="M0 0 L-50 70"/><path d="M0 0 L-80 -28"/>
    </g>
    <circle cx="0" cy="-86" r="24" fill="#f45d48" stroke="#fff8ec" stroke-width="5"/>
    <circle cx="80" cy="-28" r="22" fill="#14b8a6" stroke="#fff8ec" stroke-width="5"/>
    <circle cx="50" cy="70" r="22" fill="#f59e0b" stroke="#fff8ec" stroke-width="5"/>
    <circle cx="-50" cy="70" r="22" fill="#516cf0" stroke="#fff8ec" stroke-width="5"/>
    <circle cx="-80" cy="-28" r="22" fill="#8b5cf6" stroke="#fff8ec" stroke-width="5"/>
    <circle cx="0" cy="0" r="36" fill="#26201c"/>
  </g>
</svg>`;

  const out = resolve(outDir, `${post.slug}.png`);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, colors: 256 }).toFile(out);
  console.log(`og: ${post.slug}.png (${lines.length} lines @ ${size}px)`);
}
