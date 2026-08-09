import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
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
  Plus,
  Printer,
  RotateCcw,
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
import { networkGroups, sitesInGroup } from './content/network.js';
import './styles.css';

const STORAGE_KEY = 'love-on-the-world-oikos-map-v1';
const SUBSCRIBED_KEY = 'oikos-journey-subscribed-v1';
const INVITE_DISMISSED_KEY = 'oikos-invite-dismissed-v1';
const JOURNEY_EVENT = 'oikos:journey-started';
const SITE_URL = 'https://www.oikosmap.com';

function readFlag(key) {
  try {
    return window.localStorage?.getItem(key) === '1';
  } catch {
    return false;
  }
}

function writeFlag(key) {
  try {
    window.localStorage?.setItem(key, '1');
  } catch {
    // A blocked localStorage only means the nudge may reappear later.
  }
}

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

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `oikos-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const starterPeople = [
  {
    id: createId(),
    name: 'Aunt Maria',
    group: 'family',
    stage: 'pray',
    notes: 'Pray for peace and an open door.',
    parentId: null,
  },
  {
    id: createId(),
    name: 'Jordan',
    group: 'friends',
    stage: 'care',
    notes: 'Invite for coffee this week.',
    parentId: null,
  },
  {
    id: createId(),
    name: 'Sam',
    group: 'work',
    stage: 'share',
    notes: 'Share a short hope story.',
    parentId: null,
  },
  {
    id: createId(),
    name: 'Leah',
    group: 'neighbors',
    stage: 'pray',
    notes: '',
    parentId: null,
  },
  {
    id: createId(),
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
    let observerReported = false;
    const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
    const revealObserver = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
        (entries) => {
          observerReported = true;
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver?.unobserve(entry.target);
            }
          });
        },
        // Sections can be taller than the viewport, where a fractional threshold
        // is unreachable and the content would never reveal. Trigger on the
        // leading edge instead.
        { threshold: 0, rootMargin: '0px 0px -12% 0px' },
      );

    if (revealObserver) revealItems.forEach((item) => revealObserver.observe(item));
    else revealItems.forEach((item) => item.classList.add('is-visible'));

    // Fail-safe: content must never be stranded at opacity 0. The observer
    // reports on its first tick even when nothing intersects, so silence here
    // means callbacks are not running at all (prerender, some headless
    // environments). Only then do we drop the animation and show everything.
    const failSafe = window.setTimeout(() => {
      if (observerReported) return;
      revealItems.forEach((item) => item.classList.add('is-visible'));
      revealObserver?.disconnect();
    }, 2500);

    function update() {
      frame = 0;
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
    window.addEventListener('pointermove', updatePointer, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      window.removeEventListener('pointermove', updatePointer);
      revealObserver?.disconnect();
      window.clearTimeout(failSafe);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}

function getLeadMapStats(mapData) {
  if (!mapData) return undefined;
  const firstCircleCount = mapData.people.filter((person) => !person.parentId).length;
  return {
    mapTitle: mapData.mapTitle,
    centerName: mapData.centerName,
    peopleCount: mapData.people.length,
    firstCircleCount,
    branchCount: mapData.people.length - firstCircleCount,
  };
}

function LeadCapture({ compact = false, mapData = null }) {
  const [lead, setLead] = useState({
    name: '',
    email: '',
    interest: adLeadOptions[0],
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

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
          referrer: document.referrer,
          source: 'oikosmap.com',
          mapStats: getLeadMapStats(mapData),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Something went wrong. Please try again in a moment.');
      setStatus('sent');
      setLead({ name: '', email: '', interest: adLeadOptions[0] });
      writeFlag(SUBSCRIBED_KEY);
      window.dispatchEvent(new CustomEvent(JOURNEY_EVENT));
    } catch (error) {
      setErrorMessage(
        error instanceof TypeError
          ? 'We could not reach the server. Please check your connection and try again.'
          : error.message || 'Something went wrong. Please try again in a moment.',
      );
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className={compact ? 'lead-form compact-form lead-done' : 'lead-form lead-done'} aria-live="polite">
        <span className="lead-done-badge" aria-hidden="true">
          <CheckCircle2 size={26} />
        </span>
        <h3>Check your inbox.</h3>
        <p>
          Your starter kit is on its way, and the first email of the Oikos Journey should land within a minute or two. If
          you do not see it, have a quick look in promotions or spam and drag it across.
        </p>
        <p className="lead-done-note">
          One email today, then five more over the next two weeks. Unsubscribe in one click, any time.
        </p>
      </div>
    );
  }

  return (
    <form className={compact ? 'lead-form compact-form' : 'lead-form'} onSubmit={submitLead}>
      <div>
        <p className="form-kicker">
          <Sparkles size={14} aria-hidden="true" />
          Free · 6 emails · 2 weeks
        </p>
        <h3>{compact ? 'Walk the Oikos Journey with us.' : 'Start the Oikos Journey.'}</h3>
        <p>
          Six short emails that take you through praying, caring, sharing, and discipling the people already around you —
          plus the starter kit to get going today.
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
        {status === 'sending' ? 'Sending...' : 'Send me the first email'}
      </button>
      <p className="lead-privacy">
        <ShieldCheck size={14} aria-hidden="true" />
        No spam, ever. Your map stays private in your browser — we never see it.
      </p>
      <div aria-live="polite">{status === 'error' && <p className="form-status error">{errorMessage}</p>}</div>
    </form>
  );
}

// Showing people the actual emails they will receive converts far better than
// asking them to trust the word "resources".
const journeyEmails = [
  {
    when: 'Today',
    title: 'Your oikos is not an accident',
    note: 'The starter kit, and why the people around you are not random.',
  },
  { when: 'Day 2', title: 'Start with one name', note: 'The five-minute prayer rhythm that changes how you see people.' },
  { when: 'Day 4', title: 'Love that shows up', note: 'Seven ordinary ways to move toward someone this week.' },
  { when: 'Day 7', title: 'Your story is enough', note: 'How to share your testimony in about three minutes.' },
  { when: 'Day 10', title: 'And then they reach theirs', note: 'Where one map quietly becomes a movement.' },
  { when: 'Day 14', title: 'You play a real role', note: 'The bigger picture, and where to go next.' },
];

// Appears only once someone has actually built something, and only once.
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

function JourneyTimeline() {
  return (
    <ol className="journey-timeline" aria-label="What arrives in your inbox">
      {journeyEmails.map((email) => (
        <li key={email.title}>
          <span className="journey-when">{email.when}</span>
          <div>
            <strong>{email.title}</strong>
            <small>{email.note}</small>
          </div>
        </li>
      ))}
    </ol>
  );
}

const faqItems = [
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
    question: 'Can I use the Oikos Map with my church or small group?',
    answer:
      'Absolutely. The tool works great for churches, small groups, youth ministries, and outreach teams. Each person can build their own map, and the templates make it easy to start in a household, campus, or workplace context.',
  },
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
            <div className="network-group" key={group.id}>
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

function FaqSection() {
  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-title" data-reveal>
      <div>
        <p className="section-kicker">
          <BookOpen size={18} aria-hidden="true" />
          Common questions
        </p>
        <h2 id="faq-title">Everything you need to know before you begin.</h2>
        <p className="faq-lede">
          Short, honest answers about the tool, your privacy, and how to use the map with your church or group.
        </p>
      </div>
      <div className="faq-list">
        {faqItems.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

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
            <a className="secondary-action" href="https://www.iamreborn.net" target="_blank" rel="noopener">
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
            <span>Find people</span>
            <span>running toward</span>
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

function computeLayout(people) {
  const roots = people.filter((person) => !person.parentId);
  // Grow the canvas once a single ring can no longer hold the first circle
  // without overlapping. Small maps keep the original 1100x820 exactly.
  const baseRadius = roots.length > 7 ? 286 : 248;
  const radius = Math.max(baseRadius, Math.round((Math.max(roots.length, 1) * 152) / (2 * Math.PI)));
  const span = (radius + 162) * 2;
  const width = Math.max(1100, span);
  const height = Math.max(820, span);
  const center = { x: width / 2, y: height / 2 };
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
  const [mapLinkState, setMapLinkState] = useState('Link');
  const [planCopyState, setPlanCopyState] = useState('Plan');
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
    setPlanCopyState((await copyText(buildPrayerPlan(mapData))) ? 'Copied!' : 'Copy failed');
    window.setTimeout(() => setPlanCopyState('Plan'), 1800);
  }

  function printMap() {
    window.print();
  }

  async function copyMapLink() {
    try {
      const url = `${SITE_URL}/#map=${encodeMapToHash(mapData)}`;
      setMapLinkState((await copyText(url)) ? 'Copied!' : 'Copy failed');
    } catch {
      setMapLinkState('Copy failed');
    }
    window.setTimeout(() => setMapLinkState('Link'), 1800);
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
  const stageCounts = stages.map((stage) => ({
    ...stage,
    count: mapData.people.filter((person) => person.stage === stage.id).length,
  }));
  const reachedCount = mapData.people.filter((person) => ['share', 'disciple'].includes(person.stage)).length;

  return (
    <main>
      <ScrollEffects />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Oikos Map Builder home">
          <LogoMark />
          <span>Oikos Map Builder</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#vision">Vision</a>
          <a href="#mission">Why it matters</a>
          <a href="#next-steps">Next steps</a>
          <a href="#builder">Create</a>
          <a href="/blog">Journal</a>
          <a href="#network">Network</a>
          <a href="#faq">FAQ</a>
          <a href="/growth">Growth</a>
          <a href="/connect">Connect</a>
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
          <p className="hero-definition">
            <strong>What is an Oikos Map?</strong> A clear, visual way to pray for and love the people God has already
            placed in your everyday world.
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
            <div className="hero-map-note">
              <span><Compass size={16} aria-hidden="true" /> Your mission field</span>
              <strong>Closer than you think.</strong>
              <small>Start with one name, one prayer, one next step.</small>
            </div>
          </div>
        </div>
      </section>

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

      <LatestArticles />

      <KingdomNetwork />

      <FaqSection />

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
          <aside className="control-panel" aria-label="Oikos Map controls">
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

            <div className="map-coach" aria-live="polite">
              <div className="coach-heading">
                <span><Compass size={18} aria-hidden="true" /> Map coach</span>
                <small>{mapData.people.length ? `${reachedCount} in share or disciple` : 'Begin with one name'}</small>
              </div>
              {selectedPerson ? (
                <>
                  <p><strong>{selectedPerson.name}</strong>: {selectedStage.prompt}</p>
                  <button type="button" className="coach-action" onClick={advanceSelectedPerson}>
                    <CheckCircle2 size={17} aria-hidden="true" />
                    {selectedStage.id === 'disciple' ? 'Celebrate and multiply' : `Move to ${stages[stages.findIndex((stage) => stage.id === selectedStage.id) + 1].label}`}
                  </button>
                </>
              ) : (
                <p>Add someone you already know. The first name is enough to begin.</p>
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
          </aside>

          <div className="map-stage">
            <div className="map-journey" aria-label="Oikos map progress">
              <div>
                <span>Map momentum</span>
                <strong>{mapData.people.length ? `${mapData.people.length} names held in prayer` : 'Your map is ready for its first name'}</strong>
              </div>
              <div className="stage-meter">
                {stageCounts.map((stage) => (
                  <span key={stage.id} style={{ '--stage-size': `${Math.min(Math.max(stage.count, 1), 10)}` }} title={`${stage.label}: ${stage.count}`}>
                    <b>{stage.count}</b>{stage.label}
                  </span>
                ))}
              </div>
            </div>
            <OikosSvg
              mapData={mapData}
              layout={layout}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              svgRef={svgRef}
            />
          </div>
        </div>

        <BuilderInvite mapData={mapData} />
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

// Blog routes are served by src/blog-entry.jsx, so they never reach this file.
const routes = {
  '/connect': <ConnectPage />,
  '/growth': <GrowthPage />,
};

const routePath = window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
const container = document.getElementById('root');
// Reuse the root across HMR updates instead of creating a second one.
container.__oikosRoot = container.__oikosRoot || createRoot(container);
container.__oikosRoot.render(routes[routePath] || <App />);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
