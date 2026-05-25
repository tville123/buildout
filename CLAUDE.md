# Buildout — Home Renovation Calculator App
**Last Updated:** 2026-05-25
**Active Branch:** main

## Project Overview
A mobile-first suite of home renovation calculators built in **React Native / Expo with TypeScript**, targeting the iOS App Store. Multiple tools under one app — free with ads, paid upgrade removes ads. Previously named COAT (Paint Calculator); rebranded as Buildout with Paint as the first tab.

---

## Current Status

### Completed ✓
- All 7 V1 calculators built and wired: Paint, Tile, Grout, LVP, Carpet, Stairs, Drywall
- Paint Calculator has two modes: Full Room (auto-calc walls) + Manual Walls
- Bottom tab navigation wired up (7 tabs, `@expo/vector-icons`, yellow active tint `#f5c842`)
- App rebranded to Buildout (`name`, `slug`, bundle ID all updated in `app.json`)
- Shared components extracted: `ResultCard`, `ShoppingList`
- Entire codebase written in TypeScript (`.tsx`/`.ts` throughout)
- Shared types defined in `types.ts` (`Wall`, `PaintResult`, `ShoppingListBuy`)
- Calculator math in `utils/calculator.ts` for all 7 tools
- Monetization stubs in place: `ads/AdBanner.tsx` (returns null), `context/PaidContext.tsx` (always returns `isPaid: false`)
- EAS build config present (`eas.json`)
- Bundle compiles clean (verified via `npx expo export`)

### Blocking ⚠️
- [ ] Apple Developer Account pending ($99/yr) — [developer.apple.com](https://developer.apple.com)
- [ ] App icon needs to be 1024×1024 PNG before App Store submission
- [ ] Test on real device via TestFlight before submission
- [ ] Wire up AdMob (`react-native-google-mobile-ads`) and replace `AdBanner.tsx` stub
- [ ] Wire up IAP (`expo-in-app-purchases` or RevenueCat) and replace `PaidContext.tsx` stub
- [ ] Privacy policy URL (hosted page, required by App Store)

### Next Immediate Tasks
1. Run on iOS Simulator: `npx expo start --ios`
2. Smoke test all 7 calculator tools
3. Prepare 1024×1024 app icon asset (`assets/icon.png`)
4. Create App Store Connect record once Apple Developer Account is active

---

## Monetization Model
- **Free tier:** All tools available, ad-supported (banner ads between results)
- **Paid upgrade:** One-time in-app purchase (~$2.99) removes all ads
- **Ad implementation:** `ads/AdBanner.tsx` stub → replace with `react-native-google-mobile-ads`
- **IAP implementation:** `context/PaidContext.tsx` stub → replace with `expo-in-app-purchases` or RevenueCat
- **Paid check:** Call `usePaid()` hook anywhere; it currently always returns `false`

---

## Tool Roadmap

### V1 — Initial Submission (all built ✓)
| # | Tool | Status | Nav Label | Screen File |
|---|------|--------|-----------|-------------|
| 1 | Paint Calculator | ✓ Built | Paint | `PaintScreen.tsx` |
| 2 | Tile Calculator | ✓ Built | Tile | `TileScreen.tsx` |
| 3 | Grout Calculator | ✓ Built | Grout | `GroutScreen.tsx` |
| 4 | LVP Calculator | ✓ Built | LVP | `LVPScreen.tsx` |
| 5 | Carpet Calculator | ✓ Built | Carpet | `CarpetScreen.tsx` |
| 6 | Staircase Calculator | ✓ Built | Stairs | `StairsScreen.tsx` |
| 7 | Drywall Calculator | ✓ Built | Drywall | `DrywallScreen.tsx` |

### V1.1 — Post-Launch Updates
- Wallpaper Calculator — rolls + pattern repeat logic
- Underlayment Calculator — pairs with LVP and carpet screens

### Future (separate apps)
- Electrical, plumbing, structural tools → separate niche apps under same developer account
- Keep Buildout focused on surface/flooring/finish work, hard cap at 8 tools

---

## Calculator Math

All math lives in `utils/calculator.ts`. Add new tool functions there, never inline them in screens.

### Paint Calculator
```
Wall area (full room) = 2 × (length + width) × height
Wall area (manual)    = sum of (width × height) per wall, minus opening deductions
Ceiling area          = length × width (optional toggle)
Gallons needed        = (area × coats) / coverageRate
Coverage rates        = smooth: 400, semi-rough: 350, textured: 300 sq ft/gal
Shopping list         = floor(gallons) gal + ceil(remainder × 4) qt   [toShoppingList()]
Door deduction        = 20 sq ft  (or custom width × height if provided)
Window deduction      = 15 sq ft each  (or custom width × height if provided)
```
Helper functions: `toShoppingList(gallons)` → `{gallons, quarts}`, `descBuy(buy)` → display string.

### Tile Calculator
```
Room area      = length × width  (sq ft)
Tile area      = (tile_w × tile_h) / 144  (sq ft per tile, inputs in inches)
Tiles needed   = ceil(room area / tile area)
With waste     = ceil(tiles needed × 1.10)  — 10% for cuts/breakage
Boxes needed   = ceil(tiles with waste / tiles per box)
```

### Grout Calculator
```
Grout factor   = ((tile_w + tile_h) / (tile_w × tile_h)) × joint_width_in × 18
Lbs needed     = ceil(room_area × grout_factor × 1.10)
Bags needed    = ceil(lbs needed / bag_weight)  — default 25 lb bags
Note: k=18 calibrated so 12×12 tile + 1/8" joint ≈ 0.375 lbs/sq ft (~1.5 bags/100 sq ft)
Joint width dropdown: 1/8" = 0.125, 3/16" = 0.1875, 1/4" = 0.25
```

### LVP (Luxury Vinyl Plank) Calculator
```
Room area      = length × width  (sq ft)
With waste     = room area × 1.10  — 10% for cuts and layout
Boxes needed   = ceil(area with waste / sq ft per box)
Cost estimate  = boxes needed × price per box  (optional field)
```

### Carpet Calculator
```
Room area (sq ft) = length × width
Sq yards          = sq ft / 9
With waste        = sq yards × 1.10
Cost estimate     = sq yards with waste × price per sq yard  (optional)
Note: carpet sold in sq yards; always display both sq ft and sq yards in results
```

### Staircase Calculator
```
Tread area     = (tread_depth_in / 12) × (stair_width_in / 12) × num_stairs
Riser area     = (riser_height_in / 12) × (stair_width_in / 12) × num_stairs  (if risers toggled on)
Total area     = tread area + riser area (if applicable)
With waste     = total area × 1.15  — 15% (more cuts on stairs vs. flat floor)
```

### Drywall Calculator
```
Wall area      = 2×(L+W)×H − (doors × 20) − (windows × 15)  sq ft
Sheets needed  = ceil(wall area × 1.10 / 32)  — 4×8 sheet = 32 sq ft, 10% waste
Joint compound = ceil(wall area / 500) buckets
Tape           = ceil(wall area / 500) rolls
Screws         = ceil(wall area / 500) lbs
```

---

## Design Language
All tools share the same design system. **Do not deviate per screen.**

### Color Tokens (`theme.ts` → `C`)
| Token | Hex | Usage |
|-------|-----|-------|
| `C.bg` | `#0f0f0f` | Screen background |
| `C.surface` | `#1a1a1a` | Cards, input backgrounds |
| `C.border` | `#2e2e2e` | Dividers, inactive borders |
| `C.yellow` | `#f5c842` | Accent, active state, result cards |
| `C.text` | `#f0ede8` | Primary text |
| `C.textDim` | `#555` | Disabled, placeholder text |
| `C.textMid` | `#888` | Secondary/supporting text |
| `C.red` | `#e05c3a` | Destructive actions (delete wall) |

Max content width: **430px** (mobile-first, centered).

### Typography
- **`BebasNeue_400Regular`** — Display headings, large result numbers, shopping quantities
- **`IBMPlexSans_300Light` / `_400Regular` / `_500Medium`** — Body text, labels, buttons
- **`IBMPlexMono_400Regular`** — All numeric inputs and unit labels

Fonts are loaded in `App.tsx` via `useFonts()` before rendering. App shows nothing until fonts are ready.

### UI Patterns (apply consistently)
- **Section labels:** uppercase, `C.yellow`, `0.16em` letter-spacing → use `<SectionLabel>`
- **Segmented controls:** yellow active background, dark surface inactive → use `<SegControl>`
- **Inputs:** surface background, yellow left border on focus → use `<InputBlock>`
- **Toggle chips:** checkbox in yellow box when active → use `<ToggleChip>`
- **Result card:** yellow background, large Bebas Neue primary value, breakdown grid → use `<ResultCard>`
- **Shopping list:** dark surface card, yellow Bebas Neue quantities → use `<ShoppingList>`
- **Tip bars:** yellow left accent bar, `C.surface` background

---

## Tech Stack

```
Runtime
  React Native 0.83.4
  Expo ~55.0.15
  React 19.2.0
  TypeScript ~5.9.2

Navigation
  @react-navigation/bottom-tabs ^7.16.1
  @react-navigation/native ^7.2.4
  react-native-screens ^4.25.2
  react-native-safe-area-context ^5.8.0

Fonts
  @expo-google-fonts/bebas-neue ^0.4.1
  @expo-google-fonts/ibm-plex-sans ^0.4.1
  @expo-google-fonts/ibm-plex-mono ^0.4.1
  expo-font ^55.0.6

Icons
  @expo/vector-icons ^15.0.2  (Ionicons used in tab bar)

Web support (dev only)
  react-native-web ^0.21.0
  react-dom 19.2.0

Not yet installed (add when implementing):
  react-native-google-mobile-ads   ← AdMob banner ads
  expo-in-app-purchases            ← or RevenueCat for IAP
```

Node engine: `24.x.x` (see `.nvmrc`). npm: `11.x.x`.  
State management: plain `useState` — no Redux or Zustand needed at this scale.

---

## File Structure

```
buildout/
├── App.tsx                      ← Root component + bottom tab navigator (7 tabs)
├── index.ts                     ← Entry point (registerRootComponent)
├── theme.ts                     ← C (color tokens) + WALL_NAMES constant
├── styles.ts                    ← Shared StyleSheet (~81 named styles)
├── types.ts                     ← Shared TS interfaces: Wall, PaintResult, ShoppingListBuy
├── tsconfig.json                ← TypeScript config
├── eas.json                     ← EAS build profiles (development, preview, production)
├── app.json                     ← Expo config, bundle ID: com.drafthouse.buildout
├── package.json
├── .nvmrc                       ← Node version pin
├── .vscode/settings.json
├── screens/
│   ├── PaintScreen.tsx          ← Full Room + Manual Walls modes
│   ├── TileScreen.tsx
│   ├── GroutScreen.tsx
│   ├── LVPScreen.tsx
│   ├── CarpetScreen.tsx
│   ├── StairsScreen.tsx
│   └── DrywallScreen.tsx
├── components/
│   ├── SectionLabel.tsx         ← Uppercase yellow label
│   ├── SegControl.tsx           ← Generic segmented control (options array + onSelect)
│   ├── InputBlock.tsx           ← Labeled text input with unit, yellow focus border
│   ├── ToggleChip.tsx           ← Toggle with checkbox indicator
│   ├── WallCard.tsx             ← Paint-specific: wall dimensions + opening pills
│   ├── ResultCard.tsx           ← Shared yellow result card with breakdown grid
│   └── ShoppingList.tsx         ← Shared dark-surface shopping list card
├── utils/
│   └── calculator.ts            ← All math: toShoppingList, descBuy, calcTile,
│                                   calcGrout, calcLVP, calcCarpet, calcStairs, calcDrywall
├── ads/
│   └── AdBanner.tsx             ← Stub: returns null (replace with AdMob)
├── context/
│   └── PaidContext.tsx          ← Stub: isPaid always false, usePaid() hook
└── assets/
    ├── icon.png                 ← MUST be 1024×1024 for App Store
    ├── adaptive-icon.png        ← Android adaptive icon
    ├── splash-icon.png
    └── favicon.png
```

---

## Component API Reference

### `<SectionLabel label="TEXT" />`
Uppercase yellow section header. Use above every logical input group.

### `<SegControl options={[{value, label}]} value={active} onSelect={fn} />`
Segmented button row. Yellow active state. Used for modes, coat counts, joint widths, etc.

### `<InputBlock label="Label" value={text} onChangeText={fn} placeholder="0" unit="ft" />`
Decimal-pad text input. Yellow left border on focus. `unit` renders in IBMPlexMono.

### `<ToggleChip label="Include Ceiling" subtitle="optional" active={bool} onToggle={fn} />`
Checkbox toggle chip. Checkmark in yellow box when active.

### `<WallCard wall={Wall} index={number} onChange={fn} onDelete={fn} />`
Paint-specific wall card. Shows auto-numbered name, width × height inputs, live sq ft, opening pills (door/window toggles with optional custom W×H inputs), delete button.

### `<ResultCard tag="Label" value="12.5" unit="gal" rows={[{value, label}]} />`
Yellow result card. Large Bebas Neue `value`. `rows` renders in a 3-col breakdown grid below divider.

### `<ShoppingList items={[{name, subtitle?, qty}]} />`
Dark surface card. Each item shows name, optional subtitle (specs/dimensions), and qty in large yellow Bebas Neue.

---

## Key Conventions

### TypeScript
- All files use `.tsx` (components) or `.ts` (logic/utils). No `.js` files.
- Shared interfaces live in `types.ts`. Add new ones there, not inline.
- Props interfaces defined locally in each component file.

### Adding a New Calculator Screen
1. Create `screens/NewToolScreen.tsx` — copy structure from an existing screen (e.g., `LVPScreen.tsx`)
2. Add math function to `utils/calculator.ts`
3. Register the tab in `App.tsx` → `<Tab.Screen name="NewTool" component={NewToolScreen} />`
4. Add icon to the tab options in `App.tsx` (use Ionicons names from `@expo/vector-icons`)
5. Update this CLAUDE.md (Tool Roadmap table + File Structure)

### Styling
- Import shared styles as `import s from '../styles'` and colors as `import { C } from '../theme'`
- Add new shared styles to `styles.ts`, not inline in components
- Screen-specific one-off styles can be inline `StyleSheet.create` at bottom of screen file
- Never hardcode color hex values in component/screen files — always use `C.*`

### State Management
- Use plain `useState` per screen — no global state needed
- Paint screen state lives entirely in `PaintScreen.tsx` (walls array, mode, dimensions, toggles)
- No prop drilling beyond direct parent→child for screen-specific sub-components

### Math
- All calculation functions in `utils/calculator.ts`, exported and imported by screen
- Functions must be pure (no side effects, no React dependencies)
- Always `Math.ceil` quantities purchased (round up, never down)
- Waste factors: 10% for most materials, 15% for stairs (more cuts)

---

## App Store Details
| Field | Value |
|-------|-------|
| App name | Buildout |
| Bundle ID | `com.drafthouse.buildout` |
| Category | Utilities |
| Price | Free (with ads) + $2.99 IAP to remove ads |
| Privacy | Zero data collected, all calculations local |
| Supported orientation | Portrait only |
| Tablet support | Disabled (iOS) |
| Keywords | home renovation calculator, paint, tile, flooring, contractor, LVP, carpet |

---

## App Store Submission Checklist

### Pre-Submission
- [ ] Apple Developer Account active
- [ ] All 7 V1 tools smoke-tested on real device or simulator
- [ ] Ad integration working (or stubbed — current stub is fine for first build)
- [ ] IAP implemented (or stubbed — can add post-launch)
- [ ] App icon 1024×1024 PNG at `assets/icon.png`
- [ ] Test on real device via TestFlight
- [ ] Privacy policy URL (hosted page stating zero data collection)

### Submission Steps
1. `eas login`
2. `eas build --platform ios --profile production`
3. Create app record in App Store Connect
4. Upload metadata + screenshots (min 2, max 10 — show at least 3 different tools)
5. `eas submit --platform ios`
6. Monitor App Store Connect — review typically 24–48 hrs

### Post-Launch
- Monitor crash reports in App Store Connect
- Respond to early reviews
- Ship real AdMob + IAP if stubbed at launch
- Plan V1.1 (wallpaper, underlayment) based on user feedback

---

## Commands
```bash
npm install                                          # install deps
npx expo start                                       # dev server (scan QR with Expo Go)
npx expo start --ios                                 # open iOS Simulator (macOS + Xcode req.)
npx expo start --android                             # open Android Emulator
npx expo start --web                                 # browser preview
npx expo export                                      # verify bundle compiles clean
eas build --platform ios --profile production        # App Store build
eas submit --platform ios                            # submit to App Store Connect
```
