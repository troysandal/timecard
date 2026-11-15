// iOS keyboard setup. See DESIGN.md "Keyboard".
//
// With @capacitor/keyboard installed, iOS resizes the web view when the keyboard
// appears (resize: 'native', the plugin default), so the page never becomes taller
// than what is visible. The plugin also hides the keyboard's accessory bar by
// default; we turn it back on because the number pad has no Return key, and the
// bar's Done button is how people dismiss it.
//
// It also forwards the plugin's keyboardWillShow / keyboardWillHide events (exact height,
// sent as the keyboard starts to move) to keyboardState, so the layout reacts at once.
//
// Everything is iOS-only and a silent no-op elsewhere (Android handles the keyboard
// through Capacitor's SystemBars insets; the web and PWA use lib/viewportHeight.ts).

import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import { setNativeKeyboardHeight } from './keyboardState.svelte'

export async function installKeyboard(): Promise<void> {
  if (Capacitor.getPlatform() !== 'ios') return
  try {
    await Keyboard.setAccessoryBarVisible({ isVisible: true })
  } catch (error) {
    // Never let keyboard setup break startup, but leave a trace: if the plugin isn't
    // synced the number pad loses its Done button, and this is the only clue.
    console.warn('Keyboard accessory bar could not be enabled', error)
  }
  try {
    await Keyboard.addListener('keyboardWillShow', (info) => setNativeKeyboardHeight(info.keyboardHeight))
    await Keyboard.addListener('keyboardWillHide', () => setNativeKeyboardHeight(0))
  } catch (error) {
    // Without these the layout still follows the resize event, just later.
    console.warn('Keyboard events could not be subscribed', error)
  }
}
