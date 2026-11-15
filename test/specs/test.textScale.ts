import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  MAX_TEXT_SCALE,
  MIN_TEXT_SCALE,
  applyTextScale,
  clampTextScale,
} from '../../src/lib/textScale'

describe('clampTextScale', () => {
  it('passes values inside the bounds through', () => {
    expect(clampTextScale(1)).toBe(1)
    expect(clampTextScale(1.12)).toBe(1.12)
  })

  it('clamps to the bounds', () => {
    expect(clampTextScale(0.5)).toBe(MIN_TEXT_SCALE)
    expect(clampTextScale(3)).toBe(MAX_TEXT_SCALE)
  })

  it('keeps the bounds the native Android clamp mirrors', () => {
    // MainActivity.java hard-codes 0.85f / 1.3f. Change both together.
    expect(MIN_TEXT_SCALE).toBe(0.85)
    expect(MAX_TEXT_SCALE).toBe(1.3)
  })
})

describe('applyTextScale', () => {
  const root = document.documentElement

  // Stand in for the iOS web view: -apple-system-body is supported, the pointer is
  // coarse, and the probe element's computed font size is whatever Dynamic Type says.
  function mockEnv(opts: { supported: boolean; coarse: boolean; bodyPx: number }) {
    vi.stubGlobal('CSS', { supports: () => opts.supported })
    vi.stubGlobal('matchMedia', () => ({ matches: opts.coarse }))
    window.matchMedia = (() => ({ matches: opts.coarse })) as unknown as typeof window.matchMedia
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      fontSize: `${opts.bodyPx}px`,
    } as CSSStyleDeclaration)
  }

  beforeEach(() => root.style.removeProperty('font-size'))
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    root.style.removeProperty('font-size')
  })

  it('leaves the default size at the default Dynamic Type setting (17px body)', () => {
    mockEnv({ supported: true, coarse: true, bodyPx: 17 })
    applyTextScale()
    expect(root.style.fontSize).toBe('16px')
  })

  it('scales proportionally inside the bounds', () => {
    mockEnv({ supported: true, coarse: true, bodyPx: 19 })
    applyTextScale()
    expect(parseFloat(root.style.fontSize)).toBeCloseTo(16 * (19 / 17), 3)
  })

  it('caps very large accessibility sizes', () => {
    mockEnv({ supported: true, coarse: true, bodyPx: 53 })
    applyTextScale()
    expect(parseFloat(root.style.fontSize)).toBeCloseTo(16 * MAX_TEXT_SCALE, 5)
  })

  it('floors very small sizes', () => {
    mockEnv({ supported: true, coarse: true, bodyPx: 11 })
    applyTextScale()
    expect(parseFloat(root.style.fontSize)).toBeCloseTo(16 * MIN_TEXT_SCALE, 5)
  })

  it('does nothing where -apple-system-body is unsupported (Chrome, Android)', () => {
    mockEnv({ supported: false, coarse: true, bodyPx: 17 })
    applyTextScale()
    expect(root.style.fontSize).toBe('')
  })

  it('does nothing with a fine pointer (Mac Safari reports a 13px body)', () => {
    mockEnv({ supported: true, coarse: false, bodyPx: 13 })
    applyTextScale()
    expect(root.style.fontSize).toBe('')
  })

  it('removes a previously applied size when the environment stops qualifying', () => {
    root.style.fontSize = '20px'
    mockEnv({ supported: false, coarse: false, bodyPx: 17 })
    applyTextScale()
    expect(root.style.fontSize).toBe('')
  })
})
