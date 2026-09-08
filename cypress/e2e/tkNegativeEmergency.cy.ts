/// <reference types="cypress" />

import { addEmergency, setSecret } from './timekeeper_util';

describe('Time Keeper Bugs', () => {
    it('negative emergency points', () => {
      cy.visit('/')
      cy.on('window:confirm', (text) => {
        return true
      });
      cy.get('button').contains('Time Keeper').first().click()      
      cy.get('div#riderMinute input').first().clear().type('10')

      setSecret(10)
      addEmergency(10, 31)

      cy.get('input#checks').should('have.value', '2')
      cy.get('input#points').should('have.value', '0')
      cy.get('input#emergencyPoints').should('have.value', '1')
      cy.get('input#disqualified').should('have.value', 'NO')
    })

    
})