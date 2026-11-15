// Confirm and alert dialogs. See DESIGN.md "Sheets and dialogs".
//
// Native (iOS, Android): the system dialog through @capacitor/dialog, which looks and behaves
// like every other app's. Web and PWA: our own Tailwind sheet (components/ConfirmHost.svelte).
// If the native call fails the sheet is used, so a dialog always appears.
//
// Dialogs are shown one at a time: a second request waits for the first to be answered.

import { Dialog } from '@capacitor/dialog'
import { getRunMode } from '../platform'

export interface ConfirmOptions {
  title: string
  message: string
  /** Defaults to "OK". */
  confirmLabel?: string
  /** Defaults to "Cancel". */
  cancelLabel?: string
  /** Style the confirm button as destructive (red). Cancel is focused first on the web. */
  destructive?: boolean
}

export interface AlertOptions {
  title?: string
  message: string
  /** Defaults to "OK". */
  buttonLabel?: string
}

export type PendingDialog =
  | { kind: 'confirm'; options: ConfirmOptions; resolve: (accepted: boolean) => void }
  | { kind: 'alert'; options: AlertOptions; resolve: (accepted: boolean) => void }

/** The dialog the web sheet is showing, or null. Read by ConfirmHost. */
export const dialogState = $state<{ current: PendingDialog | null }>({ current: null })

let queue: Promise<unknown> = Promise.resolve()
function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(job, job)
  queue = run.catch(() => {})
  return run
}

function showSheet(dialog: Omit<PendingDialog, 'resolve'>): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    dialogState.current = { ...dialog, resolve } as PendingDialog
  })
}

/** Called by the sheet's buttons, Escape, a tap outside, and Android Back (all mean "no"). */
export function answerDialog(accepted: boolean): void {
  const current = dialogState.current
  if (!current) return
  dialogState.current = null
  current.resolve(accepted)
}

export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  return enqueue(async () => {
    if (getRunMode() === 'native') {
      try {
        const { value } = await Dialog.confirm({
          title: options.title,
          message: options.message,
          okButtonTitle: options.confirmLabel ?? 'OK',
          cancelButtonTitle: options.cancelLabel ?? 'Cancel',
        })
        return value
      } catch (error) {
        console.warn('Native confirm failed, using the sheet', error)
      }
    }
    return showSheet({ kind: 'confirm', options })
  })
}

export function alertDialog(options: AlertOptions): Promise<void> {
  return enqueue(async () => {
    if (getRunMode() === 'native') {
      try {
        await Dialog.alert({
          title: options.title ?? '',
          message: options.message,
          buttonTitle: options.buttonLabel ?? 'OK',
        })
        return
      } catch (error) {
        console.warn('Native alert failed, using the sheet', error)
      }
    }
    await showSheet({ kind: 'alert', options })
  })
}
