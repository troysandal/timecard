/// <reference types="cypress" />

// Sheets and dialogs (see DESIGN.md "Sheets and dialogs"): the race picker, and the web
// confirm dialog. Native builds show the system dialog, which Cypress can't see; Android Back
// closing a sheet is covered by test/specs/test.backButton.ts and on the emulator.

import { seedRace, visitHome } from './app_util'

const tk = seedRace('tk1', 'Sheet TK', 'time_keeper', '2026-03-01T10:00:00Z')
const sp = seedRace('sp1', 'Sheet Sprint', 'sprint', '2026-03-02T10:00:00Z')

// The unsaved-changes dialog: edit a race, then press Back.
const openDiscardConfirm = () => {
  cy.getBySel('race-edit').first().click()
  cy.getBySel('race-name-input').type('x')
  cy.getBySel('back-button').click()
  cy.getBySel('confirm-sheet').should('be.visible')
}

const openPicker = () => {
  cy.getBySel('add-enduro').click()
  cy.getBySel('race-picker').should('be.visible')
}

describe('race picker sheet', () => {
  beforeEach(() => {
    cy.viewport(393, 852)
    visitHome([tk, sp])
  })

  it('is a modal dialog with an accessible name', () => {
    openPicker()
    cy.get('[data-cy=race-picker] [role=dialog]')
      .should('have.attr', 'aria-modal', 'true')
      .and('have.attr', 'aria-labelledby', 'race-picker-title')
    // The name is the visible heading, so a screen reader doesn't announce the title twice.
    cy.get('#race-picker-title').should('have.text', 'New Score Card')
  })

  it('names the confirm dialog by its visible title', () => {
    openDiscardConfirm()
    cy.get('[data-cy=confirm-sheet] [role=dialog]').should('have.attr', 'aria-labelledby', 'confirm-title')
    cy.get('#confirm-title').should('have.text', 'Discard changes?')
  })

  it('moves focus into the sheet, and back to the Add button when it closes', () => {
    openPicker()
    cy.focused().should('have.attr', 'data-cy', 'add-time-keeper')
    cy.get('body').type('{esc}')
    cy.getBySel('race-picker').should('not.exist')
    cy.focused().should('have.attr', 'data-cy', 'add-enduro')
  })

  it('keeps Tab inside the sheet', () => {
    openPicker()
    // Three controls: Time Keeper, Sprint, Cancel. A fourth Tab wraps to the first.
    cy.press(Cypress.Keyboard.Keys.TAB)
    cy.focused().should('have.attr', 'data-cy', 'add-sprint')
    cy.press(Cypress.Keyboard.Keys.TAB)
    cy.focused().should('have.attr', 'data-cy', 'cancel-picker')
    cy.press(Cypress.Keyboard.Keys.TAB)
    cy.focused().should('have.attr', 'data-cy', 'add-time-keeper')
  })

  it('closes on Escape, on a tap outside, and on Cancel', () => {
    openPicker()
    cy.get('body').type('{esc}')
    cy.getBySel('race-picker').should('not.exist')

    openPicker()
    cy.getBySel('sheet-backdrop').click('topLeft', { force: true })
    cy.getBySel('race-picker').should('not.exist')

    openPicker()
    cy.getBySel('cancel-picker').click()
    cy.getBySel('race-picker').should('not.exist')
  })

  it('stops the page scrolling behind it while open', () => {
    cy.get('html').should('not.have.class', 'sheet-open')
    openPicker()
    cy.get('html').should('have.class', 'sheet-open')
    cy.getBySel('cancel-picker').click()
    cy.get('html').should('not.have.class', 'sheet-open')
  })

  it('creates the chosen race type and closes', () => {
    openPicker()
    cy.getBySel('add-sprint').click()
    cy.getBySel('race-picker').should('not.exist')
    cy.location('hash').should('match', /^#\/edit\//)
  })

  it('slides up by default', () => {
    openPicker()
    cy.get('[data-cy=race-picker] [role=dialog]').should(($p) => {
      expect(getComputedStyle($p[0]).animationName).to.eq('sheet-up')
    })
  })

  it('switches the animation off when the OS asks for reduced motion', () => {
    // Chrome's reduced-motion emulation does not reach the app frame under Cypress, so check the
    // stylesheet: inside a prefers-reduced-motion: reduce query, panel and backdrop have no animation.
    cy.document().then((doc) => {
      const win = doc.defaultView as Window & typeof globalThis
      const walk = (rules: CSSRuleList, inReduce: boolean, found: string[]) => {
        for (const rule of Array.from(rules)) {
          // Style rules also have cssRules (CSS nesting), so test for them first.
          if (rule instanceof win.CSSStyleRule) {
            // Chrome serializes the animation shorthand in full, so look for `none` rather than `animation: none`.
            if (inReduce && /animation(-name)?:[^;]*\bnone\b/.test(rule.cssText)) found.push(rule.selectorText)
          } else if ('cssRules' in rule) {
            const reduce =
              inReduce || (rule instanceof win.CSSMediaRule && /prefers-reduced-motion:\s*reduce/.test(rule.conditionText))
            walk((rule as CSSGroupingRule).cssRules, reduce, found)
          }
        }
      }
      const found: string[] = []
      for (const sheet of Array.from(doc.styleSheets)) walk(sheet.cssRules, false, found)
      expect(found.join(' ')).to.contain('.sheet-panel')
      expect(found.join(' ')).to.contain('.sheet-backdrop')
    })
  })
})

describe('sheet placement', () => {
  const panel = () => cy.get('[data-cy=race-picker] [role=dialog]')

  it('is a bottom sheet on a phone: full width, sitting on the bottom edge', () => {
    cy.viewport(393, 852)
    visitHome([tk])
    openPicker()
    panel().should(($p) => {
      const r = $p[0].getBoundingClientRect()
      expect(r.width, 'full width').to.be.closeTo(393, 1)
      expect(r.bottom, 'on the bottom edge').to.be.closeTo(852, 1)
    })
  })

  it('is a centered dialog on a tablet', () => {
    cy.viewport(820, 1180)
    visitHome([tk])
    openPicker()
    panel().should(($p) => {
      const r = $p[0].getBoundingClientRect()
      expect(r.width, '28rem wide').to.be.closeTo(448, 1)
      expect((r.left + r.right) / 2, 'centered across').to.be.closeTo(410, 1)
      expect((r.top + r.bottom) / 2, 'centered down').to.be.closeTo(590, 2)
    })
  })

  it('keeps clear of the home indicator and the notch', () => {
    cy.viewport(393, 852)
    visitHome([tk])
    cy.document().then((doc) => {
      doc.documentElement.style.setProperty('--safe-bottom', '34px')
      doc.documentElement.style.setProperty('--safe-top', '59px')
    })
    openPicker()
    cy.getBySel('cancel-picker').should(($b) => {
      expect($b[0].getBoundingClientRect().bottom, 'Cancel is above the home indicator').to.be.at.most(852 - 34 + 1)
    })
  })
})

describe('confirm dialog (web)', () => {
  beforeEach(() => {
    cy.viewport(393, 852)
    visitHome([tk, sp])
    openDiscardConfirm()
  })

  it('shows a title and the message, with a red Discard and a Keep editing', () => {
    cy.getBySel('confirm-title').should('have.text', 'Discard changes?')
    cy.getBySel('confirm-message').should('have.text', 'You have unsaved changes. Are you sure you want to discard them?')
    cy.getBySel('confirm-ok').should('contain.text', 'Discard').and('have.class', 'bg-destructive')
    cy.getBySel('confirm-cancel').should('contain.text', 'Keep editing')
  })

  it('focuses Cancel first for a destructive action', () => {
    cy.focused().should('have.attr', 'data-cy', 'confirm-cancel')
  })

  it('treats Escape as No', () => {
    cy.get('body').type('{esc}')
    cy.getBySel('confirm-sheet').should('not.exist')
    cy.getBySel('save-button').should('exist')
  })

  it('treats a tap outside as No', () => {
    cy.getBySel('sheet-backdrop').click('topLeft', { force: true })
    cy.getBySel('confirm-sheet').should('not.exist')
    cy.getBySel('save-button').should('exist')
  })

  it('leaves the page only when Discard is pressed', () => {
    cy.getBySel('confirm-ok').click()
    cy.getBySel('confirm-sheet').should('not.exist')
    cy.getBySel('race-item').should('have.length', 2)
  })
})
