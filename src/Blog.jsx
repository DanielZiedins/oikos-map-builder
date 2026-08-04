import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Clock, Compass, Sparkles } from 'lucide-react';
import { sortedPosts } from './content/posts.js';
import { siteByHost } from './content/network.js';

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

export function BlogPost({ post }) {
  const others = sortedPosts.filter((entry) => entry.slug !== post.slug).slice(0, 3);

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

          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
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

        <NetworkMentions hosts={post.network} />

        {others.length ? (
          <nav className="post-more" aria-label="More articles">
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
