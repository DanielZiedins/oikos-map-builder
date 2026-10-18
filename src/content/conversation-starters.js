// Questions for the builder's conversation card, matched to each person's stage.
// Drawn from /blog/spiritual-conversation-starters (care and share) and the
// discovery questions in /blog/how-to-start-a-bible-study-with-friends (disciple).
// The pray stage has none on purpose: that step is talking to God, not to them.

export const conversationStarters = {
  care: [
    'What has been the best part of your year so far — and the hardest?',
    'How are you really doing — not the quick answer?',
    'What has been the heaviest part of this season?',
    'What would help most right now?',
    'Who is walking through this with you?',
    'What are you looking forward to right now?',
    'Would it be okay if I prayed for you about that?',
  ],
  share: [
    'Did you grow up with any kind of faith?',
    'Where are you at with God these days?',
    'What do you think of Jesus — not the church, just Jesus Himself?',
    'Have you ever read any of the stories about Jesus for yourself?',
    'What gives you hope?',
    'Can I tell you how I came to faith?',
    'Would you be open to reading one of the Gospels with me sometime?',
  ],
  disciple: [
    'What does this passage show us about God?',
    'What does it show us about people?',
    'Is there anything here to obey or try this week?',
    'Who is one person you could tell about what you are learning?',
    'How did last week’s step go?',
    'Who in your world could we pray for together?',
  ],
};

export const conversationGuides = {
  care: { href: '/blog/spiritual-conversation-starters', label: '30 conversation starters' },
  share: { href: '/blog/spiritual-conversation-starters', label: '30 conversation starters' },
  disciple: { href: '/blog/how-to-start-a-bible-study-with-friends', label: 'How to read the Bible together' },
};

// Stable for a person within a day; moves on tomorrow and with each "another".
export function starterFor(stageId, personId, offset = 0, date = new Date(0)) {
  const list = conversationStarters[stageId];
  if (!list?.length) return null;
  const day = Math.floor(date.getTime() / 86400000);
  let hash = 7;
  for (const char of String(personId)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return list[(day + hash + offset) % list.length];
}
