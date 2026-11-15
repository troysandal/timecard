// Keeps --app-height equal to the *visible* viewport height.
//
// On iOS the on-screen keyboard (and its accessory bar) shrinks the visual viewport
// but not the layout viewport, so a page sized with 100vh/100dvh becomes taller than
// what is visible and the whole page can be dragged. Sizing full-screen layouts with
// var(--app-height) (see .h-app in app.css) keeps them exactly as tall as the visible
// area. Where visualViewport is missing, or nothing shrinks it, this equals innerHeight.
//
// Pinch zoom (web and PWA stay zoomable) also shrinks visualViewport.height, to
// innerHeight / scale. Multiplying by the scale undoes that, so zooming never shrinks
// the layout; only the keyboard does.

import { KEYBOARD_EVENT, getFullHeight, getNativeKeyboardHeight } from './keyboardState.svelte'

export function installViewportHeight(): void {
  const root = document.documentElement
  const apply = (height: number) => root.style.setProperty('--app-height', `${Math.round(height)}px`)
  const measured = () => {
    const vv = window.visualViewport
    return vv ? vv.height * vv.scale : window.innerHeight
  }

  // What the browser reports (web, PWA, and the final word on iOS).
  const onResize = () => apply(measured())
  // iOS: the keyboard plugin reports early, with an exact height. Lay out for it right away
  // instead of waiting for the resize event that follows ~470ms later and moves the rows twice.
  const onKeyboard = () => {
    const native = getNativeKeyboardHeight()
    const full = getFullHeight()
    apply(native === null || full <= 0 ? measured() : full - native)
  }

  onResize()
  window.visualViewport?.addEventListener('resize', onResize)
  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)
  window.addEventListener(KEYBOARD_EVENT, onKeyboard)
}
