// Shared Oikos Journey signup, used by both entry points. It lived in main.jsx,
// which meant the journal — the part of the site that actually attracts traffic —
// had no way to subscribe at all.
import React, { useState } from 'react';
import { CheckCircle2, Mail, ShieldCheck, Sparkles } from 'lucide-react';

export const SUBSCRIBED_KEY = 'oikos-journey-subscribed-v1';
export const INVITE_DISMISSED_KEY = 'oikos-invite-dismissed-v1';
export const JOURNEY_EVENT = 'oikos:journey-started';

export function readFlag(key) {
  try {
    return window.localStorage?.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function writeFlag(key) {
  try {
    window.localStorage?.setItem(key, '1');
  } catch {
    // A blocked localStorage only means the nudge may reappear later.
  }
}

export const adLeadOptions = [
  'Send me the Oikos starter kit',
  'I want to start an outreach group',
  'I want to impact culture with faith',
  'I want to follow Jesus',
  'I want personal growth and community',
];

export function getLeadMapStats(mapData) {
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

export function LeadCapture({ compact = false, mapData = null, source = 'oikosmap.com' }) {
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
          source,
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
export const journeyEmails = [
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

export function JourneyTimeline() {
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
