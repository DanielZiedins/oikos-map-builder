// Pushes the site's URLs to IndexNow (Bing, Yandex, Seznam, Naver share one
// submission). Google has no ping endpoint; it reads the Sitemap line in robots.txt.
//
// The URL list comes from the LIVE production sitemap, not a local file, so a
// stale build can never submit the wrong set. The key file in public/ must be
// deployed before this runs — IndexNow rejects submissions it cannot verify.
//
// Run after publishing or materially rewriting pages:  npm run indexnow
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = 'www.oikosmap.com';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const keyFile = readdirSync(resolve(root, 'public')).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('No IndexNow key file (32 hex chars + .txt) in public/');
const key = readFileSync(resolve(root, 'public', keyFile), 'utf8').trim();

const live = await fetch(`https://${HOST}/${keyFile}`).then((r) => (r.ok ? r.text() : ''));
if (live.trim() !== key) throw new Error(`Key file not live at https://${HOST}/${keyFile} — deploy first.`);

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((r) => r.text());
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!urlList.length) throw new Error('Live sitemap returned no URLs.');

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList }),
});
console.log(`IndexNow ${res.status} ${res.statusText} — submitted ${urlList.length} URLs`);
if (![200, 202].includes(res.status)) process.exit(1);
