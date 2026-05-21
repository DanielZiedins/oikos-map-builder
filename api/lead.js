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

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    return response.status(503).json({ error: 'GoHighLevel webhook is not configured yet.' });
  }

  try {
    const body = request.body || {};
    const email = String(body.email || '').trim().toLowerCase();
    const name = String(body.name || '').trim();
    const interest = allowedInterests.has(body.interest) ? body.interest : 'Send me the Oikos starter kit';

    if (!isValidEmail(email)) {
      return response.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const payload = {
      firstName: name,
      email,
      interest,
      source: body.source || 'oikos-map-builder',
      page: body.page || '/',
      submittedAt: new Date().toISOString(),
      tags: ['oikos-map-builder', 'ads-lead', interest],
    };

    const ghlResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!ghlResponse.ok) {
      return response.status(502).json({ error: 'GoHighLevel rejected the lead.' });
    }

    return response.status(200).json({ ok: true });
  } catch {
    return response.status(500).json({ error: 'Unable to submit lead.' });
  }
}
