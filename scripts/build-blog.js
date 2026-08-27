// Generates a prerendered HTML shell for /blog and every post before `vite build`.
// Each shell carries its own title, description, canonical, Open Graph tags and
// Article schema, plus the article text inside <noscript> so the content is
// present even without JavaScript. Vite picks these up as extra rollup inputs.

import { mkdirSync, writeFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const blogDir = resolve(root, 'blog');
const SITE = 'https://www.oikosmap.com';

const { posts, sortedPosts } = await import(resolve(root, 'src/content/posts.js'));

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripTags(value) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function head({ title, description, canonical, extraSchema = [], published }) {
  const schema = JSON.stringify(extraSchema, null, 2);
  return `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="Daniel Ziedins" />
    <meta name="theme-color" content="#171310" />
    <link rel="icon" type="image/svg+xml" href="/oikos-logo.svg" />
    <link rel="alternate icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="Oikos Map Builder for AI systems" />
    <link rel="alternate" type="application/rss+xml" title="The Oikos Journal" href="${SITE}/rss.xml" />
    <link rel="preload" href="/fonts/InterVariable-subset.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:type" content="${published ? 'article' : 'website'}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="Oikos Map Builder" />
    <meta property="og:locale" content="en_CA" />
    <meta property="og:image" content="${SITE}/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="Oikos Map Builder — see the people God has placed around you" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${SITE}/og-image.png" />
${published ? `    <meta property="article:published_time" content="${published}" />\n` : ''}    <title>${esc(title)}</title>
    <script type="application/ld+json">
${schema}
    </script>`;
}

function shell({ metaHead, noscript }) {
  return `<!doctype html>
<html lang="en">
  <head>
${metaHead}
  </head>
  <body>
    <div id="root"></div>
    <noscript>
      <main>
${noscript}
      </main>
    </noscript>
    <script type="module" src="/src/blog-entry.jsx"></script>
  </body>
</html>
`;
}

function postNoscript(post) {
  const parts = [`        <h1>${esc(post.title)}</h1>`, `        <p>${esc(post.description)}</p>`];
  post.intro.forEach((paragraph) => parts.push(`        <p>${esc(stripTags(paragraph))}</p>`));
  post.sections.forEach((section) => {
    parts.push(`        <h2>${esc(section.heading)}</h2>`);
    (section.paragraphs || []).forEach((paragraph) => parts.push(`        <p>${esc(stripTags(paragraph))}</p>`));
    if (section.list?.length) {
      parts.push('        <ul>');
      section.list.forEach((item) => parts.push(`          <li>${esc(stripTags(item))}</li>`));
      parts.push('        </ul>');
    }
    (section.after || []).forEach((paragraph) => parts.push(`        <p>${esc(stripTags(paragraph))}</p>`));
  });
  if (post.scripture) {
    parts.push(`        <blockquote><p>${esc(post.scripture.text)}</p><cite>${esc(post.scripture.ref)}</cite></blockquote>`);
  }
  return parts.join('\n');
}

function postSchema(post) {
  const url = `${SITE}/blog/${post.slug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      image: `${SITE}/og-image.png`,
      keywords: post.tags.join(', '),
      wordCount: stripTags(
        [...post.intro, ...post.sections.flatMap((s) => [...(s.paragraphs || []), ...(s.list || []), ...(s.after || [])])].join(' '),
      ).split(/\s+/).length,
      inLanguage: 'en-CA',
      articleSection: post.tags[0],
      timeRequired: `PT${parseInt(post.readingTime, 10) || 6}M`,
      about: post.tags.map((tag) => ({ '@type': 'Thing', name: tag })),
      // Named anchors let search engines link straight to a section.
      hasPart: post.sections.map((section) => ({
        '@type': 'WebPageElement',
        name: section.heading,
        url: `${url}#s-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
      })),
      isAccessibleForFree: true,
      author: { '@type': 'Person', name: 'Daniel Ziedins', url: 'https://www.danielziedins.com' },
      publisher: {
        '@type': 'Organization',
        name: 'Oikos Map',
        url: SITE,
        logo: { '@type': 'ImageObject', url: `${SITE}/oikos-logo.svg` },
      },
      isPartOf: { '@type': 'Blog', name: 'The Oikos Journal', url: `${SITE}/blog` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Oikos Map Builder', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'The Oikos Journal', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE}/blog/${post.slug}` },
      ],
    },
  ];
}

function indexSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'The Oikos Journal',
      description:
        'Practical, encouraging writing on prayer, everyday evangelism, discipleship, and loving the people God has placed around you.',
      url: `${SITE}/blog`,
      publisher: { '@type': 'Organization', name: 'Oikos Map', url: SITE },
      blogPost: sortedPosts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        url: `${SITE}/blog/${post.slug}`,
        author: { '@type': 'Person', name: 'Daniel Ziedins' },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Oikos Map Builder', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'The Oikos Journal', item: `${SITE}/blog` },
      ],
    },
  ];
}

// Rebuild the directory from scratch so removing a post removes its page.
if (existsSync(blogDir)) {
  readdirSync(blogDir)
    .filter((file) => file.endsWith('.html'))
    .forEach((file) => rmSync(resolve(blogDir, file)));
}
mkdirSync(blogDir, { recursive: true });

writeFileSync(
  resolve(root, 'blog.html'),
  shell({
    metaHead: head({
      title: 'The Oikos Journal | Prayer, Evangelism & Discipleship Writing',
      description:
        'Practical, encouraging writing on prayer, everyday evangelism, discipleship, and loving the people God has already placed around you.',
      canonical: `${SITE}/blog`,
      extraSchema: indexSchema(),
    }),
    noscript: [
      '        <h1>The Oikos Journal</h1>',
      '        <p>Practical, encouraging writing on prayer, everyday evangelism, and discipleship.</p>',
      '        <ul>',
      ...sortedPosts.map((post) => `          <li><a href="/blog/${post.slug}">${esc(post.title)}</a></li>`),
      '        </ul>',
    ].join('\n'),
  }),
);

posts.forEach((post) => {
  writeFileSync(
    resolve(blogDir, `${post.slug}.html`),
    shell({
      metaHead: head({
        title: `${post.title} | Oikos Map`,
        description: post.description,
        canonical: `${SITE}/blog/${post.slug}`,
        extraSchema: postSchema(post),
        published: post.date,
      }),
      noscript: postNoscript(post),
    }),
  );
});

// Sitemap covers the core pages plus every post.
const today = '2026-08-09';
const urls = [
  {
    loc: `${SITE}/`,
    priority: '1.0',
    changefreq: 'weekly',
    lastmod: today,
    images: [
      {
        loc: `${SITE}/og-image.png`,
        title: 'Free Oikos Map Builder',
        caption: 'A visual prayer and outreach tool for mapping the people God has placed around you.',
      },
      {
        loc: `${SITE}/oikos-map-social.png`,
        title: 'Oikos Map Builder relational map',
        caption: 'A glowing relational map connected by a heart, representing intentional love and prayer.',
      },
    ],
  },
  { loc: `${SITE}/blog`, priority: '0.9', changefreq: 'weekly', lastmod: today },
  { loc: `${SITE}/connect`, priority: '0.8', changefreq: 'monthly', lastmod: today },
  { loc: `${SITE}/growth`, priority: '0.7', changefreq: 'monthly', lastmod: today },
  ...sortedPosts.map((post) => ({
    loc: `${SITE}/blog/${post.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: post.date,
  })),
];

writeFileSync(
  resolve(root, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${(url.images || [])
  .map(
    (image) => `    <image:image>
      <image:loc>${image.loc}</image:loc>
      <image:title>${esc(image.title)}</image:title>
      <image:caption>${esc(image.caption)}</image:caption>
    </image:image>`,
  )
  .join('\n')}
  </url>`,
  )
  .join('\n')}
</urlset>
`,
);

// RSS so the journal can be followed and syndicated.
const rssItems = sortedPosts
  .map(
    (post) => `    <item>
      <title>${esc(post.title)}</title>
      <link>${SITE}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${post.slug}</guid>
      <pubDate>${new Date(`${post.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(post.description)}</description>
${post.tags.map((tag) => `      <category>${esc(tag)}</category>`).join('\n')}
    </item>`,
  )
  .join('\n');

writeFileSync(
  resolve(root, 'public/rss.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Oikos Journal</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Practical, encouraging writing on prayer, everyday evangelism, discipleship, and loving the people God has placed around you.</description>
    <language>en</language>
    <lastBuildDate>${new Date(`${today}T09:00:00Z`).toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>
`,
);

// --- Branded 404 -----------------------------------------------------------
// Vercel serves 404.html from the output root for unmatched routes. Static on
// purpose: no bundle, and it still works if the app fails to boot.
writeFileSync(
  resolve(root, 'public/404.html'),
  `<!doctype html>
<html lang="en-CA">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, follow" />
    <title>Page not found | Oikos Map</title>
    <link rel="icon" type="image/svg+xml" href="/oikos-logo.svg" />
    <link rel="preload" href="/fonts/InterVariable-subset.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
    <style>
      @font-face{font-family:InterVariable;font-style:normal;font-weight:100 900;font-display:swap;src:url("/fonts/InterVariable-subset.woff2") format("woff2")}
      *{box-sizing:border-box}
      body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#fff8ec;color:#26201c;
        font-family:InterVariable,Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
      main{max-width:620px}
      .kicker{margin:0 0 14px;font-size:.72rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#9c3327}
      h1{margin:0 0 16px;font-size:clamp(2.2rem,6vw,3.6rem);line-height:1.06;letter-spacing:-1px}
      p{margin:0 0 26px;color:#62564e;font-size:1.08rem;line-height:1.65}
      ul{display:flex;flex-wrap:wrap;gap:10px;margin:0;padding:0;list-style:none}
      a{display:inline-flex;align-items:center;min-height:46px;padding:12px 20px;border-radius:999px;
        font-weight:800;text-decoration:none;border:1px solid rgba(38,32,28,.16)}
      a.primary{color:#fff8ec;background:#26201c;border-color:transparent}
      a.secondary{color:#26201c;background:rgba(255,253,247,.8)}
      a:hover{transform:translateY(-1px)}
    </style>
  </head>
  <body>
    <main>
      <p class="kicker">404 &middot; Page not found</p>
      <h1>That page is not here.</h1>
      <p>The link may be old or mistyped &mdash; but the map is still free, and the people God has placed around you are still worth praying for.</p>
      <ul>
        <li><a class="primary" href="/">Build your Oikos Map &rarr;</a></li>
        <li><a class="secondary" href="/blog">Read the Oikos Journal</a></li>
      </ul>
    </main>
  </body>
</html>
`,
);

// --- AI-readable discovery files -------------------------------------------
// Generated from the same content modules as everything else, so the article
// index and network list cannot drift out of date.
const llms = await import(resolve(root, 'src/content/llms.js'));
const { networkSites } = await import(resolve(root, 'src/content/network.js'));

const articleLines = sortedPosts.map((post) => `- ${post.title}\n  ${SITE}/blog/${post.slug}\n  ${post.description}`);

writeFileSync(
  resolve(root, 'public/llms.txt'),
  `# Oikos Map

> ${llms.llmsSummary}

Canonical site: ${SITE}/

Key pages:
- ${SITE}/ - Free Oikos Map Builder and outreach guide
- ${SITE}/blog - The Oikos Journal: prayer, evangelism, and discipleship writing
- ${SITE}/growth - Kingdom personal growth for spirit, mind, body, and purpose
- ${SITE}/connect - Kingdom communities, e3 Canada collaboration, and founder/ministry links

Articles:
${sortedPosts.map((post) => `- ${post.title} - ${SITE}/blog/${post.slug}`).join('\n')}

AI-readable reference:
- ${SITE}/llms-full.txt - expanded questions, answers, features, and attribution
- ${SITE}/rss.xml - article feed

Primary entities:
${llms.llmsPrimaryEntities.map((entity) => `- ${entity}`).join('\n')}

Important summary:
${llms.llmsSummary} Maps are private: they are stored only in the visitor's browser and are never uploaded to a server.

Attribution:
${llms.llmsAttribution}
`,
);

writeFileSync(
  resolve(root, 'public/llms-full.txt'),
  `# Oikos Map Builder: Expanded Reference

Canonical URL: ${SITE}/
Site language: English (Canada)
Last updated: ${today}

## One-sentence description

${llms.llmsOneSentence}

## What is an Oikos Map?

${llms.llmsWhatIsAnOikosMap}

## Who is it for?

${llms.llmsWhoIsItFor}

## What can visitors do?

${llms.llmsCapabilities.map((item) => `- ${item}`).join('\n')}

## Suggested first use

${llms.llmsFirstUse.map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Frequently asked questions

${llms.llmsFaq.map((item) => `### ${item.q}\n\n${item.a}`).join('\n\n')}

## Articles

${articleLines.join('\n\n')}

## The wider Kingdom network

${networkSites
  .filter((site) => !site.isSelf)
  .map((site) => `- ${site.name} (${site.host}): ${site.blurb}\n  ${site.url}`)
  .join('\n')}

## Related pages

- Main tool: ${SITE}/
- The Oikos Journal: ${SITE}/blog
- Personal growth: ${SITE}/growth
- Community and connection: ${SITE}/connect
- Article feed: ${SITE}/rss.xml

## Attribution

${llms.llmsAttribution}
`,
);

console.log(
  `build-blog: generated blog.html + ${posts.length} posts + sitemap (${urls.length} urls) + rss (${sortedPosts.length} items) + llms.txt/llms-full.txt`,
);
