// Body for /blog/advent-prayer-calendar-for-your-oikos. The 25 days come from
// src/content/advent.js (shared with the downloadable .ics), so the article and
// the calendar can never disagree. Scripture is NIV, word for word.
import { ADVENT_ICS_PATH, adventDays, adventWeeks } from '../advent.js';

const dayLine = (d) =>
  `<strong>December ${d.day} · ${d.ref}</strong> — <em>"${d.text.replace(/"/g, '&quot;')}"</em><br>Pray: ${d.prayer}`;

const weekSections = adventWeeks.map((week) => ({
  heading: week.label,
  list: adventDays.filter((d) => d.day >= week.days[0] && d.day <= week.days[1]).map(dayLine),
}));

export default {
  intro: [
    'December is the one month of the year when much of the world is humming songs about Jesus without thinking about Him. Your neighbours, coworkers and family are more open to faith conversations now than at almost any other time — and more stretched, lonely and tired, too.',
    `So here is a simple way to spend Advent praying for the people God has placed around you: 25 days, one verse and one short prayer each day, from December 1 to Christmas Day. Read it here, or <a href="${ADVENT_ICS_PATH}" download>add the free Advent prayer calendar</a> to your phone and get each day's verse as a calendar event.`,
  ],
  sections: [
    {
      heading: 'How to use this Advent prayer calendar',
      list: [
        '<strong>Choose your five.</strong> Pick five people who do not yet follow Jesus — family, friends, neighbours, coworkers. The <a href="/#builder">free Oikos Map builder</a> takes two minutes, or <a href="/blog/free-printable-oikos-map-template">print a paper map</a> for the fridge.',
        '<strong>Pray one day at a time.</strong> Read the verse, then pray the short prayer over each of your five by name. Five minutes is enough.',
        `<strong>Add it to your calendar.</strong> <a href="${ADVENT_ICS_PATH}" download>Download the Advent calendar file</a> and open it on your phone: 25 all-day events, December 1–25, each with that day's verse and prayer. It repeats every year, so you only add it once.`,
        '<strong>Watch for one open door.</strong> Advent is full of natural invitations — a carol service, a Christmas Eve service, a meal. Ask God for one this month.',
        '<strong>Do it with someone.</strong> Pray through it with your family at dinner, or with a friend over text. Two people praying for the same names keep each other going.',
      ],
    },
    {
      heading: 'Why pray through Advent?',
      paragraphs: [
        'Advent means "coming." For centuries Christians have used the weeks before Christmas to remember that God came to us in Jesus, and to wait for His coming again. The traditional four themes — hope, peace, joy and love — are exactly what the people around us are looking for, often without knowing where to find them.',
        'The Christmas story is also a story about the people closest to Jesus: a young couple, some shepherds on a night shift, visitors from far away. The angel\'s announcement was <em>"good news that will cause great joy for all the people"</em> (Luke 2:10). Praying through Advent is asking God to let that good news reach the particular people on your map.',
      ],
    },
    ...weekSections,
    {
      heading: 'Turning prayer into an invitation',
      paragraphs: [
        'Prayer often comes first, and then God opens a door. Here are a few natural ways to act on what you have been praying, without pressure:',
      ],
      list: [
        '<strong>Invite someone to a Christmas Eve service</strong> — it is one of the easiest invitations of the year. <a href="/blog/how-to-invite-someone-to-church">How to invite someone without it being awkward.</a>',
        '<strong>Share the meaning behind your traditions</strong> when someone asks why you celebrate the way you do.',
        '<strong>Bless a neighbour</strong> with baking, a card, or help with the lights. <a href="/blog/who-is-my-neighbour">Who is my neighbour?</a>',
        '<strong>Ask a gentle question</strong> over a holiday meal. <a href="/blog/spiritual-conversation-starters">30 conversation starters</a> and <a href="/blog/talking-about-jesus-with-family-at-the-holidays">talking about Jesus with family at the holidays</a> will help.',
        '<strong>Keep going in January.</strong> The fruit of December prayer often shows up later. The builder can add <a href="/#builder">a daily prayer reminder</a> to your calendar for the rest of the year.',
      ],
    },
  ],
  scripture: {
    text: 'But the angel said to them, “Do not be afraid. I bring you good news that will cause great joy for all the people.”',
    ref: 'Luke 2:10',
  },
  network: ['JesusFestival.ca', 'LoveonTheWorld.com', 'KD-Ziedins.com'],
  cta: { text: 'Add the Advent prayer calendar', url: ADVENT_ICS_PATH },
  faq: [
    {
      q: 'What is an Advent prayer calendar?',
      a: 'An Advent prayer calendar gives you one short Bible reading and prayer for each day from December 1 to Christmas Day. This one focuses on praying by name for the people around you who do not yet know Jesus, following the Advent themes of hope, peace, joy and love.',
    },
    {
      q: 'How do I add the Advent prayer calendar to my phone?',
      a: 'Download the free calendar file from oikosmap.com/downloads/advent-prayer-calendar.ics and open it on your phone or computer. It adds 25 all-day events, December 1–25, each with that day\'s verse and prayer, to Apple, Google or Outlook Calendar. The events repeat every year.',
    },
    {
      q: 'Who should I pray for during Advent?',
      a: 'Choose a few people you see regularly who do not yet follow Jesus — family members, friends, neighbours or coworkers — and pray for each of them by name every day. Writing their names on an Oikos Map helps you remember them.',
    },
    {
      q: 'What are the four themes of Advent?',
      a: 'The four Sundays of Advent are traditionally associated with hope, peace, joy and love, often marked by lighting candles on an Advent wreath. This prayer calendar follows those themes week by week, ending with Christmas Day.',
    },
  ],
};
