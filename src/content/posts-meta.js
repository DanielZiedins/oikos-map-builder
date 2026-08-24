// Light post summaries. Imported by the homepage so it never has to pull in the
// full article bodies (see posts.js). Keep in step with posts.js — the slugs must match.

export const postsMeta = [
  {
    slug: "what-is-an-oikos",
    order: 1,
    title: "What Is an Oikos? The Biblical Meaning of Your Household",
    description: "Oikos is the Greek word for household, but in the New Testament it means far more than the people under your roof. Here is what it meant then, and what it means for you now.",
    date: "2026-07-30",
    readingTime: "6 min read",
    tags: [
      "Oikos",
      "Bible study",
      "Evangelism"
    ],
    kicker: "Start here",
    excerpt: "The word appears more than a hundred times in the New Testament, and it quietly explains how the early Church grew so fast.",
  },
  {
    slug: "how-to-pray-for-unsaved-family-and-friends",
    order: 2,
    title: "How to Pray for Unsaved Family and Friends (A Simple Daily Rhythm)",
    description: "A five-minute daily rhythm for praying by name for the people you love who do not yet follow Jesus — including what to pray when it has been years.",
    date: "2026-07-30",
    readingTime: "7 min read",
    tags: [
      "Prayer",
      "Family",
      "Perseverance"
    ],
    kicker: "Step one · Pray",
    excerpt: "Most of us do not stop praying for the people we love because we lack faith. We stop because we never had a rhythm.",
  },
  {
    slug: "how-to-share-your-testimony",
    order: 4,
    title: "How to Share Your Testimony in Three Minutes",
    description: "A simple three-part framework for telling your story of coming to faith — clearly, honestly, and short enough that people actually listen.",
    date: "2026-07-30",
    readingTime: "6 min read",
    tags: [
      "Testimony",
      "Evangelism",
      "Practical"
    ],
    kicker: "Step three · Share",
    excerpt: "You are not the expert witness on theology. You are the eyewitness on your own life, and nobody can cross-examine that.",
  },
  {
    slug: "evangelism-without-being-weird",
    order: 3,
    title: "Evangelism Without Being Weird: 12 Ways to Love Your Neighbour This Week",
    description: "Twelve ordinary, non-awkward ways to move toward the people around you — the practical middle ground between praying for someone and preaching at them.",
    date: "2026-07-30",
    readingTime: "5 min read",
    tags: [
      "Care",
      "Neighbours",
      "Practical"
    ],
    kicker: "Step two · Care",
    excerpt: "Almost nobody changes their mind about Jesus because they lost an argument. They change because someone loved them in a way that did not add up.",
  },
  {
    slug: "oikos-evangelism-early-church",
    order: 5,
    title: "Oikos Evangelism: How the Early Church Actually Grew",
    description: "The early Church grew from a few thousand to millions without buildings, budgets, or public platforms. Households were the engine — and the method still works.",
    date: "2026-07-30",
    readingTime: "8 min read",
    tags: [
      "Church history",
      "Multiplication",
      "Discipleship"
    ],
    kicker: "The bigger picture",
    excerpt: "No buildings, no budget, no legal standing, and frequently illegal. And it kept spreading. The mechanism is not a mystery.",
  },
  {
    slug: "faith-at-work-your-coworkers-are-your-oikos",
    order: 6,
    title: "Faith at Work: Your Coworkers Are Your Oikos",
    description: "You spend more waking hours with colleagues than with almost anyone else. Here is how to be a genuine witness at work without becoming the person everyone avoids.",
    date: "2026-07-30",
    readingTime: "7 min read",
    tags: [
      "Work",
      "Culture",
      "Integrity"
    ],
    kicker: "Where you already are",
    excerpt: "Roughly 90,000 hours over a working life, with the same group of people. It is the largest mission field most Christians have, and the one we think about least.",
  },
  {
    slug: "how-to-invite-someone-to-church",
    order: 7,
    title: "How to Invite Someone to Church Without It Being Awkward",
    description:
      "Most people who come to faith were invited by someone they knew. Here is how to ask well, what to say, where to start, and what to do when the answer is no.",
    date: "2026-08-13",
    readingTime: "6 min read",
    tags: ["Invitation", "Church", "Practical"],
    kicker: "The ask",
    excerpt:
      "The invitation is not the hard part. Deciding to risk the small, brief awkwardness of asking is the hard part.",
  },
  {
    slug: "what-to-say-when-someone-is-hurting",
    order: 8,
    title: "What to Actually Say When Someone Is Going Through Something Hard",
    description:
      "Real sentences that help, the well-meant ones that hurt, and why showing up matters more than saying the right thing.",
    date: "2026-08-13",
    readingTime: "7 min read",
    tags: ["Care", "Grief", "Practical"],
    kicker: "Step two · Care",
    excerpt:
      "Most of us say nothing because we are afraid of saying the wrong thing. Silence is the one option guaranteed to hurt.",
  },
];

export const sortedPostsMeta = [...postsMeta].sort((a, b) => a.order - b.order);

export function metaBySlug(slug) {
  return postsMeta.find((post) => post.slug === slug);
}
