# Design refresh — from "generated" to art-directed

Goal: make grundstock-festival.de read as *designed by someone* — serious, individual, artsy —
without abandoning the night-jungle direction in [PLAN.md](PLAN.md) §3.

---

## 1. Why it currently reads AI-generated

These are not vibes, they're specific patterns in the code. Each one is independently a
well-known tell; together they're conclusive.

| # | Tell | Where |
|---|---|---|
| 1 | **Marker/handwriting display face** used for *every* prominent level — hero, kickers, h2, card titles, artist names, marquee | `styles.css:46` (Shantell Sans) + ~8 components |
| 2 | **Two overlapping coloured radial "glow blobs"** centred behind the content | `Hero.tsx:13`, again on `body` in `styles.css:134-136` |
| 3 | **Neon glow on everything** — `text-shadow:0 0 48px` on the h1, `shadow-[0_0_32px]` on the CTA | `Hero.tsx:20`, `Hero.tsx:38` |
| 4 | **✦ sparkle characters** as decoration | `GenreMarquee.tsx`, `ArtistCard.tsx` (image placeholder) |
| 5 | **Wavy SVG "hill" divider** under the hero | `Hero.tsx:51-66` |
| 6 | **36 floating + blinking particles** | `NightBackground.tsx` |
| 7 | **Zero layout variation** — all 12 sections are `page-wrap` → `py-16` → kicker → h2 → grid of `rounded-xl` cards | `Section.tsx`, `HomePage.tsx` |
| 8 | **Pill CTAs + soft cards** — `rounded-full`, `--radius: .75rem` | `Hero.tsx:38`, `styles.css:41` |
| 9 | **Everything centred, one 1080px column**, no asymmetry, no overlap, no bleed | `styles.css:189` |
| 10 | **Brand competes with itself** — the hero shows the `LogoMark` *and* the word "Grundstock" as an h1 in a different font, directly beneath it | `Hero.tsx:16-24` |

The through-line: the site is built entirely from *effects* (glow, blur, gradient, particles)
and not at all from *decisions* (typography, hierarchy, rhythm, real artwork). Effects are
cheap and every generator reaches for the same ones. Decisions are what read as authored.

---

## 2. Typography — the single biggest lever

Shantell Sans is a marker face. It cannot be made serious. It has to go.

Three coherent directions, each self-hosted via Fontsource (the no-cookie-banner constraint in
PLAN.md §1.3 rules out Google's CDN). All verified available.

### A — "Art-house poster": **Instrument Serif** *(recommended)*

```
@fontsource/instrument-serif   5.3.0   (static, 1 weight + italic — tiny)
```

High-contrast editorial serif. `GRUNDSTOCK` in caps with open tracking reads like a gallery
invitation or an A24 title card. Pairs *natively* with **Instrument Sans**, which is already
installed — a real superfamily pairing is the cheapest way to look art-directed rather than
assembled.

- **Net effect on deps:** drops Shantell **and** Fraunces → fewer font files than today.
- **Tone:** serious, romantic, nocturnal. Sits well with the watercolour-fern flyer.
- **Risk:** leans formal; needs the rest of the page to stay rugged so it doesn't read wedding-invite.

### B — "Gig poster": **Big Shoulders Display**

```
@fontsource-variable/big-shoulders-display   5.3.0   (variable weight, condensed)
```

Tall condensed caps — silkscreened band poster. `GRUNDSTOCK` becomes a monument. Reads
"music festival" instantly and carries the DIY / *von Freund:innen für Freund:innen* spirit.

- Keep Instrument Sans for body; drop Shantell + Fraunces.
- **Tone:** loud, rugged, confident.
- **Risk:** the most opinionated. Great at 8xl, needs care below ~24px.

### C — "Design studio": **Bricolage Grotesque**

```
@fontsource-variable/bricolage-grotesque   5.3.0   (weight + width + optical-size axes)
```

Contemporary grotesque with deliberate quirks — individual without being cute. Wide enough
range to serve display *and* body, so the whole site could run on one family.

- **Tone:** modern, understated, art-directed.
- **Risk:** least "festival"; reads more studio-portfolio than event.

### Wildcards

- **Syne** (`@fontsource-variable/syne`) — built for an art centre. Wide, strange, unmistakable. Maximum individuality, polarising.
- **Archivo** (`@fontsource-variable/archivo`, has a width axis) — the safe Swiss workhorse if A–C all feel too characterful.

### Recommendation

**A (Instrument Serif) for the wordmark and headings + Instrument Sans for everything else.**
It's the largest tonal jump from where we are, it costs *negative* dependencies, and
high-contrast serif caps over near-black with one amber accent is precisely "serious + artsy".

If the festival should feel louder than it feels elegant, take **B** instead.

> A hybrid also works and is very distinctive — **Instrument Serif** for headlines,
> **Big Shoulders** for the wordmark and lineup names. Three families, so only worth it if
> the wordmark deserves its own voice.

### Use display *sparingly*

Independent of which face wins: today `font-display` is applied to the hero, every kicker,
every h2, every card title, artist names and the marquee. Using one display face at every
level destroys hierarchy and is itself part of the generated look.

New rule: **display = wordmark + section h2 only.** Kickers, card titles, artist names and the
marquee move to Instrument Sans, uppercase, tracked, small. That contrast — a big expressive
heading over quiet technical sans — *is* the editorial look.

---

## 3. The wordmark

- `GRUNDSTOCK` **uppercase**, as requested. Remove the `<wbr />` hack.
- Remove `[text-shadow:0_0_48px_...]`. Presence comes from scale and tracking, never glow.
- **Resolve the logo/text redundancy** (tell #10). Two options:
  - **(a)** The typographic `GRUNDSTOCK` *is* the hero; `LogoMark` retreats to the header and footer only. Recommended if we pick a strong display face.
  - **(b)** Keep the eye-mark above as a lockup, but set `GRUNDSTOCK` smaller and widely tracked beneath it, so it reads as one unit instead of two competing wordmarks.
- Tracking is worth testing both ways: large caps normally want *negative* tracking, but a
  wordmark set with *positive* tracking (`0.06em`–`0.12em`) reads monumental and institutional.

---

## 4. Colour & background

### Darker, and much less saturated

The current palette isn't only too light — it's too *purple*. Saturated violet plus neon amber
plus cyan is the generator house style. Serious means near-black and **one** accent.

```css
/* now → proposed */
--night:      #120826  →  #0a0711   /* near-black, faint violet cast */
--night-soft: #1e1035  →  #121019
--night-mist: #2b1653  →  #1b1723
--moon-dim:   #b8a8d8  →  #a99fb5   /* desaturate to match */
```

- **Drop `--neon` (`#7dd3fc`) and the violet blob entirely.** One accent that always means
  "act here" is a stated goal in PLAN.md §3 — the site currently doesn't honour it.
- Keep amber as the sole accent. Optionally cool it slightly (`#ffb524` → `#eda63a`) so it
  reads ember rather than neon.

### Gradient: directional, not blobs

Delete both centred radial pairs (`Hero.tsx:13`, `styles.css:134-136`). Replace with a single
**vertical** gradient with a *slight* delta — think horizon, not spotlight:

```css
body {
  background-color: var(--night);
  background-image: linear-gradient(180deg,
    color-mix(in oklab, var(--night-soft) 60%, var(--night)) 0%,
    var(--night) 45%);
  background-attachment: fixed;
}
```

Rule of thumb: the top-to-bottom lightness delta should be ~3–6%, not the ~40% we have now.
A gradient you *notice* is a gradient that looks generated.

---

## 5. Radius

`--radius: 0.75rem` → **`0.25rem`**, plus square the hero CTAs (`rounded-full` → `rounded-none`).
Squared buttons on a festival site read like a ticket stub or a printed poster.

⚠️ **Don't go below `0.25rem` by lowering `--radius`.** The scale in `styles.css:77-80` is
`calc(var(--radius) - 4px)` for `--radius-sm`; at `0.125rem` that computes to `-2px`, which is
invalid CSS. For fully sharp corners, redefine the four steps explicitly instead:

```css
--radius-sm: 0px;
--radius-md: 1px;
--radius-lg: 2px;
--radius-xl: 4px;
```

Cards: sharp corners + a hairline border reads architectural. Combine with §7's hairline rules.

---

## 6. Kill the tells

Concrete, mechanical, no design judgement needed:

- **`Hero.tsx`** — delete the wavy SVG divider (51-66); delete the radial blob layer (11-14);
  delete the amber `shadow-[0_0_32px]` on the ticket CTA; delete the h1 `text-shadow`.
- **`GenreMarquee.tsx`** — `✦` → a thin `·`, an em-dash, or a small fern-frond SVG from the
  flyer. Drop `font-display`; set the genres in uppercase tracked sans so the strip reads like
  a ticker, not decoration.
- **`ArtistCard.tsx`** — `✦` placeholder → the artist's initials in the display face, or a
  duotoned fern texture. `rounded-xl` → `rounded-xs`. Replace the generic
  `opacity-80 → 100` hover with a grayscale→colour transition or a border reveal.
- **`NightBackground.tsx`** — 36 blinking particles is a particle field. Either cut to 8–12,
  much slower and dimmer, or replace outright with §7's grain + fern silhouettes.
  *Particles are the AI look; grain is the artsy look.*
- **Scroll cue** (`Hero.tsx:68-74`) — the bouncing `↓` is generated-landing-page furniture.
  A thin static vertical rule, or nothing.

---

## 7. Texture — where individuality actually comes from

No token change substitutes for real artwork. This section is what makes the site *ours*.

1. **Film grain / noise overlay.** A tiling noise PNG or inline SVG `feTurbulence` at 3–5%
   opacity, `mix-blend-mode: overlay`, fixed over the whole page. Single highest-leverage
   change for "printed poster, not generated webpage" — and it's ~10 lines.
2. **The flyer's watercolour ferns as real assets.** PLAN.md §3 already calls for exporting the
   Figma set; it hasn't happened. One hand-made watercolour element outperforms every CSS
   gradient we could write. Use them as large, low-opacity, *cropped* section anchors — bleeding
   off the edge, not centred and complete.
3. **Hairline rules instead of card borders**, in at least a couple of places. 1px `--border`
   rules separating content reads editorial; boxes-in-a-grid reads template.
4. **Duotone the photography.** Every artist/recap photo mapped to near-black → amber.
   Consistent photo treatment is the clearest signal of art direction there is.

---

## 8. Layout rhythm — the biggest structural win

Twelve sections currently render through one identical component. That uniformity is the
template feel, and no amount of colour work fixes it.

- **Alternate contained vs. full-bleed.** Marquee and the tickets CTA go edge-to-edge;
  everything else stays in the column.
- **One inversion.** Give the *Mithelfen* section — which PLAN.md §4.7 says "carries the
  identity" — a full-bleed inverted panel: warm paper/amber background, near-black text. A
  single inversion is worth more than ten gradients.
- **Asymmetric split** for Story/Verein: a 5/7 grid with the heading sticky in the narrow
  column while the body scrolls past.
- **Number the sections** (`01`, `02`, `03`…) in tracked mono or sans. Cheap, and unmistakably
  an editorial decision.
- **Vary the vertical rhythm.** Not everything is `py-16`. Let the manifesto breathe at `py-32`;
  keep the marquee tight at `py-6`. Uniform spacing is uniform thinking.

---

## 9. Micro-typography

- `text-wrap: pretty` on body paragraphs (`balance` is already on some headings).
- Negative tracking (`-0.02em`) on large headings; positive on small caps labels.
- `tabular-nums` on the countdown so digits don't shift — verify `Countdown.tsx`.
- Body copy links are amber + underlined globally (`styles.css:204-209`); confirm nav, cards
  and buttons all opt out (they do today via `no-underline`) so the accent stays meaningful.

---

## 10. Accessibility guardrails

- Darkening the background *raises* contrast — safe direction. Re-check `--moon-dim` on the new
  `--night` (target ≥ 4.5:1 for body, ≥ 3:1 for large text).
- Amber on near-black is very high contrast; the inverted Mithelfen panel needs its own check
  (near-black on amber).
- Keep focus rings clearly visible once corners go sharp.
- `prefers-reduced-motion` is handled today (`styles.css:258`) — preserve it when the particle
  layer is replaced. Grain is static, so this gets easier.

---

## 11. Suggested order

| Phase | Scope | Files | Payoff | Status |
|---|---|---|---|---|
| **1** | Tokens: palette, gradient, radius, drop `--neon` | `styles.css` | ~60% of the "serious" win, one file | ✅ done |
| **2** | Font swap + uppercase `GRUNDSTOCK` + display-sparingly rule | `styles.css` + ~20 components | The identity change | ✅ done |
| **3** | Kill the tells (§6) | `Hero.tsx`, `GenreMarquee.tsx`, `ArtistCard.tsx`, `NightBackground.tsx`, `TicketsCta.tsx` | Removes the generated fingerprint | ✅ done |
| **4** | Grain overlay (§7.1) | `styles.css` | Highest texture-per-line | ✅ done |
| **5** | Layout rhythm (§8) | `Section.tsx` + home feature components | Structural individuality | open |
| **6** | Real artwork: ferns, duotone photos (§7.2–7.4) | assets + components | Finishes it | blocked on assets |

Phases 1–4 shipped together across 34 files. Phase 5 is taste-dependent and worth reviewing
against the new baseline first; phase 6 depends on the Figma / flyer export that PLAN.md §3
already calls for.

### Notes from the implementation

- **Instrument Serif ships weight 400 only.** Every `font-display font-bold` in the codebase
  would have triggered synthetic (faux) bolding, which looks visibly smeared. All weight
  utilities were stripped from display/serif text; keep them off when adding new headings.
- **`tabular-nums` does nothing in Instrument Serif** — it has no tabular-figure feature. The
  countdown digits therefore stay in Instrument Sans, or the seconds column shifts on every tick.
- `--neon` (`#7dd3fc`) was defined but never consumed by a component; removed with no callers.
- `twinkle`, `float` and `bounce-soft` keyframes were all dead once the scroll cue went; removed.
- Font payload dropped **352 KB → 80 KB** (10 files → 3): Instrument Serif's single static
  weight replaces two variable families.
