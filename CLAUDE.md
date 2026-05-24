# COAT — Paint Calculator App

## Project Overview
A mobile-first paint calculator app built in React Native / Expo, targeting the iOS App Store. The goal is to validate on web first, then ship as a paid iOS app ($1.99–$2.99).

## Design Language
- **Brand name:** COAT
- **Theme:** Dark, hardware-store-inspired
- **Background:** `#0f0f0f`
- **Surface:** `#1a1a1a`
- **Border:** `#2e2e2e`
- **Accent:** `#f5c842` (yellow)
- **Text:** `#f0ede8`
- **Fonts:** Bebas Neue (display/numbers), IBM Plex Sans (body), IBM Plex Mono (numeric inputs)
- **Max width:** 430px (mobile-first)
- **Results card:** Yellow background with large Bebas Neue number

## Tech Stack
- React Native + Expo (blank template)
- `@expo-google-fonts/bebas-neue`
- `@expo-google-fonts/ibm-plex-sans`
- `@expo-google-fonts/ibm-plex-mono`
- No navigation library yet (single screen) — add `@react-navigation/bottom-tabs` when bundling multiple tools
- No state management library — plain `useState`

## File Structure
```
coat/
├── App.js              ← main component + state
├── theme.js            ← colors (C) and WALL_NAMES
├── styles.js           ← all StyleSheet styles
├── components/
│   ├── SectionLabel.js
│   ├── SegControl.js
│   ├── InputBlock.js
│   ├── ToggleChip.js
│   └── WallCard.js
├── utils/
│   └── calculator.js   ← toShoppingList, descBuy
├── app.json        ← Expo + App Store config
├── assets/         ← icon.png (1024×1024 needed), splash-icon.png
├── package.json
└── README.md       ← App Store submission guide
```

## App Features

### Full Room Mode
- Inputs: length, width, ceiling height (ft)
- Toggles: door deduction (~20 sq ft), window deduction (~15 sq ft × count), ceiling inclusion (L × W)
- Settings: surface type (smooth 400 / semi-rough 350 / textured 300 sq ft per gallon), coats (1–3)
- Optional: price per gallon for walls and ceiling separately

### Manual Walls Mode
- Add individual walls (auto-labeled North/South/East/West/Wall 5…)
- Per wall: width, height, door toggle (−20 sqft), window toggle (−15 sqft)
- Live sq ft badge per wall
- Wall-by-wall breakdown in results

### Results
- Total gallons needed
- Smart shopping list (auto-splits into gallons + quarts, converts 4 qt → 1 gal)
- Estimated cost (if price entered)
- Pro tip

## Paint Calculator Math
```
Wall area (full room) = 2 × (length + width) × height
Wall area (manual)    = sum of (width × height) per wall, minus opening deductions
Ceiling area          = length × width (optional)
Gallons needed        = (area × coats) / coverageRate
Coverage rates        = smooth: 400, semi-rough: 350, textured: 300 sq ft/gal
Shopping list         = floor(gallons) gal + ceil(remainder × 4) qt
```

## App Store Details
- **Bundle ID:** `com.yourname.coat` ← update in app.json
- **Category:** Utilities
- **Price:** $1.99–$2.99 one-time
- **Privacy:** Collects zero data, all calculations are local
- **Requires:** Apple Developer Account ($99/yr), EAS CLI for builds

## Planned Tools (future screens)
1. **Lumber / Material Estimator** — board count, linear feet, cost for raised beds, decks, fences
2. **Room Square Footage Tool** — flooring and tiling companion
3. More TBD — bundle 3–4 tools before App Store submission for approval

## Commands
```bash
npm install          # install deps
npx expo start       # start dev server + QR code for Expo Go
npx expo start --ios # open in iOS Simulator (macOS + Xcode required)
eas build --platform ios --profile production  # App Store build
eas submit --platform ios                      # submit to App Store Connect
```