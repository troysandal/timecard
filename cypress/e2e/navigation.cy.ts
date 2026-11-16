/// <reference types="cypress" />
import { seedRace } from './app_util'

// Home <-> Edit slide (lib/pageTransition.ts). Navigation must work with or without the
// View Transitions API, and when the OS asks for reduced motion.
const DB_KEY = 'enduro_time_card'
const tk = seedRace('tk1', 'Alpha', 'time_keeper', '2025-01-01T00:00:00.000Z')

function visitWith(prepare: (win: Window & typeof globalThis, calls: string[]) => void) {
  const calls: string[] = []
  cy.visit('about:blank')
  cy.visit('/#', {
    onBeforeLoad(win) {
      win.localStorage.setItem(DB_KEY, JSON.stringify({ schemaVersion: 3, data: { races: [tk] } }))
      prepare(win, calls)
    },
  })
  return cy.wrap(calls, { log: false })
}

describe('page transitions', () => {
  it('slides on the way in and on the way out, in the right direction', () => {
    visitWith((win, calls) => {
      const original = win.document.startViewTransition.bind(win.document)
      win.document.startViewTransition = ((cb: () => Promise<void>) => {
        calls.push(win.document.documentElement.dataset.nav ?? 'none')
        return original(cb)
      }) as typeof win.document.startViewTransition
    }).as('calls')

    cy.getBySel('race-item').first().click()
    cy.getBySel('back-button').should('be.visible')
    cy.getBySel('back-button').click()
    cy.getBySel('add-enduro').should('be.visible')
    cy.get('@calls').should('deep.equal', ['push', 'pop'])
    cy.document().its('documentElement.dataset.nav').should('be.undefined')
  })

  it('a double tap on a race opens it once: one Back returns Home', () => {
    visitWith(() => {})
    cy.getBySel('race-item').first().dblclick()
    cy.getBySel('back-button').should('be.visible')
    cy.getBySel('back-button').click()
    cy.getBySel('add-enduro').should('be.visible')
    cy.location('hash').should('eq', '#/')
  })

  it('a quick Back during the slide in still ends on Home with no leftover direction', () => {
    visitWith(() => {})
    cy.getBySel('race-item').first().click()
    cy.getBySel('back-button').click()
    cy.getBySel('add-enduro').should('be.visible')
    cy.document().its('documentElement.dataset.nav', { timeout: 2000 }).should('be.undefined')
  })

  it('navigates at once when the View Transitions API is missing', () => {
    visitWith((win) => {
      Object.defineProperty(win.document, 'startViewTransition', { value: undefined, configurable: true })
    })
    cy.getBySel('race-item').first().click()
    cy.getBySel('back-button').should('be.visible')
    cy.getBySel('back-button').click()
    cy.getBySel('add-enduro').should('be.visible')
  })

  it('does not slide when the OS asks for reduced motion', () => {
    visitWith((win, calls) => {
      const realMatch = win.matchMedia.bind(win)
      win.matchMedia = ((query: string) =>
        /prefers-reduced-motion:\s*reduce/.test(query)
          ? ({ ...realMatch(query), matches: true } as MediaQueryList)
          : realMatch(query)) as typeof win.matchMedia
      const original = win.document.startViewTransition.bind(win.document)
      win.document.startViewTransition = ((cb: () => Promise<void>) => {
        calls.push('called')
        return original(cb)
      }) as typeof win.document.startViewTransition
    }).as('calls')
    cy.getBySel('race-item').first().click()
    cy.getBySel('back-button').should('be.visible')
    cy.getBySel('back-button').click()
    cy.getBySel('add-enduro').should('be.visible')
    cy.get('@calls').should('deep.equal', [])
  })

  it('opens an Edit deep link without sliding', () => {
    const calls: string[] = []
    cy.visit('about:blank')
    cy.visit('/#/edit/tk1', {
      onBeforeLoad(win) {
        win.localStorage.setItem(DB_KEY, JSON.stringify({ schemaVersion: 3, data: { races: [tk] } }))
        const original = win.document.startViewTransition.bind(win.document)
        win.document.startViewTransition = ((cb: () => Promise<void>) => {
          calls.push('called')
          return original(cb)
        }) as typeof win.document.startViewTransition
      },
    })
    cy.getBySel('back-button').should('be.visible')
    cy.then(() => expect(calls).to.deep.equal([]))
  })

  it('the stylesheet turns the slide off for reduced motion', () => {
    cy.visit('/#')
    cy.document().then((doc) => {
      const win = doc.defaultView as Window & typeof globalThis
      const found: string[] = []
      const walk = (rules: CSSRuleList, inReduce: boolean) => {
        for (const rule of Array.from(rules)) {
          if (rule instanceof win.CSSStyleRule) {
            if (inReduce && /animation(-name)?:[^;]*\bnone\b/.test(rule.cssText)) found.push(rule.selectorText)
          } else if ('cssRules' in rule) {
            const reduce =
              inReduce || (rule instanceof win.CSSMediaRule && /prefers-reduced-motion:\s*reduce/.test(rule.conditionText))
            walk((rule as CSSGroupingRule).cssRules, reduce)
          }
        }
      }
      for (const sheet of Array.from(doc.styleSheets)) walk(sheet.cssRules, false)
      expect(found.join(' ')).to.contain('view-transition-old')
      expect(found.join(' ')).to.contain('view-transition-new')
    })
  })
})
