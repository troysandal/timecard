/// <reference types="cypress" />

describe('empty spec', () => {
    let count = 0

    it('passes', () => {
      cy.visit('https://127.0.0.1:5173')
      cy.on('window:confirm', (text) => {
        return true
      });
      cy.get('button').contains('Time Keeper').first().click()      
      cy.get('div#riderMinute input').first().clear().type('10')

      addSecret(10)
      addEmergency(10, 31)

      cy.get('input#checks').should('have.value', '2')
      cy.get('input#points').should('have.value', '0')
      cy.get('input#emergencyPoints').should('have.value', '1')
      cy.get('input#disqualified').should('have.value', 'NO')
    })

    function addCheck(type: number, minute: number, seconds: number | undefined, drop?: boolean) {
      if (count !== 0) {
        cy.get('button#addCheck').first().click()
      }
      cy.get('tbody tr:last-child').first().within(() => {
        while (type > 0) {
          cy.get('img').first().click()
          type--
        }
        cy.get('input').first().clear().type(minute.toString())
        if (seconds !== undefined) {
          cy.get('input').eq(1).clear().type(seconds.toString())
        }
        if (drop) {
          cy.get('input[type="checkbox"]').check()
        }
      })
      count++
    }

    function addStart(minute: number, drop?: boolean) {
      addCheck(2, minute, undefined, drop)
    }
    function addKnown(minute: number, drop?: boolean) {
      addCheck(3, minute, undefined, drop)
    }
    function addSecret(minute: number, drop?: boolean) {
      addCheck(0, minute, undefined, drop)
    }
    function addEmergency(minute: number, seconds: number, drop?: boolean) {
      addCheck(1, minute, seconds, drop)
    }
})