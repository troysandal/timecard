/// <reference types="cypress" />

import {
  seedRace,
  visitHome,
  setConfirm,
  rows,
  rowNames,
  addRace,
  openRace,
  expectClean,
  expectDirty,
  saveAndExpectClean,
  confirmCalls,
  UNSAVED_MSG,
} from './app_util'

const TK = seedRace('tk1', 'Time Keeper Race', 'time_keeper', '2026-03-01T10:00:00Z')
const SP = seedRace('sp1', 'Sprint Race', 'sprint', '2026-02-01T10:00:00Z')

const rename = (name: string) => cy.getBySel('race-name-input').clear().type(name)
const nameInput = () => cy.getBySel('race-name-input')

// Each race kind gets the same suite, plus a few kind specific edits.
const kinds = [
  { label: 'Time Keeper', race: TK, id: 'tk1', name: 'Time Keeper Race', type: 'time_keeper' as const },
  { label: 'Sprint', race: SP, id: 'sp1', name: 'Sprint Race', type: 'sprint' as const },
]

describe('Edit Page', () => {
  // Cypress hangs starting the next test if one ends on a dirty Edit page
  // whose back navigation was declined (popstate re-pushed the Edit entry).
  // Always leave the Edit page, discarding anything unsaved, when a test ends.
  afterEach(() => {
    cy.location('hash').then((hash) => {
      if (!hash.startsWith('#/edit/')) return
      setConfirm(true)
      cy.go('back')
      cy.location('hash').should('eq', '#/')
    })
  })

  kinds.forEach(({ label, race, id, name, type }) => {
    const hash = `#/edit/${id}`

    describe(`${label}: dirty indicator`, () => {
      it('is clean when a seeded race is opened', () => {
        openRace([race])
        expectClean()
      })

      it('is clean when a new race is created', () => {
        visitHome()
        addRace(type)
        expectClean()
      })

      it('goes dirty on rename, and clean again when the name is restored', () => {
        openRace([race])
        rename('Something Else')
        expectDirty()
        rename(name)
        expectClean()
      })
    })

    describe(`${label}: Save button`, () => {
      it('saves, goes clean, and persists across reload', () => {
        openRace([race])
        rename('Saved Name')
        saveAndExpectClean()

        cy.reload()
        cy.location('hash').should('eq', hash)
        nameInput().should('have.value', 'Saved Name')
        expectClean()
      })

      it('goes dirty again when edited after a save', () => {
        openRace([race])
        rename('First')
        saveAndExpectClean()
        rename('Second')
        expectDirty()
        saveAndExpectClean()
      })

      it('is harmless when clicked while clean', () => {
        openRace([race])
        cy.getBySel('save-button').click()
        expectClean()
        cy.reload()
        nameInput().should('have.value', name)
        expectClean()
      })

      it('lets you leave with Back without a confirm after saving', () => {
        openRace([race])
        rename('Saved Name')
        saveAndExpectClean()
        cy.getBySel('back-button').click()
        cy.location('hash').should('eq', '#/')
        confirmCalls(0)
        rowNames().eq(0).should('contain.text', 'Saved Name')
      })
    })

    describe(`${label}: Back button`, () => {
      it('goes Home without a confirm when clean', () => {
        openRace([race])
        cy.getBySel('back-button').click()
        cy.location('hash').should('eq', '#/')
        rows().should('have.length', 1)
        confirmCalls(0)
      })

      it('stays on Edit when the discard confirm is declined', () => {
        openRace([race])
        rename('Unsaved')
        setConfirm(false)
        cy.getBySel('back-button').click()

        cy.get('@confirmStub').should('have.been.calledOnceWith', UNSAVED_MSG)
        cy.location('hash').should('eq', hash)
        nameInput().should('have.value', 'Unsaved')
        expectDirty()
      })

      it('can still leave after declining once', () => {
        openRace([race])
        rename('Unsaved')
        setConfirm(false)
        cy.getBySel('back-button').click()
        cy.location('hash').should('eq', hash)

        setConfirm(true)
        cy.getBySel('back-button').click()
        confirmCalls(2)
        cy.location('hash').should('eq', '#/')
        rowNames().eq(0).should('contain.text', name)
      })

      it('discards the edits when the confirm is accepted', () => {
        openRace([race])
        rename('Unsaved')
        cy.getBySel('back-button').click()
        cy.location('hash').should('eq', '#/')
        rowNames().eq(0).should('contain.text', name)

        rows().eq(0).find('[data-cy="race-edit"]').click()
        nameInput().should('have.value', name)
        expectClean()
      })
    })

    describe(`${label}: browser back and forward`, () => {
      it('goes Home without a confirm when clean', () => {
        openRace([race])
        cy.go('back')
        cy.location('hash').should('eq', '#/')
        rows().should('have.length', 1)
        confirmCalls(0)
      })

      it('stays on Edit when dirty and the confirm is declined', () => {
        openRace([race])
        rename('Unsaved')
        setConfirm(false)
        cy.go('back')

        cy.get('@confirmStub').should('have.been.calledOnceWith', UNSAVED_MSG)
        cy.location('hash').should('eq', hash)
        nameInput().should('have.value', 'Unsaved')
        expectDirty()
      })

      it('goes Home and discards when dirty and the confirm is accepted', () => {
        openRace([race])
        rename('Unsaved')
        cy.go('back')

        cy.location('hash').should('eq', '#/')
        confirmCalls(1)
        rowNames().eq(0).should('contain.text', name)
        cy.reload()
        rowNames().eq(0).should('contain.text', name)
      })

      it('asks again on every back attempt after a decline', () => {
        openRace([race])
        rename('Unsaved')
        setConfirm(false)
        cy.go('back')
        cy.location('hash').should('eq', hash)
        cy.go('back')
        cy.location('hash').should('eq', hash)
        confirmCalls(2)

        setConfirm(true)
        cy.go('back')
        cy.location('hash').should('eq', '#/')
        confirmCalls(3)
      })

      it('does not ask after a save', () => {
        openRace([race])
        rename('Saved Name')
        saveAndExpectClean()
        cy.go('back')
        cy.location('hash').should('eq', '#/')
        confirmCalls(0)
      })

      it('reopens the saved race on forward, clean', () => {
        openRace([race])
        rename('Saved Name')
        saveAndExpectClean()
        cy.go('back')
        cy.location('hash').should('eq', '#/')

        cy.go('forward')
        cy.location('hash').should('eq', hash)
        nameInput().should('have.value', 'Saved Name')
        expectClean()
      })

      it('reopens the original values on forward after a discard, clean', () => {
        openRace([race])
        rename('Unsaved')
        cy.go('back')
        cy.location('hash').should('eq', '#/')

        cy.go('forward')
        cy.location('hash').should('eq', hash)
        nameInput().should('have.value', name)
        expectClean()
      })

      it('guards a deep linked Edit page too', () => {
        visitHome([race], hash)
        rename('Unsaved')
        setConfirm(false)
        cy.go('back')
        cy.location('hash').should('eq', hash)
        nameInput().should('have.value', 'Unsaved')

        setConfirm(true)
        cy.go('back')
        cy.location('hash').should('eq', '#/')
        rows().should('have.length', 1)
      })
    })
  })

  describe('Time Keeper: what makes it dirty', () => {
    beforeEach(() => openRace([TK]))

    it('rider minute', () => {
      cy.getBySel('rider-minute').first().clear().type('17')
      expectDirty()
    })

    it('format', () => {
      cy.getBySel('format-select').select('BrandX')
      expectDirty()
      cy.getBySel('format-select').select('AMA')
      expectClean()
    })

    it('adding a check', () => {
      cy.getBySel('add-check').first().click()
      expectDirty()
    })
  })

  describe('Sprint: what makes it dirty', () => {
    beforeEach(() => openRace([SP]))

    it('adding a test', () => {
      cy.getBySel('add-test').first().click()
      expectDirty()
    })

    it('entering a time', () => {
      cy.getBySel('add-test').first().click()
      saveAndExpectClean()
      cy.get('tbody tr:last-child input.enterTime').eq(0).clear().type('09')
      expectDirty()
    })
  })

  describe('multiple races', () => {
    it('does not carry dirty state from a discarded race into the next one', () => {
      openRace([TK, SP], 0)
      rename('Unsaved')
      expectDirty()
      cy.getBySel('back-button').click()
      cy.location('hash').should('eq', '#/')

      rows().eq(1).find('[data-cy="race-edit"]').click()
      cy.location('hash').should('eq', '#/edit/sp1')
      nameInput().should('have.value', 'Sprint Race')
      expectClean()

      // and leaving the clean race must not prompt
      cy.getBySel('back-button').click()
      cy.location('hash').should('eq', '#/')
      confirmCalls(1)
    })
  })
})
