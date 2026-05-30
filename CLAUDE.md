# Buildout — Home Renovation Calculator App

**Last Updated:** 2026-05-28 (IAP + testing infra)
**Active Branch:** main

## Project Overview

A mobile-first app for small contractors and DIYers built in React Native / Expo (TypeScript), targeting the iOS App Store. Buildout has two core sections: **Calculate** (material estimators for paint, tile, flooring, drywall, and more) and **Quote** (fast job quoting with PDF export). Free with ads; paid upgrade removes ads and unlocks PDF export. Previously named COAT (Paint Calculator); rebranded as Buildout with Paint as the first calculator screen.

---

## Current Status

### Completed ✓

- Paint Calculator fully built (Full Room + Manual Walls modes)
- All 7 V1 calculators built: Paint, Tile, Grout, LVP, Carpet, Stairs, Drywall
- App rebranded to Buildout (`name`, `slug`, bundle ID all updated)
- All 7 V1 calculators built: Paint, Tile, Grout, LVP, Carpet, Stairs, Drywall
- Shared components: `ResultCard`, `ShoppingList`, `SegControl`, `InputBlock`, `SectionLabel`, `ToggleChip`, `WallCard`, `TopBar`
- `design-system/` directory — canonical visual reference for brand, tokens, component previews (HTML), and a mobile UI kit (React, web) covering Paint/Tile/Drywall screens
- Calculator math in `utils/calculator.ts` for Tile, Grout, LVP, Carpet, Stairs, Drywall; Paint math is inline in `PaintScreen.tsx`
- Monetization: `ads/AdBanner.tsx` stub (renders null); `context/PaidContext.tsx` — RevenueCat IAP wired (`react-native-purchases`), exposes `usePaid()` + `usePaidActions()` (`purchase`, `restore`, `isLoading`); set `RC_IOS_KEY` before building
- **Testing infrastructure** (2026-05-28): Jest + jest-expo + `@testing-library/react-native`; test files: `context/QuoteContext.test.tsx`, `utils/calculator.test.ts`; run with `npm test`
- TypeScript interfaces in `types.ts`: `Wall`, `ShoppingListBuy`, `PaintResult`, `Quote`, `LineItem`, `ToolName`
- EAS build config in `eas.json` (development / preview / production profiles)
- **Nav refactor + Quote module complete** (2026-05-27): 2-tab bottom nav (Calculate + Quote), `CalculatorScreen` wraps all 7 tools via `ToolSwitcherSheet` modal, Quote stack (history → builder → PDF preview), `AddToQuoteCTA` on all calc screens, onboarding flow, settings screen, `PaywallSheet` — see nav graph below
- `QuoteContext.tsx` — AsyncStorage-backed CRUD for quotes (storage key: `buildout.quotes`)
- `navigationRef.ts` — global nav ref for imperative navigation (e.g. Settings modal from deep within calc screens)

### Blocking ⚠️

- [x] Quote module + nav refactor — COMPLETE (2026-05-27)
- [x] IAP wired up — RevenueCat (`react-native-purchases`) integrated (2026-05-28); test key set in `context/PaidContext.tsx` (swap for production key before App Store build)
- [x] Apple Developer Account active — App Store Connect: Manuel Villalobos | 1415684764
- [x] RevenueCat fully configured — test key active; product (`com.drafthouse.buildout.pro`) created in App Store Connect + RevenueCat; `default` offering wired to `$rc_lifetime` package; swap for production `appl_` key in `context/PaidContext.tsx` before `eas build --platform ios --profile production`
- [ ] Wire up AdMob (`react-native-google-mobile-ads`) and replace AdBanner stub
- [ ] App icon needs to be 1024×1024 PNG before App Store submission
- [ ] Test on real device via TestFlight before submission
- [ ] Privacy policy URL (hosted page, required by App Store)

### Next Immediate Tasks

1. Run on iOS Simulator: `npx expo start --ios`
2. Smoke test all 7 calculator tools + Quote flow + IAP paywall end-to-end
3. Prepare 1024×1024 app icon asset
4. Create app record in App Store Connect (account is active)
5. Wire up AdMob (`react-native-google-mobile-ads`)

---

## Monetization Model

- **Free tier:** All calculators available with banner ads between results; quote builder available but PDF export locked
- **Paid upgrade:** One-time in-app purchase (~$2.99) removes all ads AND unlocks PDF export
- **PDF export as conversion hook:** Free users can build a quote but see an upgrade prompt when tapping Export — this is the natural paid conversion moment
- **Ad implementation:** TBD — Google AdMob via `react-native-google-mobile-ads` (stub in place)
- **IAP implementation:** RevenueCat (`react-native-purchases`) — entitlement: `pro`; hooks: `usePaid()` + `usePaidActions()`; test key set in `PaidContext.tsx`; product `com.drafthouse.buildout.pro` (Non-Consumable, $2.99) created in App Store Connect + RevenueCat; `default` offering → `$rc_lifetime` package; purchase flow grabs `LIFETIME` package type first; swap for production `appl_` key before App Store build

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

| # | Feature                 | Status   | Notes                                              |
|---|-------------------------|----------|----------------------------------------------------|
| 1 | New Quote builder       | ✓ Built  | `QuoteBuilderScreen.tsx` — client, desc, line items |
| 2 | Line item entry         | ✓ Built  | `LineItemSheet.tsx` — description, qty, unit price  |
| 3 | Tax + total calculation | ✓ Built  | Optional tax rate in QuoteBuilderScreen             |
| 4 | PDF export              | ✓ Built  | `PDFPreviewScreen.tsx` — paywalled, `expo-print`    |
| 5 | Quote history           | ✓ Built  | `QuoteHistoryScreen.tsx` — saved quotes list        |

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

2-tab bottom nav. Calculate tab uses a single `CalculatorScreen` that renders whichever tool is active; tool switching is via `ToolSwitcherSheet` modal (not material-top-tabs). Quote tab is a native stack. Settings is a modal on the root stack.

```
App.tsx (RootStack)
├── Main (bottom tabs)
│   ├── Calculate (CalcStack)
│   │   └── Calculator  (CalculatorScreen.tsx — hosts all 7 tools, ToolSwitcherSheet)
│   └── Quote (QuoteStack)
│       ├── QuoteHistory   (QuoteHistoryScreen.tsx)
│       ├── QuoteBuilder   (QuoteBuilderScreen.tsx)
│       └── PDFPreview     (PDFPreviewScreen.tsx)
└── Settings (modal)       (SettingsScreen.tsx)
```

**Key design notes:**

- Tool switching inside Calculate uses `ToolSwitcherSheet` bottom sheet, not a tab bar — avoids `@react-navigation/material-top-tabs` dependency
- `ToolName` (`types.ts`) drives which screen `CalculatorScreen` renders via a `Record<ToolName, ComponentType>` map
- `navigationRef.ts` provides a global nav ref so calc screens can open Settings without prop drilling
- `QuoteContext.tsx` provides quote CRUD to all screens; persists to AsyncStorage (`buildout.quotes`)
- `OnboardingScreen` is rendered outside the nav tree until `buildout.hasOnboarded` is set

---

## Quoting Module

> **Status: COMPLETE** (2026-05-27). Spec below reflects the implemented design.

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
- Key format: `buildout.quotes` → array of Quote objects (managed by `context/QuoteContext.tsx`)

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

- Top bar: compact 52px header with yellow tracked tag, optional back chevron, action icons, UPGRADE pill — use `<TopBar>`
- Section labels: uppercase, yellow, ~9.6px, 0.16em letter-spacing — use `<SectionLabel>`
- Segmented controls: yellow active state, dark surface inactive — use `<SegControl>`
- Input blocks: surface background, yellow border on focus — use `<InputBlock>`
- Results card: yellow background, large Bebas Neue number, breakdown grid — use `<ResultCard>`
- Shopping list card: dark surface, yellow quantities in Bebas Neue — use `<ShoppingList>`
- Toggle chips: yellow border + subtle yellow fill when active — use `<ToggleChip>`

**Screen UX Pattern** (all 7 calculators follow this exactly)

1. `<TopBar tag="TOOL_NAME" />` — compact bar, no large title
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
@react-navigation/bottom-tabs        ← 2-tab bottom nav (Calculate + Quote)
@react-navigation/native
@react-navigation/native-stack       ← calc stack + quote stack + root modal
react-native-screens
react-native-safe-area-context
@expo/vector-icons                   ← Ionicons for tab bar
@react-native-async-storage/async-storage  ← quote local storage
expo-font
expo-status-bar
expo-print                           ← HTML-to-PDF for quote export
expo-sharing                         ← share PDF via share sheet
react-native-purchases               ← RevenueCat IAP (entitlement: pro)
jest / jest-expo / @testing-library/react-native  ← unit + integration tests
```

### To Install for Ads

```
react-native-google-mobile-ads       ← add when implementing AdMob
```

State management: plain `useState` — no Redux or Zustand needed at this scale.

---

## File Structure

```
buildout/
├── App.tsx                        ← root: RootStack → MainTabs → CalcStack / QuoteStack
├── navigationRef.ts               ← global nav ref + navigateToSettings()
├── index.ts                       ← Expo entry point (registerRootComponent)
├── theme.ts                       ← C (color tokens) + WALL_NAMES constant
├── styles.ts                      ← shared StyleSheet for all screens
├── types.ts                       ← Wall, ShoppingListBuy, PaintResult, Quote, LineItem, ToolName
├── tsconfig.json                  ← extends expo/tsconfig.base, strict mode
├── eas.json                       ← EAS build profiles (dev / preview / production)
├── app.json                       ← bundle ID: com.drafthouse.buildout
├── package.json
├── context/
│   ├── PaidContext.tsx            ← RevenueCat IAP — usePaid() + usePaidActions() (purchase/restore/isLoading)
│   ├── QuoteContext.tsx           ← AsyncStorage-backed quote CRUD; storage key: buildout.quotes
│   └── QuoteContext.test.tsx      ← Jest integration tests for quote CRUD
├── screens/                       ← flat (no calculate/ or quote/ subdirs)
│   ├── CalculatorScreen.tsx       ← hosts all 7 tool screens + ToolSwitcherSheet
│   ├── PaintScreen.tsx
│   ├── TileScreen.tsx
│   ├── GroutScreen.tsx
│   ├── LVPScreen.tsx
│   ├── CarpetScreen.tsx
│   ├── StairsScreen.tsx
│   ├── DrywallScreen.tsx
│   ├── QuoteHistoryScreen.tsx     ← list of saved quotes
│   ├── QuoteBuilderScreen.tsx     ← new/edit quote, line items, tax, totals
│   ├── PDFPreviewScreen.tsx       ← HTML-to-PDF preview + share; paywalled
│   ├── SettingsScreen.tsx         ← app settings modal
│   └── OnboardingScreen.tsx       ← shown on first launch (outside nav tree)
├── components/
│   ├── TopBar.tsx                 ← shared 52px header (tag, back chevron, action icons, UPGRADE pill)
│   ├── SectionLabel.tsx
│   ├── SegControl.tsx
│   ├── InputBlock.tsx
│   ├── ToggleChip.tsx
│   ├── WallCard.tsx               ← Paint-specific manual wall entry
│   ├── ResultCard.tsx             ← shared results display
│   ├── ShoppingList.tsx           ← shared shopping list
│   ├── AddToQuoteCTA.tsx          ← "Add to Quote" button shown on all calc screens
│   ├── LineItemSheet.tsx          ← bottom sheet for adding/editing a line item
│   ├── PaywallSheet.tsx           ← upgrade prompt modal — async purchase flow + ActivityIndicator loading state
│   ├── QuoteCard.tsx              ← quote summary row in history list
│   └── ToolSwitcherSheet.tsx      ← bottom sheet for switching between the 7 calc tools
├── utils/
│   ├── calculator.ts              ← toShoppingList, descBuy, calcTile/Grout/LVP/Carpet/Stairs/Drywall
│   └── calculator.test.ts         ← Jest unit tests for all calc functions
├── ads/
│   └── AdBanner.tsx               ← AdMob stub (renders null)
├── assets/
│   ├── icon.png                   ← MUST be 1024×1024 for App Store
│   ├── adaptive-icon.png
│   ├── splash-icon.png
│   └── favicon.png
├── design-system/                 ← canonical visual reference (brand, tokens, component HTML previews, mobile UI kit)
│   ├── README.md                  ← brand guide + full design spec
│   ├── SKILL.md                   ← agent entry point for design tasks
│   ├── colors_and_type.css        ← all tokens as CSS variables
│   ├── assets/                    ← logos, app icon, brand marks (SVG + PNG)
│   ├── fonts/                     ← font notes (Google Fonts CDN; see fonts/README.md)
│   ├── preview/                   ← one HTML file per component card
│   └── ui_kits/mobile-app/        ← React (web) recreation of Paint/Tile/Drywall screens; click-through prototype
├── docs/
│   └── index.html
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

- [x] Apple Developer Account active
- [ ] All 7 calculator tools smoke tested on device
- [x] Quoting module complete (new quote, line items, tax, history)
- [x] PDF export built and paywalled (smoke test on device still needed)
- [x] IAP wired up — RevenueCat (`react-native-purchases`); set `RC_IOS_KEY` before building
- [ ] AdMob wired up and replace AdBanner stub
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
- Plan V1.1: Wallpaper + Underlayment calculators, deep link Calculate → Quote

---

## Commands

```bash
npm install                                          # install deps
npx expo start                                       # dev server
npx expo start --ios                                 # iOS Simulator (macOS + Xcode)
npx expo run:ios                                     # full native rebuild + install (required after asset/config changes)
npx expo export                                      # verify bundle compiles clean
npm test                                             # run Jest unit + integration tests
eas build --platform ios --profile production        # App Store build
eas submit --platform ios                            # submit to App Store Connect
```

> **Always use `npx expo install <package>` — never `npm install` — for Expo packages.**
> `npm install` grabs the latest version, which may target a newer SDK and cause "Cannot find native module" errors at runtime.
> `npx expo install` resolves the SDK-compatible version automatically.
