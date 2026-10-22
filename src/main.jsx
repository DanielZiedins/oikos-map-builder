import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  CalendarPlus,
  CheckCircle2,
  Clipboard,
  CirclePlus,
  Compass,
  Copy,
  Crown,
  Download,
  FileImage,
  FileJson,
  FileText,
  Flame,
  Globe2,
  HeartHandshake,
  Link2,
  Mail,
  MessagesSquare,
  Plus,
  Play,
  Pause,
  Printer,
  RotateCcw,
  Shuffle,
  Rocket,
  Save,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Undo2,
  Upload,
  UserPlus,
  UserRound,
  Users,
  WandSparkles,
  X,
} from 'lucide-react';
import { sortedPostsMeta } from './content/posts-meta.js';
import { prayerVerses, verseIndexFor, versePrayer } from './content/prayer-verses.js';
import { conversationGuides, starterFor } from './content/conversation-starters.js';
import { buildPrayerReminderIcs } from './reminder.js';
import { networkGroups, networkSites, sitesInGroup } from './content/network.js';
import {
  INVITE_DISMISSED_KEY,
  JOURNEY_EVENT,
  JourneyTimeline,
  LeadCapture,
  SUBSCRIBED_KEY,
  readFlag,
  writeFlag,
} from './journey.jsx';
import { track, trackOutboundClicks } from './track.js';
import './styles.css';

const STORAGE_KEY = 'love-on-the-world-oikos-map-v1';
const SITE_URL = 'https://www.oikosmap.com';

const partnerLinks = [
  { label: 'Love on The World', href: 'https://www.loveontheworld.com' },
  { label: 'Thy Kingdom Network', href: 'https://www.thykingdom.net' },
];

const collaborationLink = {
  label: 'e3 Canada',
  href: 'https://e3ministry.ca/staff/katie-daniel-ziedins',
};

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

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `oikos-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// Fixed ids, not createId(): the homepage is prerendered, and random ids would
// differ between the server HTML and the browser (option values, keys).
const starterPeople = [
  {
    id: 'starter-1',
    name: 'Aunt Maria',
    group: 'family',
    stage: 'pray',
    notes: 'Pray for peace and an open door.',
    parentId: null,
  },
  {
    id: 'starter-2',
    name: 'Jordan',
    group: 'friends',
    stage: 'care',
    notes: 'Invite for coffee this week.',
    parentId: null,
  },
  {
    id: 'starter-3',
    name: 'Sam',
    group: 'work',
    stage: 'share',
    notes: 'Share a short hope story.',
    parentId: null,
  },
  {
    id: 'starter-4',
    name: 'Leah',
    group: 'neighbors',
    stage: 'pray',
    notes: '',
    parentId: null,
  },
  {
    id: 'starter-5',
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

const mapTemplates = [
  {
    id: 'starter',
    label: 'Starter circle',
    detail: 'A gentle place to begin with five everyday relationships.',
    icon: Sparkles,
    make: () => createFreshMap(false),
  },
  {
    id: 'household',
    label: 'Household',
    detail: 'Begin with family and the people closest to home.',
    icon: HeartHandshake,
    make: () => createTemplateMap('My Household Oikos', [
      ['Family member', 'family', 'pray'],
      ['Close friend', 'friends', 'care'],
      ['Neighbor', 'neighbors', 'pray'],
      ['Work friend', 'work', 'share'],
    ]),
  },
  {
    id: 'campus',
    label: 'Campus or school',
    detail: 'See your classroom, team, and friendships as a mission field.',
    icon: BookOpen,
    make: () => createTemplateMap('My Campus Oikos', [
      ['Classmate', 'school', 'pray'],
      ['Teammate', 'school', 'care'],
      ['Friend', 'friends', 'share'],
      ['Teacher or mentor', 'school', 'pray'],
    ]),
  },
  {
    id: 'workplace',
    label: 'Workplace',
    detail: 'Make room for prayer, care, and courageous conversations at work.',
    icon: Target,
    make: () => createTemplateMap('My Workplace Oikos', [
      ['Coworker', 'work', 'pray'],
      ['Manager or leader', 'work', 'care'],
      ['Client or customer', 'work', 'pray'],
      ['Work friend', 'friends', 'share'],
    ]),
  },
  {
    id: 'outreach',
    label: 'Outreach team',
    detail: 'Prepare your team to pray together and care for a shared neighbourhood or city.',
    icon: Users,
    make: () => createTemplateMap('Our Outreach Oikos', [
      ['Prayer partner', 'friends', 'pray'],
      ['Neighbourhood contact', 'neighbors', 'care'],
      ['Community leader', 'work', 'pray'],
      ['Friend to invite', 'friends', 'share'],
    ]),
  },
];

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

function sanitizeImportedMap(imported) {
  if (!imported || !Array.isArray(imported.people)) throw new Error('Invalid map data');
  const people = imported.people.map((person) => ({
    id: person.id || createId(),
    name: String(person.name || 'Unnamed person').slice(0, 80),
    group: groups.some((group) => group.id === person.group) ? person.group : 'friends',
    stage: stages.some((stage) => stage.id === person.stage) ? person.stage : 'pray',
    notes: String(person.notes || '').slice(0, 1000),
    parentId: person.parentId || null,
  }));
  return {
    centerName: String(imported.centerName || 'Your Name').slice(0, 80),
    mapTitle: String(imported.mapTitle || 'My Oikos Map').slice(0, 120),
    people,
  };
}

function encodeMapToHash(mapData) {
  const bytes = new TextEncoder().encode(JSON.stringify(mapData));
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeMapFromHash(encoded) {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return sanitizeImportedMap(JSON.parse(new TextDecoder().decode(bytes)));
}

function readSharedMapFromUrl() {
  try {
    const match = window.location.hash.match(/^#map=([A-Za-z0-9\-_]+)/);
    if (!match) return null;
    return decodeMapFromHash(match[1]);
  } catch {
    return null;
  }
}

const confettiColors = ['#f45d48', '#14b8a6', '#f59e0b', '#516cf0', '#8b5cf6', '#f3cf74'];

function launchConfetti() {
  if (typeof document === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const host = document.createElement('div');
  host.className = 'confetti-host';
  host.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 60; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.setProperty('--confetti-x', `${Math.random() * 100}vw`);
    piece.style.setProperty('--confetti-drift', `${(Math.random() - 0.5) * 240}px`);
    piece.style.setProperty('--confetti-spin', `${Math.round(360 + Math.random() * 720)}deg`);
    piece.style.setProperty('--confetti-delay', `${Math.random() * 420}ms`);
    piece.style.setProperty('--confetti-duration', `${1500 + Math.random() * 1400}ms`);
    piece.style.backgroundColor = confettiColors[i % confettiColors.length];
    if (i % 3 === 0) piece.style.borderRadius = '999px';
    host.appendChild(piece);
  }
  document.body.appendChild(host);
  window.setTimeout(() => host.remove(), 3600);
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
    people: blank ? [] : initialMap.people.map((person) => ({ ...person, id: createId() })),
  };
}

function createTemplateMap(mapTitle, people) {
  return {
    centerName: 'Your Name',
    mapTitle,
    people: people.map(([name, group, stage]) => ({
      id: createId(),
      name,
      group,
      stage,
      notes: '',
      parentId: null,
    })),
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

function buildTodayFocus(person) {
  const group = getGroup(person.group).label.toLowerCase();
  const stage = getStage(person.stage);
  const note = String(person.notes || '').trim();
  return [
    'My Oikos focus for today',
    '',
    `Person: ${person.name}`,
    `Relationship: ${group}`,
    `Rhythm: ${stage.label}`,
    `Faithful next step: ${stage.prompt}`,
    ...(note ? [`My note: ${note}`] : []),
  ].join('\n');
}

function PoweredBy() {
  return (
    <>
      Powered by:{' '}
      {partnerLinks.map((partner, index) => (
        <React.Fragment key={partner.href}>
          <a href={partner.href} target="_blank" rel="noopener">
            {partner.label}
          </a>
          {index === 0 ? ' & ' : ''}
        </React.Fragment>
      ))}
    </>
  );
}

function LogoMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <img src="/oikos-logo.svg" alt="" width="38" height="38" />
    </span>
  );
}

function CollaborationCredit() {
  return (
    <>
      In collaboration with{' '}
      <a href={collaborationLink.href} target="_blank" rel="noopener">
        {collaborationLink.label}
      </a>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer" id="partners">
      <nav className="footer-network" aria-label="Kingdom network">
        <div>
          <span className="footer-network-title">Oikos Map</span>
          <a href="/">Map Builder</a>
          <a href="/blog">The Oikos Journal</a>
          <a href="/about">About the map</a>
          <a href="/faq">FAQ</a>
          <a href="/network">The network</a>
          <a href="/growth">Growth</a>
          <a href="/connect">Connect</a>
        </div>
        {networkGroups
          .filter((group) => group.id !== 'people')
          .map((group) => {
            const sites = sitesInGroup(group.id);
            if (!sites.length) return null;
            return (
              <div key={group.id}>
                <span className="footer-network-title">{group.label}</span>
                {sites.map((site) => (
                  <a key={site.host} href={site.url} target="_blank" rel="noopener">
                    {site.host}
                  </a>
                ))}
              </div>
            );
          })}
      </nav>
      <div className="footer-links">
        <span>
          Made with ❤️ by{' '}
          <a href="https://www.danielziedins.com" target="_blank" rel="noopener">
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

function ScrollEffects() {
  useEffect(() => {
    let frame = 0;
    let revealed = 0;
    const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));

    function reveal(item) {
      if (item.classList.contains('is-visible')) return;
      item.classList.add('is-visible');
      revealed += 1;
      revealObserver?.unobserve(item);
    }

    // Geometry check, run on every scroll frame. This is the actual guarantee
    // that content is never stranded at opacity 0: it needs no observer
    // callbacks, so it still works where those never fire (background tabs,
    // prerender, non-compositing embedders).
    function revealInView() {
      const limit = window.innerHeight * 0.92;
      revealItems.forEach((item) => {
        if (item.classList.contains('is-visible')) return;
        if (item.getBoundingClientRect().top < limit) reveal(item);
      });
    }

    const revealObserver = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target);
          });
        },
        // Sections can be taller than the viewport, where a fractional threshold
        // is unreachable and the content would never reveal. Trigger on the
        // leading edge instead.
        { threshold: 0, rootMargin: '0px 0px -12% 0px' },
      );

    if (revealObserver) revealItems.forEach((item) => revealObserver.observe(item));
    revealInView();

    // Last resort: if neither route has revealed anything shortly after load,
    // drop the animation entirely rather than leave the page blank.
    const failSafe = window.setTimeout(() => {
      if (revealed > 0) return;
      revealItems.forEach((item) => item.classList.add('is-visible'));
      revealObserver?.disconnect();
    }, 2500);

    function update() {
      frame = 0;
      revealInView();
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? window.scrollY / height : 0;
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
      document.documentElement.style.setProperty('--scroll-width', `${Math.min(100, Math.max(0, progress * 100)).toFixed(2)}%`);
      document.documentElement.style.setProperty('--scroll-y', String(Math.round(window.scrollY)));
      document.documentElement.style.setProperty('--parallax-y', `${Math.round(window.scrollY * -0.08)}px`);
    }

    function requestUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    const canUsePointerParallax =
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function updatePointer(event) {
      const x = (event.clientX / window.innerWidth - 0.5).toFixed(4);
      const y = (event.clientY / window.innerHeight - 0.5).toFixed(4);
      document.documentElement.style.setProperty('--pointer-x', x);
      document.documentElement.style.setProperty('--pointer-y', y);
      document.documentElement.style.setProperty('--pointer-shift-x', `${Number(x) * 22}px`);
      document.documentElement.style.setProperty('--pointer-shift-y', `${Number(y) * 22}px`);
      document.documentElement.style.setProperty('--pointer-shift-x-reverse', `${Number(x) * -7}px`);
      document.documentElement.style.setProperty('--pointer-shift-y-reverse', `${Number(y) * -7}px`);
    }

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    if (canUsePointerParallax) window.addEventListener('pointermove', updatePointer, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (canUsePointerParallax) window.removeEventListener('pointermove', updatePointer);
      revealObserver?.disconnect();
      window.clearTimeout(failSafe);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}

function StickyInvite() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readFlag(SUBSCRIBED_KEY) || readFlag(INVITE_DISMISSED_KEY)) return undefined;

    const builder = document.getElementById('builder');
    if (!builder || typeof IntersectionObserver === 'undefined') return undefined;

    let timer = 0;
    // threshold 0: the builder is far taller than the viewport, so any
    // percentage-based threshold could never be reached on a phone.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        timer = window.setTimeout(() => setVisible(true), 2600);
      },
      { threshold: 0, rootMargin: '-120px 0px' },
    );
    observer.observe(builder);

    function onStarted() {
      setVisible(false);
    }
    window.addEventListener(JOURNEY_EVENT, onStarted);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener(JOURNEY_EVENT, onStarted);
    };
  }, []);

  function dismiss() {
    writeFlag(INVITE_DISMISSED_KEY);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="sticky-invite" role="complementary" aria-label="Oikos Journey invitation">
      <div>
        <strong>Want help actually praying through this map?</strong>
        <span>Six short emails over two weeks — pray, care, share, disciple. Free, and you can leave any time.</span>
      </div>
      <div className="sticky-invite-actions">
        <a className="primary-action" href="#resources" onClick={dismiss}>
          <Sparkles size={17} aria-hidden="true" />
          Start the journey
        </a>
        <button type="button" className="sticky-invite-close" onClick={dismiss} aria-label="Dismiss">
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}

function BuilderInvite({ mapData }) {
  const [subscribed, setSubscribed] = useState(() => readFlag(SUBSCRIBED_KEY));

  useEffect(() => {
    function onStarted() {
      setSubscribed(true);
    }
    window.addEventListener(JOURNEY_EVENT, onStarted);
    return () => window.removeEventListener(JOURNEY_EVENT, onStarted);
  }, []);

  const count = mapData.people.length;
  const praying = mapData.people.filter((person) => person.stage === 'pray').length;

  if (subscribed) {
    return (
      <div className="builder-invite builder-invite-done">
        <CheckCircle2 size={22} aria-hidden="true" />
        <div>
          <strong>You are on the Oikos Journey.</strong>
          <span>Keep building — the next email is already on its way.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-invite">
      <div className="builder-invite-copy">
        <p className="builder-invite-kicker">
          <Flame size={15} aria-hidden="true" />
          Do not stop at the map
        </p>
        <h3>
          {count
            ? `${count} ${count === 1 ? 'name' : 'names'} on your map${praying ? `, ${praying} waiting on prayer` : ''}. Now what?`
            : 'Your map is ready for its first name. Want a guide?'}
        </h3>
        <p>
          This is the point most people stall — the names are down, and then life gets loud. The Oikos Journey is six short
          emails over two weeks that walk you through praying for them, caring well, sharing your story, and helping them
          reach their own oikos.
        </p>
        <ul className="builder-invite-list">
          <li>
            <CheckCircle2 size={15} aria-hidden="true" /> A five-minute daily prayer rhythm
          </li>
          <li>
            <CheckCircle2 size={15} aria-hidden="true" /> Seven practical ways to show up for someone
          </li>
          <li>
            <CheckCircle2 size={15} aria-hidden="true" /> A three-minute testimony framework
          </li>
          <li>
            <CheckCircle2 size={15} aria-hidden="true" /> Completely free, unsubscribe in one click
          </li>
        </ul>
      </div>
      <LeadCapture mapData={mapData} />
    </div>
  );
}


function PrayerSprint({ person, stage, onComplete }) {
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [verseOffset, setVerseOffset] = useState(0);
  // Today's date is read after mount: the prerendered HTML was built on another
  // day, and a date read during render would never match it.
  const [today, setToday] = useState(null);
  const completionRef = useRef(onComplete);

  useEffect(() => {
    setToday(new Date());
  }, []);

  useEffect(() => {
    completionRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setSecondsRemaining(300);
    setIsRunning(false);
    setVerseOffset(0);
  }, [person?.id]);

  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) return undefined;
    const timer = window.setInterval(() => {
      setSecondsRemaining((seconds) => {
        if (seconds > 1) return seconds - 1;
        window.clearInterval(timer);
        setIsRunning(false);
        completionRef.current?.();
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning, secondsRemaining]);

  if (!person || !stage) return null;
  const minutes = String(Math.floor(secondsRemaining / 60)).padStart(2, '0');
  const seconds = String(secondsRemaining % 60).padStart(2, '0');
  const complete = secondsRemaining === 0;
  const verse = prayerVerses[verseIndexFor(person.id, verseOffset, today ?? new Date(0))];

  return (
    <div className="prayer-sprint">
      <div className="prayer-sprint-topline">
        <span>Five-minute prayer</span>
        {/* Announced only when it matters, not every second. */}
        <strong aria-live="off">{minutes}:{seconds}</strong>
      </div>
      <p aria-live="polite">{complete ? `Beautiful. Keep listening for how to love ${person.name} today.` : `Hold ${person.name} before Jesus. ${stage.prompt}`}</p>
      <figure className="prayer-verse">
        <figcaption>
          <BookOpen size={14} aria-hidden="true" />
          Scripture to pray · {verse.ref}
        </figcaption>
        <blockquote>“{verse.text}”</blockquote>
        <p className="prayer-verse-prayer">{versePrayer(verse, person.name)}</p>
        <div className="prayer-verse-actions">
          <button type="button" onClick={() => setVerseOffset((offset) => offset + 1)}>
            <Shuffle size={14} aria-hidden="true" />
            Another verse
          </button>
          <a href="/blog/bible-verses-to-pray-for-unsaved-loved-ones">All 23 verses</a>
        </div>
      </figure>
      <div className="prayer-sprint-actions">
        <button
          type="button"
          onClick={() => {
            if (!isRunning) track('prayer_start');
            setIsRunning((running) => !running);
          }}
          disabled={complete}
        >
          {isRunning ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          {isRunning ? 'Pause' : complete ? 'Complete' : 'Start prayer'}
        </button>
        <button type="button" className="prayer-reset" onClick={() => { setSecondsRemaining(300); setIsRunning(false); }} title="Reset five-minute prayer">
          <RotateCcw size={16} aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>
  );
}

// A question to ask this person, for the stages where the next step is a
// conversation. Same date-after-mount rule as the verse: the prerendered HTML
// was built on another day.
function ConversationCard({ person, stage }) {
  const [offset, setOffset] = useState(0);
  const [today, setToday] = useState(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  useEffect(() => {
    setOffset(0);
  }, [person?.id]);

  if (!person || !stage) return null;
  const question = starterFor(stage.id, person.id, offset, today ?? new Date(0));
  if (!question) return null;
  const guide = conversationGuides[stage.id];

  return (
    <figure className="prayer-verse conversation-card">
      <figcaption>
        <MessagesSquare size={14} aria-hidden="true" />
        {stage.id === 'disciple' ? `A question to explore with ${person.name}` : `A question to ask ${person.name}`}
      </figcaption>
      <blockquote>“{question}”</blockquote>
      <p className="prayer-verse-prayer">Ask it, then listen more than you talk. Note what you learn in their notes.</p>
      <div className="prayer-verse-actions">
        <button type="button" onClick={() => setOffset((value) => value + 1)}>
          <Shuffle size={14} aria-hidden="true" />
          Another question
        </button>
        <a href={guide.href}>{guide.label}</a>
      </div>
    </figure>
  );
}

// A daily calendar reminder to pray for the people on the map. The .ics file is
// built on the device (src/reminder.js) — names never leave the browser.
function PrayerReminder({ mapData }) {
  const [time, setTime] = useState('07:30');
  const [done, setDone] = useState(false);

  function addReminder() {
    track('reminder_ics');
    downloadBlob(
      new Blob([buildPrayerReminderIcs(mapData, time)], { type: 'text/calendar;charset=utf-8' }),
      'pray-for-my-oikos.ics',
    );
    setDone(true);
  }

  return (
    <div className="prayer-reminder">
      <p className="prayer-reminder-title">
        <CalendarPlus size={16} aria-hidden="true" />
        Daily prayer reminder
      </p>
      <p className="prayer-reminder-copy">
        Add a five-minute daily event to your phone or computer calendar, with your first five names in it. Made on
        this device — nothing is uploaded.
      </p>
      <div className="prayer-reminder-row">
        <label htmlFor="prayer-reminder-time">Remind me at</label>
        <input id="prayer-reminder-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
        <button type="button" onClick={addReminder} disabled={!mapData.people.length}>
          <CalendarPlus size={16} aria-hidden="true" />
          {done ? 'Downloaded — open it' : 'Add to calendar'}
        </button>
      </div>
      {done ? (
        <p className="prayer-reminder-copy" role="status">
          Open the downloaded file to add it to Apple, Google or Outlook Calendar.
        </p>
      ) : null}
    </div>
  );
}

export const faqItems = [
  {
    question: 'What is an Oikos Map?',
    answer:
      'An Oikos Map is a simple visual way to name the people in your everyday sphere of influence, such as family, friends, coworkers, classmates, and neighbors, so you can pray, care, share, and disciple intentionally.',
  },
  {
    question: 'What does the word oikos mean?',
    answer:
      'Oikos is the Greek word for household. In the New Testament it describes your extended sphere of relationships: family, friends, neighbors, coworkers, and everyone God has naturally placed around your life.',
  },
  {
    question: 'Is the Oikos Map Builder free?',
    answer:
      'Yes. The Oikos Map Builder is completely free for every believer, church, youth ministry, and disciple-maker. You can create a map, save it, download it, and share the tool with others.',
  },
  {
    question: 'Is my Oikos Map private?',
    answer:
      'Yes. Your map is saved only in your own browser and is never uploaded to a server. If you copy a map link, the map travels inside the link itself so you choose exactly who sees it.',
  },
  {
    question: 'Can I download or share my Oikos Map?',
    answer:
      'Yes. You can download your Oikos Map as PNG, SVG, JSON, and a simple prayer plan text file, or copy a private map link to reopen it on another device or share it with a friend.',
  },
  {
    question: 'Can I get a daily reminder to pray for the people on my map?',
    answer:
      'Yes. In the builder, choose a time and select Add to calendar. It downloads a daily five-minute calendar event with your first five names in it, which you can open in Apple, Google or Outlook Calendar. The file is created on your device, so the names are never uploaded.',
  },
  {
    question: 'Is there a printable Oikos Map template?',
    answer:
      'Yes. A free two-page printable Oikos Map template is available as a PDF: page one is the map with circles for family, friends, work, school and neighbours, and page two is a five-person prayer and next-step plan. It is free to print and share with your church, small group or youth group.',
  },
  {
    question: 'Can I use the Oikos Map with my church or small group?',
    answer:
      'Absolutely. The tool works great for churches, small groups, youth ministries, and outreach teams. Each person can build their own map, and the templates make it easy to start in a household, campus, or workplace context.',
  },
];

// The homepage is where most readers enter the journal, so besides the first
// three articles it points at the pillar guide and the most practical guides.
const guidePost = sortedPostsMeta.find((post) => post.slug === 'oikos-evangelism-guide');
const popularGuides = [
  ['bible-verses-to-pray-for-unsaved-loved-ones', '23 verses to pray for loved ones'],
  ['how-to-lead-someone-to-jesus', 'How to lead someone to Jesus'],
  ['spiritual-conversation-starters', '30 conversation starters'],
  ['free-printable-oikos-map-template', 'Free printable Oikos Map'],
  ['what-is-the-great-commission', 'The Great Commission explained'],
  ['who-is-my-neighbour', 'Who is my neighbour?'],
];

function LatestArticles() {
  return (
    <section className="latest-articles" id="journal" aria-labelledby="journal-title" data-reveal>
      <div className="latest-heading">
        <div>
          <p className="section-kicker">
            <BookOpen size={18} aria-hidden="true" />
            The Oikos Journal
          </p>
          <h2 id="journal-title">Practical help for the part that comes after the map.</h2>
        </div>
        <a className="secondary-action" href="/blog">
          <ArrowRight size={18} aria-hidden="true" />
          Read the journal
        </a>
      </div>
      {guidePost ? (
        <a className="latest-guide" href={`/blog/${guidePost.slug}`}>
          <span className="latest-guide-kicker">Start here · the complete guide</span>
          <strong>{guidePost.title}</strong>
          <span>{guidePost.excerpt}</span>
          <span className="latest-guide-cta">
            Read the guide <ArrowRight size={16} aria-hidden="true" />
          </span>
        </a>
      ) : null}
      <div className="latest-grid">
        {sortedPostsMeta.slice(0, 3).map((post) => (
          <article key={post.slug}>
            <p className="blog-card-kicker">{post.kicker}</p>
            <h3>
              <a href={`/blog/${post.slug}`}>{post.title}</a>
            </h3>
            <p>{post.excerpt}</p>
            <a className="blog-card-link" href={`/blog/${post.slug}`}>
              Read it <ArrowRight size={15} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
      <nav className="latest-more" aria-label="Popular guides">
        <span>Popular guides:</span>
        {popularGuides
          .filter(([slug]) => sortedPostsMeta.some((post) => post.slug === slug))
          .map(([slug, label]) => (
            <a key={slug} href={`/blog/${slug}`}>
              {label}
            </a>
          ))}
      </nav>
    </section>
  );
}

function KingdomNetwork() {
  return (
    <section className="network-section" id="network" aria-labelledby="network-title" data-reveal>
      <div className="network-heading">
        <p className="section-kicker">
          <Globe2 size={18} aria-hidden="true" />
          One family, many doors
        </p>
        <h2 id="network-title">You are not doing this alone.</h2>
        <p>
          This map is one small piece of a wider family of free tools, communities, and initiatives — all aimed at the same
          thing. Wherever your next step is, there is probably a door here for it.
        </p>
      </div>
      <div className="network-groups">
        {networkGroups.map((group) => {
          const sites = sitesInGroup(group.id);
          if (!sites.length) return null;
          return (
            <div className="network-group" key={group.id} id={`group-${group.id}`}>
              <div className="network-group-head">
                <h3>{group.label}</h3>
                <small>{group.note}</small>
              </div>
              <ul>
                {sites.map((site) => (
                  <li key={site.host}>
                    <a href={site.url} target="_blank" rel="noopener">
                      <strong>{site.name}</strong>
                      <span>{site.tagline}</span>
                      <small>
                        {site.host} <ArrowRight size={13} aria-hidden="true" />
                      </small>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FaqSection({
  items = faqItems,
  id = 'faq',
  title = 'Everything you need to know before you begin.',
  lede = 'Short, honest answers about the tool, your privacy, and how to use the map with your church or group.',
}) {
  return (
    <section className="faq-section" id={id} aria-labelledby={`${id}-title`} data-reveal>
      <div>
        <p className="section-kicker">
          <BookOpen size={18} aria-hidden="true" />
          Common questions
        </p>
        <h2 id={`${id}-title`}>{title}</h2>
        <p className="faq-lede">{lede}</p>
      </div>
      <div className="faq-list">
        {items.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// Each area keeps its original one-line summary, now with an anchor verse (NIV,
// word for word) and three practices small enough to start this week.
const growthAreas = [
  {
    title: 'Spirit',
    body: 'Abide in Jesus, learn to hear His voice, and live from intimacy instead of striving.',
    verse: { text: 'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.', ref: 'John 15:5' },
    practices: ['Ten unhurried minutes in a Gospel each morning', 'Pray through your Oikos Map by name', 'One sabbath rhythm a week — a real stop'],
  },
  {
    title: 'Mind',
    body: 'Renew your thoughts, break agreement with lies, and build faith-filled focus.',
    verse: { text: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.', ref: 'Romans 12:2' },
    practices: ['Memorise one verse a week', 'Name a lie you have believed and the truth that answers it', 'Trade one hour of scrolling for reading'],
  },
  {
    title: 'Body',
    body: 'Treat health, energy, and discipline as stewardship for the assignment.',
    verse: { text: 'You are not your own; you were bought at a price. Therefore honor God with your bodies.', ref: '1 Corinthians 6:19–20' },
    practices: ['Protect your sleep like an appointment', 'Move every day — a walk counts, and a prayer walk counts twice', 'Eat and rest as someone with a calling to carry'],
  },
  {
    title: 'Purpose',
    body: 'Bring your gifts, work, family, and influence under the Lordship of Jesus.',
    verse: { text: 'For we are God’s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.', ref: 'Ephesians 2:10' },
    practices: ['Write one sentence on what God has put you here to do', 'See your workplace as a mission field, not a waiting room', 'Use one gift to serve someone on your map this week'],
  },
];

const growthRhythm = [
  ['Daily', 'Scripture and prayer before the phone. Pray for your five by name. A short walk.'],
  ['Weekly', 'Sabbath rest, church, and one intentional act of care for someone on your map.'],
  ['Monthly', 'Review your map and your four areas. What grew? What is crowding out what matters?'],
  ['Yearly', 'Ask God for one word or verse for the year, and one person to disciple.'],
];

export const growthFaq = [
  {
    question: 'What is Kingdom personal growth?',
    answer:
      'Kingdom personal growth is becoming more like Jesus in every part of life — spirit, mind, body and purpose — as an act of stewardship rather than self-improvement. Luke 2:52 says Jesus himself "grew in wisdom and stature, and in favor with God and man."',
  },
  {
    question: 'How is Christian personal growth different from self-help?',
    answer:
      'Self-help aims at a better version of yourself for your own sake. Christian growth starts with abiding in Jesus (John 15:5), is powered by the Holy Spirit rather than willpower alone, and aims at bearing fruit that blesses other people and glorifies God.',
  },
  {
    question: 'How does personal growth relate to evangelism?',
    answer:
      'Healthy people reach people. Prayer, a renewed mind, energy and a clear sense of purpose make it easier to love the people in your oikos well and to share your faith with integrity. Your growth becomes part of your witness (Matthew 5:16).',
  },
  {
    question: 'Where should I start?',
    answer:
      'Start small and daily: ten minutes in a Gospel, praying for five people by name, protecting your sleep, and one act of care each week. Then grow with others — the I Am Reborn community exists for exactly that.',
  },
];

function GrowthPage() {
  return (
    <main>
      <ScrollEffects />
      <header className="site-header">
        <a className="brand" href="/" aria-label="Oikos Map Builder home">
          <LogoMark />
          <span>Oikos Map Builder</span>
        </a>
        <nav aria-label="Growth navigation">
          <a href="/">Map Builder</a>
          <a href="/connect">Connect</a>
          <a href="#growth-community">Community</a>
          <a href="https://www.iamreborn.net" target="_blank" rel="noopener">
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
            <span>Become the kind</span>{' '}
            <span>of person who can</span>{' '}
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
            <a className="secondary-action" href="https://www.iamreborn.net" target="_blank" rel="noopener">
              <ArrowRight size={18} aria-hidden="true" />
              Visit IAmReborn.net
            </a>
          </div>
        </div>
      </section>

      <section className="growth-why" aria-labelledby="growth-why-title">
        <p className="section-kicker">
          <Sparkles size={18} aria-hidden="true" />
          Why growth belongs on a mission site
        </p>
        <h2 id="growth-why-title">Healthy people reach people.</h2>
        <p>
          Even Jesus grew: <em>"And Jesus grew in wisdom and stature, and in favor with God and man"</em> (Luke 2:52).
          That one verse covers the mind, the body, the spirit and relationships. Growth is not a detour from the
          Great Commission — it is how ordinary people become able to carry it for a lifetime instead of a season.
        </p>
        <p>
          The people on your <a href="/">Oikos Map</a> are watching how you live long before they listen to what you
          say. A rested body, a renewed mind and a life rooted in Jesus make your love more patient and your witness
          more believable.
        </p>
      </section>

      <section className="growth-grid" aria-label="Growth areas">
        {growthAreas.map((area) => (
          <article key={area.title}>
            <span>{area.title}</span>
            <p>{area.body}</p>
            <blockquote className="growth-verse">
              “{area.verse.text}”
              <cite>{area.verse.ref}</cite>
            </blockquote>
            <h3 className="growth-practices-title">Start this week</h3>
            <ul className="growth-practices">
              {area.practices.map((practice) => (
                <li key={practice}>{practice}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="growth-rhythm" aria-labelledby="growth-rhythm-title">
        <div>
          <p className="section-kicker">
            <Target size={18} aria-hidden="true" />
            A simple rhythm
          </p>
          <h2 id="growth-rhythm-title">Grow on purpose, not by accident.</h2>
          <p>
            Most growth is not dramatic. It is small things done faithfully at the right intervals. Here is a rhythm you
            can actually keep.
          </p>
        </div>
        <ol>
          {growthRhythm.map(([when, what]) => (
            <li key={when}>
              <strong>{when}</strong>
              <span>{what}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="growth-why growth-overflow" aria-labelledby="growth-overflow-title">
        <p className="section-kicker">
          <HeartHandshake size={18} aria-hidden="true" />
          Growth that overflows
        </p>
        <h2 id="growth-overflow-title">Let your growth reach the people around you.</h2>
        <ul>
          <li>
            Turn your prayer time outward: <a href="/blog/how-to-pray-for-unsaved-family-and-friends">a five-minute
            daily rhythm for the people you love</a>, with <a href="/blog/bible-verses-to-pray-for-unsaved-loved-ones">23
            verses to pray over them</a>.
          </li>
          <li>
            Bring faith into your workday: <a href="/blog/faith-at-work-your-coworkers-are-your-oikos">your coworkers are
            your oikos</a>.
          </li>
          <li>
            Pass on what you are learning: <a href="/blog/how-to-disciple-someone">how to disciple someone when you do not
            feel qualified</a>.
          </li>
          <li>
            Prefer paper? <a href="/blog/free-printable-oikos-map-template">Print a free Oikos Map</a> and put it where
            you will see it every day.
          </li>
        </ul>
      </section>

      <FaqSection
        items={growthFaq}
        id="growth-faq"
        title="Questions about growing in Christ."
        lede="Short answers on what Kingdom personal growth is, how it differs from self-help, and where to start."
      />

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
      <ScrollEffects />
      <header className="site-header">
        <a className="brand" href="/" aria-label="Oikos Map Builder home">
          <LogoMark />
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
            <span>Find people</span>{' '}
            <span>running toward</span>{' '}
            <span>the Kingdom.</span>
          </h1>
          <p className="hero-lede">
            The Oikos Map is a beginning. Community helps you keep going with encouragement, prayer, discipleship, and
            people who want to see Jesus glorified in every sphere of life.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="https://kingdom-connect.net/" target="_blank" rel="noopener">
              <Globe2 size={18} aria-hidden="true" />
              Join Kingdom Connect
            </a>
            <a className="secondary-action" href={collaborationLink.href} target="_blank" rel="noopener">
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
          <a href="https://kingdom-connect.net/" target="_blank" rel="noopener">
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
          <a href={collaborationLink.href} target="_blank" rel="noopener">
            Visit Daniel & Katie's e3 page <ArrowRight size={16} aria-hidden="true" />
          </a>
        </article>
      </section>

      {/* The network's shared outreach map. Mapping your oikos is step one;
          going out with people near you is step two. Embedded from the one
          hosted map at evangelize.world (tinted to this site's gold) rather
          than copied here, so it improves without a redeploy. */}
      <section className="outreach-map-section" id="outreach-map" aria-labelledby="outreach-map-title">
        <div className="outreach-map-intro">
          <p className="eyebrow">
            <Globe2 size={18} aria-hidden="true" />
            Go with people near you
          </p>
          <h2 id="outreach-map-title">Find an outreach group</h2>
          <p>
            Your oikos is the people already in your world. When you are ready to
            go further, this live map shows real evangelism and outreach groups
            you can join — anywhere in the world.
          </p>
        </div>
        <div className="outreach-map-frame">
          <iframe
            src="https://map.loveontheworld.com/embed?site=oikos&fill=1&accent=f3cf74&globe=1"
            loading="lazy"
            allow="geolocation"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Love on The World — outreach groups you can join"
          />
        </div>
        <p className="outreach-map-note">
          Live from{" "}
          <a href="https://www.evangelize.world" target="_blank" rel="noopener">
            Evangelize.World
          </a>
          {" "}— the shared map for the whole network.
        </p>
      </section>

      <section className="founder-section" id="founder" aria-labelledby="founder-title">
        <div className="founder-image-wrap">
          <picture>
            <source srcSet="/assets/daniel-ziedins-founder.webp" type="image/webp" />
            <img
              src="/assets/daniel-ziedins-founder-640.jpg"
              alt="Daniel Ziedins"
              width="640"
              height="640"
              loading="lazy"
              decoding="async"
            />
          </picture>
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
            <a className="primary-action" href="https://www.danielziedins.com" target="_blank" rel="noopener">
              <UserRound size={18} aria-hidden="true" />
              DanielZiedins.com
            </a>
            <a className="secondary-action" href="https://www.kd-ziedins.com" target="_blank" rel="noopener">
              <HeartHandshake size={18} aria-hidden="true" />
              KD-Ziedins.com
            </a>
          </div>
        </div>
      </section>

      {/* Partnership invitation. Facts here mirror what Daniel and Katie publish on
          kd-ziedins.com; the giving link is their e3 Canada staff page. */}
      <section className="partner-band" aria-labelledby="partner-band-title">
        <div className="partner-band-copy">
          <p className="section-kicker">
            <HeartHandshake size={18} aria-hidden="true" />
            Partner in the mission
          </p>
          <h2 id="partner-band-title">Plunder hell. Populate heaven. Do it together.</h2>
          <p>
            Daniel and Katie have served in street evangelism since 2014 and now serve with e3 Canada, equipping believers
            to evangelise and establish multiplying churches. Their current call: help establish{' '}
            <strong>100 multiplying outreach groups around the world</strong>.
          </p>
          <p>
            Some go, some pray, some send — and Scripture says every one of them shares in the fruit. You can stand with
            them today.
          </p>
        </div>
        <div className="partner-band-actions">
          <a className="primary-action" href="https://e3ministry.ca/staff/katie-daniel-ziedins" target="_blank" rel="noopener">
            <HeartHandshake size={18} aria-hidden="true" />
            Partner through e3 Canada
          </a>
          <a className="secondary-action" href="/blog/plunder-hell-populate-heaven">
            <BookOpen size={18} aria-hidden="true" />
            Read: your part in sending
          </a>
          <a className="secondary-action" href="/blog/from-hamilton-to-the-nations">
            <BookOpen size={18} aria-hidden="true" />
            Read: what 12 years of yes has built
          </a>
          <a className="secondary-action" href="https://www.kd-ziedins.com" target="_blank" rel="noopener">
            <ArrowRight size={18} aria-hidden="true" />
            Follow the story at KD-Ziedins.com
          </a>
        </div>
      </section>

      <section className="lead-section connect-lead" aria-labelledby="connect-resources-title">
        <div className="lead-pitch">
          <p className="section-kicker">
            <Mail size={18} aria-hidden="true" />
            The Oikos Journey · free
          </p>
          <h2 id="connect-resources-title">Get encouragement and next steps for mission.</h2>
          <p className="lead-lede">
            Six short emails over two weeks through the rhythm of <strong>pray, care, share, disciple</strong> — then the
            bigger picture of what God is doing and where you fit in it.
          </p>
          <JourneyTimeline />
        </div>
        <LeadCapture />
      </section>

      <SiteFooter />
    </main>
  );
}

const NAME_SPLIT = /[\n,;]+/;

// Accepts a pasted list — newlines, commas or semicolons — and returns clean,
// de-duplicated names.
function parseNameList(text) {
  const seen = new Set();
  const names = [];
  for (const raw of String(text || '').split(NAME_SPLIT)) {
    const name = raw.trim().replace(/\s+/g, ' ').slice(0, 60);
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(name);
    if (names.length >= 40) break;
  }
  return names;
}

function computeLayout(people, compact = false) {
  const roots = people.filter((person) => !person.parentId);
  // Grow the canvas once a single ring can no longer hold the first circle
  // without overlapping. Small maps keep the original 1100x820 exactly.
  // Compact (phones): a tighter ring on a canvas no wider than it needs to be,
  // so a 390px screen shows the whole map with names still readable instead of
  // a third of a 1100-unit canvas.
  const baseRadius = compact ? (roots.length > 7 ? 236 : 196) : roots.length > 7 ? 286 : 248;
  const perPerson = compact ? 176 : 152;
  const radius = Math.max(baseRadius, Math.round((Math.max(roots.length, 1) * perPerson) / (2 * Math.PI)));
  const pad = compact ? 150 : 162;
  const span = (radius + pad) * 2;
  const top = compact ? 96 : 0;
  const width = compact ? span : Math.max(1100, span);
  const height = compact ? span + top : Math.max(820, span);
  const center = { x: width / 2, y: top + span / 2 };
  const childOffset = compact ? 118 : 158;
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
        x: parentPosition.x + Math.cos(childAngle) * childOffset,
        y: parentPosition.y + Math.sin(childAngle) * childOffset,
        angle: childAngle,
      };
    });
  });

  return { width, height, center, positions, childrenByParent };
}


const PRIMARY_NAV = [
  ['/#builder', 'Create'],
  ['/blog', 'Journal'],
  ['/about', 'About'],
  ['/faq', 'FAQ'],
  ['/network', 'Network'],
  ['/growth', 'Growth'],
  ['/connect', 'Connect'],
];

function SiteHeader({ current }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Oikos Map Builder home">
        <LogoMark />
        <span>Oikos Map Builder</span>
      </a>
      <nav aria-label="Primary navigation">
        {PRIMARY_NAV.map(([href, label]) => (
          <a key={href} href={href} aria-current={current && href === current ? 'page' : undefined}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

// The hero's animated map: you in the centre, the five circles around you, and
// the people each of them knows. Pure SVG + CSS so it paints with the headline;
// motion is switched off under prefers-reduced-motion.
const HERO_RING = [
  ['Family', '#f45d48'],
  ['Friends', '#14b8a6'],
  ['Work', '#f59e0b'],
  ['School', '#516cf0'],
  ['Neighbours', '#8b5cf6'],
];

function HeroConstellation() {
  const cx = 320;
  const cy = 320;
  const ring = 178;
  const nodes = HERO_RING.map(([label, color], index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / HERO_RING.length;
    const x = cx + Math.cos(angle) * ring;
    const y = cy + Math.sin(angle) * ring;
    const outer = [-0.5, 0.5].map((spread) => {
      const a = angle + spread * 0.52;
      return { x: cx + Math.cos(a) * (ring + 108), y: cy + Math.sin(a) * (ring + 108) };
    });
    return { label, color, x, y, outer };
  });

  return (
    <div className="hero-visual" aria-hidden="true">
      <svg className="constellation" viewBox="0 0 640 640" focusable="false">
        <defs>
          <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#f3cf74" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#f3cf74" stopOpacity="0.12" />
            <stop offset="1" stopColor="#f3cf74" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="c-glow" cx={cx} cy={cy} r="300" fill="url(#heroGlow)" />
        <g className="c-orbit" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <circle cx={cx} cy={cy} r={ring} fill="none" stroke="#26201c" strokeOpacity="0.14" strokeWidth="1.5" strokeDasharray="4 9" />
          <circle cx={cx} cy={cy} r={ring + 108} fill="none" stroke="#26201c" strokeOpacity="0.08" strokeWidth="1.5" strokeDasharray="3 11" />
        </g>
        {nodes.map((node) => (
          <g key={node.label}>
            <line className="c-line" x1={cx} y1={cy} x2={node.x} y2={node.y} stroke={node.color} strokeWidth="3" strokeLinecap="round" />
            {node.outer.map((pt, i) => (
              <line key={i} className="c-line c-line-outer" x1={node.x} y1={node.y} x2={pt.x} y2={pt.y} stroke={node.color} strokeWidth="2" strokeLinecap="round" />
            ))}
          </g>
        ))}
        {nodes.map((node, index) => (
          <g key={node.label} className="c-node" style={{ '--i': index, transformOrigin: `${node.x}px ${node.y}px` }}>
            {node.outer.map((pt, i) => (
              <g key={i} className="c-outer" style={{ '--i': index * 2 + i, transformOrigin: `${pt.x}px ${pt.y}px` }}>
                <circle cx={pt.x} cy={pt.y} r="16" fill="#fffdf7" stroke={node.color} strokeWidth="3" />
                <circle cx={pt.x} cy={pt.y} r="5" fill={node.color} opacity="0.7" />
              </g>
            ))}
            <circle cx={node.x} cy={node.y} r="46" fill="#fffdf7" stroke={node.color} strokeWidth="5" />
            <circle cx={node.x} cy={node.y} r="36" fill={node.color} opacity="0.12" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" className="c-label">
              {node.label}
            </text>
          </g>
        ))}
        <g className="c-center" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <circle cx={cx} cy={cy} r="74" fill="#26201c" />
          <circle cx={cx} cy={cy} r="62" fill="#fffdf7" />
          <text x={cx} y={cy - 2} textAnchor="middle" className="c-you">
            You
          </text>
          <text x={cx} y={cy + 20} textAnchor="middle" className="c-you-sub">
            my oikos
          </text>
        </g>
      </svg>
      <div className="hero-map-note">
        <span><Compass size={16} aria-hidden="true" /> Your mission field</span>
        <strong>Closer than you think.</strong>
        <small>Start with one name, one prayer, one next step.</small>
      </div>
    </div>
  );
}

// ---- Homepage teasers. The full sections live on /about, /network and /faq. ----

function RhythmStrip() {
  return (
    <section className="rhythm-strip" id="rhythm" aria-labelledby="rhythm-title" data-reveal>
      <div className="rhythm-head">
        <p className="section-kicker">
          <WandSparkles size={18} aria-hidden="true" />
          A simple rhythm
        </p>
        <h2 id="rhythm-title">From a name on a page to a life touched by love.</h2>
      </div>
      <ol className="rhythm-steps">
        {stages.map((stage, index) => (
          <li key={stage.id} className={`rhythm-step rhythm-${stage.id}`}>
            <span className="rhythm-number">0{index + 1}</span>
            <strong>{stage.label}</strong>
            <p>{stage.prompt}</p>
          </li>
        ))}
      </ol>
      <a className="secondary-action rhythm-link" href="/about">
        <ArrowRight size={18} aria-hidden="true" />
        Why the map works
      </a>
    </section>
  );
}

function WhyTeaser() {
  return (
    <section className="why-teaser" id="why" aria-labelledby="why-title" data-reveal>
      <div className="why-copy">
        <p className="section-kicker">
          <Globe2 size={18} aria-hidden="true" />
          Why this matters
        </p>
        <h2 id="why-title">A name on your map can become an encounter.</h2>
        <p>
          The Gospel is spreading, but the mission is still unfinished. An Oikos Map helps ordinary believers turn
          compassion into prayer, friendship, testimony, and discipleship — starting with the people already around them.
        </p>
        <div className="why-actions">
          <a className="primary-action" href="/about">
            <ArrowRight size={18} aria-hidden="true" />
            The heart behind the map
          </a>
          <a className="secondary-action" href="/about#jesus">
            <HeartHandshake size={18} aria-hidden="true" />
            New to Jesus? Start here
          </a>
        </div>
      </div>
      <div className="why-stats">
        {missionStats.slice(0, 2).map((stat) => (
          <article key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
        <a className="stat-source" href="https://www.loveonmission.world/" target="_blank" rel="noopener">
          Stats via Love on Mission
        </a>
      </div>
    </section>
  );
}

function NetworkTeaser() {
  // Counts the map itself: it is one of the family, not outside it.
  const total = networkSites.length;
  return (
    <section className="network-teaser" id="network" aria-labelledby="network-teaser-title" data-reveal>
      <div>
        <p className="section-kicker">
          <Globe2 size={18} aria-hidden="true" />
          One family, many doors
        </p>
        <h2 id="network-teaser-title">You are not doing this alone.</h2>
        <p>
          This map is one small piece of a family of {total} free tools, communities, and initiatives — all aimed at the
          same thing. Wherever your next step is, there is probably a door here for it.
        </p>
      </div>
      <nav className="network-chips" aria-label="Network groups">
        {networkGroups.map((group) => (
          <a key={group.id} href={`/network#group-${group.id}`}>
            <strong>{group.label}</strong>
            <span>{sitesInGroup(group.id).length} sites</span>
          </a>
        ))}
        <a className="network-all" href="/network">
          Explore the whole network <ArrowRight size={16} aria-hidden="true" />
        </a>
      </nav>
    </section>
  );
}

function FaqTeaser() {
  return (
    <section className="faq-teaser" id="faq" aria-labelledby="faq-teaser-title" data-reveal>
      <div>
        <p className="section-kicker">
          <BookOpen size={18} aria-hidden="true" />
          Common questions
        </p>
        <h2 id="faq-teaser-title">Three things people ask first.</h2>
        <a className="secondary-action" href="/faq">
          <ArrowRight size={18} aria-hidden="true" />
          All {faqItems.length} questions
        </a>
      </div>
      <div className="faq-list">
        {faqItems.slice(0, 3).map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// ---- Sections moved from the homepage to /about, verbatim. ----

function MapMethod() {
  return (
    <section className="map-method" aria-labelledby="method-title" data-reveal>
      <div className="method-heading">
        <p className="section-kicker"><WandSparkles size={18} aria-hidden="true" /> A simple rhythm for everyday mission</p>
        <h2 id="method-title">From a name on a page to a life touched by love.</h2>
        <p>There is no pressure to have every answer. The map simply helps you notice, pray, and take the next faithful step.</p>
      </div>
      <div className="method-path" aria-label="The Oikos mission pathway">
        {stages.map((stage, index) => (
          <article key={stage.id}>
            <span className="method-number">0{index + 1}</span>
            <div className="method-dot" aria-hidden="true" />
            <h3>{stage.label}</h3>
            <p>{stage.prompt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function VisionSection() {
  return (
    <section className="vision" id="vision" aria-labelledby="vision-title" data-reveal>
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
  );
}

function MissionSection() {
  return (
    <section className="mission-pulse" id="mission" aria-labelledby="mission-title" data-reveal>
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
        <a className="secondary-action" href="https://www.loveonmission.world/" target="_blank" rel="noopener">
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
        <a className="stat-source" href="https://www.loveonmission.world/" target="_blank" rel="noopener">
          Stats via Love on Mission dashboard
        </a>
      </div>
    </section>
  );
}

function NextStepsSection() {
  return (
    <section className="next-steps" id="next-steps" aria-labelledby="next-steps-title" data-reveal>
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
          <a href="https://www.loveontheworld.com" target="_blank" rel="noopener">
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
          <a href="https://www.seekfirst.world" target="_blank" rel="noopener">
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
  );
}

function JesusSection() {
  return (
    <section className="jesus-section" id="jesus" aria-labelledby="jesus-title" data-reveal>
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
  );
}

function AboutPage() {
  return (
    <main>
      <ScrollEffects />
      <SiteHeader current="/about" />
      <section className="page-hero about-hero">
        <p className="eyebrow">
          <HeartHandshake size={18} aria-hidden="true" />
          The heart behind the map
        </p>
        <h1>Why an Oikos Map?</h1>
        <p className="hero-lede">
          Oikos is the New Testament word for household — the family, friends, coworkers, classmates, and neighbours
          already in your everyday world. This page is the why: the rhythm the map is built on, the vision behind it,
          the bigger mission it serves, and the next steps when you are ready to move toward people in love.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href="/#builder">
            <Sparkles size={18} aria-hidden="true" />
            Create your map
          </a>
          <a className="secondary-action" href="/blog/oikos-evangelism-guide">
            <BookOpen size={18} aria-hidden="true" />
            Read the complete guide
          </a>
        </div>
      </section>
      <MapMethod />
      <VisionSection />
      <MissionSection />
      <NextStepsSection />
      <JesusSection />
      <section className="closing-band" data-reveal>
        <div>
          <p>Free to use. Easy to save. Share it with everyone you know so we can change the world together, for God's glory.</p>
          <span><PoweredBy /> · <CollaborationCredit /></span>
        </div>
        <a className="primary-action" href="/#builder">
          <Sparkles size={18} aria-hidden="true" />
          Build your map
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}

function FaqPage() {
  return (
    <main>
      <ScrollEffects />
      <SiteHeader current="/faq" />
      <section className="page-hero">
        <p className="eyebrow">
          <BookOpen size={18} aria-hidden="true" />
          Frequently asked questions
        </p>
        <h1>Oikos Map, explained.</h1>
        <p className="hero-lede">
          Short, honest answers about the tool, your privacy, and how to use the map with your church or group. For the
          words behind the map — oikos, person of peace, the Great Commission — see the{' '}
          <a href="/blog#key-terms">key terms</a> in the journal.
        </p>
      </section>
      <FaqSection
        items={faqItems}
        id="faq"
        title="Everything you need to know before you begin."
        lede="If your question is not here, the complete guide to oikos evangelism covers the why and the how in depth."
      />
      <section className="closing-band" data-reveal>
        <div>
          <p>Still wondering? The Oikos Journal has {sortedPostsMeta.length} practical guides, from praying for one person to reaching a city.</p>
          <span><PoweredBy /> · <CollaborationCredit /></span>
        </div>
        <a className="primary-action" href="/blog/oikos-evangelism-guide">
          <BookOpen size={18} aria-hidden="true" />
          Read the complete guide
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}

function NetworkPage() {
  // Counts the map itself: it is one of the family, not outside it.
  const total = networkSites.length;
  return (
    <main>
      <ScrollEffects />
      <SiteHeader current="/network" />
      <section className="page-hero">
        <p className="eyebrow">
          <Globe2 size={18} aria-hidden="true" />
          One family, many doors
        </p>
        <h1>The Kingdom network behind Oikos Map.</h1>
        <p className="hero-lede">
          Oikos Map is one of {total} free tools, communities, and initiatives built and given away by the same family,
          all aimed at one thing: His Kingdom come. Wherever your next step is — going on mission, growing deeper,
          gathering people, or shaping culture — there is a door here for it.
        </p>
      </section>
      <KingdomNetwork />
      <section className="closing-band" data-reveal>
        <div>
          <p>Every door starts in the same place: the people already around you.</p>
          <span><PoweredBy /> · <CollaborationCredit /></span>
        </div>
        <a className="primary-action" href="/#builder">
          <Sparkles size={18} aria-hidden="true" />
          Map your oikos
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}

function App() {
  const [mapData, setMapData] = useState(loadSavedMap);
  // Phone layout for the SVG (tighter ring, larger type). Read after mount: the
  // prerendered HTML is the desktop layout and must match on first render.
  const [compact, setCompact] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 860px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const [selectedId, setSelectedId] = useState(mapData.people[0]?.id ?? null);
  const [saveState, setSaveState] = useState('Saved locally');
  const [searchTerm, setSearchTerm] = useState('');
  const [shareState, setShareState] = useState('Share');
  const [mapLinkState, setMapLinkState] = useState('Link');
  const [planCopyState, setPlanCopyState] = useState('Plan');
  const [coachCopyState, setCoachCopyState] = useState('Copy step');
  const [canUndo, setCanUndo] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkGroup, setBulkGroup] = useState('friends');
  const fileInputRef = useRef(null);
  const svgRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    const sharedMap = readSharedMapFromUrl();
    if (!sharedMap) return;
    const hasSavedMap = Boolean(readStoredMap());
    const shouldLoad =
      !hasSavedMap ||
      window.confirm(`Load the shared map "${sharedMap.mapTitle}"? It will replace the map currently saved on this device.`);
    if (shouldLoad) {
      setMapData(sharedMap);
      setSelectedId(sharedMap.people[0]?.id ?? null);
      setSaveState('Shared map loaded');
    }
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);

  const layout = useMemo(() => computeLayout(mapData.people, compact), [mapData.people, compact]);
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

  // Snapshot before structural changes only, so Undo rescues deletes, resets, and
  // imports without fighting the browser's own text undo inside inputs.
  function pushHistory() {
    historyRef.current = [...historyRef.current.slice(-9), mapData];
    setCanUndo(true);
  }

  function undoLastChange() {
    const previous = historyRef.current.pop();
    setCanUndo(historyRef.current.length > 0);
    if (!previous) return;
    setMapData(previous);
    setSelectedId(previous.people[0]?.id ?? null);
    setSaveState('Change undone');
  }

  useEffect(() => {
    function onKeyDown(event) {
      const key = event.key.toLowerCase();
      const target = event.target;
      const isTypingField = /^(input|textarea|select)$/i.test(target?.tagName || '') || target?.isContentEditable;
      if (isTypingField) return;
      if ((event.metaKey || event.ctrlKey) && key === 'z') {
        event.preventDefault();
        undoLastChange();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // Undo only touches refs and state setters, so binding once is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      id: createId(),
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

  function addManyPeople() {
    const names = parseNameList(bulkText);
    if (!names.length) return;

    const existing = new Set(mapData.people.map((person) => person.name.trim().toLowerCase()));
    const fresh = names.filter((name) => !existing.has(name.toLowerCase()));
    if (!fresh.length) {
      setSaveState('Those names are already on your map');
      setBulkText('');
      return;
    }

    pushHistory();
    track('bulk_add');
    const additions = fresh.map((name) => ({
      id: createId(),
      name,
      group: bulkGroup,
      stage: 'pray',
      notes: '',
      parentId: null,
    }));
    setMapData((current) => ({ ...current, people: [...current.people, ...additions] }));
    setSelectedId(additions[0].id);
    setBulkText('');
    const skipped = names.length - fresh.length;
    setSaveState(
      `Added ${additions.length} ${additions.length === 1 ? 'name' : 'names'}${skipped ? ` · ${skipped} already there` : ''}`,
    );
  }

  function deletePerson(id) {
    pushHistory();
    const descendants = getDescendantIds(mapData.people, id);
    const remaining = mapData.people.filter((person) => !descendants.has(person.id));
    setMapData((current) => ({ ...current, people: remaining }));
    setSelectedId(remaining[0]?.id ?? null);
    setSaveState('Saved locally');
  }

  function resetMap(blank = false) {
    pushHistory();
    const fresh = createFreshMap(blank);
    setMapData(fresh);
    setSelectedId(fresh.people[0]?.id ?? null);
    setSaveState('Saved locally');
  }

  function applyTemplate(template) {
    pushHistory();
    const fresh = template.make();
    setMapData(fresh);
    setSelectedId(fresh.people[0]?.id ?? null);
    setSaveState(`${template.label} loaded`);
  }

  function changeStage(person, stageId) {
    if (person.stage === stageId) return;
    pushHistory();
    updatePerson(person.id, { stage: stageId });
    if (stageId === 'disciple') launchConfetti();
  }

  function advanceSelectedPerson() {
    if (!selectedPerson) return;
    const currentIndex = stages.findIndex((stage) => stage.id === selectedPerson.stage);
    const nextStage = stages[currentIndex + 1];
    if (!nextStage) {
      launchConfetti();
      setSaveState('Ready to multiply');
      return;
    }
    changeStage(selectedPerson, nextStage.id);
    setSaveState(`${selectedPerson.name} is ready to ${nextStage.label.toLowerCase()}`);
  }

  function saveNow() {
    setSaveState(writeStoredMap(mapData) ? 'Saved locally' : 'Download to keep');
  }

  function downloadJson() {
    track('export_json');
    downloadBlob(
      new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' }),
      `${slugify(mapData.mapTitle)}.json`,
    );
  }

  function downloadPrayerPlan() {
    track('export_plan');
    downloadBlob(new Blob([buildPrayerPlan(mapData)], { type: 'text/plain;charset=utf-8' }), `${slugify(mapData.mapTitle)}-prayer-plan.txt`);
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const importedMap = sanitizeImportedMap(JSON.parse(String(reader.result)));
        pushHistory();
        setMapData(importedMap);
        setSelectedId(importedMap.people[0]?.id ?? null);
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
    track('share_tool');
    const shareData = {
      title: 'Free Oikos Map Builder',
      text: 'Create a free Oikos Map and pray intentionally for the people God has placed around you.',
      url: SITE_URL,
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

  async function copyPrayerPlan() {
    track('copy_plan');
    setPlanCopyState((await copyText(buildPrayerPlan(mapData))) ? 'Copied!' : 'Copy failed');
    window.setTimeout(() => setPlanCopyState('Plan'), 1800);
  }

  async function copyTodayFocus(person) {
    if (!person) return;
    setCoachCopyState((await copyText(buildTodayFocus(person))) ? 'Copied!' : 'Copy failed');
    window.setTimeout(() => setCoachCopyState('Copy step'), 1800);
  }

  function printMap() {
    track('print_map');
    window.print();
  }

  async function copyMapLink() {
    track('share_link');
    try {
      const url = `${SITE_URL}/#map=${encodeMapToHash(mapData)}`;
      setMapLinkState((await copyText(url)) ? 'Copied!' : 'Copy failed');
    } catch {
      setMapLinkState('Copy failed');
    }
    window.setTimeout(() => setMapLinkState('Link'), 1800);
  }

  function getSvgMarkup() {
    if (!svgRef.current) return null;
    const svg = svgRef.current.cloneNode(true);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', layout.width);
    svg.setAttribute('height', layout.height);
    return new XMLSerializer().serializeToString(svg);
  }

  function downloadSvg() {
    track('export_svg');
    const svgMarkup = getSvgMarkup();
    if (!svgMarkup) {
      setSaveState('SVG export failed');
      return;
    }
    downloadBlob(new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' }), `${slugify(mapData.mapTitle)}.svg`);
  }

  function downloadPng() {
    track('export_png');
    const svgMarkup = getSvgMarkup();
    if (!svgMarkup) {
      setSaveState('PNG export failed');
      return;
    }
    const image = new Image();
    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = layout.width * 2;
      canvas.height = layout.height * 2;
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(url);
        setSaveState('PNG export failed');
        return;
      }
      context.fillStyle = '#fffaf3';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.scale(2, 2);
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, `${slugify(mapData.mapTitle)}.png`);
        else setSaveState('PNG export failed');
      }, 'image/png');
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      setSaveState('PNG export failed');
    };

    image.src = url;
  }

  const rootCount = mapData.people.filter((person) => !person.parentId).length;
  const secondDegreeCount = mapData.people.length - rootCount;
  const stageCounts = stages.map((stage) => ({
    ...stage,
    count: mapData.people.filter((person) => person.stage === stage.id).length,
  }));
  const actionedCount = mapData.people.filter((person) => person.stage !== 'pray').length;
  const movementPercent = mapData.people.length ? Math.round((actionedCount / mapData.people.length) * 100) : 0;
  const mapMilestones = [
    { done: mapData.centerName.trim() && mapData.centerName !== 'Your Name', label: 'Name your centre' },
    { done: mapData.people.length >= 5, label: 'Add five names' },
    { done: mapData.people.some((person) => String(person.notes || '').trim()), label: 'Add a prayer focus' },
    { done: actionedCount > 0, label: 'Choose one next step' },
  ];
  const completedMilestones = mapMilestones.filter((milestone) => milestone.done).length;
  const coachPeople = [...mapData.people]
    .sort((left, right) => {
      const stageDifference = stages.findIndex((stage) => stage.id === left.stage) - stages.findIndex((stage) => stage.id === right.stage);
      if (stageDifference) return stageDifference;
      return left.name.localeCompare(right.name);
    })
    .slice(0, 4);

  return (
    <main>
      <ScrollEffects />
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <HeartHandshake size={18} aria-hidden="true" />
            Free for every believer, church, youth ministry, and disciple-maker
          </p>
          <h1>
            <span>See the people</span>{' '}
            <span>God has placed</span>{' '}
            <span className="hero-accent">around you.</span>
          </h1>
          <p className="hero-lede">
            Build a simple, prayerful Oikos Map that turns names into intentional love, conversations, and disciple-making
            vision.
          </p>
          <p className="hero-definition">
            <strong>What is an Oikos Map?</strong> A clear, visual way to pray for and love the people God has already
            placed in your everyday world.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#builder">
              <Sparkles size={18} aria-hidden="true" />
              Create your map
            </a>
            <a className="secondary-action" href="/about">
              <ArrowDownToLine size={18} aria-hidden="true" />
              Read the heart
            </a>
          </div>
          <ul className="hero-proof" aria-label="What you get">
            <li><ShieldCheck size={16} aria-hidden="true" /> Free, no account</li>
            <li><Save size={16} aria-hidden="true" /> Saved on your device</li>
            <li><BookOpen size={16} aria-hidden="true" /> {sortedPostsMeta.length} practical guides</li>
            <li><FileText size={16} aria-hidden="true" /> Printable &amp; calendar reminder</li>
          </ul>
          <p className="powered">
            <PoweredBy /> · <CollaborationCredit />
          </p>
        </div>

        <HeroConstellation />
      </section>

      <section className="builder-section" id="builder" aria-labelledby="builder-title" data-reveal>
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
          <div className="control-panel setup-panel" aria-label="Set up your map">
            <details className="panel-fold" open={!compact}>
              <summary>
                <WandSparkles size={16} aria-hidden="true" />
                Map title, centre name &amp; templates
              </summary>
              <div className="fold-body">
            <label>
              Map title
              <input value={mapData.mapTitle} onChange={(event) => updateMap({ mapTitle: event.target.value })} />
            </label>

            <label>
              Center name
              <input value={mapData.centerName} onChange={(event) => updateMap({ centerName: event.target.value })} />
            </label>

            <div className="template-picker" aria-label="Map templates">
              <div className="panel-title">
                <WandSparkles size={18} aria-hidden="true" />
                <span>Start with a context</span>
              </div>
              <div className="template-grid">
                {mapTemplates.map((template) => {
                  const TemplateIcon = template.icon;
                  return (
                    <button type="button" className="template-option" onClick={() => applyTemplate(template)} key={template.id} title={template.detail}>
                      <TemplateIcon size={16} aria-hidden="true" />
                      <span>{template.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

              </div>
            </details>

            <div className="bulk-add">
              <div className="panel-title">
                <Users size={18} aria-hidden="true" />
                <span>Add several at once</span>
              </div>
              <label className="bulk-label">
                Paste or type names, one per line or comma separated
                <textarea
                  rows="3"
                  value={bulkText}
                  onChange={(event) => setBulkText(event.target.value)}
                  placeholder={'Mum\nJordan, Sam\nLeah'}
                />
              </label>
              <div className="bulk-row">
                <label>
                  Circle
                  <select value={bulkGroup} onChange={(event) => setBulkGroup(event.target.value)}>
                    {groups.map((group) => (
                      <option value={group.id} key={group.id}>
                        {group.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={addManyPeople} disabled={!parseNameList(bulkText).length}>
                  <UserPlus size={17} aria-hidden="true" />
                  {(() => {
                    const count = parseNameList(bulkText).length;
                    return count ? `Add ${count}` : 'Add names';
                  })()}
                </button>
              </div>
            </div>

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

          </div>

          <div className="control-panel editor-panel" aria-label="Selected person">
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
                      onChange={(event) => changeStage(selectedPerson, event.target.value)}
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

          </div>

          <div className="control-panel coach-panel" aria-label="Map coach">
            <div className="map-coach" aria-live="polite">
              <div className="coach-heading">
                <span><Compass size={18} aria-hidden="true" /> Map coach</span>
                <small>{mapData.people.length ? `${movementPercent}% taking a next step` : 'Begin with one name'}</small>
              </div>
              <div className="coach-checklist" aria-label={`Map readiness: ${completedMilestones} of ${mapMilestones.length} complete`}>
                <span className="coach-checklist-title">Map readiness · {completedMilestones}/{mapMilestones.length}</span>
                <div>
                  {mapMilestones.map((milestone) => (
                    <span className={milestone.done ? 'coach-check done' : 'coach-check'} key={milestone.label}>
                      <CheckCircle2 size={14} aria-hidden="true" />
                      {milestone.label}
                    </span>
                  ))}
                </div>
              </div>
              {selectedPerson ? (
                <>
                  <div className="coach-focus">
                    <span className="coach-focus-dot" style={{ backgroundColor: getGroup(selectedPerson.group).color }} aria-hidden="true" />
                    <div>
                      <strong>Today: {selectedPerson.name}</strong>
                      <p>{selectedStage.prompt}</p>
                    </div>
                  </div>
                  {coachPeople.length > 1 ? (
                    <div className="coach-people" aria-label="Choose a person to focus on">
                      {coachPeople.map((person) => (
                        <button
                          type="button"
                          className={person.id === selectedPerson.id ? 'coach-person active' : 'coach-person'}
                          key={person.id}
                          onClick={() => setSelectedId(person.id)}
                          title={`Focus on ${person.name}`}
                        >
                          {person.name}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <div className="coach-actions">
                    <button type="button" className="coach-action" onClick={() => copyTodayFocus(selectedPerson)}>
                      <Clipboard size={17} aria-hidden="true" />
                      {coachCopyState}
                    </button>
                    <button type="button" className="coach-action coach-advance" onClick={advanceSelectedPerson}>
                      <CheckCircle2 size={17} aria-hidden="true" />
                      {selectedStage.id === 'disciple' ? 'Celebrate' : `Move to ${stages[stages.findIndex((stage) => stage.id === selectedStage.id) + 1].label}`}
                    </button>
                  </div>
                  <PrayerSprint
                    person={selectedPerson}
                    stage={selectedStage}
                    onComplete={() => setSaveState(`Prayer time complete for ${selectedPerson.name}`)}
                  />
                  <ConversationCard person={selectedPerson} stage={selectedStage} />
                </>
              ) : (
                <p>Add someone you already know. The first name is enough to begin.</p>
              )}
            </div>

          </div>

          <div className="control-panel tools-panel" aria-label="Save, download and remind">
            <details className="panel-fold" open={!compact}>
              <summary>
                <Download size={16} aria-hidden="true" />
                Save, download, print &amp; remind
              </summary>
              <div className="fold-body">
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
                <FileImage size={18} aria-hidden="true" />
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
              <button type="button" onClick={copyPrayerPlan} title="Copy the prayer plan to your clipboard">
                <Clipboard size={18} aria-hidden="true" />
                {planCopyState === 'Plan' ? 'Copy' : planCopyState}
              </button>
              <button type="button" onClick={printMap} title="Print your map">
                <Printer size={18} aria-hidden="true" />
                Print
              </button>
              <button type="button" onClick={undoLastChange} disabled={!canUndo} title="Undo the last structural change">
                <Undo2 size={18} aria-hidden="true" />
                Undo
              </button>
              <button type="button" onClick={() => fileInputRef.current?.click()} title="Import JSON map">
                <Upload size={18} aria-hidden="true" />
                Import
              </button>
              <button type="button" onClick={copyMapLink} title="Copy a private link that carries this exact map">
                <Link2 size={18} aria-hidden="true" />
                {mapLinkState}
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
            <PrayerReminder mapData={mapData} />
            <p className="printable-note">
              <FileText size={16} aria-hidden="true" />
              <span>
                Prefer paper, or need copies for a group?{' '}
                <a href="/downloads/oikos-map-template.pdf" download>Download the free printable</a>
                {' '}·{' '}
                <a href="/blog/free-printable-oikos-map-template">how to use it</a>
              </span>
            </p>
              </div>
            </details>
          </div>

          <div className="map-stage">
            <div className="map-journey" aria-label="Oikos map progress">
              <div>
                <span>Map momentum</span>
                <strong>{mapData.people.length ? `${mapData.people.length} names held in prayer · ${actionedCount} with a next step` : 'Your map is ready for its first name'}</strong>
              </div>
              <div className="stage-meter">
                {stageCounts.map((stage) => (
                  <span key={stage.id} style={{ '--stage-size': `${Math.min(Math.max(stage.count, 1), 10)}` }} title={`${stage.label}: ${stage.count}`}>
                    <b>{stage.count}</b>{stage.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="map-toolbar">
              <button type="button" onClick={() => addPerson(null)}>
                <Plus size={16} aria-hidden="true" />
                Add a name
              </button>
              <button
                type="button"
                className="map-zoom"
                onClick={() => setZoomed((value) => !value)}
                aria-pressed={zoomed}
              >
                <Search size={16} aria-hidden="true" />
                {zoomed ? 'Fit to screen' : 'Larger map'}
              </button>
              <span className="map-hint">Tap a name to edit it</span>
            </div>
            <div className={zoomed ? 'map-canvas zoomed' : 'map-canvas'}>
              <OikosSvg
                mapData={mapData}
                layout={layout}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                svgRef={svgRef}
                compact={compact}
              />
            </div>
          </div>
        </div>

        <BuilderInvite mapData={mapData} />
      </section>

      <RhythmStrip />

      <LatestArticles />

      <WhyTeaser />

      <NetworkTeaser />

      <FaqTeaser />

      <section className="lead-section" id="resources" aria-labelledby="resources-title" data-reveal>
        <div className="lead-pitch">
          <p className="section-kicker">
            <Mail size={18} aria-hidden="true" />
            The Oikos Journey · free
          </p>
          <h2 id="resources-title">A map is a good start. Then comes the walk.</h2>
          <p className="lead-lede">
            Most of us do not need more information — we need someone walking beside us. So over two weeks we will send you
            six short emails through the rhythm this whole map is built on: <strong>pray, care, share, disciple</strong>.
          </p>
          <p className="lead-lede">
            No guilt, no pressure, no fundraising. Just encouragement, honest next steps, and the reminder that keeps all of
            this in proportion: <strong>one plants, another waters, God makes it grow.</strong> You are not carrying the
            mission — you are playing your part in it.
          </p>
          <JourneyTimeline />
        </div>
        <LeadCapture mapData={mapData} />
      </section>

      <section className="closing-band" data-reveal>
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
      <StickyInvite />
    </main>
  );
}

function OikosSvg({ mapData, layout, selectedId, setSelectedId, svgRef, compact = false }) {
  const { width, height, center, positions } = layout;
  // Inline so the PNG/SVG exports carry the same type as the screen.
  const titleSize = compact ? 30 : 42;
  const subtitleSize = compact ? 15 : 20;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className={compact ? 'compact' : undefined}
      role="img"
      aria-label={`${mapData.mapTitle} Oikos Map`}
    >
      <defs>
        <style>{`
          .svg-title { fill: #26201c; font: 950 ${titleSize}px Inter, Arial, sans-serif; }
          .svg-subtitle { fill: #5c5047; font: 800 ${subtitleSize}px Inter, Arial, sans-serif; }
          .svg-center-label, .svg-person-name { fill: #26201c; font: 950 ${compact ? 26 : 22}px Inter, Arial, sans-serif; }
          .svg-center-caption, .svg-person-stage { fill: #6a5d52; font: 850 ${compact ? 20 : 18}px Inter, Arial, sans-serif; }
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
      <text x={compact ? 28 : 56} y={compact ? 48 : 76} className="svg-title">
        {mapData.mapTitle}
      </text>
      <text x={compact ? 28 : 56} y={compact ? 76 : 112} className="svg-subtitle">
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
        // Larger on phones: the compact canvas is scaled to ~50%, so 76 units
        // renders at about 38px — a comfortable tap target with readable names.
        const radius = compact ? (person.parentId ? 58 : 76) : person.parentId ? 52 : 64;
        const stageLabel = stages.find((stage) => stage.id === person.stage)?.label || 'Pray';
        return (
          <g
            className="map-node"
            key={person.id}
            transform={`translate(${position.x} ${position.y})`}
            onClick={() => setSelectedId(person.id)}
            onKeyDown={(event) => {
              // role="button" promises Space as well as Enter.
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSelectedId(person.id);
              }
            }}
            tabIndex="0"
            role="button"
            aria-pressed={isSelected}
            // Starts with the visible text exactly as shown (name, then stage, no
            // punctuation between) so voice-control users can say what they see
            // (WCAG 2.5.3).
            aria-label={`${person.name} ${stageLabel} — edit`}
          >
            <circle r={radius + 9} fill={isSelected ? '#171310' : '#ffffff'} opacity={isSelected ? 1 : 0.78} />
            <circle r={radius} fill={group.color} />
            <circle r={radius - 9} fill="#fffdf7" opacity="0.96" />
            <text y="-4" textAnchor="middle" className="svg-person-name">
              {truncateLabel(person.name)}
            </text>
            <text y="24" textAnchor="middle" className="svg-person-stage">
              {stageLabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Blog routes are served by src/blog-entry.jsx, so they never reach this file.
export const routes = {
  '/connect': () => <ConnectPage />,
  '/growth': () => <GrowthPage />,
  '/about': () => <AboutPage />,
  '/faq': () => <FaqPage />,
  '/network': () => <NetworkPage />,
  '/': () => <App />,
};

// Sections that used to be homepage anchors and now live on their own pages,
// so old links (/#vision, /#mission …) still land on the content.
const MOVED_ANCHORS = {
  '#vision': '/about#vision',
  '#mission': '/about#mission',
  '#next-steps': '/about#next-steps',
  '#jesus': '/about#jesus',
};

export { App, ConnectPage, GrowthPage, AboutPage, FaqPage, NetworkPage };

// Mount only in the browser; scripts/prerender.mjs imports this module in Node
// to render the same tree to HTML at build time.
if (typeof document !== 'undefined') {
  const routePath = window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  if (routePath === '/' && MOVED_ANCHORS[window.location.hash]) {
    window.location.replace(MOVED_ANCHORS[window.location.hash]);
  }
  const container = document.getElementById('root');
  const page = (routes[routePath] || routes['/'])();

  if (container.__oikosRoot) {
    // HMR: reuse the root instead of creating a second one.
    container.__oikosRoot.render(page);
  } else {
    // The prerendered HTML is a first-time visitor's view. Hydrate it when that
    // is what this visitor will see; a returning visitor's saved map (or a
    // shared #map= link) renders differently, so build fresh rather than
    // hydrate a tree that is bound to mismatch.
    const personalised = routePath === '/' && (readStoredMap() || window.location.hash.startsWith('#map='));
    const prerendered = container.firstElementChild && !personalised;
    container.__oikosRoot = prerendered
      ? hydrateRoot(container, page, {
          onRecoverableError: (error) => {
            if (import.meta.env.DEV) console.warn('Hydration recovered:', error);
          },
        })
      : createRoot(container);
    if (!prerendered) container.__oikosRoot.render(page);
  }

  if (!container.__oikosTracking) {
    container.__oikosTracking = true;
    trackOutboundClicks();
  }

  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}
