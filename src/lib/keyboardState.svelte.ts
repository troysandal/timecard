// Is the on-screen keyboard up? Lets screens give up space (score footers, detail
// panels) while someone types, so the rows being edited stay visible.
// See DESIGN.md "Zoom, keyboard and full-screen height".
//
// There is no keyboard event that works everywhere (the web and PWA have none), but the
// effect is the same on every platform: the visible viewport gets much shorter. iOS
// (Capacitor Keyboard plugin, native resize) and Android (SystemBars insets) shrink the
// web view; browsers shrink visualViewport. So: the keyboard is "open" when an editable
// element has focus and the visible height is at least KEYBOARD_MIN_SHRINK below the
// tallest height seen at this width. The iOS accessory bar alone (about 44px, shown with a
// hardware keyboard) stays below the threshold on purpose: it is not worth collapsing UI.

/** Smaller than any real on-screen keyboard (shortest number pad is about 216px). */
export const KEYBOARD_MIN_SHRINK = 150

export const keyboardState = $state({ open: false })

/** Fired when the native keyboard height changes, so layout can follow immediately. */
export const KEYBOARD_EVENT = 'app:keyboard'

let baseline = 0
let baselineWidth = 0
// Exact keyboard height from the Capacitor Keyboard plugin (iOS). null until it reports.
// The plugin reports when the keyboard starts to appear, about 470ms before the web view's
// resize event arrives (measured on an iPhone SE simulator), so on iOS it is the source of
// truth and the viewport-shrink heuristic below is only the fallback (web, PWA).
let nativeHeight: number | null = null

/** Tallest visible height seen at the current width: the screen with no keyboard. */
export function getFullHeight(): number {
  return baseline
}

export function getNativeKeyboardHeight(): number | null {
  return nativeHeight
}

export function setNativeKeyboardHeight(height: number): void {
  nativeHeight = height
  updateKeyboardState()
  window.dispatchEvent(new Event(KEYBOARD_EVENT))
}

function visibleHeight(): number {
  const vv = window.visualViewport
  // Multiply by scale so a pinch zoom (web, PWA) doesn't look like a keyboard.
  return vv ? vv.height * vv.scale : window.innerHeight
}

function editableFocused(): boolean {
  const el = document.activeElement
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement ||
    // Boolean() because jsdom doesn't implement isContentEditable (undefined there).
    (el instanceof HTMLElement && Boolean(el.isContentEditable))
  )
}

export function updateKeyboardState(): void {
  const height = visibleHeight()
  // New width means a rotation or window resize: start the baseline over.
  if (window.innerWidth !== baselineWidth) {
    baselineWidth = window.innerWidth
    baseline = 0
  }
  baseline = Math.max(baseline, height)
  const covered = nativeHeight ?? baseline - height
  keyboardState.open = covered >= KEYBOARD_MIN_SHRINK && editableFocused()
}

export function installKeyboardState(): void {
  updateKeyboardState()
  window.visualViewport?.addEventListener('resize', updateKeyboardState)
  window.addEventListener('resize', updateKeyboardState)
  // activeElement is not settled until after the focus events finish.
  const later = () => setTimeout(updateKeyboardState, 0)
  document.addEventListener('focusin', later)
  document.addEventListener('focusout', later)
}

/** Test hook: forget the remembered full-screen height. */
export function resetKeyboardBaseline(): void {
  baseline = 0
  baselineWidth = 0
  nativeHeight = null
  keyboardState.open = false
}
