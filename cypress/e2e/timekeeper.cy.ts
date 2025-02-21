/// <reference types="cypress" />

describe('Time Keeper Enduros', () => {
    let count = 0

    it('passes', () => {
      cy.visit('/')
      cy.on('window:confirm', (text) => {
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
      checkScore(12, 16, 816, false)

      // Check the dropped emergencies drop epoints
      setDropped(11, true)
      checkScore(11, 12, 566, false)

      // Check that < 15 DQs on knowns
      addKnown(1)
      checkScore(12, 12, 566, true)

      // Check that dropped DQ checks don't DQ you
      setDropped(13, true)
      checkScore(11, 12, 566, false)
    })

    function checkScore(checks: number, points: number, epoints: number, dq: boolean) {
      cy.get('input#checks').should('have.value', checks)
      cy.get('input#points').should('have.value', points)
      cy.get('input#emergencyPoints').should('have.value', epoints)
      cy.get('input#disqualified').should('have.value', dq ? "YES" : "NO")
    }

    function setDropped(check: number, dropCheck: boolean) {
      const element = cy.get('input[type="checkbox"]').eq(check)

      if (dropCheck) {
        element.check()
      } else {
        element.uncheck()
      }
    }

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