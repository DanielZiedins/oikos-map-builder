// Body for /blog/thanksgiving-bible-verses-to-share. Every verse is NIV, word
// for word, inside quotation marks; the "Share it" lines are commentary. No
// year in the copy, and no single Thanksgiving date: Canada gives thanks in
// October and the United States in November, so it works for both.

const v = (ref, text, share) => `<strong>${ref}</strong> — <em>"${text}"</em> <br>Share it: ${share}`;

export default {
  intro: [
    'Thanksgiving is one of the few days of the year when almost everyone, believer or not, stops to say what they are grateful for. That makes it one of the most natural days of the year to point gently to the One we thank.',
    'Here are 25 Thanksgiving Bible verses to share, grouped by theme: for cards and texts, for saying grace at the table, for hard seasons, and for the people you are thankful for. Each has a tap-to-copy button and a suggestion for where it fits.',
  ],
  sections: [
    {
      heading: 'Give thanks to the Lord',
      list: [
        v('Psalm 100:4–5', 'Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name. For the LORD is good and his love endures forever; his faithfulness continues through all generations.', 'The classic Thanksgiving verse, for a card or the top of a family group chat.'),
        v('Psalm 107:1', 'Give thanks to the LORD, for he is good; his love endures forever.', 'Short enough for a caption, a place card or a chalkboard by the door.'),
        v('1 Chronicles 16:34', 'Give thanks to the LORD, for he is good; his love endures forever.', 'The same words, sung when the ark came home. Good for a family that has just been through a move or a reunion.'),
        v('Psalm 9:1', 'I will give thanks to you, LORD, with all my heart; I will tell of all your wonderful deeds.', 'An invitation to go round the table and tell one thing God has done this year.'),
        v('Psalm 95:2', 'Let us come before him with thanksgiving and extol him with music and song.', 'For the worship team, the choir, or the cousin who always brings a guitar.'),
        v('Psalm 103:2', 'Praise the LORD, my soul, and forget not all his benefits—', 'A note to yourself before the day gets busy.'),
        v('Psalm 126:3', 'The LORD has done great things for us, and we are filled with joy.', 'For a family that has a specific answer to prayer to celebrate.'),
      ],
    },
    {
      heading: 'Grace at the table',
      list: [
        v('Deuteronomy 8:10', 'When you have eaten and are satisfied, praise the LORD your God for the land he has given you.', 'Read it after the meal, not just before.'),
        v('Psalm 145:15–16', 'The eyes of all look to you, and you give them their food at the proper time. You open your hand and satisfy the desires of every living thing.', 'A table grace that works for a mixed crowd: it is a thank-you, not a sermon.'),
        v('1 Timothy 4:4', 'For everything God created is good, and nothing is to be rejected if it is received with thanksgiving,', 'For the host who worried about the turkey.'),
        v('John 6:11', 'Jesus then took the loaves, gave thanks, and distributed to those who were seated as much as they wanted. He did the same with the fish.', 'Jesus gave thanks before He fed people. A good word for a community meal or a food drive.'),
        v('James 1:17', 'Every good and perfect gift is from above, coming down from the Father of the heavenly lights, who does not change like shifting shadows.', 'For someone who says they are thankful but is not sure who to thank.'),
      ],
    },
    {
      heading: 'Thankful in every season',
      paragraphs: [
        'Not everyone comes to the table full. For some, this is the first holiday with an empty chair. These verses do not pretend otherwise.',
      ],
      list: [
        v('1 Thessalonians 5:16–18', 'Rejoice always, pray continually, give thanks in all circumstances; for this is God’s will for you in Christ Jesus.', 'In all circumstances, not for all circumstances. Worth saying out loud to someone who is struggling.'),
        v('Philippians 4:6', 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', 'For the friend who is anxious about the holidays.'),
        v('Lamentations 3:22–23', 'Because of the LORD’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.', 'For someone grieving. Written in the middle of loss, not after it.'),
        v('Psalm 28:7', 'The LORD is my strength and my shield; my heart trusts in him, and he helps me. My heart leaps for joy, and with my song I praise him.', 'For someone who has come through a hard year.'),
        v('Psalm 34:1', 'I will extol the LORD at all times; his praise will always be on my lips.', 'A quiet commitment for the days after Thanksgiving, too.'),
      ],
      after: ['If someone you love is hurting this season, <a href="/blog/what-to-say-when-someone-is-hurting">here is what to say (and what not to)</a>.'],
    },
    {
      heading: 'Thankful for your people',
      list: [
        v('Philippians 1:3', 'I thank my God every time I remember you.', 'The perfect thank-you text. Send it, with their name, to five people this week.'),
        v('Ephesians 1:16', 'I have not stopped giving thanks for you, remembering you in my prayers.', 'For someone you have prayed for for a long time. Let them know.'),
        v('1 Thessalonians 1:2', 'We always thank God for all of you and continually mention you in our prayers.', 'For a small group, a team or a church family.'),
        v('Numbers 6:24–26', 'The LORD bless you and keep you; the LORD make his face shine on you and be gracious to you; the LORD turn his face toward you and give you peace.', 'A blessing to speak over your family as everyone heads home.'),
      ],
    },
    {
      heading: 'Thanks for the greatest gift',
      list: [
        v('1 Corinthians 15:57', 'But thanks be to God! He gives us the victory through our Lord Jesus Christ.', 'The reason behind every other thank-you.'),
        v('2 Corinthians 4:15', 'All this is for your benefit, so that the grace that is reaching more and more people may cause thanksgiving to overflow to the glory of God.', 'Gratitude grows as grace reaches more people. A good prayer for the people on your heart.'),
        v('Colossians 2:6–7', 'So then, just as you received Christ Jesus as Lord, continue to live your lives in him, rooted and built up in him, strengthened in the faith as you were taught, and overflowing with thankfulness.', 'For a new believer at their first Thanksgiving in Christ.'),
        v('Hebrews 12:28', 'Therefore, since we are receiving a kingdom that cannot be shaken, let us be thankful, and so worship God acceptably with reverence and awe,', 'For anyone who feels the world is shaking.'),
      ],
    },
    {
      heading: 'Turn thanks into an open door',
      paragraphs: [
        'Gratitude is one of the easiest ways into a real conversation about God. Most people will happily tell you what they are thankful for. Fewer have been asked who they thank. Three simple ways to use the day:',
      ],
      list: [
        '<strong>Send five thank-you texts.</strong> Pick five people from your <a href="/#builder">Oikos Map</a>, send each one Philippians 1:3 with a sentence about why you are grateful for them, and pray for them by name as you send it.',
        '<strong>Ask a better question at the table.</strong> Instead of only “What are you thankful for?”, try “What is something this year that felt like more than luck?” <a href="/blog/spiritual-conversation-starters">More conversation starters that do not feel forced.</a>',
        '<strong>Invite someone who would be alone.</strong> The most powerful Thanksgiving verse is an empty chair filled. <a href="/blog/biblical-hospitality">Biblical hospitality, made simple.</a>',
      ],
      after: ['Heading into the holidays with family who do not share your faith? Read <a href="/blog/talking-about-jesus-with-family-at-the-holidays">How to Talk About Jesus With Family at the Holidays</a>, and when December comes, <a href="/blog/christmas-bible-verses-to-share">25 Christmas Bible Verses to Share</a>.'],
    },
  ],
  scripture: {
    text: 'I thank my God every time I remember you.',
    ref: 'Philippians 1:3',
  },
  network: ['LoveonTheWorld.com', 'KD-Ziedins.com', 'JesusFestival.ca'],
  cta: { text: 'Name the five people you are most thankful for', url: '/#builder' },
  faq: [
    {
      q: 'What is the best Bible verse for Thanksgiving?',
      a: 'Psalm 100:4–5 is the best known: "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name. For the LORD is good and his love endures forever." Psalm 107:1 ("Give thanks to the LORD, for he is good; his love endures forever") is a shorter favourite.',
    },
    {
      q: 'What Bible verse can I use as a Thanksgiving prayer before a meal?',
      a: 'Psalm 145:15–16 ("The eyes of all look to you, and you give them their food at the proper time…") and Deuteronomy 8:10 ("When you have eaten and are satisfied, praise the LORD your God…") both make a simple, warm table grace.',
    },
    {
      q: 'What does the Bible say about giving thanks in hard times?',
      a: '1 Thessalonians 5:18 says to "give thanks in all circumstances," which is different from giving thanks for every circumstance. Lamentations 3:22–23, written in grief, still says "his compassions never fail. They are new every morning."',
    },
    {
      q: 'What Bible verse can I send to say thank you to a friend?',
      a: 'Philippians 1:3: "I thank my God every time I remember you." Ephesians 1:16 ("I have not stopped giving thanks for you, remembering you in my prayers") works well for someone you pray for regularly.',
    },
  ],
};
