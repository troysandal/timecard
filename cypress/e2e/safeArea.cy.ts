/// <reference types="cypress" />

// Safe areas (see DESIGN.md "Safe areas"). Chrome's env(safe-area-inset-*) is always 0
// inside Cypress's iframe, so these tests override the --safe-* variables that every
// layout is required to use (src/app.css). That proves the layouts respond to the
// insets; the real env() values are checked on devices with scripts/screenshots.sh.

import { seedRace, visitHome } from './app_util'

type Insets = { top: number; bottom: number; left: number; right: number }
const NOTCH: Insets = { top: 59, bottom: 34, left: 0, right: 0 } // iPhone with Dynamic Island
const LANDSCAPE: Insets = { top: 0, bottom: 21, left: 59, right: 59 }

const race = seedRace('tk1', 'Safe Area Sample', 'time_keeper', '2026-03-01T10:00:00Z')

/** Apply insets to the app under test (call after the page has loaded). */
function applyInsets(insets: Insets) {
  cy.document().then((doc) => {
    const root = doc.documentElement.style
    root.setProperty('--safe-top', `${insets.top}px`)
    root.setProperty('--safe-bottom', `${insets.bottom}px`)
    root.setProperty('--safe-left', `${insets.left}px`)
    root.setProperty('--safe-right', `${insets.right}px`)
  })
}

function setScheme(scheme: 'light' | 'dark') {
  return Cypress.automation('remote:debugger:protocol', {
    command: 'Emulation.setEmulatedMedia',
    params: { features: [{ name: 'prefers-color-scheme', value: scheme }] },
  })
}

describe('safe areas', () => {
  beforeEach(() => cy.viewport(393, 852))

  it('Home content starts below the notch and clears the home indicator', () => {
    visitHome()
    applyInsets(NOTCH)
    cy.getBySel('safe-area-top').then(($s) => {
      expect($s[0].getBoundingClientRect().height).to.eq(NOTCH.top)
    })
    cy.contains('h2', 'Enduro Time Cards').then(($h) => {
      expect($h[0].getBoundingClientRect().top).to.be.at.least(NOTCH.top)
    })
    // Home's page shell pads its bottom by the inset.
    cy.getBySel('add-enduro').closest('.safe-bottom-edge').then(($p) => {
      expect(parseFloat(getComputedStyle($p[0]).paddingBottom)).to.eq(NOTCH.bottom)
    })
  })

  it('Edit header starts below the notch and the footer clears the home indicator', () => {
    visitHome([race], '#/edit/tk1')
    applyInsets(NOTCH)
    cy.contains('button', 'Back').then(($b) => {
      expect($b[0].getBoundingClientRect().top).to.be.at.least(NOTCH.top)
    })
    cy.window().then((win) => {
      cy.getBySel('score-checks').then(($c) => {
        const bottom = $c[0].getBoundingClientRect().bottom
        expect(bottom, 'last footer text bottom').to.be.at.most(win.innerHeight - NOTCH.bottom)
      })
    })
  })

  it('content clears left/right insets in landscape', () => {
    cy.viewport(852, 393)
    visitHome([race], '#/edit/tk1')
    applyInsets(LANDSCAPE)
    cy.contains('button', 'Back').then(($b) => {
      expect($b[0].getBoundingClientRect().left).to.be.at.least(LANDSCAPE.left)
    })
    cy.window().then((win) => {
      cy.getBySel('score-checks').then(($c) => {
        expect($c[0].getBoundingClientRect().right).to.be.at.most(win.innerWidth - LANDSCAPE.right)
      })
    })
    cy.visit('about:blank')
    visitHome()
    applyInsets(LANDSCAPE)
    cy.contains('h2', 'Enduro Time Cards').then(($h) => {
      expect($h[0].getBoundingClientRect().left).to.be.at.least(LANDSCAPE.left)
    })
  })

  for (const scheme of ['light', 'dark'] as const) {
    it(`top inset band matches the page background in ${scheme} mode`, () => {
      // Regression: SafeAreaTop used to hard-code a light color, leaving a light strip
      // behind the status bar in dark mode.
      setScheme(scheme)
      visitHome()
      applyInsets(NOTCH)
      cy.getBySel('safe-area-top').then(($s) => {
        const band = getComputedStyle($s[0]).backgroundColor
        const page = getComputedStyle($s[0].ownerDocument.body).backgroundColor
        expect(band).to.eq(page)
      })
    })
  }
})
