import { cancelScheduled } from './_resend.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function page({ title, heading, body, tone = 'ok' }) {
  const accent = tone === 'ok' ? '#14857a' : '#9c3327';
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title}</title>
<style>
  body { margin:0; min-height:100vh; display:grid; place-items:center; padding:24px;
    background:#fff8ec; color:#26201c;
    font-family:InterVariable,Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif; }
  main { max-width:520px; padding:34px; background:#fffdf7; border:1px solid rgba(72,57,43,.16);
    border-radius:16px; box-shadow:0 20px 60px rgba(63,48,34,.1); }
  h1 { margin:0 0 14px; font-size:1.85rem; line-height:1.15; letter-spacing:-.5px; }
  p { margin:0 0 14px; color:#62564e; line-height:1.65; }
  .kicker { margin:0 0 12px; font-size:.72rem; font-weight:900; letter-spacing:.14em;
    text-transform:uppercase; color:${accent}; }
  a.button { display:inline-block; margin-top:8px; padding:12px 22px; border-radius:999px;
    background:#26201c; color:#fff8ec; font-weight:800; text-decoration:none; }
</style>
</head><body><main>
  <p class="kicker">Oikos Map</p>
  <h1>${heading}</h1>
  ${body}
  <a class="button" href="https://www.oikosmap.com/">Back to the Oikos Map &rarr;</a>
</main></body></html>`;
}

function sendHtml(response, status, html) {
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow');
  return response.status(status).send(html);
}

export default async function handler(request, response) {
  // GET serves the confirmation page; POST supports one-click List-Unsubscribe.
  if (request.method !== 'GET' && request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const token = String(request.query?.token || '').trim();
  const oneClick = request.method === 'POST';

  if (!UUID_PATTERN.test(token)) {
    if (oneClick) return response.status(400).json({ error: 'Invalid token' });
    return sendHtml(
      response,
      400,
      page({
        title: 'Unsubscribe link not recognised',
        heading: 'That link is not valid',
        tone: 'error',
        body: '<p>This unsubscribe link looks incomplete. If you copied it from an email, please try clicking the link directly instead — or simply reply to any of our emails and we will remove you right away.</p>',
      }),
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (oneClick) return response.status(503).json({ error: 'Not configured' });
    return sendHtml(
      response,
      503,
      page({
        title: 'Unsubscribe unavailable',
        heading: 'We cannot process that right now',
        tone: 'error',
        body: '<p>Something is misconfigured on our side. Please reply to any of our emails and we will unsubscribe you manually — sorry for the inconvenience.</p>',
      }),
    );
  }

  try {
    // Token-gated SECURITY DEFINER RPC: flips the subscription off and hands back
    // the queued Resend ids so the rest of the sequence can be cancelled.
    const rpc = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/oikos_unsubscribe`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_token: token }),
    });

    if (!rpc.ok) throw new Error(`Supabase responded ${rpc.status}`);

    const rows = await rpc.json().catch(() => []);
    const row = Array.isArray(rows) ? rows[0] : rows;

    if (!row?.email) {
      if (oneClick) return response.status(200).json({ ok: true });
      return sendHtml(
        response,
        200,
        page({
          title: 'Already unsubscribed',
          heading: 'You are not on the list',
          body: '<p>That link does not match an active subscription, which usually means you have already unsubscribed. Either way, you will not receive any more of these emails.</p>',
        }),
      );
    }

    await cancelScheduled(row.scheduled_email_ids || []).catch(() => {});

    if (oneClick) return response.status(200).json({ ok: true });

    return sendHtml(
      response,
      200,
      page({
        title: 'Unsubscribed',
        heading: 'Done — you are unsubscribed',
        body: `<p>We have removed <strong>${String(row.email)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</strong> and cancelled any emails still queued for you.</p>
        <p>The Oikos Map itself stays completely free to use, and your map lives privately in your own browser — nothing about this changes that. Thank you for the time you gave it.</p>`,
      }),
    );
  } catch {
    if (oneClick) return response.status(500).json({ error: 'Unable to unsubscribe' });
    return sendHtml(
      response,
      500,
      page({
        title: 'Something went wrong',
        heading: 'That did not work',
        tone: 'error',
        body: '<p>We hit an unexpected error. Please reply to any of our emails and we will remove you straight away.</p>',
      }),
    );
  }
}
