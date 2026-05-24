# COAT — Paint Calculator
> React Native / Expo app · iOS App Store ready

## Stack
- **Expo SDK** (blank template)
- **React Native** — fully native components, no WebView
- **@expo-google-fonts** — Bebas Neue, IBM Plex Sans, IBM Plex Mono
- Single file architecture (`App.js`) — easy to extend

---

## Local Development

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Run on iOS simulator (requires macOS + Xcode)
npx expo start --ios

# Run on physical iPhone (requires Expo Go app)
# Scan the QR code from `npx expo start`
```

---

## App Store Submission (iOS)

### 1. Prerequisites
- [ ] Apple Developer Account — $99/yr at developer.apple.com
- [ ] Mac with Xcode 15+ installed
- [ ] Expo account — free at expo.dev

### 2. Update `app.json`
```json
"ios": {
  "bundleIdentifier": "com.YOURNAME.coat",   ← must be unique
  "buildNumber": "1"
}
```

### 3. Add app icons
Replace the placeholder assets in `/assets/`:
- `icon.png` — 1024×1024px, no alpha, no rounded corners (Apple adds rounding)
- `splash-icon.png` — your logo centered on `#0f0f0f` background

**Design spec for COAT icon:**
- Black background `#0f0f0f`
- "COAT." in Bebas Neue, large, with yellow dot
- Or a paint roller / bucket illustration in the yellow accent

### 4. Build with EAS (recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS App Store
eas build --platform ios --profile production
```

EAS handles code signing and provisioning profiles automatically.

### 5. Submit to App Store Connect

```bash
# After the build completes:
eas submit --platform ios
```

Or download the `.ipa` from expo.dev and upload manually via Xcode → Product → Archive.

### 6. App Store Connect metadata

| Field | Suggested value |
|-------|----------------|
| Name | COAT — Paint Calculator |
| Subtitle | No guessing. No waste. | 
| Category | Utilities |
| Price | $1.99 |
| Keywords | paint calculator, paint estimator, DIY, home improvement, gallons, painting |
| Description | (see below) |

**App Store description:**
```
COAT takes the guesswork out of buying paint.

Enter your room dimensions and get the exact number of gallons — 
broken down into a smart shopping list of gallons and quarts.

FULL ROOM MODE
Enter length, width, and ceiling height. Subtract doors and windows. 
Include the ceiling if you're painting it too.

MANUAL WALLS MODE
Add each wall individually with its own dimensions and openings. 
Perfect for irregularly shaped rooms.

FEATURES
• Surface type adjustment (smooth, semi-rough, textured)
• 1, 2, or 3 coat calculations
• Optional cost estimate per gallon
• Smart shopping list (auto-converts quarts to gallons)
• No account required. No ads. No fluff.

Built for DIYers, contractors, and anyone who's ever bought the wrong 
amount of paint.
```

### 7. Screenshots
Required sizes (use Simulator):
- 6.9" (iPhone 16 Pro Max) — 1320×2868
- 6.5" (iPhone 14 Plus) — 1284×2778  
- 5.5" (iPhone 8 Plus) — 1242×2208

Take screenshots showing:
1. Empty state / header
2. Full Room mode with dimensions filled in
3. Results card with shopping list
4. Manual Walls mode

### 8. Privacy Policy
Apple requires a privacy policy URL. Since COAT collects zero data, use a simple one:

```
COAT does not collect, store, or transmit any personal data. 
All calculations are performed locally on your device.
```

Host it as a simple page on GitHub Pages, Notion, or any free host.

---

## File Structure

```
coat/
├── App.js          ← entire app (single file)
├── app.json        ← Expo + App Store config
├── assets/
│   ├── icon.png          ← replace with your 1024×1024 icon
│   ├── splash-icon.png   ← replace with your splash screen
│   └── adaptive-icon.png ← Android (can skip for iOS-first)
├── package.json
└── README.md
```

---

## Extending the App (future tools)

When you're ready to add more calculators (lumber estimator, room sq ft, etc.), the natural next step is a tab navigator:

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
```

Split `App.js` into `screens/PaintCalculator.js`, `screens/LumberEstimator.js`, etc.
