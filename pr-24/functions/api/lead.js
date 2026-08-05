// Cloudflare Pages Function — POST /api/lead
//
// Single public endpoint for every form on the site. It forwards the submission to the
// right GoHighLevel inbound-webhook workflow based on `form_type`, so the GHL webhook
// URLs live in Pages environment variables and never reach the browser.
//
// Required environment variables (Pages project → Settings → Variables and Secrets):
//   GHL_WEBHOOK_CONTACT  → W1 "Website Contact Form workflow."
//   GHL_WEBHOOK_AUDIT    → W2 "Free-Audit Leads"
//   GHL_WEBHOOK_SIGNUP   → W3 "Website Sign-Up"
//
// GHL bills inbound-webhook triggers per execution, so this function drops obvious bot
// traffic (honeypot, oversized payloads, unknown form_type) before it costs anything.

const ROUTES = {
  contact: 'GHL_WEBHOOK_CONTACT',
  free_audit: 'GHL_WEBHOOK_AUDIT',
  signup: 'GHL_WEBHOOK_SIGNUP',
  'enterprise-quote': 'GHL_WEBHOOK_SIGNUP',
};

const MAX_BYTES = 16 * 1024;

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export async function onRequestPost({ request, env }) {
  const raw = await request.text();
  if (raw.length > MAX_BYTES) return json(413, { ok: false, error: 'Payload too large' });

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: 'Expected JSON' });
  }

  // Honeypot: a real person never fills a field they cannot see.
  if (payload.website_url) return json(200, { ok: true });

  const envKey = ROUTES[payload.form_type];
  if (!envKey) return json(400, { ok: false, error: 'Unknown form_type' });

  const target = env[envKey];
  if (!target) return json(500, { ok: false, error: 'Endpoint not configured' });

  if (!payload.email) return json(400, { ok: false, error: 'Email is required' });

  // Split a single "name" into the first/last the GHL mappings expect.
  if (payload.name && !payload.first_name) {
    const parts = String(payload.name).trim().split(/\s+/);
    payload.first_name = parts.shift() || '';
    payload.last_name = parts.join(' ');
  }

  payload.submitted_at = new Date().toISOString();
  payload.source_host = request.headers.get('host') || '';

  const upstream = await fetch(target, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!upstream.ok) {
    return json(502, { ok: false, error: 'Upstream rejected the submission' });
  }
  return json(200, { ok: true });
}
// Pages answers 405 on its own for methods with no exported handler.
