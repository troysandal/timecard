import './app.css'
import App from './App.svelte'
import { mount } from "svelte";
import { installTextScale } from './lib/textScale'
import { installViewportHeight } from './lib/viewportHeight'
import { installKeyboard } from './lib/keyboard'

installTextScale()
installViewportHeight()
installKeyboard()

const app = mount(App, {
  target: document.getElementById('app') || document.body
})

export default app
