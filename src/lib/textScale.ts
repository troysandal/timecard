// Text scaling: respect the OS text size, but clamp it so dense screens (the
// time-keeper rows) stay usable. See DESIGN.md "Text scaling".
//
// - iOS / iPadOS (native app, Safari, installed PWA): the web view does not follow
//   Dynamic Type for ordinary CSS sizes, so we read it from `-apple-system-body`
//   and set the root font size ourselves.
// - Android native: MainActivity.java clamps WebView textZoom with the same bounds.
// - Everything else (desktop browsers, Android Chrome): no-op; the browser
//   handles its own text size.
//
// Everything is sized in rem, so changing the root size scales the whole UI.

/** Clamp bounds as a fraction of the default size. Keep in sync with MainActivity.java. */
export const MIN_TEXT_SCALE = 0.85
export const MAX_TEXT_SCALE = 1.3

const BASE_PX = 16
/** `-apple-system-body` at the default "Large" Dynamic Type setting. */
const IOS_DEFAULT_BODY_PX = 17

export function clampTextScale(scale: number): number {
  return Math.min(MAX_TEXT_SCALE, Math.max(MIN_TEXT_SCALE, scale))
}

/**
 * The OS text scale relative to default, or null where we don't manage it.
 * Mac Safari also supports -apple-system-body (13px there), so require a
 * coarse pointer to limit this to iPhone and iPad.
 */
function osTextScale(): number | null {
  if (!CSS.supports('font', '-apple-system-body')) return null
  if (!window.matchMedia('(pointer: coarse)').matches) return null

  const probe = document.createElement('span')
  probe.style.cssText = 'font:-apple-system-body;position:absolute;visibility:hidden'
  document.body.appendChild(probe)
  const px = parseFloat(getComputedStyle(probe).fontSize)
  probe.remove()
  return px > 0 ? px / IOS_DEFAULT_BODY_PX : null
}

export function applyTextScale(): void {
  const root = document.documentElement
  const scale = osTextScale()
  if (scale === null) {
    root.style.removeProperty('font-size')
    return
  }
  root.style.fontSize = `${BASE_PX * clampTextScale(scale)}px`
}

/** Apply now and again when the app returns to the foreground (the user may have changed the setting). */
export function installTextScale(): void {
  applyTextScale()
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) applyTextScale()
  })
}
