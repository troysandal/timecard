/// <reference types="cypress" />

describe('empty spec', () => {
  function createTest(enter: string, exit: string) {
    cy.get('button#addTest').first().click()
    cy.get('tbody tr:last-child').within(() => {
      cy.get('input.enterTime').clear().type(enter)
      cy.get('input.exitTime').clear().type(exit)
    })
  }
  it('passes', () => {
    cy.visit('http://127.0.0.1:5173')
    cy.on('window:confirm', (text) => {
      console.log(text);
      return true
    });
    cy.get('button').contains('Sprint').first().click()
    
    cy.get('tbody tr:last-child button').first().click()
    cy.get('tbody tr:last-child button').first().click()
    cy.get('tbody tr:last-child button').first().click()
    cy.get('tbody tr:last-child button').first().click()
    cy.get('tbody tr:last-child button').first().click()
    cy.get('tbody tr:last-child button').first().click()
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