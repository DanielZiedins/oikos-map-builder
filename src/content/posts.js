// Full article bodies. Summaries live in posts-meta.js so the homepage can show
// the latest articles without bundling every word of every post; this file is only
// ever loaded on the blog entry point.
//
// Each post generates its own prerendered HTML shell at build time
// (see scripts/build-blog.js), so every article gets a real title, description,
// canonical URL, and Article schema rather than sharing the homepage head.

import { postsMeta, sortedPostsMeta } from './posts-meta.js';

const bodies = {
  'what-is-an-oikos': {
    intro: [
      "If you have spent any time around evangelism training, you have probably heard the word <em>oikos</em> used as a bit of Christian jargon — usually meaning \"the people you know.\" That is not wrong. But it is a much smaller idea than the one the New Testament writers had in mind.",
      "Understanding what an oikos actually was does something useful: it takes the pressure off. You stop imagining evangelism as a performance for strangers and start seeing it as something that happens along the relationships you already have."
    ],
    sections: [
      {
        "heading": "The word itself",
        "paragraphs": [
          "<strong>Oikos</strong> (οἶκος) is Greek for <em>house</em> or <em>household</em>. It shows up well over a hundred times in the New Testament. Sometimes it means a physical building. More often it means something closer to what we would call an extended network.",
          "A first-century oikos was not a nuclear family. It included blood relatives, in-laws, servants and their families, freed workers, business partners, tenants, and regular guests. A reasonably established household might involve dozens of people bound together by obligation, trade, and daily proximity.",
          "So when Scripture says a household believed, it is not describing four people at a dinner table. It is describing a web."
        ]
      },
      {
        "heading": "Why this mattered for the early Church",
        "paragraphs": [
          "Once you see the oikos, a pattern in Acts becomes hard to miss. Cornelius gathers his relatives and close friends before Peter has said a word. Lydia is baptised \"and the members of her household.\" The Philippian jailer believes, and \"all his household\" follows. Crispus, the synagogue leader, believes \"together with his entire household.\"",
          "The Gospel did not spread primarily through public preaching to strangers, though that happened too. It spread along existing lines of trust. One person encountered Jesus, and the news travelled through the relationships that person already had — because those were the people who would actually believe them.",
          "That is not a first-century quirk. It is still how conviction moves. You are far more likely to reconsider something because a friend changed than because a stranger argued well."
        ]
      },
      {
        "heading": "Your oikos today",
        "paragraphs": [
          "You do not have servants or tenants, so the shape has changed. But the function has not. Your oikos is the set of people with whom you have real, repeated, trusted contact:"
        ],
        "list": [
          "Family — immediate, extended, and the complicated ones",
          "Friends, including the ones you only see online",
          "Coworkers, clients, and the people you manage or answer to",
          "Classmates, teammates, and study groups",
          "Neighbours, and the regulars: the barista, the barber, the school gate parents"
        ],
        "after": [
          "For most adults this comes to somewhere between eight and fifteen people with genuine relational weight, and a wider ring of perhaps fifty you could text without it being strange.",
          "That is not a small mission field. That is a mission field you already have access to, credibility in, and history with."
        ]
      },
      {
        "heading": "The part that changes how you pray",
        "paragraphs": [
          "Here is the practical shift. It is easy to pray in categories — \"Lord, save the lost.\" It is much harder, and far more transforming, to pray for a specific person by name, week after week, while you watch their life.",
          "Naming people does something to the person praying. You start noticing. You remember what they mentioned. You spot the moment when something opens. Vague compassion becomes attention, and attention is most of what love is made of.",
          "That is the entire idea behind an <a href=\"/#builder\">Oikos Map</a>: get the names out of your head and onto one page where you can actually see them."
        ]
      },
      {
        "heading": "A word about pressure",
        "paragraphs": [
          "One caution, because this teaching can go wrong. An oikos is not a sales funnel, and the people on your map are not prospects. Treating a friendship as a conversion project is both unloving and obvious — people can feel it immediately.",
          "The aim is not to work through a list. The aim is to love the people God has actually placed around you, pray for them honestly, and be ready to speak when the door opens. Some doors open in a week. Some take fifteen years. Neither is a failure of technique."
        ]
      }
    ],
    scripture: {
      "text": "From one man he made all the nations… he marked out their appointed times in history and the boundaries of their lands. God did this so that they would seek him and perhaps reach out for him and find him — though he is not far from any one of us.",
      "ref": "Acts 17:26–27"
    },
    network: [
      "ThyKingdom.net",
      "LoveonTheWorld.com",
      "IAmReborn.net"
    ],
    cta: {
      "text": "Map your oikos free",
      "url": "/#builder"
    },
  },

  'how-to-pray-for-unsaved-family-and-friends': {
    intro: [
      "Praying for someone who does not follow Jesus is one of the most tender and most discouraging things a Christian does. Tender, because you love them. Discouraging, because you have often been praying a long time with nothing visible to show.",
      "This is a simple, sustainable rhythm — five minutes, once a day — plus some honest help for when it has been going on for years."
    ],
    sections: [
      {
        "heading": "Start with names, not categories",
        "paragraphs": [
          "Write the names down. On paper, in your notes app, or on an <a href=\"/#builder\">Oikos Map</a>. The specific act of writing a name converts a vague burden into a definite person you can actually pray for.",
          "Keep the list short enough to be real. Five names you pray for daily will do more than forty you pray for never."
        ]
      },
      {
        "heading": "The five-minute rhythm",
        "paragraphs": [
          "Once a day, ideally at the same moment — commute, kettle, lunch break:"
        ],
        "list": [
          "<strong>Read the names out loud.</strong> All of them. It takes twenty seconds and it re-anchors your attention.",
          "<strong>Ask one question per person:</strong> \"Lord, what does this person need from You today?\" Then wait a moment. Do not rush past the silence.",
          "<strong>Ask for one open door</strong> — a natural conversation, this week. Not a dramatic breakthrough. A door.",
          "<strong>Write down anything that comes to mind.</strong> A memory, a nudge, something they said. This is the part most people skip, and it is where the pattern usually shows up."
        ],
        "after": [
          "That is the whole thing. The point is not the length of the prayer. It is the consistency of the attention."
        ]
      },
      {
        "heading": "What to actually pray",
        "paragraphs": [
          "When you run out of words, Scripture gives you plenty. Some that fit this situation well:"
        ],
        "list": [
          "<strong>That God would open a door for the message</strong> — Colossians 4:3",
          "<strong>That the eyes of their heart would be enlightened</strong> — Ephesians 1:18",
          "<strong>That He would give them a new heart</strong>, not merely better behaviour — Ezekiel 36:26",
          "<strong>That workers would be sent</strong> — because you may not be the only one, or even the main one — Matthew 9:38",
          "<strong>That you would be given boldness and clarity</strong> when the moment comes — Ephesians 6:19"
        ],
        "after": [
          "Notice how many of those are prayers about you. That is not a distraction from the work. Praying for someone regularly will change your posture toward them long before it changes their mind about Jesus."
        ]
      },
      {
        "heading": "When it has been years",
        "paragraphs": [
          "This is the hard part, and it deserves honesty rather than a slogan.",
          "Some of us are praying for a parent who has said no for thirty years, or a sibling who has made it clear the subject is closed. The temptation is to conclude either that God is not listening or that we have prayed badly.",
          "Two things worth holding at once. First, no prayer prayed in faith is wasted, and you are not the one who makes anything grow — one plants, another waters, God gives the growth. Second, your job was never to secure the outcome. It was to keep loving and keep asking.",
          "Practically: shorten the prayer rather than dropping it. On the years-long ones, \"Lord, You know. Please move\" is a complete prayer. Keep the name on the page. Persistence is not the same as striving, and the parable of the persistent widow suggests God is not annoyed by being asked repeatedly."
        ]
      },
      {
        "heading": "Do not carry it alone",
        "paragraphs": [
          "Praying alone for years is heavy, and it is not how this was designed to work. Find at least one other person who will pray the same names with you — a spouse, a friend, a small group.",
          "If you do not have that, build it. <a href=\"https://www.loveontheworld.com\" target=\"_blank\" rel=\"noopener\">Love on The World</a> exists to help believers gather a few friends and start praying for their city together, and the <a href=\"https://www.jesusfestival.app\" target=\"_blank\" rel=\"noopener\">Jesus Festival app</a> has a live prayer wall where you can put a request in front of a whole community. <a href=\"https://www.kd-ziedins.com\" target=\"_blank\" rel=\"noopener\">Daniel and Katie</a> write about doing this as a family, which is its own particular challenge."
        ]
      }
    ],
    scripture: {
      "text": "Devote yourselves to prayer, being watchful and thankful. And pray for us, too, that God may open a door for our message.",
      "ref": "Colossians 4:2–3"
    },
    network: [
      "LoveonTheWorld.com",
      "JesusFestival.app",
      "KD-Ziedins.com"
    ],
    cta: {
      "text": "Build your prayer list",
      "url": "/#builder"
    },
  },

  'how-to-share-your-testimony': {
    intro: [
      "The most common reason Christians stay quiet is not shame. It is the fear of being asked something they cannot answer, and of doing damage by fumbling it.",
      "So here is the freedom in how Scripture frames this: you are called to be a <em>witness</em>. A witness is not asked to argue the case. A witness is asked to say what they saw. You are already the world expert on your own experience of Jesus."
    ],
    sections: [
      {
        "heading": "The three-part shape",
        "paragraphs": [
          "Aim for about three minutes total — roughly a minute per part. Short enough to be a conversation rather than a monologue."
        ],
        "list": [
          "<strong>Before.</strong> What life was actually like before Jesus was real to you. Not a highlight reel of sin, and not a false bottom either. What were you chasing? What was missing?",
          "<strong>How.</strong> What happened. Who or what God used. It is completely fine if it was gradual, undramatic, and spread over years — most stories are.",
          "<strong>Different.</strong> What is genuinely different now. Include what you are still working through."
        ],
        "after": [
          "That third part is doing more work than you think. People are not looking for someone with a solved life. They are looking for someone honest enough to be believed."
        ]
      },
      {
        "heading": "Four things that make it land",
        "paragraphs": [],
        "list": [
          "<strong>Cut the jargon.</strong> Saved, blessed, convicted, testimony, quiet time, on fire — these all mean something to you and almost nothing to your neighbour. Say it as you would to a colleague.",
          "<strong>Use one concrete detail.</strong> \"I used to lie awake at 3am doing sums in my head\" is memorable. \"I had no peace\" is not.",
          "<strong>Do not oversell the after.</strong> If you claim everything is fixed, the first hard week of your life becomes evidence against you.",
          "<strong>End open, not closed.</strong> \"That is where I am with it\" invites a reply. \"And that is why you need Jesus\" ends the conversation."
        ]
      },
      {
        "heading": "When they ask something you cannot answer",
        "paragraphs": [
          "It will happen. Suffering, science, hell, hypocrisy in the Church, a specific hard passage. And the best available response is the true one:",
          "<em>\"I do not know — but I would love to find out with you.\"</em>",
          "That sentence keeps the conversation open and treats them as a person rather than an objection. A bluff does the opposite, and people can nearly always tell."
        ]
      },
      {
        "heading": "Practise once, out loud",
        "paragraphs": [
          "Reading it in your head does not work. Say it out loud once, in the car or on a walk. It will feel absurd. It also gets dramatically easier the second time, and the first real telling will not be your first attempt.",
          "If it helps, write the three parts on your phone as three short bullets. Not a script — a shape."
        ]
      },
      {
        "heading": "Sometimes something else asks the first question",
        "paragraphs": [
          "Not every conversation has to start with you. An invitation to something joyful often does the work — a free city-wide gathering like <a href=\"https://www.jesusfestival.ca\" target=\"_blank\" rel=\"noopener\">Jesus Festival</a> is a far easier first ask than a Sunday service, and the <a href=\"https://www.jesusfestivalmovement.com\" target=\"_blank\" rel=\"noopener\">movement behind it</a> exists precisely so cities can hear the Gospel together.",
          "Sometimes it is simpler still. A shirt from <a href=\"https://six33outpost.com\" target=\"_blank\" rel=\"noopener\">SIX33 Outpost</a> has started plenty of conversations its wearer did not have to open, and a story can go where an argument cannot — which is the whole idea behind <a href=\"https://six33legends.com\" target=\"_blank\" rel=\"noopener\">SIX33 Legends</a>."
        ]
      }
    ],
    scripture: {
      "text": "Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have. But do this with gentleness and respect.",
      "ref": "1 Peter 3:15"
    },
    network: [
      "JesusFestival.ca",
      "JesusFestivalMovement.com",
      "SIX33Outpost.com",
      "SIX33Legends.com"
    ],
    cta: {
      "text": "See who to share with",
      "url": "/#builder"
    },
  },

  'evangelism-without-being-weird': {
    intro: [
      "There is a gap in most evangelism teaching. We are told to pray for people, and we are told to share the Gospel with them, and between those two things is a canyon that most of us never cross.",
      "The bridge is care. Not as a tactic to earn the right to speak, but because loving your neighbour is a command in its own right. Here are twelve things that cost time rather than courage."
    ],
    sections: [
      {
        "heading": "Twelve ordinary things",
        "paragraphs": [],
        "list": [
          "<strong>Ask them for coffee with no agenda.</strong> None. If you go in with a plan they will sense it.",
          "<strong>Send the message you keep meaning to send.</strong> Today. It is two sentences.",
          "<strong>Bring food when something hard happens.</strong> Still undefeated after two thousand years.",
          "<strong>Ask a second question.</strong> Most conversations die after the first answer. \"What was that actually like?\" reopens it.",
          "<strong>Then stop talking.</strong> Being genuinely listened to is rare enough to be startling.",
          "<strong>Remember and celebrate their good news.</strong> Put the interview, the scan, the birthday in your calendar.",
          "<strong>Offer the specific help,</strong> not the vague offer. \"I can pick the kids up Thursday\" beats \"let me know if you need anything.\"",
          "<strong>Be useful with what you already have</strong> — a car, a drill, an afternoon, a skill.",
          "<strong>Apologise properly when you get it wrong.</strong> Watching a Christian repent well is its own kind of witness.",
          "<strong>Be consistent rather than intense.</strong> Show up for the eighth month, not just the first week.",
          "<strong>Include them.</strong> The barbecue, the walk, the group thing. Loneliness is the real epidemic.",
          "<strong>Tell them plainly: \"I prayed for you this week.\"</strong>"
        ],
        "after": [
          "That last one deserves a note. It sounds like the risky one and it is almost never received badly. Most people are quietly moved that someone thought of them at all. It also gently makes your faith visible without requiring a sermon."
        ]
      },
      {
        "heading": "Why this is not manipulation",
        "paragraphs": [
          "A fair objection: is being kind in order to share the Gospel a form of bait?",
          "It would be, if the kindness were conditional — if you stopped caring once it became clear they were not interested. The test is simple. Would you still bring the meal in ten years if they never changed their mind? If yes, it is love. If no, it was leverage, and they will work that out long before you do.",
          "Care is not the entry fee for evangelism. It is part of the message."
        ]
      },
      {
        "heading": "This scales further than you think",
        "paragraphs": [
          "What happens when a whole church does this on purpose, in one place, is worth seeing. <a href=\"https://www.loveonhamilton.com\" target=\"_blank\" rel=\"noopener\">Love on Hamilton</a> is a working example of a city adopted by its congregations, and <a href=\"https://www.kingdomresponse.com\" target=\"_blank\" rel=\"noopener\">Kingdom Response</a> is what this looks like at its most urgent — church-led relief when disaster hits.",
          "If you would rather not do it alone, the <a href=\"https://www.jesusfestival.app\" target=\"_blank\" rel=\"noopener\">Jesus Festival app</a> turns daily acts of kindness into something a whole community does together, and <a href=\"https://www.loveontheworld.com\" target=\"_blank\" rel=\"noopener\">Love on The World</a> will help you start a group where you live."
        ]
      }
    ],
    scripture: {
      "text": "Dear children, let us not love with words or speech but with actions and in truth.",
      "ref": "1 John 3:18"
    },
    network: [
      "LoveonHamilton.com",
      "KingdomResponse.com",
      "JesusFestival.app",
      "LoveonTheWorld.com"
    ],
    cta: {
      "text": "Pick one person to start with",
      "url": "/#builder"
    },
  },

  'oikos-evangelism-early-church': {
    intro: [
      "Within roughly three centuries, a movement of a few thousand Galilean followers became the dominant faith of the Roman Empire. It managed this with no church buildings for most of that period, no state backing, no printing press, and long stretches of active persecution.",
      "It is worth asking how. Not out of nostalgia, but because the mechanism is still available to us — and it looks almost nothing like most modern evangelism strategy."
    ],
    sections: [
      {
        "heading": "The household was the unit",
        "paragraphs": [
          "The early Church did not have a building to invite people to. It had homes. Meetings happened in the oikos, which meant the natural boundary of the church was the natural boundary of a household network.",
          "This had an enormous consequence. To join the movement, you did not cross into unfamiliar territory — you went to a house you already knew, hosted by someone you already trusted. The social cost of investigating Christianity was low, and the relational reinforcement afterwards was high.",
          "When Paul greets \"the church that meets at their house,\" he is not describing a small group. He is describing the basic organisational form of the movement."
        ]
      },
      {
        "heading": "It travelled along trust, not broadcast",
        "paragraphs": [
          "Read the conversion accounts in Acts and count how many arrive through an existing relationship. Cornelius has already gathered his relatives and close friends. Lydia is baptised with her household. The jailer, the same night, with all his. Timothy comes to faith through his mother and grandmother.",
          "Public preaching absolutely happened, and it drew crowds. But the crowds were the front door. The households were the building.",
          "Sociologists of religion studying this period keep landing on the same conclusion: new religious movements spread primarily through pre-existing social networks. People convert when someone they already trust converts first. That is not cynicism about the Spirit — it is a description of the ordinary means the Spirit tends to use."
        ]
      },
      {
        "heading": "They were unusually good at the unglamorous parts",
        "paragraphs": [
          "The early Christians developed a reputation for behaviour that made no economic sense. They cared for their sick instead of fleeing plague cities. They buried the poor. They took in abandoned infants. They fed widows who were not their relatives.",
          "Even hostile observers noted it. The emperor Julian, trying to revive Roman paganism, complained bitterly that the Christians had won influence through their care of strangers and the poor, and urged his own priests to copy it.",
          "This is worth sitting with. The most effective apologetic of the early Church was not a superior argument. It was a visible, costly, sustained pattern of love that the surrounding culture could not account for."
        ]
      },
      {
        "heading": "Multiplication, not addition",
        "paragraphs": [
          "Here is the part that most changes how you read your own map. Every person in a household network has a household network of their own.",
          "When one person begins following Jesus, they carry the Gospel into rooms you will never enter, among people who would never listen to you, as a trusted insider. That is why Paul tells Timothy to entrust what he has learned to reliable people <em>who will also teach others</em> — four generations deep in a single sentence.",
          "Addition is reaching people yourself. Multiplication is helping a few people become the kind of people who reach their own world. One is limited by your capacity. The other is not.",
          "On an <a href=\"/#builder\">Oikos Map</a>, this is the difference between a list of names and a branching diagram. Add a branch to someone and write in the people <em>they</em> know. The shape of the thing changes."
        ]
      },
      {
        "heading": "What this means for you, concretely",
        "paragraphs": [],
        "list": [
          "<strong>Your relationships are the strategy,</strong> not a warm-up to it.",
          "<strong>Your home is a legitimate venue.</strong> A meal is a valid ministry.",
          "<strong>Depth beats reach.</strong> A few people you actually disciple will outperform a large audience you merely inform.",
          "<strong>Consistency is the differentiator.</strong> The early Church won on decades, not campaigns.",
          "<strong>Aim for the fourth generation.</strong> Ask the people you disciple who is in <em>their</em> oikos."
        ]
      },
      {
        "heading": "The scale, and your part in it",
        "paragraphs": [
          "This is still unfinished. Around 2.3 billion people have little or no access to the Gospel, and roughly 4,490 people groups are considered unreached. You can see the current picture on <a href=\"https://www.loveonmission.world\" target=\"_blank\" rel=\"noopener\">Love on Mission</a>, which maps the Great Commission as it stands today.",
          "Numbers that size can make a person feel pointless. Scripture is unusually direct about this: one plants, another waters, God makes it grow, and the planter and the waterer are simply co-workers with one purpose. No single person is the whole thing, and no faithful part is wasted.",
          "Your part may be five names and five minutes a day. Historically, that is exactly what this has always been made of. If you want the wider vision, <a href=\"https://www.thykingdom.net\" target=\"_blank\" rel=\"noopener\">Thy Kingdom Network</a> is the family these tools come from, and <a href=\"https://www.seekfirst.world\" target=\"_blank\" rel=\"noopener\">Seek First World</a> presses the same question into work, art, and public life."
        ]
      }
    ],
    scripture: {
      "text": "I planted the seed, Apollos watered it, but God has been making it grow… The one who plants and the one who waters have one purpose… For we are co-workers in God's service.",
      "ref": "1 Corinthians 3:6–9"
    },
    network: [
      "LoveonMission.world",
      "ThyKingdom.net",
      "SeekFirst.World"
    ],
    cta: {
      "text": "Map your household network",
      "url": "/#builder"
    },
  },

  'faith-at-work-your-coworkers-are-your-oikos': {
    intro: [
      "Most of us will spend something like 90,000 hours at work. For many, colleagues are the people we see most, after immediate family — and often we see them at their most stressed, most honest, and most human.",
      "And yet work is the part of the oikos we are least equipped for. Church teaching tends to address family and neighbours. Work gets a talk about integrity and little else."
    ],
    sections: [
      {
        "heading": "Competence is part of the witness",
        "paragraphs": [
          "Start here, because it is the part most often skipped. Doing your job well is not separate from being a faithful Christian at work — it is the foundation of it.",
          "Nobody is persuaded about eternity by someone who misses deadlines and talks about grace. Being reliable, prepared, honest about mistakes, and genuinely good at your work buys you something no evangelism strategy can: credibility.",
          "Colossians tells slaves — people with far less agency than any of us — to work as though working for the Lord. If that applied there, it certainly applies to a spreadsheet.",
          "This is also where the practical matters. Faithfulness is largely logistics: if the follow-up you promised never got scheduled, it never happened. Tools like <a href=\"https://tasksimply.com\" target=\"_blank\" rel=\"noopener\">TaskSimply</a> exist for exactly that unglamorous problem."
        ]
      },
      {
        "heading": "What actually gets noticed",
        "paragraphs": [
          "In a workplace, these are the things people register over months:"
        ],
        "list": [
          "<strong>How you speak about absent colleagues.</strong> Refusing to join a pile-on is loud.",
          "<strong>How you handle being wrong.</strong> Owning it fully, without spin, is genuinely rare.",
          "<strong>How you treat people with nothing to offer you.</strong> Cleaners, juniors, contractors, the difficult client.",
          "<strong>Whether you are the same person under pressure.</strong> Character shows up at quarter-end.",
          "<strong>Whether you protect your rest.</strong> A Christian who is not frantic is a quiet argument that their identity rests somewhere other than performance."
        ]
      },
      {
        "heading": "How faith comes up naturally",
        "paragraphs": [
          "You rarely need to engineer this. Work generates the questions on its own: a redundancy round, a diagnosis, a divorce, a birth, a colleague quietly falling apart in a meeting room.",
          "What you need is to be the kind of person who is safe to talk to when it happens, and honest enough not to hide where your own hope comes from. \"I was praying about that on the way in\" is a normal sentence, said normally.",
          "Two things to avoid. Do not use your position to pressure people who report to you — that is an abuse of power, however well intended. And do not perform. Sincerity survives scrutiny; a persona does not."
        ]
      },
      {
        "heading": "If you lead or own the business",
        "paragraphs": [
          "Authority changes the calculus. You cannot evangelise downward without the power dynamic doing the talking. But you can shape something more far-reaching: how the organisation treats people.",
          "Wages that are actually fair. Hours that do not quietly consume families. Honesty with customers when it costs you. Space for people to be human. These decisions preach to everyone who works there, and they are available only to you.",
          "<a href=\"https://www.lionsdenalliance.com\" target=\"_blank\" rel=\"noopener\">Lions Den Alliance</a> is a network of business owners refusing to split faith from work in exactly this way, and <a href=\"https://www.seekfirst.world\" target=\"_blank\" rel=\"noopener\">Seek First World</a> presses the same question across culture more broadly — work, media, art, and civic life."
        ]
      },
      {
        "heading": "Keeping track without being strange about it",
        "paragraphs": [
          "Colleagues belong on your <a href=\"/#builder\">Oikos Map</a> alongside family and neighbours. Put them there. Note what they mentioned. Pray for them by name.",
          "If you are working with a team, or your list has grown past what one page can hold, <a href=\"https://kingdombase.app\" target=\"_blank\" rel=\"noopener\">Kingdom Base</a> is built for tracking conversations and follow-ups properly across a group.",
          "And guard the source. Sustained witness in a demanding job runs on something, and if that something is willpower it will not last. <a href=\"https://www.iamreborn.net\" target=\"_blank\" rel=\"noopener\">I Am Reborn</a> is about that formation — spirit, mind, body, purpose — and <a href=\"https://www.danielziedins.com\" target=\"_blank\" rel=\"noopener\">Daniel Ziedins</a> writes on faith, work, and building things that serve the Kingdom."
        ]
      }
    ],
    scripture: {
      "text": "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
      "ref": "Colossians 3:23"
    },
    network: [
      "LionsDenAlliance.com",
      "SeekFirst.World",
      "TaskSimply.com",
      "KingdomBase.App",
      "IAmReborn.net",
      "DanielZiedins.com"
    ],
    cta: {
      "text": "Add your colleagues to your map",
      "url": "/#builder"
    },
  },

  'how-to-invite-someone-to-church': {
    intro: [
      'Ask people how they first ended up in a church, and you will hear the same answer over and over: <strong>someone invited them.</strong> Not a campaign, not an algorithm — a person they already knew, who asked.',
      'And yet inviting someone is the step most of us quietly avoid. Not because we lack conviction, but because we are afraid of the ten seconds of awkwardness between asking and hearing the answer.',
    ],
    sections: [
      {
        heading: 'Why it feels awkward (and why it usually is not)',
        paragraphs: [
          'The fear is that inviting someone changes the relationship — that you stop being a friend and become a project. It is a fair fear, and it is worth naming, because it is exactly what people can sense.',
          'But notice what is actually happening in your head. You are rehearsing a rejection that has not occurred, on behalf of a person who has not been asked. Most people, when invited warmly to something that matters to a friend, are not offended. They are mildly flattered, even when they say no.',
          'The invitation is not the hard part. Deciding to risk the small, brief awkwardness is the hard part.',
        ],
      },
      {
        heading: 'Start lower than a Sunday service',
        paragraphs: [
          'A Sunday morning service is a surprisingly high-commitment ask. It involves unfamiliar customs, standing and sitting on cue, songs everyone else knows, and no obvious exit. For someone with no church background, it can feel like walking into a private members club mid-conversation.',
          'There is usually a lower rung on the ladder, and lower rungs get climbed more often:',
        ],
        list: [
          '<strong>Your table.</strong> A meal at your home asks almost nothing of them and shows almost everything about you.',
          '<strong>Something joyful and public.</strong> A free outdoor event is far easier to accept than a service — nobody has to know the etiquette.',
          '<strong>A practical thing.</strong> Serving together at a food drive or a community day. Doing beats watching.',
          '<strong>A conversation with a set end.</strong> A course or discussion group with a fixed number of weeks removes the fear of open-ended commitment.',
          '<strong>Then a service</strong> — once they know at least one other face in the room.',
        ],
        after: [
          'This is why an event like <a href="https://www.jesusfestival.ca" target="_blank" rel="noopener">Jesus Festival</a> is such a useful first rung: it is free, outdoors, family-friendly, and requires no religious literacy to enjoy. The <a href="https://www.jesusfestivalmovement.com" target="_blank" rel="noopener">movement behind it</a> exists precisely so that whole cities get an easy front door.',
        ],
      },
      {
        heading: 'How to word it',
        paragraphs: [
          'Three things make an invitation land: be specific, be casual, and give them a graceful way out.',
          '<strong>Specific.</strong> "You should come sometime" is not an invitation — it is a sentiment. "There is a thing on Saturday at two, I am going, would you like to come with me?" is an invitation.',
          '<strong>Casual.</strong> Say it the way you would invite someone to a barbecue, because the weight in your voice tells them how big a deal you think this is. If you sound nervous, they will assume there is something to be nervous about.',
          '<strong>Escapable.</strong> Add the line that removes the pressure: <em>"No stress at all if it is not your thing."</em> Counter-intuitively, people say yes more often when it is genuinely easy to say no.',
          'And go with them. "Come to my church" is a much bigger ask than "come with me." Offer the lift, meet them outside, sit with them, and plan what happens afterwards so they are not left standing alone in a room of strangers.',
        ],
      },
      {
        heading: 'When they say no',
        paragraphs: [
          'Say "no problem at all" and mean it. Then — and this is the part that matters — treat them exactly the same next week.',
          'If your warmth dips after a no, you have told them the friendship was conditional, and they will remember that far longer than the invitation. If nothing changes, you have told them something truer than any sermon: that you actually just like them.',
          'A no is also rarely permanent. It often means "not this week", "not that kind of thing", or "I am not ready to be seen doing that yet." Ask again in a few months, about something different.',
        ],
      },
      {
        heading: 'Who to ask first',
        paragraphs: [
          'Look at your <a href="/#builder">Oikos Map</a> and find the people already at the <strong>Care</strong> stage — the ones you have been praying for and have moved toward practically. Those relationships have enough trust in them to carry an invitation.',
          'Pick one. Choose the specific thing you will invite them to, and the day you will ask. Vague intentions do not survive a busy week; <a href="https://tasksimply.com" target="_blank" rel="noopener">put it in whatever you actually use to plan</a>, the way you would any other commitment.',
          'If your church does not currently have an obvious low-rung thing to invite people to, that is worth solving. <a href="https://www.loveontheworld.com" target="_blank" rel="noopener">Love on The World</a> helps groups create exactly that, and <a href="https://www.loveonhamilton.com" target="_blank" rel="noopener">Love on Hamilton</a> is a working example of a city where the invitations are easy to make.',
        ],
      },
    ],
    scripture: {
      text: '"Nazareth! Can anything good come from there?" Nathanael asked. "Come and see," said Philip.',
      ref: 'John 1:46',
    },
    network: ['JesusFestival.ca', 'JesusFestivalMovement.com', 'LoveonHamilton.com', 'LoveonTheWorld.com'],
    cta: { text: 'See who is ready to be asked', url: '/#builder' },
  },

  'what-to-say-when-someone-is-hurting': {
    intro: [
      'Someone on your map is about to go through something hard. A diagnosis, a redundancy, a marriage coming apart, a funeral. And when it happens, most of us go quiet — not because we do not care, but because we are terrified of saying the wrong thing.',
      'So here is the thing worth knowing before it happens: <strong>saying nothing is the one option guaranteed to hurt.</strong> Almost everything else can be repaired.',
    ],
    sections: [
      {
        heading: 'What people actually remember',
        paragraphs: [
          'Ask anyone who has been through grief what helped, and they rarely recall a sentence. They recall who turned up. The friend who sat with them. The neighbour who mowed the lawn without asking. The colleague who kept texting after everyone else stopped.',
          'They also remember who vanished. Usually those people were not unkind — they were waiting until they knew what to say, and the moment passed.',
          'This should be freeing. You are not being assessed on eloquence. You are being asked to be present.',
        ],
      },
      {
        heading: 'Sentences that help',
        paragraphs: ['When you genuinely do not know what to say, say one of these. They are short on purpose.'],
        list: [
          '<strong>"I am so sorry. I do not have words."</strong> Honest, and better than a borrowed platitude.',
          '<strong>"You do not have to talk. I just wanted to sit with you."</strong>',
          '<strong>"I am bringing dinner Thursday. Do you prefer chicken or pasta?"</strong> A decision, not an offer.',
          '<strong>"Tell me about them."</strong> To the bereaved, this is a gift. People are often desperate to say the name out loud.',
          '<strong>"I have been praying for you this week."</strong> Said plainly, almost never unwelcome.',
          '<strong>"I am still here."</strong> Sent in week six, when everyone else has moved on. This one carries the most weight of all.',
        ],
      },
      {
        heading: 'Sentences that hurt, however well meant',
        paragraphs: [
          'Most of these come from a good place. They land badly because they are trying to resolve the pain rather than share it.',
        ],
        list: [
          '<strong>"Everything happens for a reason."</strong> Asks them to justify their loss while they are still inside it.',
          '<strong>"God needed another angel."</strong> Not true, and it makes God the author of their worst day.',
          '<strong>"At least..."</strong> Nothing good has ever followed those two words in this context.',
          '<strong>"Let me know if you need anything."</strong> Kindly meant, but it hands the work to the person with the least capacity to do it.',
          '<strong>"I know exactly how you feel."</strong> You do not, and it quietly turns the conversation toward you.',
          '<strong>Rushing to a verse.</strong> Scripture is deeply comforting later. Deployed too early it can feel like being told to stop crying.',
        ],
        after: [
          'If you get one of these wrong — and you will — do not spiral about it. "I said that badly last week, I am sorry" repairs almost anything. Withdrawing out of embarrassment does far more damage than the original clumsiness.',
        ],
      },
      {
        heading: 'Be specific, and be there in six weeks',
        paragraphs: [
          'Crisis attracts a crowd for about a fortnight. Then the casseroles stop, the messages thin out, and the person is left alone with a life that has permanently changed. <strong>The most valuable thing you can do is be the person who shows up in week six.</strong>',
          'Put it in your calendar now — a reminder to check in a month from today. That is not cold or mechanical; it is the only reliable way to beat the natural fade of attention.',
          'And be concrete. Do the specific thing: the lift to the appointment, the school run, the paperwork nobody has energy for. When care is organised rather than improvised it reaches further, which is the whole idea behind <a href="https://www.kingdomresponse.com" target="_blank" rel="noopener">Kingdom Response</a> — churches showing up practically when disaster hits — and <a href="https://www.loveonhamilton.com" target="_blank" rel="noopener">Love on Hamilton</a> at a city scale.',
        ],
      },
      {
        heading: 'On praying with them',
        paragraphs: [
          'Ask first: <em>"Would it be alright if I prayed for you?"</em> Almost everyone says yes, including people with no faith at all. And if they say no, respect it instantly and warmly — that is its own act of love.',
          'Keep it short and plain. Name what is actually happening rather than smoothing it over. You are not performing; you are carrying someone to God who has not the strength to walk there themselves.',
          'Then keep praying for them by name afterwards. On your <a href="/#builder">Oikos Map</a>, put what they are facing in the notes beside their name so you remember to ask about the specific thing next time. Remembering the details is love made visible — and <a href="https://www.kd-ziedins.com" target="_blank" rel="noopener">Daniel and Katie</a> write about learning this in the middle of everyday family life.',
        ],
      },
    ],
    scripture: {
      text: 'Rejoice with those who rejoice; mourn with those who mourn.',
      ref: 'Romans 12:15',
    },
    network: ['KingdomResponse.com', 'LoveonHamilton.com', 'KD-Ziedins.com', 'LoveonTheWorld.com'],
    cta: { text: 'Note what they are facing', url: '/#builder' },
  },

  'how-to-disciple-someone': {
    intro: [
      'Someone asks you a real question about faith, or starts coming to church, or actually wants to read the Bible with you. And the first thing most of us feel is not joy. It is panic: <em>I am not qualified for this.</em>',
      'Almost everyone who has ever discipled anyone felt that at the time. It is not a disqualification. It is the normal starting condition.',
    ],
    sections: [
      {
        heading: 'The bar is lower than you think',
        paragraphs: [
          'Discipling someone does not mean having answers to everything. It means being about a step ahead, walking in the same direction, and being honest about the parts you are still working out.',
          'Paul tells Timothy to entrust what he has heard to reliable people who will teach others. Note what is being passed on: not credentials, not expertise — <strong>what you have received</strong>. You can only give what you have, and what you have is enough to start.',
          'In practice the qualification is character, not knowledge. Are you actually following Jesus? Will you show up consistently? Will you admit when you do not know? That is the list.',
        ],
      },
      {
        heading: 'A pattern you can repeat',
        paragraphs: [
          'You do not need a curriculum. You need a rhythm simple enough that you will still be doing it in six months. This one works for a coffee shop, a lunch break, or a phone call:',
        ],
        list: [
          '<strong>Catch up honestly.</strong> Ten minutes. How is life actually going? Do not skip this to get to the "real" content — this is where trust is built.',
          '<strong>Read a short passage together.</strong> Out loud. A few paragraphs, not a chapter. A Gospel is the right place to start.',
          '<strong>Ask: what stands out?</strong> Let them answer first. Resist the urge to teach. Their own observation will stick a hundred times harder than your explanation.',
          '<strong>Ask: what will you do about it?</strong> This is the question that turns a Bible study into discipleship. Something small and specific, this week.',
          '<strong>Ask: who could you tell?</strong> Not pressure — just the habit of passing it on from the very beginning.',
          '<strong>Pray for each other.</strong> Both directions. Being prayed for by the person you are discipling changes the relationship for the better.',
        ],
        after: [
          'That is the whole thing. Forty minutes. If you did only that, every fortnight, for a year, you would have done something most people never receive.',
        ],
      },
      {
        heading: 'What to do when you do not know',
        paragraphs: [
          'They will ask something you cannot answer. Suffering, hell, a hard passage, why the Church has behaved badly.',
          'Say so. <em>"I do not know. Let us find out."</em> Then actually find out — ask your pastor, read something solid, come back the next time with what you learned.',
          'Two things happen when you do this. They get the answer, and they learn what an honest follower of Jesus does with a hard question. The second lesson outlasts the first.',
          'What you must not do is bluff. People can tell, and a bluff quietly teaches them that faith requires pretending.',
        ],
      },
      {
        heading: 'Boundaries that keep it healthy',
        paragraphs: [],
        list: [
          '<strong>Disciple your own sex,</strong> particularly one to one. This protects everyone and removes a whole category of complication.',
          '<strong>You are not their counsellor.</strong> If something serious surfaces — abuse, addiction, self-harm — care for them and help them to a professional. Discipleship is not therapy.',
          '<strong>You are not their saviour.</strong> You cannot make anyone grow. One plants, another waters, God gives the growth.',
          '<strong>Let it end well.</strong> Not every pairing lasts forever. A season that ends cleanly is a success, not a failure.',
        ],
      },
      {
        heading: 'Aim past the person in front of you',
        paragraphs: [
          'Here is the shift that changes everything: you are not discipling someone so that they become a well-taught Christian. You are discipling them so that they can do this for someone else.',
          'So say that out loud, early. <em>"At some point you are going to do this with someone, and that is the point."</em> It reframes everything they learn — they start listening as someone who will pass it on, not just someone receiving.',
          'Then ask the question this whole site is built around: <em>who is in your oikos?</em> Help them make their own <a href="/#builder">Oikos Map</a>. The moment they start praying for their own five names, the thing has multiplied beyond you.',
          'If you are doing this with more than a couple of people, keeping track gets hard — <a href="https://kingdombase.app" target="_blank" rel="noopener">Kingdom Base</a> is built for exactly that, and <a href="https://www.loveontheworld.com" target="_blank" rel="noopener">Love on The World</a> helps a whole group start together rather than alone.',
        ],
      },
    ],
    scripture: {
      text: 'And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others.',
      ref: '2 Timothy 2:2',
    },
    network: ['KingdomBase.App', 'LoveonTheWorld.com', 'IAmReborn.net'],
    cta: { text: 'Help them map their oikos', url: '/#builder' },
  },

  'praying-for-your-city': {
    intro: [
      'Praying for your city can feel like praying for the weather — enormous, vague, and impossible to tell whether anything happened.',
      'But a city is not an abstraction. It is a number of streets, and on each of them people are having the hardest week of their lives. Here is how to pray for a place in a way that stays concrete enough to keep doing.',
    ],
    sections: [
      {
        heading: 'Start with the ground you actually touch',
        paragraphs: [
          'Your <a href="/#builder">Oikos Map</a> is the first circle. Your street is the second. Before praying for a whole city, pray for the part of it you can see from your front door.',
          'Walk it, if you can. Not a march, not anything anyone would notice — just a walk, praying quietly for the houses you pass. It is remarkable how differently you see a street you have prayed down.',
          'You will start noticing things: the house that is always dark, the neighbour whose car has not moved, the family that arrived last month. Prayer turns scenery into people.',
        ],
      },
      {
        heading: 'Pray for the places, not just the population',
        paragraphs: ['A city runs on institutions, and each is full of people under real pressure:'],
        list: [
          '<strong>Schools</strong> — teachers who are exhausted, kids carrying things nobody knows about.',
          '<strong>Hospitals</strong> — staff making decisions on no sleep, families in the worst hour of their lives.',
          '<strong>Emergency services</strong> — people who see what the rest of us are spared.',
          '<strong>Local government</strong> — whether you like them or not; Scripture is direct about praying for those in authority.',
          '<strong>Businesses</strong> — owners deciding whether they can keep staff on.',
          '<strong>Churches</strong> — all of them, not only yours. A city is not reached by one congregation.',
        ],
        after: [
          'Pick one a day and you have a week. That is a sustainable rhythm, and it is far more concrete than "Lord, bless our city."',
        ],
      },
      {
        heading: 'Pray for peace, and then be part of the answer',
        paragraphs: [
          'Jeremiah tells exiles to seek the peace and prosperity of the city they did not choose, and to pray for it — <em>because if it prospers, you prosper</em>. Their wellbeing and the city\'s were tied together.',
          'That has a sharp edge. Praying for a city you refuse to be inconvenienced by is not really prayer; it is commentary. The prayer and the presence belong together.',
          'So let the prayer produce something. Learn the name of someone at the shop. Show up to the community thing. Give to the food bank you have been praying about. <a href="https://www.loveonhamilton.com" target="_blank" rel="noopener">Love on Hamilton</a> is what this looks like when churches do it together on purpose, and <a href="https://www.kingdomresponse.com" target="_blank" rel="noopener">Kingdom Response</a> is the same instinct when crisis hits.',
        ],
      },
      {
        heading: 'Do it with other people',
        paragraphs: [
          'City-sized prayer is hard to sustain alone, and it was never meant to be. Find two or three others. Walk together. Pray the same streets.',
          'If you want something structured, <a href="https://www.loveontheworld.com" target="_blank" rel="noopener">Love on The World</a> exists to help a few friends start praying for and loving their city together, and the <a href="https://www.jesusfestival.app" target="_blank" rel="noopener">Jesus Festival app</a> has a live prayer wall where a whole community carries requests between them.',
          'And keep the long view. Cities do not change on a quarterly timeline. One plants, another waters, God gives the growth — and some of the answers will be gathered in by people who come after you.',
        ],
      },
    ],
    scripture: {
      text: 'Seek the peace and prosperity of the city to which I have carried you… Pray to the Lord for it, because if it prospers, you too will prosper.',
      ref: 'Jeremiah 29:7',
    },
    network: ['LoveonHamilton.com', 'KingdomResponse.com', 'LoveonTheWorld.com', 'JesusFestival.app'],
    cta: { text: 'Start with your own street', url: '/#builder' },
  },

};

export const posts = postsMeta.map((meta) => ({ ...meta, ...bodies[meta.slug] }));

export const sortedPosts = sortedPostsMeta.map((meta) => ({ ...meta, ...bodies[meta.slug] }));

export function postBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}
