// Vercel serverless function: receive contact form submissions and save to Supabase.
//
// Required environment variables (set in Vercel project Settings → Environment Variables):
//   SUPABASE_URL              e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY service-role JWT (server-side only — DO NOT expose to client)
//
// Optional:
//   CONTACT_NOTIFY_EMAIL  if set, an email is sent here via Resend
//   RESEND_API_KEY        Resend API key (only used if CONTACT_NOTIFY_EMAIL is set)
//   RESEND_FROM           e.g. "Keizerfest <noreply@mail.supershift.work>"
//
// Run the SQL in /sql/001_contact_submissions.sql once on the Supabase project
// before this endpoint will accept inserts.

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

  // Honeypot.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    // Pretend success so bots don't probe.
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

  // Optional: notify via Resend.
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM;
  if (notifyTo && resendKey && resendFrom) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [notifyTo],
          reply_to: data.email,
          subject: `[Keizerfest contact] ${data.subject || data.name}`,
          text:
            `Van: ${data.name} <${data.email}>\n` +
            (data.subject ? `Onderwerp: ${data.subject}\n` : '') +
            `Locale: ${data.locale || 'nl'}\n\n` +
            data.message,
        }),
      });
    } catch (err) {
      // Non-fatal: insert already succeeded.
      console.warn('contact: notify email failed', err);
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
