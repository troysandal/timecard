/// <reference types="cypress" />

// Visual-verification captures for the mobile UI restyle (docs/mobile-ui-spec.md).
// Opt-in so normal `cypress run` stays fast:
//   npm run test:screenshots
// Output: cypress/screenshots/screenshots.cy.ts/<name>.png (git-ignored)

import { seedRace, visitHome } from './app_util'

const VIEWPORTS = [
  { name: 'se', width: 375, height: 667 },
  { name: 'iphone', width: 390, height: 844 },
] as const

const SCHEMES = ['light', 'dark'] as const

const races = [
  seedRace('tk1', 'Time Keeper Sample', 'time_keeper', '2026-03-01T10:00:00Z'),
  seedRace('sp1', 'Sprint Sample', 'sprint', '2026-02-01T10:00:00Z'),
]

/** Emulate prefers-color-scheme through Chrome DevTools Protocol (Chrome only). */
function emulateColorScheme(scheme: (typeof SCHEMES)[number]) {
  return Cypress.automation('remote:debugger:protocol', {
    command: 'Emulation.setEmulatedMedia',
    params: { features: [{ name: 'prefers-color-scheme', value: scheme }] },
  })
}

const enabled = Boolean(Cypress.expose('SCREENSHOTS'))

;(enabled ? describe : describe.skip)('screenshots', () => {
  for (const vp of VIEWPORTS) {
    for (const scheme of SCHEMES) {
      describe(`${vp.name} ${scheme}`, () => {
        beforeEach(() => {
          cy.viewport(vp.width, vp.height)
          emulateColorScheme(scheme)
        })

        it('home (empty)', () => {
          visitHome()
          cy.getBySel('empty-state').should('be.visible')
          // Proves the emulation took effect (the app has no dark styling until step 1).
          cy.window().then((win) => {
            expect(win.matchMedia('(prefers-color-scheme: dark)').matches).to.eq(scheme === 'dark')
          })
          cy.screenshot(`home-empty-${vp.name}-${scheme}`, { capture: 'viewport' })
        })

        it('home (with races)', () => {
          visitHome(races)
          cy.getBySel('race-list').should('be.visible')
          cy.screenshot(`home-races-${vp.name}-${scheme}`, { capture: 'viewport' })
        })

        it('edit time keeper', () => {
          visitHome(races, '#/edit/tk1')
          cy.screenshot(`edit-tk-${vp.name}-${scheme}`, { capture: 'viewport' })
        })
      })
    }
  }
})
