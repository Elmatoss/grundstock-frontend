# Repository review — grundstock-frontend

Full-repo audit (correctness/SSR, data layer, i18n, SEO, a11y, performance, security/privacy,
code quality, tests) of the working tree on `develop` (including the uncommitted language-switcher
WIP), reviewed 2026-07-08 against `CLAUDE.md` and `docs/PLAN.md`.

## Executive summary

The codebase is in very good shape. The architecture matches its own rules: routes are thin and
consistent, all data goes through `queryOptions` factories with zod at the Sanity boundary,
query caches are locale-independent (both languages fetched once, selected at render), the
locale negotiation in `src/server.ts` is loop-safe and well-commented, and message catalogs are
in perfect 142/142 key parity with no placeholder mismatches and no unused/undefined keys
(147/147 after the fixes below — parity re-verified).
TypeScript is strict with exactly one documented `as any`. Production builds strip devtools
correctly and leak no secrets.

**No critical findings.** The two high findings are a privacy-declaration gap (the Datenschutz
does not mention the Sanity image CDN, which PLAN §5 requires and which becomes user-visible the
moment artist images are published) and a missing focus trap in the fullscreen menu (it claims
`aria-modal` but lets Tab escape into the page behind). The mediums are mostly "the code drifted
from a deliberate PLAN decision": ticket/helper CTAs bypass the `/tickets`–`/helfen` redirect
proxies that PLAN §8 designates as the free conversion-count mechanism; images skip the planned
`srcset`; the marquee doesn't pause on hover; the `prepare` script compiles Paraglide with the
wrong (default) strategy. Plus one real performance win: the 173 KB `@sanity/client` chunk loads
on every page and can be replaced by a ~30-line fetch wrapper.

Legend: **bug** = observable misbehavior · **improvement** = works, but measurably better after
the fix · **nice-to-have** = polish. Status: **fixed** / **recommended** (documented, not
changed — ambiguous, risky, or the Verein's/designer's call) / **skipped** (+ why).

| # | Sev | Type | Finding | Status |
|---|-----|------|---------|--------|
| H1 | high | bug | Datenschutz omits Sanity CDN (image host) disclosure | fixed |
| H2 | high | bug | SiteMenu overlay: `aria-modal` without focus trap | fixed |
| M1 | medium | improvement | CTAs bypass `/tickets` & `/helfen` redirect proxies (PLAN §8) | fixed |
| M2 | medium | improvement | 173 KB `@sanity/client` chunk on every page → fetch wrapper | fixed |
| M3 | medium | bug | `sitemap.xml` missing `/festival-policy` (de + en) | fixed |
| M4 | medium | bug | Negotiated HTML responses sent without `Vary` | fixed |
| M5 | medium | bug | `prepare` runs bare Paraglide CLI → wrong strategy/urlPatterns | fixed |
| M6 | medium | improvement | Sanity images: no `srcset`/`sizes`; detail img has no dimensions (CLS) | fixed |
| M7 | medium | bug | Shared dialog primitive: hardcoded English "Close" for screen readers | fixed |
| M8 | medium | improvement | No skip-to-content link (WCAG 2.4.1) | fixed |
| M9 | medium | improvement | Genre marquee doesn't pause on hover (PLAN §8) | fixed |
| L1 | low | improvement | `InfosPage` kicker "FAQ" hardcoded in JSX | fixed |
| L2 | low | improvement | Mailto subject hardcoded in `MittelgschaftlerDialog` | fixed |
| L3 | low | improvement | `verein_spenden_receipt` embeds email literal (others parameterize) | fixed |
| L4 | low | improvement | JSON-LD `startDate` duplicates `site.festivalStart` as a literal | fixed |
| L5 | low | improvement | Decorative "✦" heading unreadable for screen readers | fixed |
| L6 | low | bug | Performance list key can collide (`day-stage` twice) | fixed |
| L7 | low | improvement | `ShuttleTables` day-label map typed `Record<string, …>` | fixed |
| L8 | low | improvement | Dead empty `TanstackQueryProvider` default export | fixed |
| L9 | low | improvement | Vestigial `@/*` tsconfig alias (project uses `#/*`) | fixed |
| L10 | low | improvement | Tests: only `cn()` covered; pure logic untested | fixed |
| L11 | low | bug | `prefersGerman` treats `q=0` as acceptance | fixed |
| L12 | low | improvement | Tiny footnote text at `text-moon-dim/70` ≈ 4.3:1 contrast | fixed |
| R1–R8 | — | — | Recommendations without code changes | documented |

---

## High

### H1 · Datenschutz does not mention the Sanity image CDN — `src/features/legal/Datenschutz.tsx`

**bug (privacy-claims mismatch)** · PLAN §5 explicitly lists "Sanity CDN als Bild-Host" as
required Datenschutz content. Artist/workshop images are loaded from `cdn.sanity.io`
(`src/lib/sanity.ts` image builder), so every visitor's IP reaches Sanity Inc. (US) the moment
the first artist with an image is published — and the privacy policy claims nothing about it.
Today the dataset is empty, so nothing is transferred yet; this becomes a real gap on content
launch, which is exactly when nobody will remember to update the legal text.

**Fix:** added a "Bilder-CDN (Sanity)" section to both `PrivacyDe` and `PrivacyEn`, worded in
line with the existing hosting section (legitimate interest, US transfer note). Like the rest of
the legal drafts, it should get the Verein read-over PLAN already schedules.

### H2 · SiteMenu overlay has `aria-modal="true"` but no focus trap — `src/components/SiteMenu.tsx`

**bug (a11y)** · The fullscreen menu focuses the close button on open, restores focus on close,
locks scroll and closes on Escape — all correct — but Tab/Shift-Tab walk straight out of the
overlay into the (visually hidden) page behind it. For keyboard and screen-reader users the
"modal" isn't modal; focus disappears behind a fullscreen curtain.

**Fix:** added a Tab handler to the existing keydown listener that cycles focus within the
overlay (first ↔ last focusable element), scoped by an `overlayRef`. The radix `ui/dialog`
would provide this for free, but rebuilding the animated menu on radix would churn the staggered
transition design for no user-visible gain — trap added in place instead.

---

## Medium

### M1 · Ticket/helper CTAs bypass the `/tickets` and `/helfen` redirect proxies

**improvement (PLAN drift)** · PLAN §8 (analytics): Cloudflare Web Analytics has no custom
events, so "all three CTAs route through same-origin redirect paths (`/tickets`, `/helfen`,
`/mittelgschaftler`), per-path request counts double as a free conversion proxy". The routes
exist (`src/routes/tickets.tsx`, `helfen.tsx`), but every CTA linked the external URL directly
(`Hero.tsx`, `TicketsCta.tsx`, `SiteMenu.tsx`, `ShuttleTables.tsx`, `HelfenSection.tsx`,
`VereinPage.tsx`) — so ticket-click conversions were invisible and the print/QR URLs and web
CTAs could drift apart.

**Fix:** CTAs now point at `localizeHref("/tickets")` / `localizeHref("/helfen")` as plain
anchors (full page load → Worker counts the request → 307 to the current external target;
TanStack Router does not intercept non-`Link` anchors). `target="_blank"` semantics unchanged.
`site.ticketUrl`/`site.helfertoolUrl` remain the single source for the actual targets.

### M2 · `@sanity/client` costs 173 KB on every page — `src/lib/sanity.ts`

**improvement (performance)** · The homepage (via `featuredArtistsQueryOptions`) and all
content routes pull `client/assets/sanity-*.js` (173 KB raw, plus a stega side-chunk) — the
single biggest non-framework chunk — to do the only thing this site ever does: GET one GROQ
query against the public CDN endpoint. The full client (mutations, listeners, stega,
projection tooling) is dead weight on a read-only site with a public dataset.

**Fix:** replaced with a ~30-line `sanityFetch()` wrapper around
`https://<project>.apicdn.sanity.io/v<api>/data/query/<dataset>?query=…&$param=…&perspective=published`
(identical semantics: CDN endpoint, published perspective, JSON-encoded params). The image URL
builder runs on plain `{ projectId, dataset }` config, so `@sanity/image-url` stays.
`@sanity/client` removed from dependencies. All three query factories and the zod boundary are
unchanged — responses still validate at the edge. **Measured:** total client JS 739 → 632 KB;
the remaining 87 KB `sanity-*` chunk is `src/lib/sanity.ts` + zod itself (a deliberate
boundary choice), and the stega side-chunk is gone.

### M3 · `sitemap.xml` missing `/festival-policy` — `public/sitemap.xml`

**bug (SEO)** · `/festival-policy` is indexable (its `seo()` call has no `noindex`, unlike
Impressum/Datenschutz/Ticketbedingungen which are correctly noindexed and correctly absent),
but neither `https://grundstock-festival.de/festival-policy` nor the `/en` variant is listed.

**Fix:** added both URL entries with the same hreflang cluster pattern as the other routes.

### M4 · Locale-negotiated HTML served without `Vary` — `src/server.ts`

**bug (cache correctness)** · German-URL responses vary by `Cookie` (switcher choice) and
`Accept-Language` (first-visit negotiation): the same URL `/` can answer `200 German` or
`302 → /en` depending on those headers. The 302 sets `Vary` correctly, but the 200 path sets
none — any intermediary (or a future `Cache-Control` on HTML, see R2) could serve a
German-cached page to a visitor whose cookie says `en`, silently disabling the negotiation.

**Fix:** `Vary: Accept-Language, Cookie` is now appended to HTML document responses in the
Worker fetch handler.

### M5 · `prepare` script compiles Paraglide with default options — `package.json`, `scripts/compile-i18n.mjs`

**bug (tooling footgun)** · `pnpm i18n:compile` ran the bare CLI
(`paraglide-js compile --project … --outdir …`), which knows nothing about the
`strategy: ["url", "cookie", "baseLocale"]` + custom `urlPatterns` configured in
`vite.config.ts` — the exact options that prevent the documented `/en` 307 redirect loop. After
every `pnpm install` (the `prepare` hook) the compiled runtime on disk was wrong until the next
`vite dev`/`build` recompiled it; anything consuming the runtime outside vite (or a first
`pnpm preview` after install) saw broken `/en` routing.

**Fix:** compiler options now live once in `paraglide.config.mjs`, imported by both
`vite.config.ts` and a new `scripts/compile-i18n.mjs` (using `compile()` from
`@inlang/paraglide-js`); `i18n:compile` calls the script. CLI defaults can no longer diverge
from the vite plugin.

### M6 · Sanity images: fixed-size URL, no `srcset`/`sizes`; detail image shifts layout

**improvement (performance/CLS)** · PLAN §6: "Images via `@sanity/image-url`: width/format
params + `srcset`". `ArtistCard` (640×480), `WorkshopsPage` (640×360) and `ArtistDetailPage`
(900×900) each requested one fixed size — a 640 px download for a 256 px card on mobile, and a
too-small 900 px for a 2× desktop detail view. The detail `<img>` also had no
dimensions/aspect-ratio, so the page reflows when it loads (CLS).

**Fix:** `sanityImageProps()` helper in `src/lib/sanity.ts` produces `src` + DPR-graded
`srcSet` + `width`/`height` for a requested display size; all three call sites use it with
honest `sizes` attributes.

### M7 · Dialog primitive hardcodes English "Close" — `src/components/ui/dialog.tsx`

**bug (i18n/a11y)** · The `sr-only` label of the X button (and the optional footer close
button) said "Close" — German screen-reader users get English UI in the Mittelgschaftler
dialog. shadcn ships it that way, but the file is owned by the repo and the project rule is
"no hardcoded UI strings".

**Fix:** both use the new `m.dialog_close()` key (de "Schließen" / en "Close").

### M8 · No skip-to-content link — `src/routes/__root.tsx`

**improvement (a11y, WCAG 2.4.1)** · Keyboard users must tab through the entire header
(logo, 5 nav links, 2 language buttons, menu button) on every page before reaching content.

**Fix:** added a visually-hidden-until-focused skip link as the first focusable element,
targeting a new `id="main"`/`tabIndex={-1}` wrapper around the route content (wrapper keeps the
existing flex column behavior; `m.skip_to_content()` in both locales).

### M9 · Genre marquee doesn't pause on hover — `src/features/home/components/GenreMarquee.tsx`

**improvement (PLAN §8 explicitly)** · "genre marquee pauses on hover and under
`prefers-reduced-motion`". Reduced motion was handled (`motion-safe:` + `sr-only` list +
`aria-hidden` strip — nicely done); hover pause was missing.

**Fix:** `hover:[animation-play-state:paused]` on the animated strip.

---

## Low

### L1 · `InfosPage` kicker "FAQ" hardcoded — `src/features/infos/components/InfosPage.tsx`
Every other kicker is a message key. "FAQ" happens to read the same in both languages, but the
rule is mechanical for a reason. **Fixed:** `m.infos_kicker()`.

### L2 · Mailto subject hardcoded — `src/components/MittelgschaftlerDialog.tsx`
`?subject=Mittelgschaftler:in Grundstock 2026` was a German literal in JSX. **Fixed:**
`m.mittel_mail_subject()` (locale-appropriate spelling in each catalog).

### L3 · `verein_spenden_receipt` embeds `info@neues-brett.de` — `messages/*.json`
`helfen_donate_text` parameterizes `{email}`; the receipt string didn't, so an address change
would have to be found in prose. **Fixed:** parameterized, `VereinPage` passes
`site.contactEmail`.

### L4 · JSON-LD `startDate` literal — `src/routes/index.tsx`
`startDate: "2026-08-13"` duplicated `site.festivalStart` while `endDate` already used
`site.festivalEndDate`; a CMS-driven date change (Phase 2) would desync them. **Fixed:**
derived from `site.festivalStart` (full ISO datetime — valid and richer for schema.org).

### L5 · "✦" heading for unscheduled artists — `src/features/lineup/components/LineupPage.tsx`
Screen readers announce "black four-pointed star" as a section heading. **Fixed:** glyph is
`aria-hidden`, `sr-only` label `m.lineup_unscheduled()` added (de "Weitere Acts" / en
"More acts").

### L6 · Performance key collision — `src/features/lineup/components/ArtistDetailPage.tsx`
`key={day-stage.slug}` breaks if an artist plays the same stage twice on one day (two
Schepperschuppen sets). **Fixed:** time appended to the key.

### L7 · `dayLabel: Record<string, () => string>` — `src/features/home/components/ShuttleTables.tsx`
Stringly-typed map: a new shuttle day (`"Sa"`) would compile fine and crash at render
(`dayLabel[s.day]()` → undefined call). **Fixed:** keyed by
`(typeof shuttles)[number]["day"]` so the compiler forces the label entry.

### L8 · Dead export — `src/integrations/tanstack-query/root-provider.tsx`
Empty `TanstackQueryProvider` default export, never imported (and rendering it would return
`undefined`). **Fixed:** removed; `router.tsx` also switched to the `#/` alias while touching
the import.

### L9 · Vestigial `@/*` alias — `tsconfig.json`
Nothing imports via `@/` (verified repo-wide) and `components.json` maps shadcn to `#/`; keeping
both invites drift. **Fixed:** removed `@/*`.

### L10 · Test coverage — `src/lib/utils.test.ts` was the only test
Highest-value pure-logic targets now covered (see "Tests added" below): locale negotiation
(q-parsing, cookie/Accept-Language redirect decisions, trailing slashes, non-HTML bypass), the
`seo()` head factory (canonical/hreflang/noindex per locale), `localized`/`localizedBlock`
fallbacks, countdown math, and zod boundary schemas against realistic Sanity fixtures. UI
snapshot tests deliberately not added.

### L11 · `prefersGerman` accepts `q=0` — `src/server.ts` → `src/lib/locale-negotiation.ts`
`Accept-Language: de;q=0` means "explicitly not German" (RFC 9110) but ranked as top choice →
stayed German. Edge case, fixed while extracting the negotiation logic into a pure, tested
module (`src/lib/locale-negotiation.ts`); `q=0` entries are now filtered out, and an
all-rejected header falls back to German (crawler-safe default, unchanged).

### L12 · Footnote contrast — `src/features/home/components/TicketsCta.tsx`
`text-moon-dim/70` on the night background ≈ 4.3:1 for `text-xs` copy (18+ note, terms note) —
just under the 4.5:1 PLAN §8 commits to. **Fixed:** bumped those two to `/85` (≈ 5.6:1); the
visual difference is imperceptible on the dark ground.

---

## Recommendations (documented, no code change)

### R1 · Content-Security-Policy (deliberately deferred in `src/server.ts`)
The comment and PLAN §8 already track this. When picked up: TanStack Start's inline hydration
scripts need `'nonce-…'` propagation (Start supports a `nonce` option on the router/scripts) or
`'unsafe-inline'` fallback for scripts is off the table. Concrete target policy:
`default-src 'self'; img-src 'self' cdn.sanity.io data:; script-src 'self' 'nonce-…'
static.cloudflareinsights.com; connect-src 'self' *.apicdn.sanity.io cloudflareinsights.com;
frame-src www.youtube-nocookie.com; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'`.
Verify against real Start output before shipping — a wrong CSP white-screens the site, which is
why it stays a recommendation here.

### R2 · HTML/Sanity caching (PLAN §6 "static-ish caching")
Every page view is an SSR pass and (cache-cold) a Sanity CDN round trip. Options, in order of
effort: `Cache-Control: public, max-age=0, s-maxage=60` (+ the now-present `Vary`) on HTML;
Cloudflare Cache API with ~5 min TTL around `sanityFetch`. Worth doing before the ticket-rush
weeks; free-tier request quotas are generous enough that this is about latency, not cost.

### R3 · Dynamic sitemap once the CMS has content
`public/sitemap.xml` is static and cannot list `/artists/$slug`. When artists are published,
serve the sitemap from the Worker (fetch slugs, emit XML, cache). Until then the static file is
fine.

### R4 · `docs/PLAN.md` drift — update the plan, not the code
Three WIP decisions supersede PLAN and should be recorded there so the next reader doesn't
"fix" them backwards: **(a)** `/mittelgschaftler` is no longer an Airtable redirect but an
on-site dialog + email application (`site.mittelgschaftlerEmail`), with the route redirecting
to `/#helfen`; **(b)** `/anreise` links out to Google Maps instead of the planned static map
image (simpler, still banner-free — but PLAN §5's "styled static map v1" remains the nicer
target); **(c)** the visible language switcher shipped in v1 (PLAN §1 said "no visible locale
switcher in v1") together with full English content — `en.json` is complete and good, so this
is strictly an upgrade, but PLAN §10 "launch is de-only" is now stale. Also: the home FAQ is a
static message-key list rather than CMS `faqItem`s (fine as fallback — `InfosPage` already
treats it that way — but note it's duplicated content until Phase 2 wires the teaser).

### R5 · Impressum is German-only under `/en`
Deliberate (comment in `Impressum.tsx`; German legal text is the binding one). If it ever
bothers anyone, an English courtesy note above the German text is enough — full translation of
legal boilerplate is not required and arguably unwise.

### R6 · `vorstand@neues-brett.de` hardcoded twice in `Ticketbedingungen.tsx`
The legal drafts hardcode many facts by design (they move to CMS portable text in Phase 2), so
this is fine — but if the ticket-transfer address changes before then, remember it lives in two
JSX literals, not in `site.ts`.

### R7 · Fonts
Three variable families are self-hosted correctly (fontsource, `font-display: swap`, subsetted
unicode ranges — a real visit downloads ~150 KB of latin subsets, not the 665 KB on disk).
Two cheap wins if Lighthouse ever complains: preload the Shantell latin woff2 (it renders the
above-the-fold H1), and reconsider whether Fraunces earns its slot — it currently styles only
the hero date line and two day headings.

### R8 · Post-festival countdown state
After 2026-08-13 14:00 the hero shows "Es ist so weit!" indefinitely (also during teardown
Sunday and after). Fine for now; the Phase 2 CMS settings (festivalStart/End) are the right
moment to add an "it's over" state.

---

## Verified-clean (audited, no finding)

- **SSR safety**: countdown seeds from render-time `Date.now()` with per-cell
  `suppressHydrationWarning`; firefly positions come from a seeded PRNG (hydration-stable);
  the menu portal is mount-gated; `navigator.clipboard` only in event handlers. No browser
  globals reached during SSR; no Node-only APIs in the Worker path (`nodejs_compat` present).
- **Locale routing**: `rewrite: {input: deLocalizeUrl, output: localizeUrl}` + explicit
  `urlPatterns` (the documented 307-loop fix) is coherent; `server.ts` redirects only German
  URLs, never `/en`, only GET/HEAD HTML; www→apex 301 before negotiation; `X-Robots-Tag:
  noindex` on non-canonical hosts. Switcher writes the cookie only on explicit choice
  (verified in compiled runtime: single `document.cookie=` site, 400-day max-age — matches the
  Datenschutz claim to the day).
- **Data layer**: hierarchical keys (`['artists','list']`, `['artist', slug]`), 5-min
  `staleTime` per query, `ensureQueryData` + `useSuspenseQuery` + error/pending components on
  all data-backed routes; homepage deliberately uses `prefetchQuery` + non-suspense `useQuery`
  so Sanity downtime can never break it; artist-detail loader converts `null` to a real 404.
- **i18n**: 142/142 key parity, placeholder sets identical, zero unused and zero undefined
  keys; the 12 identical de/en values are all legitimately identical (proper nouns, "Lineup",
  "Regensburg → Grundstock"…). German copy quality is high and du-Form-consistent.
- **SEO**: per-route titles/descriptions via one `seo()` helper that correctly owns
  canonical + hreflang (root deliberately emits none — the links-concat pitfall is documented
  in `seo.ts`); legal pages noindexed; OG image exists at exactly 1200×630; JSON-LD
  `MusicFestival` with location/organizer/offers; robots.txt + sitemap present.
- **Privacy**: no cookie banner needed — verified: fonts self-hosted, YouTube behind a real
  click facade (`youtube-nocookie`, self-hosted poster), analytics beacon cookieless and
  disclosed, the only cookie is the switcher's functional one (§ 25 Abs. 2 TDDDG claim
  matches implementation). No Sanity tokens anywhere in the client bundles (checked dist).
- **Security headers**: HSTS, nosniff, referrer-policy, permissions-policy, XFO:DENY on every
  response (CSP consciously deferred → R1).
- **PWA**: manifest + icon set (incl. maskable) present and sane; deliberately no service
  worker (nothing to go stale) — matches PLAN §8 "PWA-lite".
- **Build**: devtools fully absent from production chunks (checked for markers in dist);
  react-compiler preset active; CI runs typecheck + lint + tests + build (the PLAN checklist
  item about build in CI is already done).

## Tests added (L10)

- `src/lib/locale-negotiation.test.ts` — q-ranking, wildcard, malformed headers, `q=0`
  rejection, cookie precedence, `/en` passthrough, trailing-slash normalization, non-HTML and
  POST bypass, redirect target/status/headers.
- `src/lib/seo.test.ts` — canonical per locale, hreflang triple (de/en/x-default), og:url
  consistency, noindex drops canonical+hreflang, description omission.
- `src/lib/sanity.test.ts` — `localized`/`localizedBlock` de/en fallback semantics (incl. empty
  `en` array → de), `sanityImageProps` srcset shape, GROQ param encoding of `sanityFetch` URLs.
- `src/features/home/components/countdown.test.ts` — `splitCountdown` math (day/hour/min/sec
  decomposition, zero clamp).
- `src/features/lineup/types.test.ts` — artist card/detail fixtures parse; missing-`de`
  locale-string rejection; workshop + FAQ fixtures.

## What changed (Phase 3 summary)

See findings table for the per-item status. Files touched:

- `src/features/legal/Datenschutz.tsx` — H1 (new §4 Bilder-CDN in de + en, numbering shifted)
- `src/components/SiteMenu.tsx` — H2 (focus trap), M1 (tickets CTA via proxy)
- `src/features/home/components/Hero.tsx`, `TicketsCta.tsx`, `ShuttleTables.tsx`,
  `HelfenSection.tsx`, `src/features/verein/components/VereinPage.tsx` — M1, L3, L12
- `src/lib/sanity.ts` (+ all three `api/` files) — M2 (`sanityFetch`), M6 (`sanityImageProps`)
- `package.json`, `pnpm-lock.yaml` — M2 (`@sanity/client` removed), M5 (`i18n:compile` script)
- `paraglide.config.mjs` (new), `scripts/compile-i18n.mjs` (new), `vite.config.ts` — M5
- `public/sitemap.xml` — M3
- `src/server.ts`, `src/lib/locale-negotiation.ts` (new) — M4, L11
- `src/features/lineup/components/ArtistCard.tsx`, `ArtistDetailPage.tsx`,
  `src/features/workshops/components/WorkshopsPage.tsx` — M6, L5, L6
- `src/components/ui/dialog.tsx` — M7
- `src/routes/__root.tsx` — M8 (skip link + `#main` wrapper)
- `src/features/home/components/GenreMarquee.tsx` — M9
- `src/features/infos/components/InfosPage.tsx` — L1
- `src/components/MittelgschaftlerDialog.tsx` — L2
- `src/routes/index.tsx` — L4
- `src/features/home/components/Countdown.tsx` — L10 (pure `splitCountdown` export)
- `src/integrations/tanstack-query/root-provider.tsx`, `src/router.tsx` — L8
- `tsconfig.json` — L9
- `messages/de.json`, `messages/en.json` — new keys: `skip_to_content`, `dialog_close`,
  `infos_kicker`, `mittel_mail_subject`, `lineup_unscheduled`; `verein_spenden_receipt`
  parameterized
- Tests as listed above

## Verification log

Commands run after each increment and once at the end (all clean):

```
pnpm typecheck        # tsc --noEmit
pnpm check            # biome, 84 files
pnpm test             # vitest — 6 files, 45 tests
pnpm i18n:compile     # new script; runtime verified to contain url/cookie strategy + /en patterns
pnpm build            # production build; dist inspected (no devtools, no tokens, chunk sizes)
pnpm dev              # spot-checked via curl, see below
```

Dev-server spot checks (HTTP-level, both locales): `/` and `/en` render 200 with correct
`lang`, canonical, skip link, JSON-LD and localized `/tickets` hrefs; `Accept-Language:
en` on `/` → 302 `/en` (vary + no-store); cookie `en` on `/lineup` → 302 `/en/lineup`;
`/en` with cookie `de` stays 200 (no loop); `/lineup` + `/en/lineup` show the correct
empty states; `/datenschutz` + `/en/datenschutz` contain the new Sanity-CDN section with
correct renumbering and noindex; `/tickets`, `/en/tickets`, `/helfen` 307 to the external
targets; `/mittelgschaftler` 307 → `/#helfen`; unknown paths render the themed 404; all
security headers and `Vary: Accept-Language, Cookie` present on HTML responses.
