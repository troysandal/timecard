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

/**
 * Visit the app with an optional seeded database. Seeding happens in
 * onBeforeLoad so it is in place before the app reads localStorage.
 */
export function visitHome(races: object[] = [], hash: string = '#') {
  // Leave the app first. If the previous test ended on an Edit hash, visiting
  // a URL that differs only by hash is not a page load: it fires popstate in
  // the old page (hitting the unsaved-changes confirm) and cy.visit never
  // gets its load event.
  cy.visit('about:blank')
  cy.visit(`/${hash}`, {
    onBeforeLoad(win) {
      if (races.length) {
        win.localStorage.setItem(
          DB_KEY,
          JSON.stringify({ schemaVersion: SCHEMA_VERSION, data: { races } })
        )
      }
    },
  })
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

export const UNSAVED_MSG =
  'You have unsaved changes. Are you sure you want to discard them?'

/**
 * The web confirm dialog (components/ConfirmHost.svelte; native builds use the system dialog,
 * which tests can't see). It is a real sheet, so tests read it and press its buttons.
 */
export function expectConfirm(message: string) {
  cy.getBySel('confirm-sheet').should('be.visible')
  cy.getBySel('confirm-message').should('have.text', message)
}

/** Press OK (accept) or Cancel (decline) and wait for the dialog to go away. */
export function answerConfirm(accept: boolean) {
  cy.getBySel(accept ? 'confirm-ok' : 'confirm-cancel').click()
  cy.getBySel('confirm-sheet').should('not.exist')
}

/** No confirm dialog is showing. */
export function expectNoConfirm() {
  cy.getBySel('confirm-sheet').should('not.exist')
}

/** Visit Home with the given seeded races, then open the race at `index`. */
export function openRace(races: object[], index: number = 0) {
  visitHome(races)
  rows().eq(index).find('[data-cy="race-edit"]').click()
}

/** Save button reads "Saved" (green): no unsaved changes. */
export function expectClean() {
  cy.getBySel('save-button')
    .should('contain.text', 'Saved')
    .and('have.class', 'bg-green-600')
}

/** Save button reads "Save" (primary): there are unsaved changes. */
export function expectDirty() {
  cy.getBySel('save-button')
    .should('not.contain.text', 'Saved')
    .and('contain.text', 'Save')
    .and('have.class', 'bg-primary')
}

/** The race has been modified: it must be dirty, then Save makes it clean. */
export function saveAndExpectClean() {
  expectDirty()
  cy.getBySel('save-button').click()
  expectClean()
}
