import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  KEYBOARD_MIN_SHRINK,
  keyboardState,
  resetKeyboardBaseline,
  setNativeKeyboardHeight,
  updateKeyboardState,
} from '../../src/lib/keyboardState.svelte'

describe('keyboardState', () => {
  let input: HTMLInputElement
  let vv: { height: number; scale: number; addEventListener: () => void }

  beforeEach(() => {
    resetKeyboardBaseline()
    input = document.createElement('input')
    document.body.appendChild(input)
    vv = { height: 667, scale: 1, addEventListener: () => {} }
    Object.defineProperty(window, 'visualViewport', { value: vv, configurable: true })
    window.innerWidth = 375
    updateKeyboardState() // learn the full height
  })

  afterEach(() => {
    input.remove()
  })

  it('is closed at full height', () => {
    input.focus()
    updateKeyboardState()
    expect(keyboardState.open).toBe(false)
  })

  it('opens when the viewport shrinks by a keyboard and an input has focus', () => {
    input.focus()
    vv.height = 407
    updateKeyboardState()
    expect(keyboardState.open).toBe(true)
  })

  it('stays closed when nothing editable has focus', () => {
    vv.height = 407
    updateKeyboardState()
    expect(keyboardState.open).toBe(false)
  })

  it('ignores the accessory bar alone', () => {
    input.focus()
    vv.height = 667 - 44
    updateKeyboardState()
    expect(keyboardState.open).toBe(false)
  })

  it('opens at exactly the minimum shrink, not just below it', () => {
    input.focus()
    vv.height = 667 - (KEYBOARD_MIN_SHRINK - 1)
    updateKeyboardState()
    expect(keyboardState.open).toBe(false)
    vv.height = 667 - KEYBOARD_MIN_SHRINK
    updateKeyboardState()
    expect(keyboardState.open).toBe(true)
  })

  it('closes again when the keyboard goes away', () => {
    input.focus()
    vv.height = 407
    updateKeyboardState()
    vv.height = 667
    updateKeyboardState()
    expect(keyboardState.open).toBe(false)
  })

  it('does not treat a pinch zoom as a keyboard', () => {
    input.focus()
    vv.height = 333.5 // zoomed to 2x: half as tall in CSS pixels
    vv.scale = 2
    updateKeyboardState()
    expect(keyboardState.open).toBe(false)
  })

  it('restarts the baseline when the width changes (rotation)', () => {
    input.focus()
    window.innerWidth = 667
    vv.height = 375 // landscape, no keyboard
    updateKeyboardState()
    expect(keyboardState.open).toBe(false)
  })

  describe('native keyboard height (iOS plugin events)', () => {
    it('opens as soon as the plugin reports a keyboard, before the viewport has resized', () => {
      input.focus()
      // vv.height is still 667: the web view's resize event has not arrived yet.
      setNativeKeyboardHeight(260)
      expect(keyboardState.open).toBe(true)
    })

    it('closes as soon as the plugin reports the keyboard hiding', () => {
      input.focus()
      setNativeKeyboardHeight(260)
      setNativeKeyboardHeight(0)
      expect(keyboardState.open).toBe(false)
    })

    it('ignores a short keyboard such as the accessory bar alone', () => {
      input.focus()
      setNativeKeyboardHeight(44)
      expect(keyboardState.open).toBe(false)
    })

    it('needs an editable element to have focus', () => {
      setNativeKeyboardHeight(260)
      expect(keyboardState.open).toBe(false)
    })

    it('trusts the plugin over the viewport once it has reported', () => {
      input.focus()
      setNativeKeyboardHeight(0)
      vv.height = 407 // a resize that is not the keyboard (for example a split-view change)
      updateKeyboardState()
      expect(keyboardState.open).toBe(false)
    })
  })
})
