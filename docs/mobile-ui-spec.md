# Mobile UI Restyle — Stepwise Spec

## Context
Move Enduro Time Card from a desktop-web UI to a mobile-first UI (Capacitor iOS/Android + PWA + Pages, one codebase). Phones are 95% of use; tablets must work. Use happens after the race: clean, dry hands, often outdoors.

The work is split into small steps. Each step builds on the previous one and ends with a verification. Don't start a step until the previous one is verified.

## Decisions (settled)
- **Stack**: Tailwind 4 + Capacitor only.
- **Plugins**: Capacitor-owned plugins, plus an exception for `timecard-scanner`.
- **Design**: one design, with platform-specific behaviors.
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
- Remove `maximum-scale=1`. Decide whether to define breakpoints in px (rem breakpoints shift when the root scales).
- Audit and replace arbitrary px values.

**Verify:** large-text screenshots; a TK row fits at 375pt at the cap.

### 3. Safe areas, status bar, splash
- Safe areas on all edges, extending `SafeAreaTop.svelte` into a general approach. Android 15 edge-to-edge.
- `@capacitor/status-bar` follows the theme; `@capacitor/splash-screen` light and dark, with no white flash.

**Verify:** screenshots on a notched iPhone, the iPhone SE and Android API 35, in both themes.

### 4. Touch polish
- Replace `hover:` (5 files) with active states; use `:focus-visible`.
- Remove the tap highlight, long-press callout, text selection on chrome, overscroll on fixed chrome and double-tap zoom.
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
- `@capacitor/keyboard`: resize mode, focused row scrolled into view, footer behavior while the keyboard is up, accessory bar decision.

**Verify:** keyboard-up screenshots on the SE and Android; entering a full TK card stays usable.

### 9. Haptics
- `@capacitor/haptics` on Save and on checkpoint type change. No-op on the web.

**Verify:** on device.

### 10. Screen restyle, one screen at a time
Each is its own sub-step, verified with screenshots before moving on:
- 10a. Home
- 10b. Edit header and footers
- 10c. Time-keeper edit
- 10d. Sprint edit

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
