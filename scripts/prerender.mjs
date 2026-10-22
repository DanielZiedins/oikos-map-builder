// Prerenders every page — the builder pages (/, /growth, /connect), the journal
// index and each article — into dist/ after `vite build`.
//
// Before this, those pages shipped an empty <div id="root"> plus a ~100-word
// <noscript>, so crawlers that do not run JavaScript (most AI crawlers, and
// Google's first pass) saw almost nothing on the most important page of the site.
// Now the real React tree is rendered to HTML here and hydrated in the browser
// (see the mount block at the bottom of src/main.jsx).
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ssrOut = resolve(root, '.ssr');

// A separate SSR build of the same entry. No manualChunks here: the client
// config's vendor chunking does not apply to (and breaks) an SSR bundle.
await build({
  configFile: false,
  root,
  logLevel: 'warn',
  plugins: [react()],
  build: {
    ssr: true,
    outDir: ssrOut,
    emptyOutDir: true,
    rollupOptions: {
      input: { main: 'src/main.jsx', blog: 'src/ssr-blog.jsx' },
      output: { entryFileNames: '[name].mjs' },
    },
  },
});

const { renderToString } = await import('react-dom/server');
const { routes, growthFaq, faqItems } = await import(pathToFileURL(resolve(ssrOut, 'main.mjs')).href);
const { networkSites } = await import(pathToFileURL(resolve(root, 'src/content/network.js')).href);
const blog = await import(pathToFileURL(resolve(ssrOut, 'blog.mjs')).href);

// Minimum words a crawler must see on each page, so a regression (an empty
// render, content moved behind an effect) fails the build instead of shipping.
const pages = [
  // The homepage got lighter on 2026-10-22: the vision, mission, next-steps and
  // Jesus sections moved to /about, the full FAQ to /faq and the directory to
  // /network, each with its own schema below.
  { path: '/', file: 'index.html', minWords: 800, render: routes['/'] },
  { path: '/about', file: 'about.html', minWords: 600, render: routes['/about'] },
  {
    path: '/faq',
    file: 'faq.html',
    minWords: 300,
    render: routes['/faq'],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': 'https://www.oikosmap.com/faq#faq',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  },
  {
    path: '/network',
    file: 'network.html',
    minWords: 300,
    render: routes['/network'],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': 'https://www.oikosmap.com/network#sites',
      name: 'The Kingdom network behind Oikos Map',
      itemListElement: networkSites
        .filter((site) => !site.isSelf)
        .map((site, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: site.name,
          description: site.blurb,
          url: site.url,
        })),
    },
  },
  {
    path: '/growth',
    file: 'growth.html',
    minWords: 900,
    render: routes['/growth'],
    // Built from the same array the page renders, so the schema can never
    // drift from the visible questions.
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': 'https://www.oikosmap.com/growth#faq',
      mainEntity: growthFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  },
  { path: '/connect', file: 'connect.html', minWords: 300, render: routes['/connect'] },
  { path: '/blog', file: 'blog.html', minWords: 600, render: blog.blogIndexPage },
  ...blog.slugs.map((slug) => ({
    path: `/blog/${slug}`,
    file: `blog/${slug}.html`,
    minWords: 900,
    render: () => blog.blogPostPage(slug),
  })),
];

function visibleWords(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

for (const page of pages) {
  const file = resolve(root, 'dist', page.file);
  const template = readFileSync(file, 'utf8');
  if (!template.includes('<div id="root"></div>')) {
    throw new Error(`prerender: ${page.file} has no empty #root to fill (already prerendered?)`);
  }
  const markup = renderToString(page.render());
  const words = visibleWords(markup);
  if (words < page.minWords) {
    throw new Error(`prerender: ${page.path} rendered only ${words} words (expected ${page.minWords}+)`);
  }
  const h1s = (markup.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) throw new Error(`prerender: ${page.path} has ${h1s} <h1> elements`);

  let html = template
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
    // The <noscript> summary existed only because #root was empty. With the real
    // page in the HTML it would just be a second <h1> and duplicate copy.
    .replace(/\s*<noscript>\s*<main>[\s\S]*?<\/main>\s*<\/noscript>/, '');
  if (page.jsonLd) {
    const json = JSON.stringify(page.jsonLd).replace(/</g, '\\u003c');
    html = html.replace('</head>', `  <script type="application/ld+json">${json}</script>\n  </head>`);
  }
  if (/<noscript>\s*<main>/.test(html)) throw new Error(`prerender: ${page.file} still has its <noscript> summary`);
  writeFileSync(file, html);
  console.log(`prerender: ${page.path} → ${page.file} (${words} words, ${(markup.length / 1024).toFixed(0)} KB)`);
}

rmSync(ssrOut, { recursive: true, force: true });
