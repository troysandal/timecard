/// <reference types="cypress" />

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
  cy.get('button#addCheck').first().click()
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
