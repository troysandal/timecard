/// <reference types="cypress" />

const DB_KEY = 'enduro_time_card'
const SCHEMA_VERSION = 3

export interface SeedRace {
  id: string
  name: string
  raceType: 'time_keeper' | 'sprint'
  createdAt: string // ISO date
}

export function seedRace(
  id: string,
  name: string,
  raceType: SeedRace['raceType'],
  createdAt: string
): SeedRace & { timeCard: object } {
  const timeCard =
    raceType === 'time_keeper'
      ? { riderMinute: 1, format: 'AMA', checkpoints: [] }
      : { tests: [] }
  return { id, name, raceType, createdAt, timeCard }
}

/** Stub window.confirm so tests can assert on and control it. */
export function stubConfirm(win: Window, result: boolean = true) {
  cy.stub(win, 'confirm').as('confirmStub').returns(result)
}

/**
 * Visit the app with an optional seeded database. Seeding and stubbing happen
 * in onBeforeLoad so they are in place before the app reads localStorage.
 */
export function visitHome(races: object[] = [], hash: string = '#') {
  cy.visit(`/${hash}`, {
    onBeforeLoad(win) {
      if (races.length) {
        win.localStorage.setItem(
          DB_KEY,
          JSON.stringify({ schemaVersion: SCHEMA_VERSION, data: { races } })
        )
      }
      stubConfirm(win)
    },
  })
}

export function setConfirm(result: boolean) {
  cy.get('@confirmStub').then((stub: any) => stub.returns(result))
}

export function rows() {
  return cy.getBySel('race-item')
}

export function rowNames() {
  return cy.getBySel('race-name')
}

export function addRace(type: 'time_keeper' | 'sprint') {
  cy.getBySel('add-enduro').click()
  cy.getBySel(type === 'sprint' ? 'add-sprint' : 'add-time-keeper').click()
}
