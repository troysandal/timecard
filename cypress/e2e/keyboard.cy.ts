/// <reference types="cypress" />

// On-screen keyboard behavior on a small phone (see DESIGN.md "Zoom, keyboard and
// full-screen height"). The iPhone SE with the number pad up has about 407pt of web
// view (667 minus 260 for the pad and its accessory bar). The OS resizes the web view
// when the keyboard appears, so shrinking the Cypress viewport reproduces it exactly.

import { seedRace, visitHome } from './app_util'

const FULL = { width: 375, height: 667 }
const NUMBER_PAD = { width: 375, height: 407 }
const ACCESSORY_ONLY = { width: 375, height: 623 } // hardware keyboard: just the ^ v Done bar

const tk = seedRace('tk1', 'Keyboard TK', 'time_keeper', '2026-03-01T10:00:00Z')
tk.timeCard = {
  riderMinute: 1,
  format: 'AMA',
  checkpoints: [
    { type: 'start', minute: 1, seconds: 0, drop: false },
    { type: 'secret', minute: 12, seconds: 45, drop: false },
    { type: 'known', minute: 13, seconds: 20, drop: false },
    { type: 'secret', minute: 14, seconds: 5, drop: false },
    { type: 'known', minute: 15, seconds: 0, drop: false },
    { type: 'secret', minute: 16, seconds: 10, drop: false },
  ],
}

const tk11 = seedRace('tk11', 'Keyboard TK 11', 'time_keeper', '2026-03-03T10:00:00Z')
tk11.timeCard = {
  riderMinute: 1,
  format: 'AMA',
  checkpoints: Array.from({ length: 11 }, (_, i) => ({
    type: i === 0 ? 'start' : i % 2 ? 'secret' : 'known',
    minute: i + 1,
    seconds: i === 0 ? 0 : 10 + i,
    drop: false,
  })),
}

const sprint = seedRace('sp1', 'Keyboard Sprint', 'sprint', '2026-03-02T10:00:00Z')
sprint.timeCard = {
  tests: [1, 2, 3, 4, 5, 6].map((i) => ({
    enter: { hour: 9, minute: i, second: 0 },
    exit: { hour: 9, minute: i + 20, second: 31 },
  })),
}

/** Resize like the OS does when the keyboard appears, and wait until the app has laid out at that height. */
function resizeTo(size: { width: number; height: number }) {
  cy.viewport(size.width, size.height)
  cy.document().should((doc) => {
    expect(doc.documentElement.style.getPropertyValue('--app-height')).to.eq(`${size.height}px`)
  })
}

function openEdit(race: ReturnType<typeof seedRace>, id: string) {
  cy.viewport(FULL.width, FULL.height)
  visitHome([race], `#/edit/${id}`)
  cy.document().then((doc) => doc.documentElement.style.setProperty('--safe-top', '20px'))
  cy.get('table').should('be.visible')
}

/** Rows of the list that are fully visible in its scroll area. */
function visibleRows() {
  return cy.get('table').then(($t) => {
    const list = $t[0].parentElement as HTMLElement
    const thead = $t[0].querySelector('thead')!.getBoundingClientRect().height
    const row = $t[0].querySelector('tbody tr')!.getBoundingClientRect().height
    return Math.floor((list.clientHeight - thead) / row)
  })
}

describe('on-screen keyboard (time keeper)', () => {
  it('hides the score and details so at least 3 checkpoint rows are visible while typing in the list', () => {
    openEdit(tk, 'tk1')
    cy.get('tbody tr input:not([disabled]):not([type=checkbox])').first().focus()
    resizeTo(NUMBER_PAD)

    cy.getBySel('summary').should('not.be.visible')
    cy.getBySel('race-details-wrap').should('not.be.visible')
    visibleRows().should('be.at.least', 3)
    // The input being edited is still on screen.
    cy.get('tbody tr input:not([disabled]):not([type=checkbox])').first().should('be.visible')
  })

  it('brings everything back when the keyboard goes away', () => {
    openEdit(tk, 'tk1')
    cy.get('tbody tr input:not([disabled]):not([type=checkbox])').first().focus()
    resizeTo(NUMBER_PAD)
    cy.getBySel('summary').should('not.be.visible')

    cy.get('tbody tr input:not([disabled]):not([type=checkbox])').first().blur()
    resizeTo(FULL)
    cy.getBySel('summary').should('be.visible')
    cy.getBySel('race-details-wrap').should('be.visible')
  })

  it('keeps the details panel while typing in it, and only hides the score', () => {
    openEdit(tk, 'tk1')
    cy.getBySel('race-name-input').focus()
    resizeTo(NUMBER_PAD)

    cy.getBySel('summary').should('not.be.visible')
    cy.getBySel('race-details-wrap').should('be.visible')
    cy.getBySel('race-name-input').should('be.visible')
  })

  it('does nothing for the accessory bar alone (hardware keyboard)', () => {
    openEdit(tk, 'tk1')
    cy.get('tbody tr input:not([disabled]):not([type=checkbox])').first().focus()
    resizeTo(ACCESSORY_ONLY)
    cy.getBySel('summary').should('be.visible')
    cy.getBySel('race-details-wrap').should('be.visible')
  })

  it('does nothing when the viewport shrinks but nothing is focused', () => {
    openEdit(tk, 'tk1')
    cy.get('tbody tr input:focus').should('not.exist')
    resizeTo(NUMBER_PAD)
    cy.getBySel('summary').should('be.visible')
  })
})

// iPhone 17: Dynamic Island (62pt) and home indicator (34pt) insets, number pad about 302pt
// with its accessory bar.
const IPHONE_17 = { width: 402, height: 874 }
const IPHONE_17_PAD = { width: 402, height: 572 }

describe('on-screen keyboard keeps the tapped input in view', () => {
  function open17(race: ReturnType<typeof seedRace>, id: string) {
    cy.viewport(IPHONE_17.width, IPHONE_17.height)
    visitHome([race], `#/edit/${id}`)
    cy.document().then((doc) => {
      doc.documentElement.style.setProperty('--safe-top', '62px')
      doc.documentElement.style.setProperty('--safe-bottom', '34px')
    })
    cy.get('table').should('be.visible')
  }

  /** The input must sit fully inside the list's visible area. */
  function assertInView(rowIndex: number) {
    cy.get('tbody tr')
      .eq(rowIndex)
      .find('input:not([disabled]):not([type=checkbox])')
      .first()
      .then(($input) => {
        const list = $input.closest('table')[0].parentElement as HTMLElement
        const box = list.getBoundingClientRect()
        const r = $input[0].getBoundingClientRect()
        expect(r.top, 'input top vs list top').to.be.at.least(box.top)
        expect(r.bottom, 'input bottom vs list bottom').to.be.at.most(box.bottom)
      })
  }

  for (const row of [7, 9, 10]) {
    it(`time keeper, 11 rows, tapping row ${row + 1}'s minute with the list at the top`, () => {
      open17(tk11, 'tk11')
      cy.get('table').parent().scrollTo('top')
      cy.get('tbody tr')
        .eq(row)
        .find('input:not([disabled]):not([type=checkbox])')
        .first()
        .focus()
      resizeTo(IPHONE_17_PAD)
      cy.getBySel('summary').should('not.be.visible')
      assertInView(row)
    })
  }
})

describe('on-screen keyboard keeps the tapped input in view (sprint)', () => {
  it('11 tests, tapping row 11 (it fits before the keyboard, not after)', () => {
    const sp11 = seedRace('sp11', 'Keyboard Sprint 11', 'sprint', '2026-03-04T10:00:00Z')
    sp11.timeCard = {
      tests: Array.from({ length: 11 }, (_, i) => ({
        enter: { hour: 9, minute: i, second: 0 },
        exit: { hour: 9, minute: i + 20, second: 31 },
      })),
    }
    cy.viewport(IPHONE_17.width, IPHONE_17.height)
    visitHome([sp11], '#/edit/sp11')
    cy.document().then((doc) => {
      doc.documentElement.style.setProperty('--safe-top', '62px')
      doc.documentElement.style.setProperty('--safe-bottom', '34px')
    })
    cy.get('table').should('be.visible')
    // All 11 rows fit before the keyboard, so there is nothing to scroll yet.
    cy.get('tbody tr').eq(10).find('input:not([disabled])').first().focus()
    resizeTo(IPHONE_17_PAD)
    cy.getBySel('summary').should('not.be.visible')
    cy.get('tbody tr').eq(10).find('input:not([disabled])').first().then(($input) => {
      const box = ($input.closest('table')[0].parentElement as HTMLElement).getBoundingClientRect()
      const r = $input[0].getBoundingClientRect()
      expect(r.top, 'input top vs list top').to.be.at.least(box.top)
      expect(r.bottom, 'input bottom vs list bottom').to.be.at.most(box.bottom)
    })
  })
})

describe('on-screen keyboard (sprint)', () => {
  it('hides the score and name panel so at least 5 test rows are visible while typing in the list', () => {
    openEdit(sprint, 'sp1')
    cy.get('tbody tr input:not([disabled])').first().focus()
    resizeTo(NUMBER_PAD)

    cy.getBySel('summary').should('not.be.visible')
    cy.getBySel('race-details-wrap').should('not.be.visible')
    // 1.5 rows before this change; 5.9 measured with both hidden.
    visibleRows().should('be.at.least', 5)
    cy.get('tbody tr input:not([disabled])').first().should('be.visible')
  })

  it('keeps the name panel while typing in it, and brings the score back afterwards', () => {
    openEdit(sprint, 'sp1')
    cy.getBySel('race-name-input').focus()
    resizeTo(NUMBER_PAD)
    cy.getBySel('summary').should('not.be.visible')
    cy.getBySel('race-details-wrap').should('be.visible')

    cy.getBySel('race-name-input').blur()
    resizeTo(FULL)
    cy.getBySel('summary').should('be.visible')
  })
})
