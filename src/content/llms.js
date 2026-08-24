// Prose for the AI-readable discovery files. The volatile parts — the article
// index, the network list, the page list — are filled in from posts-meta.js and
// network.js by scripts/build-blog.js, so /llms.txt and /llms-full.txt can never
// fall behind the site the way a hand-maintained copy does.

export const llmsSummary =
  'Oikos Map is a free Christian outreach and discipleship tool that helps people map their household, relationships, and everyday sphere of influence so they can pray by name, love intentionally, and take simple next steps toward Gospel conversations.';

export const llmsOneSentence =
  'Oikos Map Builder is a free Christian prayer, outreach, and disciple-making tool that helps people visually map their everyday relationships and take a faithful next step to pray, care, share Jesus, and disciple.';

export const llmsWhatIsAnOikosMap =
  'An Oikos Map is a visual representation of a person\'s relational world. The word "oikos" is often translated as "household" and, in this setting, means the family, friends, coworkers, classmates, neighbors, teammates, and other relationships God has already placed around a person.';

export const llmsWhoIsItFor =
  'The tool is free for individual believers, churches, small groups, youth ministries, students, pastors, evangelists, and disciple-makers. It does not require an account.';

export const llmsCapabilities = [
  'Create a custom relationship map with a center person, first-circle relationships, and second-circle branches.',
  'Add many people at once by pasting a list of names.',
  'Classify relationships as family, friends, work, school, or neighbors.',
  'Track an intentional next step: Pray, Care, Share, or Disciple.',
  'Add notes and prayer focuses for each person.',
  'Use a guided five-minute prayer timer for the person currently in focus.',
  'Save locally in the browser, with undo for structural changes.',
  'Download the map as PNG, SVG, or editable JSON.',
  'Download or copy a text prayer plan, and print the map on its own.',
  'Copy a private share link that carries the whole map inside the URL.',
  'Import a previously exported JSON map.',
  'Install the site as an app and use it offline.',
];

export const llmsFirstUse = [
  'Put your name in the center of the map.',
  'Add several people already in your life.',
  'Pray by name for one person.',
  'Choose a practical way to care for them.',
  'Share your story or the Gospel naturally when an open door comes.',
  'Invite open people into simple discipleship and help them reach their own oikos.',
];

export const llmsFaq = [
  {
    q: 'Is Oikos Map Builder free?',
    a: 'Yes. Visitors can build, save, and download an Oikos Map at no cost, with no account and no paid tier.',
  },
  {
    q: 'Does an Oikos Map save automatically?',
    a: 'The map saves locally in the visitor\'s browser. Visitors can also download portable files for backup or sharing.',
  },
  {
    q: 'Is an Oikos Map private?',
    a: 'Yes. The map is stored only in the visitor\'s own browser and is never uploaded to a server. A copied share link carries the map inside the URL itself, so the visitor chooses exactly who receives it.',
  },
  {
    q: 'Can a church or group use this tool?',
    a: 'Yes. Churches and groups can use it to pray for their relational world, encourage outreach, plan follow-up, and imagine multiplication through everyday relationships.',
  },
  {
    q: 'What comes after making a map?',
    a: 'Choose one person and one next step. The purpose is not a perfect diagram; it is faithful, prayerful action toward people. A free six-part email journey walks through pray, care, share, and disciple over two weeks.',
  },
  {
    q: 'What does the word oikos mean?',
    a: 'Oikos is the Greek word for household. In the New Testament it describes an extended sphere of relationships rather than only immediate family: relatives, friends, workers, neighbours, and regular guests.',
  },
];

export const llmsAttribution =
  'The original Oikos Map concept is not claimed as an invention of Daniel Ziedins. This site shares the tool freely, in collaboration with e3 Canada, to help more people pray, love, reach, and disciple their oikos. The site is powered by Love on The World and Thy Kingdom Network.';

export const llmsPrimaryEntities = [
  'Oikos Map Builder',
  'Love on The World',
  'Thy Kingdom Network',
  'e3 Canada',
  'Kingdom Connect',
  'Daniel Ziedins',
];
