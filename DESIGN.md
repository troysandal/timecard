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
- Small phones lose most of the screen to the number pad: on an iPhone SE the web view is about 407pt tall with it up (667 minus 260). The Edit screen's fixed blocks (header 61, details 163 for time keeper or 91 for sprint, Add/Reset 69, score 84, plus the 20pt status inset) used to leave 9px for the time keeper list. `src/lib/keyboardState.svelte.ts` exposes `keyboardState.open` (an editable element has focus and the visible height is 150px or more below the tallest seen at this width; the 44px accessory bar alone doesn't count). `EditPage` uses it: score footer hidden while the keyboard is open; details panel also hidden while the focus is in the list, never while it is in the panel itself (Name, Rider Minute and Format live there). Both are hidden with CSS, not removed. Applies to both time keeper and sprint (measured at 375×407: sprint 1.5 rows before, 5.9 after).
- Opening a race auto-focuses the last row's first input (existing behavior), so on a phone the keyboard comes up as soon as Edit opens, and the collapse applies immediately.
- No visible delay on iOS: the web view's resize event arrives about 470ms after the keyboard starts to appear, and waiting for it moved the rows twice (measured on the SE simulator: keyboard event at +147ms, rows jumping at +248ms and +613ms). So on iOS the plugin's `keyboardWillShow`/`keyboardWillHide` (exact height, sent as the keyboard starts) drive both `keyboardState.open` and `--app-height` (`src/lib/keyboard.ts` forwards them; `viewportHeight.ts` lays out for `full height - keyboard height` at once). Now one jump about 100ms after the keyboard starts, and the late resize event changes nothing. The viewport-shrink heuristic remains the source on the web and PWA, and the final word whenever the browser reports a size. Android is not covered: it still follows the resize event, and its timing hasn't been measured.
- The tapped input must stay in view. The browser scrolls a focused input into view at focus time, under the old layout; then the keyboard arrives and the list changes size and position, which used to leave the input out of view (an iPhone 17 time keeper with 11 rows, tapping row 8). `EditPage` calls `keepFocusedVisible()` (`src/lib/keepFocusedVisible.ts`) after `keyboardState.open` changes and on each resize while the keyboard is up. It centers the input in each scrolling ancestor, innermost first, only when it is not fully in view there: usually just the list, but on a short sideways screen the page scrolls as well, and the list can sit partly below the fold. It never uses `scrollIntoView`, which also scrolls `overflow-hidden` ancestors and pushes the header away. `keyboard.cy.ts` covers it at iPhone 17 size for both screens.
- To measure timing on a device, log `performance.now()` at `focusin`, the plugin events, `resize` and the first row's `getBoundingClientRect().top` into an on-screen overlay and capture with `scripts/screenshots.sh`.
- Test the keyboard by resizing the viewport (`cy.viewport(375, 407)`), as the OS does; wait for `--app-height` to update before measuring (`cypress/e2e/keyboard.cy.ts`). On the simulator, the number pad only shows with Connect Hardware Keyboard off (⌘K).
- To debug viewport or scroll problems on a device, temporarily print `innerHeight`, `visualViewport.height`, `scrollY` and `documentElement.scrollHeight` on screen and capture with `scripts/screenshots.sh`; the simulator can't be dragged from the command line.

## Sheets and dialogs
- Never call `window.confirm`, `alert` or `prompt`. Use `confirmDialog` and `alertDialog` from `src/lib/dialogs.svelte.ts`. On iOS and Android they show the system dialog (`@capacitor/dialog`), which looks and behaves like every other app's. On the web and PWA they show our sheet (`ConfirmHost.svelte`, mounted once in `App.svelte`). If the native call fails they fall back to the sheet, so a dialog always appears. They are answered one at a time: a second request waits.
- Give every dialog a title and specific button labels (Delete, Discard, Reset, with Cancel or Keep editing), and set `destructive: true` for anything irreversible: the confirm button turns red and, on the web, Cancel is focused first.
- Everything else that overlays the page uses `Sheet.svelte`: a bottom sheet on phones, a centered 28rem dialog from `md` up. Mounted means open, so render it inside `{#if}`. It sets `role="dialog"` and `aria-modal`, moves focus in (the `data-autofocus` element, else the first control), keeps Tab inside, restores focus on close, closes on Escape and on a tap outside, stops the page scrolling behind it (`html.sheet-open`), and skips its animation when the OS asks for reduced motion. Use `size="full"` and `tone="dark"` for content that wants the screen, like the photo.
- The padding for the home indicator belongs on the sheet panel (`pb-[var(--safe-bottom)]`), never on a button inside it: a button with that padding makes its tappable box reach into the indicator zone.
- Android Back (`lib/backButton.ts`): an open sheet closes first (newest first), then Back goes through history so the unsaved-changes guard runs, then the app exits from the first screen. Sheets register with `lib/sheets.ts` to take part. A native system dialog handles Back itself: dismissing it counts as Cancel. Web browser Back does not close a web sheet: sheets add no history entries, because a pushed entry fights the guard in `App.svelte`'s popstate handler. Escape, a tap outside and the buttons close it. `App.svelte` handles popstate events strictly one at a time (a promise queue), because the discard dialog is asynchronous: a forward navigation while it is open must wait for the answer, or "Discard" would blank an Edit page the URL says is showing.
- `@capacitor/action-sheet` is not installed: the only simple choice, the race-type picker, is a Tailwind sheet, as the spec says. Add the plugin only for a genuine native action list.
- Testing: the web dialog is a real sheet, so tests read and press it (`expectConfirm`, `answerConfirm`, `expectNoConfirm` in `cypress/e2e/app_util.ts`). Do not stub `window.confirm`: nothing calls it. Cypress can't see native dialogs; verify those by building with a temporary auto-click (as done for step 7) and capturing screenshots. Chrome's reduced-motion emulation does not reach the app frame under Cypress, so `sheet.cy.ts` checks the stylesheet instead.

## Navigation
- Two screens: Home (root, no Back) and Edit (Back on the left of the header). Navigation goes through history, so browser Back, Android Back and the in-app Back share one popstate handler and one unsaved-changes guard.
- Wrap every Home <-> Edit change in `transitionPage('push' | 'pop', update)` from `lib/pageTransition.ts`. It uses the View Transitions API and runs `update` at once where that is missing or the OS asks for reduced motion. Never depend on the transition running. Skip it on first load and deep links.
- The slide CSS lives in `@layer components` in `src/app.css` and is keyed on `data-nav` on `<html>`. It turns off under `prefers-reduced-motion`.

## Orientation and tablets
- Native phones are portrait-only. iPhone: `UISupportedInterfaceOrientations` in `ios/App/App/Info.plist` lists only portrait. Android: `MainActivity` calls `setRequestedOrientation(SCREEN_ORIENTATION_PORTRAIT)` before `super.onCreate` when the smallest width is under 600dp (the standard tablet breakpoint). No `@capacitor/screen-orientation` plugin is needed. Do not put `android:screenOrientation` in the manifest: it would lock tablets too. The lock is re-applied in `onConfigurationChanged`, because the manifest's `configChanges` stops Android recreating the activity: a foldable that is unfolded, or a window resized across 600dp, switches between locked and free while the app runs (checked on the emulator with `wm size`/`wm density` changes and no relaunch). On Android 16 and later the system ignores orientation locks on screens of 600dp and wider anyway, which agrees with this rule.
- Tablets rotate freely. iPad lists all four orientations and does not set `UIRequiresFullScreen`, which is what keeps Split View and Slide Over available. `test/specs/test.orientation.ts` pins all of this.
- Layout: a centered column no wider than `max-w-2xl` (672px) at any width; narrow Split View widths simply get the phone layout. `cypress/e2e/orientation.cy.ts` checks iPad portrait and landscape, iPad mini, and one-third and half Split View for overflow, centering and clipping.
- The web build and PWA can't lock orientation, so a phone held sideways must work. The `short:` variant (`app.css`) means under 500px tall AND at least 3:2 wide: a phone held sideways, but also any short, wide window (a small desktop browser window, a short iPad window). On such a screen the Edit page scrolls and the list gets a fixed 18rem, instead of the header, details and score squeezing the list to nothing. The aspect-ratio test is essential: a portrait phone with the keyboard up is also under 500px tall (375x407 on an SE with the number pad) and must keep the portrait layout.
- Orientation can't be driven on the headless simulators here (no rotate command), so native rotation is verified from the shipped config: the built app's plist, and `requestedOrientation` from `dumpsys` on Android. To check Android's tablet path, make the emulator report a tablet (`adb shell wm size 1600x2560` and `wm density 320`, giving 800dp), and undo it with `wm size reset` and `wm density reset`.
- A freshly booted iPad simulator can take 30 seconds or more to show the app on first launch. Wait before concluding it is stuck.

## CSS layering
Tailwind 4 puts its utilities in `@layer utilities`, and unlayered CSS beats every layered rule regardless of specificity. So a plain rule in `app.css` silently overrides utility classes (it once flattened the Save button's `transition-all` and stacked with `active:scale-95`).
- New global styles go inside a layer: `@layer base { ... }` for element defaults and app-wide behavior, `@layer components { ... }` for reusable classes. Then any utility class on an element still wins, which is what people expect when they write one.
- Write unlayered CSS only when a rule must beat utilities, say why in a comment, and add it to the list below.
- Prefer the property Tailwind uses (`scale`, `translate`, `rotate`) over `transform`, so a utility replaces your rule instead of stacking with it.
- Existing deliberate exceptions (unlayered, so utilities can't change them): `.field`, `.field-compact`, `.field:disabled`, `.safe-*`, `.h-app`, and the `html`/`body`/`input`/heading base rules. Leave them; don't copy the pattern.

## Touch
- Every tappable element is at least `--touch-target` (44px, in `rem`, so it scales with text) in each direction. Size things with the `min-h-touch`, `min-w-touch` and `size-touch` utilities (they read the token), never a hard-coded `min-h-11`. Make a small thing bigger with padding or a wrapping `label`, not by changing how it looks (the drop checkbox is a 20px box inside a 44px label). `.field` has `min-height: var(--touch-target)`; disabled `.field`s only display a value and are exempt. `cypress/e2e/touch.cy.ts` measures every screen; add new screens to it.
- Known exceptions, until the new time picker replaces them: the six Sprint hh/mm/ss fields (44 tall, about 36 wide, six per row on a 375pt phone) and the Sprint delete button.
- Pressed feedback is global (`button:not(:disabled):active`, checkbox labels): a button needs no `active:` class. The rule lives in `@layer base` and uses the `scale` property, so utility classes (`transition-colors`, `active:scale-95`) still win and never stack with it. Keep global styles for controls in that layer: an unlayered rule beats every Tailwind utility. Don't add feedback that only exists on hover; Tailwind 4 gates `hover:` behind `@media (hover: hover)`, so it never fires on a phone. Hover is a desktop and PWA extra.
- Keyboard focus ring comes from `:focus-visible` (buttons, selects, checkboxes), so a tap leaves no ring. Text fields keep `.field:focus`.
- Touch screens (`@media (pointer: coarse)`): no text selection and no long-press callout on the app chrome. Inputs, textareas and selects stay selectable: iOS can't focus or edit a field inside a `user-select: none` ancestor without it. Desktop keeps selection.
- `-webkit-tap-highlight-color` is transparent everywhere; `overscroll-behavior: none` on the page (no pull-to-refresh or scroll chaining) and `overscroll-contain` on scrolling lists.
- Chrome drops iOS-only properties (`-webkit-touch-callout`) when parsing CSS, so tests can't see them in the CSSOM; `touch.cy.ts` checks that one in the source file.

## PWA compatibility
The GitHub Pages PWA and plain browser stay fully functional as long as possible; native is not allowed to break them.
- Every native-only feature (haptics, status bar, keyboard, splash, orientation lock, native dialogs/sheets, share, browser) goes through a small adapter that switches on `getRunMode()` in `src/platform.ts`. Callers never import a Capacitor plugin directly.
- Each adapter has a web fallback or is a silent no-op. Never throw, and never show a UI that only makes sense natively.
- Do not use `@ionic/pwa-elements` (the Capacitor web fallback for action sheets and camera); it is an Ionic dependency. The web fallback is our own Tailwind sheet.
- CSS and layout must work in a phone browser in landscape, since only native can lock orientation.
- Keep the web build's assets in the service-worker precache (see `workbox.globPatterns` in `vite.config.js`).
- Verify every step on the web build (`npm run test:e2e`, `npm run test:screenshots`) as well as on devices.

## Sections added by later steps
navigation and back (6), sheets vs native dialogs (7), keyboard (8), haptics (9), accessibility and sunlight contrast (11).
