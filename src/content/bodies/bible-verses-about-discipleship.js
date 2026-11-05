// Body for /blog/bible-verses-about-discipleship. Every verse is NIV, word for
// word, inside quotation marks; the "Takeaway" lines are commentary.

const v = (ref, text, takeaway) => `<strong>${ref}</strong> — <em>"${text}"</em> <br>Takeaway: ${takeaway}`;

export default {
  intro: [
    'Jesus did not call people to attend something. He called them to follow Him — and then to help others do the same. The New Testament is full of what that looks like: the cost, the rhythm, the relationships and the promise.',
    'Here are 25 Bible verses about discipleship and making disciples, grouped by theme, each with a one-line takeaway. Copy any verse to share it, or use them for a small-group study one week at a time.',
  ],
  sections: [
    {
      heading: 'The call to follow',
      list: [
        v('Matthew 4:19', '‘Come, follow me,’ Jesus said, ‘and I will send you out to fish for people.’', 'Following comes first; Jesus does the making.'),
        v('Mark 3:14', 'He appointed twelve that they might be with him and that he might send them out to preach', 'Discipleship is being with Jesus before being sent by Him.'),
        v('Matthew 11:29', 'Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.', 'It is a gentle apprenticeship, not a heavy programme.'),
        v('Luke 9:23', 'Then he said to them all: ‘Whoever wants to be my disciple must deny themselves and take up their cross daily and follow me.’', 'Daily, not once.'),
      ],
    },
    {
      heading: 'The cost',
      list: [
        v('Luke 14:27', 'And whoever does not carry their cross and follow me cannot be my disciple.', 'Following Jesus will cost something real.'),
        v('Luke 14:33', 'In the same way, those of you who do not give up everything you have cannot be my disciples.', 'Hold everything with open hands.'),
        v('Galatians 2:20', 'I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.', 'The cost is met by a love that gave everything first.'),
      ],
    },
    {
      heading: 'Marks of a disciple',
      list: [
        v('John 8:31–32', 'To the Jews who had believed him, Jesus said, ‘If you hold to my teaching, you are really my disciples. Then you will know the truth, and the truth will set you free.’', 'Disciples stay in Jesus’ words.'),
        v('John 13:35', 'By this everyone will know that you are my disciples, if you love one another.', 'Love is the visible sign.'),
        v('John 15:8', 'This is to my Father’s glory, that you bear much fruit, showing yourselves to be my disciples.', 'Fruit shows what is growing underneath.'),
        v('John 15:5', 'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.', 'Remain first; the fruit follows.'),
        v('James 1:22', 'Do not merely listen to the word, and so deceive yourselves. Do what it says.', 'Every study should end with one thing to do.'),
      ],
    },
    {
      heading: 'Being transformed',
      list: [
        v('Romans 12:2', 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God’s will is—his good, pleasing and perfect will.', 'Discipleship changes how you think, not just what you do.'),
        v('2 Corinthians 3:18', 'And we all, who with unveiled faces contemplate the Lord’s glory, are being transformed into his image with ever-increasing glory, which comes from the Lord, who is the Spirit.', 'We become like what we behold.'),
        v('Luke 6:40', 'The student is not above the teacher, but everyone who is fully trained will be like their teacher.', 'The goal is to become like Jesus.'),
        v('Colossians 1:28', 'He is the one we proclaim, admonishing and teaching everyone with all wisdom, so that we may present everyone fully mature in Christ.', 'Aim for maturity, not just attendance.'),
      ],
    },
    {
      heading: 'Growing together',
      list: [
        v('Acts 2:42', 'They devoted themselves to the apostles’ teaching and to fellowship, to the breaking of bread and to prayer.', 'Four habits of the first disciples: Scripture, friendship, meals, prayer.'),
        v('Hebrews 10:24–25', 'And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another—and all the more as you see the Day approaching.', 'Nobody grows alone.'),
        v('Proverbs 27:17', 'As iron sharpens iron, so one person sharpens another.', 'Find one person who will sharpen you.'),
        v('1 Thessalonians 2:8', 'Because we loved you so much, we were delighted to share with you not only the gospel of God but our lives as well.', 'Share your life, not just your lessons.'),
      ],
    },
    {
      heading: 'Making disciples',
      list: [
        v('Matthew 28:19–20', 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.', 'Every disciple is called to make disciples.'),
        v('2 Timothy 2:2', 'And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others.', 'Four generations in one verse.'),
        v('1 Corinthians 11:1', 'Follow my example, as I follow the example of Christ.', 'Discipleship is imitation as much as instruction.'),
        v('Philippians 4:9', 'Whatever you have learned or received or heard from me, or seen in me—put it into practice. And the God of peace will be with you.', 'Let people see your faith, not just hear it.'),
        v('Ephesians 4:11–13', 'So Christ himself gave the apostles, the prophets, the evangelists, the pastors and teachers, to equip his people for works of service, so that the body of Christ may be built up until we all reach unity in the faith and in the knowledge of the Son of God and become mature, attaining to the whole measure of the fullness of Christ.', 'Leaders equip; everyone serves.'),
      ],
    },
    {
      heading: 'Start with one person',
      paragraphs: [
        'You do not need a programme to begin. You need one person you are a step ahead of and a willingness to walk with them. <a href="/blog/what-is-a-disciple">What Is a Disciple?</a> explains the six marks above, and <a href="/blog/how-to-disciple-someone">How to Disciple Someone When You Do Not Feel Qualified</a> gives a simple weekly pattern.',
        'Put the person on your <a href="/#builder">Oikos Map</a> at the Disciple step, and the builder will suggest a question to explore together each week.',
      ],
    },
  ],
  scripture: {
    text: 'And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others.',
    ref: '2 Timothy 2:2',
  },
  network: ['IAmReborn.net', 'LoveonTheWorld.com', 'KingdomBase.App'],
  cta: { text: 'Name someone you could disciple', url: '/#builder' },
  faq: [
    {
      q: 'What does the Bible say about discipleship?',
      a: 'The Bible describes discipleship as following Jesus (Matthew 4:19), denying yourself daily (Luke 9:23), holding to His teaching (John 8:31), loving one another (John 13:35) and bearing fruit (John 15:8) — and it calls every disciple to make disciples (Matthew 28:19–20; 2 Timothy 2:2).',
    },
    {
      q: 'What is the key verse for making disciples?',
      a: 'Matthew 28:19–20, the Great Commission: "go and make disciples of all nations… teaching them to obey everything I have commanded you." 2 Timothy 2:2 shows how it multiplies from one person to the next.',
    },
    {
      q: 'What are the costs of discipleship in the Bible?',
      a: 'Jesus said disciples must deny themselves and take up their cross daily (Luke 9:23), carry their cross (Luke 14:27) and hold nothing back (Luke 14:33). Galatians 2:20 frames the cost in light of Jesus’ own love: He "loved me and gave himself for me."',
    },
    {
      q: 'What Bible verses are good for a discipleship small group?',
      a: 'Acts 2:42 (the habits of the early church), Hebrews 10:24–25 (spurring one another on), Proverbs 27:17 (iron sharpens iron), James 1:22 (doing what the word says) and John 15:5 (remaining in Jesus) all work well for discussion.',
    },
  ],
};
