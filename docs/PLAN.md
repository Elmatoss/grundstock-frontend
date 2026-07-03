# Grundstock 2026 — Website Plan

Promo website for the Grundstock Festival (13.–16. August 2026, Rieden/Vilswörth), run by the
gemeinnütziger Verein **Neues Brett e.V.** — a festival from friends for friends, from Regensburg
for Regensburg. Everyone pitches in (one mandatory shift), food is included, drinks are cheap,
Pfadfinder spirit.

Date semantics: program runs **Thursday 13.08. through the Saturday→Sunday night**; Sunday
16.08. is teardown & departure only. Copy says "13.–16. August", the lineup covers Do/Fr/Sa,
the countdown targets Thursday 13.08.

Domain: **grundstock-festival.de** (canonical); `neues-brett.de` 301-redirects to it.
Budget constraint: **everything runs free this year** — free tiers only, the domain
(~10–15 €/Jahr) is the single fixed cost. Paid infrastructure (backend, accounts, email)
is a 2027 topic.

Stack (already set up): TanStack Start (SSR) on Cloudflare Workers, React 19 + Compiler,
TanStack Router/Query, Tailwind v4, shadcn/ui, Paraglide i18n, Biome, Vitest.
CMS: **Sanity** studio in `../grundstock-cms` (project `0wrmpf0k`, dataset `production`, currently empty).

---

## 1. Goals & principles

1. **One beautiful homepage** that carries the vibe: fullscreen atmospheric hero (recap video
   once it exists, illustrated night-jungle scene until then), wordmark, date + countdown,
   then scrollytelling through everything that matters.
2. **Content editable by non-devs** via Sanity: artists, workshops, stages, FAQ, settings
   (ticket link, Helfertool link, dates). Code only for layout/design.
3. **Privacy-first, no cookie banner**: self-hosted fonts and video, third-party embeds
   (YouTube recap) only as click-to-load facades, cookieless analytics (Cloudflare Web
   Analytics, §8). A community festival site should not need a consent wall.
4. **German first, translation-ready.** Audience is Regensburg; no visible locale switcher
   in v1. But the architecture assumes English arrives later: UI strings via Paraglide
   (`en.json` maintained alongside `de.json`), CMS text fields as locale objects from day
   one (§6) — adding a language later is filling in fields, not restructuring.
5. **Dark only.** The design is a night-jungle scene — remove the theme toggle, ship one
   deliberate dark theme.
6. **Fast on festival-grade mobile connections**: strict video/image budgets, Sanity image CDN,
   static-ish caching on the Worker.

---

## 2. Sitemap & routes

```
/                  Home (the showpiece — see §4)
/lineup            Lineup by day & stage, artist cards
/artists/$slug     Artist detail (bio, genre, images, links, slot)
/workshops         Workshop overview (list/grid, expandable details)
/verein            Neues Brett e.V. — story, values, gemeinnützig, mitmachen/contact
/anreise           Location: address, map, Anfahrt (Auto/ÖPNV/Rad), camping
/infos             Infos A–Z / FAQ (shifts, food, 18+, what to bring, …)
/impressum         Legal
/datenschutz       Legal
/tickets           Redirect → Eventfrog (stable URL for print/QR/socials; also sells shuttle tickets)
/helfen            Redirect → Helfertool (Airtable shift form)
/mittelgschaftler  Redirect → Airtable Mittelgschaftler application form
```

Route conventions (per CLAUDE.md): routes stay thin — `loader` calls
`ensureQueryData(opts)`, component renders one feature component, data-backed routes get
`errorComponent`/`pendingComponent`. File layout:

```
src/routes/
  __root.tsx            shell: header (transparent over hero, solid elsewhere), footer,
                        themed notFoundComponent (404 in the night-jungle look)
  index.tsx             → features/home
  lineup.tsx            → features/lineup
  artists.$slug.tsx     → features/lineup (ArtistDetail)
  workshops.tsx         → features/workshops
  verein.tsx            → features/verein
  anreise.tsx           → features/location
  infos.tsx             → features/infos
  impressum.tsx         → features/legal
  datenschutz.tsx       → features/legal
  tickets.tsx           beforeLoad: throw redirect(ticketUrl from settings)
  helfen.tsx            beforeLoad: throw redirect(helfertoolUrl from settings)
  mittelgschaftler.tsx  beforeLoad: throw redirect(mittelgschaftlerUrl from settings)
```

Cleanup first: delete `demo.i18n.tsx`, `demo/tanstack-query.tsx`, `about.tsx`,
`ThemeToggle.tsx`; repurpose `Header`/`Footer`.

### Feature folders

```
src/features/
  home/        components (Hero, Countdown, sections), no own api — composes others' teasers
  lineup/      api (artist/stage/performance queries), components (DayTabs, ArtistCard,
               ArtistCarousel, ArtistDetail)
  workshops/   api + components (WorkshopCard, WorkshopList)
  verein/      mostly static content + memories gallery (api for gallery)
  location/    map + directions
  infos/       api (faq query) + Accordion sections
  legal/       renders portable-text legal pages from CMS
src/lib/sanity/  client, image-url builder, GROQ helpers, zod schemas for responses
```

---

## 3. Design direction

Source material: flyer (watercolor ferns, orange sun, eye-logo) and Figma night-jungle
mockups (deep purple night sky, fireflies, glowing lantern/jellyfish/moth/mushroom icons,
jungle silhouettes, neon-eye hero photo, NB logo glow).

### Theme tokens (Tailwind v4 `@theme` in `styles.css`)

- **Night backgrounds**: near-black violet `#120826` → deep purple `#1e1035` → section accents
  `#2b1653` (radial gradients like the Figma "Background v1").
- **Glow accent (primary)**: warm amber `#ffb524` / `#fcd34d` — fireflies, lanterns, CTAs.
  Ticket/Helfen buttons glow amber; it's the only loud color, so it always means "act here".
- **Secondary accent**: electric violet `#8b5cf6` and the neon-blue of the eye `#7dd3fc` for
  links/highlights.
- **Foreground**: warm off-white `#f5f0e8`; muted `#b8a8d8`.
- Map these onto the shadcn/zinc CSS variables so shadcn primitives inherit the theme.

### Typography (all self-hosted via `@fontsource`, no Google Fonts CDN)

- **Display**: the Grundstock wordmark is an SVG logo (from the flyer), used as-is for the hero.
  For section headings: an organic/hand-feel display face (candidates: Shantell Sans, Gluten,
  Caprasimo) — pick one against the wordmark.
- **Lineup names**: a serif with character, as in the Figma (candidates: Fraunces, Playfair
  Display).
- **Body**: clean sans (Inter or Instrument Sans).

### Decoration & motion

- Export the Figma asset set as SVG/optimized PNG: fireflies, lantern, jellyfish, moth,
  mushroom, tent, jungle-leaf silhouettes, NB-logo glow.
- Section boundaries = layered jungle silhouettes (like the flyer's fern band); critters float
  subtly (CSS keyframes), fireflies twinkle as sparse absolutely-positioned sprites.
- Scroll-reveal for sections (IntersectionObserver + CSS transitions).
- Everything honors `prefers-reduced-motion` (static poster instead of video, no floats).
- shadcn/ui for functional pieces: Accordion (FAQ), Carousel/embla (artists), Dialog, Button.

---

## 4. Homepage — section by section

1. **Hero (100dvh)** — wordmark SVG centered, below it `13.–16. August 2026 · Vilswörth` +
   live **countdown** (days/hrs/min, SSR-safe: render from server time, hydrate ticking;
   target is a fixed instant in Europe/Berlin from CMS settings; `tabular-nums` so ticking
   digits don't shift layout).
   Two CTAs: `Tickets` (amber, →/tickets) and `Mithelfen` (ghost, →/helfen). Scroll cue
   (animated chevron/firefly).
   **Background v1 (launch, no video yet)**: fully illustrated night-jungle scene — the
   Figma "Background v1" gradient, layered jungle silhouettes, twinkling fireflies, glowing
   eye logo. Designed to feel finished, not like a placeholder.
   **Background v2 (when the recap edit lands)**: looping muted video (`autoplay muted loop
   playsinline`, `poster`) with dark gradient overlay. The Hero component reads `heroVideo`
   from siteSettings — video absent → illustrated scene; swap requires zero layout changes.
2. **Was ist Grundstock** — 3–4 sentence manifesto. Tone: warm, direct, du-Form, no
   emoji-overload (rewrite of the Eventfrog text). Core message: von Freund:innen für
   Freund:innen, aus Regensburg, gemeinnützig, alle packen mit an.
3. **Genre-Marquee** — scrolling strip: Hip-Hop · Indie · Latin · DnB · Rock · Disco ·
   Techno · uvm. Cheap, vibey, breaks up sections.
4. **Lineup-Teaser** — "Upcoming Artists" carousel of featured artist cards (photo, name,
   genre, one-liner — exactly the Figma card) + lineup-by-day summary → link `/lineup`.
   No drip-reveal logic: everything published in the CMS is live immediately; Sanity's
   native draft/publish state is the only gate.
5. **Workshops-Teaser** — 2–3 highlight cards + "neues Workshop-Zelt" note → `/workshops`.
6. **Alles inklusive** — the deal: 3 warme Mahlzeiten + Mitternachtssnack im Preis, richtig
   gutes veganes Essen, günstige Getränke, Cocktailbar. Icon row (lantern/tent/plate).
7. **Mithelfen** — the Pfadfinder principle, two tiers side by side:
   - **Schicht** (Pflicht für alle): eine Schicht pro Person — Küche, Bar, Cleanup, … CTA
     → `/helfen` (Airtable Helfertool).
   - **Mittelgschaftler:in**: 8h-Schicht + etwas mehr Verantwortung = **halber
     Ticketpreis**. Offen für alle. CTA → `/mittelgschaftler` (Airtable form).
   Plus a quiet third line: "Oder unterstütz den Verein mit einer Spende" → `/verein#spenden`.
   This section carries the identity — give it room.
8. **Location-Teaser** — "Vilswörth bei Rieden" + stylized map snippet/photo, one line on
   the **Shuttlebusse aus Regensburg** (Details + Zeiten → `/anreise`).
9. **Unsere Geschichte** — short story block (Figma "Our Story") + the 2025 **recap
   video** (https://www.youtube.com/watch?v=sACZxjbCPls) as click-to-load YouTube facade:
   styled poster + play button, the iframe (`youtube-nocookie.com`) loads only on click —
   keeps the site banner-free. The poster image is **self-hosted** (hotlinking
   `i.ytimg.com` would already be a third-party request before any consent). Horizontal
   memories photo strip added later once photos are available. → `/verein`.
10. **Tickets-CTA banner** — big amber glow block: price note (Essen inklusive!),
    Earlybird hint, Mittelgschaftler = halber Preis hint, Shuttle-Tickets im selben Shop,
    18+ note, → `/tickets`.
11. **FAQ kurz** — top 4–5 questions as accordion → `/infos`.
12. **Footer** — NB logo (glow), nav, Instagram, Impressum/Datenschutz, "Grundstock ist ein
    Projekt von Neues Brett e.V. — gemeinnützig, ohne Gewinnabsicht."

## 5. Subpages

- **/lineup** — day tabs or stacked day sections (**Do / Fr / Sa** — Sonntag ist Abbau &
  Abreise, kein Programm), per day the artists grouped by stage (Turtle · Mainstage ·
  Bunker) with stage descriptions ("Bunker — DJs bis in den Morgen"). v1 without exact
  times; the CMS model supports adding a timetable later.
- **/artists/$slug** — hero image, name, genre chips, slot (Tag/Stage/Zeit sobald fix), bio
  (portable text), links (Instagram/Spotify/SoundCloud as plain links; embeds only as
  click-to-load facades to stay banner-free).
- **/workshops** — grid of cards (title, host, day/time, tent, image), detail as
  expandable card or dialog; separate detail routes only if content grows.
- **/verein** — Neues Brett e.V.: Geschichte, Werte, Gemeinnützigkeit (wohin geht das
  Geld), wer dahinter steckt, Mitmachen (Schicht + Mittelgschaftler), Kontakt. Plus a
  **Spenden block** (anchor `#spenden`): Spenden per Überweisung an *Neues Brett e.V.,
  IBAN DE36 4306 0967 1355 5742 00* (formatted, copy-to-clipboard button),
  Spendenquittung ab 100 € per Mail an info@neues-brett.de.
- **/anreise** — address + geo, Anfahrt Auto/ÖPNV/Rad, parking, camping info. Map: v1 a
  styled static map image linking to OSM/Google; v2 interactive MapLibre GL with
  self-hosted/OpenFreeMap tiles (DSGVO-clean, matches night theme with a dark style).
  Prominent **Shuttle section** (times from CMS):
  - *Regensburg → Grundstock*: Do 13:00 · 15:30 · 18:00, Fr 10:00 · 12:00 · 14:00
  - *Grundstock → Regensburg*: So 10:00 · 12:00 · 15:00 · 17:00
  - Shuttle-Tickets gibt's im selben Shop wie die Festivaltickets → `/tickets`.
- **/infos** — Infos A–Z: Schichten & Mittelgschaftler, Essen & Trinken, 18+/Ausweis,
  Camping, was mitbringen, Shuttle, Spenden, Barrierefreiheit, Awareness,
  Anreise-Kurzinfo, Hunde/Glas/etc. Sourced from CMS FAQ docs with categories.
- **/impressum, /datenschutz** — **we draft these** (nothing exists today): standard
  German templates for an e.V.-run event site, seeded into the CMS as `legalPage` portable
  text so the Verein can adjust later.
  **Impressum data** (from the Vereinsregister):
  *Neues Brett e.V. · vertreten durch den Vorstand (§ 26 BGB): Vinzenz Abt und Max Pindl ·
  Vereinsregister: VR 201964, Amtsgericht Regensburg · Kontakt: info@neues-brett.de.*
  Birth dates and home towns from the register stay **off** the website — only names are
  required. Still missing: a **ladungsfähige Anschrift** (§ 5 DDG requires a street
  address; a Postfach is not sufficient) — typical fix for a Verein: the Vereinssitz
  address or a c/o address of a Vorstand member (§11).
  Include the § 36 VSBG note (nicht zur Verbraucherschlichtung bereit/verpflichtet); do
  **not** include the old EU-ODR-platform link — that platform was shut down in July 2025.
  **Datenschutz** covers: Hosting (Cloudflare Workers, Server-Logs), Cloudflare Web
  Analytics (cookieless, keine personenbezogenen Profile, kein Banner nötig), Sanity CDN
  als Bild-Host, YouTube-Embed als Zwei-Klick-Lösung, externe Links (Eventfrog, Airtable).
  Verantwortlicher = der Verein (needs the same Anschrift). These are careful template
  drafts, not legal advice — worth a quick read-over by someone from the Verein before
  launch.

---

## 6. Sanity content model (`../grundstock-cms/schemaTypes/`)

Documents:

| Type | Fields (core) |
|---|---|
| `artist` | name, slug, image(s) (hotspot), genres[], shortBlurb, bio (portable text), links {instagram, spotify, soundcloud, website}, performances[] {day, stage→ref, time?}, featured |
| `stage` | name (Turtle/Mainstage/Bunker), slug, tagline, description, icon/image, order |
| `workshop` | title, slug, host (string or artist→ref), description (portable text), image, day, time, location (string/stage ref), registration note |
| `faqItem` | question, answer (portable text), category (schichten/essen/anreise/allgemein/…), order |
| `memory` | image, caption, year — feeds the memories strip/gallery |
| `legalPage` | title, slug (impressum/datenschutz), body (portable text) |

Singleton `siteSettings`: festivalStart/festivalEnd (datetime → drives countdown + JSON-LD;
2026: start 13.08., end 16.08., program note "So = Abbau"), locationName, geo, ticketUrl,
helfertoolUrl, mittelgschaftlerUrl, instagramUrl, contactEmail, donation {accountHolder
"Neues Brett e.V.", iban, receiptNote (Spendenquittung ab 100 € via info@neues-brett.de)},
shuttleTimes[] {direction (hin/zurück), day, times[]}, announcement (optional banner text,
e.g. "Earlybird live"), heroVideo (file/URL, **optional** — absent → illustrated hero) +
heroPoster, recapVideoUrl (YouTube link for the story section).

**Localization**: all editor-facing text fields (blurbs, bios, descriptions, FAQ answers,
legal pages) use shared `localeString` / `localeText` / `localeBlock` object types with
`de` as the only active language for now. Adding English later = adding `en` to one
central languages array and filling in fields — no schema restructuring, no content
migration. Frontend GROQ selects with fallback: `coalesce(field[$locale], field.de)`.

**Publishing**: no custom `published`/reveal flags anywhere — Sanity's native
draft/publish is the single mechanism. Whatever is published is on the site.

Studio niceties: `structureTool` layout with singletons pinned, artist ordering by day,
preview panes later. German field titles/descriptions so Verein folks can navigate.
Embedded `performances[]` on artist is enough for v1; if a real timetable comes, promote to
a `performance` document (artist ref + stage ref + start/end) without breaking the frontend.

### Frontend integration

- `@sanity/client` (works on Workers) against `apicdn.sanity.io`, `useCdn: true`,
  `perspective: 'published'`, read-only public dataset — no token in the Worker for
  published content.
- GROQ queries live in `src/features/<domain>/api/` as `queryOptions` factories
  (`['artists', 'list']`, `['artist', slug]`, `['settings']`…), responses parsed with zod
  before keying/rendering (CMS data is user input — validate at the boundary).
- Images via `@sanity/image-url`: width/format params + `srcset`, `auto=format`.
- Caching: SSR loader fetch + long `staleTime`; optionally Cloudflare Cache API with
  ~5-min TTL on Sanity responses. No rebuild needed for content changes.
- Typegen: `sanity typegen` (or zod-only) for typed GROQ results — decide when schemas land.

---

## 7. Assets & the hero video

- **Video (deferred — recap edit is being organized)**: launch with the illustrated hero;
  the spec below applies when the edit lands. The 2025 YouTube recap
  (https://www.youtube.com/watch?v=sACZxjbCPls) is own footage and can serve as source for
  the hero loop — ideally re-encoded from the original project file, not a YouTube rip.
  10–25 s loop cut from the recap. Encode
  H.264 MP4 (~1080p, target ≤ 6–8 MB) + WebM/AV1 source, plus a small 720p variant for
  mobile via `media` queries or JS pick. Host on Cloudflare R2 bound to the Worker
  (same-origin, no third party). Poster JPEG (~100 kB) is the LCP — preload it.
  `prefers-reduced-motion` → poster only. No audio track (strip it — saves bytes,
  autoplay-safe).
- **Illustrated hero (launch)**: recreate the Figma "Background v1" as CSS gradient + SVG
  layers (jungle silhouettes, fireflies, glowing eye). Pure CSS/SVG — no LCP cost beyond
  the wordmark.
- **Wordmark + eye logo**: SVG traced from the flyer assets.
- **Figma exports**: icon set (lantern, jellyfish, moth, mushroom, tent, fireflies), jungle
  silhouettes, "Background v1" gradient recreated in CSS (gradient + noise), NB logo + glow.
- **Photos**: last year's festival photos → Sanity `memory` docs (check consent of
  recognizable people before publishing — flag in studio description).

---

## 8. SEO, meta, non-functional

- Per-route `head()`: titles ("Grundstock Festival 2026 — 13.–16. August, Vilswörth"),
  descriptions, canonical (absolute, on `grundstock-festival.de`); one designed OG image
  (flyer-derived, 1200×630, absolute URL) + `twitter:card summary_large_image`.
- Canonical host discipline: apex `grundstock-festival.de`; 301 `www` → apex and
  `neues-brett.de` (+ www) → apex. Preview/staging URLs (`*.workers.dev`) get
  `X-Robots-Tag: noindex` so Google never indexes a duplicate.
- JSON-LD `MusicFestival` on `/`: name, startDate 2026-08-13 / endDate 2026-08-16,
  location, organizer (Neues Brett e.V.), offers → Eventfrog URL. Good Google event
  snippet for free.
- `sitemap.xml` + `robots.txt` served by the Worker.
- **Analytics: Cloudflare Web Analytics** (decided — free, cookieless, no banner needed;
  listed transparently in the Datenschutzerklärung). Beacon in `__root.tsx`. Plausible has
  no free hosted tier (30-day trial only; self-hosting needs a paid VPS), so it's out for
  the zero-cost year. Limitation: no custom events — but because all three CTAs route
  through same-origin redirect paths (`/tickets`, `/helfen`, `/mittelgschaftler`),
  per-path request counts double as a free conversion proxy. If proper event tracking is
  ever wanted, Umami Cloud's free hobby tier (cookieless, custom events) is the upgrade
  path without touching the no-banner promise.
- A11y: contrast-check amber-on-purple (adjust shades to ≥ 4.5:1 for text), focus-visible
  styles, semantic landmarks, alt texts required in CMS image fields, reduced motion.
  Additionally: `<html lang="de">`; genre marquee pauses on hover and under
  `prefers-reduced-motion` (duplicated marquee content `aria-hidden`); artist carousel
  keyboard-operable with visible prev/next buttons; the ticking countdown is **not**
  `aria-live` (it would spam screen readers) — the static date text is the accessible
  source of truth.
- i18n: switch Paraglide base locale to `de`; keep `en.json` in sync but unlaunched. The
  vite plugin is already configured with `strategy: ["url", "baseLocale"]`, so English
  later ships as an `/en/…` URL prefix (+ `hreflang` tags then) with no routing rework.
- Age note (18+) visible near ticket CTAs.

### Security headers (set on all Worker responses)

- `Content-Security-Policy`: `default-src 'self'`; `img-src 'self' cdn.sanity.io`;
  `frame-src www.youtube-nocookie.com`; `script-src 'self' static.cloudflareinsights.com`
  (+ whatever the hydration inline scripts need — nonce or hash, verify against Start's
  output); `frame-ancestors 'none'`.
- `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, minimal `Permissions-Policy`.
- External links: `target="_blank"` + `rel="noopener noreferrer"`.

### Zero-cost budget (2026 constraint: free tiers only)

| Service | Plan | Relevant limits | Cost |
|---|---|---|---|
| Cloudflare Workers + static assets | Free | 100k Worker-Requests/Tag; asset requests free & uncounted | 0 € |
| Sanity (Content Lake + Studio-Hosting via `sanity deploy` → `*.sanity.studio`) | Free | seats/bandwidth/asset limits far above this site's needs | 0 € |
| Cloudflare Web Analytics | Free | — | 0 € |
| Cloudflare R2 (hero video later) | Free tier | 10 GB storage, **zero egress fees** | 0 € |
| Cloudflare Email Routing (`info@grundstock-festival.de` → forward to `info@neues-brett.de`) | Free | forwarding only | 0 € |
| Fonts (@fontsource, OFL), MapLibre + OpenFreeMap tiles | OSS | — | 0 € |
| Domain `grundstock-festival.de` | — | — | ~10–15 €/Jahr (single fixed cost) |

### Launch & ops checklist

- **DNS**: zone on Cloudflare; custom domain routed to the Worker (`routes` or custom
  domain in `wrangler.jsonc` — currently unset); apex + www; 301 www → apex.
- **Old domain**: `neues-brett.de` → Bulk Redirects (301, path-preserving) to the new
  domain; keep it alive at least through the festival (printed QR codes may use it).
- **Staging**: `wrangler versions upload` preview URLs (or a separate env) for review
  before production deploys; `noindex` header on anything non-production (see above).
- **CI gap**: add `pnpm build` to `.github/workflows/ci.yml` — today an SSR/build break
  would only surface at deploy time. Deploys stay manual (`pnpm deploy`, never automated
  per CLAUDE.md).
- **Monitoring**: Workers Logs (free tier) + `wrangler tail` for debugging; optional free
  uptime ping (e.g. UptimeRobot) on `/` before the ticket-rush weeks.
- **Backups**: Sanity free plan has no point-in-time restore — run
  `sanity dataset export` periodically (cron or manual before big edits) and stash the
  tarball; content is irreplaceable volunteer work.
- **Sanity config**: CORS origins for localhost + production domain + studio; invite the
  Verein editors (free seats); German field titles in the studio.
- **Icons/PWA-lite**: favicon set from the eye logo, `site.webmanifest`,
  `theme-color` (deep night purple) — makes the browser chrome match the design.

---

## 9. Build phases

**Phase 0 — Foundation (repo hygiene)**
Remove demo routes/ThemeToggle, de as base locale, theme tokens + fonts, header/footer
shell, deploy pipeline check. → deployable skeleton.

**Phase 1 — Homepage + Legal + SEO/Analytics (launchable)**
Illustrated hero + countdown, all home sections with placeholder/static content, recap
video facade, drafted Impressum + Datenschutz, `/tickets` + `/helfen` +
`/mittelgschaftler` redirects, themed 404, security headers, SEO basics
(meta/OG/canonical, sitemap.xml, robots.txt, JSON-LD), Cloudflare Web Analytics beacon,
domain setup + redirects (www → apex, neues-brett.de → grundstock-festival.de), favicon +
manifest. → live on grundstock-festival.de.

**Phase 2 — CMS**
Sanity schemas + studio structure + deploy studio; seed artists/stages/workshops/settings;
wire home teasers, `/lineup`, `/artists/$slug`, `/workshops`, `/infos` to Sanity; legal
pages from CMS. → Verein can edit content.

**Phase 3 — Subpages & polish**
`/verein`, `/anreise` (static map v1 + shuttle), animations/parallax pass, performance
audit (Lighthouse on throttled mobile), a11y pass.

**Phase 4 — Nice-to-have (post-launch)**
Hero video swap-in (as soon as the recap edit exists), memories gallery/photo strip (once
photos are accessible), interactive MapLibre map, timetable view (per-stage schedule),
Spotify playlist section, English locale (fill Paraglide `en.json` + CMS `en` fields),
announcement banner usage.

---

## 10. Resolved facts & open questions

Resolved:

- **Dates**: 13.–16.08.2026 (Do–So). Program Do–Sa night; Sunday = Abbau & Abreise.
- **Recap video**: being organized — launch with illustrated hero, swap in later (§4, §7).
- **Helfertool**: normal shifts https://airtable.com/appo2wY2SKFOd6ZeL/pagGiBBo6j2Yfpfl2/form,
  Mittelgschaftler https://airtable.com/appo2wY2SKFOd6ZeL/pagay1nyKPcPULWaM/form
  (8h-Schicht + mehr Verantwortung → halber Ticketpreis, open to everyone).
- **Spenden**: Überweisung an Neues Brett e.V., IBAN DE36 4306 0967 1355 5742 00;
  Spendenquittung ab 100 € per Mail an info@neues-brett.de.
- **Shuttle** (Tickets im Eventfrog-Shop): Regensburg→Grundstock Do 13:00/15:30/18:00 +
  Fr 10:00/12:00/14:00; Grundstock→Regensburg So 10:00/12:00/15:00/17:00.

- **Legal texts**: none exist — we draft template-based Impressum + Datenschutz and seed
  them into the CMS (§5); Verein reads them over before launch.
- **Lineup reveal**: no drip announcements — everything published in the CMS goes live
  immediately (festival is ~6 weeks out).
- **Photos 2025**: low prio, added later once accessible. The 2025 recap video exists:
  https://www.youtube.com/watch?v=sACZxjbCPls → story-section embed + potential hero-loop
  source.
- **English**: not needed now; architecture is translation-ready (Paraglide `en.json` +
  CMS locale fields), launch is de-only.
- **SEO + Analytics**: in scope for Phase 1 — meta/OG/sitemap/JSON-LD plus Cloudflare Web
  Analytics (free, cookieless, no banner). Plausible has no free hosted tier → out for
  the zero-cost year; Umami Cloud free tier is the later upgrade path for CTA events.
- **Domain**: `grundstock-festival.de` (being purchased). Canonical host; `neues-brett.de`
  301s to it and stays alive through the festival for old links/QR codes.
- **Budget**: free tiers only in 2026 (see §8 budget table); domain is the single cost.
- **Verein-Stammdaten**: VR 201964, Amtsgericht Regensburg; Vorstand Vinzenz Abt & Max
  Pindl. Only names go on the site — birth dates/home towns from the register do not.

Still open:

1. **Ladungsfähige Anschrift** for Impressum + Datenschutz-Verantwortlicher — § 5 DDG
   requires a street address (Postfach insufficient). Typical Verein fix: Vereinssitz
   address or c/o address of a Vorstand member. This is the only remaining blocker, and it
   only blocks the legal pages — not the build.
