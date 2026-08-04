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
    <link rel="alternate" type="application/rss+xml" title="The Oikos Journal" href="${SITE}/rss.xml" />
    <link rel="preload" href="/fonts/InterVariable-subset.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:type" content="${published ? 'article' : 'website'}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="Oikos Map Builder" />
    <meta property="og:locale" content="en_US" />
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
    <script type="module" src="/src/main.jsx"></script>
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
const today = sortedPosts[0]?.date || '2026-07-30';
const urls = [
  { loc: `${SITE}/`, priority: '1.0', changefreq: 'weekly', lastmod: today },
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
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

console.log(
  `build-blog: generated blog.html + ${posts.length} posts + sitemap (${urls.length} urls) + rss (${sortedPosts.length} items)`,
);
