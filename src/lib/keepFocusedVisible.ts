// Keeps the focused input visible inside its scrolling list after the layout changes.
//
// The browser scrolls a focused input into view at the moment of focus. With the
// on-screen keyboard the layout then changes (the keyboard shrinks the viewport, the score
// and details collapse), so the list's size and position change and the input the person
// tapped can end up half hidden or off screen. Call this after such a change.
//
// Every vertically scrolling ancestor is adjusted, innermost first (never scrollIntoView, which
// also scrolls overflow-hidden ancestors and pushes the header away). A box only moves when the
// input is not already fully in view inside it. Usually that is the list alone; on a short
// screen (a phone held sideways on the web) the page scrolls too, and the list can sit partly
// below the fold, so the page has to move as well.

function scrollParents(el: HTMLElement): HTMLElement[] {
  const boxes: HTMLElement[] = []
  for (let node = el.parentElement; node; node = node.parentElement) {
    const overflowY = getComputedStyle(node).overflowY
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
      boxes.push(node)
    }
  }
  return boxes
}

export function keepFocusedVisible(margin = 8): void {
  const el = document.activeElement
  if (!(el instanceof HTMLElement) || el === document.body) return

  for (const box of scrollParents(el)) {
    // Measured fresh each time: scrolling an inner box moves the input.
    const inner = el.getBoundingClientRect()
    const outer = box.getBoundingClientRect()
    if (inner.top >= outer.top + margin && inner.bottom <= outer.bottom - margin) continue

    // Center it, so rows above and below stay visible for context.
    const shift = inner.top + inner.height / 2 - (outer.top + outer.height / 2)
    box.scrollTop += shift
  }
}
