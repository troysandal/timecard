/// <reference types="cypress" />

// The time-keeper table must fit a 375pt-wide phone at every supported text
// scale (see src/lib/textScale.ts and DESIGN.md "Text scaling"). The OS text
// size can't be changed from Cypress, so we set the root font size directly,
// which is exactly what textScale.ts does on iOS.

import { seedRace, visitHome } from './app_util'
import { MIN_TEXT_SCALE, MAX_TEXT_SCALE } from '../../src/lib/textScale'

const MIN_SCALE = MIN_TEXT_SCALE
const MAX_SCALE = MAX_TEXT_SCALE

const race = seedRace('tk1', 'Text Scale Sample', 'time_keeper', '2026-03-01T10:00:00Z')
race.timeCard = {
  riderMinute: 1,
  format: 'AMA',
  checkpoints: [
    { type: 'start', minute: 1, seconds: 0, drop: false },
    { type: 'secret', minute: 12, seconds: 45, drop: false },
    { type: 'known', minute: 123, seconds: 59, drop: false },
    { type: 'emergency', minute: -12, seconds: 30, drop: true },
  ],
}

const sprint = seedRace('sp1', 'Sprint Scale Sample', 'sprint', '2026-03-02T10:00:00Z')
sprint.timeCard = {
  tests: [
    { enter: { hour: 9, minute: 0, second: 0 }, exit: { hour: 9, minute: 30, second: 31 } },
    { enter: { hour: 10, minute: 45, second: 59 }, exit: { hour: 11, minute: 15, second: 8 } },
  ],
}

describe('text scaling (sprint)', () => {
  for (const scale of [MIN_SCALE, 1, MAX_SCALE]) {
    it(`sprint rows stay on one line at 375pt wide at ${scale * 100}% text`, () => {
      cy.viewport(375, 667)
      visitHome([sprint], '#/edit/sp1')
      cy.document().then((doc) => {
        doc.documentElement.style.fontSize = `${16 * scale}px`
      })
      cy.get('table').should('be.visible')

      // The six time inputs of each row share one line (no wrapped seconds field).
      cy.get('tbody tr').each(($row) => {
        const tops = [...$row[0].querySelectorAll('input:not([disabled])')].map((e) =>
          Math.round(e.getBoundingClientRect().top)
        )
        expect(tops.length).to.eq(6)
        expect(new Set(tops).size, `time inputs wrapped (tops=${tops})`).to.eq(1)
      })

      // No horizontal scrolling up to 100% text. At the 130% cap a full row (two
      // times and a score) does not fit 375pt, so it scrolls sideways instead of
      // wrapping; stacking In/Out is the restyle in spec step 10d.
      if (scale <= 1) {
        cy.get('table')
          .parent()
          .then(($c) => {
            expect($c[0].scrollWidth, 'table scrollWidth').to.be.at.most($c[0].clientWidth)
          })
      }
      // No clipped digits at any scale.
      cy.get('tbody tr input:not([disabled])').each(($input) => {
        expect($input[0].scrollWidth, `input "${$input.val()}" scrollWidth`).to.be.at.most(
          $input[0].clientWidth
        )
      })
    })
  }
})

describe('text scaling', () => {
  for (const scale of [MIN_SCALE, 1, MAX_SCALE]) {
    it(`time-keeper table fits 375pt wide at ${scale * 100}% text`, () => {
      cy.viewport(375, 667)
      visitHome([race], '#/edit/tk1')
      cy.document().then((doc) => {
        doc.documentElement.style.fontSize = `${16 * scale}px`
      })
      cy.get('table').should('be.visible')

      // No horizontal scrolling inside the table's scroll container.
      cy.get('table')
        .parent()
        .then(($c) => {
          expect($c[0].scrollWidth, 'table scrollWidth').to.be.at.most($c[0].clientWidth)
        })

      // No clipped numbers in the editable cells.
      cy.get('tbody tr input:not([disabled]):not([type=checkbox])').each(($input) => {
        expect($input[0].scrollWidth, `input "${$input.val()}" scrollWidth`).to.be.at.most(
          $input[0].clientWidth
        )
      })

      // The four score stats stay on one row (no orphaned "# Checks").
      cy.get('[data-cy=score-points], [data-cy=score-epoints], [data-cy=score-disqualified], [data-cy=score-checks]').then(
        ($stats) => {
          const tops = [...$stats].map((e) => Math.round(e.getBoundingClientRect().top))
          expect(new Set(tops).size, `score footer rows (tops=${tops})`).to.eq(1)
        }
      )

      // Inputs are at least 16px so iOS never auto-zooms on focus.
      cy.get('tbody tr input:not([disabled]):not([type=checkbox])')
        .first()
        .then(($input) => {
          expect(parseFloat(getComputedStyle($input[0]).fontSize)).to.be.at.least(16)
        })
    })
  }
})
