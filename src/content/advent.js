// 25 days of Advent prayer for the people on your map, Dec 1–25. One source for
// the article (/blog/advent-prayer-calendar-for-your-oikos) and the calendar file
// (public/downloads/advent-prayer-calendar.ics, written by scripts/build-blog.js).
// Verses are NIV, word for word. No year appears anywhere: the .ics repeats
// yearly, so this never goes stale.

export const adventWeeks = [
  { id: 'hope', label: 'Week one: Hope', days: [1, 7] },
  { id: 'peace', label: 'Week two: Peace', days: [8, 14] },
  { id: 'joy', label: 'Week three: Joy', days: [15, 21] },
  { id: 'love', label: 'Week four: Love — and Christmas', days: [22, 25] },
];

export const adventDays = [
  {
    day: 1,
    ref: 'Isaiah 9:2',
    text: 'The people walking in darkness have seen a great light; on those living in the land of deep darkness a light has dawned.',
    prayer: 'Light of the world, dawn on each person on my map this Christmas.',
  },
  {
    day: 2,
    ref: '2 Corinthians 4:4',
    text: 'The god of this age has blinded the minds of unbelievers, so that they cannot see the light of the gospel that displays the glory of Christ, who is the image of God.',
    prayer: 'Lift the blindness. Let them see the glory of Christ, not just the decorations.',
  },
  {
    day: 3,
    ref: 'John 1:5',
    text: 'The light shines in the darkness, and the darkness has not overcome it.',
    prayer: 'Shine into the darkest place in each of their lives this month.',
  },
  {
    day: 4,
    ref: 'Ezekiel 36:26',
    text: 'I will give you a new heart and put a new spirit in you; I will remove from you your heart of stone and give you a heart of flesh.',
    prayer: 'Soften every hard heart on my map. Begin with mine.',
  },
  {
    day: 5,
    ref: 'John 6:44',
    text: 'No one can come to me unless the Father who sent me draws them, and I will raise them up at the last day.',
    prayer: 'Father, draw them to Jesus in a way only You can.',
  },
  {
    day: 6,
    ref: 'Romans 15:13',
    text: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',
    prayer: 'For the ones who feel hopeless this season: fill them with real hope.',
  },
  {
    day: 7,
    ref: '1 Timothy 2:3–4',
    text: 'This is good, and pleases God our Savior, who wants all people to be saved and to come to a knowledge of the truth.',
    prayer: 'You want them saved more than I do. I am agreeing with You.',
  },
  {
    day: 8,
    ref: 'Isaiah 9:6',
    text: 'For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.',
    prayer: 'Prince of Peace, be the peace they have been looking for.',
  },
  {
    day: 9,
    ref: 'John 14:27',
    text: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.',
    prayer: 'For the anxious ones on my map: give the peace the world cannot.',
  },
  {
    day: 10,
    ref: 'Colossians 1:13',
    text: 'For he has rescued us from the dominion of darkness and brought us into the kingdom of the Son he loves.',
    prayer: 'Rescue them the way You rescued me.',
  },
  {
    day: 11,
    ref: 'Romans 5:1',
    text: 'Therefore, since we have been justified through faith, we have peace with God through our Lord Jesus Christ,',
    prayer: 'Bring them peace with You — not just a quiet holiday.',
  },
  {
    day: 12,
    ref: 'Matthew 11:28',
    text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    prayer: 'For the exhausted and the grieving this December: give them rest in You.',
  },
  {
    day: 13,
    ref: 'Philippians 4:7',
    text: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
    prayer: 'Guard the hearts of the families on my map through a hard season.',
  },
  {
    day: 14,
    ref: 'Colossians 4:3',
    text: 'And pray for us, too, that God may open a door for our message, so that we may proclaim the mystery of Christ, for which I am in chains.',
    prayer: 'Open one door this week — a question, an invitation, a quiet moment.',
  },
  {
    day: 15,
    ref: 'Luke 2:10',
    text: 'But the angel said to them, “Do not be afraid. I bring you good news that will cause great joy for all the people.”',
    prayer: 'Let the good news reach them as good news, not as pressure.',
  },
  {
    day: 16,
    ref: 'Luke 15:7',
    text: 'I tell you that in the same way there will be more rejoicing in heaven over one sinner who repents than over ninety-nine righteous persons who do not need to repent.',
    prayer: 'May heaven rejoice over someone on my map.',
  },
  {
    day: 17,
    ref: 'Romans 2:4',
    text: 'Or do you show contempt for the riches of his kindness, forbearance and patience, not realizing that God’s kindness is intended to lead you to repentance?',
    prayer: 'Let them notice Your kindness — and let some of it come through me.',
  },
  {
    day: 18,
    ref: 'Luke 15:20',
    text: 'But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him.',
    prayer: 'For the ones far from home and far from You: run to them, Father.',
  },
  {
    day: 19,
    ref: 'Matthew 9:38',
    text: 'Ask the Lord of the harvest, therefore, to send out workers into his harvest field.',
    prayer: 'Send someone to each of them this Christmas — and make me willing.',
  },
  {
    day: 20,
    ref: 'Psalm 16:11',
    text: 'You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.',
    prayer: 'Show them the path of life, and the joy that lasts past December.',
  },
  {
    day: 21,
    ref: '2 Timothy 2:25–26',
    text: 'Opponents must be gently instructed, in the hope that God will grant them repentance leading them to a knowledge of the truth, and that they will come to their senses and escape from the trap of the devil, who has taken them captive to do his will.',
    prayer: 'Free them from every trap. Give me gentleness when we talk.',
  },
  {
    day: 22,
    ref: 'John 3:16',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    prayer: 'Let each of them know: the gift was for them.',
  },
  {
    day: 23,
    ref: 'Romans 5:8',
    text: 'But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.',
    prayer: 'Show them a love they did not have to earn.',
  },
  {
    day: 24,
    ref: '1 John 4:9',
    text: 'This is how God showed his love among us: He sent his one and only Son into the world that we might live through him.',
    prayer: 'On Christmas Eve, draw them to the One who was sent for them.',
  },
  {
    day: 25,
    ref: 'Luke 2:11',
    text: 'Today in the town of David a Savior has been born to you; he is the Messiah, the Lord.',
    prayer: 'A Savior has been born to them too. Let this be the year they know Him.',
  },
];

export const ADVENT_ICS_PATH = '/downloads/advent-prayer-calendar.ics';
