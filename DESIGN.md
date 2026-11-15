# DESIGN.md

Rules for the mobile UI. Values (colors, sizes, radii) live in `src/app.css` and are never repeated here; this file names tokens and states when to use them. Background and plan: `docs/mobile-ui-spec.md`.

## Principles
- Phones first (95% of use); tablets must work and render fine.
- One design on every platform. Platform differences are *behaviors* (back button, sheets, haptics, status bar), not looks.
- Capacitor-owned plugins only, plus our own `timecard-scanner`. No UI frameworks (Ionic, Konsta, etc.).
- Used after the race, outdoors, one hand, clean dry hands.

## Color and theme
- Follow the system light/dark setting. There is no in-app theme override.
- Colors come from the tokens in `src/app.css` (`background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `muted-foreground`, `accent`, `border`, `ring`, each with a `-foreground` pair where one exists). Use the Tailwind utilities generated from them (`bg-card`, `text-muted-foreground`, …).
- Do not hard-code hex values or Tailwind palette colors (`bg-white`, `text-gray-500`) in components. A hard-coded color will not flip in dark mode. Existing ones are removed as each screen is restyled (spec step 10).
- Scanned time-card photos are shown as-is in both themes.
- `index.html` carries one `theme-color` meta per scheme; keep them in step with the `background` token.

## Fonts
- Bundled locally in `src/assets/fonts` (latin subset, variable woff2, SIL OFL; licenses alongside). Never load fonts from a CDN: the app must work offline.
- Nunito: headings (`h1`–`h3`, `.font-display`). Inter: body text and inputs. JetBrains Mono: scores and badges (`.mono`).
- New font files must be added to the PWA precache (`woff2` is already in `workbox.globPatterns`).

## Numbers
- Times and scores must not shift width as digits change. Inter's digits are proportional by default, so `tabular-nums` is applied on `body` and form controls. Nunito and JetBrains Mono digits are already fixed-width.
- Do not change the `inputmode` logic in `NumberInput.svelte`; it is tuned for iOS and Android.

## PWA compatibility
The GitHub Pages PWA and plain browser stay fully functional as long as possible; native is not allowed to break them.
- Every native-only feature (haptics, status bar, keyboard, splash, orientation lock, native dialogs/sheets, share, browser) goes through a small adapter that switches on `getRunMode()` in `src/platform.ts`. Callers never import a Capacitor plugin directly.
- Each adapter has a web fallback or is a silent no-op. Never throw, and never show a UI that only makes sense natively.
- Do not use `@ionic/pwa-elements` (the Capacitor web fallback for action sheets and camera); it is an Ionic dependency. The web fallback is our own Tailwind sheet.
- CSS and layout must work in a phone browser in landscape, since only native can lock orientation.
- Keep the web build's assets in the service-worker precache (see `workbox.globPatterns` in `vite.config.js`).
- Verify every step on the web build (`npm run test:e2e`, `npm run test:screenshots`) as well as on devices.

## Sections added by later steps
Text scaling (2), safe areas and status bar (3), touch targets and press states (4), tablet layout (5), navigation and back (6), sheets vs native dialogs (7), keyboard (8), haptics (9), accessibility and sunlight contrast (11).
