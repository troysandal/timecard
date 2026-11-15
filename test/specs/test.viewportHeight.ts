import { afterEach, describe, expect, it, vi } from 'vitest'
import { installViewportHeight } from '../../src/lib/viewportHeight'

describe('installViewportHeight', () => {
  const root = document.documentElement
  afterEach(() => {
    vi.unstubAllGlobals()
    root.style.removeProperty('--app-height')
  })

  it('falls back to innerHeight when visualViewport is unavailable', () => {
    vi.stubGlobal('visualViewport', undefined)
    Object.defineProperty(window, 'visualViewport', { value: undefined, configurable: true })
    window.innerHeight = 700
    installViewportHeight()
    expect(root.style.getPropertyValue('--app-height')).toBe('700px')
  })

  it('tracks the visual viewport, which the iOS keyboard shrinks', () => {
    let resize: () => void = () => {}
    const vv = {
      height: 667,
      scale: 1,
      addEventListener: (_: string, fn: () => void) => (resize = fn),
    }
    Object.defineProperty(window, 'visualViewport', { value: vv, configurable: true })
    installViewportHeight()
    expect(root.style.getPropertyValue('--app-height')).toBe('667px')

    vv.height = 622.6 // keyboard accessory bar up
    resize()
    expect(root.style.getPropertyValue('--app-height')).toBe('623px')
  })

  it('does not shrink the layout when the user pinch-zooms (web and PWA stay zoomable)', () => {
    let resize: () => void = () => {}
    // Zoomed to 2x: the visible area is half as tall in CSS pixels.
    const vv = {
      height: 333.5,
      scale: 2,
      addEventListener: (_: string, fn: () => void) => (resize = fn),
    }
    Object.defineProperty(window, 'visualViewport', { value: vv, configurable: true })
    installViewportHeight()
    resize()
    expect(root.style.getPropertyValue('--app-height')).toBe('667px')
  })
})
