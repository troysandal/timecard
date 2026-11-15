// Keeps the focused input visible inside its scrolling list after the layout changes.
//
// The browser scrolls a focused input into view at the moment of focus. With the
// on-screen keyboard the layout then changes (the keyboard shrinks the viewport, the score
// and details collapse), so the list's size and position change and the input the person
// tapped can end up half hidden or off screen. Call this after such a change.
//
// Only the nearest vertically scrolling ancestor is moved (never scrollIntoView, which can
// also scroll overflow-hidden ancestors and push the header away), and only when the input
// is not already fully in view.

function scrollParent(el: HTMLElement): HTMLElement | null {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const overflowY = getComputedStyle(node).overflowY
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
      return node
    }
  }
  return null
}

export function keepFocusedVisible(margin = 8): void {
  const el = document.activeElement
  if (!(el instanceof HTMLElement) || el === document.body) return
  const box = scrollParent(el)
  if (!box) return

  const inner = el.getBoundingClientRect()
  const outer = box.getBoundingClientRect()
  if (inner.top >= outer.top + margin && inner.bottom <= outer.bottom - margin) return

  // Center it, so rows above and below stay visible for context.
  const shift = inner.top + inner.height / 2 - (outer.top + outer.height / 2)
  box.scrollTop += shift
}
