# Multi-year plan: editions, archive, and what comes after

Status: Phases 0–2 complete, 2026-08-23 (the week after Grundstock 2026).

## Why

The site and the CMS both assume there is exactly one festival, and that it is
2026. The dates live in `src/lib/site.ts`, the three programme days are a
hardcoded `do | fr | sa` enum mapped to fixed August dates in
`src/features/timetable/lib/schedule.ts`, and every Sanity document is implicitly
"2026" because no other year exists. The festival is now over and the homepage
still says *"Es ist so weit!"*, because `FESTIVAL_MODE.end` is the only notion of
"over" the code has and nothing renders a state past it.

Target state:

- Every piece of programme content in the CMS belongs to a **festival edition**
  (a year). Adding 2027 means creating one document and filling the same
  entities underneath it — no schema change, no deploy for the content itself.
- The public site always talks about the **upcoming** edition. When there is
  none, it says thank you and points at the archive.
- Everything that has ended is reachable forever under **/archiv/<year>**:
  lineup, workshops, running order, aftermovie, and a gallery of memories.

## Decisions taken

| Question | Decision | Consequence |
| --- | --- | --- |
| Artists across years | **One document per edition.** An act booked twice is two documents. | Rebooking is one *Duplicate* click; per-year photo/blurb/genres come for free. No automatic "played 3 times" link — acceptable, revisit if it ever matters. |
| What nests per year | `artist`, `stage`, `workshop`, `memory` | Stages change between years (Bunker → Schepperschuppen), so they nest too. |
| FAQ | **Stays global.** | One list, shown on `/infos` for the upcoming festival. Archive years show no FAQ. No busywork per year. |
| Programme day | **`dayIndex` (1..n)**, dates derived from `edition.from` | Works for a Fri–Sun or four-day year. Weekday labels come from `Intl`, not from message keys. Needs a small data migration. |
| Logistics (ticket URL, shuttle times, helper tool, contact mail) | **Stay in `src/lib/site.ts`.** | Opening a new year needs a one-line deploy for these. Deliberate: they change once a year, and a typo'd IBAN in a CMS field is worse than a typo'd IBAN in a reviewed commit. |
| Dates, aftermovie, recap text | **Move to the edition document.** | These are what the countdown and the archive read, so they must be editable without a deploy. The "it's over, thanks for being part of it" line is *not* here: it says the same thing every year, so it is a translated string in the frontend rather than a field somebody has to remember to fill in. |
| Going live with a new year | **Sanity's publish state is the gate.** | A half-configured 2027 stays a draft and is invisible to the site (`perspective=published`). No extra `announced` flag needed. |

## Data model

```
siteSettings (singleton, global)     announcement banner only — unchanged
faqItem      (global)                unchanged

festivalEdition  ← new
  year                number, required, unique      identity + URL segment
  from                datetime, required            gates open → countdown target
  to                  datetime, required            festival over → farewell state
  programmeDays       number, default 3             day 1 = date of `from`
  aftermovieYoutubeId string, optional
  aftermoviePoster    image, optional
  recap               localeText, optional          archive blurb for the year

artist    + edition → reference(festivalEdition), required
stage     + edition → reference(festivalEdition), required
workshop  + edition → reference(festivalEdition), required
memory    + edition → reference(festivalEdition), required

artist.performances[].day  "do"|"fr"|"sa"  →  dayIndex  1|2|3
workshop.day               "do"|"fr"|"sa"  →  dayIndex  1|2|3
```

Studio structure becomes:

```
Inhalte
├── Festival-Einstellungen        (siteSettings singleton — banner)
├── FAQ                           (global)
├── ──────
└── Jahrgänge
     ├── 2026
     │    ├── Einstellungen       (the festivalEdition document)
     │    ├── Artists             filtered by edition._ref
     │    ├── Bühnen
     │    ├── Workshops
     │    └── Erinnerungen
     └── 2025                     (aftermovie + memories only)
```

Two details that make this pleasant rather than tedious:

- **Initial-value templates per edition.** `S.documentTypeList("artist")
  .initialValueTemplates([...])` inside the year's child list, so *Create new*
  from inside 2027 pre-fills `edition`. Requires declaring the templates in
  `schema.templates`.
- **Slug uniqueness scoped to the edition** via `options.isUnique`, so the same
  act can keep the same slug in two different years.

## Phase 0 — CMS foundation

Backwards compatible on purpose: every change here is additive, so the live site
keeps working untouched while the data is reshaped.

**Step 1 — `festivalEdition` schema + nested studio structure.** *(M)* — **done**
`schemaTypes/documents/festivalEdition.ts`, `schemaTypes/index.ts`,
`sanity.config.ts`. Add the optional `edition` reference to `artist`, `stage`,
`workshop`, `memory`; scoped slug `isUnique`; initial-value templates.
Done when: the studio shows *Jahrgänge*, and creating an artist from inside a
year pre-fills its edition.

**Step 2 — Seed and backfill.** *(S)* — **done**
`migrations/create-editions.ts` created `edition-2026`
(`2026-08-13T14:00+02:00` → `2026-08-16T12:00+02:00`, 3 programme days) and
`edition-2025` (`2025-08-14` → `2025-08-17`, carrying the `sACZxjbCPls`
aftermovie that used to be the hardcoded `site.recapYoutubeId`).
`migrations/assign-edition.ts` filed all 52 documents (40 artists, 3 stages,
9 workshops) under 2026 in one transaction. The `edition` field is now
`required()`. Verified against the published CDN: 0 orphans.

2025 exists as an aftermovie-only edition, which is the shape every year before
2026 will have — the archive has to render an edition with an empty lineup,
empty workshops and no timetable as the normal case.

**Step 3 — `dayIndex` migration.** *(S)* — **done**
`artist.performances[].dayIndex` and `workshop.dayIndex` (number, 1–7) replace
the `do | fr | sa` enum; `DAY_INDEX_DESCRIPTION` and `dayIndexValidation` are
shared between the two schemas, and the `festivalDays` export is gone.
`migrations/day-to-day-index.ts` mapped 40 performances + 9 workshops with no
unmapped values, patching by array `_key` rather than rewriting whole arrays.

The old `day` is deliberately **still there**, declared `hidden` and `readOnly`.
The frontend currently in production reads `"fr"`, so keeping the value means
Phase 0 shipped nothing user-visible and needs no deploy; declaring it keeps the
studio from flagging an unknown field. Phase 3 unsets it.

**Step 4 — Memories schema.** *(S)* — **done**
`memory` is now edition-scoped, gained an optional `youtubeId` and an `order`,
and lost the hand-typed `year` (no data to migrate — there are 0 memory
documents). The image stays **required even for a clip**: it is the gallery tile
either way, and with a `youtubeId` set it becomes the poster behind the play
button. One code path in the gallery, and nothing loads from Google until
somebody clicks. `consentChecked` finally gets a consumer — the gallery filters
on it, and the studio preview shows the consent state as the subtitle so an
editor can see why a picture never appeared without opening it.

## Phase 1 — Frontend reads editions — **done**

**Step 5 — `src/features/festival/`.** `types.ts` (a malformed edition is dropped
rather than taking every page down), `api/editions.ts`, `lib/festival.ts`,
`hooks/useFestival.ts`, plus `src/lib/intl.ts` for the shared festival-timezone
formatting. 15 unit tests in `lib/festival.test.ts`.

**Step 6 — Data layer.** Query factories take a year and key on
`["edition", year, …]`, so 2026's lineup and 2027's are separate cache entries.
`schedule.ts` lost `FESTIVAL_DAYS`, `FESTIVAL_MODE` and `isFestivalMode`;
`buildSchedule(artists, workshops, edition)` derives its dates from the edition.
Weekday labels come from `Intl` off the real date. The root loader fetches the
editions once so no page waterfalls to find out which year it is about.

**Step 7 — Countdown, live, farewell.** Verified against the running dev server
in all three states, using `?t=` to stand in for a future edition:

| clock | hero |
| --- | --- |
| real now (2026-08-23) | *Bis zum nächsten Mal* · "Grundstock 2026 ist vorbei" · thank-you · no ticket links |
| `?t=2026-07-01T12:00` | countdown reading **43 Tage 02 Stunden**, dates kicker, ticket CTA back |
| `?t=2026-08-14T17:30` | *Jetzt live · Mainstage · Rawbin* (who plays 17:15–17:45) |

**Step 8 — Placeholders.** Revised from the original plan, and this matters:
2026 had already ended when Phase 1 was written, so "no upcoming edition" is the
*present* state. Showing placeholders would have deleted the whole site today.
`featured = upcoming ?? mostRecentlyEnded` instead, exactly as the brief asked —
the programme stays up with a thank-you over it, and the archive is everything
ended *except* the featured edition. The `festival_tba_*` placeholder is
therefore only for a CMS with no editions at all.

### Deviations from the plan, and why

- **`site.ts` cleanup moved from Phase 3 to here.** `festivalStart`,
  `festivalEndDate` and `recapYoutubeId` had no readers left the moment the
  edition took over; leaving three dead constants that contradict the CMS for two
  more phases was worse than removing them.
- **The `day_*` messages stay.** The plan said to drop them in Phase 3, but
  `ShuttleTables` uses `day_do`/`day_fr`/`day_so` for the shuttle timetable, which
  has nothing to do with programme days. Only `day_sa` could go, and it is not
  worth the churn.
- **Ticket links are hidden when the festival is over** — hero, site menu,
  shuttle card and the `TicketsCta` section. Not in the original plan, but they
  all pointed at an Eventfrog event that had already happened.
- **`?t=` now pins the phase, not just the live layer.** Threading the pinned
  clock through `useFestival` and `Countdown` was needed to keep the preview
  honest: without it the tool showed the farewell while claiming to preview the
  festival, and the countdown rendered a run-down zero.
- **`workshop.dayIndex` is optional again.** Phase 0 made it required by
  oversight; the old `day` was optional, and the programme does list workshops
  before their slot is fixed. Performances still require one.

## Phase 2 — The archive — **done**

**Step 9 — `/archiv` and `/archiv/$year`.** New feature `src/features/archive/`.
The index lists ended editions with a poster (or the year set large as a
placeholder) and, instead of counts, **which sections the page actually has** —
"1 Acts" would need plural variants in two languages, and knowing an
aftermovie-only year *is* aftermovie-only is the more useful thing before
clicking. `editionSummaryListQueryOptions` gets the whole listing in one request.

The reachability rule matters and differs from the index rule:

- **`/archiv` lists** ended editions *except* the featured one, so nothing inside
  the site points at a second copy of the live lineup.
- **`/archiv/<year>` serves** *any* ended edition, featured included. A link to
  `/archiv/2026` has to work the day the festival ends, not only once a new year
  is announced — and Step 11's redirect needs a valid target. While that edition
  is still featured the page is `noindex`, so it does not compete with `/lineup`.

A year still to come 404s rather than leaking an unannounced lineup through a
guessed URL.

**Step 10 — Memories gallery.** Consent-gated **in GROQ**, not in the component:
an unapproved photo is never sent to a browser at all, not even to be hidden.
CSS-columns masonry so portrait and landscape photos keep their own aspect ratio,
one tile shape for images and clips alike (a clip's tile is its poster), and a
dialog to open one large. Nothing reaches YouTube until somebody presses play.

**Step 11 — Archive artist pages and legacy URLs.**
`/archiv/$year/artists/$slug` reuses `ArtistDetailPage`. `/artists/<slug>` now
rescues itself: if the slug is not in the featured edition, `pickArchiveYear`
finds the most recent *archived* year that has it and redirects there, so every
link shared during a festival stays alive. Unannounced editions are excluded by
construction, since `archive` only ever holds ended ones. Six unit tests cover
that function, because the branch is unreachable until a 2027 exists.

**Step 12 — Navigation and i18n.** *Archiv* added to the overlay menu and the
footer — matching where `verein` and `festival-policy` already live, since the
desktop bar is at capacity. 13 new message keys in both locales. The header's
hardcoded `Grundstock 2026` (a Phase 1 miss) and the `— Grundstock Festival 2026`
titles on `/verein`, `/anreise` and `/infos` now come from the edition.

Verified in **workerd against the live dataset**: 14 routes 200, bad and future
years 404, `/archiv/2026` renders the full lineup with `Freitag · Berthold Auge ·
00:00–01:15 · Schepperschuppen`, and all 20 page titles are year-driven. 113 tests.

### Deviations

- **No running-order rail on archive pages.** The timetable's whole design is
  about what is on *now* — proportional rows, live states, scroll-to-now — and
  stripped of that it is a long duplicate of the lineup. Set times moved onto the
  archive's artist cards instead, which is the part people come back for. Adding
  the rail later is a component-reuse job, not a rethink.
- **`WorkshopCard` and `VideoEmbed` extracted** rather than duplicated;
  `WorkshopCard` takes its heading level from the caller because it sits under an
  `h1` on `/workshops` and under an `h2` in the archive.
- **`selectFestivalMode` is now generic** in the edition type, so the archive
  index gets its counts back instead of a bare `Edition`.
- **`sitemap.xml` is still hand-maintained.** `/archiv` and `/archiv/2025` were
  added; `/archiv/2026` deliberately was not, since it is `noindex` while
  featured. This goes stale every year — see the checklist below, and consider a
  generated sitemap route if it ever gets missed.

### Known staleness, not fixed here

The legal pages (`FestivalPolicy`, `Ticketbedingungen`) hardcode "Grundstock
2026" in their German and English body text. That is legal wording, so it is a
deliberate human edit rather than something to interpolate — but it *will* be
wrong next year. It belongs in the new-year checklist.

## Phase 3 — Cleanup

**Step 13.** *(S)* `migrations/drop-day.ts` unsets the old `day` field in Sanity
and removes it from the schema. This is now the *only* thing left in this phase —
the frontend cleanup happened in Phase 1 — and it is safe as soon as the Phase 1
frontend is deployed, since nothing reads `day` any more. Update `CLAUDE.md` and
`docs/PLAN.md` (whose §"Singleton siteSettings" still describes
`festivalStart`/`festivalEnd`) to the edition model.

## Phase 4 — Prove it

**Step 14.** *(S)* Create a 2027 draft in the CMS and walk it: countdown
restarts, 2026 moves out of the main pages and into `/archiv`, `/artists/<slug>`
redirects into `/archiv/2026/artists/<slug>`. This is the first time the redirect
branch and the archive-listing transition run for real.

Then write `docs/NEW-YEAR.md` — the checklist for opening an edition:

1. Create and publish the `festivalEdition` document (year, from, to, days).
2. Add stages, then artists and workshops inside that year's folder.
3. Update the five logistics values in `src/lib/site.ts` (ticket URL, helper-tool
   URL, Mittelgschaftler mail, shuttle times, and re-check `site.genres` against
   the new lineup — it is curated by hand and goes stale immediately).
4. Update the year in the legal pages' body text.
5. Add the previous year to `public/sitemap.xml`.

## Risks worth naming

- **The `to` date is doing two jobs.** It ends the festival *and* triggers the
  farewell. Sunday is teardown and departure, so `to` should be Sunday noon, not
  Saturday night — otherwise the site declares the festival over while people
  are still on the field. Keep the timetable's own 06:00 night-rollover rule
  separate from it; they answer different questions.
- **Hydration.** Phase selection depends on `Date.now()`. At day granularity a
  server/client mismatch is essentially impossible except in the exact minute of
  a transition; follow the existing `useNow` + `suppressHydrationWarning`
  pattern in the components that flip, and never in the SSR'd shell.
- **2025 has no programme data**, only an aftermovie. The archive year page must
  render gracefully with lineup, workshops and timetable all empty — that is the
  common case for every year before 2026, not an edge case.
- **`site.genres`** is curated by hand from the tags actually on artists. It goes
  stale the moment 2027's lineup lands; the new-year checklist has to include it.

---

# After the content refactor

The four items below are a different class of work: they need a **backend, real
user accounts and money handling**, none of which the current stack has — the
site is a static-rendered Worker reading a public read-only CMS.

Before any of it starts, one question has to be settled: `../grundstock-backend`
and `../grundstock-app` already exist in the workspace, alongside
`../common-auth0-config`. Whether tickets and shifts belong *in this repo*, in
that backend, or in a fresh service is the decision that shapes everything
after, and I don't know what those two repos are for yet. Worth an hour of
reading before committing to a shape.

Suggested order, cheapest-and-most-useful first:

1. **Accounts (`user management`).** Everything else depends on identity. Auth0
   is already in the workspace's toolbox. Adds the first authenticated surface to
   the site: `_protected` pathless layout routes with `beforeLoad` guards, per
   the pattern in `CLAUDE.md`. Deliverable on its own: log in, see your profile.
2. **Shift management.** The highest-value replacement — it currently lives in an
   Airtable form (`site.helfertoolUrl`). Needs: shift definitions per edition
   (fits the model built above), sign-up with capacity, and an organiser view.
   Money-free, so no payment provider, no tax questions. Good second step.
3. **Tickets.** The hard one: payment provider, VAT, refunds, QR codes,
   check-in at the gate, GDPR on attendee data. Eventfrog currently absorbs all
   of that. Only worth building if the fee saving genuinely beats the liability —
   worth an explicit go/no-go rather than drifting into it.
4. **Merch shop.** Independent of the rest and can ship any time after accounts;
   inventory + shipping is the real work, not the storefront. Consider a hosted
   store first and revisit.

Each of these deserves its own plan document when it comes up. The point of the
work above is that by then the content side is boring: a new year is a document,
not a deploy.
