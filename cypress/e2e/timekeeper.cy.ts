/// <reference types="cypress" />

import { saveAndExpectClean, rows } from './app_util'

import {
  setSecret,
  addSecret,
  addKnown,
  addEmergency,
  addStart,
  setDropped,
  checkScore,
  newTimeKeeper
} from './timekeeper_util';


describe('Time Keeper Enduro', () => {
  describe('AMA Format', () => {
    beforeEach(() => {
      newTimeKeeper(17)
    })

    it('scores correctly', () => {
      setSecret(16);         // #1
      addSecret(17);         // #2
      addEmergency(17, 30);  // #3
      addSecret(17);         // #4
      addSecret(17);         // #5
      addSecret(17);         // #6
      addEmergency(18, 23);  // #7
      addSecret(17);         // #8
      addStart(17);          // #9
      addEmergency(26, 3);   // #10
      addSecret(17, true);   // #11
      addEmergency(21, 40);  // #12
      addKnown(17);          // #13

      checkScore(12, 16, 816, false)

      // Check that dropped emergencies drop epoints
      setDropped(12, true)
      checkScore(11, 12, 566, false)

      // Check that < 15s early to known DQs
      addKnown(1)            // #14
      checkScore(12, 12, 566, true)

      // Check that dropped DQ checks don't DQ you
      setDropped(14, true)
      checkScore(11, 12, 566, false)
      saveAndExpectClean()
    })

    it('does not score invalid rows', () => {
      setSecret(18);
      addSecret(18);

      checkScore(2, 2, 0, false)

      setSecret(NaN)
      checkScore(1, 1, 0, false)
      saveAndExpectClean()
    })
  })

  describe('Brand X', () => {
    beforeEach(() => {
      newTimeKeeper(17, "BrandX")
    })

    it('Scores Properly', () => {
      setSecret(18);
      addSecret(18);

      checkScore(2, 1, 0, false)
      saveAndExpectClean()
    })

    it('does not score invalid rows', () => {
      setSecret(18);
      addSecret(18);

      checkScore(2, 1, 0, false)

      setSecret(NaN)
      checkScore(1, 1, 0, false)
      saveAndExpectClean()
    })
  })

  describe('Pressing Enter key in checkpoint', () => {
    beforeEach(() => {
      newTimeKeeper()
    })

    function verifyNumberOfChecks(expected: number) {
      cy.getBySel('tkr').its('length').should('eq', expected)
    }

    it('does nothing when the last row is blank', () => {
      cy.get('tbody tr:last-child').first().within(() => {
        cy.get('input').first().clear().type('{enter}')
      })
      verifyNumberOfChecks(1)
      saveAndExpectClean()
    })

    it('adds a check when the last row is valid, and focuses the new row', () => {
      cy.get('tbody tr:last-child').first().within(() => {
        cy.get('input').first().clear().type('17')
        cy.get('input').first().type('{enter}')
      })
      verifyNumberOfChecks(2)
      cy.get('tbody tr:last-child input').first().should('have.focus')
      saveAndExpectClean()
    })

    it('does nothing in an earlier row, even if valid', () => {
      cy.get('tbody tr:last-child').first().within(() => {
        cy.get('input').first().clear().type('17')
        cy.get('input').first().type('{enter}')
      })
      verifyNumberOfChecks(2)

      cy.get('tbody tr:first-child').first().within(() => {
        cy.get('input').first().type('{enter}')
      })
      verifyNumberOfChecks(2)
      saveAndExpectClean()
    })

    it('does nothing for an Emergency check with only a minute', () => {
      cy.get('tbody tr:last-child').first().within(() => {
        cy.get('img').first().click()
        cy.get('input').first().clear().type('17')
        cy.get('input').eq(1).clear()
        cy.get('input').first().type('{enter}')
      })
      verifyNumberOfChecks(1)
      saveAndExpectClean()
    })

    it('adds a check in seconds once an Emergency check is complete', () => {
      cy.get('tbody tr:last-child').first().within(() => {
        cy.get('img').first().click()
        cy.get('input').first().clear().type('17')
        cy.get('input').eq(1).clear().type('30')
        cy.get('input').eq(1).type('{enter}')
      })
      verifyNumberOfChecks(2)
      saveAndExpectClean()
    })
  })
  describe('Focus on add check', () => {
    function noRowInputFocused() {
      cy.getBySel('tkr').find('input:focus').should('not.exist')
    }

    beforeEach(() => {
      newTimeKeeper()
    })

    it('does not focus a row when a new enduro opens; Add Check focuses the new row only', () => {
      noRowInputFocused()
      cy.getBySel('tkr').first().find('input').first().focus()
      cy.getBySel('tkr').first().find('input').first().should('have.focus')

      cy.getBySel('add-check').first().click()
      cy.getBySel('tkr').should('have.length', 2)
      cy.getBySel('tkr').last().find('input').first().should('have.focus')
      cy.getBySel('tkr').first().find('input').first().should('not.have.focus')
    })

    describe('Flag tap keeps focus', () => {
      const firstRow = () => cy.getBySel('tkr').first()
      const flagButton = () => cy.getBySel('row-flag').first()
      const flagSrc = () => flagButton().find('img').invoke('attr', 'src')
      const rowInputs = () => firstRow().find('input:not([disabled]):not([type=checkbox])')

      it('keeps focus in the minute input when the flag changes the type', () => {
        rowInputs().first().focus()
        flagSrc().then((before: string | undefined) => {
          flagButton().click()
          flagSrc().should('not.eq', before)
        })
        rowInputs().first().should('have.focus')
      })

      it('moves focus from seconds to minute when leaving Emergency', () => {
        flagButton().click()                   // a new row is Secret -> Emergency
        rowInputs().should('have.length', 2)
        rowInputs().eq(1).focus()
        flagButton().click()                   // -> Start
        rowInputs().should('have.length', 1)
        rowInputs().first().should('have.focus')
      })

      it('does not focus anything when nothing was focused', () => {
        flagButton().click()
        noRowInputFocused()
      })
    })

    it('does not focus any row when reopening a saved race', () => {
      addSecret(17)
      saveAndExpectClean()
      cy.go('back')
      rows().first().find('[data-cy="race-edit"]').click()
      cy.getBySel('tkr').should('have.length', 2)
      noRowInputFocused()
    })
  })
})