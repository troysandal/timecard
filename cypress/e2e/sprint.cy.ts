/// <reference types="cypress" />

describe('Sprint Enduros', () => {
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

  function deleteTest(index: number) {
    cy.get('td button').eq(index).click()
  }

  function checkScore(expected: string) {
    cy.get('span.score').should('have.text', expected)
  }

  it('supports 24 hour time', () => {
    cy.visit('/')
    cy.on('window:confirm', (text) => {
      return true
    });
    cy.get('button').contains('Sprint').first().click()
    
    deleteTest(0)

    createTest('09:18:00', '09:47:19')
    createTest('09:56:20', '10:03:32')
    createTest('10:32:40', '11:20:01')
    createTest('12:28:20', '12:53:09')
    createTest('12:59:40', '13:06:10')
    createTest('13:22:00', '14:09:04')
    createTest('14:21:40', '14:24:28')

    checkScore('02:45:03')
  })

  it('supports am/pm', () => {
    cy.visit('/')
    cy.on('window:confirm', (text) => {
      return true
    });
    cy.get('button').contains('Sprint').first().click()
    
    deleteTest(0)

    createTest('09:18:00', '09:47:19')
    createTest('09:56:20', '10:03:32')
    createTest('10:32:40', '11:20:01')
    createTest('12:28:20', '12:53:09')
    createTest('12:59:40', '1:06:10')
    createTest('1:22:00', '2:09:04')
    createTest('2:21:40', '2:24:28')

    checkScore('02:45:03')
  })

  it('advances on 00', () => {
    cy.visit('/')
    cy.on('window:confirm', (text) => {
      return true
    });
    cy.get('button').contains('Sprint').first().click()
    
    cy.get('tbody tr:last-child').within(() => {
      cy.get('input.enterTime').eq(0).clear().type('00')
      cy.get('input.enterTime').eq(1).should('have.focus')
    })
  })

  it('can delete single sprint', () => {
    cy.visit('/')
    cy.on('window:confirm', (text) => {
      return true
    });
    cy.get('button').contains('Sprint').first().click()
    
    cy.get('tbody tr:last-child button').first().click()

    createTest('01:00:00', '01:20:00')
    createTest('02:00:00', '02:15:00')
    createTest('03:00:00', '03:30:00')

    checkScore('01:05:00')
    deleteTest(1)
    checkScore('00:50:00')
  })
})