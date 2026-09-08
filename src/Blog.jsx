import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Clock, Compass, Mail, Sparkles } from 'lucide-react';
import { sortedPosts } from './content/posts.js';
import { siteByHost } from './content/network.js';
import { JourneyTimeline, LeadCapture } from './journey.jsx';

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

export function BlogIndex() {
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

      <section className="blog-list" aria-label="Articles">
        {sortedPosts.map((post, index) => (
          <article key={post.slug} className={index === 0 ? 'blog-card featured' : 'blog-card'}>
            <p className="blog-card-kicker">{post.kicker}</p>
            <h2>
              <a href={`/blog/${post.slug}`}>{post.title}</a>
            </h2>
            <p className="blog-card-excerpt">{post.excerpt}</p>
            <div className="blog-card-meta">
              <span>
                <CalendarDays size={14} aria-hidden="true" /> {formatDate(post.date)}
              </span>
              <span>
                <Clock size={14} aria-hidden="true" /> {post.readingTime}
              </span>
            </div>
            <div className="blog-tags">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
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

// Rank by shared tags so "keep reading" is genuinely related rather than
// whichever three posts happen to sort first.
function relatedPosts(post, limit = 3) {
  const tags = new Set(post.tags || []);
  return sortedPosts
    .filter((entry) => entry.slug !== post.slug)
    .map((entry) => ({ entry, shared: (entry.tags || []).filter((tag) => tags.has(tag)).length }))
    .sort((a, b) => b.shared - a.shared || a.entry.order - b.entry.order)
    .slice(0, limit)
    .map((match) => match.entry);
}

export function BlogPost({ post }) {
  useReadingProgress();
  const others = relatedPosts(post);

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
          <div className="blog-card-meta">
            <span>
              <CalendarDays size={14} aria-hidden="true" /> {formatDate(post.date)}
            </span>
            <span>
              <Clock size={14} aria-hidden="true" /> {post.readingTime}
            </span>
          </div>
        </div>

        <div className="post-body">
          {post.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="post-lede" dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}

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
