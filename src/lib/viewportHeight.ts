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

export function installViewportHeight(): void {
  const root = document.documentElement
  const update = () => {
    const vv = window.visualViewport
    const height = vv ? vv.height * vv.scale : window.innerHeight
    root.style.setProperty('--app-height', `${Math.round(height)}px`)
  }
  update()
  window.visualViewport?.addEventListener('resize', update)
  window.addEventListener('resize', update)
  window.addEventListener('orientationchange', update)
}
