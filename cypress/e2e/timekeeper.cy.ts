/// <reference types="cypress" />

describe('empty spec', () => {
    let count = 0

    it('passes', () => {
      cy.visit('http://127.0.0.1:5173')
      cy.on('window:confirm', (text) => {
        console.log(text);
        return true
      });
      cy.get('button').contains('Time Keeper').first().click()      
      cy.get('div#riderMinute input').first().clear().type('17')

      addSecret(16)
      addSecret(17)
      addEmergency(17, 30)
      addSecret(17)
      addSecret(17)
      addSecret(17)
      addEmergency(18, 23)
      addSecret(17)
      addStart(17)
      addEmergency(26, 3)
      addSecret(17, true)
      addEmergency(21, 40)
      addKnown(17)

      cy.get('input#checks').should('have.value', '12')
      cy.get('input#points').should('have.value', '16')
      cy.get('input#emergencyPoints').should('have.value', '816')
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