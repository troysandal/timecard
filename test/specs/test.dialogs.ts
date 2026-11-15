import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@capacitor/dialog', () => ({
  Dialog: { confirm: vi.fn(), alert: vi.fn() },
}))
vi.mock('../../src/platform', () => ({ getRunMode: vi.fn() }))

import { Dialog } from '@capacitor/dialog'
import { getRunMode } from '../../src/platform'
import { alertDialog, answerDialog, confirmDialog, dialogState } from '../../src/lib/dialogs.svelte'

const OPTIONS = {
  title: 'Delete race?',
  message: 'Are you sure?',
  confirmLabel: 'Delete',
  destructive: true,
}

/** Let queued promise callbacks run. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

beforeEach(() => {
  vi.clearAllMocks()
  answerDialog(false) // clear anything a previous test left showing
  vi.mocked(getRunMode).mockReturnValue('browser')
})

describe('confirmDialog on the web (the sheet)', () => {
  it('shows the sheet and resolves with the answer', async () => {
    const result = confirmDialog(OPTIONS)
    await flush()
    expect(dialogState.current?.kind).toBe('confirm')
    expect(dialogState.current?.options).toMatchObject({ title: 'Delete race?' })

    answerDialog(true)
    await expect(result).resolves.toBe(true)
    expect(dialogState.current).toBeNull()
  })

  it('resolves false when declined, and never touches the native plugin', async () => {
    const result = confirmDialog(OPTIONS)
    await flush()
    answerDialog(false)
    await expect(result).resolves.toBe(false)
    expect(Dialog.confirm).not.toHaveBeenCalled()
  })

  it('shows one dialog at a time: the second waits for the first', async () => {
    const first = confirmDialog({ ...OPTIONS, message: 'first' })
    const second = confirmDialog({ ...OPTIONS, message: 'second' })
    await flush()
    expect(dialogState.current?.options.message).toBe('first')

    answerDialog(true)
    await expect(first).resolves.toBe(true)
    await flush()
    expect(dialogState.current?.options.message).toBe('second')

    answerDialog(false)
    await expect(second).resolves.toBe(false)
  })

  it('answering when nothing is showing does nothing', () => {
    expect(() => answerDialog(true)).not.toThrow()
  })
})

describe('confirmDialog on a native app (the system dialog)', () => {
  beforeEach(() => vi.mocked(getRunMode).mockReturnValue('native'))

  it('uses the system dialog, with our titles and labels, and no sheet', async () => {
    vi.mocked(Dialog.confirm).mockResolvedValue({ value: true })
    await expect(confirmDialog({ ...OPTIONS, cancelLabel: 'Keep' })).resolves.toBe(true)
    expect(Dialog.confirm).toHaveBeenCalledWith({
      title: 'Delete race?',
      message: 'Are you sure?',
      okButtonTitle: 'Delete',
      cancelButtonTitle: 'Keep',
    })
    expect(dialogState.current).toBeNull()
  })

  it('defaults the labels to OK and Cancel', async () => {
    vi.mocked(Dialog.confirm).mockResolvedValue({ value: false })
    await expect(confirmDialog({ title: 't', message: 'm' })).resolves.toBe(false)
    expect(Dialog.confirm).toHaveBeenCalledWith(
      expect.objectContaining({ okButtonTitle: 'OK', cancelButtonTitle: 'Cancel' })
    )
  })

  it('falls back to the sheet if the system dialog fails, so a dialog always appears', async () => {
    vi.mocked(Dialog.confirm).mockRejectedValue(new Error('plugin missing'))
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = confirmDialog(OPTIONS)
    await flush()
    expect(dialogState.current?.kind).toBe('confirm')
    answerDialog(true)
    await expect(result).resolves.toBe(true)
  })
})

describe('alertDialog', () => {
  it('shows a sheet on the web and resolves when it is dismissed', async () => {
    const result = alertDialog({ title: 'Scan failed', message: 'Try again' })
    await flush()
    expect(dialogState.current?.kind).toBe('alert')
    answerDialog(true)
    await expect(result).resolves.toBeUndefined()
  })

  it('uses the system alert on a native app', async () => {
    vi.mocked(getRunMode).mockReturnValue('native')
    vi.mocked(Dialog.alert).mockResolvedValue(undefined)
    await alertDialog({ message: 'Done' })
    expect(Dialog.alert).toHaveBeenCalledWith({ title: '', message: 'Done', buttonTitle: 'OK' })
    expect(dialogState.current).toBeNull()
  })
})
