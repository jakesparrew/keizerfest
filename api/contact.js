// Vercel serverless function: receive contact form submissions and save to Supabase.
//
// Required environment variables (Vercel project Settings → Environment Variables):
//   SUPABASE_URL              e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY service-role JWT (server-side only — never expose to client)
//
// Run sql/001_contact_submissions.sql on the Supabase project once before
// this endpoint will accept inserts.

export const config = { runtime: 'edge' };

const ALLOWED_FIELDS = ['name', 'email', 'subject', 'message', 'locale'];

function bad(status, message) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return bad(405, 'Method not allowed');
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return bad(400, 'Invalid JSON');
  }

  // Trim & whitelist fields.
  const data = {};
  for (const k of ALLOWED_FIELDS) {
    if (typeof body[k] === 'string') data[k] = body[k].trim();
  }

  // Honeypot — bots fill this. Pretend success so they don't probe further.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validation.
  if (!data.name || data.name.length < 1 || data.name.length > 120) {
    return bad(400, 'Naam ontbreekt of is te lang.');
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 160) {
    return bad(400, 'Geen geldig e-mailadres.');
  }
  if (!data.message || data.message.length < 1 || data.message.length > 4000) {
    return bad(400, 'Bericht ontbreekt of is te lang.');
  }
  if (data.subject && data.subject.length > 160) {
    return bad(400, 'Onderwerp is te lang.');
  }

  // Capture metadata.
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null;
  const userAgent = req.headers.get('user-agent') || null;

  // Save to Supabase.
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('contact: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing');
    return bad(503, 'Contactformulier nog niet geconfigureerd.');
  }

  const insertRes = await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
      locale: data.locale || null,
      ip_address: ip,
      user_agent: userAgent,
    }),
  });

  if (!insertRes.ok) {
    const text = await insertRes.text().catch(() => '');
    console.error('contact: Supabase insert failed', insertRes.status, text);
    return bad(502, 'Kon je bericht niet opslaan.');
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
