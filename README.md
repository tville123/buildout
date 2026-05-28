# Buildout — Home Renovation Calculator
> React Native / Expo app · iOS App Store ready

A mobile-first suite of home renovation calculators. Free with ads; a one-time $2.99 in-app purchase removes ads permanently.

---

## Tools (V1)

| # | Calculator | Description |
|---|-----------|-------------|
| 1 | **Paint** | Full Room + Manual Walls modes, surface types, coat count |
| 2 | **Tile** | Room area → tiles + boxes with 10% waste |
| 3 | **Grout** | Lbs and bags based on tile size and joint width |
| 4 | **LVP** | Luxury vinyl plank — sq ft, boxes, optional cost |
| 5 | **Carpet** | Sq ft → sq yards + waste, optional cost per yard |
| 6 | **Stairs** | Tread + riser area with 15% stair-cut waste |
| 7 | **Drywall** | Sheets, joint compound, tape, and screws |

---

## Stack

- **React Native + Expo** (blank template, TypeScript)
- **@expo-google-fonts** — Bebas Neue, IBM Plex Sans, IBM Plex Mono
- **@react-navigation/bottom-tabs** — 7-tab navigator, yellow active tint
- **Plain `useState`** — no Redux or Zustand needed at this scale
- **EAS Build / EAS Submit** — App Store delivery

---

## Local Development

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Run on iOS Simulator (requires macOS + Xcode)
npx expo start --ios

# Full native rebuild — required after changing assets (icon, splash) or app.json config
npx expo run:ios

# Run on physical iPhone (scan the QR code from `npx expo start` in Expo Go)

# Verify the bundle compiles clean
npx expo export
```

> **Adding packages?** Always use `npx expo install <package>`, not `npm install`.
> Expo resolves the SDK-compatible version — `npm install` grabs latest and can cause native module crashes.

---

## File Structure

```
buildout/
├── App.tsx                   ← root + bottom-tab navigator
├── theme.ts                  ← color tokens + shared constants
├── styles.ts                 ← shared StyleSheet styles
├── types.ts                  ← shared TypeScript types
├── index.ts                  ← entry point
├── screens/
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
│   ├── WallCard.tsx          ← Paint-specific
│   ├── ResultCard.tsx        ← shared results display
│   └── ShoppingList.tsx      ← shared shopping list
├── utils/
│   └── calculator.ts         ← all math helpers
├── ads/
│   └── AdBanner.tsx          ← AdMob stub (renders null until wired)
├── context/
│   └── PaidContext.tsx       ← IAP stub (free tier by default)
├── app.json                  ← bundle ID: com.drafthouse.buildout
├── eas.json                  ← EAS build profiles
└── assets/
    ├── icon.png              ← must be 1024×1024 for App Store
    └── splash-icon.png
```

---

## App Store Submission (iOS)

### 1. Prerequisites
- [ ] Apple Developer Account — $99/yr at [developer.apple.com](https://developer.apple.com)
- [ ] Mac with Xcode 15+ installed
- [ ] Expo account — free at [expo.dev](https://expo.dev)

### 2. App icon
Replace `assets/icon.png` with a **1024×1024 PNG** — no alpha, no rounded corners (Apple adds rounding automatically).

### 3. Build with EAS

```bash
npm install -g eas-cli
eas login
eas build --platform ios --profile production
```

EAS handles code signing and provisioning profiles automatically.

### 4. Submit

```bash
eas submit --platform ios
```

Or download the `.ipa` from expo.dev and upload manually via Xcode → Product → Archive.

### 5. App Store Connect metadata

| Field | Value |
|-------|-------|
| Name | Buildout |
| Subtitle | Home renovation calculators |
| Bundle ID | `com.drafthouse.buildout` |
| Category | Utilities |
| Price | Free (ads) + $2.99 IAP to remove ads |
| Keywords | home renovation calculator, paint, tile, flooring, contractor, LVP, carpet |

**App Store description:**
```
Buildout takes the guesswork out of home renovation.

Enter your room dimensions and get exact material estimates — 
broken down into ready-to-shop lists with waste already factored in.

CALCULATORS INCLUDED
• Paint — gallons and quarts for any room, smooth to textured surfaces
• Tile — tiles and boxes with 10% cut waste
• Grout — lbs and bags based on tile size and joint width
• LVP (Luxury Vinyl Plank) — sq ft, boxes, optional cost estimate
• Carpet — sq yards with waste, optional cost per yard
• Stairs — tread and riser area with 15% stair-cut waste
• Drywall — sheets, joint compound, tape, and screws

No account required. All calculations are local — zero data collected.
Free with ads. One-time $2.99 upgrade removes ads permanently.

Built for DIYers, contractors, and anyone who's ever overbought materials.
```

### 6. Screenshots
Capture from Simulator at these sizes:
- **6.9"** (iPhone 16 Pro Max) — 1320×2868
- **6.5"** (iPhone 14 Plus) — 1284×2778
- **5.5"** (iPhone 8 Plus) — 1242×2208

Show at least 3 different tools across your screenshots.

### 7. Privacy policy
Apple requires a privacy policy URL. Buildout collects zero data — use a simple hosted page:

```
Buildout does not collect, store, or transmit any personal data.
All calculations are performed locally on your device.
```

Host on GitHub Pages, Notion, or any free static host.

---

## Monetization

| Tier | Experience |
|------|-----------|
| Free | All 7 tools, banner ads between results |
| Paid ($2.99) | All 7 tools, no ads, one-time purchase |

- **Ads:** Google AdMob via `react-native-google-mobile-ads` *(stub in place — wire up before launch)*
- **IAP:** Expo In-App Purchases or RevenueCat *(stub in place — wire up before launch)*

---

## Blocking Before Launch

- [ ] Apple Developer Account ($99/yr)
- [ ] App icon — 1024×1024 PNG
- [ ] Wire up AdMob and replace `AdBanner.tsx` stub
- [ ] Wire up IAP and replace `PaidContext.tsx` stub
- [ ] Test on real device via TestFlight
- [ ] Privacy policy URL (hosted page)
- [ ] App Store Connect record created
