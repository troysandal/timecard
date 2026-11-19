/// <reference types="cypress" />

import {
  seedRace,
  visitHome,
  expectNoConfirm,
  openRaceActions,
  deleteRow,
  rows,
  rowNames,
  addRace,
} from './app_util'

const TK_OLD = seedRace('tk1', 'Old Time Keeper', 'time_keeper', '2026-01-01T10:00:00Z')
const SP_MID = seedRace('sp1', 'Middle Sprint', 'sprint', '2026-02-01T10:00:00Z')
const TK_NEW = seedRace('tk2', 'New Time Keeper', 'time_keeper', '2026-03-01T10:00:00Z')

describe('Home Page', () => {
  describe('empty state', () => {
    beforeEach(() => visitHome())

    it('shows title, add button and empty message', () => {
      cy.contains('h2', 'Enduro Score Cards').should('be.visible')
      cy.getBySel('add-enduro').should('be.visible')
      cy.getBySel('empty-state').should('contain.text', 'No items yet.').and('contain.text', 'Tap + below')
      cy.getBySel('race-list').should('not.exist')
    })
  })

  describe('type picker', () => {
    beforeEach(() => visitHome())

    it('opens with both race types', () => {
      cy.getBySel('add-enduro').click()
      cy.getBySel('race-picker').should('be.visible')
      cy.getBySel('add-time-keeper').should('be.visible')
      cy.getBySel('add-sprint').should('be.visible')
    })

    it('cancel closes it without creating a race', () => {
      cy.getBySel('add-enduro').click()
      cy.getBySel('cancel-picker').click()
      cy.getBySel('race-picker').should('not.exist')
      cy.getBySel('empty-state').should('be.visible')
      cy.location('hash').should('eq', '#/')
    })
  })

  describe('creating races', () => {
    beforeEach(() => visitHome())

    it('creates a Time Keeper and lists it on Home', () => {
      addRace('time_keeper')
      cy.location('hash').should('match', /^#\/edit\/.+/)
      cy.getBySel('race-name-input').should('have.value', 'Untitled Time Keeper')

      cy.getBySel('back-button').click()
      cy.location('hash').should('eq', '#/')
      rows().should('have.length', 1)
      cy.getBySel('race-name').should('have.text', 'Untitled Time Keeper')
      cy.getBySel('type-badge').should('contain.text', 'Time Keeper')
      cy.getBySel('empty-state').should('not.exist')
    })

    it('creates a Sprint and lists it on Home', () => {
      addRace('sprint')
      cy.getBySel('race-name-input').should('have.value', 'Untitled Sprint')

      cy.getBySel('back-button').click()
      rows().should('have.length', 1)
      cy.getBySel('race-name').should('contain.text', 'Untitled Sprint')
      cy.getBySel('type-badge').should('contain.text', 'Sprint')
    })

    it('lists newest first', () => {
      addRace('time_keeper')
      cy.getBySel('back-button').click()
      // createdAt has ms resolution; make sure the second race is strictly newer
      cy.wait(10)
      addRace('sprint')
      cy.getBySel('back-button').click()

      rows().should('have.length', 2)
      rowNames().eq(0).should('contain.text', 'Untitled Sprint')
      rowNames().eq(1).should('contain.text', 'Untitled Time Keeper')
    })

    it('persists created races across reload', () => {
      addRace('sprint')
      cy.getBySel('back-button').click()
      cy.reload()
      rows().should('have.length', 1)
      cy.getBySel('race-name').should('contain.text', 'Untitled Sprint')
    })
  })

  describe('listing seeded races', () => {
    it('sorts by createdAt, newest first', () => {
      visitHome([TK_OLD, TK_NEW, SP_MID])
      rows().should('have.length', 3)
      rowNames().eq(0).should('contain.text', 'New Time Keeper')
      rowNames().eq(1).should('contain.text', 'Middle Sprint')
      rowNames().eq(2).should('contain.text', 'Old Time Keeper')
    })

    it('shows the right badge per race type', () => {
      visitHome([TK_NEW, SP_MID])
      rows().eq(0).find('[data-cy="type-badge"]').should('contain.text', 'Time Keeper')
      rows().eq(1).find('[data-cy="type-badge"]').should('contain.text', 'Sprint')
    })

    it('shows "Untitled" for an unnamed race', () => {
      visitHome([seedRace('x', '', 'sprint', '2026-04-01T10:00:00Z')])
      cy.getBySel('race-name').should('contain.text', 'Untitled')
    })
  })

  describe('editing', () => {
    it('opens a Time Keeper from the list', () => {
      visitHome([TK_NEW])
      cy.getBySel('race-edit').click()
      cy.location('hash').should('eq', '#/edit/tk2')
      cy.getBySel('race-name-input').should('have.value', 'New Time Keeper')
      cy.getBySel('format-select').should('exist')
    })

    it('opens a Sprint from the list', () => {
      visitHome([SP_MID])
      cy.getBySel('race-edit').click()
      cy.location('hash').should('eq', '#/edit/sp1')
      cy.getBySel('race-name-input').should('have.value', 'Middle Sprint')
      cy.getBySel('add-test').should('exist')
    })

    it('saves a rename and shows it on Home, even after reload', () => {
      visitHome([TK_NEW])
      cy.getBySel('race-edit').click()
      cy.getBySel('race-name-input').clear().type('Renamed Race')
      cy.getBySel('save-button').click()
      cy.getBySel('save-button').should('contain.text', 'Saved')
      cy.getBySel('back-button').click()

      cy.getBySel('race-name').should('contain.text', 'Renamed Race')
      cy.reload()
      cy.getBySel('race-name').should('contain.text', 'Renamed Race')
    })
  })

  describe('deleting', () => {
    beforeEach(() => visitHome([TK_OLD, SP_MID, TK_NEW]))

    it('keeps the race when the menu is cancelled', () => {
      openRaceActions(rows().eq(0))
      cy.getBySel('race-actions-cancel').click()
      cy.getBySel('race-actions').should('not.exist')
      rows().should('have.length', 3)
    })

    it('keeps the race when the menu is dismissed with a tap outside', () => {
      openRaceActions(rows().eq(0))
      cy.getBySel('sheet-backdrop').click('topLeft', { force: true })
      cy.getBySel('race-actions').should('not.exist')
      rows().should('have.length', 3)
    })

    it('removes only the chosen race, without a second confirm', () => {
      deleteRow(rows().eq(1)) // Middle Sprint
      expectNoConfirm()
      rows().should('have.length', 2)
      rowNames().eq(0).should('contain.text', 'New Time Keeper')
      rowNames().eq(1).should('contain.text', 'Old Time Keeper')
    })

    it('shows the empty state after deleting the last race', () => {
      for (let i = 3; i > 0; i--) {
        rows().should('have.length', i)
        deleteRow(rows().first())
      }
      cy.getBySel('empty-state').should('be.visible')
      cy.getBySel('race-list').should('not.exist')
    })

    it('opens the menu on a real long press and does not open Edit', () => {
      cy.clock()
      rows().eq(0).find('[data-cy="race-edit"]')
        .trigger('pointerdown', { pointerType: 'touch', clientX: 50, clientY: 50 })
      cy.tick(500)
      // The finger lifts over the row; the click that follows must not open Edit.
      rows().eq(0).find('[data-cy="race-edit"]')
        .trigger('pointerup', { pointerType: 'touch', force: true })
        .trigger('click', { force: true })
      cy.getBySel('race-actions').should('be.visible')
      cy.location('hash').should('not.contain', '/edit/')
    })

    it('focuses Cancel first, so Enter right after opening cannot delete', () => {
      openRaceActions(rows().eq(0))
      cy.focused().should('have.attr', 'data-cy', 'race-actions-cancel')
    })

    it('does not swallow the next tap after the menu was opened by the context-menu gesture', () => {
      openRaceActions(rows().eq(0))
      cy.getBySel('race-actions-cancel').click()
      cy.getBySel('race-actions').should('not.exist')
      rows().eq(0).find('[data-cy="race-edit"]').click()
      cy.location('hash').should('contain', '/edit/')
    })

    it('still opens Edit on a short tap', () => {
      rows().eq(0).find('[data-cy="race-edit"]').click()
      cy.location('hash').should('contain', '/edit/')
      cy.getBySel('race-actions').should('not.exist')
    })

    it('persists a deletion across reload', () => {
      deleteRow(rows().eq(0))
      rows().should('have.length', 2)
      cy.reload()
      rows().should('have.length', 2)
      cy.contains('[data-cy="race-name"]', 'New Time Keeper').should('not.exist')
    })
  })

  describe('deep links', () => {
    it('opens Edit directly for a known id, and Back goes Home', () => {
      visitHome([TK_NEW], '#/edit/tk2')
      cy.getBySel('race-name-input').should('have.value', 'New Time Keeper')
      cy.getBySel('back-button').click()
      cy.location('hash').should('eq', '#/')
      rows().should('have.length', 1)
    })

    it('falls back to Home for an unknown id', () => {
      visitHome([TK_NEW], '#/edit/bogus')
      cy.location('hash').should('eq', '#/')
      rows().should('have.length', 1)
      cy.getBySel('race-name-input').should('not.exist')
    })
  })
})

describe('Home layout', () => {
  it('scrolls the list inside its own section while the header and Add stay put', () => {
    cy.viewport(375, 667)
    const many = Array.from({ length: 25 }, (_, i) =>
      seedRace(`r${i}`, `Race ${i}`, 'time_keeper', `2026-01-${String(i + 1).padStart(2, '0')}T10:00:00Z`),
    )
    visitHome(many)
    cy.getBySel('race-item').first().should('be.visible')
    cy.get('main').then(($m) => {
      expect($m[0].scrollHeight).to.be.greaterThan($m[0].clientHeight)
      $m[0].scrollTop = 400
    })
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollHeight).to.be.at.most(doc.documentElement.clientHeight)
    })
    cy.contains('h2', 'Enduro Score Cards').should('be.visible')
    cy.getBySel('add-enduro').should('be.visible')
  })
})
