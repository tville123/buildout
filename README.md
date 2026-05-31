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
- **@react-navigation/bottom-tabs + native-stack** — 2-tab nav (Calculate + Quote), modal root stack
- **AsyncStorage** — local quote storage
- **expo-print + expo-sharing** — HTML-to-PDF export + share sheet
- **react-native-purchases (RevenueCat)** — IAP: one-time `pro` entitlement ($2.99)
- **Plain `useState`** — no Redux or Zustand needed at this scale
- **EAS Build / EAS Submit** — App Store delivery
- **Jest + jest-expo + @testing-library/react-native** — unit + integration tests

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
├── App.tsx                        ← root: RootStack → MainTabs → CalcStack / QuoteStack
├── navigationRef.ts               ← global nav ref + navigateToSettings()
├── theme.ts                       ← C (color tokens) + WALL_NAMES constant
├── styles.ts                      ← shared StyleSheet styles
├── types.ts                       ← Wall, Client, Quote, Invoice, InvoiceView, LineItem, ToolName…
├── index.ts                       ← entry point
├── screens/
│   ├── CalculatorScreen.tsx       ← hosts all 7 tools + ToolSwitcherSheet
│   ├── PaintScreen.tsx / TileScreen.tsx / GroutScreen.tsx
│   ├── LVPScreen.tsx / CarpetScreen.tsx / StairsScreen.tsx / DrywallScreen.tsx
│   ├── WorkspaceScreen.tsx        ← Quote-tab host: TopBar + SectionNav + 4 sections
│   ├── sections/                  ← DashboardSection, QuotesSection, InvoicesSection, ClientsSection
│   ├── QuoteFormScreen.tsx        ← create/edit quote (client select, line items, tax, status)
│   ├── NewInvoiceScreen.tsx       ← new invoice, optional quote prefill
│   ├── ClientDetailScreen.tsx     ← avatar header, quotes/invoices tabs
│   ├── InvoiceDetailScreen.tsx    ← line-item breakdown, Mark as Paid
│   ├── AddClientScreen.tsx        ← add/edit client
│   ├── PDFPreviewScreen.tsx       ← HTML-to-PDF for quotes + invoices; paywalled
│   ├── SettingsScreen.tsx
│   └── OnboardingScreen.tsx
├── components/
│   ├── TopBar.tsx                 ← shared 52px header (tag, back, actions, UPGRADE pill)
│   ├── SectionLabel.tsx / SegControl.tsx / SectionNav.tsx
│   ├── InputBlock.tsx / ToggleChip.tsx / WallCard.tsx
│   ├── ResultCard.tsx / ShoppingList.tsx
│   ├── AddToQuoteCTA.tsx          ← shown on all calc screens
│   ├── LineItemSheet.tsx / LineItemEditor.tsx
│   ├── PaywallSheet.tsx / ConvertSheet.tsx
│   ├── StatusPill.tsx / Avatar.tsx
│   ├── HeroCard.tsx / StatCard.tsx / QuickCreateCard.tsx / ActivityRow.tsx  ← Dashboard
│   ├── QuoteCard.tsx / InvoiceCard.tsx / InvoiceBucket.tsx
│   ├── ClientCard.tsx / ClientSelect.tsx
│   └── ToolSwitcherSheet.tsx
├── context/
│   ├── PaidContext.tsx            ← RevenueCat IAP — usePaid() + usePaidActions()
│   ├── WorkspaceContext.tsx       ← clients/quotes/invoices CRUD + derived stats; useWorkspace()
│   └── ToastContext.tsx           ← global pill toast — useToast() → showToast(msg)
├── utils/
│   ├── calculator.ts              ← all calc math helpers
│   ├── calculator.test.ts
│   ├── workspace.ts               ← totals, dashboard rollups, invoiceView, migration
│   ├── workspace.test.ts
│   ├── format.ts                  ← formatMoney, relDate, dueDateLabel…
│   └── uuid.ts
├── ads/
│   └── AdBanner.tsx               ← AdMob stub (renders null until wired)
├── app.json                       ← bundle ID: com.drafthouse.buildout
├── eas.json                       ← EAS build profiles
└── assets/
    ├── icon.png                   ← must be 1024×1024 for App Store
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
| Price | Free (ads) + $2.99 IAP to remove ads + unlock PDF export |
| Keywords | home renovation calculator, paint, tile, grout, flooring, drywall, contractor, job quote, LVP, carpet |

**App Store description:**
```
Buildout takes the guesswork out of home renovation.

Enter your room dimensions and get exact material estimates — 
broken down into ready-to-shop lists with waste already factored in.
Build job quotes with line items, tax, and PDF export.

CALCULATORS INCLUDED
• Paint — gallons and quarts for any room, smooth to textured surfaces
• Tile — tiles and boxes with 10% cut waste
• Grout — lbs and bags based on tile size and joint width
• LVP (Luxury Vinyl Plank) — sq ft, boxes, optional cost estimate
• Carpet — sq yards with waste, optional cost per yard
• Stairs — tread and riser area with 15% stair-cut waste
• Drywall — sheets, joint compound, tape, and screws

QUOTE & INVOICE WORKSPACE
• Build quotes with line items, quantities, and unit prices
• Convert approved quotes to invoices in one tap
• Track clients, payment status, and outstanding amounts
• Export professional PDF quotes and invoices (Pro)

No account required. All data stays on your device — zero data collected.
Free with ads. One-time $2.99 upgrade removes ads and unlocks PDF export.

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
| Free | All 7 tools + quote builder, banner ads between results, PDF export locked |
| Paid ($2.99) | All 7 tools + quote builder, no ads, PDF export unlocked — one-time purchase |

- **IAP:** `react-native-purchases` (RevenueCat) — entitlement: `pro`. Product `com.drafthouse.buildout.pro` (Non-Consumable, $2.99) created in App Store Connect and RevenueCat; `default` offering → `$rc_lifetime` package. Test key active in `context/PaidContext.tsx` — swap for production `appl_` key before `eas build --platform ios --profile production`. Hooks: `usePaid()` (boolean) + `usePaidActions()` (`purchase`, `restore`, `isLoading`).
- **Ads:** Google AdMob via `react-native-google-mobile-ads` *(stub in place — wire up before launch)*

---

## Blocking Before Launch

- [x] Apple Developer Account active (Manuel Villalobos | 1415684764)
- [x] Wire up IAP — RevenueCat fully configured; product + offering set up; purchase flow tested; swap for production `appl_` key before App Store build
- [x] Quote Workspace complete — Quotes, Invoices, Clients, Dashboard with quote→invoice conversion
- [ ] App icon — 1024×1024 PNG (current asset needs to be replaced)
- [ ] Wire up AdMob and replace `AdBanner.tsx` stub
- [ ] Test on real device via TestFlight
- [ ] Privacy policy URL (hosted page)
- [ ] App Store Connect record created
