// Builds a daily "Pray for my oikos" calendar event (.ics, RFC 5545) from a map.
// Generated entirely in the browser: the names go into a file on the person's
// own device and their own calendar, never to a server — the same privacy
// promise as the map itself.

function pad(value) {
  return String(value).padStart(2, '0');
}

// Floating local time (no Z / TZID): "07:30" means 07:30 wherever the person is,
// which is what a daily prayer habit wants, even across time zones.
function localStamp(date, hours, minutes) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(hours)}${pad(minutes)}00`;
}

function utcStamp(date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(
    date.getUTCMinutes(),
  )}${pad(date.getUTCSeconds())}Z`;
}

// TEXT values escape backslash, semicolon, comma and newlines (RFC 5545 3.3.11).
function escapeText(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

// Lines longer than 75 octets are folded with CRLF + space (RFC 5545 3.1),
// counting UTF-8 bytes so accented names and emoji are not split mid-character.
function fold(line) {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;
  const parts = [];
  let current = '';
  let size = 0;
  for (const char of line) {
    const bytes = encoder.encode(char).length;
    const limit = parts.length ? 74 : 75;
    if (size + bytes > limit) {
      parts.push(current);
      current = '';
      size = 0;
    }
    current += char;
    size += bytes;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

export function buildPrayerReminderIcs(mapData, time = '07:30', now = new Date()) {
  const [hours, minutes] = String(time)
    .split(':')
    .map((part) => Number.parseInt(part, 10));
  const safeHours = Number.isFinite(hours) ? Math.min(Math.max(hours, 0), 23) : 7;
  const safeMinutes = Number.isFinite(minutes) ? Math.min(Math.max(minutes, 0), 59) : 30;

  // Start tomorrow so the first reminder is never already in the past.
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const names = (mapData.people || []).map((person) => String(person.name || '').trim()).filter(Boolean);
  const focus = names.slice(0, 5);
  const more = names.length - focus.length;

  const description = [
    focus.length ? `Pray by name for: ${focus.join(', ')}${more > 0 ? ` (and ${more} more on your map)` : ''}.` : 'Pray by name for the people on your Oikos Map.',
    '',
    'Ask God to open their eyes (2 Corinthians 4:4), soften their hearts, and show you one way to love them today.',
    '',
    'Five-minute prayer timer and a verse for each person: https://www.oikosmap.com/#builder',
  ].join('\n');

  const uid = `prayer-reminder-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}@oikosmap.com`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Oikos Map//Prayer reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${localStamp(start, safeHours, safeMinutes)}`,
    'DURATION:PT5M',
    'RRULE:FREQ=DAILY',
    `SUMMARY:${escapeText('Pray for my oikos (5 minutes)')}`,
    `DESCRIPTION:${escapeText(description)}`,
    'URL:https://www.oikosmap.com/#builder',
    'TRANSP:TRANSPARENT',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText('Time to pray for your oikos')}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(fold).join('\r\n')}\r\n`;
}
