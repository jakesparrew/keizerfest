# keizerfest.be

Static landing page for **Keizerfest 2026** — Keizerpark, Gent, 14–16 mei.
Hosted on Vercel, source on GitHub. Pure HTML + Tailwind CDN, no build step.

## Files

- `index.html` — the whole page. NL by default, EN/FR via the language switcher (persisted in localStorage).
- `images/` — hero photo, the four event banners, generic park photos.
- `api/contact.js` — Vercel Edge Function backing the contact form.
- `sql/001_contact_submissions.sql` — Supabase migration for contact form storage.
- `scripts/` — one-off helpers (PDF → JPG conversion, etc.).
- `.superdesign/` — design system reference notes (not deployed).

## Deploying

```
# from the project root
git push origin main          # triggers a Vercel deploy
# or force-deploy from CLI
vercel --prod --yes
```

## Environment variables (Vercel project settings)

The contact form needs Supabase credentials. Set these in
**Vercel → Project → Settings → Environment Variables** for *Production*
(and optionally *Preview*):

| Name                          | Required | Purpose                                                             |
| ----------------------------- | -------- | ------------------------------------------------------------------- |
| `SUPABASE_URL`                | yes      | e.g. `https://xxxx.supabase.co`                                     |
| `SUPABASE_SERVICE_ROLE_KEY`   | yes      | service-role JWT — server-side only, never expose to the client     |
| `CONTACT_NOTIFY_EMAIL`        | no       | if set, every submission also gets emailed here                     |
| `RESEND_API_KEY`              | no       | required if `CONTACT_NOTIFY_EMAIL` is set                           |
| `RESEND_FROM`                 | no       | e.g. `Keizerfest <noreply@mail.supershift.work>`                    |

Without `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` the form returns a
503 "Contactformulier nog niet geconfigureerd" message — the rest of the
site keeps working.

## Database setup (one-time)

Open the Supabase SQL editor for the chosen project and run the contents
of `sql/001_contact_submissions.sql`. It:

- Creates `public.contact_submissions` with `id`, `submitted_at`, `name`,
  `email`, `subject`, `message`, `locale`, `ip_address`, `user_agent`,
  `handled`, `notes`.
- Enables row-level security with no public policies — only the
  service-role key can read/write.

## Crowdfunding progress bar

The bar at the top of the page calls Ticketbalie's public crowdfunding
endpoint:

```
https://rrabscqyndelsxlmfctq.supabase.co/functions/v1/public-crowdfunding-api
  ?eventId=0726f2da-899b-4fae-b977-d4a80ccfbc0a
  &token=02501e27-b5f1-4f60-a155-16f7216c823d
```

The Edge Function gateway must have JWT verification disabled
(`verify_jwt: false`) for unauthenticated browser calls. While that's
still on, the section shows a `—` skeleton state. Once Ticketbalie flips
the switch, the bar fills in automatically — no client change needed.

## Local preview

```
npx serve . -l 3010
# open http://localhost:3010/
```

## Licence

All rights reserved by Keizerfest VZW / De Flesjesfabriek.
