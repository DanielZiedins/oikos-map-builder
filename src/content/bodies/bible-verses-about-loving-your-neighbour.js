// Body for /blog/bible-verses-about-loving-your-neighbour. Every verse is NIV,
// word for word, inside quotation marks; the "Live it" lines are commentary.
// Items use the "<strong>Ref</strong> — <em>"text"</em>" shape so the journal
// adds a Copy verse button to each.

const v = (ref, text, live) => `<strong>${ref}</strong> — <em>"${text}"</em> <br>Live it: ${live}`;

export default {
  intro: [
    '"Love your neighbour as yourself" is one of the best-known lines in the Bible — and one of the hardest to live. It shows up in the law of Moses, in the teaching of Jesus, and again and again in the letters of the early church.',
    'Here are 25 Bible verses about loving your neighbour, grouped by theme, each with one simple way to live it this week. Copy any verse to share it, or pray through one a day.',
  ],
  sections: [
    {
      heading: 'The command itself',
      list: [
        v('Leviticus 19:18', 'Do not seek revenge or bear a grudge against anyone among your people, but love your neighbor as yourself. I am the LORD.', 'Let go of one grudge, out loud in prayer, today.'),
        v('Matthew 22:37–39', 'Jesus replied: ‘Love the Lord your God with all your heart and with all your soul and with all your mind.’ This is the first and greatest commandment. And the second is like it: ‘Love your neighbor as yourself.’', 'Love for God and love for people are meant to grow together.'),
        v('Mark 12:31', 'The second is this: ‘Love your neighbor as yourself.’ There is no commandment greater than these.', 'Nothing on your to-do list outranks this.'),
        v('Galatians 5:14', 'For the entire law is fulfilled in keeping this one command: ‘Love your neighbor as yourself.’', 'When you are unsure what to do, ask what love would do.'),
        v('James 2:8', 'If you really keep the royal law found in Scripture, ‘Love your neighbor as yourself,’ you are doing right.', 'Call it what Scripture calls it: royal. It is a high calling.'),
      ],
    },
    {
      heading: 'Who counts as my neighbour?',
      list: [
        v('Luke 10:36–37', '‘Which of these three do you think was a neighbor to the man who fell into the hands of robbers?’ The expert in the law replied, ‘The one who had mercy on him.’ Jesus told him, ‘Go and do likewise.’', 'Stop asking who qualifies and start crossing the road.'),
        v('Matthew 5:43–44', 'You have heard that it was said, ‘Love your neighbor and hate your enemy.’ But I tell you, love your enemies and pray for those who persecute you,', 'Pray by name for someone who has hurt you.'),
        v('Matthew 25:40', 'The King will reply, ‘Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me.’', 'Look for the person others overlook.'),
        v('Hebrews 13:2', 'Do not forget to show hospitality to strangers, for by so doing some people have shown hospitality to angels without knowing it.', 'Welcome someone new to your street, school or church.'),
      ],
      after: ['More on this in <a href="/blog/who-is-my-neighbour">Who Is My Neighbour? What Jesus Meant by "Love Your Neighbour"</a>.'],
    },
    {
      heading: 'What love actually looks like',
      list: [
        v('1 Corinthians 13:4–5', 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.', 'Pick one phrase and practise it with one person.'),
        v('Romans 13:10', 'Love does no harm to a neighbor. Therefore love is the fulfillment of the law.', 'Ask: is there any way I am making life harder for someone nearby?'),
        v('Luke 6:31', 'Do to others as you would have them do to you.', 'Do one thing you would love someone to do for you.'),
        v('Romans 12:10', 'Be devoted to one another in love. Honor one another above yourselves.', 'Honour someone publicly this week.'),
        v('Philippians 2:3–4', 'Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves, not looking to your own interests but each of you to the interests of the others.', 'Ask a neighbour what they are carrying right now.'),
        v('1 Peter 4:8', 'Above all, love each other deeply, because love covers over a multitude of sins.', 'Choose not to repeat the story that makes someone look bad.'),
      ],
    },
    {
      heading: 'Love in action, not just words',
      list: [
        v('1 John 3:18', 'Dear children, let us not love with words or speech but with actions and in truth.', 'Turn one kind thought into one kind action today.'),
        v('Galatians 6:2', 'Carry each other’s burdens, and in this way you will fulfill the law of Christ.', 'Offer to carry something practical: a meal, a lift, an errand.'),
        v('Galatians 6:10', 'Therefore, as we have opportunity, let us do good to all people, especially to those who belong to the family of believers.', 'Notice the opportunities already in your week.'),
        v('Proverbs 3:27–28', 'Do not withhold good from those to whom it is due, when it is in your power to act. Do not say to your neighbor, ‘Come back tomorrow and I’ll give it to you’—when you already have it with you.', 'Do today the good thing you have been putting off.'),
        v('Romans 12:13', 'Share with the Lord’s people who are in need. Practice hospitality.', 'Open your table. <a href="/blog/biblical-hospitality">Here is how.</a>'),
        v('Micah 6:8', 'He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God.', 'Justice, mercy and humility: one each this week.'),
        v('Zechariah 7:9–10', 'This is what the LORD Almighty said: ‘Administer true justice; show mercy and compassion to one another. Do not oppress the widow or the fatherless, the foreigner or the poor. Do not plot evil against each other.’', 'Who in your area is a widow, a newcomer, or struggling? Start there.'),
      ],
    },
    {
      heading: 'Where love comes from',
      list: [
        v('1 John 4:7', 'Dear friends, let us love one another, for love comes from God. Everyone who loves has been born of God and knows God.', 'Ask God for love you do not have on your own.'),
        v('John 13:34–35', 'A new command I give you: Love one another. As I have loved you, so you must love one another. By this everyone will know that you are my disciples, if you love one another.', 'Remember how Jesus has loved you, then pass it on.'),
        v('1 John 4:20', 'Whoever claims to love God yet hates a brother or sister is a liar. For whoever does not love their fellow believer, whom they have seen, cannot love God, whom they have not seen.', 'Make peace with one person before Sunday.'),
      ],
    },
    {
      heading: 'Put names to it',
      paragraphs: [
        'Loving "my neighbours" in general is easy. Loving the actual people next door, at work and in your family is where it gets real. Write their names down on a <a href="/#builder">free Oikos Map</a> and pray for them by name — then use the "Live it" lines above, one at a time.',
        'For ideas that do not feel forced, read <a href="/blog/evangelism-without-being-weird">Evangelism Without Being Weird: 12 Ways to Love Your Neighbour This Week</a>.',
      ],
    },
  ],
  scripture: {
    text: 'Dear children, let us not love with words or speech but with actions and in truth.',
    ref: '1 John 3:18',
  },
  network: ['LoveonTheWorld.com', 'LoveonHamilton.com', 'KingdomResponse.com'],
  cta: { text: 'Name the neighbours you will love this week', url: '/#builder' },
  faq: [
    {
      q: 'Where does the Bible say to love your neighbour as yourself?',
      a: 'It first appears in Leviticus 19:18. Jesus quotes it as the second greatest commandment in Matthew 22:39 and Mark 12:31, and it is repeated in Luke 10:27, Romans 13:9, Galatians 5:14 and James 2:8.',
    },
    {
      q: 'What is the best Bible verse about loving others?',
      a: 'Many people point to John 13:34–35, where Jesus says "As I have loved you, so you must love one another," and to 1 Corinthians 13:4–5, which describes what love looks like: patient, kind and keeping no record of wrongs.',
    },
    {
      q: 'Who is my neighbour according to the Bible?',
      a: 'In the parable of the Good Samaritan (Luke 10:25–37), Jesus shows that your neighbour is anyone in need whom God puts in your path, and turns the question into "who will I be a neighbour to?"',
    },
    {
      q: 'What verse says to love with actions, not words?',
      a: '1 John 3:18: "Dear children, let us not love with words or speech but with actions and in truth."',
    },
  ],
};
