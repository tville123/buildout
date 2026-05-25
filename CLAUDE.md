# Buildout — Home Renovation Calculator App

**Last Updated:** 2026-05-25
**Active Branch:** main

## Project Overview

A mobile-first app for small contractors and DIYers built in React Native / Expo, targeting the iOS App Store. Buildout has two core sections: **Calculate** (material estimators for paint, tile, flooring, drywall, and more) and **Quote** (fast job quoting with PDF export). Free with ads; paid upgrade removes ads and unlocks PDF export. Previously named COAT (Paint Calculator); rebranded as Buildout with Paint as the first calculator screen.

---

## Current Status

### Completed ✓

- Paint Calculator fully built (Full Room + Manual Walls modes)
- All 7 V1 calculators built: Paint, Tile, Grout, LVP, Carpet, Stairs, Drywall
- Bottom tab navigation wired up (7 tabs, Ionicons, yellow active tint)
- App rebranded to Buildout (`name`, `slug`, bundle ID all updated)
- Shared components extracted: `ResultCard`, `ShoppingList`
- Calculator math in `utils/calculator.js` for all tools
- Monetization stubs in place: `ads/AdBanner.js`, `context/PaidContext.js`
- Bundle compiles clean (verified via `npx expo export`)

### Blocking ⚠️

- [ ] Apple Developer Account pending ($99/yr) — [developer.apple.com](https://developer.apple.com)
- [ ] App icon needs to be 1024×1024 PNG before App Store submission
- [ ] Test on real device via TestFlight before submission
- [ ] Wire up AdMob (`react-native-google-mobile-ads`) and replace AdBanner stub
- [ ] Wire up IAP (`expo-in-app-purchases` or RevenueCat) and replace PaidContext stub
- [ ] Privacy policy URL (hosted page, required by App Store)
- [ ] Quoting module not yet started (see roadmap below)

### Next Immediate Tasks

1. Run on iOS Simulator: `npx expo start --ios`
1. Smoke test all 7 calculator tools
1. Prepare 1024×1024 app icon asset
1. Begin Quoting module — restructure nav into Calculate / Quote two-section layout
1. Create App Store Connect record once Apple Developer Account is active

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

### Future (separate apps)

- Deep link from calculator results → Quote builder (e.g. "Add to Quote" button pre-fills a line item)
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
Door deduction        = 20 sq ft
Window deduction      = 15 sq ft each
```

### Tile Calculator

```
Room area      = length × width (sq ft)
Tile area      = (tile width × tile height) / 144  (sq ft per tile)
Tiles needed   = ceil(room area / tile area)
With waste     = ceil(tiles needed × 1.10)  — always add 10% for cuts/breakage
Boxes needed   = ceil(tiles needed / tiles per box)
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

Buildout uses a two-section top-level layout — not a flat tab bar.

```
App.js (root)
├── Bottom Tab: Calculate
│   └── Top Tabs (ScrollableTab or MaterialTopTabs)
│       ├── Paint
│       ├── Tile
│       ├── Grout
│       ├── LVP
│       ├── Carpet
│       ├── Stairs
│       └── Drywall
└── Bottom Tab: Quote
    └── Stack Navigator
        ├── QuoteHistoryScreen  (default — list of saved quotes)
        └── QuoteScreen         (new quote builder / edit existing)
```

**Key decisions:**

- Bottom tab has exactly 2 items: Calculate and Quote
- Calculator tools scroll horizontally in a top tab bar — do not use a nested bottom tab for each tool
- Quote section uses a stack so users can navigate back from a quote to the history list
- Ads appear in Calculate section only (between results); Quote section is ad-free but PDF export is paywalled

---

## Quoting Module

### Data Model

```javascript
Quote {
  id: string           // uuid
  createdAt: timestamp
  updatedAt: timestamp
  clientName: string
  jobDescription: string
  lineItems: LineItem[]
  taxRate: number      // percentage, e.g. 8.5
  notes: string        // optional footer note on PDF
  status: 'draft' | 'sent'
}

LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number    // USD
  total: number        // quantity × unitPrice (derived)
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

**Fonts**

- `Bebas Neue` — display headings, large result numbers
- `IBM Plex Sans` — body text, labels, buttons
- `IBM Plex Mono` — all numeric inputs and unit labels

**UI Patterns** (consistent across all tools)

- Section labels: `0.6rem`, `0.16em` letter-spacing, uppercase, yellow
- Segmented controls: yellow active state, dark surface inactive
- Input blocks: surface background, yellow border on focus
- Results card: yellow background, large Bebas Neue number, breakdown grid
- Shopping list card: dark surface, yellow quantities in Bebas Neue
- Toggle chips: yellow border + subtle yellow fill when active

---

## Tech Stack

```
React Native + Expo (blank template)
@expo-google-fonts/bebas-neue
@expo-google-fonts/ibm-plex-sans
@expo-google-fonts/ibm-plex-mono
@react-navigation/bottom-tabs          ← two-section nav (Calculate + Quote)
@react-navigation/material-top-tabs    ← scrollable calculator tool tabs
@react-navigation/stack                ← Quote section stack navigator
@react-navigation/native
react-native-screens
react-native-safe-area-context
@react-native-async-storage/async-storage  ← quote local storage
expo-print                             ← HTML-to-PDF for quote export
expo-sharing                           ← share PDF via share sheet
expo-in-app-purchases                  ← add when implementing IAP
react-native-google-mobile-ads         ← add when implementing ads
```

State management: plain `useState` — no Redux or Zustand needed at this scale.

---

## File Structure

```
buildout/
├── App.js                         ← root + bottom tab navigator (Calculate | Quote)
├── theme.js                       ← C (colors) + shared constants
├── styles.js                      ← shared StyleSheet styles
├── context/
│   └── PaidContext.js             ← IAP paid state (stub in place)
├── screens/
│   ├── calculate/
│   │   ├── PaintScreen.js
│   │   ├── TileScreen.js
│   │   ├── GroutScreen.js
│   │   ├── LVPScreen.js
│   │   ├── CarpetScreen.js
│   │   ├── StairsScreen.js
│   │   └── DrywallScreen.js
│   └── quote/
│       ├── QuoteHistoryScreen.js  ← list of saved quotes
│       └── QuoteScreen.js         ← new quote builder / edit existing
├── components/
│   ├── SectionLabel.js
│   ├── SegControl.js
│   ├── InputBlock.js
│   ├── ToggleChip.js
│   ├── WallCard.js                ← Paint-specific
│   ├── ResultCard.js              ← shared results display
│   ├── ShoppingList.js            ← shared shopping list
│   ├── LineItemRow.js             ← quote line item input row
│   └── QuoteCard.js               ← quote summary card in history list
├── utils/
│   ├── calculator.js              ← toShoppingList, descBuy, all math helpers
│   ├── quoteStorage.js            ← AsyncStorage CRUD for quotes
│   └── pdfGenerator.js            ← HTML template + expo-print logic
├── ads/
│   └── AdBanner.js                ← wraps AdMob banner, renders null in paid mode
├── app.json                       ← bundle ID: com.drafthouse.buildout
├── assets/
│   ├── icon.png                   ← MUST be 1024×1024 for App Store
│   └── splash-icon.png
├── package.json
├── CLAUDE.md                      ← this file
└── README.md
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
1. `eas build --platform ios --profile production`
1. Create app record in App Store Connect
1. Upload metadata, screenshots (min 2, max 5 — show at least 3 different tools + quote screen)
1. `eas submit --platform ios`
1. Monitor App Store Connect — review typically 24–48 hrs

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
eas build --platform ios --profile production        # App Store build
eas submit --platform ios                            # submit to App Store Connect
```
