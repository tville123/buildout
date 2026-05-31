# Buildout — Home Renovation Calculator App

Mobile-first React Native / Expo (TypeScript) app for contractors/DIYers, targeting
iOS App Store. Two sections: **Calculate** (7 material estimators) and **Quote** (job
quoting + invoicing + PDF export). Free with ads; $2.99 one-time IAP removes ads and
unlocks PDF export. Formerly COAT (Paint Calculator).

## Status

**Done:** All 7 calculators (Paint, Tile, Grout, LVP, Carpet, Stairs, Drywall) ·
Quote Workspace (Dashboard/Quotes/Invoices/Clients) · quote→invoice conversion ·
client mgmt · PDF export (paywalled) · onboarding · settings · shared component set ·
Jest tests · RevenueCat IAP (test key) · EAS build profiles · lint clean.

**Open before submission:**
- Wire AdMob (`react-native-google-mobile-ads`), replace `ads/AdBanner.tsx` stub
- Swap RevenueCat test key → production `appl_` key in `context/PaidContext.tsx`
- 1024×1024 PNG app icon in `assets/icon.png`
- TestFlight smoke test all 7 tools + Quote flow + IAP paywall on device
- Hosted privacy-policy URL (zero data collected)

## Monetization

- Free: all calculators + ads; quote builder usable but PDF export locked.
- Paid: $2.99 non-consumable IAP → removes ads + unlocks PDF. PDF export is the
  conversion hook (upgrade prompt fires on Export tap).
- IAP: RevenueCat, entitlement `pro`, product `com.drafthouse.buildout.pro`,
  `default` offering → `$rc_lifetime` package (purchase grabs `LIFETIME` first).
  Hooks: `usePaid()`, `usePaidActions()` (`purchase`/`restore`/`isLoading`).
- Ads: AdMob, TBD (stub renders null).

## Tool Roadmap

- **V1 (done):** Paint, Tile, Grout, LVP, Carpet, Stairs, Drywall + full Quote module.
- **V1.1:** Wallpaper calc (pattern repeat) · Underlayment calc (pairs w/ LVP+carpet) ·
  deep link Calculate → Quote ("Add to Quote" pre-fills line item).
- **Future:** electrical/plumbing/structural as separate apps. Hard cap Buildout at 8
  calculators; keep it surface/flooring/finish only.

## Calculator Math

**Paint**
```
Wall area (full room) = 2×(L+W)×H
Wall area (manual)    = Σ(w×h) per wall − openings
Ceiling area          = L×W (optional)
Gallons               = (area × coats) / coverage
Coverage              = smooth 400 / semi-rough 350 / textured 300 sqft/gal
Shopping list         = floor(gallons) gal + ceil(remainder × 4) qt
Deductions            = door 20 sqft, window 15 sqft each (or custom w×h)
```
**Tile**
```
Room area = L×W ; Tile area = (tw×th)/144
Tiles     = ceil(room/tile) ; With waste = ceil(tiles × 1.10)
Boxes     = ceil(tilesWithWaste / perBox)
```
**LVP**
```
Area = L×W ; With waste = area × 1.10
Boxes = ceil(areaWithWaste / sqftPerBox) ; Cost = boxes × pricePerBox (opt)
```
**Carpet** (sold in sq yards; show both sqft and sqyd)
```
sqyd = (L×W)/9 ; With waste = sqyd × 1.10 ; Cost = sqyd × pricePerYd (opt)
```
**Staircase**
```
Tread area = (treadDepth/12)×(width/12)×stairs
Riser area = (riserHt/12)×(width/12)×stairs (if carpeting risers)
Total = tread + riser ; With waste = total × 1.15
```
**Grout** (k=18 so 12×12 tile + 1/8" joint ≈ 0.375 lbs/sqft)
```
factor = ((tw+th)/(tw×th)) × jointWidth × 18
Lbs   = ceil(area × factor × 1.10) ; Bags = ceil(lbs / bagWeight)  // 25lb default
```
**Drywall**
```
Wall area = 2×(L+W)×H − doors×20 − windows×15
Sheets    = ceil(wallArea × 1.10 / 32)        // 4×8 sheet = 32 sqft
Compound  = ceil(wallArea/500) buckets ; Tape = ceil(/500) rolls ; Screws = ceil(/500) lbs
```

## Navigation (App.tsx)

2-tab bottom nav, **default tab = Quote**. Calculate tab = single `CalculatorScreen`
rendering the active tool via `ToolSwitcherSheet` (no top-tabs dep; `ToolName` →
`Record<ToolName, ComponentType>`). Quote tab = native stack hosting the Workspace.

```
RootStack
├── Main (tabs)
│   ├── Calculate → Calculator (hosts 7 tools)
│   └── Quote (stack)
│       ├── Workspace (TopBar + fixed SectionNav + 4 section bodies)
│       ├── ClientDetail · InvoiceDetail · QuoteForm (create+edit)
│       ├── NewInvoice · AddClient · PDFPreview (quotes + invoices)
└── Settings (modal)
```
- Workspace holds active section in local state (instant swap). Cross-section jumps:
  `navigation.navigate('Workspace', { section })`. Convert-to-invoice is a `ConvertSheet`
  modal, not a route.
- `navigationRef.ts` = global nav ref (calc screens open Settings without prop drilling).
- Onboarding rendered outside nav tree until `buildout.hasOnboarded` set.

## Quoting Module (data model — `types.ts`)

All local (AsyncStorage). Quotes reference a `Client` by id + store a `total` snapshot;
invoices link back via `quoteId`. Invoice `overdue` is **derived** (`pending && dueAt < now`
via `invoiceView()`), never stored.

```typescript
Client  { id; name; phone; email; initials }            // initials derived at create
Quote   { id; number; clientId|null; job; lineItems; taxRate; total;
          status: 'draft'|'sent'|'approved'; createdAt; updatedAt }
Invoice { id; number; clientId|null; quoteId?; job; amount; lineItems; taxRate;
          status: 'pending'|'paid'; dueAt; paidAt?; createdAt }
LineItem{ id; description; quantity; unitPrice; source? }  // source = originating calc
```
- **Math:** lineTotal = qty×price ; subtotal = Σ ; tax = subtotal×(rate/100) ; grand = subtotal+tax.
- **Conversion:** `convertQuoteToInvoice(quoteId,{termDays,deposit})` — only when
  `status==='approved'` and not yet invoiced. 50% deposit → one `50% deposit — <job>
  (quote #n)` line.
- **PDF:** `expo-print` HTML→PDF (contractor name, client, job, line items, totals, date);
  auto share sheet; paywalled.
- **Migration:** legacy quotes (`clientName`/`jobDescription`, status `draft|sent`)
  auto-migrate on first load, gated by `buildout.schemaVersion`.
- **Storage keys:** `buildout.{clients,quotes,invoices,schemaVersion,hasOnboarded}`.

## Design Language (do not deviate per screen — tokens in `theme.ts` as `C`)

| Token | Value | | Token | Value |
|---|---|---|---|---|
| Background | `#0f0f0f` | | Text | `#f0ede8` |
| Surface | `#1a1a1a` | | Text dim | `#555` |
| Border | `#2e2e2e` | | Text mid | `#888` |
| Accent | `#f5c842` | | Red (destructive) | `#e05c3a` |

Max width 430px (mobile-first).

**Fonts:** Bebas Neue (display headings, large result numbers) · IBM Plex Sans (body,
labels, buttons) · IBM Plex Mono (numeric inputs + unit labels).

**Components (use the shared ones, don't reinvent):** `TopBar` (52px header: yellow
tracked tag, back chevron, action icons, UPGRADE pill) · `SectionLabel` (uppercase
yellow ~9.6px) · `SegControl` · `InputBlock` (yellow border on focus) · `ResultCard`
(yellow bg, Bebas number) · `ShoppingList` · `ToggleChip`.

**Screen UX (all 7 calculators):** ① `<TopBar tag="TOOL" />` ② numbered input
sections (01, 02…) w/ `SectionLabel` ③ `ResultCard` + `ShoppingList` only when inputs
valid (no zero/empty) ④ pro-tip bar ⑤ no-result state = emoji + instructional text.

## Tech Stack

React 19.2 / RN 0.83.4 / Expo ~55.0.15 / TS ~5.9.2. Key deps: expo-google-fonts
(bebas-neue, ibm-plex-sans, ibm-plex-mono), @react-navigation (bottom-tabs,
native-stack), async-storage, expo-print, expo-sharing, react-native-purchases,
jest/jest-expo/@testing-library/react-native. To add: `react-native-google-mobile-ads`.
State = plain `useState` (no Redux/Zustand).

> **Always `npx expo install <pkg>`, never `npm install`, for Expo packages** —
> npm grabs latest (newer SDK) → "Cannot find native module" at runtime.

## File Structure

```
App.tsx · navigationRef.ts · index.ts · theme.ts · styles.ts · types.ts
eas.json · app.json (bundle: com.drafthouse.buildout)
context/    PaidContext · WorkspaceContext(+test) · ToastContext
screens/    CalculatorScreen · {Paint,Tile,Grout,LVP,Carpet,Stairs,Drywall}Screen
            WorkspaceScreen · sections/{Dashboard,Quotes,Invoices,Clients}Section
            ClientDetail · InvoiceDetail · QuoteForm · NewInvoice · AddClient
            PDFPreview · Settings · Onboarding
components/ TopBar · SectionLabel · SegControl · SectionNav · InputBlock · ToggleChip
            WallCard · ResultCard · ShoppingList · AddToQuoteCTA · LineItem{Sheet,Editor}
            PaywallSheet · ConvertSheet · StatusPill · Avatar · HeroCard · StatCard
            QuickCreateCard · ActivityRow · QuoteCard · Invoice{Card,Bucket}
            Client{Card,Select} · ToolSwitcherSheet
utils/      calculator(+test) · format · workspace(+test) · uuid
ads/        AdBanner (stub)
assets/     icon.png (MUST be 1024×1024) · adaptive-icon · splash-icon · favicon
design-system/  brand/tokens/component-HTML/mobile-UI-kit reference (README, SKILL.md)
```

## App Store

App "Buildout" · bundle `com.drafthouse.buildout` · Utilities · Free + $2.99 IAP ·
zero data collected (all local). Apple Dev account active (Manuel Villalobos | 1415684764).

**Submit:** `eas login` → `eas build --platform ios --profile production` → create app
record → upload metadata + 2–5 screenshots (≥3 tools + quote screen) → `eas submit
--platform ios` → review 24–48h.

## Commands

```bash
npx expo start --ios     # iOS Simulator
npx expo run:ios         # native rebuild (after asset/config changes)
npx expo export          # verify bundle compiles
npm test                 # Jest
eas build --platform ios --profile production
```
