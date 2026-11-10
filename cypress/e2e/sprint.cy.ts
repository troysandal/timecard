/// <reference types="cypress" />

describe('Sprint Enduro', () => {
  function verifyNumberOfChecks(expected: number) {
    cy.get('tbody tr').should('have.length', expected)
  }

  describe('Standard Format', () => {
    function createTest(enter: string, exit: string) {
      cy.getBySel('add-test').first().click()
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

    function deleteTest(index: number, callCount: number = 1) {
      cy.get('td button').eq(index).click()
      cy.get('@confirmStub').should('have.callCount', callCount);
    }

    function checkScore(expected: string) {
      const sels = ['hour', 'minute', 'second']
      expected.split(':').forEach((v, ix) => {
        cy.getBySel(`score-${sels[ix]}`).should('have.text', v)
      })
    }

    beforeEach(() => {
      cy.visit('/#')
      cy.window().then((win) => {
        cy.stub(win, 'confirm').as('confirmStub').returns(true)
      });
      cy.getBySel('add-enduro').first().click()
      cy.getBySel('add-sprint').first().click()
    })

    it('can be empty', () => {  
      deleteTest(0)
      verifyNumberOfChecks(0)
    })

    it('supports 24 hour time', () => {  
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
      cy.get('tbody tr:last-child').within(() => {
        cy.get('input.enterTime').eq(0).clear().type('00')
        cy.get('input.enterTime').eq(1).should('have.focus')
      })
    })

    it('can delete single sprint', () => {
      deleteTest(0)

      createTest('01:00:00', '01:20:00')
      createTest('02:00:00', '02:15:00')
      createTest('03:00:00', '03:30:00')

      checkScore('01:05:00')
      deleteTest(1, 2)
      checkScore('00:50:00')
    })
  })
  
  describe('Pressing Enter key in checkpoint', () => {
    function fillTime(selector: string, time: string) {
      const fragments = time.split(':')
      cy.get(selector).eq(0).clear().type(fragments[0])
      cy.get(selector).eq(1).clear().type(fragments[1])
      cy.get(selector).eq(2).clear().type(fragments[2])
    }

    beforeEach(() => {
      cy.visit('/#')
      cy.window().then((win) => {
        cy.stub(win, 'confirm').as('confirmStub').returns(true)
      });
      cy.getBySel('add-enduro').first().click()
      cy.getBySel('add-sprint').first().click()    })

    it('does nothing when the row is blank', () => {
      cy.get('tbody tr:last-child').within(() => {
        cy.get('input.enterTime').eq(0).type('{enter}')
      })
      verifyNumberOfChecks(1)
    })

    it('does nothing when only the enter time is filled', () => {
      cy.get('tbody tr:last-child').within(() => {
        fillTime('input.enterTime', '09:18:00')
        cy.get('input.enterTime').eq(2).type('{enter}')
      })
      verifyNumberOfChecks(1)
    })

    it('adds a test once the row is a complete, valid test, and focuses the new row', () => {
      cy.get('tbody tr:last-child').within(() => {
        fillTime('input.enterTime', '09:18:00')
        fillTime('input.exitTime', '09:47:19')
        cy.get('input.exitTime').eq(2).type('{enter}')
      })
      verifyNumberOfChecks(2)
      cy.get('tbody tr:last-child input.enterTime').eq(0).should('have.focus')
    })

    it('does nothing in an earlier row, even if valid', () => {
      cy.get('tbody tr:last-child').within(() => {
        fillTime('input.enterTime', '09:18:00')
        fillTime('input.exitTime', '09:47:19')
        cy.get('input.exitTime').eq(2).type('{enter}')
      })
      verifyNumberOfChecks(2)

      cy.get('tbody tr:first-child').within(() => {
        cy.get('input.exitTime').eq(2).type('{enter}')
      })
      verifyNumberOfChecks(2)
    })

    it('adds a test pressed in an enter-time field', () => {
      cy.get('tbody tr:last-child').within(() => {
        fillTime('input.enterTime', '09:18:00')
        fillTime('input.exitTime', '09:47:19')
        cy.get('input.enterTime').eq(0).type('{enter}')
      })
      verifyNumberOfChecks(2)
    })
  })
})