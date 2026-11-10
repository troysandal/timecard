import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'

// Routes the Android system Back button through browser history so it hits
// the same popstate handler (and unsaved-changes guard) as the in-app button.
export function installAndroidBackButton() {
  if (Capacitor.getPlatform() !== 'android') return
  CapApp.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) history.back()
    else CapApp.exitApp()
  })
}
