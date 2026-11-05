// Body for /blog/christmas-bible-verses-to-share. Every verse is NIV, word for
// word, inside quotation marks; the "Share it" lines are commentary. No year in
// the copy, so it works every December.

const v = (ref, text, share) => `<strong>${ref}</strong> — <em>"${text}"</em> <br>Share it: ${share}`;

export default {
  intro: [
    'Christmas cards, group chats, captions, the note on a plate of cookies for the neighbours — December is full of small moments where a single verse can say more than a paragraph of your own words.',
    'Here are 25 Christmas Bible verses to share with friends, family and neighbours, from the prophecies to the manger to the meaning of it all. Each has a tap-to-copy button and a suggestion for where it fits.',
  ],
  sections: [
    {
      heading: 'The promise: Christmas foretold',
      list: [
        v('Isaiah 7:14', 'Therefore the Lord himself will give you a sign: The virgin will conceive and give birth to a son, and will call him Immanuel.', 'A thoughtful card for a friend who loves history.'),
        v('Isaiah 9:2', 'The people walking in darkness have seen a great light; on those living in the land of deep darkness a light has dawned.', 'For someone going through a dark season.'),
        v('Isaiah 9:6', 'For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.', 'The classic Christmas card verse.'),
        v('Micah 5:2', 'But you, Bethlehem Ephrathah, though you are small among the clans of Judah, out of you will come for me one who will be ruler over Israel, whose origins are from of old, from ancient times.', 'For anyone who feels small or overlooked.'),
      ],
    },
    {
      heading: 'The announcement',
      list: [
        v('Luke 1:30–31', 'But the angel said to her, ‘Do not be afraid, Mary; you have found favor with God. You will conceive and give birth to a son, and you are to call him Jesus.’', 'For an expectant mum or a new parent.'),
        v('Luke 1:37', 'For no word from God will ever fail.', 'For someone waiting on a promise.'),
        v('Matthew 1:21', 'She will give birth to a son, and you are to give him the name Jesus, because he will save his people from their sins.', 'The meaning of the name, in one line.'),
        v('Matthew 1:23', '‘The virgin will conceive and give birth to a son, and they will call him Immanuel’ (which means ‘God with us’).', 'For anyone who feels alone this Christmas.'),
        v('Luke 1:46–47', 'And Mary said: ‘My soul glorifies the Lord and my spirit rejoices in God my Savior,', 'A grateful caption for a family photo.'),
      ],
    },
    {
      heading: 'The birth',
      list: [
        v('Luke 2:7', 'and she gave birth to her firstborn, a son. She wrapped him in cloths and placed him in a manger, because there was no guest room available for them.', 'Beside a nativity scene, or a note to someone far from home.'),
        v('Luke 2:10', 'But the angel said to them, ‘Do not be afraid. I bring you good news that will cause great joy for all the people.', 'The perfect group-chat Christmas greeting.'),
        v('Luke 2:11', 'Today in the town of David a Savior has been born to you; he is the Messiah, the Lord.', 'Christmas morning, in one sentence.'),
        v('Luke 2:14', 'Glory to God in the highest heaven, and on earth peace to those on whom his favor rests.', 'A blessing to end a card with.'),
        v('Luke 2:19', 'But Mary treasured up all these things and pondered them in her heart.', 'For a quiet moment after the presents.'),
        v('Luke 2:20', 'The shepherds returned, glorifying and praising God for all the things they had heard and seen, which were just as they had been told.', 'For the night shift workers and the overlooked.'),
        v('Matthew 2:10–11', 'When they saw the star, they were overjoyed. On coming to the house, they saw the child with his mother Mary, and they bowed down and worshiped him.', 'For gift-givers and travellers.'),
      ],
    },
    {
      heading: 'What it means',
      list: [
        v('John 1:9', 'The true light that gives light to everyone was coming into the world.', 'With a candle or the Christmas lights.'),
        v('John 1:14', 'The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.', 'For the friend who asks what Christmas is really about.'),
        v('John 3:16', 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', 'The gift behind every gift.'),
        v('Galatians 4:4–5', 'But when the set time had fully come, God sent his Son, born of a woman, born under the law, to redeem those under the law, that we might receive adoption to sonship.', 'For someone who has longed to belong.'),
        v('Philippians 2:6–7', 'Who, being in very nature God, did not consider equality with God something to be used to his own advantage; rather, he made himself nothing by taking the very nature of a servant, being made in human likeness.', 'For a Christmas Eve reflection.'),
        v('1 John 4:9', 'This is how God showed his love among us: He sent his one and only Son into the world that we might live through him.', 'A simple, clear Christmas message.'),
        v('Titus 2:11', 'For the grace of God has appeared that offers salvation to all people.', 'For someone who thinks Christmas is not for them.'),
        v('Romans 6:23', 'For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.', 'For a conversation about the real gift.'),
        v('2 Corinthians 9:15', 'Thanks be to God for his indescribable gift!', 'The shortest Christmas card verse — and maybe the best.'),
      ],
    },
    {
      heading: 'Share more than a verse',
      paragraphs: [
        'A verse is a beautiful start. This season, consider taking one more step with the people on your heart:',
      ],
      list: [
        '<strong>Pray for them through Advent.</strong> <a href="/blog/advent-prayer-calendar-for-your-oikos">The 25-day Advent prayer calendar</a> gives you a verse and a prayer for each day, with a free calendar download.',
        '<strong>Invite them to a Christmas Eve service.</strong> <a href="/blog/how-to-invite-someone-to-church">How to invite someone without it being awkward.</a>',
        '<strong>Talk about it at the table.</strong> <a href="/blog/talking-about-jesus-with-family-at-the-holidays">How to talk about Jesus with family at Christmas.</a>',
        '<strong>Write their names down</strong> on a <a href="/#builder">free Oikos Map</a>, so they are not forgotten in January.',
      ],
    },
  ],
  scripture: {
    text: 'Thanks be to God for his indescribable gift!',
    ref: '2 Corinthians 9:15',
  },
  network: ['JesusFestival.ca', 'JesusFestival.app', 'LoveonTheWorld.com'],
  cta: { text: 'Name the people you will pray for this Christmas', url: '/#builder' },
  faq: [
    {
      q: 'What is a good Bible verse for a Christmas card?',
      a: 'Isaiah 9:6 ("For to us a child is born… Prince of Peace"), Luke 2:10–11 ("good news that will cause great joy… a Savior has been born to you") and 2 Corinthians 9:15 ("Thanks be to God for his indescribable gift!") are among the most loved Christmas card verses.',
    },
    {
      q: 'What is the Christmas story verse in the Bible?',
      a: 'The Christmas story is told in Luke 2:1–20 (the birth, the shepherds and the angels) and Matthew 1:18–2:12 (Joseph, the meaning of Jesus’ name and the visit of the Magi). Luke 2:11 summarises it: "Today in the town of David a Savior has been born to you; he is the Messiah, the Lord."',
    },
    {
      q: 'What does Immanuel mean?',
      a: 'Immanuel means "God with us." Isaiah 7:14 promised a son called Immanuel, and Matthew 1:23 quotes that promise about Jesus, adding "(which means “God with us”)."',
    },
    {
      q: 'What Bible verse explains the meaning of Christmas?',
      a: 'John 1:14 ("The Word became flesh and made his dwelling among us") and 1 John 4:9 ("He sent his one and only Son into the world that we might live through him") both explain why Christmas matters: God came to us in Jesus.',
    },
  ],
};
