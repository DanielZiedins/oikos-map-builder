import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { verseCollections } from './content/posts-meta.js';

// The verse-list articles as one swipeable rail. Used on the journal index and
// the homepage: these are the pages most people arrive on, so they should be
// one tap from anywhere.
export function VerseRail({ heading = 'h2', dark = false }) {
  const Heading = heading;
  const total = verseCollections.reduce((sum, item) => sum + (item.count || 0), 0);
  return (
    <section className={dark ? 'verse-rail verse-rail-dark' : 'verse-rail'} aria-labelledby="verse-rail-title">
      <div className="verse-rail-head">
        <p className="section-kicker">
          <BookOpen size={18} aria-hidden="true" />
          Scripture by topic
        </p>
        <Heading id="verse-rail-title">
          {total} verses, ready to pray and share.
        </Heading>
        <p>Every verse is quoted from the NIV, with a button to copy it or save it as an image.</p>
      </div>
      <ul className="verse-rail-track">
        {verseCollections.map((item) => (
          <li key={item.slug}>
            <a href={`/blog/${item.slug}`} style={{ '--tone': item.color }}>
              <span className="verse-rail-count">
                {item.count ?? '✦'}
                <small> verses</small>
              </span>
              <strong>{item.label}</strong>
              <span className="verse-rail-go" aria-hidden="true">
                Open <ArrowRight size={15} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
