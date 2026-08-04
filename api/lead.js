import { startJourney } from './_resend.js';

const allowedInterests = new Set([
  'Send me the Oikos starter kit',
  'I want to start an outreach group',
  'I want to impact culture with faith',
  'I want to follow Jesus',
  'I want personal growth and community',
]);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clampText(value, maxLength) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  if (!text) return null;
  return text.slice(0, maxLength);
}

function clampCount(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(500, Math.round(number)));
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { base: `${url.replace(/\/$/, '')}/rest/v1`, key };
}

function supabaseHeaders(config, extra = {}) {
  return {
    apikey: config.key,
    Authorization: `Bearer ${config.key}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function insertSupabaseLead(config, payload) {
  const supabaseResponse = await fetch(`${config.base}/oikos_map_leads`, {
    method: 'POST',
    headers: supabaseHeaders(config, { Prefer: 'return=minimal' }),
    body: JSON.stringify(payload),
  });

  if (!supabaseResponse.ok) {
    return {
      ok: false,
      status: supabaseResponse.status,
      message: await supabaseResponse.text().catch(() => ''),
    };
  }

  return { ok: true };
}

async function callRpc(config, name, body) {
  const response = await fetch(`${config.base}/rpc/${name}`, {
    method: 'POST',
    headers: supabaseHeaders(config),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`${name} responded ${response.status}`);
  return response.json().catch(() => null);
}

// Both of these run through token-gated SECURITY DEFINER functions, so the
// sequence works with only the anon key — anon never gets SELECT or UPDATE.
async function claimJourney(config, token) {
  return callRpc(config, 'oikos_journey_claim', { p_token: token });
}

async function recordScheduledIds(config, token, scheduledIds) {
  if (!scheduledIds.length) return;
  await callRpc(config, 'oikos_journey_record', { p_token: token, p_ids: scheduledIds });
}

async function forwardToGoHighLevel(payload) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) return { configured: false };

  const ghlResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: payload.name || '',
      email: payload.email,
      interest: payload.interest,
      source: payload.source,
      page: payload.page,
      submittedAt: payload.created_at,
      tags: ['oikos-map-builder', 'ads-lead', payload.interest],
      metadata: payload.metadata,
    }),
  });

  return {
    configured: true,
    ok: ghlResponse.ok,
    status: ghlResponse.status,
  };
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = request.body || {};
    const email = String(body.email || '').trim().toLowerCase();
    const name = clampText(body.name, 120);
    const interest = allowedInterests.has(body.interest) ? body.interest : 'Send me the Oikos starter kit';

    if (!isValidEmail(email)) {
      return response.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const token = crypto.randomUUID();
    const mapStats = body.mapStats || {};
    const payload = {
      created_at: new Date().toISOString(),
      name,
      email,
      interest,
      source: clampText(body.source, 80) || 'oikosmap.com',
      page: clampText(body.page, 500) || '/',
      referrer: clampText(body.referrer, 500),
      user_agent: clampText(request.headers['user-agent'], 500),
      map_title: clampText(mapStats.mapTitle, 140),
      center_name: clampText(mapStats.centerName, 120),
      people_count: clampCount(mapStats.peopleCount),
      first_circle_count: clampCount(mapStats.firstCircleCount),
      branch_count: clampCount(mapStats.branchCount),
      unsub_token: token,
      metadata: {
        path: clampText(body.page, 500) || '/',
        source: 'oikos-map-builder',
      },
    };

    const config = supabaseConfig();
    let stored = false;

    if (config) {
      const result = await insertSupabaseLead(config, payload);
      if (!result.ok) {
        return response.status(502).json({ error: 'We could not save your details. Please try again.' });
      }
      stored = true;
    }

    // Store the lead first, then start the email journey, so a Resend outage
    // never costs us the signup itself. The claim both de-duplicates repeat
    // submissions and marks this row as welcomed.
    const claimed = config ? await claimJourney(config, token).catch(() => true) : true;
    const journey = claimed
      ? await startJourney({ email, name, token }).catch(() => ({ configured: true, welcomed: false, scheduledIds: [] }))
      : { configured: true, welcomed: false, scheduledIds: [], skipped: 'already-subscribed' };

    if (config && journey.scheduledIds?.length) {
      await recordScheduledIds(config, token, journey.scheduledIds).catch(() => {});
    }

    const ghlResult = await forwardToGoHighLevel(payload).catch(() => ({ configured: true, ok: false }));

    if (!config && !ghlResult.configured && !journey.configured) {
      return response.status(503).json({
        error: 'Lead capture is ready, but it has not been connected in Vercel yet.',
      });
    }

    return response.status(200).json({
      ok: true,
      stored,
      forwarded: Boolean(ghlResult.ok),
      journeyStarted: Boolean(journey.welcomed),
    });
  } catch {
    return response.status(500).json({ error: 'Unable to submit lead.' });
  }
}
