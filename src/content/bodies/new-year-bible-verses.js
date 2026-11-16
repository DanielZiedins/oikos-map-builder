// Body for /blog/new-year-bible-verses. Every verse is NIV, word for word,
// inside quotation marks (speech inside a verse uses single quotes); the
// "Carry it" lines are commentary. No year in the copy, so it works every
// January.

const v = (ref, text, carry) => `<strong>${ref}</strong> — <em>"${text}"</em> <br>Carry it: ${carry}`;

export default {
  intro: [
    'A new year is a clean page, and most of us want to write something better on it than last time. Scripture has a great deal to say about fresh starts, about plans, about courage, and about making our days count.',
    'Here are 25 Bible verses for the New Year, grouped by theme, each with a tap-to-copy button and a thought to carry into January. At the end is one resolution that will outlast every gym membership.',
  ],
  sections: [
    {
      heading: 'New beginnings',
      list: [
        v('Isaiah 43:18–19', 'Forget the former things; do not dwell on the past. See, I am doing a new thing! Now it springs up; do you not perceive it? I am making a way in the wilderness and streams in the wasteland.', 'Name one thing from last year you need to stop replaying.'),
        v('2 Corinthians 5:17', 'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!', 'The deepest fresh start is not a date on the calendar. It is a Person.'),
        v('Lamentations 3:22–23', 'Because of the LORD’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.', 'You do not need to wait for January. Mercy resets every morning.'),
        v('Revelation 21:5', 'He who was seated on the throne said, ‘I am making everything new!’ Then he said, ‘Write this down, for these words are trustworthy and true.’', 'Whatever this year holds, the story ends with everything made new.'),
        v('Philippians 3:13–14', 'Brothers and sisters, I do not consider myself yet to have taken hold of it. But one thing I do: Forgetting what is behind and straining toward what is ahead, I press on toward the goal to win the prize for which God has called me heavenward in Christ Jesus.', 'Choose “one thing” for the year rather than ten.'),
        v('Ezekiel 36:26', 'I will give you a new heart and put a new spirit in you; I will remove from you your heart of stone and give you a heart of flesh.', 'Pray this for someone you love who seems closed to God.'),
      ],
    },
    {
      heading: 'Trusting God with your plans',
      list: [
        v('Proverbs 3:5–6', 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.', 'Before you set goals, hand over the year.'),
        v('Proverbs 16:3', 'Commit to the LORD whatever you do, and he will establish your plans.', 'Write your plans in pencil and pray over them in ink.'),
        v('Proverbs 16:9', 'In their hearts humans plan their course, but the LORD establishes their steps.', 'Plan well. Hold it loosely.'),
        v('Jeremiah 29:11', '‘For I know the plans I have for you,’ declares the LORD, ‘plans to prosper you and not to harm you, plans to give you hope and a future.’', 'Spoken to people in exile: God’s good plans do not depend on easy circumstances.'),
        v('Psalm 37:4', 'Take delight in the LORD, and he will give you the desires of your heart.', 'Delight first. It changes what you desire.'),
        v('Psalm 90:12', 'Teach us to number our days, that we may gain a heart of wisdom.', 'There are 365 days ahead. Decide what a wise one looks like.'),
        v('Matthew 6:33', 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.', 'Put the first thing first on the first day.'),
        v('Psalm 32:8', 'I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.', 'For anyone facing a big decision this year.'),
      ],
    },
    {
      heading: 'Courage for what is ahead',
      list: [
        v('Joshua 1:9', 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.', 'For a new job, a new city, or a new season.'),
        v('Psalm 27:1', 'The LORD is my light and my salvation—whom shall I fear? The LORD is the stronghold of my life—of whom shall I be afraid?', 'Name the fear you are carrying into the year, then read this over it.'),
        v('Philippians 4:13', 'I can do all this through him who gives me strength.', 'Written from prison, about contentment. Strength for whatever comes, not only for winning.'),
        v('2 Timothy 1:7', 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.', 'For the conversation you have been putting off.'),
        v('Philippians 1:6', 'being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.', 'God finishes what He starts, including you.'),
        v('Galatians 6:9', 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.', 'For the prayer you have prayed for years. Do not stop this year.'),
      ],
    },
    {
      heading: 'A year that counts for others',
      list: [
        v('Ephesians 5:15–16', 'Be very careful, then, how you live—not as unwise but as wise, making the most of every opportunity, because the days are evil.', 'Look for one opportunity a week to love someone on purpose.'),
        v('Colossians 3:23', 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters,', 'Your ordinary work is part of your worship, and part of your witness.'),
        v('Matthew 5:16', 'In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.', 'Let someone see your faith this year, not just hear about it.'),
        v('1 Timothy 2:1', 'I urge, then, first of all, that petitions, prayers, intercession and thanksgiving be made for all people—', '“First of all.” Make prayer for people the first habit of the year.'),
        v('Psalm 65:11', 'You crown the year with your bounty, and your carts overflow with abundance.', 'A blessing to write in a New Year card.'),
      ],
    },
    {
      heading: 'One resolution worth keeping',
      paragraphs: [
        'Most resolutions are about us: eat better, spend less, exercise more. Here is one that is about the people around you, takes five minutes a day, and could change someone’s eternity: <strong>pray for five people by name, every day this year.</strong>',
      ],
      list: [
        '<strong>Choose your five.</strong> Family, friends, neighbours, coworkers or classmates who do not yet follow Jesus. Write them on a <a href="/#builder">free Oikos Map</a>.',
        '<strong>Set a time.</strong> Tie it to something you already do: the kettle, the commute, the school run. The map builder can add a daily reminder to your calendar.',
        '<strong>Use Scripture.</strong> <a href="/blog/bible-verses-to-pray-for-unsaved-loved-ones">These 23 verses to pray for loved ones</a> give you words on the days you have none.',
        '<strong>Watch for open doors.</strong> Prayer changes them, and it changes you. When a door opens, <a href="/blog/how-to-pray-for-unsaved-family-and-friends">this simple rhythm</a> shows you the next step.',
      ],
      after: ['Want company for the first two weeks? <a href="/#resources">The free Oikos Journey</a> is six short emails that walk you through praying, caring, sharing and discipling.'],
    },
  ],
  scripture: {
    text: 'See, I am doing a new thing! Now it springs up; do you not perceive it?',
    ref: 'Isaiah 43:19',
  },
  network: ['SeekFirst.World', 'IAmReborn.net', 'LoveonTheWorld.com'],
  cta: { text: 'Choose the five people you will pray for this year', url: '/#builder' },
  faq: [
    {
      q: 'What is a good Bible verse for the New Year?',
      a: 'Isaiah 43:18–19 ("See, I am doing a new thing!"), 2 Corinthians 5:17 ("The old has gone, the new is here!") and Lamentations 3:22–23 ("his compassions never fail. They are new every morning") are three of the most loved New Year verses.',
    },
    {
      q: 'What Bible verse can I write in a New Year card?',
      a: 'Jeremiah 29:11 ("plans to give you hope and a future"), Psalm 65:11 ("You crown the year with your bounty") and Proverbs 16:3 ("Commit to the LORD whatever you do, and he will establish your plans") all work well in a card.',
    },
    {
      q: 'What does the Bible say about making plans for the year?',
      a: 'The Bible encourages planning and reminds us who directs the outcome: "In their hearts humans plan their course, but the LORD establishes their steps" (Proverbs 16:9). Proverbs 3:5–6 calls us to trust God in all our ways, and Matthew 6:33 to seek His kingdom first.',
    },
    {
      q: 'What is a good Christian New Year’s resolution?',
      a: 'One simple, lasting resolution is to pray by name every day for five people who do not yet follow Jesus. 1 Timothy 2:1 urges that "petitions, prayers, intercession and thanksgiving be made for all people," and a free Oikos Map helps you keep the names in front of you.',
    },
  ],
};
