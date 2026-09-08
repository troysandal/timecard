/// <reference types="cypress" />

describe('Time Keeper Enduro', () => {
  describe('AMA Format', () => {
      let count = 0

      it('scores correctly', () => {
        cy.visit('/')
        cy.on('window:confirm', (text) => {
          return true
        });
        cy.get('button').contains('Time Keeper').first().click()      
        cy.get('div#riderMinute input').first().clear().type('17')

        addSecret(16);         // #1
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

      function checkScore(checks: number, points: number, epoints: number, dq: boolean) {
        cy.get('input#checks').should('have.value', checks)
        cy.get('input#points').should('have.value', points)
        cy.get('input#emergencyPoints').should('have.value', epoints)
        cy.get('input#disqualified').should('have.value', dq ? "YES" : "NO")
      }

      function setDropped(check: number, dropCheck: boolean) {
        const element = cy.get('input[type="checkbox"]').eq(check - 1)

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

  describe('Pressing Enter key in checkpoint', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.on('window:confirm', (text) => {
        return true
      });
      cy.get('button').contains('Time Keeper').first().click()
    })

    function verifyNumberOfChecks(expected: number) {
      cy.get('input#checks').should('have.value', expected)
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