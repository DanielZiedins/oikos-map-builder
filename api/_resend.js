import { buildJourney, renderEmail, plainTextFallback } from './_journey.js';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const SITE_URL = 'https://www.oikosmap.com';

// Sends from the dedicated team.thykingdom.net sending domain. The address and
// reply-to are safe to default in code; the API key never is, because this
// repository is public — without it the sequence is skipped entirely.
const DEFAULT_FROM = 'Daniel at Oikos Map <oikos@team.thykingdom.net>';
const DEFAULT_REPLY_TO = 'hello@thykingdom.net';

function resendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    from: process.env.RESEND_FROM || DEFAULT_FROM,
    replyTo: process.env.RESEND_REPLY_TO || DEFAULT_REPLY_TO,
  };
}

export function unsubscribeUrl(token) {
  return `${SITE_URL}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}

async function sendOne(config, { to, block, unsubUrl }) {
  const payload = {
    from: config.from,
    to: [to],
    subject: block.subject,
    html: renderEmail(block, unsubUrl),
    text: plainTextFallback(block),
    headers: {
      'List-Unsubscribe': `<${unsubUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
  if (config.replyTo) payload.reply_to = config.replyTo;
  // Resend accepts natural-language offsets ("in 2 days") up to 30 days out,
  // which lets the whole drip be queued at signup with no scheduler of our own.
  if (block.delay) payload.scheduled_at = block.delay;

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return { ok: false, key: block.key, status: response.status, message: await response.text().catch(() => '') };
  }
  const result = await response.json().catch(() => ({}));
  return { ok: true, key: block.key, id: result.id };
}

/**
 * Sends the welcome email immediately and queues the remaining five.
 * Returns the Resend ids of the queued (future) emails so they can be cancelled
 * if the person later unsubscribes.
 */
export async function startJourney({ email, name, token }) {
  const config = resendConfig();
  if (!config) return { configured: false, scheduledIds: [] };

  const unsubUrl = unsubscribeUrl(token);
  const blocks = buildJourney(name);
  const scheduledIds = [];
  const failures = [];
  let welcomed = false;

  for (const block of blocks) {
    // One failure should not abandon the rest of the sequence.
    const result = await sendOne(config, { to: email, block, unsubUrl }).catch((error) => ({
      ok: false,
      key: block.key,
      message: String(error?.message || error),
    }));

    if (!result.ok) {
      failures.push(result);
      continue;
    }
    if (block.delay && result.id) scheduledIds.push(result.id);
    if (!block.delay) welcomed = true;
  }

  return { configured: true, welcomed, scheduledIds, failures };
}

export async function cancelScheduled(ids) {
  const config = resendConfig();
  if (!config || !Array.isArray(ids) || !ids.length) return { cancelled: 0 };

  let cancelled = 0;
  for (const id of ids) {
    if (typeof id !== 'string' || !id) continue;
    const response = await fetch(`${RESEND_ENDPOINT}/${encodeURIComponent(id)}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}` },
    }).catch(() => null);
    if (response?.ok) cancelled += 1;
  }
  return { cancelled };
}
