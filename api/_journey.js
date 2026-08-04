// The Oikos Journey: a 6-part encouragement sequence sent through Resend.
// Email 1 goes out immediately; the rest are queued at signup with Resend's
// `scheduled_at`, so the whole sequence needs no cron and no dashboard config.

const SITE_URL = 'https://www.oikosmap.com';
const LOGO = `${SITE_URL}/icon-192.png`;
const SENDER_LINE = 'Oikos Map · Love on The World & Thy Kingdom Network — in collaboration with e3 Canada';

// Warm palette lifted straight from the site so inbox and site feel like one place.
const INK = '#26201c';
const CREAM = '#fff8ec';
const CARD = '#fffdf7';
const MUTED = '#62564e';
const GOLD = '#f3cf74';
const TEAL = '#14857a';
const DEEP = '#9c3327';

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function firstName(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return 'friend';
  return escapeHtml(trimmed.split(/\s+/)[0].slice(0, 40));
}

// Each entry: { key, delay (Resend scheduled_at offset), subject, preheader, ... }
// `delay` is null for the welcome email, which sends immediately.
export function buildJourney(name) {
  const who = firstName(name);

  return [
    {
      key: 'welcome',
      delay: null,
      subject: 'Your oikos is not an accident',
      preheader: 'Your starter kit is here, plus what to expect over the next two weeks.',
      eyebrow: 'Welcome to the journey',
      heading: `You're in, ${who}.`,
      body: [
        'Thank you for saying yes to something quietly powerful: <strong>paying attention to the people God has already placed around you.</strong>',
        '<em>Oikos</em> is the Greek word for household. In the New Testament it means more than the people under your roof — it is your whole web of everyday relationships. Family. Friends. Coworkers. Classmates. Neighbours. The barista who knows your order.',
        'Here is the part worth sitting with: those people are not random. You did not end up in your street, your workplace, or your family group chat by accident. God put you exactly there, on purpose, as someone who carries His love.',
        'Over the next two weeks I will send you five short emails walking through the simple rhythm the map is built on — <strong>Pray, Care, Share, Disciple</strong> — and then one final email showing you the bigger picture you have just stepped into. No pressure, no guilt, no sales pitch. Just encouragement and practical next steps.',
        'For today, one thing: open your map and write down five names.',
      ],
      scripture: {
        text: 'From one man he made all the nations… he marked out their appointed times in history and the boundaries of their lands. God did this so that they would seek him and perhaps reach out for him and find him — though he is not far from any one of us.',
        ref: 'Acts 17:26–27',
      },
      cta: { text: 'Open your Oikos Map', url: `${SITE_URL}/#builder` },
      ps: 'Reply to this email any time. A real person reads it.',
    },
    {
      key: 'pray',
      delay: 'in 2 days',
      subject: 'Start with one name',
      preheader: 'The five-minute rhythm that changes how you see people.',
      eyebrow: 'Step one of four · Pray',
      heading: 'Prayer makes love specific',
      body: [
        `Hi ${who} — here is step one, and it is the one everything else grows out of.`,
        'It is easy to pray vaguely for "the lost." It is much harder, and far more powerful, to pray for <strong>Marcus, who sits two desks over and has not slept properly since his dad got sick.</strong>',
        'When the names are visible, prayer stops being a category and becomes a person. You start noticing things. You remember the thing they mentioned last week. Doors you were not looking for begin to open.',
        'Try this five-minute rhythm, once a day:',
        '<strong>1.</strong> Open your map and read the names out loud.<br><strong>2.</strong> For each one, ask a single question: <em>"Lord, what does this person need from You today?"</em><br><strong>3.</strong> Ask for one open door — one natural conversation, this week.<br><strong>4.</strong> Write down anything that comes to mind in the notes beside their name.',
        'That is it. Five minutes. You are not trying to manufacture anything — you are simply making yourself available to what God is already doing.',
      ],
      scripture: {
        text: 'Devote yourselves to prayer, being watchful and thankful. And pray for us, too, that God may open a door for our message.',
        ref: 'Colossians 4:2–3',
      },
      cta: { text: 'Pray through your map', url: `${SITE_URL}/#builder` },
      resource: {
        label: 'Go deeper on this',
        title: 'How to pray for unsaved family and friends',
        note: 'The full rhythm, what to pray when it has been years, and how not to carry it alone.',
        url: `${SITE_URL}/blog/how-to-pray-for-unsaved-family-and-friends`,
      },
      ps: 'Tip: the Plan button downloads your whole map as a printable prayer list.',
    },
    {
      key: 'care',
      delay: 'in 4 days',
      subject: 'Love that shows up',
      preheader: 'Seven ordinary ways to move toward someone this week.',
      eyebrow: 'Step two of four · Care',
      heading: 'Before words, presence',
      body: [
        'People rarely change their mind about Jesus because they lost an argument. They change because someone loved them in a way that did not make sense.',
        'Care is the bridge between praying for someone and speaking to them about Jesus. It is also the step most of us skip, because it costs time rather than courage.',
        'Seven ordinary things that land far harder than they look:',
        '☕ Ask them for coffee with no agenda at all.<br>📱 Send the text you keep meaning to send.<br>🍲 Bring food when something hard happens.<br>👂 Ask a second question, then just listen.<br>🚗 Offer the lift, the hand, the hour.<br>🎉 Remember and celebrate their good news.<br>🙏 Tell them plainly: "I prayed for you this week."',
        'That last one is quietly one of the most powerful sentences you can say to a person who does not yet follow Jesus. Almost nobody is offended. Many are moved.',
        'Pick one person on your map. Do one thing this week. Then move them to <strong>Care</strong>.',
      ],
      scripture: {
        text: 'Dear children, let us not love with words or speech but with actions and in truth.',
        ref: '1 John 3:18',
      },
      cta: { text: 'Update someone to Care', url: `${SITE_URL}/#builder` },
      resource: {
        label: 'Go deeper on this',
        title: 'Evangelism without being weird: 12 ways to love your neighbour',
        note: 'All twelve, plus why this is not manipulation, and what it looks like when a whole city does it.',
        url: `${SITE_URL}/blog/evangelism-without-being-weird`,
      },
      links: [
        ['Love on Hamilton', 'https://www.loveonhamilton.com', 'a city adopted by its churches'],
        ['Kingdom Response', 'https://www.kingdomresponse.com', 'church-led relief when disaster hits'],
        ['Jesus Festival app', 'https://www.jesusfestival.app', 'daily Kingdom acts, done together'],
      ],
    },
    {
      key: 'share',
      delay: 'in 7 days',
      subject: 'Your story is enough',
      preheader: 'You do not need to be a theologian. Three minutes will do.',
      eyebrow: 'Step three of four · Share',
      heading: 'You are not the evidence expert. You are the witness.',
      body: [
        'This is the step where most people freeze. What if they ask something I cannot answer? What if I say it badly?',
        'Here is the freedom: <strong>a witness is not asked to argue the case. A witness is asked to say what they saw.</strong> Nobody can dispute your own experience of Jesus, and you are already the world expert on it.',
        'Try shaping your story into three short parts — about a minute each:',
        '<strong>Before.</strong> What life felt like before Jesus was real to you. Be honest, not dramatic.<br><strong>How.</strong> What happened. Who or what God used. It is fine if it was gradual and unremarkable.<br><strong>Different.</strong> What is genuinely different now — including what you are still working through.',
        'That third part matters most. People are not looking for someone with a tidy life. They are looking for someone honest enough to be believed.',
        'And if they ask something you cannot answer, the best possible reply is the true one: <em>"I do not know — but I would love to find out with you."</em> That answer keeps the conversation open. A bluff closes it.',
      ],
      scripture: {
        text: 'Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have. But do this with gentleness and respect.',
        ref: '1 Peter 3:15',
      },
      cta: { text: 'Move someone to Share', url: `${SITE_URL}/#builder` },
      resource: {
        label: 'Go deeper on this',
        title: 'How to share your testimony in three minutes',
        note: 'The full framework, four things that make it land, and what to say when you cannot answer.',
        url: `${SITE_URL}/blog/how-to-share-your-testimony`,
      },
      links: [
        ['Jesus Festival', 'https://www.jesusfestival.ca', 'an easier first invitation than a Sunday service'],
        ['SIX33 Outpost', 'https://six33outpost.com', 'apparel that starts the conversation for you'],
        ['SIX33 Legends', 'https://six33legends.com', 'truth carried by story'],
      ],
    },
    {
      key: 'disciple',
      delay: 'in 10 days',
      subject: 'And then they reach theirs',
      preheader: 'This is where one map quietly becomes a movement.',
      eyebrow: 'Step four of four · Disciple',
      heading: 'Everyone you know knows people you never will',
      body: [
        'Here is the moment the map stops being a list and starts being a picture of something much larger.',
        '<strong>Every person on your map has an oikos of their own.</strong> Their family. Their friends. Rooms you will never walk into and people you will never meet. When one person begins following Jesus, they carry His love into every one of those places — naturally, as an insider, in ways you never could.',
        'That is why discipleship is not the finish line. It is the multiplication point. Your goal was never to reach everyone yourself. It was to help a few people become the kind of people who reach their own world.',
        'Discipling someone is simpler than it sounds:',
        '📖 Read a Gospel together, a bit at a time. John is a good place to start.<br>❓ Ask two questions: <em>What stands out?</em> and <em>What will you do about it?</em><br>🤝 Let them see your actual life, including the unfinished parts.<br>🌱 Then ask them the question that changes everything: <em>"Who is in your oikos?"</em>',
        'On your map, select someone and press <strong>Add branch</strong>. Write in the people they know. Watch what happens to the shape of it.',
      ],
      scripture: {
        text: 'And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others.',
        ref: '2 Timothy 2:2',
      },
      cta: { text: 'Add a branch to your map', url: `${SITE_URL}/#builder` },
      resource: {
        label: 'Go deeper on this',
        title: 'Oikos evangelism: how the early Church actually grew',
        note: 'Why households were the engine of the fastest church growth in history — and why it still works.',
        url: `${SITE_URL}/blog/oikos-evangelism-early-church`,
      },
      links: [
        ['Kingdom Base', 'https://kingdombase.app', 'when your map outgrows one page'],
        ['TaskSimply', 'https://tasksimply.com', 'so the next step actually gets scheduled'],
        ['Lions Den Alliance', 'https://www.lionsdenalliance.com', 'for whoever you lead at work'],
      ],
    },
    {
      key: 'bigger-picture',
      delay: 'in 14 days',
      subject: 'You play a real role in this',
      preheader: 'The bigger picture your five names are part of.',
      eyebrow: 'The bigger picture',
      heading: 'Small faithfulness, joined to thousands of others',
      body: [
        `${who}, this is the last email in the journey, and I want to zoom all the way out.`,
        'While you have been praying for a handful of names, here is the world those names sit inside:',
        '<strong>2.3 billion</strong> people still have little or no access to the Gospel.<br><strong>4,490</strong> people groups are considered unreached — around 43% of all people groups on earth.<br><strong>3,214</strong> are frontier groups, where fewer than 1 in 1,000 follow Christ.<br>And <strong>69%</strong> of Christians now live in the Global South — the mission force is genuinely global, local, and multiplying.',
        'Numbers that size can make a person feel small. But Scripture is remarkably clear that this was never meant to rest on any one of us. One plants. Another waters. God is the one who makes anything grow. <strong>We all play a role, and no role is the whole thing.</strong>',
        'Your role this month may have been five names and five minutes a day. That is not a small thing. That is exactly how the Church has always moved — through ordinary people paying attention to the people in front of them.',
        'If you would like to keep going further, here is what the wider family is building:',
        '🌍 <a href="https://www.loveontheworld.com" style="color:' +
          TEAL +
          ';font-weight:700;">Love on The World</a> — start an outreach group and reach your city together.<br>👑 <a href="https://www.seekfirst.world" style="color:' +
          TEAL +
          ';font-weight:700;">Seek First World</a> — bring the Kingdom into work, art, media and civic life.<br>🔥 <a href="https://www.iamreborn.net" style="color:' +
          TEAL +
          ';font-weight:700;">I Am Reborn</a> — grow in spirit, mind, body and purpose.<br>🤝 <a href="https://kingdom-connect.net/" style="color:' +
          TEAL +
          ';font-weight:700;">Kingdom Connect</a> — find online community and encouragement.<br>🕊️ <a href="https://e3ministry.ca/staff/katie-daniel-ziedins" style="color:' +
          TEAL +
          ';font-weight:700;">e3 Canada</a> — equipping God\'s people to evangelise and establish His Church.',
        'And one last ask, because it costs you nothing and matters more than you would think: <strong>send the Oikos Map to someone.</strong> A friend, your small group, your youth pastor. It is free, it always will be, and every person who maps their oikos is another set of eyes opened to the people around them.',
        'Thank you for letting me walk these two weeks with you.',
      ],
      scripture: {
        text: 'I planted the seed, Apollos watered it, but God has been making it grow… The one who plants and the one who waters have one purpose… For we are co-workers in God\'s service.',
        ref: '1 Corinthians 3:6–9',
      },
      cta: { text: 'Share the Oikos Map', url: SITE_URL },
      ps: 'This is the end of the journey emails — you will only hear from us occasionally from here on.',
    },
  ];
}

// A four-dot rail showing where this email sits in Pray → Care → Share → Disciple,
// so every send reinforces the same rhythm the map itself teaches.
const RHYTHM = ['pray', 'care', 'share', 'disciple'];

function renderProgress(block) {
  const index = RHYTHM.indexOf(block.key);
  if (index === -1) return '';

  const dots = RHYTHM.map((stage, position) => {
    const done = position <= index;
    const label = stage.charAt(0).toUpperCase() + stage.slice(1);
    return `<td style="padding:0 6px 0 0;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="width:26px;height:4px;border-radius:999px;background:${done ? GOLD : 'rgba(72,57,43,0.16)'};font-size:0;line-height:0;">&nbsp;</td>
      </tr><tr>
        <td style="padding-top:6px;font-size:10px;letter-spacing:0.9px;text-transform:uppercase;font-weight:800;color:${
          done ? DEEP : 'rgba(98,86,78,0.55)'
        };font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">${label}</td>
      </tr></table>
    </td>`;
  }).join('');

  return `<tr><td style="padding:2px 34px 18px;">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>${dots}</tr></table>
  </td></tr>`;
}

function renderHeroBand(block) {
  if (block.key !== 'welcome') return '';
  // One warm band on the welcome email only, so the first impression lands.
  return `<tr><td style="padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${GOLD};">
      <tr><td style="padding:16px 34px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <p style="margin:0;font-size:14px;line-height:1.55;color:#4a3a10;font-weight:800;">
          Six emails · Two weeks · Pray, Care, Share, Disciple
        </p>
      </td></tr>
    </table>
  </td></tr>`;
}

// A single featured article card — drives traffic to the journal and gives the
// email somewhere substantial to send people.
function renderResource(block) {
  if (!block.resource) return '';
  const { label, title, note, url } = block.resource;
  return `<tr><td style="padding:6px 34px 4px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(20,132,122,0.28);border-radius:10px;background:#f4fbf9;">
      <tr><td style="padding:18px 20px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <p style="margin:0 0 7px;font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:${TEAL};font-weight:800;">${escapeHtml(
          label,
        )}</p>
        <p style="margin:0 0 6px;font-size:17px;line-height:1.35;font-weight:800;color:${INK};">
          <a href="${url}" style="color:${INK};text-decoration:none;">${escapeHtml(title)}</a>
        </p>
        <p style="margin:0 0 10px;font-size:14px;line-height:1.55;color:${MUTED};">${escapeHtml(note)}</p>
        <a href="${url}" style="font-size:14px;font-weight:800;color:${TEAL};text-decoration:none;">Read the article &rarr;</a>
      </td></tr>
    </table>
  </td></tr>`;
}

// Contextual pointers into the wider network — only ever things relevant to the
// step this email is about.
function renderLinks(block) {
  if (!block.links?.length) return '';
  const rows = block.links
    .map(
      ([name, url, why]) =>
        `<tr><td style="padding:0 0 9px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:${MUTED};">
          <a href="${url}" style="color:${TEAL};font-weight:800;text-decoration:none;">${escapeHtml(name)}</a> — ${escapeHtml(why)}
        </td></tr>`,
    )
    .join('');
  return `<tr><td style="padding:14px 34px 0;">
    <p style="margin:0 0 10px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:${DEEP};font-weight:800;">If you want to take it further</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
  </td></tr>`;
}

export function renderEmail(block, unsubscribeUrl) {
  const scripture = block.scripture
    ? `<tr><td style="padding:4px 34px 10px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="border-left:3px solid ${GOLD};padding:6px 0 6px 18px;font-family:Georgia,'Times New Roman',serif;">
            <p style="margin:0 0 8px;font-size:16px;line-height:1.65;color:${INK};font-style:italic;">&ldquo;${escapeHtml(
              block.scripture.text,
            )}&rdquo;</p>
            <p style="margin:0;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${DEEP};font-weight:800;">${escapeHtml(
              block.scripture.ref,
            )}</p>
          </td>
        </tr></table>
      </td></tr>`
    : '';

  const ps = block.ps
    ? `<tr><td style="padding:16px 34px 0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <p style="margin:0;font-size:14px;line-height:1.6;color:${MUTED};">${block.ps}</p>
      </td></tr>`
    : '';

  const paragraphs = block.body
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.72;color:${INK};">${paragraph}</p>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(block.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${CREAM};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(block.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:26px 12px;">
<tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${CARD};border:1px solid rgba(72,57,43,0.16);border-radius:18px;overflow:hidden;">
    <tr><td style="padding:26px 34px 0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="padding-right:12px;"><img src="${LOGO}" width="34" height="34" alt="" style="display:block;border-radius:9px;border:0;"></td>
        <td style="font-size:15px;font-weight:800;color:${INK};letter-spacing:-0.2px;">Oikos Map</td>
      </tr></table>
    </td></tr>
    ${renderHeroBand(block)}
    <tr><td style="padding:24px 34px 6px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${DEEP};font-weight:800;">${escapeHtml(
        block.eyebrow,
      )}</p>
      <h1 style="margin:0 0 8px;font-size:29px;line-height:1.18;color:${INK};font-weight:800;letter-spacing:-0.5px;">${block.heading}</h1>
    </td></tr>
    ${renderProgress(block)}
    <tr><td style="padding:0 34px 6px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      ${paragraphs}
    </td></tr>
    ${scripture}
    ${renderResource(block)}
    ${renderLinks(block)}
    <tr><td style="padding:22px 34px 6px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td align="center" bgcolor="${INK}" style="border-radius:999px;">
          <a href="${block.cta.url}" target="_blank" style="display:inline-block;padding:14px 30px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;color:${CREAM};text-decoration:none;border-radius:999px;">${escapeHtml(
            block.cta.text,
          )} &rarr;</a>
        </td>
      </tr></table>
    </td></tr>
    ${ps}
    <tr><td style="padding:26px 34px 0;"><div style="height:1px;background:rgba(72,57,43,0.14);"></div></td></tr>
    <tr><td style="padding:16px 34px 28px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <p style="margin:0 0 8px;font-size:12px;line-height:1.6;color:${MUTED};">You are receiving this because you asked for the Oikos starter kit at oikosmap.com. Your map itself stays private in your own browser — we never see it.</p>
      <p style="margin:0 0 8px;font-size:12px;line-height:1.6;color:${MUTED};"><a href="${SITE_URL}" style="color:${TEAL};text-decoration:underline;">Oikos Map</a> &nbsp;·&nbsp; <a href="${unsubscribeUrl}" style="color:${TEAL};text-decoration:underline;">Unsubscribe</a></p>
      <p style="margin:0;font-size:11px;line-height:1.6;color:rgba(98,86,78,0.8);">${escapeHtml(SENDER_LINE)}</p>
    </td></tr>
  </table>
  <p style="margin:14px 0 0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;color:rgba(98,86,78,0.75);">Pray by name · Love intentionally · Live on mission</p>
</td></tr>
</table>
</body></html>`;
}

export function plainTextFallback(block) {
  const strip = (html) =>
    String(html)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');

  const lines = [block.heading, '', ...block.body.map(strip)];
  if (block.scripture) lines.push('', `"${block.scripture.text}" — ${block.scripture.ref}`);
  if (block.resource) lines.push('', `${block.resource.label}: ${block.resource.title}`, block.resource.url);
  if (block.links?.length) {
    lines.push('', 'If you want to take it further:');
    block.links.forEach(([name, url, why]) => lines.push(`- ${name} — ${why}: ${url}`));
  }
  lines.push('', `${block.cta.text}: ${block.cta.url}`);
  if (block.ps) lines.push('', strip(block.ps));
  return lines.join('\n');
}
