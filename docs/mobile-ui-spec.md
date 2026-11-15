# Mobile UI Restyle — Stepwise Spec

## Context
Move Enduro Time Card from a desktop-web UI to a mobile-first UI (Capacitor iOS/Android + PWA + Pages, one codebase). Phones are 95% of use; tablets must work. Use happens after the race: clean, dry hands, often outdoors.

The work is split into small steps. Each step builds on the previous one and ends with a verification. Don't start a step until the previous one is verified.

## Decisions (settled)
- **Stack**: Tailwind 4 + Capacitor only.
- **Plugins**: Capacitor-owned plugins, plus an exception for `timecard-scanner`.
- **Design**: one design, with platform-specific behaviors.
- **PWA keeps working** (decided after the initial spec): the GitHub Pages PWA and plain browser stay fully functional as long as possible. Native-only features need a web fallback or must degrade silently, and each step is also verified on the web build. Rules in `DESIGN.md` ("PWA compatibility").
- **Theme**: follow the system; no override. Photos are shown as-is.
- **iOS swipe-back**: off. Every non-root screen has a visible back button.
- **Orientation**: portrait on phones. All orientations on tablets (fall back to `UIRequiresFullScreen` if that's much less work).
- **Tablet layout**: max-width centered column.
- **Text size**: hybrid, capped (we may prototype fully-respect as well).
- **Haptics**: on Save, and when a checkpoint's type changes.
- **Inputs**: don't touch `inputmode` logic in `NumberInput.svelte`.

## Design system: `app.css` + `DESIGN.md`
- **`src/app.css` holds the values.** It already has `@theme inline` tokens (background, foreground, card, primary…). It gains dark values, type, spacing, radii and touch-target sizes. It's the only place values live.
- **`DESIGN.md` (repo root) holds the rules, not the values.** It covers when to use a native dialog vs a bottom sheet, the touch-target minimum, haptics triggers, safe-area usage, the not-color-alone rule, the text-scaling approach, and the font policy. It names token names and never repeats hex values, so it can't drift out of sync. AGENTS.md links to it, so future agents follow it.
- Each step below adds its rules to DESIGN.md as part of being "done."

## Steps

### 0. Screenshot harness
Goal: make every later step visually verifiable.
- Script (in `scripts/`) that builds, syncs and launches on the iOS simulator and Android emulator, then captures PNGs with `xcrun simctl io … screenshot` / `adb exec-out screencap`. It toggles theme (`simctl ui appearance`, `adb cmd uimode night`) and text size (`simctl ui content_size`, `adb settings font_scale`).
- Cypress phone viewports (375×667, 390×844) in light and dark.
- Maestro for navigating flows is postponed to step 12.

**Verify:** the script produces light/dark/large-text PNGs of the Home screen on both platforms, and Claude can read them.

### 1. Foundation: tokens, dark mode, fonts
- Add dark token values under `prefers-color-scheme: dark`; `color-scheme: light dark`; `theme-color` meta per scheme.
- **Bundle Nunito, Inter and JetBrains Mono locally** (they're currently loaded from the Google Fonts CDN, which breaks offline). Check that each has `tnum`, then apply `tabular-nums` to times and scores.
- Create the `DESIGN.md` skeleton and link it from AGENTS.md.

**Verify:** Home + Edit screenshots in light and dark; fonts render in airplane mode; `npm test` passes.

### 2. Text scaling and viewport
- Root `font-size` uses the OS size, clamped to about 85–130% (iOS `-apple-system-body`; Android WebView text zoom).
- Remove `maximum-scale=1`. This brings back iOS auto-zoom on inputs under 16px, so form controls are never below 16px (`.field`).
- Breakpoints need no change: in media queries `rem` is relative to the browser's default size, not the page's root `font-size`, so scaling the root does not shift Tailwind's rem-based breakpoints. (An earlier draft of this spec said otherwise; that was wrong.)
- Audit and replace arbitrary px values.
- Done: `src/lib/textScale.ts` (iOS/iPadOS), `MainActivity.java` (Android), both clamped to 85–130%. Web: no-op on desktop and Android Chrome.

**Verify:** large-text screenshots; a TK row fits at 375pt at the cap (`cypress/e2e/textScale.cy.ts` asserts this at 85/100/130%).

**Known gap, handled in 10c:** the table fits at the cap, but on a 375×667 phone the fixed chrome (header, details, buttons, footer) leaves room for only ~1.5 rows. See 10c.

### 3. Safe areas, status bar, splash
Split in two. Finding: Capacitor 8 has a built-in `SystemBars` plugin, so `@capacitor/status-bar` is not needed (one fewer plugin).

**3a. Safe areas and system bars (done).**
- Safe areas on all four edges through `--safe-*` variables, `SafeAreaTop` using the page background token (it hard-coded a light color, which left a light strip behind the iOS status bar in dark mode), `dvh` heights.
- Android: `windowBackground` per scheme so the area behind the status and gesture bars matches the page; SystemBars sets the icon colors.
- Verified: `cypress/e2e/safeArea.cy.ts` (notch, home indicator, landscape insets, band color in both schemes), and screenshots on iPhone 17, iPhone SE and Android API 35 in both themes.
- Not verified: Android WebView 140+ edge-to-edge (the emulator has 124).

**3b. Splash and launch screens (next).** Launch screen and web view background match the theme with no white or black flash, light and dark. Decide whether `@capacitor/splash-screen` is needed or native launch assets are enough.

**Verify (3b):** launch captures taken immediately after launch, light and dark, on iOS and Android.

### 4. Touch polish
- Replace `hover:` (5 files) with active states; use `:focus-visible`.
- Remove the tap highlight, long-press callout, text selection on chrome and overscroll on fixed chrome. (Double-tap zoom was pulled forward and is done: it regressed when `maximum-scale=1` was removed in step 2. See `DESIGN.md` "Zoom, keyboard and full-screen height".)
- Touch targets ≥44pt/48dp.

**Verify:** Cypress passes; manual tap check on a device.

### 5. Orientation and tablet layout
- Phones locked to portrait (iOS Info.plist; Android at runtime with `@capacitor/screen-orientation` and a smallest-width check).
- Tablets: all orientations, with a max-width column.

**Verify:** iPad portrait, landscape and Split View screenshots; phone rotation stays locked.

### 6. Navigation and back
- A visible back button in a consistent header.
- Android Back closes an open sheet, then hits the `editDirty` guard, then exits on root. Predictive back.
- Push/pop transitions that respect reduced motion.

**Verify:** Cypress navigation specs; Android emulator back tests.

### 7. Sheets and dialogs
- A Tailwind bottom-sheet component; migrate `RacePickerModal` and `PhotoViewerModal` to it.
- `@capacitor/dialog` / `@capacitor/action-sheet` for confirms and simple choices; replace `window.confirm`/`alert`. The web fallback is the Tailwind sheet.

**Verify:** screenshots of each sheet and dialog on both platforms; Back dismisses sheets.

### 8. Keyboard
- Pulled forward and done: `@capacitor/keyboard` installed with the default native resize (fixed the whole page dragging by ~44px when an input was focused on iOS), accessory bar kept visible (the number pad has no Return key), and `--app-height` for web/PWA.
- Still to do: confirm the focused row stays visible with the full number pad (not just the accessory bar), footer behavior while the keyboard is up, Android keyboard behavior.

**Verify:** keyboard-up screenshots on the SE and Android; entering a full TK card stays usable.

### 9. Haptics
- `@capacitor/haptics` on Save and on checkpoint type change. No-op on the web.

**Verify:** on device.

### 10. Screen restyle, one screen at a time
Each is its own sub-step, verified with screenshots before moving on:
- 10a. Home
- 10b. Edit header and footers. The score footers (`TimeKeeperFooter`, `SprintFooter`) must stay tidy at every text scale. Interim fix in step 2: the time-keeper footer labels are shortened to "Emerg" and "DQ" (full words kept for screen readers) and the phone gap is tighter, so all four stats fit one row at 375pt and 130% text, enforced in `textScale.cy.ts`. Revisit here: a layout that never orphans a stat (such as a 2×2 grid) is sturdier than abbreviations. `SprintFooter` is confirmed to wrap "Seconds" onto a second line at the 130% cap on 375pt.
- 10c. Time-keeper edit. At max text scale on 375×667, at least 3 checkpoint rows must be visible (for example the Name/Rider/Format details scroll away with the list, or collapse).
- 10d. Sprint edit. At the 130% cap on 375pt a full row (Time In, Time Out, Score) is about 440px against 371px available, so today the Score column scrolls off to the right (no time splits across lines; asserted in `textScale.cy.ts`). Restyle so the row fits at the cap, e.g. stack Time In above Time Out.

### 11. Field and accessibility pass
- Sunlight contrast (WCAG AA or better) in both themes.
- Invalid/dropped state shown with an icon or text, not color alone.
- VoiceOver/TalkBack labels; reduced motion.

**Verify:** a VoiceOver/TalkBack walkthrough; contrast check of the tokens.

### 12. App Store readiness and full matrix
- `PrivacyInfo.xcprivacy`, usage strings, privacy policy URL.
- `@capacitor/browser` for external links; export/backup via `@capacitor/share`.
- Real empty states; iOS 18 dark/tinted icons.
- Maestro flows run the full matrix: {SE, Pro Max, iPad, small Pixel} × {light, dark} × {default, large text}.

**Verify:** a clean full-matrix run and a TestFlight build.
