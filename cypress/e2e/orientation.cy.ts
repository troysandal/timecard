/// <reference types="cypress" />

// Orientation and tablets (see DESIGN.md "Orientation and tablets"). Native phones are locked
// to portrait, so these cover what the web build and PWA must handle themselves: tablets in
// every orientation and Split View widths, and a phone held sideways.

import { seedRace, visitHome } from './app_util'

const tk = seedRace('tk1', 'Orientation TK', 'time_keeper', '2026-03-01T10:00:00Z')
tk.timeCard = {
  riderMinute: 1,
  format: 'AMA',
  checkpoints: [1, 2, 3, 4, 5, 6].map((i) => ({
    type: i === 1 ? 'start' : i % 2 ? 'known' : 'secret',
    minute: i,
    seconds: i * 7,
    drop: false,
  })),
}
const tk11 = seedRace('tk11', 'Orientation TK 11', 'time_keeper', '2026-03-03T10:00:00Z')
tk11.timeCard = {
  riderMinute: 1,
  format: 'AMA',
  checkpoints: Array.from({ length: 11 }, (_, i) => ({
    type: i === 0 ? 'start' : i % 2 ? 'secret' : 'known',
    minute: i + 1,
    seconds: 10 + i,
    drop: false,
  })),
}

const sprint = seedRace('sp1', 'Orientation Sprint', 'sprint', '2026-03-02T10:00:00Z')
sprint.timeCard = {
  tests: [1, 2, 3].map((i) => ({
    enter: { hour: 9, minute: i, second: 0 },
    exit: { hour: 9, minute: i + 20, second: 31 },
  })),
}

const COLUMN = 672 // max-w-2xl

const TABLETS = [
  { name: 'iPad portrait', width: 820, height: 1180 },
  { name: 'iPad landscape', width: 1180, height: 820 },
  { name: 'iPad mini portrait', width: 744, height: 1133 },
  { name: 'iPad mini landscape', width: 1133, height: 744 },
  { name: 'Split View, one third', width: 375, height: 1024 },
  { name: 'Split View, half', width: 507, height: 1024 },
]

const SIDEWAYS_PHONES = [
  { name: 'iPhone 15 landscape', width: 852, height: 393 },
  { name: 'iPhone SE landscape', width: 667, height: 375 },
  { name: 'iPhone Pro Max landscape', width: 932, height: 430 },
]

describe('tablets: a centered column in every orientation', () => {
  for (const t of TABLETS) {
    describe(t.name, () => {
      beforeEach(() => cy.viewport(t.width, t.height))

      it('Home has no sideways overflow and keeps a centered column', () => {
        visitHome([tk, sprint])
        cy.getBySel('race-list').should('be.visible')
        cy.window().then((win) => {
          expect(win.document.documentElement.scrollWidth, 'page scroll width').to.be.at.most(win.innerWidth)
          const main = win.document.querySelector('main') as HTMLElement
          const r = main.getBoundingClientRect()
          expect(r.width, 'column width').to.be.at.most(COLUMN)
          expect(Math.abs(r.left - (win.innerWidth - r.right)), 'left and right margins match').to.be.at.most(1)
        })
      })

      for (const [label, race, id] of [['time keeper', tk, 'tk1'], ['sprint', sprint, 'sp1']] as const) {
        it(`Edit ${label}: centered column, nothing clipped, whole page fits`, () => {
          visitHome([race], `#/edit/${id}`)
          cy.get('table').should('be.visible')
          cy.window().then((win) => {
            const d = win.document
            expect(d.documentElement.scrollWidth, 'page scroll width').to.be.at.most(win.innerWidth)
            const app = d.querySelector('.h-app') as HTMLElement
            const r = app.getBoundingClientRect()
            expect(r.width, 'column width').to.be.at.most(COLUMN)
            expect(Math.abs(r.left - (win.innerWidth - r.right)), 'margins match').to.be.at.most(1)
            // Tall enough: the page never scrolls (only the list does).
            expect(app.scrollHeight, 'page scroll height').to.be.at.most(app.clientHeight)
            const list = d.querySelector('table')!.parentElement as HTMLElement
            expect(list.scrollWidth, 'list scroll width').to.be.at.most(list.clientWidth)
          })
        })
      }
    })
  }
})

describe('a phone held sideways (web and PWA only; native is locked to portrait)', () => {
  for (const p of SIDEWAYS_PHONES) {
    describe(p.name, () => {
      beforeEach(() => cy.viewport(p.width, p.height))

      for (const [label, race, id, addButton] of [
        ['time keeper', tk, 'tk1', 'add-check'],
        ['sprint', sprint, 'sp1', 'add-test'],
      ] as const) {
        it(`Edit ${label}: the page scrolls and the list keeps at least 2 rows`, () => {
          visitHome([race], `#/edit/${id}`)
          cy.get('table').should('be.visible')
          cy.window().then((win) => {
            const d = win.document
            const app = d.querySelector('.h-app') as HTMLElement
            // Short screen: the page itself scrolls instead of squeezing the list to nothing.
            expect(app.scrollHeight, 'page can scroll').to.be.greaterThan(app.clientHeight)
            const list = d.querySelector('table')!.parentElement as HTMLElement
            const thead = d.querySelector('thead')!.getBoundingClientRect().height
            const row = d.querySelector('tbody tr')!.getBoundingClientRect().height
            expect(Math.floor((list.clientHeight - thead) / row), 'rows visible in the list').to.be.at.least(2)
          })
        })

        it(`Edit ${label}: the add button is tappable and the score is reachable`, () => {
          visitHome([race], `#/edit/${id}`)
          cy.get('table').should('be.visible')
          cy.getBySel(addButton).scrollIntoView().then(($b) => {
            const r = $b[0].getBoundingClientRect()
            const top = $b[0].ownerDocument.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
            expect($b[0].contains(top), 'nothing covers the add button').to.eq(true)
          })
          cy.getBySel('summary').scrollIntoView().should('be.visible')
        })
      }
    })
  }

  it('with the keyboard up, the focused row stays on screen (two scrollers: the list and the page)', () => {
    cy.viewport(852, 393)
    visitHome([tk11], '#/edit/tk11')
    cy.get('table').should('be.visible')
    cy.get('tbody tr').last().find('input:not([disabled]):not([type=checkbox])').first().focus()
    // 193px of keyboard leaves 200px: less than the header plus the 288px list.
    cy.viewport(852, 200)
    cy.document().should((doc) => {
      expect(doc.documentElement.style.getPropertyValue('--app-height')).to.eq('200px')
    })
    cy.getBySel('summary').should('not.be.visible')
    cy.get('tbody tr').last().find('input:not([disabled]):not([type=checkbox])').first().then(($input) => {
      const win = $input[0].ownerDocument.defaultView as Window
      const r = $input[0].getBoundingClientRect()
      expect(r.top, 'input top is on screen').to.be.at.least(0)
      expect(r.bottom, 'input bottom is on screen').to.be.at.most(win.innerHeight)
    })
  })

  it('a portrait phone with the keyboard up is not mistaken for a sideways phone', () => {
    // 375x407 is an iPhone SE with the number pad up: under 500px tall, but portrait.
    cy.viewport(375, 407)
    visitHome([tk], '#/edit/tk1')
    cy.get('table').should('be.visible')
    cy.get('.h-app').then(($a) => {
      expect(getComputedStyle($a[0]).overflowY, 'root keeps overflow hidden').to.eq('hidden')
    })
    // The sideways layout pins the list at 18rem with flex-none; none of that may leak in.
    cy.get('table').then(($t) => {
      const section = getComputedStyle($t.closest('section')[0])
      expect(section.flexGrow, 'list section still flexes').to.eq('1')
    })
  })

  it('a tall phone is unchanged: the page does not scroll', () => {
    cy.viewport(393, 852)
    visitHome([tk], '#/edit/tk1')
    cy.get('table').should('be.visible')
    cy.get('.h-app').then(($a) => {
      expect($a[0].scrollHeight).to.be.at.most($a[0].clientHeight)
    })
  })
})
