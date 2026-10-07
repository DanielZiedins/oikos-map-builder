// Scripture for the builder's five-minute prayer. A short pick from the article
// /blog/bible-verses-to-pray-for-unsaved-loved-ones, kept here so the builder does
// not have to download the article body. Verses are NIV, word for word; `prayer`
// is a suggestion, with {name} replaced by the person being prayed for.

export const prayerVerses = [
  {
    ref: '2 Corinthians 4:4',
    text: 'The god of this age has blinded the minds of unbelievers, so that they cannot see the light of the gospel that displays the glory of Christ, who is the image of God.',
    prayer: 'Lord, lift the blindness off {name}\'s mind. Let them see the glory of Christ.',
  },
  {
    ref: 'Ezekiel 36:26',
    text: 'I will give you a new heart and put a new spirit in you; I will remove from you your heart of stone and give you a heart of flesh.',
    prayer: 'Take out {name}\'s heart of stone and give them a heart that can feel Your love.',
  },
  {
    ref: 'John 6:44',
    text: 'No one can come to me unless the Father who sent me draws them, and I will raise them up at the last day.',
    prayer: 'Father, draw {name} to Jesus. Do what I cannot do.',
  },
  {
    ref: '1 Timothy 2:3–4',
    text: 'This is good, and pleases God our Savior, who wants all people to be saved and to come to a knowledge of the truth.',
    prayer: 'You want {name} saved more than I do. I am agreeing with You, not persuading You.',
  },
  {
    ref: 'Acts 26:18',
    text: 'to open their eyes and turn them from darkness to light, and from the power of Satan to God, so that they may receive forgiveness of sins and a place among those who are sanctified by faith in me.',
    prayer: 'Open {name}\'s eyes. Turn them from darkness to light, and give them a place in Your family.',
  },
  {
    ref: 'Colossians 4:3',
    text: 'And pray for us, too, that God may open a door for our message, so that we may proclaim the mystery of Christ, for which I am in chains.',
    prayer: 'Open a door with {name} this week, and give me the courage to walk through it.',
  },
  {
    ref: 'Matthew 9:38',
    text: 'Ask the Lord of the harvest, therefore, to send out workers into his harvest field.',
    prayer: 'Send someone to {name} this month — and make me willing if it is me.',
  },
  {
    ref: 'Romans 2:4',
    text: 'Or do you show contempt for the riches of his kindness, forbearance and patience, not realizing that God\'s kindness is intended to lead you to repentance?',
    prayer: 'Let {name} notice Your kindness today, and let it lead them home.',
  },
  {
    ref: '2 Timothy 2:25–26',
    text: 'Opponents must be gently instructed, in the hope that God will grant them repentance leading them to a knowledge of the truth, and that they will come to their senses and escape from the trap of the devil, who has taken them captive to do his will.',
    prayer: 'Grant {name} repentance. Let them come to their senses and walk out of every trap.',
  },
  {
    ref: 'Colossians 1:13',
    text: 'For he has rescued us from the dominion of darkness and brought us into the kingdom of the Son he loves.',
    prayer: 'Rescue {name} the way You rescued me, and bring them into Your kingdom.',
  },
  {
    ref: 'Luke 15:20',
    text: 'But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him.',
    prayer: 'Father, {name} is still a long way off. Run to them.',
  },
  {
    ref: 'Galatians 6:9',
    text: 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.',
    prayer: 'I am not giving up on {name}. Renew my strength — the proper time is coming.',
  },
];

// Same verse all day for the same person, different people get different verses,
// and it moves on tomorrow.
export function verseIndexFor(personId, offset = 0, date = new Date()) {
  const day = Math.floor(date.getTime() / 86400000);
  let hash = 0;
  for (const char of String(personId)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return (day + hash + offset) % prayerVerses.length;
}

export function versePrayer(verse, name) {
  return verse.prayer.replaceAll('{name}', name);
}
