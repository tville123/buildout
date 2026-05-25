# Buildout — Home Renovation Calculator App

**Last Updated:** 2026-05-25
**Active Branch:** main

## Project Overview

A mobile-first app for small contractors and DIYers built in React Native / Expo (TypeScript), targeting the iOS App Store. Buildout has two core sections: **Calculate** (material estimators for paint, tile, flooring, drywall, and more) and **Quote** (fast job quoting with PDF export). Free with ads; paid upgrade removes ads and unlocks PDF export. Previously named COAT (Paint Calculator); rebranded as Buildout with Paint as the first calculator screen.

---

## Current Status

### Completed ✓

- Paint Calculator fully built (Full Room + Manual Walls modes)
- All 7 V1 calculators built: Paint, Tile, Grout, LVP, Carpet, Stairs, Drywall
- Bottom tab navigation: 7 flat tabs (Paint, Tile, Grout, LVP, Carpet, Stairs, Drywall), Ionicons, yellow active tint
- App rebranded to Buildout (`name`, `slug`, bundle ID all updated)
- Shared components extracted: `ResultCard`, `ShoppingList`, `SegControl`, `InputBlock`, `SectionLabel`, `ToggleChip`, `WallCard`
- Calculator math in `utils/calculator.ts` for Tile, Grout, LVP, Carpet, Stairs, Drywall; Paint math is inline in `PaintScreen.tsx`
- Monetization stubs in place: `ads/AdBanner.tsx` (renders null), `context/PaidContext.tsx` (always returns false)
- TypeScript interfaces in `types.ts`: `Wall`, `ShoppingListBuy`, `PaintResult`
- EAS build config in `eas.json` (development / preview / production profiles)

### Blocking ⚠️

- [ ] Quote module not started — nav refactor + all Quote screens/components/utils needed (see roadmap)
- [ ] Navigation refactor: current flat 7-tab bar → two-section layout (Calculate top-tabs | Quote stack)
- [ ] Wire up AdMob (`react-native-google-mobile-ads`) and replace AdBanner stub
- [ ] Wire up IAP (`expo-in-app-purchases` or RevenueCat) and replace PaidContext stub
- [ ] Apple Developer Account pending ($99/yr) — [developer.apple.com](https://developer.apple.com)
- [ ] App icon needs to be 1024×1024 PNG before App Store submission
- [ ] Test on real device via TestFlight before submission
- [ ] Privacy policy URL (hosted page, required by App Store)

### Next Immediate Tasks

1. Run on iOS Simulator: `npx expo start --ios`
2. Smoke test all 7 calculator tools
3. Prepare 1024×1024 app icon asset
4. Begin Quote module — restructure nav into Calculate / Quote two-section layout (see Navigation Structure below)
5. Create App Store Connect record once Apple Developer Account is active

---

## Monetization Model

- **Free tier:** All calculators available with banner ads between results; quote builder available but PDF export locked
- **Paid upgrade:** One-time in-app purchase (~$2.99) removes all ads AND unlocks PDF export
- **PDF export as conversion hook:** Free users can build a quote but see an upgrade prompt when tapping Export — this is the natural paid conversion moment
- **Ad implementation:** TBD — likely Google AdMob via `react-native-google-mobile-ads`
- **IAP implementation:** Expo In-App Purchases (`expo-in-app-purchases`) or RevenueCat

---

## Tool Roadmap

### V1 — Initial Submission (build all before submitting)

**Calculate Section**

| # | Tool                 | Status  | Nav Label |
|---|----------------------|---------|-----------|
| 1 | Paint Calculator     | ✓ Built | Paint     |
| 2 | Tile Calculator      | ✓ Built | Tile      |
| 3 | Grout Calculator     | ✓ Built | Grout     |
| 4 | LVP Calculator       | ✓ Built | LVP       |
| 5 | Carpet Calculator    | ✓ Built | Carpet    |
| 6 | Staircase Calculator | ✓ Built | Stairs    |
| 7 | Drywall Calculator   | ✓ Built | Drywall   |

**Quote Section**

| # | Feature                 | Status          | Notes                                         |
|---|-------------------------|-----------------|-----------------------------------------------|
| 1 | New Quote builder       | 🔲 Not started  | Client name, job description, line items      |
| 2 | Line item entry         | 🔲 Not started  | Description, quantity, unit price, auto-total |
| 3 | Tax + total calculation | 🔲 Not started  | Optional tax rate input                       |
| 4 | PDF export              | 🔲 Not started  | Paid feature — `expo-print` HTML-to-PDF       |
| 5 | Quote history           | 🔲 Not started  | Saved quotes list, tap to reopen or duplicate |

### V1.1 — Post-Launch Updates

- Wallpaper Calculator — rolls + pattern repeat logic
- Underlayment Calculator — pairs with LVP and carpet screens
- Deep link from calculator results → Quote builder (e.g. "Add to Quote" button pre-fills a line item)

### Future (separate apps)

- Electrical, plumbing, structural tools → separate niche apps under same developer account
- Keep Buildout focused on surface/flooring/finish work, hard cap at 8 calculator tools

---

## Calculator Math

### Paint Calculator

```
Wall area (full room) = 2 × (length + width) × height
Wall area (manual)    = sum of (width × height) per wall, minus opening deductions
Ceiling area          = length × width (optional)
Gallons needed        = (area × coats) / coverageRate
Coverage rates        = smooth: 400, semi-rough: 350, textured: 300 sq ft/gal
Shopping list         = floor(gallons) gal + ceil(remainder × 4) qt
Door deduction        = 20 sq ft  (or custom width × height if specified)
Window deduction      = 15 sq ft each  (or custom width × height if specified)
```

### Tile Calculator

```
Room area      = length × width (sq ft)
Tile area      = (tile width × tile height) / 144  (sq ft per tile)
Tiles needed   = ceil(room area / tile area)
With waste     = ceil(tiles needed × 1.10)  — always add 10% for cuts/breakage
Boxes needed   = ceil(tiles with waste / tiles per box)
```

### LVP (Luxury Vinyl Plank) Calculator

```
Room area      = length × width (sq ft)
With waste     = room area × 1.10  — 10% waste for cuts and layout
Boxes needed   = ceil(area with waste / sq ft per box)
Cost estimate  = boxes needed × price per box (optional)
```

### Carpet Calculator

```
Room area      = length × width (sq ft → convert to sq yards: ÷ 9)
With waste     = sq yards × 1.10
Cost estimate  = sq yards × price per sq yard (optional)
Note: carpet sold in sq yards; always present both sq ft and sq yards
```

### Staircase Calculator

```
Tread area     = (tread depth in / 12) × (stair width in / 12) × number of stairs
Riser area     = (riser height in / 12) × (stair width in / 12) × number of stairs  (if carpeting risers)
Total area     = tread area + riser area (if applicable)
With waste     = total area × 1.15  — stairs have more cuts, use 15%
```

### Grout Calculator

```
Grout factor   = ((tile_w + tile_h) / (tile_w × tile_h)) × joint_width × 18
Lbs needed     = ceil(room_area × grout_factor × 1.10)
Bags needed    = ceil(lbs needed / bag_weight)  — default 25 lb bags
Note: k=18 derived so 12×12 tile + 1/8" joint → ~0.375 lbs/sq ft (~1.5 bags/100 sq ft)
```

### Drywall Calculator

```
Wall area      = 2×(L+W)×H − (doors × 20) − (windows × 15)  sq ft
Sheet area     = 32 sq ft (standard 4×8)
Sheets needed  = ceil(wall area × 1.10 / 32)
Joint compound = ceil(wall area / 500) buckets
Tape           = ceil(wall area / 500) rolls
Screws         = ceil(wall area / 500) lbs
```

---

## Navigation Structure

### Current State (implemented in App.tsx)

7 flat bottom tabs — one per calculator tool.

```
App.tsx (root)
└── Bottom Tab Navigator (7 tabs)
    ├── Paint      (PaintScreen.tsx)
    ├── Tile       (TileScreen.tsx)
    ├── Grout      (GroutScreen.tsx)
    ├── LVP        (LVPScreen.tsx)
    ├── Carpet     (CarpetScreen.tsx)
    ├── Stairs     (StairsScreen.tsx)
    └── Drywall    (DrywallScreen.tsx)
```

### Target State (planned — not yet implemented)

Two-section bottom tab: Calculate (horizontal top tabs for tools) + Quote (stack navigator).

```
App.tsx (root)
├── Bottom Tab: Calculate
│   └── Material Top Tabs (scrollable, one tab per tool)
│       ├── Paint      (screens/calculate/PaintScreen.tsx)
│       ├── Tile       (screens/calculate/TileScreen.tsx)
│       ├── Grout      (screens/calculate/GroutScreen.tsx)
│       ├── LVP        (screens/calculate/LVPScreen.tsx)
│       ├── Carpet     (screens/calculate/CarpetScreen.tsx)
│       ├── Stairs     (screens/calculate/StairsScreen.tsx)
│       └── Drywall    (screens/calculate/DrywallScreen.tsx)
└── Bottom Tab: Quote
    └── Stack Navigator
        ├── QuoteHistoryScreen  (default — list of saved quotes)
        └── QuoteScreen         (new quote builder / edit existing)
```

**Key design decisions for the target nav:**

- Bottom tab has exactly 2 items: Calculate and Quote
- Calculator tools scroll horizontally in a top tab bar — do not use a nested bottom tab for each tool
- Quote section uses a stack so users can navigate back from a quote to the history list
- Ads appear in Calculate section only (between results); Quote section is ad-free but PDF export is paywalled
- Implementing this requires installing `@react-navigation/material-top-tabs` and `@react-navigation/stack`, then moving screen files into `screens/calculate/` and `screens/quote/` subdirectories

---

## Quoting Module

> **Status: NOT YET STARTED.** The spec below is the implementation target.

### Data Model

```typescript
interface Quote {
  id: string;            // uuid
  createdAt: number;     // timestamp
  updatedAt: number;     // timestamp
  clientName: string;
  jobDescription: string;
  lineItems: LineItem[];
  taxRate: number;       // percentage, e.g. 8.5
  notes: string;         // optional footer note on PDF
  status: 'draft' | 'sent';
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;     // USD
  total: number;         // quantity × unitPrice (derived)
}
```

### Quote Math

```
Line item total  = quantity × unitPrice
Subtotal         = sum of all line item totals
Tax amount       = subtotal × (taxRate / 100)
Grand total      = subtotal + tax amount
```

### PDF Export

- Built with `expo-print` — renders an HTML template to PDF
- PDF includes: contractor name (from settings), client name, job description, line items table, subtotal, tax, total, date
- Share sheet opens automatically after generation (text, email, AirDrop)
- Paywalled — free users see upgrade prompt when tapping Export

### Storage

- Quotes stored locally with `AsyncStorage` — no backend, no account required
- Key format: `quotes:list` → array of Quote objects

---

## Design Language

All tools share the same design system — do not deviate per screen.

| Token             | Value                |
|-------------------|----------------------|
| Background        | `#0f0f0f`            |
| Surface           | `#1a1a1a`            |
| Border            | `#2e2e2e`            |
| Accent            | `#f5c842` (yellow)   |
| Text              | `#f0ede8`            |
| Text dim          | `#555`               |
| Text mid          | `#888`               |
| Red (destructive) | `#e05c3a`            |
| Max width         | 430px (mobile-first) |

Design tokens are exported from `theme.ts` as the `C` object.

**Fonts**

- `Bebas Neue` — display headings, large result numbers
- `IBM Plex Sans` — body text, labels, buttons
- `IBM Plex Mono` — all numeric inputs and unit labels

**UI Patterns** (consistent across all tools)

- Section labels: uppercase, yellow, ~9.6px, 0.16em letter-spacing — use `<SectionLabel>`
- Segmented controls: yellow active state, dark surface inactive — use `<SegControl>`
- Input blocks: surface background, yellow border on focus — use `<InputBlock>`
- Results card: yellow background, large Bebas Neue number, breakdown grid — use `<ResultCard>`
- Shopping list card: dark surface, yellow quantities in Bebas Neue — use `<ShoppingList>`
- Toggle chips: yellow border + subtle yellow fill when active — use `<ToggleChip>`
- All screen headers follow the same pattern: tag chip → title (Bebas Neue) → subtitle

**Screen UX Pattern** (all 7 calculators follow this exactly)

1. Header — tag chip, title, subtitle
2. Numbered input sections (01, 02, …) with `<SectionLabel>` headings
3. `<ResultCard>` + `<ShoppingList>` — only rendered when inputs are valid (no zero/empty values)
4. Pro tip bar at the bottom
5. No-result state: emoji + instructional text when inputs are incomplete

---

## Tech Stack

### Installed

```
React 19.2.0 / React Native 0.83.4 / Expo ~55.0.15
TypeScript ~5.9.2
@expo-google-fonts/bebas-neue
@expo-google-fonts/ibm-plex-sans
@expo-google-fonts/ibm-plex-mono
@react-navigation/bottom-tabs        ← current 7-tab flat nav
@react-navigation/native
react-native-screens
react-native-safe-area-context
@expo/vector-icons                   ← Ionicons for tab bar
expo-font
expo-status-bar
```

### To Install Before Quote Module

```
@react-navigation/material-top-tabs  ← scrollable tool tabs in Calculate section
@react-navigation/stack              ← Quote section stack navigator
@react-native-async-storage/async-storage  ← quote local storage
expo-print                           ← HTML-to-PDF for quote export
expo-sharing                         ← share PDF via share sheet
```

### To Install for Monetization

```
react-native-google-mobile-ads       ← add when implementing AdMob
expo-in-app-purchases                ← add when implementing IAP (or use RevenueCat)
```

State management: plain `useState` — no Redux or Zustand needed at this scale.

---

## File Structure

### Current (as built)

```
buildout/
├── App.tsx                        ← root + 7-tab bottom navigator
├── index.ts                       ← Expo entry point (registerRootComponent)
├── theme.ts                       ← C (color tokens) + WALL_NAMES constant
├── styles.ts                      ← shared StyleSheet for all screens
├── types.ts                       ← Wall, ShoppingListBuy, PaintResult interfaces
├── tsconfig.json                  ← extends expo/tsconfig.base, strict mode
├── eas.json                       ← EAS build profiles (dev / preview / production)
├── app.json                       ← bundle ID: com.drafthouse.buildout
├── package.json
├── context/
│   └── PaidContext.tsx            ← IAP paid state stub (always returns false)
├── screens/                       ← flat; no calculate/ or quote/ subdirs yet
│   ├── PaintScreen.tsx
│   ├── TileScreen.tsx
│   ├── GroutScreen.tsx
│   ├── LVPScreen.tsx
│   ├── CarpetScreen.tsx
│   ├── StairsScreen.tsx
│   └── DrywallScreen.tsx
├── components/
│   ├── SectionLabel.tsx
│   ├── SegControl.tsx
│   ├── InputBlock.tsx
│   ├── ToggleChip.tsx
│   ├── WallCard.tsx               ← Paint-specific manual wall entry
│   ├── ResultCard.tsx             ← shared results display
│   └── ShoppingList.tsx           ← shared shopping list
├── utils/
│   └── calculator.ts              ← toShoppingList, descBuy, calcTile/Grout/LVP/Carpet/Stairs/Drywall
├── ads/
│   └── AdBanner.tsx               ← AdMob stub (renders null)
├── assets/
│   ├── icon.png                   ← MUST be 1024×1024 for App Store
│   ├── adaptive-icon.png
│   ├── splash-icon.png
│   └── favicon.png
├── CLAUDE.md                      ← this file
└── README.md
```

### Target (after Quote module + nav refactor)

```
buildout/
├── App.tsx                        ← root + two-section bottom tab nav
├── ...
├── screens/
│   ├── calculate/                 ← move all 7 *Screen.tsx files here
│   │   ├── PaintScreen.tsx
│   │   ├── TileScreen.tsx
│   │   ├── GroutScreen.tsx
│   │   ├── LVPScreen.tsx
│   │   ├── CarpetScreen.tsx
│   │   ├── StairsScreen.tsx
│   │   └── DrywallScreen.tsx
│   └── quote/                     ← new
│       ├── QuoteHistoryScreen.tsx ← list of saved quotes
│       └── QuoteScreen.tsx        ← new quote builder / edit existing
├── components/
│   ├── ...existing...
│   ├── LineItemRow.tsx            ← quote line item input row (new)
│   └── QuoteCard.tsx              ← quote summary card in history list (new)
├── utils/
│   ├── calculator.ts
│   ├── quoteStorage.ts            ← AsyncStorage CRUD for quotes (new)
│   └── pdfGenerator.ts            ← HTML template + expo-print logic (new)
```

---

## App Store Details

| Field     | Value                                                                                                           |
|-----------|-----------------------------------------------------------------------------------------------------------------|
| App name  | Buildout                                                                                                        |
| Bundle ID | `com.drafthouse.buildout`                                                                                       |
| Category  | Utilities                                                                                                       |
| Price     | Free (with ads) + $2.99 IAP to remove ads + unlock PDF export                                                  |
| Privacy   | Zero data collected, all calculations and quotes stored locally                                                 |
| Keywords  | home renovation calculator, paint, tile, grout, flooring, drywall, contractor, job quote, estimate, LVP, carpet |

---

## App Store Submission Checklist

### Pre-Submission

- [ ] Apple Developer Account active
- [ ] All 7 calculator tools smoke tested on device
- [ ] Quoting module complete (new quote, line items, tax, history)
- [ ] PDF export working and paywalled correctly
- [ ] AdMob wired up and replace AdBanner stub
- [ ] IAP wired up and replace PaidContext stub
- [ ] App icon 1024×1024 PNG in `assets/`
- [ ] Test on real device via TestFlight
- [ ] Privacy policy URL (hosted page stating zero data collection)

### Submission Steps

1. `eas login`
2. `eas build --platform ios --profile production`
3. Create app record in App Store Connect
4. Upload metadata, screenshots (min 2, max 5 — show at least 3 different tools + quote screen)
5. `eas submit --platform ios`
6. Monitor App Store Connect — review typically 24–48 hrs

### Post-Launch

- Monitor crash reports in App Store Connect
- Respond to early reviews
- Ship IAP if stubbed at launch
- Plan V1.1: Wallpaper + Underlayment calculators, deep link Calculate → Quote

---

## Commands

```bash
npm install                                          # install deps
npx expo start                                       # dev server
npx expo start --ios                                 # iOS Simulator (macOS + Xcode)
npx expo export                                      # verify bundle compiles clean
eas build --platform ios --profile production        # App Store build
eas submit --platform ios                            # submit to App Store Connect
```
