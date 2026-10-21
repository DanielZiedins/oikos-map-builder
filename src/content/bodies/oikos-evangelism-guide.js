// Body for /blog/oikos-evangelism-guide — the journal's pillar page. It walks the
// whole reading path and links every article; the final "every guide" list is
// generated from posts-meta.js so new articles appear here automatically.
// Scripture is NIV, word for word, inside quotation marks.
import { readingPath, sortedPostsMeta } from '../posts-meta.js';

const bySlug = Object.fromEntries(sortedPostsMeta.map((post) => [post.slug, post]));
const link = (slug, text) => `<a href="/blog/${slug}">${text || bySlug[slug]?.title || slug}</a>`;

export default {
  intro: [
    'Most people who come to faith in Jesus do not meet Him through a stranger. They meet Him through someone they already know — a parent, a friend, a coworker, a neighbour who kept showing up. The New Testament has a word for that circle of everyday relationships: <em>oikos</em>.',
    'This is the complete guide to oikos evangelism: what it is, why it is how the Gospel has always spread, and a simple five-part rhythm — pray, care, share, disciple, send — with a practical guide for every step. Start at the top, or jump to the step you are in.',
  ],
  sections: [
    {
      heading: 'What is oikos evangelism?',
      paragraphs: [
        '<strong>Oikos evangelism is sharing the good news of Jesus through the relationships God has already given you — your household, extended family, friends, neighbours, coworkers and classmates — rather than mainly with strangers.</strong>',
        '<em>Oikos</em> is the Greek word for household, and in the first century it meant far more than a nuclear family: relatives, workers, friends and regular guests. ' + link('what-is-an-oikos', 'What Is an Oikos?') + ' explains the word in full.',
        'It is the pattern of the book of Acts. When the Philippian jailer believed, Paul and Silas told him: <em>"Believe in the Lord Jesus, and you will be saved—you and your household"</em> (Acts 16:31). Cornelius gathered <em>"his relatives and close friends"</em> (Acts 10:24). Lydia\'s household was baptized with her (Acts 16:15). ' + link('oikos-evangelism-early-church', 'Oikos Evangelism: How the Early Church Actually Grew') + ' traces it through the New Testament.',
      ],
    },
    {
      heading: 'Why it works',
      list: [
        '<strong>Trust already exists.</strong> People listen to those who have earned the right to be heard.',
        '<strong>It is ongoing.</strong> You do not get one conversation; you get years of them.',
        '<strong>Your life is visible.</strong> They see how you handle stress, failure and joy — <em>"let your light shine before others"</em> (Matthew 5:16).',
        '<strong>It multiplies.</strong> One person who meets Jesus often opens the door to a whole circle. That is what a ' + link('what-is-a-person-of-peace', 'person of peace') + ' does.',
        '<strong>Anyone can do it.</strong> No platform or training required — just the people already around you.',
      ],
    },
    {
      heading: 'Step zero: name your people',
      paragraphs: [
        'Good intentions toward "my friends" rarely become action. Names do. Write down the people you see regularly in five circles — family, friends, work, school and neighbours — and choose five to focus on.',
        'The <a href="/#builder">free Oikos Map builder</a> does this in a couple of minutes, keeps it private on your device, and adds a five-minute prayer timer, a daily verse and a question to ask for each person. Prefer paper? ' + link('free-printable-oikos-map-template', 'Print the free two-page template') + '.',
      ],
    },
    {
      heading: '1. Pray: name them before God',
      paragraphs: [
        'Everything starts here, because only God can open eyes and change hearts (2 Corinthians 4:4, Ezekiel 36:26). Pray daily, by name, for an open door. Jesus told us to <em>"Ask the Lord of the harvest, therefore, to send out workers into his harvest field"</em> (Matthew 9:38) — and the worker is often you.',
      ],
      list: [
        link('how-to-pray-for-unsaved-family-and-friends') + ' — a five-minute daily rhythm.',
        link('bible-verses-to-pray-for-unsaved-loved-ones') + ' — Scripture with a prayer for each.',
        link('how-to-prayer-walk') + ' — praying on foot for your street.',
        link('praying-for-your-city') + ' — widening it to the whole city.',
      ],
    },
    {
      heading: '2. Care: love that shows up',
      paragraphs: [
        'Love opens doors that arguments never will. <em>"Let us not love with words or speech but with actions and in truth"</em> (1 John 3:18). Show up, serve, listen, eat together, and be interruptible.',
      ],
      list: [
        link('who-is-my-neighbour') + ' — what Jesus meant by loving your neighbour.',
        link('evangelism-without-being-weird') + ' — twelve ordinary ways to start this week.',
        link('biblical-hospitality') + ' — opening your table.',
        link('what-to-say-when-someone-is-hurting') + ' — when life falls apart for someone you love.',
      ],
    },
    {
      heading: '3. Share: put the good news into words',
      paragraphs: [
        'Care earns trust; words explain the hope. <em>"Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have. But do this with gentleness and respect"</em> (1 Peter 3:15). Start with good questions, tell your own story, and explain the Gospel simply.',
      ],
      list: [
        link('what-is-the-gospel') + ' — the good news itself, in plain words.',
        link('overcoming-fear-of-sharing-your-faith') + ' — when your heart races.',
        link('spiritual-conversation-starters') + ' — questions that open the door.',
        link('how-to-share-your-testimony') + ' — your story in three minutes.',
        link('how-to-lead-someone-to-jesus') + ' — the Gospel in four simple parts.',
        link('answering-common-objections-to-christianity') + ' — when people push back.',
        link('how-to-invite-someone-to-church') + ' and ' + link('talking-about-jesus-with-family-at-the-holidays', 'talking about Jesus with family at the holidays') + '.',
        link('faith-at-work-your-coworkers-are-your-oikos') + ', ' + link('how-to-share-your-faith-at-school', 'sharing your faith at school') + ' and ' + link('how-to-share-your-faith-online', 'sharing it online') + '.',
      ],
    },
    {
      heading: '4. Disciple: walk with them',
      paragraphs: [
        'The goal is not a decision but a disciple — someone who follows Jesus and helps others do the same (2 Timothy 2:2). Follow up quickly, read Scripture together, and keep walking.',
      ],
      list: [
        link('what-is-a-disciple') + ' — the biblical meaning.',
        link('how-to-follow-up-after-a-gospel-conversation') + ' — the first 48 hours and beyond.',
        link('how-to-disciple-someone') + ' — a pattern you can repeat.',
        link('how-to-start-a-bible-study-with-friends') + ' — even before they believe.',
        link('how-to-lead-your-child-to-jesus') + ' — discipleship starts at home.',
      ],
    },
    {
      heading: '5. Send: beyond your own circle',
      paragraphs: [
        'Your oikos is your Jerusalem; Jesus also said Judea, Samaria and the ends of the earth (Acts 1:8). Some go, some pray, some send — and all share in the fruit.',
      ],
      list: [
        link('what-is-the-great-commission') + ' — Matthew 28 explained.',
        link('what-is-missional-living') + ' — your whole life as a mission field.',
        link('how-to-start-a-street-outreach-group') + ' — reaching your city with two or three others.',
        link('plunder-hell-populate-heaven') + ' — your part in sending the Gospel.',
        link('from-hamilton-to-the-nations') + ' — what one small yes has built.',
      ],
    },
    {
      heading: 'Every guide, in reading order',
      paragraphs: ['The full Oikos Journal, step by step. New guides are added here as they are published.'],
      list: readingPath.flatMap((stage) =>
        stage.slugs
          .filter((slug) => bySlug[slug] && slug !== 'oikos-evangelism-guide')
          .map((slug) => `<strong>${stage.label}:</strong> ${link(slug)}`),
      ),
    },
  ],
  scripture: {
    text: 'Believe in the Lord Jesus, and you will be saved—you and your household.',
    ref: 'Acts 16:31',
  },
  network: ['LoveonTheWorld.com', 'KingdomBase.App', 'KD-Ziedins.com'],
  cta: { text: 'Start with step zero: map your oikos', url: '/#builder' },
  faq: [
    {
      q: 'What is oikos evangelism?',
      a: 'Oikos evangelism is sharing the good news of Jesus through the relationships God has already given you — household, family, friends, neighbours, coworkers and classmates. Oikos is the Greek word for household, and the pattern runs through Acts, where whole households came to faith (Acts 10, Acts 16).',
    },
    {
      q: 'What are the steps of oikos evangelism?',
      a: 'Name the people around you, then follow a simple rhythm: pray for them by name, care for them practically, share your story and the Gospel when doors open, disciple those who respond, and help send the Gospel beyond your own circle.',
    },
    {
      q: 'Why is oikos evangelism effective?',
      a: 'Because trust already exists, conversations can continue over years, people see your faith lived out, and one person who comes to faith often opens the door to their whole circle — the pattern seen with Lydia, Cornelius and the Philippian jailer in Acts.',
    },
    {
      q: 'How do I start oikos evangelism?',
      a: 'Write down five people you see regularly who do not yet follow Jesus — using the free Oikos Map builder or a printable template — and pray for each of them by name every day. Then take one small step of care for one of them this week.',
    },
  ],
};
