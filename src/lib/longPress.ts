// Svelte action: call `callback` on a long press (touch or mouse) or on the context-menu
// gesture (right click, ContextMenu key, Shift+F10). The click that follows a long press is
// swallowed so the element's normal tap action doesn't also run.
const HOLD_MS = 500
const MOVE_TOLERANCE_PX = 10
// Android Chrome may send `contextmenu` right after our own timer fired; don't open twice.
const DUPLICATE_WINDOW_MS = 1000

export function longPress(node: HTMLElement, callback: () => void) {
  let cb = callback
  let timer: ReturnType<typeof setTimeout> | undefined
  let startX = 0
  let startY = 0
  let swallowClick = false
  let lastFiredAt = -Infinity

  function cancel() {
    clearTimeout(timer)
    timer = undefined
  }

  function fire() {
    cancel()
    lastFiredAt = Date.now()
    cb()
  }

  // Only a held press is followed by a click from the same gesture. A context-menu gesture
  // (right click, Shift+F10) must not arm the swallow, or the next Enter/Space on the row
  // would be eaten.
  function fireFromHold() {
    fire()
    swallowClick = true
  }

  function onPointerDown(event: PointerEvent) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    swallowClick = false
    startX = event.clientX
    startY = event.clientY
    cancel()
    timer = setTimeout(fireFromHold, HOLD_MS)
  }

  function onPointerMove(event: PointerEvent) {
    if (timer === undefined) return
    if (Math.hypot(event.clientX - startX, event.clientY - startY) > MOVE_TOLERANCE_PX) cancel()
  }

  function onContextMenu(event: Event) {
    event.preventDefault()
    if (Date.now() - lastFiredAt < DUPLICATE_WINDOW_MS) return
    swallowClick = false
    fire()
  }

  function onClickCapture(event: Event) {
    if (!swallowClick) return
    swallowClick = false
    event.preventDefault()
    event.stopPropagation()
  }

  node.addEventListener('pointerdown', onPointerDown)
  node.addEventListener('pointermove', onPointerMove)
  node.addEventListener('pointerup', cancel)
  node.addEventListener('pointercancel', cancel)
  node.addEventListener('pointerleave', cancel)
  node.addEventListener('contextmenu', onContextMenu)
  node.addEventListener('click', onClickCapture, true)

  return {
    update(next: () => void) {
      cb = next
    },
    destroy() {
      cancel()
      node.removeEventListener('pointerdown', onPointerDown)
      node.removeEventListener('pointermove', onPointerMove)
      node.removeEventListener('pointerup', cancel)
      node.removeEventListener('pointercancel', cancel)
      node.removeEventListener('pointerleave', cancel)
      node.removeEventListener('contextmenu', onContextMenu)
      node.removeEventListener('click', onClickCapture, true)
    },
  }
}
