# Keizerfest — Design System

## Brand
Keizerfest is a 3-day festival at **Keizerpark, Ghent**, May 14–16, 2026. Each day is curated by a Ghent collective:
- **Donderdag 14.05.2026 — Hip Hop Hooray** (hip hop) — lineup: DJ Vega, Hardere Aanpak, Smif-N-Wessun, Tiesko, Yannish. Sub-events: Breakdance Battle for Kids by Together We Stand, Graffiti Jam & Workshops by Wallin', Skate Jam by Curb Skateshop.
- **Vrijdag 15.05.2026 — B*tch Don't Kill My Vibe (BDKMV)** — lineup: Chanelle, Golden Zebora, J.ROOTS, Ninette, ROSIE. Sub-events: Creators' Market by Stadsmakers, Yoga in the Park by Journey Of Yoga.
- **Zaterdag 16.05.2026 — Wide Open** (electronic / techno) — lineup: Bibi Seck, Felix Claus B2B WellSee, MOKER, Perra Inmunda. Sub-events: Brunch & Beats by Disco Déjeuner, Vinyl Market by The Rekord Klub.

Sponsors that appear across the posters: gent: (Stad Gent), MADCAT, Corona, B2S, Coca-Cola, Monster.

The site is **one unified single-page scroll** — shared nav, shared footer — but each day gets its own saturated color world, photography, and lineup poster. The site should feel like a wall of three printed posters you can scroll through.

## Voice
Raw, poster-like, neighborhood-rooted. Print-shop physicality, not digital polish. Type does the heavy lifting. Copy is short, declarative, in Dutch where natural. Never marketing-speak.

## Visual references
Three Ghent event posters set the language:
- **Hip Hop Hooray** — photo background, white display type inside hard black blocks, A-Z lineup, sponsor strip
- **B*tch Don't Kill My Vibe / Family Day** — saturated solid color (hot pink), cream/yellow display type, illustration, A-Z lineup
- **Wide Open** — acid-green melted pattern, white display type with stylized Ø-for-0, A-Z lineup

## Layout principles
- **Generous edge padding** (24px mobile, 64–96px desktop).
- **Display type fills the width** — headlines hit 14–24vw on desktop.
- **Hard cuts between day sections** — no gradients, no soft transitions. Each day section is a full-viewport "poster".
- **A-Z lineup format** — small "A–Z" label, then names in display type, alphabetical, headliners not visually larger (it's a list, not a hierarchy).
- **Type-in-blocks** — solid colored or black rectangles holding white display type, sitting on top of photography.
- **Sponsor strip** — single horizontal row at bottom, monochrome wordmarks, equal sizing.
- **Tabular numerals** for dates and times.

## Color
Each day owns a saturated background color. Across days, palette feels like a stack of risograph posters.

```
--ink: #0A0A0A           /* primary type, blocks */
--paper: #F4F1EA         /* shell, between sections */
--cream: #F5E9C9         /* display type on color */

/* Day 1 — Hip Hop Hooray */
--day1-bg: photographic (crowd photo, full-bleed)
--day1-block: #0A0A0A    /* black blocks holding type */
--day1-type: #FFFFFF

/* Day 2 — Family Day */
--day2-bg: #FF5BA7       /* hot pink */
--day2-type: #F5E9C9     /* cream display */
--day2-accent: #0A0A0A   /* small caps text */

/* Day 3 — Wide Open */
--day3-bg: #2BD480       /* acid green */
--day3-pattern: dark green melted swirl
--day3-type: #FFFFFF
```

The shell (nav, intro, practical info, footer) sits on `--paper` cream. Color only appears inside the day sections.

## Typography
- **Display**: heavy condensed wide grotesque — Druk Wide Heavy / F37 Bolton Black / Halvar Mittel-Compressed Black. ALL CAPS. Tight tracking (-0.02em). Line height 0.9.
- **Body**: Inter or Söhne. Sentence case. Tracking 0.
- **Small caps metadata** (date, location, presented-by): Inter Medium, all caps, tracking 0.08em, ~12px.
- **Stylized numerals**: festival year can render as `2026` or `2Ø26` (Ø substituting 0) for variety. Festival name as `KEIZERFEST` or `KEIZER-FEST`. Year as `2026` or `2K26`.

## Repeating typographic blocks
Every day-poster contains the same 5 blocks in this order:
1. **Top metadata strip** — left: presenting collective name, right: weekday + date + venue, all small caps
2. **Festival mark** — `KEIZERFEST 2026` or `KEIZER-FEST 2Ø26` filling the width
3. **A–Z lineup** — small "A–Z" label, then 4–6 names alphabetical in display type
4. **Sub-events** — "[event name] by [partner]" lines, body type
5. **Sponsor strip** — 5–6 monochrome wordmarks in single row at bottom

## Photography
- Real Keizerpark crowd shots — daylight, golden hour, tents, sound systems, trees.
- Never cliché "hands in the air" stock photography.
- Treated with subtle film grain (~10% noise overlay).
- Day 1 (Hip Hop) gets photo backgrounds; Day 2 (Family) gets solid color + illustration; Day 3 (Techno/Wide Open) gets solid color + abstract pattern.

## Texture
- Faint paper-grain on cream shell (`6% noise`).
- Stronger grain on photography.
- No drop shadows. No rounded corners above 2px.
- Hairline rules where dividers needed (0.5px solid `--ink`).

## Languages
The festival runs in **Dutch (Nederlands)**. The site MUST be translatable to **English** and **French**. All UI copy lives in three locales — `nl` (default), `en`, `fr`. A small language switcher sits in the top-right of the nav, next to the Tickets CTA: `NL · EN · FR` with the active locale in `--ink` and the others in `--gray-2`. Clicking swaps the locale.

## Tickets
Tickets are framed as **"Steuntickets" (Support tickets)** — buying one financially supports the festival, it's not a paywall to enter. Copy reflects this: e.g. "Steun het festival" rather than "Buy now". The Tickets CTA links externally to **Ticketbalie** (open in new tab). The tickets section on the page lists the support tiers (e.g. €5 / €15 / €50) with a single button per tier going to Ticketbalie. No checkout in-page.

## Components
- `Nav` — sticky, transparent over hero, becomes solid cream on scroll. Logo `KEIZERFEST` left, day links `01 — HIP HOP / 02 — BDKMV / 03 — WIDE OPEN` centered with 48px gaps. Right side: `NL · EN · FR` language switcher, then `Steuntickets ↗` link out to Ticketbalie.
- `Hero` — full-bleed photo, KEIZERFEST mark filling width, dates `15 — 17 MEI 2026 · KEIZERPARK GHENT` underneath, top-right: "PRESENTED BY HIP HOP HOORAY × BDKMV × WIDE OPEN".
- `DaySection` — full viewport, the 5 typographic blocks in order. Hard cut to next day.
- `PracticalInfo` — 4-col data table: Tickets / Transport / Food / Toegankelijkheid. Labels caps, values body.
- `Footer` — sponsor strip + address + credits + small "Powered by Stad Gent" mark.

## Copy rules
- Dutch where natural ("Vrijdag 15 mei", "Toegankelijkheid"). English where it's already English ("Wide Open", "Tickets").
- No AI-slop ("Experience...", "Join us for...", "Don't miss...").
- Specific over generic. "Sound system door Wide Open" beats "Premium techno experience".
- Dates as `Vr 15.05` short or `Vrijdag 15 mei 2026` long.
- Times as `22:00 — 04:00` 24h.
- Festival mark always in caps: `KEIZERFEST` or `KEIZER-FEST`.

## Don't
- Pastel gradients, glassmorphism, neon glow.
- Centered narrow text columns.
- Carousels, autoplay video heroes.
- Generic SaaS-style hero copy.
- Drop shadows, soft blurs, rounded cards.
- Decorative SVG flourishes, sparkles, emoji.
