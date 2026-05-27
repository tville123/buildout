# Buildout — Mobile App UI Kit

A high-fidelity React (web) recreation of the iOS Buildout app. Every token,
component, and screen layout maps 1:1 to the production codebase
([`tville123/buildout`](https://github.com/tville123/buildout)).

## Files

| File | Role |
| --- | --- |
| `index.html` | Interactive click-thru — open this. Switches between Paint, Tile, Drywall via the bottom tab bar. |
| `buildout-tokens.css` | Web equivalent of `styles.ts`. Every class is named `bo-*`. |
| `Primitives.jsx` | `SectionLabel`, `SegControl`, `InputBlock`, `ToggleChip`, `ResultCard`, `ShoppingList`, `TipBar`, `EmptyState`, `ScreenHeader`, `TabBar` |
| `PaintScreen.jsx` | Full-room paint calculator with door/window/ceiling toggles |
| `TileScreen.jsx` | Tile calculator with 10% waste built in |
| `DrywallScreen.jsx` | Drywall sheet + compound + tape + screw calculator |
| `ios-frame.jsx` | iOS 26 device bezel (status bar, dynamic island, home indicator) |

## Coverage

- ✅ Paint · Tile · Drywall — fully interactive
- 🔲 Grout · LVP · Carpet · Stairs — show a placeholder "Coming soon" screen
  with the same header pattern. The math is in
  [`utils/calculator.ts`](https://github.com/tville123/buildout/blob/main/utils/calculator.ts)
  and the screens follow the exact same skeleton; adding them is mostly
  copy-paste from `TileScreen.jsx` with different inputs.

## Why not all seven?

Three calculators cover **every component state** the system uses:
- Paint = `SegControl` (2-up + 3-up) + `ToggleChip` + every input mode + multi-row `ShoppingList`
- Tile = the simple "two-grid → result" pattern
- Drywall = the multi-row shopping list with `4` rows + 3-up dimension grid

Adding Grout/LVP/Carpet/Stairs introduces no new visual concepts — they are
permutations of these three.
