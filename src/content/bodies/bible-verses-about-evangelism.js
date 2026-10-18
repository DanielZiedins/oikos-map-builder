// Body for /blog/bible-verses-about-evangelism. Every verse is NIV, word for
// word, inside quotation marks; the "Takeaway" lines are commentary.

const v = (ref, text, takeaway) => `<strong>${ref}</strong> — <em>"${text}"</em> <br>Takeaway: ${takeaway}`;

export default {
  intro: [
    'If you have ever felt nervous about sharing your faith, you are in good company — and the Bible has a lot to say to you. It tells you why evangelism matters, what the message is, where courage comes from, how to speak with grace, and who actually makes the seed grow.',
    'Here are 25 Bible verses about evangelism and sharing your faith, grouped by theme, each with a one-line takeaway. Read one a day, memorise a few, or pray through them before a conversation you are nervous about.',
  ],
  sections: [
    {
      heading: 'The command: we are sent',
      list: [
        v('Matthew 28:19–20', 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.', 'The command comes with a promise. You never go alone.'),
        v('Mark 16:15', 'Go into all the world and preach the gospel to all creation.', 'No place and no person is outside the reach of the good news.'),
        v('Acts 1:8', 'But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.', 'Start in your own "Jerusalem" — the people already around you.'),
      ],
      after: ['More on these in <a href="/blog/what-is-the-great-commission">What Is the Great Commission?</a>'],
    },
    {
      heading: 'The message: what we share',
      list: [
        v('Romans 1:16', 'For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes: first to the Jew, then to the Gentile.', 'The power is in the message, not in your polish.'),
        v('1 Corinthians 15:3–4', 'For what I received I passed on to you as of first importance: that Christ died for our sins according to the Scriptures, that he was buried, that he was raised on the third day according to the Scriptures,', 'The core of the Gospel fits in one sentence.'),
        v('John 3:16', 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', 'It starts with God\'s love, not our failure.'),
        v('Romans 10:9', 'If you declare with your mouth, \'Jesus is Lord,\' and believe in your heart that God raised him from the dead, you will be saved.', 'The response is simple: trust and confess Jesus as Lord.'),
      ],
      after: ['To walk someone through it, see <a href="/blog/how-to-lead-someone-to-jesus">How to Lead Someone to Jesus</a>.'],
    },
    {
      heading: 'Why it matters',
      list: [
        v('Romans 10:14', 'How, then, can they call on the one they have not believed in? And how can they believe in the one of whom they have not heard? And how can they hear without someone preaching to them?', 'Someone has to open their mouth. Often it is the person closest to them.'),
        v('2 Peter 3:9', 'The Lord is not slow in keeping his promise, as some understand slowness. Instead he is patient with you, not wanting anyone to perish, but everyone to come to repentance.', 'God\'s heart is for everyone on your map.'),
        v('Luke 15:7', 'I tell you that in the same way there will be more rejoicing in heaven over one sinner who repents than over ninety-nine righteous persons who do not need to repent.', 'One person matters enough to make heaven celebrate.'),
      ],
    },
    {
      heading: 'For courage when you are nervous',
      list: [
        v('2 Timothy 1:7', 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.', 'Fear is normal; it is not the Spirit\'s voice.'),
        v('Acts 4:31', 'After they prayed, the place where they were meeting was shaken. And they were all filled with the Holy Spirit and spoke the word of God boldly.', 'Boldness came after prayer. Pray first.'),
        v('Ephesians 6:19', 'Pray also for me, that whenever I speak, words may be given me so that I will fearlessly make known the mystery of the gospel,', 'Even Paul asked others to pray for his courage.'),
        v('Joshua 1:9', 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.', 'Courage rests on God\'s presence, not your confidence.'),
      ],
    },
    {
      heading: 'For wisdom and gentleness',
      list: [
        v('1 Peter 3:15', 'But in your hearts revere Christ as Lord. Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have. But do this with gentleness and respect,', 'Be ready — and be kind. Both matter.'),
        v('Colossians 4:5–6', 'Be wise in the way you act toward outsiders; make the most of every opportunity. Let your conversation be always full of grace, seasoned with salt, so that you may know how to answer everyone.', 'Grace first, and a little salt.'),
        v('Matthew 10:16', 'I am sending you out like sheep among wolves. Therefore be as shrewd as snakes and as innocent as doves.', 'Wise about timing and context; pure in motive.'),
      ],
      after: ['Good questions are often the wisest opening: <a href="/blog/spiritual-conversation-starters">30 spiritual conversation starters</a>.'],
    },
    {
      heading: 'For sowing, waiting and harvest',
      list: [
        v('Matthew 9:37–38', 'Then he said to his disciples, \'The harvest is plentiful but the workers are few. Ask the Lord of the harvest, therefore, to send out workers into his harvest field.\'', 'The problem is never the harvest. Pray for workers — and be one.'),
        v('1 Corinthians 3:6', 'I planted the seed, Apollos watered it, but God has been making it grow.', 'Your part is faithfulness. Growth is God\'s.'),
        v('Isaiah 55:11', 'so is my word that goes out from my mouth: It will not return to me empty, but will accomplish what I desire and achieve the purpose for which I sent it.', 'No true word about Jesus is wasted.'),
        v('Galatians 6:9', 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.', 'Keep going. The proper time is coming.'),
      ],
    },
    {
      heading: 'Who we are',
      list: [
        v('Matthew 5:16', 'In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.', 'Your life is part of the message.'),
        v('2 Corinthians 5:20', 'We are therefore Christ\'s ambassadors, as though God were making his appeal through us. We implore you on Christ\'s behalf: Be reconciled to God.', 'You represent Someone. You do not have to invent the message.'),
        v('1 Peter 2:9', 'But you are a chosen people, a royal priesthood, a holy nation, God\'s special possession, that you may declare the praises of him who called you out of darkness into his wonderful light.', 'Declaring God\'s praises is part of why you were chosen.'),
      ],
    },
    {
      heading: 'For the ones who send',
      list: [
        v('Romans 10:15', 'And how can anyone preach unless they are sent? As it is written: \'How beautiful are the feet of those who bring good news!\'', 'Going and sending are one work. Both are beautiful.'),
      ],
      after: [
        'Not everyone goes far, but everyone can help the Gospel go further — <a href="/blog/plunder-hell-populate-heaven">Plunder Hell, Populate Heaven</a> explains how.',
      ],
    },
    {
      heading: 'How to use these verses',
      list: [
        '<strong>Memorise three.</strong> Romans 1:16, 1 Peter 3:15 and 1 Corinthians 3:6 cover confidence, readiness and rest.',
        '<strong>Pray one before a conversation</strong> you are nervous about — Acts 4:31 and Ephesians 6:19 are prayers for boldness.',
        '<strong>Pair them with names.</strong> Put five people on your <a href="/#builder">Oikos Map</a> and pray for them using <a href="/blog/bible-verses-to-pray-for-unsaved-loved-ones">these 23 verses</a>.',
        '<strong>Share them in a group.</strong> One verse a week makes a simple small-group series on sharing faith.',
      ],
    },
  ],
  scripture: {
    text: 'For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes: first to the Jew, then to the Gentile.',
    ref: 'Romans 1:16',
  },
  network: ['LoveonTheWorld.com', 'LoveonMission.world', 'JesusFestival.ca'],
  cta: { text: 'Put five names on your map', url: '/#builder' },
  faq: [
    {
      q: 'What does the Bible say about evangelism?',
      a: 'The Bible commands believers to share the good news (Matthew 28:19–20, Mark 16:15), explains why it matters — people cannot believe in someone they have not heard of (Romans 10:14) — and promises power from the Holy Spirit (Acts 1:8). It calls for gentleness and respect (1 Peter 3:15) and reminds us that God gives the growth (1 Corinthians 3:6).',
    },
    {
      q: 'What is the most important Bible verse about evangelism?',
      a: 'Matthew 28:19–20, the Great Commission, is the central one: "go and make disciples of all nations," with Jesus\' promise, "surely I am with you always." Acts 1:8 and Romans 1:16 are also foundational.',
    },
    {
      q: 'What Bible verses help with fear of sharing your faith?',
      a: '2 Timothy 1:7 ("the Spirit God gave us does not make us timid"), Joshua 1:9 ("Be strong and courageous… the LORD your God will be with you"), and the prayers for boldness in Acts 4:31 and Ephesians 6:19.',
    },
    {
      q: 'What verse says to be ready to share your faith?',
      a: '1 Peter 3:15: "Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have. But do this with gentleness and respect."',
    },
  ],
};
