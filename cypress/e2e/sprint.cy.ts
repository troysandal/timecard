/// <reference types="cypress" />

describe('empty spec', () => {
  function createTest(enter: string, exit: string) {
    cy.get('button#addTest').first().click()
    cy.get('tbody tr:last-child').within(() => {
      let fragments = enter.split(':')
      cy.get('input.enterTime').eq(0).clear().type(fragments[0])
      cy.get('input.enterTime').eq(1).clear().type(fragments[1])
      cy.get('input.enterTime').eq(2).clear().type(fragments[2])
      fragments = exit.split(':')
      cy.get('input.exitTime').eq(0).clear().type(fragments[0])
      cy.get('input.exitTime').eq(1).clear().type(fragments[1])
      cy.get('input.exitTime').eq(2).clear().type(fragments[2])
    })
  }

  it('passes', () => {
    cy.visit('https://127.0.0.1:5173')
    cy.on('window:confirm', (text) => {
      return true
    });
    cy.get('button').contains('Sprint').first().click()
    
    cy.get('tbody tr:last-child button').first().click()

    createTest('09:18:00', '09:47:19')
    createTest('09:56:20', '10:03:32')
    createTest('10:32:40', '11:20:01')
    createTest('12:28:20', '12:53:09')
    createTest('12:59:40', '13:06:10')
    createTest('13:22:00', '14:09:04')
    createTest('14:21:40', '14:24:28')

    cy.get('span.score').should('have.text', '02:45:03')
  })
})