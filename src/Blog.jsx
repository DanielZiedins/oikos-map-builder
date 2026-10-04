import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Compass, Mail, Sparkles } from 'lucide-react';
import { readingPath, relatedMap, sortedPostsMeta } from './content/posts-meta.js';
import { siteByHost } from './content/network.js';

// One chunk per article. Reading one article used to download every article's
// body, which got worse with each new post; now only the opened one is fetched.
const bodyLoaders = import.meta.glob('./content/bodies/*.js');

function loadBody(slug) {
  const load = bodyLoaders[`./content/bodies/${slug}.js`];
  return load ? load().then((mod) => mod.default) : Promise.resolve(null);
}
import { JourneyTimeline, LeadCapture } from './journey.jsx';
import { track } from './track.js';

// Drives the progress bar already styled on body::before. The builder pages set
// this from ScrollEffects; the journal had no equivalent, so on long articles the
// bar simply never moved.
function useReadingProgress() {
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? window.scrollY / height : 0;
      document.documentElement.style.setProperty(
        '--scroll-width',
        `${Math.min(100, Math.max(0, progress * 100)).toFixed(2)}%`,
      );
    }
    function request() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}

// The journal is what brings people to the site, so every article ends with a
// way to keep going rather than a dead end.
function JournalSignup({ compact = false }) {
  return (
    <aside className={compact ? 'journal-signup compact' : 'journal-signup'} aria-labelledby="journal-signup-title">
      <div>
        <p className="section-kicker">
          <Mail size={18} aria-hidden="true" />
          The Oikos Journey · free
        </p>
        <h2 id="journal-signup-title">Want the rest of this, one step at a time?</h2>
        <p className="lead-lede">
          Six short emails over two weeks through the same rhythm these articles keep circling — <strong>pray, care,
          share, disciple</strong> — plus the starter kit to begin today.
        </p>
        {compact ? null : <JourneyTimeline />}
      </div>
      <LeadCapture source="oikosmap.com/blog" />
    </aside>
  );
}

// One source for authorship. Schema alone is a weak E-E-A-T signal — search and
// answer engines both want a visible, attributable human.
export const author = {
  name: 'Daniel Ziedins',
  url: 'https://www.danielziedins.com',
  image: '/assets/daniel-ziedins-founder.webp',
  role: 'Founder, Oikos Map',
  bio:
    'Daniel builds free Kingdom tools and gives them away. He did not create the original Oikos Map — his aim is to make it easy to access and easy to share. He and his wife Katie serve with e3 Canada.',
};

function AuthorByline({ date, readingTime, compact = false }) {
  return (
    <div className={compact ? 'byline compact' : 'byline'}>
      <img src={author.image} alt="" width="36" height="36" loading="lazy" decoding="async" />
      <div>
        <span>
          By{' '}
          <a href={author.url} rel="author noopener" target="_blank">
            {author.name}
          </a>
        </span>
        <small>
          <time dateTime={date}>{formatDate(date)}</time> · {readingTime}
        </small>
      </div>
    </div>
  );
}

function AuthorCard() {
  return (
    <aside className="author-card" aria-labelledby="author-card-title">
      <img src={author.image} alt={author.name} width="72" height="72" loading="lazy" decoding="async" />
      <div>
        <p className="author-card-kicker">Written by</p>
        <h2 id="author-card-title">
          <a href={author.url} rel="author noopener" target="_blank">
            {author.name}
          </a>
        </h2>
        <p className="author-card-role">{author.role}</p>
        <p>{author.bio}</p>
        <a className="author-card-link" href={author.url} rel="author noopener" target="_blank">
          DanielZiedins.com <ArrowRight size={14} aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}

function formatDate(iso) {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export function BlogHeader({ current }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Oikos Map Builder home">
        <span className="brand-mark" aria-hidden="true">
          <img src="/oikos-logo.svg" alt="" width="38" height="38" />
        </span>
        <span>Oikos Map Builder</span>
      </a>
      <nav aria-label="Blog navigation">
        <a href="/">Map Builder</a>
        <a href="/blog" aria-current={current === 'blog' ? 'page' : undefined}>
          Journal
        </a>
        <a href="/growth">Growth</a>
        <a href="/connect">Connect</a>
        <a href="/#resources">Free journey</a>
      </nav>
    </header>
  );
}

// Rendered inside articles: turns a host name from a post's `network` list into
// a proper card, so the descriptions live in one place.
function NetworkMentions({ hosts }) {
  const sites = (hosts || []).map(siteByHost).filter(Boolean);
  if (!sites.length) return null;

  return (
    <aside className="post-network" aria-labelledby="post-network-title">
      <p className="section-kicker">
        <Compass size={16} aria-hidden="true" />
        Keep going
      </p>
      <h2 id="post-network-title">Mentioned in this article</h2>
      <div className="post-network-grid">
        {sites.map((site) => (
          <a key={site.host} href={site.url} target="_blank" rel="noopener">
            <strong>{site.name}</strong>
            <small>{site.tagline}</small>
            <span>
              {site.host} <ArrowRight size={14} aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
    </aside>
  );
}

// The journal laid out along Pray → Care → Share → Disciple. Organises a growing
// library without hiding anything: the full filterable list still follows.
function ReadingPath() {
  const bySlug = Object.fromEntries(sortedPostsMeta.map((post) => [post.slug, post]));
  return (
    <section className="reading-path" aria-labelledby="reading-path-title">
      <div className="reading-path-head">
        <p className="section-kicker">
          <Compass size={18} aria-hidden="true" />
          The reading path
        </p>
        <h2 id="reading-path-title">Read it in the order you will live it.</h2>
        <p>
          The same rhythm the map is built on. Start at the beginning, or jump to the step you are in right now.
        </p>
      </div>
      <ol className="reading-path-steps">
        {readingPath.map((stage, index) => (
          <li key={stage.id} className={`reading-step step-${stage.id}`}>
            <span className="reading-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <h3>{stage.label}</h3>
            <p>{stage.note}</p>
            <ul>
              {stage.slugs.map((slug) =>
                bySlug[slug] ? (
                  <li key={slug}>
                    <a href={`/blog/${slug}`} onClick={() => track('path_click', `/blog/${slug}`)}>
                      {bySlug[slug].title}
                    </a>
                    <small>{bySlug[slug].readingTime}</small>
                  </li>
                ) : null,
              )}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Tag counts, most-used first, so the filter row leads with the broadest topics.
function tagCounts() {
  const counts = new Map();
  sortedPostsMeta.forEach((post) => (post.tags || []).forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function BlogIndex() {
  // Read the tag from the hash so a filtered view can be linked and the back
  // button behaves. Filtering stays client-side: with eight posts, per-tag URLs
  // would be thin pages competing with the articles themselves.
  const [activeTag, setActiveTag] = useState(() => {
    const fromHash = decodeURIComponent(window.location.hash.replace(/^#tag=/, ''));
    return window.location.hash.startsWith('#tag=') && fromHash ? fromHash : null;
  });

  useEffect(() => {
    function onHashChange() {
      const raw = window.location.hash;
      setActiveTag(raw.startsWith('#tag=') ? decodeURIComponent(raw.slice(5)) || null : null);
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function chooseTag(tag) {
    setActiveTag(tag);
    if (tag) track('journal_filter', `/blog#tag=${tag}`);
    const next = tag ? `#tag=${encodeURIComponent(tag)}` : ' ';
    window.history.replaceState(null, '', tag ? next : window.location.pathname);
  }

  const tags = tagCounts();
  const visible = activeTag ? sortedPostsMeta.filter((post) => (post.tags || []).includes(activeTag)) : sortedPostsMeta;

  return (
    <main>
      <BlogHeader current="blog" />

      <section className="blog-hero">
        <div>
          <p className="eyebrow">
            <BookOpen size={18} aria-hidden="true" />
            The Oikos Journal
          </p>
          <h1>
            <span>Practical help</span>
            <span>for loving the people</span>
            <span>already around you.</span>
          </h1>
          <p className="hero-lede">
            Honest, useful writing on prayer, everyday evangelism, and discipleship. No guilt, no hype — just the next
            faithful step, explained clearly.
          </p>
        </div>
      </section>

      <ReadingPath />

      <nav className="blog-filter" aria-label="Filter articles by topic">
        <button
          type="button"
          className={activeTag ? 'blog-filter-chip' : 'blog-filter-chip active'}
          onClick={() => chooseTag(null)}
          aria-pressed={!activeTag}
        >
          All <small>{sortedPostsMeta.length}</small>
        </button>
        {tags.map(([tag, count]) => (
          <button
            key={tag}
            type="button"
            className={activeTag === tag ? 'blog-filter-chip active' : 'blog-filter-chip'}
            onClick={() => chooseTag(tag)}
            aria-pressed={activeTag === tag}
          >
            {tag} <small>{count}</small>
          </button>
        ))}
      </nav>

      <p className="blog-filter-status" aria-live="polite">
        {activeTag
          ? `${visible.length} ${visible.length === 1 ? 'article' : 'articles'} tagged ${activeTag}`
          : `All ${sortedPostsMeta.length} articles`}
      </p>

      <section className="blog-list" aria-label="Articles">
        {visible.map((post, index) => (
          <article key={post.slug} className={index === 0 ? 'blog-card featured' : 'blog-card'}>
            <p className="blog-card-kicker">{post.kicker}</p>
            <h2>
              <a href={`/blog/${post.slug}`}>{post.title}</a>
            </h2>
            <p className="blog-card-excerpt">{post.excerpt}</p>
            <AuthorByline date={post.date} readingTime={post.readingTime} compact />
            <div className="blog-tags">
              {post.tags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => chooseTag(tag)}
                  aria-label={`Show articles tagged ${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <a className="blog-card-link" href={`/blog/${post.slug}`}>
              Read the article <ArrowRight size={16} aria-hidden="true" />
            </a>
          </article>
        ))}
      </section>

      <JournalSignup />

      <section className="blog-cta">
        <div>
          <p className="section-kicker">
            <Sparkles size={18} aria-hidden="true" />
            Free, always
          </p>
          <h2>Ready to put names to it?</h2>
          <p>
            Reading about this helps. Writing the names down changes it. Build your Oikos Map in a couple of minutes — it
            saves privately in your own browser.
          </p>
          <a className="primary-action" href="/#builder">
            <Sparkles size={18} aria-hidden="true" />
            Create your map
          </a>
        </div>
      </section>
    </main>
  );
}

// Stable, readable anchors so the contents list and any inbound deep links keep
// working even if a heading moves.
export function headingId(heading) {
  return `s-${String(heading)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;
}

// Short, direct answers to the questions each article targets. Visible on the
// page (FAQPage schema must describe content the reader can actually see), and
// the shape answer engines lift straight into a response.
function QuickAnswers({ faq }) {
  if (!faq?.length) return null;
  return (
    <section className="quick-answers" aria-labelledby="quick-answers-title">
      <h2 id="quick-answers-title">Quick answers</h2>
      <dl>
        {faq.map((item) => (
          <div key={item.q}>
            <dt>{item.q}</dt>
            <dd>{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// Passing an article along is how a ministry resource actually travels, so every
// article ends with the channels people really use: the phone's own share sheet,
// a copyable link, WhatsApp, Facebook, X and email. Counted by channel.
function ShareArticle({ post }) {
  const [copied, setCopied] = useState(false);
  const url = `https://www.oikosmap.com/blog/${post.slug}`;
  const text = `${post.title} — by Daniel Ziedins`;
  const enc = encodeURIComponent;
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  function count(channel) {
    track('share_article', `/blog/${post.slug}#${channel}`);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: post.title, text, url });
      count('native');
    } catch {
      // Dismissing the share sheet is not an error worth showing.
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const field = document.createElement('textarea');
      field.value = url;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    setCopied(true);
    count('copy');
    window.setTimeout(() => setCopied(false), 2200);
  }

  const links = [
    ['WhatsApp', `https://wa.me/?text=${enc(`${text} ${url}`)}`, 'whatsapp'],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, 'facebook'],
    ['X', `https://x.com/intent/post?text=${enc(text)}&url=${enc(url)}`, 'x'],
    ['Email', `mailto:?subject=${enc(post.title)}&body=${enc(`I thought this might help: ${url}`)}`, 'email'],
  ];

  return (
    <aside className="share-article" aria-labelledby="share-article-title">
      <div>
        <p id="share-article-title" className="share-article-title">Know someone who needs this?</p>
        <p className="share-article-note">Send it to one person today — that is how this travels.</p>
      </div>
      <div className="share-article-actions">
        {canNativeShare ? (
          <button type="button" className="share-chip primary" onClick={nativeShare}>
            Share…
          </button>
        ) : null}
        <button type="button" className="share-chip" onClick={copyLink} aria-live="polite">
          {copied ? 'Link copied ✓' : 'Copy link'}
        </button>
        {links.map(([label, href, channel]) => (
          <a
            key={channel}
            className="share-chip"
            href={href}
            target={channel === 'email' ? undefined : '_blank'}
            rel="noopener"
            onClick={() => count(channel)}
            data-no-outbound=""
            aria-label={`Share on ${label}`}
          >
            {label}
          </a>
        ))}
      </div>
    </aside>
  );
}

function TableOfContents({ sections }) {
  if (sections.length < 3) return null;
  return (
    <nav className="post-toc" aria-labelledby="post-toc-title">
      <p id="post-toc-title">In this article</p>
      <ol>
        {sections.map((section) => (
          <li key={section.heading}>
            <a href={`#${headingId(section.heading)}`}>{section.heading}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// "Keep reading" picks, balanced across the whole journal — see buildRelatedMap
// in posts-meta.js, which the build also uses for the non-JS shell links.
function relatedPosts(post) {
  return relatedMap[post.slug] || [];
}

export function BlogPost({ post: meta }) {
  useReadingProgress();
  const others = relatedPosts(meta);
  // The header renders immediately from the summary; the body arrives from its
  // own chunk a tick later. Seeded synchronously when the module is already in
  // the graph so there is usually no empty frame at all.
  const [body, setBody] = useState(null);

  useEffect(() => {
    let live = true;
    loadBody(meta.slug).then((loaded) => {
      if (live) setBody(loaded);
    });
    return () => {
      live = false;
    };
  }, [meta.slug]);

  const post = body ? { ...meta, ...body } : meta;

  // A view when the article arrives; a "read" once someone gets three-quarters
  // of the way down — the honest signal that an article is actually being read.
  useEffect(() => {
    if (!body) return undefined;
    track('article_view');
    let counted = false;
    function onScroll() {
      if (counted) return;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height > 0 && window.scrollY / height >= 0.75) {
        counted = true;
        track('article_read');
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [body]);

  return (
    <main>
      <BlogHeader />

      <article className="post">
        <div className="post-head">
          <a className="post-back" href="/blog">
            <ArrowLeft size={15} aria-hidden="true" />
            The Oikos Journal
          </a>
          <p className="eyebrow">{post.kicker}</p>
          <h1>{post.title}</h1>
          <p className="post-standfirst">{post.description}</p>
          <AuthorByline date={post.date} readingTime={post.readingTime} />
        </div>

        {!body ? <p className="post-loading">Loading the article…</p> : null}

        {body ? (
        <div className="post-body">
          {post.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="post-lede" dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}

          <QuickAnswers faq={post.faq} />

          <TableOfContents sections={post.sections} />

          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 id={headingId(section.heading)}>{section.heading}</h2>
              {(section.paragraphs || []).map((paragraph) => (
                <p key={paragraph.slice(0, 40)} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
              {section.list?.length ? (
                <ul>
                  {section.list.map((item) => (
                    <li key={item.slice(0, 40)} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              ) : null}
              {(section.after || []).map((paragraph) => (
                <p key={paragraph.slice(0, 40)} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </section>
          ))}

          {post.scripture ? (
            <blockquote className="post-scripture">
              <p>&ldquo;{post.scripture.text}&rdquo;</p>
              <cite>{post.scripture.ref}</cite>
            </blockquote>
          ) : null}

          <div className="post-cta">
            <a className="primary-action" href={post.cta.url}>
              <Sparkles size={18} aria-hidden="true" />
              {post.cta.text}
            </a>
          </div>
        </div>
        ) : null}

        {body ? <ShareArticle post={post} /> : null}

        <AuthorCard />

        <JournalSignup compact />

        <NetworkMentions hosts={post.network} />

        {others.length ? (
          <nav className="post-more" aria-label="Related articles">
            <h2>Keep reading</h2>
            <div>
              {others.map((entry) => (
                <a key={entry.slug} href={`/blog/${entry.slug}`}>
                  <strong>{entry.title}</strong>
                  <small>{entry.excerpt}</small>
                </a>
              ))}
            </div>
          </nav>
        ) : null}
      </article>
    </main>
  );
}
