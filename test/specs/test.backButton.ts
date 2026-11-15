import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@capacitor/core', () => ({ Capacitor: { getPlatform: vi.fn() } }))
vi.mock('@capacitor/app', () => ({ App: { addListener: vi.fn(), exitApp: vi.fn() } }))

import { App as CapApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { handleBackButton, installAndroidBackButton } from '../../src/lib/backButton'
import { hasOpenSheet, registerSheet } from '../../src/lib/sheets'

describe('Android Back button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(history, 'back').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('closes an open sheet first and does nothing else', () => {
    const close = vi.fn()
    const sheet = registerSheet(close)
    handleBackButton(true)
    expect(close).toHaveBeenCalledOnce()
    expect(history.back).not.toHaveBeenCalled()
    expect(CapApp.exitApp).not.toHaveBeenCalled()
    sheet.unregister()
  })

  it('closes only the newest of several sheets per press', () => {
    const closeA = vi.fn()
    const closeB = vi.fn()
    const a = registerSheet(closeA)
    const b = registerSheet(closeB)
    handleBackButton(true)
    expect(closeB).toHaveBeenCalledOnce()
    expect(closeA).not.toHaveBeenCalled()
    a.unregister()
    b.unregister()
  })

  it('with no sheet open, goes back through history so the unsaved-changes guard runs', () => {
    expect(hasOpenSheet()).toBe(false)
    handleBackButton(true)
    expect(history.back).toHaveBeenCalledOnce()
    expect(CapApp.exitApp).not.toHaveBeenCalled()
  })

  it('exits the app from the first screen', () => {
    handleBackButton(false)
    expect(CapApp.exitApp).toHaveBeenCalledOnce()
    expect(history.back).not.toHaveBeenCalled()
  })

  it('installs a listener on Android only', () => {
    vi.mocked(Capacitor.getPlatform).mockReturnValue('ios')
    installAndroidBackButton()
    expect(CapApp.addListener).not.toHaveBeenCalled()

    vi.mocked(Capacitor.getPlatform).mockReturnValue('android')
    installAndroidBackButton()
    expect(CapApp.addListener).toHaveBeenCalledWith('backButton', expect.any(Function))
  })

  it('the installed listener applies the same rules', () => {
    vi.mocked(Capacitor.getPlatform).mockReturnValue('android')
    installAndroidBackButton()
    const listener = vi.mocked(CapApp.addListener).mock.calls[0]![1] as (e: { canGoBack: boolean }) => void
    const close = vi.fn()
    const sheet = registerSheet(close)
    listener({ canGoBack: true })
    expect(close).toHaveBeenCalledOnce()
    sheet.unregister()
    listener({ canGoBack: true })
    expect(history.back).toHaveBeenCalledOnce()
  })
})
