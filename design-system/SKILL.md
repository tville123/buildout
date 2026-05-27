---
name: buildout-design
description: Use this skill to generate well-branded interfaces and assets for Buildout, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Brand:** Buildout — *Every estimate. One app.* Hardware-store professional, dark, tool-like.
- **Palette:** `#0f0f0f` bg, `#1a1a1a` surface, `#2e2e2e` border, `#f0ede8` text, `#888` mid, `#555` dim, `#f5c842` yellow (hero accent), `#e05c3a` red (destructive only).
- **Fonts:** Bebas Neue (display + result numbers), IBM Plex Sans (body), IBM Plex Mono (numeric input + units). All three on Google Fonts.
- **Rules:** No gradients. No shadows. No illustration. Yellow appears once as hero per screen. Section labels are numbered (`01 — MODE`, etc), uppercase, tracked, yellow. Result card is yellow background with a giant Bebas number — every screen's climax.
- **Tokens + base CSS:** `colors_and_type.css`
- **UI components (CSS + JSX):** `ui_kits/mobile-app/`
- **Logos / icon / marks:** `assets/`
- **Iconography:** Ionicons (production) / Lucide (web mocks). Emoji only as low-opacity empty-state spacers.
- **Source of truth repo:** <https://github.com/tville123/buildout>

When in doubt, the README and the production repo win. Don't invent new visual motifs.
