# Fonts

Buildout uses three Google Fonts families. The native app loads them via
`@expo-google-fonts/*` — see `App.tsx` in the repo. For web mocks and slides,
`colors_and_type.css` pulls the same families from the Google Fonts CDN.

| Family          | Weights used   | Role                                    |
| --------------- | -------------- | --------------------------------------- |
| Bebas Neue      | 400            | Display, screen titles, big result nums |
| IBM Plex Sans   | 300 / 400 / 500| Body, labels, buttons                   |
| IBM Plex Mono   | 400 / 500      | Numeric inputs, unit labels             |

## Substitution flag

> **No local font files are vendored in this folder yet.** The CSS uses Google Fonts
> as the canonical source (identical to what `@expo-google-fonts` ships at runtime).
> If you need an offline / printable build, please drop `.ttf` or `.woff2` files here
> and swap the `@import` at the top of `colors_and_type.css` for local `@font-face`
> declarations. Recommended files:
>
> - `BebasNeue-Regular.ttf`
> - `IBMPlexSans-Light.ttf`, `IBMPlexSans-Regular.ttf`, `IBMPlexSans-Medium.ttf`
> - `IBMPlexMono-Regular.ttf`, `IBMPlexMono-Medium.ttf`
>
> Source: https://fonts.google.com (or the `@expo-google-fonts/*` npm packages,
> which include the `.ttf` files directly under `node_modules/`).
