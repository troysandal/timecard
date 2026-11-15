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

## Text scaling
- The UI respects the OS text size, clamped to 85–130% (`MIN_TEXT_SCALE` / `MAX_TEXT_SCALE` in `src/lib/textScale.ts`; Android mirrors them in `MainActivity.java`; keep all three in sync). Changing the clamp is one edit in each place.
- Size everything in `rem` (Tailwind's scale does this). Do not use px for text, widths or heights that should grow with text. Fixed px is fine for hairlines and borders.
- Never put a `min-w-*` in rem on a container that must fit a phone; it grows with the text and forces horizontal scroll.
- Form controls are never below 16px (`.field` uses `max(16px, 1rem)`), otherwise iOS zooms the page on focus. In narrow table cells add `field-compact` (less side padding, centered). `.field` rules are unlayered, so Tailwind utilities can't override them.
- Layouts must fit a 375pt-wide phone at the maximum scale. `cypress/e2e/textScale.cy.ts` enforces this for the time-keeper table; add a case when adding a dense screen.
- Media-query breakpoints do not move with the root font size, so no px breakpoints are needed.
- Known limit: the clamp is not applied in Android Chrome or an installed Android PWA. Chrome applies the system font scale itself and a page can't read or cap it, so a user at the largest Android setting gets text up to 200% there. Layouts should degrade without breaking (scroll rather than overlap), but only the native apps and iOS are capped.
- Changing the system text size recreates the Android activity (`fontScale` is not in the manifest's `configChanges`), which is what re-runs the clamp. Do not add `fontScale` to `configChanges` without also listening for the change.

## Safe areas and system bars
- Never write `env(safe-area-inset-*)` in a component. Use the `--safe-top/right/bottom/left` variables in `src/app.css` or the utilities built on them: `.safe-x` (left/right), `.safe-bottom` (footers that already pad), `.safe-bottom-edge` (screens with no bottom padding of their own), `.safe-top`, and the `SafeAreaTop` spacer. Tests override the variables because Chrome's `env()` is always 0 inside Cypress's iframe.
- Every page shell applies all four edges: `SafeAreaTop` at the top, `.safe-x` on the root, and a bottom inset on whatever sits at the bottom edge. New screens and full-screen overlays must do the same.
- Page heights use `dvh` (`h-dvh`, `min-h-dvh`), not `vh`, so the bottom doesn't hide behind a browser toolbar.
- The web view draws edge to edge under the status bar and home indicator, so the page background token is what shows there. Never hard-code a color for the safe-area band.
- No `@capacitor/status-bar` plugin. Capacitor 8's built-in `SystemBars` plugin handles Android insets and sets the status and gesture bar icon colors from the system theme (default config). iOS follows the system appearance on its own.
- Android shows the theme's `windowBackground` behind the system bars, so `res/values/colors.xml` and `res/values-night/colors.xml` define `appBackground`, and the theme uses it. Keep it equal to the `background` token for each scheme (XML comments can't contain two hyphens in a row).
- Android WebView 140 and newer goes edge to edge and reports real `env()` insets. Older WebViews are padded natively and report 0, and the layout must work in both. The emulator in use has WebView 124, so only the padded mode is checked on it.

## Zoom, keyboard and full-screen height
- Double-tap zoom is off everywhere (`touch-action: manipulation` on `html`). Native builds also lock the zoom with `maximum-scale=1`, added to the viewport meta by the `native-viewport-lock` plugin in `vite.config.js`, so a stray pinch can't zoom a native app. The web build and PWA stay pinch-zoomable for accessibility. Check `dist/index.html` after `build:cap` if you touch the viewport meta.
- Full-screen layouts use `h-app` (height `var(--app-height)`, kept equal to `visualViewport.height` by `src/lib/viewportHeight.ts`), not `h-dvh`. On iOS the keyboard shrinks the visual viewport but not the layout viewport, so a `100dvh` page becomes taller than the screen and can be dragged.
- `@capacitor/keyboard` is installed so iOS resizes the web view itself when the keyboard appears (its default `resize: native`). With that, the layout viewport equals the visible area and the page cannot scroll or pan. Do not set `resize: none`.
- The iOS accessory bar (^ v Done) stays visible: the number pad has no Return key, so Done is how people dismiss it. The plugin hides it by default; `src/lib/keyboard.ts` turns it back on. Android uses Capacitor's SystemBars insets; web and PWA rely on `viewportHeight.ts`.
- To debug viewport or scroll problems on a device, temporarily print `innerHeight`, `visualViewport.height`, `scrollY` and `documentElement.scrollHeight` on screen and capture with `scripts/screenshots.sh`; the simulator can't be dragged from the command line.

## PWA compatibility
The GitHub Pages PWA and plain browser stay fully functional as long as possible; native is not allowed to break them.
- Every native-only feature (haptics, status bar, keyboard, splash, orientation lock, native dialogs/sheets, share, browser) goes through a small adapter that switches on `getRunMode()` in `src/platform.ts`. Callers never import a Capacitor plugin directly.
- Each adapter has a web fallback or is a silent no-op. Never throw, and never show a UI that only makes sense natively.
- Do not use `@ionic/pwa-elements` (the Capacitor web fallback for action sheets and camera); it is an Ionic dependency. The web fallback is our own Tailwind sheet.
- CSS and layout must work in a phone browser in landscape, since only native can lock orientation.
- Keep the web build's assets in the service-worker precache (see `workbox.globPatterns` in `vite.config.js`).
- Verify every step on the web build (`npm run test:e2e`, `npm run test:screenshots`) as well as on devices.

## Sections added by later steps
Splash and launch screens (3b), touch targets and press states (4), tablet layout (5), navigation and back (6), sheets vs native dialogs (7), keyboard (8), haptics (9), accessibility and sunlight contrast (11).
