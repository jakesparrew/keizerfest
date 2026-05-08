# keizerfest.be

Static landing page for **Keizerfest 2026** — Keizerpark, Gent, 14–16 mei.
Hosted on Vercel, source on GitHub. Pure HTML + Tailwind CDN, no build step.

## Files

- `index.html` — the whole page. NL by default, EN/FR via the language switcher (persisted in localStorage).
- `waarom.html` — long-form support page served at `/waarom`.
- `images/` — hero photo, the four event banners, generic park photos.
- `scripts/` — one-off helpers (PDF → JPG conversion, etc.).
- `.superdesign/` — design system reference notes (not deployed).

## Deploying

```
# from the project root
git push origin main          # triggers a Vercel deploy
# or force-deploy from CLI
vercel --prod --yes
```

## Crowdfunding bar + embed

The progress bar at the top reads from Ticketbalie's public crowdfunding
endpoint (`eventId` + `token` baked into `index.html`). The "DIRECT
BIJDRAGEN" heart button uses the same eventId/token to open Ticketbalie's
embedded checkout dialog (`https://ticketbalie.com/embed.v1.js`). The
`onComplete` callback re-runs the bar fetch so numbers update right after
a successful donation.

If the organizer rotates the token, update both the `CROWDFUNDING.token`
constant in `index.html` (and `waarom.html`) and the `onclick` calls
inside both files, then redeploy.

## Contact

There's no form on the site — visitors mail `info@deflesjesfabriek.be`
directly via the footer link.

## Local preview

```
npx serve . -l 3010
# open http://localhost:3010/
```

## Licence

All rights reserved by Keizerfest VZW / De Flesjesfabriek.
