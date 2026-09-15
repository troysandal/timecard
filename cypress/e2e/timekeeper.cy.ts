/// <reference types="cypress" />

import {
  setSecret,
  addSecret,
  addKnown,
  addEmergency,
  addStart,
  setDropped
} from './timekeeper_util';


describe('Time Keeper Enduro', () => {
  function selectFormat(format: "AMA" | "BrandX") {
    cy.get('[data-cy="format-select"]').select(format);
    cy.get('[data-cy="format-select"]').should('have.value', format)
  }

  function checkScore(checks: number, points: number, epoints: number, dq: boolean) {
    cy.get('input#checks').should('have.value', checks)
    cy.get('input#points').should('have.value', points)
    cy.get('input#emergencyPoints').should('have.value', epoints)
    cy.get('input#disqualified').should('have.value', dq ? "YES" : "NO")
  }

  describe('AMA Format', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.on('window:confirm', (text) => {
        return true
      });
      cy.get('button').contains('Time Keeper').first().click()
      cy.get('div#riderMinute input').first().clear().type('17')
      selectFormat("AMA")
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
    })

    it('does not score invalid rows', () => {
      setSecret(18);
      addSecret(18);

      checkScore(2, 2, 0, false)

      setSecret(NaN)
      checkScore(1, 1, 0, false)
    })
  })

  describe('Brand X', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.on('window:confirm', (text) => {
        return true
      });
      cy.get('button').contains('Time Keeper').first().click()
      cy.get('div#riderMinute input').first().clear().type('17')
      selectFormat("BrandX")
    })

    it('Scores Properly', () => {
      setSecret(18);
      addSecret(18);

      checkScore(2, 1, 0, false)
    })

    it('does not score invalid rows', () => {
      setSecret(18);
      addSecret(18);

      checkScore(2, 1, 0, false)

      setSecret(NaN)
      checkScore(1, 1, 0, false)
    })
  })

  describe('Pressing Enter key in checkpoint', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.on('window:confirm', (text) => {
        return true
      });
      cy.get('button').contains('Time Keeper').first().click()
    })

    function verifyNumberOfChecks(expected: number) {
      cy.get('[data-cy="tkr"]').its('length').should('eq', expected)
    }

    it('does nothing when the last row is blank', () => {
      cy.get('tbody tr:last-child').first().within(() => {
        cy.get('input').first().type('{enter}')
      })
      verifyNumberOfChecks(1)
    })

    it('adds a check when the last row is valid, and focuses the new row', () => {
      cy.get('tbody tr:last-child').first().within(() => {
        cy.get('input').first().clear().type('17')
        cy.get('input').first().type('{enter}')
      })
      verifyNumberOfChecks(2)
      cy.get('tbody tr:last-child input').first().should('have.focus')
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
    })

    it('does nothing for an Emergency check with only a minute', () => {
      cy.get('tbody tr:last-child').first().within(() => {
        cy.get('img').first().click()
        cy.get('input').first().clear().type('17')
        cy.get('input').first().type('{enter}')
      })
      verifyNumberOfChecks(1)
    })

    it('adds a check in seconds once an Emergency check is complete', () => {
      cy.get('tbody tr:last-child').first().within(() => {
        cy.get('img').first().click()
        cy.get('input').first().clear().type('17')
        cy.get('input').eq(1).clear().type('30')
        cy.get('input').eq(1).type('{enter}')
      })
      verifyNumberOfChecks(2)
    })
  })
})