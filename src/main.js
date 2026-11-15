import './app.css'
import App from './App.svelte'
import { mount } from "svelte";
import { installTextScale } from './lib/textScale'

installTextScale()

const app = mount(App, {
  target: document.getElementById('app') || document.body
})

export default app
