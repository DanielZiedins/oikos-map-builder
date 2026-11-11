// Body for /blog/bible-verses-for-a-friend-going-through-a-hard-time. Every
// verse is NIV, word for word, inside quotation marks (speech inside a verse
// uses single quotes); the "Send it" lines are commentary. No hotline numbers
// or addresses: crisis details vary by country and must never be invented.

const v = (ref, text, send) => `<strong>${ref}</strong> — <em>"${text}"</em> <br>Send it: ${send}`;

export default {
  intro: [
    'When someone you love is going through a hard time, it is easy to say nothing because you are afraid of saying the wrong thing. A single verse, sent at the right moment with one honest sentence of your own, can tell them two things they badly need to hear: God has not forgotten you, and neither have I.',
    'Here are 25 Bible verses for a friend going through a hard time, grouped by what they are facing: feeling alone, worn out or anxious, grieving, or losing hope. Each has a tap-to-copy button and a note on when it fits.',
  ],
  sections: [
    {
      heading: 'Before you send a verse',
      paragraphs: [
        'A verse is not a fix, and a hurting person can tell the difference between being comforted and being corrected. Three small rules keep Scripture feeling like a hand on the shoulder rather than a lecture:',
      ],
      list: [
        '<strong>Presence first.</strong> “I am so sorry. I am here.” comes before any verse. Sometimes it is the whole message.',
        '<strong>One verse, not ten.</strong> Choose the one that fits, add a line of your own, and do not ask for a reply.',
        '<strong>Pray it, then send it.</strong> Pray the verse over them by name first. They will feel the difference.',
      ],
      after: ['For the conversation itself, read <a href="/blog/what-to-say-when-someone-is-hurting">What to Say When Someone Is Hurting (and What Not to Say)</a>.'],
    },
    {
      heading: 'When they feel alone',
      list: [
        v('Psalm 34:18', 'The LORD is close to the brokenhearted and saves those who are crushed in spirit.', 'The first verse to reach for. It promises nearness, not explanations.'),
        v('Psalm 46:1', 'God is our refuge and strength, an ever-present help in trouble.', 'For the day the bad news arrives.'),
        v('Deuteronomy 31:8', 'The LORD himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged.', 'Before a hospital appointment, a court date or a hard conversation.'),
        v('Isaiah 41:10', 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.', 'For someone who feels they cannot hold themselves up.'),
        v('Psalm 23:4', 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.', 'For a long illness or a long night. Notice it says through.'),
        v('Isaiah 43:2', 'When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you. When you walk through the fire, you will not be burned; the flames will not set you ablaze.', 'When everything seems to be happening at once.'),
      ],
    },
    {
      heading: 'When they are worn out or anxious',
      list: [
        v('Matthew 11:28', 'Come to me, all you who are weary and burdened, and I will give you rest.', 'For the exhausted carer, parent or shift worker.'),
        v('1 Peter 5:7', 'Cast all your anxiety on him because he cares for you.', 'Short enough for a text. Add: “and so do I.”'),
        v('Psalm 55:22', 'Cast your cares on the LORD and he will sustain you; he will never let the righteous be shaken.', 'For someone carrying a weight that is not theirs to carry alone.'),
        v('Philippians 4:6–7', 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.', 'Send it with an offer: “Can I pray this with you right now?”'),
        v('John 14:27', 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.', 'For a mind that will not switch off at night.'),
        v('Isaiah 40:31', 'but those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.', 'For a long recovery. Some days the miracle is simply walking and not fainting.'),
        v('2 Corinthians 12:9', 'But he said to me, ‘My grace is sufficient for you, for my power is made perfect in weakness.’ Therefore I will boast all the more gladly about my weaknesses, so that Christ’s power may rest on me.', 'For someone ashamed of not coping.'),
      ],
    },
    {
      heading: 'When they are grieving',
      paragraphs: [
        'Grief does not need to be hurried. These verses sit with sorrow instead of trying to end it.',
      ],
      list: [
        v('Matthew 5:4', 'Blessed are those who mourn, for they will be comforted.', 'Permission to mourn, from Jesus Himself.'),
        v('Psalm 147:3', 'He heals the brokenhearted and binds up their wounds.', 'In a sympathy card, handwritten.'),
        v('Psalm 73:26', 'My flesh and my heart may fail, but God is the strength of my heart and my portion forever.', 'For the weeks after the funeral, when everyone else has gone home.'),
        v('Psalm 30:5', 'For his anger lasts only a moment, but his favor lasts a lifetime; weeping may stay for the night, but rejoicing comes in the morning.', 'Later, not on the first day. It honours the night before it promises the morning.'),
        v('2 Corinthians 1:3–4', 'Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles, so that we can comfort those in any trouble with the comfort we ourselves receive from God.', 'For a friend who has walked this road before you. Thank them for comforting you.'),
        v('Revelation 21:4', '‘He will wipe every tear from their eyes. There will be no more death’ or mourning or crying or pain, for the old order of things has passed away.', 'For a believer grieving a believer. The last word is not loss.'),
      ],
    },
    {
      heading: 'When they are losing hope',
      list: [
        v('John 16:33', 'I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.', 'Honest about trouble and certain about the ending.'),
        v('Romans 8:38–39', 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.', 'For someone who feels far from God.'),
        v('Romans 8:28', 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.', 'True, but tender. Share it when they are asking “why”, never as an answer they did not ask for.'),
        v('Jeremiah 29:11', '‘For I know the plans I have for you,’ declares the LORD, ‘plans to prosper you and not to harm you, plans to give you hope and a future.’', 'Written to people in exile. For someone whose plans have fallen apart.'),
        v('Psalm 121:1–2', 'I lift up my eyes to the mountains—where does my help come from? My help comes from the LORD, the Maker of heaven and earth.', 'For the morning of a hard day.'),
        v('Romans 15:13', 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.', 'A blessing to end a message, or a visit, with.'),
      ],
    },
    {
      heading: 'After the verse: stay',
      paragraphs: [
        'The verse opens the door. What people remember is who kept showing up. Put a reminder in your calendar for three days from now, and again in three weeks, when most people have stopped asking.',
        'If your friend is on your <a href="/#builder">Oikos Map</a>, move them to the Care step and write one practical thing you will do this week: a meal, a lift, an hour of listening. <a href="/blog/evangelism-without-being-weird">Twelve simple ways to love someone this week</a> will give you ideas.',
        'And if someone tells you they are in danger or are thinking about ending their life, do not handle it alone or by text: stay with them and contact your local emergency services or crisis line straight away.',
      ],
    },
  ],
  scripture: {
    text: 'The LORD is close to the brokenhearted and saves those who are crushed in spirit.',
    ref: 'Psalm 34:18',
  },
  network: ['KingdomResponse.com', 'LoveonTheWorld.com', 'IAmReborn.net'],
  cta: { text: 'Name the friend you will stand with this week', url: '/#builder' },
  faq: [
    {
      q: 'What is a good Bible verse for a friend going through a hard time?',
      a: 'Psalm 34:18 is a gentle place to start: "The LORD is close to the brokenhearted and saves those who are crushed in spirit." Isaiah 41:10, Matthew 11:28 and 1 Peter 5:7 are also widely shared because they promise God’s presence and care rather than offering explanations.',
    },
    {
      q: 'What Bible verse can I send to someone who is grieving?',
      a: 'Matthew 5:4 ("Blessed are those who mourn, for they will be comforted") and Psalm 147:3 ("He heals the brokenhearted and binds up their wounds") both sit with grief without hurrying it. Send one verse with a line of your own, and do not expect a reply.',
    },
    {
      q: 'What is a short Bible verse for encouragement in a text message?',
      a: '1 Peter 5:7 ("Cast all your anxiety on him because he cares for you"), Psalm 46:1 ("God is our refuge and strength, an ever-present help in trouble") and Matthew 11:28 ("Come to me, all you who are weary and burdened, and I will give you rest") are all short enough for a text.',
    },
    {
      q: 'Is it insensitive to send a Bible verse to someone who is hurting?',
      a: 'Not if presence comes first. Say you are sorry and that you are there, choose one verse that comforts rather than corrects, and avoid using Scripture to explain their pain. Verses about God’s nearness, such as Psalm 34:18, are usually received better than verses about God’s purposes.',
    },
  ],
};
