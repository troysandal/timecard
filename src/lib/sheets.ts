// Registry of open sheets (bottom sheets and dialogs), newest last.
//
// It exists so that the Android Back button and the Escape key close the TOP sheet before
// anything else happens (see lib/backButton.ts and components/Sheet.svelte). Every Sheet
// registers itself while it is mounted.

type Entry = { id: number; close: () => void }

const stack: Entry[] = []
let nextId = 1

/** Register an open sheet. Returns its id and an unregister function. */
export function registerSheet(close: () => void): { id: number; unregister: () => void } {
  const entry = { id: nextId++, close }
  stack.push(entry)
  return {
    id: entry.id,
    unregister() {
      const i = stack.indexOf(entry)
      if (i !== -1) stack.splice(i, 1)
    },
  }
}

export function isTopSheet(id: number): boolean {
  return stack.length > 0 && stack[stack.length - 1]!.id === id
}

export function hasOpenSheet(): boolean {
  return stack.length > 0
}

/** Close the newest open sheet. Returns false when none is open. */
export function closeTopSheet(): boolean {
  const top = stack[stack.length - 1]
  if (!top) return false
  top.close()
  return true
}
