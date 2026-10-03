// Privacy-respecting usage counts. Accepts { event, path } and increments a
// daily aggregate through the oikos_track RPC, which allow-lists event names.
// No identifiers are read, stored, or forwarded: not IP, not user agent, not
// cookies. Always answers 204 so a tracking hiccup can never surface to a reader.

const EVENT_PATTERN = /^[a-z_]{1,40}$/;

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).end();
  }

  try {
    // sendBeacon posts a text/plain or JSON blob; accept either.
    let body = request.body;
    if (typeof body === 'string') body = JSON.parse(body || '{}');
    body = body || {};

    const event = String(body.event || '');
    const path = String(body.path || '/').slice(0, 200);
    if (!EVENT_PATTERN.test(event)) return response.status(204).end();

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) return response.status(204).end();

    await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/oikos_track`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_event: event, p_path: path }),
    }).catch(() => {});
  } catch {
    // Swallowed on purpose: measurement must never break the page.
  }
  return response.status(204).end();
}
