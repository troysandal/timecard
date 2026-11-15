/// <reference types="cypress" />

// Touch polish (see DESIGN.md "Touch"): every tappable element is at least 44pt (the
// --touch-target token) in each direction, and the global touch rules are in place.

import { seedRace, visitHome } from './app_util'

const MIN = 44

const tk = seedRace('tk1', 'Touch TK', 'time_keeper', '2026-03-01T10:00:00Z')
tk.timeCard = {
  riderMinute: 1,
  format: 'AMA',
  checkpoints: [
    { type: 'start', minute: 1, seconds: 0, drop: false },
    { type: 'secret', minute: 12, seconds: 45, drop: false },
    { type: 'emergency', minute: 13, seconds: 20, drop: false },
  ],
}
const sprint = seedRace('sp1', 'Touch Sprint', 'sprint', '2026-03-02T10:00:00Z')
sprint.timeCard = {
  tests: [1, 2, 3].map((i) => ({
    enter: { hour: 9, minute: i, second: 0 },
    exit: { hour: 9, minute: i + 20, second: 31 },
  })),
}

/** Everything a finger can tap. A checkbox's tap target is its label. */
const TAPPABLE = "button, select, input:not([disabled]):not([type=checkbox]), label:has(input[type='checkbox'])"

function describeEl(el: Element) {
  const r = el.getBoundingClientRect()
  const text = ((el as HTMLElement).innerText || (el as HTMLInputElement).placeholder || '').trim().slice(0, 12)
  return `${el.tagName.toLowerCase()}[${text}] ${Math.round(r.width)}x${Math.round(r.height)}`
}

function expectTargets(doc: Document, exempt: (el: Element) => { minW: number; minH: number } | 'skip' | null = () => null) {
  const bad: string[] = []
  doc.querySelectorAll(TAPPABLE).forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return // not displayed
    const rule = exempt(el)
    if (rule === 'skip') return
    const minW = rule?.minW ?? MIN
    const minH = rule?.minH ?? MIN
    // 0.5px of slack for sub-pixel layout.
    if (r.width < minW - 0.5 || r.height < minH - 0.5) bad.push(`${describeEl(el)} (needs ${minW}x${minH})`)
  })
  expect(bad, `tappable elements below the minimum:\n  ${bad.join('\n  ')}`).to.deep.equal([])
}

describe('touch targets', () => {
  beforeEach(() => cy.viewport(393, 852))

  it('Home', () => {
    visitHome([tk, sprint])
    cy.getBySel('race-list').should('be.visible')
    cy.document().then((doc) => expectTargets(doc))
  })

  it('race picker', () => {
    visitHome([tk])
    cy.getBySel('add-enduro').click()
    cy.getBySel('race-picker').should('be.visible')
    cy.document().then((doc) =>
      // The Home controls behind the modal are covered but still measured: fine, same rule.
      expectTargets(doc)
    )
  })

  it('Edit, time keeper', () => {
    visitHome([tk], '#/edit/tk1')
    cy.get('table').should('be.visible')
    cy.document().then((doc) => expectTargets(doc))
  })

  it('Edit, sprint', () => {
    visitHome([sprint], '#/edit/sp1')
    cy.get('table').should('be.visible')
    cy.document().then((doc) =>
      expectTargets(doc, (el) => {
        // Known exceptions, both replaced by the new time picker (spec step 10d):
        // - the six hh/mm/ss fields share one 375pt row, so they can be 44 tall but only ~36 wide;
        // - the delete button has no room to grow in the # column without breaking the row.
        if (el.closest('tbody') && el.tagName === 'BUTTON') return 'skip'
        if (el.closest('tbody') && el.tagName === 'INPUT') return { minW: 32, minH: MIN }
        return null
      })
    )
  })
})

describe('touch rules', () => {
  beforeEach(() => {
    cy.viewport(393, 852)
    visitHome([tk])
  })

  it('removes the tap highlight and stops pull-to-refresh / scroll chaining', () => {
    cy.document().then((doc) => {
      const html = getComputedStyle(doc.documentElement) as CSSStyleDeclaration & { webkitTapHighlightColor: string }
      expect(html.webkitTapHighlightColor).to.eq('rgba(0, 0, 0, 0)')
      expect(html.overscrollBehaviorY).to.eq('none')
    })
  })

  it('turns text selection and the long-press callout off on touch screens only, keeping inputs editable', () => {
    cy.document().then((doc) => {
      const rules: CSSMediaRule[] = []
      for (const sheet of Array.from(doc.styleSheets)) {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule instanceof (doc.defaultView as Window & typeof globalThis).CSSMediaRule && rule.conditionText.includes('pointer: coarse')) {
            rules.push(rule)
          }
        }
      }
      const css = rules.map((r) => r.cssText).join('\n')
      expect(css, 'a (pointer: coarse) rule exists').to.not.eq('')
      expect(css).to.match(/user-select:\s*none/)
      expect(css, 'inputs stay selectable').to.match(/input[^}]*user-select:\s*text/s)
    })
    // Chrome discards iOS-only properties when it parses CSS, so the long-press callout can only
    // be checked in the source.
    cy.readFile('src/app.css').should('match', /@media \(pointer: coarse\)[^@]*-webkit-touch-callout:\s*none/)
    // Not applied to a mouse pointer (this browser): desktop selection still works.
    cy.document().then((doc) => {
      expect(getComputedStyle(doc.documentElement).userSelect).to.not.eq('none')
    })
  })

  it('gives buttons a pressed state', () => {
    cy.document().then((doc) => {
      const css = Array.from(doc.styleSheets)
        .flatMap((s) => Array.from(s.cssRules))
        .map((r) => r.cssText)
        .join('\n')
      expect(css).to.match(/button:not\(:disabled\):active[^}]*scale:\s*0\.97/s)
    })
  })

  it('keeps utility transitions on buttons (global pressed rules must not override them)', () => {
    // The Save button uses transition-all; a global unlayered `button { transition }` used to flatten it.
    cy.getBySel('add-enduro').should('exist')
    visitHome([tk], '#/edit/tk1')
    cy.getBySel('save-button').then(($b) => {
      expect(getComputedStyle($b[0]).transitionProperty).to.contain('all')
    })
  })

  it('shows a focus ring for keyboard focus on buttons', () => {
    cy.document().then((doc) => {
      const css = Array.from(doc.styleSheets)
        .flatMap((s) => Array.from(s.cssRules))
        .map((r) => r.cssText)
        .join('\n')
      expect(css).to.match(/:focus-visible[^}]*outline:\s*2px solid/s)
    })
  })
})
