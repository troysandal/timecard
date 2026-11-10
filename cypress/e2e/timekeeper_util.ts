/// <reference types="cypress" />

import { visitHome, addRace, expectClean } from './app_util'

enum CheckType {
  Secret = 0,
  Emergency = 1,
  Start = 2,
  Known = 3
};

export function setCheck(type: number, minute: number, seconds: number | undefined, drop?: boolean) {
  cy.get('tbody tr:last-child').first().within(() => {
    // Naive - assumes we start at Secret, breaks if not already there.
    // @todo - detect current type
    while (type > 0) {
      cy.get('img').first().click()
      type--
    }
    if (isNaN(minute)) {
      cy.get('input').first().clear()  
    } else {
      cy.get('input').first().clear().type(minute.toString())  
    }
    if (seconds !== undefined) {
      cy.get('input').eq(1).clear().type(seconds.toString())
    }
    if (drop) {
      cy.get('input[type="checkbox"]').check()
    }
  })
}

export function addCheck() {
  cy.getBySel('add-check').first().click()
}

export function addStart(minute: number, drop?: boolean) {
  addCheck()
  setCheck(CheckType.Start, minute, undefined, drop)
}
export function setStart(minute: number, drop?: boolean) {
  setCheck(CheckType.Start, minute, undefined, drop)
}

export function addKnown(minute: number, drop?: boolean) {
  addCheck()
  setCheck(CheckType.Known, minute, undefined, drop)
}
export function setKnown(minute: number, drop?: boolean) {
  setCheck(CheckType.Known, minute, undefined, drop)
}

export function addSecret(minute: number, drop?: boolean) {
  addCheck()
  setCheck(CheckType.Secret, minute, undefined, drop)
}
export function setSecret(minute: number, drop?: boolean) {
  setCheck(CheckType.Secret, minute, undefined, drop)
}

export function addEmergency(minute: number, seconds: number, drop?: boolean) {
  addCheck()
  setCheck(CheckType.Emergency, minute, seconds, drop)
}
export function setEmergency(minute: number, seconds: number, drop?: boolean) {
  setCheck(CheckType.Emergency, minute, seconds, drop)
}

export function setDropped(check: number, dropCheck: boolean) {
  const element = cy.get('input[type="checkbox"]').eq(check - 1)

  if (dropCheck) {
    element.check()
  } else {
    element.uncheck()
  }
}

export function checkScore(checks: number, points: number, epoints: number, dq: boolean) {
  cy.getBySel('score-checks').should('have.text', checks)
  cy.getBySel('score-points').should('have.text', points)
  cy.getBySel('score-epoints').should('have.text', epoints)
  cy.getBySel('score-disqualified').should('have.text', dq ? "YES" : "NO")
}

export function setRiderMinute(minute: number) {
  cy.getBySel('rider-minute').first().clear().type(minute.toString())
}

function selectFormat(format: "AMA" | "BrandX") {
  cy.getBySel('format-select').select(format);
  cy.getBySel('format-select').should('have.value', format)
}

export function newTimeKeeper(riderMinute:number = 0, format: "AMA" | "BrandX" = "AMA") {
  visitHome()
  addRace('time_keeper')
  expectClean() // a brand new race starts clean
  if (riderMinute) setRiderMinute(riderMinute)
  selectFormat(format)
}