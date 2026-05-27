# Buildout Design System

> **Buildout** — *Every estimate. One app.*
> A mobile-first iOS app for small contractors, handymen, and serious DIYers.
> Two sections: **Calculate** (paint, tile, grout, LVP, carpet, stairs, drywall material estimators)
> and **Quote** (fast job quoting with PDF export). Free with ads; one-time $2.99 IAP
> removes ads and unlocks PDF export.

This folder is the canonical design reference for the brand. Everything here was
derived from the production codebase — `theme.ts`, `styles.ts`, and the screen +
component files in `tville123/buildout`. It is intended to be the source of truth
when designing **anywhere outside the React Native app**: App Store assets,
landing pages, slides, ads, onboarding flows, and any future product surfaces.

**Source repositories**
- App codebase: <https://github.com/tville123/buildout> — Expo / React Native / TypeScript
- The repo's `CLAUDE.md` is the canonical product+design spec; this design system is the *visual* extract.

If you can explore that repo directly, please do — `theme.ts`, `styles.ts`, and the
component files in `components/` are the unambiguous answer for any token question.

---

## Brand snapshot

| | |
| --- | --- |
| Name | Buildout |
| Tagline | Every estimate. One app. |
| Audience | Contractors, handymen, serious DIYers |
| Feel | Hardware-store professional. Dark, precise, tool-like. Not playful, not corporate. |
| Anti-feel | No gradients. No decorative illustration. No friendly chatter. |
| Platforms | iOS first (React Native / Expo). No web app yet. |

---

## Index

Top-level files in this folder:

| File | Purpose |
| --- | --- |
| `README.md` | This document — brand, content, visuals, iconography |
| `SKILL.md` | Agent-skill entry point — read this first if you're an agent |
| `colors_and_type.css` | All design tokens as CSS variables + base type rules |
| `assets/` | Logos, app icon, brand marks |
| `fonts/` | Font notes (web uses Google Fonts; see `fonts/README.md`) |
| `preview/` | Cards that populate the Design System tab (one HTML per card) |
| `ui_kits/mobile-app/` | High-fidelity React recreation of the iOS app |

---

## CONTENT FUNDAMENTALS

**Voice.** Hardware-store clerk who actually built things, not a marketing
intern. Short, declarative, factual. Talks *to* the contractor as a peer, not
*at* them. Never apologetic, never hyped.

**Person.** Second-person, imperative when giving instructions. "Enter your
room dimensions." "Add another wall." "Always grab 10% extra." "We" is
avoided — Buildout doesn't present itself as a team or a service, it's a tool.

**Casing.**
- **Display copy** (screen titles, result-card tags): mostly **UPPERCASE with
  wide tracking** when small (≤ 10px, e.g. "PAINT CALCULATOR", "TOTAL PAINT
  NEEDED"), or **Bebas Neue Title Case** when large (e.g. the word
  "Paint." as a screen H1, always with a yellow period).
- **Section labels:** numbered, em-dashed, tracked uppercase — `01 — MODE`,
  `02 — ROOM DIMENSIONS`, `03 — SUBTRACT OPENINGS`. The number prefix is part
  of the voice; it makes every screen feel like a step-by-step plan.
- **Body / labels:** sentence case. "Add another wall." "Paint ceiling too."
- **Buttons / chips:** sentence case. "Add Another Wall" is acceptable but
  sentence-case is preferred.

**Tone characteristics.**
- Confident and specific. "10% waste for cuts and breakage" — not "a little
  extra just in case."
- Numbers do the heavy lifting; copy gets out of the way.
- Honest about constraints. "A quart is perfect for small walls or accent
  coverage." (The app will recommend a quart when that's actually right.)
- Zero hedging language. No "maybe", "perhaps", "we think you'll like".

**Pro tips** are the brand's one allowed editorial moment. Each calculator
result is followed by a single line of practical advice prefixed `Pro tip:` in
yellow. They're written like a tradesperson would explain it on a job site:

> Pro tip: Always grab 10% extra for touch-ups.
> A quart is perfect for small walls or accent coverage.

> Pro tip: Always buy 10% extra — tile dye lots vary between batches and
> replacements may not match.

> Pro tip: Hang sheets perpendicular to studs and stagger seams. Butt joints
> (short edges) are harder to finish — minimize them.

**Empty-state copy** is one short sentence telling the user the next concrete
action. "Enter your room dimensions to get started." "Add walls above and
enter their dimensions."

**No-result icons** in empty states use a single emoji (🪣 🗂 🧱) at low
opacity — *the only place emoji are sanctioned in product*. They function as
typographic spacers, not as decoration; remove them and the brand is fine.

**Marketing copy** (App Store description) follows the same rules: a single
sentence promise, then a hard-list of features with hyphens. No exclamation
marks. No "love" or "delight". Example from the store listing:

> Buildout takes the guesswork out of home renovation.
> Enter your room dimensions and get exact material estimates — broken down
> into ready-to-shop lists with waste already factored in.

**Words to avoid:** *seamless, beautiful, magical, effortless, journey,
crafted, curated, delighted, loved*. Words to favor: *exact, with waste,
sq ft, sq yards, bag, sheet, gallon, quart, coat, roll, lb, ready-to-shop*.

---

## VISUAL FOUNDATIONS

### Color

A locked five-token palette plus one destructive red. Every screen, every
component, every state is composed from these — no exceptions.

| Token | Hex | Use |
| --- | --- | --- |
| `--bo-bg` | `#0f0f0f` | App background, screen header background |
| `--bo-surface` | `#1a1a1a` | Cards, inputs, segmented control track |
| `--bo-border` | `#2e2e2e` | 1px borders, dividers, dashed empty-state outline |
| `--bo-text` | `#f0ede8` | Primary text — warm off-white, never pure white |
| `--bo-text-mid` | `#888` | Secondary text, inactive segment label |
| `--bo-text-dim` | `#555` | Placeholders, unit labels, summary metadata |
| `--bo-yellow` | `#f5c842` | Accent — result card, focus border, active state, section labels |
| `--bo-red` | `#e05c3a` | Destructive (delete wall, paywall caution) only |

**Yellow washes** for active / hover affordances:
- `rgba(245,200,66,0.08)` — active chip fill
- `rgba(245,200,66,0.06)` — alt active fill
- `rgba(245,200,66,0.05)` — pro-tip bar background
- `rgba(245,200,66,0.12)` — pro-tip bar border

**The yellow rule.** Yellow is the hero. A screen has exactly one yellow
**result card** as its visual climax. Everywhere else yellow is reserved for
**state signal** (focus, active, section label, accent punctuation like the
"." on titles). If the design has yellow in more than two roles per screen,
something is wrong.

**Text on yellow** is `#000` (with a 0.45 alpha for sub-labels and 0.12 alpha
for dividers on the yellow card). The yellow card is the only inversion in the
system — everywhere else fg is `#f0ede8` on `#0f0f0f`.

### Type

Three families, no substitutions:

| Family | Use | Notes |
| --- | --- | --- |
| **Bebas Neue** | Display (52px screen H1), big result numbers (67px), shopping-list quantities (24px) | Always tracked +0.04em or wider |
| **IBM Plex Sans** | Body, labels, buttons, chips | Weights 300 / 400 / 500 only |
| **IBM Plex Mono** | All numeric inputs and unit labels | Weights 400 / 500 |

The mono ↔ sans split is **strict**: anything the user types a number into is
Mono; everything else is Sans. The Bebas display number on the yellow card is
*shown*, not typed — Bebas is reserved for output, Mono for input.

### Spacing

- Screen gutter: **24px** horizontal.
- Vertical rhythm: **22px** between sections, **10px** between intra-section
  rows.
- Card padding: **22px** (result card), **16px** (shopping card),
  **14px** (wall card), **12px** (input block), **11px** (toggle chip / tip bar).
- All on an **8 px grid** with half-steps (4, 12, 22) where mobile density
  demands it.

### Corner radii

| Radius | Use |
| --- | --- |
| 16 px | Result card (the hero) |
| 14 px | Shopping-list card, empty-state card |
| 12 px | Wall card, wall summary card |
| 10 px | Inputs, segmented control track, tip bar |
| 8 px | Toggle chip, chip checkbox `4` |
| 20 px | Opening pills (pill / chip shape) |

Radii **never** get larger than 20 px. No fully rounded pills except the small
opening-pills. No squircle / continuous radius — flat CSS radii only.

### Borders & strokes

- All borders are **1 px solid `#2e2e2e`** by default.
- Focus / active swaps the same border to **1 px solid `#f5c842`**.
- The "Add Another Wall" button uses a **1 px dashed `#2e2e2e`** border — the
  only dashed line in the system, signalling "this slot is waiting for input".
- The wall-card field inputs use a **bottom-only** 1 px border so they read as
  inline fields inside a larger card.

### Shadows

**None.** The system uses border + background contrast and never relies on
shadow. Cards float by virtue of darker background; the yellow result card
"pops" because of color, not elevation. If you find yourself adding a
`box-shadow`, you are off-brand.

### Backgrounds, imagery & decoration

- No gradients, anywhere. Solid fills only.
- No decorative illustration, no photography. The product is not an emotional
  experience; it's a tool.
- No background patterns, no textures, no grain.
- The only non-rectangular element in the entire UI is the chip checkbox
  checkmark (`✓`).

### Layout rules

- Mobile-first, **max-width 430 px** (matches the iPhone 16 Pro Max content
  width). On wider viewports the content stays at 430 and centers; the
  surrounding area stays `#0f0f0f`.
- Fixed elements: the **top bar** (52 px including status-bar offset) and the
  **bottom tab bar**. Both are `#0f0f0f` with a 1 px `#2e2e2e` divider; nothing
  else is fixed.
- Status bar: `light-content` on `#0f0f0f`.

### Top of screen — the compact bar

The top of every screen is a **52 px bar**, not a Bebas display title. This is
a deliberate space-saving move: the result card is the hero, and a giant
header pushes it below the fold. The bar is composed of:

- **Left:** the screen identifier as a tracked yellow tag (same treatment as
  section labels: 10px, 0.28em tracking, weight 500). Sub-screens prepend a
  16 px outline back-chevron at `--text-mid`.
- **Right:** a freeform utility cluster — 32 × 32 hit targets, 19 px outline
  icons in `--text-mid` (hover/active → `--text`). Order from inside-out:
  `share/export → settings → ⋯` on main screens; `⋯` alone on sub-screens.
  A 9px **"UPGRADE"** pill in yellow can sit at the start of the cluster
  while ads are present; it disappears once the IAP is unlocked.

There is **no subtitle, no breadcrumb, no large title anywhere**. If a screen
needs more identity than the tag provides, that's a sign it should be a
separate calculator, not a longer header.

### Animation

- Tap feedback uses React Native's `activeOpacity={0.7}` or `0.8` — **subtle
  opacity dip, not a scale or color shift**. That's the entire motion system.
- No spring animations, no bounces, no shimmer skeletons.
- Focus transitions are instant (border color swap; no animated transition).
- The empty-state → result transition is render-on-condition (no fade).
- Tab swipes use the navigator default.

If a screen requires more motion than this — e.g. the future PDF-export
success state — keep it as a single, instant transform with no easing
flourish.

### Hover / press states

- **Press:** `activeOpacity={0.7}` (touchables) or `0.8` (segmented control,
  chips). No darken/lighten of the fill.
- **Focus (inputs):** border `#2e2e2e` → `#f5c842`. No glow, no inner shadow.
- **Active (toggle chip):** border yellow, fill `rgba(245,200,66,0.06)`,
  checkbox fills yellow, label color shifts `--text-mid` → `--text`.
- **Active (segmented control):** background `#f5c842`, label `#000`,
  weight 400 → 500.
- **No hover states** are designed — this is a touch app. On web mocks, treat
  hover ≡ inactive (i.e. omit hover styling entirely).

### Transparency & blur

- The only place alpha appears is **on the yellow surface** (`rgba(0,0,0,0.45)`
  for sub-labels, `rgba(0,0,0,0.12)` for the divider) and in the four yellow
  washes listed above. No blur filters, no glass, no backdrop-filter.
- The yellow accent never goes translucent — it's always solid `#f5c842`.

### Cards — the canonical recipe

A Buildout card is `background: #1a1a1a; border: 1px solid #2e2e2e;
border-radius: 12-16px; padding: 14-22px;`. **No shadow, no gradient, no inner
border.** The yellow result card is the same recipe with `background: #f5c842`
and no border.

### Imagery color treatment

If product photography ever needs to be introduced (App Store hero, marketing
site), the brief is: **warm-toned wood / drywall / paint imagery, naturally
lit, no people, no lifestyle context**. Cool blue tech imagery and lifestyle
shots are off-brand.

---

## ICONOGRAPHY

Buildout uses **Ionicons** (the outlined set) via `@expo/vector-icons` —
that's what ships in the native app's bottom tab bar. The outline style
matches the system's wireframe, drafting-tool aesthetic.

**App-side icons currently in use** (from `App.tsx`):

| Tab | Ionicon name |
| --- | --- |
| Paint | `brush-outline` |
| Tile | `grid-outline` |
| Grout | `apps-outline` |
| LVP | `layers-outline` |
| Carpet | `albums-outline` |
| Stairs | `trending-up` |
| Drywall | `hammer-outline` |

**Rules.**
- Stroke style: **outline only**, never filled (filled icons read as toggled
  state in iOS and we don't use icon-toggles).
- Stroke weight: Ionicons default (~1.5 px equivalent at 24 px size).
- Sizes: **24 px** in tab bars; **17 px** for chip checkmarks (the only inline
  icon in product); **20 px** in row affordances if/when added.
- Color: `--bo-text-dim` `#555` inactive, `--bo-yellow` `#f5c842` active.

**Web / mock substitution.** For HTML mocks, use **Lucide** (<https://lucide.dev>)
— the outline style and stroke weight match Ionicons-outline closely. CDN:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

Approximate mapping for the tab set: `brush` (Paint), `grid-3x3` (Tile),
`grip` (Grout), `layers` (LVP), `square-stack` (Carpet), `trending-up`
(Stairs), `hammer` (Drywall). **This is a substitution — flag it to engineering
if you're handing off, so they know production uses Ionicons not Lucide.**

**Emoji.** Used as low-opacity (0.3) placeholder glyphs in calculator
**empty states only**: 🪣 (Paint), 🗂 (Tile), 🧱 (Drywall). These are
decorative spacers and the design works without them. **Do not** use emoji in
labels, buttons, headings, marketing, or App Store metadata.

**Unicode glyphs in product:**
- `✓` — chip checkbox checkmark
- `+` — "Add Another Wall" button label
- `−` (proper minus) — opening deductions in wall summary, e.g. `(−20 sqft)`
- `×` — multiplications in pro-tip math notation, e.g. `12 × 10`

**Custom marks / logos.** See `assets/`:
- `logo-wordmark.svg` — horizontal lockup (`BUILDOUT.` with a yellow period)
- `logo-mark.svg` — square monogram for favicons / small avatars
- `icon.png` — 1024×1024 iOS App Store icon (dark bg, BUILD/OUT stacked, ruler
  tick mark in yellow on the left)

There is no separate brand illustration system. The ruler-tick motif on the
icon is the closest thing to an illustration — and even that is constructed
out of rectangles.

---

## UI Kits

| Product | Folder | Status |
| --- | --- | --- |
| iOS Mobile App | `ui_kits/mobile-app/` | Paint + Tile + Drywall screens, full bottom-tab navigation, interactive click-thru |

The mobile-app kit recreates the production RN screens in React (web), using
the exact tokens and styles from `theme.ts`/`styles.ts`. Each screen is a JSX
component. `ui_kits/mobile-app/index.html` is a click-through prototype shown
inside an iOS device frame.

---

## Disclaimers & open questions

- **Font files** are not vendored — `colors_and_type.css` uses the Google
  Fonts CDN for Bebas Neue, IBM Plex Sans, IBM Plex Mono. See `fonts/README.md`
  for the local-file path if you need an offline build.
- **Quote module** is specified in `CLAUDE.md` but not yet built in the app;
  this design system covers only the Calculate side. Quote-screen mocks will
  be added once the engineering work lands.
- **Web icon substitution:** product uses Ionicons; mocks here use Lucide.
  Visually equivalent but worth flagging on handoff.
- **Photography / illustration:** the brand has none. If marketing introduces
  imagery later, refer to the Imagery section above and treat it as a brand
  decision that must update this doc.

For deep questions, the repo (`tville123/buildout`) is always the tiebreaker.
