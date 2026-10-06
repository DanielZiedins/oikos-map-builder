// Build-time aggregate of every article: summary + full body.
//
// This is imported by scripts/build-blog.js (Node) to generate the prerendered
// shells, sitemap, feed and llms files. The browser must NOT import this — it
// pulls in every article body at once. Article pages load a single body module
// from src/content/bodies/ on demand; listings use posts-meta.js.

import { postsMeta, sortedPostsMeta } from './posts-meta.js';

import evangelismWithoutBeingWeird from './bodies/evangelism-without-being-weird.js';
import faithAtWork from './bodies/faith-at-work-your-coworkers-are-your-oikos.js';
import fromHamiltonToTheNations from './bodies/from-hamilton-to-the-nations.js';
import howToDiscipleSomeone from './bodies/how-to-disciple-someone.js';
import howToInviteSomeoneToChurch from './bodies/how-to-invite-someone-to-church.js';
import howToPrayForUnsavedFamilyAndFriends from './bodies/how-to-pray-for-unsaved-family-and-friends.js';
import howToShareYourTestimony from './bodies/how-to-share-your-testimony.js';
import oikosEvangelismEarlyChurch from './bodies/oikos-evangelism-early-church.js';
import plunderHellPopulateHeaven from './bodies/plunder-hell-populate-heaven.js';
import prayingForYourCity from './bodies/praying-for-your-city.js';
import whatIsAnOikos from './bodies/what-is-an-oikos.js';
import whatToSayWhenSomeoneIsHurting from './bodies/what-to-say-when-someone-is-hurting.js';

const bodies = {
  'evangelism-without-being-weird': evangelismWithoutBeingWeird,
  'faith-at-work-your-coworkers-are-your-oikos': faithAtWork,
  'from-hamilton-to-the-nations': fromHamiltonToTheNations,
  'how-to-disciple-someone': howToDiscipleSomeone,
  'how-to-invite-someone-to-church': howToInviteSomeoneToChurch,
  'how-to-pray-for-unsaved-family-and-friends': howToPrayForUnsavedFamilyAndFriends,
  'how-to-share-your-testimony': howToShareYourTestimony,
  'oikos-evangelism-early-church': oikosEvangelismEarlyChurch,
  'plunder-hell-populate-heaven': plunderHellPopulateHeaven,
  'praying-for-your-city': prayingForYourCity,
  'what-is-an-oikos': whatIsAnOikos,
  'what-to-say-when-someone-is-hurting': whatToSayWhenSomeoneIsHurting,
};

// Fail the build rather than silently shipping an article with no body.
const orphans = postsMeta.filter((meta) => !bodies[meta.slug]).map((meta) => meta.slug);
if (orphans.length) {
  throw new Error(`posts.js: no body module for ${orphans.join(', ')} — add src/content/bodies/<slug>.js`);
}

export const posts = postsMeta.map((meta) => ({ ...meta, ...bodies[meta.slug] }));

export const sortedPosts = sortedPostsMeta.map((meta) => ({ ...meta, ...bodies[meta.slug] }));

export function postBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}

// One reading-time formula for the whole journal, counting what a reader actually
// reads: intro, headings, body, lists and the quick answers, at 220 words a
// minute. The stored readingTime in posts-meta.js must match this —
// scripts/build-blog.js fails the build if it does not, so it cannot drift.
export function readingMinutes(post) {
  const text = [
    ...(post.intro || []),
    ...(post.faq || []).flatMap((item) => [item.q, item.a]),
    ...(post.sections || []).flatMap((section) => [
      section.heading,
      ...(section.paragraphs || []),
      ...(section.list || []),
      ...(section.after || []),
    ]),
  ]
    .join(' ')
    .replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

