import { describe, expect, it } from 'vitest'
import { closeTopSheet, hasOpenSheet, isTopSheet, registerSheet } from '../../src/lib/sheets'

describe('sheet registry', () => {
  it('has nothing open to start with', () => {
    expect(hasOpenSheet()).toBe(false)
    expect(closeTopSheet()).toBe(false)
  })

  it('closes the newest sheet first', () => {
    const closed: string[] = []
    const a = registerSheet(() => closed.push('a'))
    const b = registerSheet(() => closed.push('b'))
    expect(isTopSheet(b.id)).toBe(true)
    expect(isTopSheet(a.id)).toBe(false)

    expect(closeTopSheet()).toBe(true)
    expect(closed).toEqual(['b'])

    b.unregister()
    expect(isTopSheet(a.id)).toBe(true)
    expect(closeTopSheet()).toBe(true)
    expect(closed).toEqual(['b', 'a'])
    a.unregister()
    expect(hasOpenSheet()).toBe(false)
  })

  it('closeTopSheet does not unregister: the sheet unmounts and unregisters itself', () => {
    const s = registerSheet(() => {})
    closeTopSheet()
    expect(hasOpenSheet()).toBe(true)
    s.unregister()
    expect(hasOpenSheet()).toBe(false)
  })

  it('unregistering twice, or out of order, is harmless', () => {
    const a = registerSheet(() => {})
    const b = registerSheet(() => {})
    a.unregister()
    a.unregister()
    expect(isTopSheet(b.id)).toBe(true)
    b.unregister()
    expect(hasOpenSheet()).toBe(false)
  })
})
