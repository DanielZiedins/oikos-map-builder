import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  Clipboard,
  CirclePlus,
  Copy,
  Crown,
  Download,
  FileJson,
  FileText,
  Flame,
  Globe2,
  HeartHandshake,
  Link2,
  Mail,
  Map,
  Plus,
  RotateCcw,
  Rocket,
  Save,
  Search,
  Share2,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
} from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'love-on-the-world-oikos-map-v1';

const partnerLinks = [
  { label: 'Love on The World', href: 'https://www.loveontheworld.com' },
  { label: 'Thy Kingdom Network', href: 'https://www.thykingdom.net' },
];

const collaborationLink = {
  label: 'e3 Canada',
  href: 'https://e3ministry.ca/staff/katie-daniel-ziedins',
};

const adLeadOptions = [
  'Send me the Oikos starter kit',
  'I want to start an outreach group',
  'I want to impact culture with faith',
  'I want to follow Jesus',
  'I want personal growth and community',
];

const missionStats = [
  {
    value: '2.3B',
    label: 'without Gospel access',
    note: 'Estimated unreached, according to the Love on Mission dashboard.',
  },
  {
    value: '4,490',
    label: 'unreached people groups',
    note: '43.1% of all people groups are listed as unreached.',
  },
  {
    value: '3,214',
    label: 'frontier people groups',
    note: 'Fewer than 1 in 1,000 follow Christ in these groups.',
  },
  {
    value: '69%',
    label: 'of Christians in the Global South',
    note: 'The mission force is global, local, and multiplying.',
  },
];

const groups = [
  { id: 'family', label: 'Family', color: '#f45d48' },
  { id: 'friends', label: 'Friends', color: '#14b8a6' },
  { id: 'work', label: 'Work', color: '#f59e0b' },
  { id: 'school', label: 'School', color: '#516cf0' },
  { id: 'neighbors', label: 'Neighbors', color: '#8b5cf6' },
];

const stages = [
  { id: 'pray', label: 'Pray', prompt: 'Pray by name and ask God for an open door.' },
  { id: 'care', label: 'Care', prompt: 'Send a message, serve a need, or make space to listen.' },
  { id: 'share', label: 'Share', prompt: 'Share your testimony or a simple Gospel invitation.' },
  { id: 'disciple', label: 'Disciple', prompt: 'Read Scripture together and help them reach their own oikos.' },
];

const starterPeople = [
  {
    id: crypto.randomUUID(),
    name: 'Aunt Maria',
    group: 'family',
    stage: 'pray',
    notes: 'Pray for peace and an open door.',
    parentId: null,
  },
  {
    id: crypto.randomUUID(),
    name: 'Jordan',
    group: 'friends',
    stage: 'care',
    notes: 'Invite for coffee this week.',
    parentId: null,
  },
  {
    id: crypto.randomUUID(),
    name: 'Sam',
    group: 'work',
    stage: 'share',
    notes: 'Share a short hope story.',
    parentId: null,
  },
  {
    id: crypto.randomUUID(),
    name: 'Leah',
    group: 'neighbors',
    stage: 'pray',
    notes: '',
    parentId: null,
  },
  {
    id: crypto.randomUUID(),
    name: 'Mason',
    group: 'school',
    stage: 'pray',
    notes: '',
    parentId: null,
  },
];

const initialMap = {
  centerName: 'Your Name',
  mapTitle: 'My Oikos Map',
  people: starterPeople,
};

function readStoredMap() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredMap(mapData) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mapData));
    return true;
  } catch {
    return false;
  }
}

function loadSavedMap() {
  try {
    const raw = readStoredMap();
    return raw ? JSON.parse(raw) : initialMap;
  } catch {
    return initialMap;
  }
}

function getGroup(groupId) {
  return groups.find((group) => group.id === groupId) || groups[0];
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

async function copyText(value) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fall back for browsers that expose clipboard but deny writes.
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  return copied;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'oikos-map';
}

function truncateLabel(value, limit = 16) {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1).trim()}...`;
}

function getStage(stageId) {
  return stages.find((stage) => stage.id === stageId) || stages[0];
}

function getDescendantIds(people, id) {
  const descendants = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    people.forEach((person) => {
      if (person.parentId && descendants.has(person.parentId) && !descendants.has(person.id)) {
        descendants.add(person.id);
        changed = true;
      }
    });
  }
  return descendants;
}

function createFreshMap(blank = false) {
  return {
    ...initialMap,
    people: blank ? [] : initialMap.people.map((person) => ({ ...person, id: crypto.randomUUID() })),
  };
}

function buildPrayerPlan(mapData) {
  const roots = mapData.people.filter((person) => !person.parentId);
  const childrenByParent = mapData.people.reduce((acc, person) => {
    if (person.parentId) {
      acc[person.parentId] = acc[person.parentId] || [];
      acc[person.parentId].push(person);
    }
    return acc;
  }, {});

  const lines = [
    mapData.mapTitle,
    `Center: ${mapData.centerName}`,
    '',
    'Prayer plan',
    '-----------',
  ];

  if (!mapData.people.length) {
    lines.push('Add names to begin your Oikos Map.');
  }

  roots.forEach((person, index) => {
    lines.push(`${index + 1}. ${person.name} | ${getGroup(person.group).label} | ${getStage(person.stage).label}`);
    lines.push(`   Next step: ${getStage(person.stage).prompt}`);
    if (person.notes) lines.push(`   Notes: ${person.notes}`);
    (childrenByParent[person.id] || []).forEach((child) => {
      lines.push(`   - ${child.name} | ${getGroup(child.group).label} | ${getStage(child.stage).label}`);
      if (child.notes) lines.push(`     Notes: ${child.notes}`);
    });
    lines.push('');
  });

  lines.push('Powered by Love on The World & Thy Kingdom Network');
  lines.push('https://www.loveontheworld.com');
  lines.push('https://www.thykingdom.net');
  return lines.join('\n');
}

function PoweredBy() {
  return (
    <>
      Powered by:{' '}
      {partnerLinks.map((partner, index) => (
        <React.Fragment key={partner.href}>
          <a href={partner.href} target="_blank" rel="noreferrer">
            {partner.label}
          </a>
          {index === 0 ? ' & ' : ''}
        </React.Fragment>
      ))}
    </>
  );
}

function CollaborationCredit() {
  return (
    <>
      In collaboration with{' '}
      <a href={collaborationLink.href} target="_blank" rel="noreferrer">
        {collaborationLink.label}
      </a>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer" id="partners">
      <div className="footer-links">
        <span>
          Made with ❤️ by{' '}
          <a href="https://www.danielziedins.com" target="_blank" rel="noreferrer">
            Daniel Ziedins
          </a>
        </span>
        <span><PoweredBy /></span>
        <span><CollaborationCredit /></span>
      </div>
      <p className="footer-disclaimer">
        Disclaimer: Daniel did not create the original Oikos Map tool. His heart is to share this powerful resource with
        the world, honor the ministries carrying it, and help more people use it to pray, love, and reach their oikos. We
        pray it blesses you, and we would be grateful if you shared it with everyone you know.
      </p>
    </footer>
  );
}

function LeadCapture({ compact = false }) {
  const [lead, setLead] = useState({
    name: '',
    email: '',
    interest: adLeadOptions[0],
  });
  const [status, setStatus] = useState('idle');

  async function submitLead(event) {
    event.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lead,
          page: window.location.pathname,
          source: 'oikos-map-builder',
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to send');
      setStatus('sent');
      setLead({ name: '', email: '', interest: adLeadOptions[0] });
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className={compact ? 'lead-form compact-form' : 'lead-form'} onSubmit={submitLead}>
      <div>
        <p className="form-kicker">Free follow-up resources</p>
        <h3>{compact ? 'Join the Reborn community path.' : 'Get the free Oikos starter kit.'}</h3>
        <p>
          Leave your email and we will send encouragement, outreach steps, and simple ways to live on mission right where
          God has placed you.
        </p>
      </div>
      <label>
        Name
        <input
          value={lead.name}
          onChange={(event) => {
            setStatus('idle');
            setLead((current) => ({ ...current, name: event.target.value }));
          }}
          placeholder="Your name"
        />
      </label>
      <label>
        Email
        <input
          type="email"
          required
          value={lead.email}
          onChange={(event) => {
            setStatus('idle');
            setLead((current) => ({ ...current, email: event.target.value }));
          }}
          placeholder="you@example.com"
        />
      </label>
      <label>
        What are you interested in?
        <select
          value={lead.interest}
          onChange={(event) => {
            setStatus('idle');
            setLead((current) => ({ ...current, interest: event.target.value }));
          }}
        >
          {adLeadOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={status === 'sending'}>
        <Mail size={18} aria-hidden="true" />
        {status === 'sending' ? 'Sending...' : 'Send me the resources'}
      </button>
      <div aria-live="polite">
        {status === 'sent' && <p className="form-status success">You are in. Check your inbox soon.</p>}
        {status === 'error' && (
          <p className="form-status error">
            This form is ready, but the GoHighLevel webhook still needs to be connected in Vercel.
          </p>
        )}
      </div>
    </form>
  );
}

function GrowthPage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Oikos Map Builder home">
          <span className="brand-mark">
            <Map size={20} aria-hidden="true" />
          </span>
          <span>Oikos Map Builder</span>
        </a>
        <nav aria-label="Growth navigation">
          <a href="/">Map Builder</a>
          <a href="/connect">Connect</a>
          <a href="#growth-community">Community</a>
          <a href="https://www.iamreborn.net" target="_blank" rel="noreferrer">
            I Am Reborn
          </a>
        </nav>
      </header>

      <section className="growth-hero">
        <div>
          <p className="eyebrow">
            <Rocket size={18} aria-hidden="true" />
            Spirit, mind, body, purpose
          </p>
          <h1>
            <span>Become the kind</span>
            <span>of person who can</span>
            <span>carry the mission.</span>
          </h1>
          <p className="hero-lede">
            Personal growth is not self-glory. It is stewardship. As God forms your character, renews your mind,
            strengthens your body, and clarifies your purpose, your life becomes a brighter witness for Jesus.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#growth-community">
              <Sparkles size={18} aria-hidden="true" />
              Join the community
            </a>
            <a className="secondary-action" href="https://www.iamreborn.net" target="_blank" rel="noreferrer">
              <ArrowRight size={18} aria-hidden="true" />
              Visit IAmReborn.net
            </a>
          </div>
        </div>
      </section>

      <section className="growth-grid" aria-label="Growth areas">
        {[
          ['Spirit', 'Abide in Jesus, learn to hear His voice, and live from intimacy instead of striving.'],
          ['Mind', 'Renew your thoughts, break agreement with lies, and build faith-filled focus.'],
          ['Body', 'Treat health, energy, and discipline as stewardship for the assignment.'],
          ['Purpose', 'Bring your gifts, work, family, and influence under the Lordship of Jesus.'],
        ].map(([title, body]) => (
          <article key={title}>
            <span>{title}</span>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="community-section" id="growth-community">
        <div>
          <p className="section-kicker">Do not grow alone</p>
          <h2>Join a community of people becoming whole for God's glory.</h2>
          <p>
            I Am Reborn points people toward total Kingdom transformation: spirit, mind, body, and purpose. The goal is
            not perfectionism. It is a surrendered life that bears fruit.
          </p>
        </div>
        <LeadCapture compact />
      </section>

      <SiteFooter />
    </main>
  );
}

function ConnectPage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Oikos Map Builder home">
          <span className="brand-mark">
            <Map size={20} aria-hidden="true" />
          </span>
          <span>Oikos Map Builder</span>
        </a>
        <nav aria-label="Connect navigation">
          <a href="/">Map Builder</a>
          <a href="/growth">Growth</a>
          <a href="#kingdom-connect">Communities</a>
          <a href="#founder">Founder</a>
        </nav>
      </header>

      <section className="connect-hero">
        <div>
          <p className="eyebrow">
            <HeartHandshake size={18} aria-hidden="true" />
            Connect beyond the map
          </p>
          <h1>
            <span>Find people</span>
            <span>running toward</span>
            <span>the Kingdom.</span>
          </h1>
          <p className="hero-lede">
            The Oikos Map is a beginning. Community helps you keep going with encouragement, prayer, discipleship, and
            people who want to see Jesus glorified in every sphere of life.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="https://kingdom-connect.net/" target="_blank" rel="noreferrer">
              <Globe2 size={18} aria-hidden="true" />
              Join Kingdom Connect
            </a>
            <a className="secondary-action" href={collaborationLink.href} target="_blank" rel="noreferrer">
              <ArrowRight size={18} aria-hidden="true" />
              e3 Canada collaboration
            </a>
          </div>
          <p className="powered"><CollaborationCredit /></p>
        </div>
      </section>

      <section className="connect-grid" id="kingdom-connect" aria-label="Ways to connect">
        <article>
          <Globe2 size={28} aria-hidden="true" />
          <h2>Kingdom Connect</h2>
          <p>
            Connect more deeply with online Kingdom communities, find encouragement, and keep growing with people who
            care about prayer, mission, discipleship, culture, and Jesus.
          </p>
          <a href="https://kingdom-connect.net/" target="_blank" rel="noreferrer">
            Visit Kingdom Connect <ArrowRight size={16} aria-hidden="true" />
          </a>
        </article>
        <article>
          <HeartHandshake size={28} aria-hidden="true" />
          <h2>e3 Canada</h2>
          <p>
            Daniel and Katie Ziedins serve with e3 Canada, a ministry that equips God's people to evangelize and
            establish His Church. This site is shared in collaboration with e3 Canada so more people can access a
            practical tool for prayer, outreach, and disciple-making.
          </p>
          <a href={collaborationLink.href} target="_blank" rel="noreferrer">
            Visit Daniel & Katie's e3 page <ArrowRight size={16} aria-hidden="true" />
          </a>
        </article>
      </section>

      <section className="founder-section" id="founder" aria-labelledby="founder-title">
        <div className="founder-image-wrap">
          <img
            src="/assets/daniel-ziedins-founder.jpg"
            alt="Daniel Ziedins"
            width="920"
            height="920"
            loading="lazy"
          />
        </div>
        <div>
          <p className="section-kicker">
            <UserRound size={18} aria-hidden="true" />
            Connect with the founder
          </p>
          <h2 id="founder-title">Daniel Ziedins</h2>
          <p>
            Daniel's heart is simple: make helpful Kingdom tools easy to access, easy to share, and free for people who
            want to love their world with Jesus. He does not take credit for creating the original Oikos Map. He wants to
            honor the ministries carrying it and help this powerful tool reach as many believers, churches, youth groups,
            and disciple-makers as possible.
          </p>
          <p>
            Daniel and his wife Katie work with e3 Canada and carry a deep desire to see people encounter Jesus, grow in
            faith, and live on mission in everyday life. Their prayer is that tools like this would serve the Church,
            strengthen everyday believers, and make outreach feel clear, relational, and full of love.
          </p>
          <div className="founder-actions">
            <a className="primary-action" href="https://www.danielziedins.com" target="_blank" rel="noreferrer">
              <UserRound size={18} aria-hidden="true" />
              DanielZiedins.com
            </a>
            <a className="secondary-action" href="https://www.kd-ziedins.com" target="_blank" rel="noreferrer">
              <HeartHandshake size={18} aria-hidden="true" />
              KD-Ziedins.com
            </a>
          </div>
        </div>
      </section>

      <section className="lead-section connect-lead" aria-labelledby="connect-resources-title">
        <div>
          <p className="section-kicker">
            <Mail size={18} aria-hidden="true" />
            Stay connected
          </p>
          <h2 id="connect-resources-title">Get encouragement and next steps for mission.</h2>
        </div>
        <LeadCapture />
      </section>

      <SiteFooter />
    </main>
  );
}

function computeLayout(people) {
  const width = 1100;
  const height = 820;
  const center = { x: width / 2, y: height / 2 };
  const roots = people.filter((person) => !person.parentId);
  const childrenByParent = people.reduce((acc, person) => {
    if (person.parentId) {
      acc[person.parentId] = acc[person.parentId] || [];
      acc[person.parentId].push(person);
    }
    return acc;
  }, {});

  const positions = {};
  roots.forEach((person, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / Math.max(roots.length, 1);
    const radius = roots.length > 7 ? 286 : 248;
    const parentPosition = {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
      angle,
    };
    positions[person.id] = parentPosition;

    const children = childrenByParent[person.id] || [];
    children.forEach((child, childIndex) => {
      const spread = Math.min(0.7, 0.22 * Math.max(children.length - 1, 1));
      const childAngle =
        angle - spread / 2 + (children.length === 1 ? 0 : (childIndex * spread) / (children.length - 1));
      positions[child.id] = {
        x: parentPosition.x + Math.cos(childAngle) * 158,
        y: parentPosition.y + Math.sin(childAngle) * 158,
        angle: childAngle,
      };
    });
  });

  return { width, height, center, positions, childrenByParent };
}

function App() {
  const [mapData, setMapData] = useState(loadSavedMap);
  const [selectedId, setSelectedId] = useState(mapData.people[0]?.id ?? null);
  const [saveState, setSaveState] = useState('Saved locally');
  const [searchTerm, setSearchTerm] = useState('');
  const [shareState, setShareState] = useState('Share');
  const fileInputRef = useRef(null);
  const svgRef = useRef(null);

  const layout = useMemo(() => computeLayout(mapData.people), [mapData.people]);
  const selectedPerson = mapData.people.find((person) => person.id === selectedId) || null;
  const selectedStage = selectedPerson ? getStage(selectedPerson.stage) : null;
  const filteredPeople = mapData.people.filter((person) =>
    `${person.name} ${getGroup(person.group).label} ${getStage(person.stage).label}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSaveState(writeStoredMap(mapData) ? 'Saved locally' : 'Download to keep');
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [mapData]);

  function updateMap(partial) {
    setSaveState('Saving...');
    setMapData((current) => ({ ...current, ...partial }));
  }

  function updatePerson(id, updates) {
    setSaveState('Saving...');
    setMapData((current) => ({
      ...current,
      people: current.people.map((person) => {
        if (person.id !== id) return person;
        const nextParentId = updates.parentId;
        const descendants = nextParentId ? getDescendantIds(current.people, id) : null;
        return {
          ...person,
          ...updates,
          parentId: descendants?.has(nextParentId) ? null : nextParentId,
        };
      }),
    }));
  }

  function addPerson(parentId = null) {
    const newPerson = {
      id: crypto.randomUUID(),
      name: parentId ? 'New connection' : 'New person',
      group: selectedPerson?.group || 'friends',
      stage: 'pray',
      notes: '',
      parentId,
    };

    setSaveState('Saving...');
    setMapData((current) => ({ ...current, people: [...current.people, newPerson] }));
    setSelectedId(newPerson.id);
  }

  function deletePerson(id) {
    const descendants = getDescendantIds(mapData.people, id);
    const remaining = mapData.people.filter((person) => !descendants.has(person.id));
    setMapData((current) => ({ ...current, people: remaining }));
    setSelectedId(remaining[0]?.id ?? null);
    setSaveState('Saved locally');
  }

  function resetMap(blank = false) {
    const fresh = createFreshMap(blank);
    setMapData(fresh);
    setSelectedId(fresh.people[0]?.id ?? null);
    setSaveState('Saved locally');
  }

  function saveNow() {
    setSaveState(writeStoredMap(mapData) ? 'Saved locally' : 'Download to keep');
  }

  function downloadJson() {
    downloadBlob(
      new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' }),
      `${slugify(mapData.mapTitle)}.json`,
    );
  }

  function downloadPrayerPlan() {
    downloadBlob(new Blob([buildPrayerPlan(mapData)], { type: 'text/plain;charset=utf-8' }), `${slugify(mapData.mapTitle)}-prayer-plan.txt`);
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result));
        if (!Array.isArray(imported.people)) throw new Error('Invalid map file');
        const people = imported.people.map((person) => ({
          id: person.id || crypto.randomUUID(),
          name: person.name || 'Unnamed person',
          group: groups.some((group) => group.id === person.group) ? person.group : 'friends',
          stage: stages.some((stage) => stage.id === person.stage) ? person.stage : 'pray',
          notes: person.notes || '',
          parentId: person.parentId || null,
        }));
        const importedMap = {
          centerName: imported.centerName || 'Your Name',
          mapTitle: imported.mapTitle || 'My Oikos Map',
          people,
        };
        setMapData(importedMap);
        setSelectedId(people[0]?.id ?? null);
        setSaveState('Imported');
      } catch {
        setSaveState('Import failed');
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  async function shareTool() {
    const shareData = {
      title: 'Free Oikos Map Builder',
      text: 'Create a free Oikos Map and pray intentionally for the people God has placed around you.',
      url: 'https://oikos-map-builder.vercel.app',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareState('Shared');
      } else {
        setShareState((await copyText(shareData.url)) ? 'Copied' : 'Copy failed');
      }
    } catch {
      setShareState('Share');
    }
    window.setTimeout(() => setShareState('Share'), 1800);
  }

  function getSvgMarkup() {
    const svg = svgRef.current.cloneNode(true);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', layout.width);
    svg.setAttribute('height', layout.height);
    return new XMLSerializer().serializeToString(svg);
  }

  function downloadSvg() {
    downloadBlob(new Blob([getSvgMarkup()], { type: 'image/svg+xml;charset=utf-8' }), `${slugify(mapData.mapTitle)}.svg`);
  }

  function downloadPng() {
    const svgMarkup = getSvgMarkup();
    const image = new Image();
    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = layout.width * 2;
      canvas.height = layout.height * 2;
      const context = canvas.getContext('2d');
      context.fillStyle = '#fffaf3';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.scale(2, 2);
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, `${slugify(mapData.mapTitle)}.png`);
      }, 'image/png');
    };

    image.src = url;
  }

  const rootCount = mapData.people.filter((person) => !person.parentId).length;
  const secondDegreeCount = mapData.people.length - rootCount;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Oikos Map Builder home">
          <span className="brand-mark">
            <Map size={20} aria-hidden="true" />
          </span>
          <span>Oikos Map Builder</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#vision">Vision</a>
          <a href="#mission">Why it matters</a>
          <a href="#next-steps">Next steps</a>
          <a href="#builder">Create</a>
          <a href="/growth">Growth</a>
          <a href="/connect">Connect</a>
          <a href="#partners">Partners</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <HeartHandshake size={18} aria-hidden="true" />
            Free for every believer, church, youth ministry, and disciple-maker
          </p>
          <h1>
            <span>See the people</span>
            <span>God has placed</span>
            <span>around you.</span>
          </h1>
          <p className="hero-lede">
            Build a simple, prayerful Oikos Map that turns names into intentional love, conversations, and disciple-making
            vision.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#builder">
              <Sparkles size={18} aria-hidden="true" />
              Create your map
            </a>
            <a className="secondary-action" href="#vision">
              <ArrowDownToLine size={18} aria-hidden="true" />
              Read the heart
            </a>
          </div>
          <p className="powered">
            <PoweredBy /> · <CollaborationCredit />
          </p>
        </div>

        <div className="hero-visual" aria-label="Example Oikos Map preview">
          <div className="mini-map">
            <div className="mini-node mini-center">You</div>
            {['Family', 'Friend', 'Neighbor', 'Coworker', 'Classmate'].map((label, index) => (
              <div className={`mini-node mini-${index + 1}`} key={label}>
                {label}
              </div>
            ))}
            <span className="mini-line line-1" />
            <span className="mini-line line-2" />
            <span className="mini-line line-3" />
            <span className="mini-line line-4" />
            <span className="mini-line line-5" />
          </div>
        </div>
      </section>

      <section className="vision" id="vision" aria-labelledby="vision-title">
        <div>
          <p className="section-kicker">The heart</p>
          <h2 id="vision-title">An Oikos Map helps love become specific.</h2>
        </div>
        <div className="vision-grid">
          <article>
            <span>01</span>
            <h3>Name your household</h3>
            <p>
              Oikos means household: the family, friends, classmates, coworkers, neighbors, and teammates already within
              your sphere of influence.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Pray with intention</h3>
            <p>
              When the names are visible, prayer becomes personal. You can notice open doors, follow up faithfully, and
              carry people before God by name.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>See multiplication</h3>
            <p>
              Each person has their own relationships. A map reveals how one transformed life can become a branching
              movement of hope.
            </p>
          </article>
        </div>
      </section>

      <section className="mission-pulse" id="mission" aria-labelledby="mission-title">
        <div className="mission-copy">
          <p className="section-kicker">
            <Globe2 size={18} aria-hidden="true" />
            Why this matters
          </p>
          <h2 id="mission-title">A name on your map can become an encounter.</h2>
          <p>
            Love on Mission says the Gospel is spreading, but the mission is still unfinished. Jesus' heart is that no
            one perish, and an Oikos Map helps ordinary believers turn compassion into prayer, friendship, testimony,
            and discipleship.
          </p>
          <a className="secondary-action" href="https://www.loveonmission.world/" target="_blank" rel="noreferrer">
            <ArrowDownToLine size={18} aria-hidden="true" />
            View Love on Mission
          </a>
        </div>
        <div className="mission-stats">
          {missionStats.map((stat) => (
            <article key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <p>{stat.note}</p>
            </article>
          ))}
          <a className="stat-source" href="https://www.loveonmission.world/" target="_blank" rel="noreferrer">
            Stats via Love on Mission dashboard
          </a>
        </div>
      </section>

      <section className="next-steps" id="next-steps" aria-labelledby="next-steps-title">
        <div className="next-steps-heading">
          <p className="section-kicker">
            <Flame size={18} aria-hidden="true" />
            Take the next step
          </p>
          <h2 id="next-steps-title">Do not just map your oikos. Move toward them in love.</h2>
        </div>
        <div className="next-step-grid">
          <article>
            <Rocket size={28} aria-hidden="true" />
            <h3>Start an outreach group</h3>
            <p>
              Love on The World exists to help believers live on mission, reach their cities, and multiply disciples.
              Gather a few friends, pray over your map, and begin loving your city together.
            </p>
            <a href="https://www.loveontheworld.com" target="_blank" rel="noreferrer">
              Start at LoveonTheWorld.com <ArrowRight size={16} aria-hidden="true" />
            </a>
          </article>
          <article>
            <Crown size={28} aria-hidden="true" />
            <h3>Impact culture with faith</h3>
            <p>
              Your oikos includes workplaces, classrooms, art, media, family, business, and civic life. Seek First World
              exists to call believers to seek the Kingdom first and help culture reflect God's glory.
            </p>
            <a href="https://www.seekfirst.world" target="_blank" rel="noreferrer">
              Explore SeekFirst.World <ArrowRight size={16} aria-hidden="true" />
            </a>
          </article>
          <article>
            <BookOpen size={28} aria-hidden="true" />
            <h3>Grow for God's glory</h3>
            <p>
              Personal growth strengthens the messenger. Build your spirit, mind, body, and purpose so your life carries
              the love, discipline, and clarity of Jesus into every room you enter.
            </p>
            <a href="/growth">
              Visit the growth page <ArrowRight size={16} aria-hidden="true" />
            </a>
          </article>
          <article>
            <Globe2 size={28} aria-hidden="true" />
            <h3>Connect in community</h3>
            <p>
              Mission grows stronger in community. Join Kingdom Connect to find encouragement, online community, and
              people who want to follow Jesus with courage and love.
            </p>
            <a href="/connect">
              Visit the connect page <ArrowRight size={16} aria-hidden="true" />
            </a>
          </article>
        </div>
      </section>

      <section className="jesus-section" id="jesus" aria-labelledby="jesus-title">
        <div>
          <p className="section-kicker">New to Jesus?</p>
          <h2 id="jesus-title">Following Jesus starts with surrender, trust, and a new life.</h2>
          <p>
            Jesus is not only a teacher or moral example. He is the Son of God, the Savior who died for our sins and
            rose again. To follow Him means turning from sin, trusting His grace, receiving His forgiveness, and learning
            to live with Him as Lord.
          </p>
          <p>
            You can begin right now: “Jesus, I believe You died and rose again. Forgive me, lead me, and make me new. I
            surrender my life to You.”
          </p>
        </div>
        <div className="jesus-card">
          <span>Simple next steps</span>
          <ul>
            <li>Talk to Jesus honestly in prayer.</li>
            <li>Read the Gospel of John and ask Him to reveal Himself.</li>
            <li>Tell a Jesus-following friend or pastor about your decision.</li>
            <li>Join a healthy local church and get baptized.</li>
          </ul>
        </div>
      </section>

      <section className="lead-section" id="resources" aria-labelledby="resources-title">
        <div>
          <p className="section-kicker">
            <Mail size={18} aria-hidden="true" />
            High value for the journey
          </p>
          <h2 id="resources-title">Get resources that help you turn the map into movement.</h2>
        </div>
        <LeadCapture />
      </section>

      <section className="builder-section" id="builder" aria-labelledby="builder-title">
        <div className="builder-heading">
          <div>
            <p className="section-kicker">Create it here</p>
            <h2 id="builder-title">Your free custom Oikos Map</h2>
          </div>
          <div className="builder-stats" aria-label="Map stats">
            <span>{rootCount} first-circle</span>
            <span>{secondDegreeCount} next-circle</span>
            <span>{saveState}</span>
          </div>
        </div>

        <div className="builder-shell">
          <aside className="control-panel" aria-label="Oikos Map controls">
            <label>
              Map title
              <input value={mapData.mapTitle} onChange={(event) => updateMap({ mapTitle: event.target.value })} />
            </label>

            <label>
              Center name
              <input value={mapData.centerName} onChange={(event) => updateMap({ centerName: event.target.value })} />
            </label>

            <div className="button-row">
              <button type="button" onClick={() => addPerson(null)} title="Add first-circle person">
                <Plus size={18} aria-hidden="true" />
                Add person
              </button>
              <button type="button" onClick={() => selectedPerson && addPerson(selectedPerson.id)} title="Add connection">
                <CirclePlus size={18} aria-hidden="true" />
                Add branch
              </button>
            </div>

            <div className="people-list" aria-label="People on your map">
              <label className="search-label">
                Find a name
                <span>
                  <Search size={16} aria-hidden="true" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search names, groups, focus"
                  />
                </span>
              </label>
              <div className="person-list-scroll">
                {filteredPeople.length ? (
                  filteredPeople.map((person) => (
                    <button
                      type="button"
                      className={selectedId === person.id ? 'person-pill active' : 'person-pill'}
                      key={person.id}
                      onClick={() => setSelectedId(person.id)}
                    >
                      <span style={{ backgroundColor: getGroup(person.group).color }} />
                      <strong>{person.name}</strong>
                      <small>{getStage(person.stage).label}</small>
                    </button>
                  ))
                ) : (
                  <p className="muted compact">No names match that search.</p>
                )}
              </div>
            </div>

            <div className="person-editor">
              <div className="panel-title">
                <UserRound size={18} aria-hidden="true" />
                <span>{selectedPerson ? 'Selected person' : 'Select a person'}</span>
              </div>

              {selectedPerson ? (
                <>
                  <label>
                    Name
                    <input
                      value={selectedPerson.name}
                      onChange={(event) => updatePerson(selectedPerson.id, { name: event.target.value })}
                    />
                  </label>

                  <label>
                    Circle
                    <select
                      value={selectedPerson.parentId || 'first'}
                      onChange={(event) =>
                        updatePerson(selectedPerson.id, {
                          parentId: event.target.value === 'first' ? null : event.target.value,
                        })
                      }
                    >
                      <option value="first">First-circle person</option>
                      {mapData.people
                        .filter((person) => person.id !== selectedPerson.id && !person.parentId)
                        .map((person) => (
                          <option value={person.id} key={person.id}>
                            Branch from {person.name}
                          </option>
                        ))}
                    </select>
                  </label>

                  <fieldset>
                    <legend>Relationship</legend>
                    <div className="swatch-grid">
                      {groups.map((group) => (
                        <button
                          type="button"
                          className={selectedPerson.group === group.id ? 'swatch active' : 'swatch'}
                          key={group.id}
                          onClick={() => updatePerson(selectedPerson.id, { group: group.id })}
                          title={group.label}
                        >
                          <span style={{ backgroundColor: group.color }} />
                          {group.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label>
                    Prayer focus
                    <select
                      value={selectedPerson.stage}
                      onChange={(event) => updatePerson(selectedPerson.id, { stage: event.target.value })}
                    >
                      {stages.map((stage) => (
                        <option value={stage.id} key={stage.id}>
                          {stage.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="next-step">
                    <Clipboard size={18} aria-hidden="true" />
                    <p>{selectedStage.prompt}</p>
                  </div>

                  <label>
                    Notes
                    <textarea
                      rows="4"
                      value={selectedPerson.notes}
                      onChange={(event) => updatePerson(selectedPerson.id, { notes: event.target.value })}
                    />
                  </label>

                  <button className="danger-button" type="button" onClick={() => deletePerson(selectedPerson.id)}>
                    <Trash2 size={18} aria-hidden="true" />
                    Delete person
                  </button>
                </>
              ) : (
                <p className="muted">Add a name to begin mapping your household.</p>
              )}
            </div>

            <div className="download-actions" aria-label="Save and download actions">
              <button type="button" onClick={saveNow} title="Save in this browser">
                <Save size={18} aria-hidden="true" />
                Save
              </button>
              <button type="button" onClick={downloadPng} title="Download PNG">
                <Download size={18} aria-hidden="true" />
                PNG
              </button>
              <button type="button" onClick={downloadSvg} title="Download SVG">
                <Link2 size={18} aria-hidden="true" />
                SVG
              </button>
              <button type="button" onClick={downloadJson} title="Download editable data">
                <FileJson size={18} aria-hidden="true" />
                JSON
              </button>
              <button type="button" onClick={downloadPrayerPlan} title="Download prayer plan">
                <FileText size={18} aria-hidden="true" />
                Plan
              </button>
              <button type="button" onClick={() => fileInputRef.current?.click()} title="Import JSON map">
                <Upload size={18} aria-hidden="true" />
                Import
              </button>
              <button type="button" onClick={shareTool} title="Copy or share this tool">
                <Share2 size={18} aria-hidden="true" />
                {shareState}
              </button>
              <button type="button" onClick={() => resetMap(false)} title="Reset starter map">
                <RotateCcw size={18} aria-hidden="true" />
                Reset
              </button>
              <button type="button" onClick={() => resetMap(true)} title="Start with a blank map">
                <Trash2 size={18} aria-hidden="true" />
                Blank
              </button>
              <input ref={fileInputRef} className="file-input" type="file" accept="application/json" onChange={importJson} />
            </div>
          </aside>

          <div className="map-stage">
            <OikosSvg
              mapData={mapData}
              layout={layout}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              svgRef={svgRef}
            />
          </div>
        </div>
      </section>

      <section className="closing-band">
        <div>
          <p>Free to use. Easy to save. Share it with everyone you know so we can change the world together, for God's glory.</p>
          <span><PoweredBy /> · <CollaborationCredit /></span>
        </div>
        <button type="button" onClick={shareTool}>
          <Copy size={18} aria-hidden="true" />
          {shareState === 'Share' ? 'Share the tool' : shareState}
        </button>
      </section>

      <SiteFooter />
    </main>
  );
}

function OikosSvg({ mapData, layout, selectedId, setSelectedId, svgRef }) {
  const { width, height, center, positions } = layout;

  return (
    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${mapData.mapTitle} Oikos Map`}>
      <defs>
        <style>{`
          .svg-title { fill: #26201c; font: 950 42px Inter, Arial, sans-serif; }
          .svg-subtitle { fill: #5c5047; font: 800 20px Inter, Arial, sans-serif; }
          .svg-center-label, .svg-person-name { fill: #26201c; font: 950 22px Inter, Arial, sans-serif; }
          .svg-center-caption, .svg-person-stage { fill: #6a5d52; font: 850 18px Inter, Arial, sans-serif; }
        `}</style>
        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#2b2118" floodOpacity="0.16" />
        </filter>
      </defs>
      <rect width={width} height={height} rx="38" fill="#fff8ec" />
      <path
        d="M72 186 C226 72 377 88 518 160 C658 232 811 206 1005 104"
        fill="none"
        stroke="#f3cf74"
        strokeWidth="22"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M96 678 C272 552 410 617 552 550 C716 472 821 573 1000 438"
        fill="none"
        stroke="#b6e4dc"
        strokeWidth="18"
        strokeLinecap="round"
        opacity="0.65"
      />
      <text x="56" y="76" className="svg-title">
        {mapData.mapTitle}
      </text>
      <text x="56" y="112" className="svg-subtitle">
        Powered by Love on The World & Thy Kingdom Network
      </text>

      {mapData.people.map((person) => {
        const position = positions[person.id];
        const parentPosition = person.parentId ? positions[person.parentId] : center;
        if (!position || !parentPosition) return null;
        return (
          <line
            key={`${person.id}-line`}
            x1={parentPosition.x}
            y1={parentPosition.y}
            x2={position.x}
            y2={position.y}
            stroke="#4b3f36"
            strokeWidth={person.parentId ? 3 : 5}
            strokeLinecap="round"
            opacity={person.parentId ? 0.32 : 0.45}
          />
        );
      })}

      <g filter="url(#softShadow)">
        <circle cx={center.x} cy={center.y} r="84" fill="#26201c" />
        <circle cx={center.x} cy={center.y} r="72" fill="#fffdf7" />
        <text x={center.x} y={center.y - 8} textAnchor="middle" className="svg-center-label">
          {truncateLabel(mapData.centerName, 18)}
        </text>
        <text x={center.x} y={center.y + 24} textAnchor="middle" className="svg-center-caption">
          my oikos
        </text>
      </g>

      {mapData.people.map((person) => {
        const position = positions[person.id];
        if (!position) return null;
        const group = getGroup(person.group);
        const isSelected = selectedId === person.id;
        const radius = person.parentId ? 52 : 64;
        return (
          <g
            className="map-node"
            key={person.id}
            transform={`translate(${position.x} ${position.y})`}
            onClick={() => setSelectedId(person.id)}
            onKeyDown={(event) => event.key === 'Enter' && setSelectedId(person.id)}
            tabIndex="0"
            role="button"
            aria-label={`Edit ${person.name}`}
          >
            <circle r={radius + 9} fill={isSelected ? '#171310' : '#ffffff'} opacity={isSelected ? 1 : 0.78} />
            <circle r={radius} fill={group.color} />
            <circle r={radius - 9} fill="#fffdf7" opacity="0.96" />
            <text y="-4" textAnchor="middle" className="svg-person-name">
              {truncateLabel(person.name)}
            </text>
            <text y="24" textAnchor="middle" className="svg-person-stage">
              {stages.find((stage) => stage.id === person.stage)?.label || 'Pray'}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const routes = {
  '/connect': <ConnectPage />,
  '/growth': <GrowthPage />,
};

createRoot(document.getElementById('root')).render(routes[window.location.pathname] || <App />);
