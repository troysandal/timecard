import { afterEach, describe, expect, it, vi } from 'vitest'
import { installViewportHeight } from '../../src/lib/viewportHeight'
import {
  resetKeyboardBaseline,
  setNativeKeyboardHeight,
  updateKeyboardState,
} from '../../src/lib/keyboardState.svelte'

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

  it('lays out for the native keyboard height right away, then follows the resize event', () => {
    resetKeyboardBaseline()
    const vv = { height: 667, scale: 1, addEventListener: () => {} }
    Object.defineProperty(window, 'visualViewport', { value: vv, configurable: true })
    window.innerWidth = 375
    updateKeyboardState() // learn the full height: 667
    installViewportHeight()
    expect(root.style.getPropertyValue('--app-height')).toBe('667px')

    // keyboardWillShow: the viewport has not resized yet.
    setNativeKeyboardHeight(260)
    expect(root.style.getPropertyValue('--app-height')).toBe('407px')

    // keyboardWillHide: back to full height before the viewport reports it.
    setNativeKeyboardHeight(0)
    expect(root.style.getPropertyValue('--app-height')).toBe('667px')

    // The browser's own report is still the final word.
    vv.height = 500
    window.dispatchEvent(new Event('resize'))
    expect(root.style.getPropertyValue('--app-height')).toBe('500px')
  })
})
