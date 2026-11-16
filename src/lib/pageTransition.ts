import { tick } from 'svelte'

// Slide between Home and Edit with the View Transitions API. Where the API is missing, or the
// OS asks for reduced motion, the change happens at once, exactly as it did before. The CSS is
// in app.css ("page transitions"); `data-nav` on <html> tells it which way to slide.
export type NavDirection = 'push' | 'pop'

function reducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

// Each call gets a number, so a call that was overtaken does not clear the newer call's direction.
let latest = 0

export async function transitionPage<T>(direction: NavDirection, update: () => T): Promise<T> {
  if (typeof document.startViewTransition !== 'function' || reducedMotion()) {
    const result = update()
    await tick()
    return result
  }
  const root = document.documentElement
  const mine = ++latest
  let result: T
  let ran = false
  let failure: unknown
  let failed = false
  root.dataset.nav = direction
  try {
    const transition = document.startViewTransition(async () => {
      ran = true
      try {
        result = update()
        await tick()
      } catch (error) {
        failed = true
        failure = error
      }
    })
    await transition.finished.catch(() => {})
  } finally {
    if (mine === latest) delete root.dataset.nav
  }
  // A browser that skipped the transition outright still runs the callback; this is only a safety net.
  if (!ran) {
    result = update()
    await tick()
  }
  if (failed) throw failure
  return result!
}
