import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'
import { closeTopSheet } from './sheets'

// Android system Back. In order:
//  1. an open sheet closes (the newest first);
//  2. otherwise Back goes through browser history, so it hits the same popstate handler (and
//     unsaved-changes guard) as the in-app Back button;
//  3. on the first screen there is no history, so the app exits.
export function handleBackButton(canGoBack: boolean): void {
  if (closeTopSheet()) return
  if (canGoBack) history.back()
  else CapApp.exitApp()
}

export function installAndroidBackButton() {
  if (Capacitor.getPlatform() !== 'android') return
  CapApp.addListener('backButton', ({ canGoBack }) => handleBackButton(canGoBack))
}
