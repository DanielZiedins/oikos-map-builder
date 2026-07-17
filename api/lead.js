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

async function insertSupabaseLead(payload) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { configured: false };
  }

  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/oikos_map_leads`;
  const supabaseResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!supabaseResponse.ok) {
    return {
      configured: true,
      ok: false,
      status: supabaseResponse.status,
      message: await supabaseResponse.text().catch(() => ''),
    };
  }

  return { configured: true, ok: true };
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
      metadata: {
        path: clampText(body.page, 500) || '/',
        source: 'oikos-map-builder',
      },
    };

    const supabaseResult = await insertSupabaseLead(payload);
    if (supabaseResult.configured && !supabaseResult.ok) {
      return response.status(502).json({ error: 'Supabase rejected the lead.' });
    }

    const ghlResult = await forwardToGoHighLevel(payload).catch(() => ({ configured: true, ok: false }));
    if (!supabaseResult.configured && !ghlResult.configured) {
      return response.status(503).json({
        error: 'Lead capture is ready, but Supabase is not configured in Vercel yet.',
      });
    }

    return response.status(200).json({
      ok: true,
      stored: Boolean(supabaseResult.ok),
      forwarded: Boolean(ghlResult.ok),
    });
  } catch {
    return response.status(500).json({ error: 'Unable to submit lead.' });
  }
}
