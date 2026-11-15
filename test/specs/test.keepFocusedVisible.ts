import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { keepFocusedVisible } from '../../src/lib/keepFocusedVisible'

// jsdom does no layout, so geometry is supplied by hand.
function rect(top: number, height: number): DOMRect {
  return { top, bottom: top + height, height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON() {} } as DOMRect
}

describe('keepFocusedVisible', () => {
  let list: HTMLElement
  let input: HTMLInputElement

  function layout(listTop: number, listHeight: number, inputTop: number, inputHeight = 40) {
    list.getBoundingClientRect = () => rect(listTop, listHeight)
    input.getBoundingClientRect = () => rect(inputTop, inputHeight)
  }

  beforeEach(() => {
    list = document.createElement('div')
    list.style.overflowY = 'auto'
    Object.defineProperty(list, 'scrollHeight', { value: 900, configurable: true })
    Object.defineProperty(list, 'clientHeight', { value: 300, configurable: true })
    input = document.createElement('input')
    list.appendChild(input)
    document.body.appendChild(list)
    input.focus()
  })

  afterEach(() => list.remove())

  it('does nothing when the input is already fully in view', () => {
    layout(100, 300, 200)
    list.scrollTop = 50
    keepFocusedVisible()
    expect(list.scrollTop).toBe(50)
  })

  it('scrolls the list down to center an input hidden below the visible area', () => {
    layout(100, 300, 380) // list spans 100-400; input 380-420 sticks out
    list.scrollTop = 0
    keepFocusedVisible()
    // input center 400 vs list center 250: move the content up by 150
    expect(list.scrollTop).toBe(150)
  })

  it('scrolls the list up for an input hidden above the visible area', () => {
    layout(100, 300, 60)
    list.scrollTop = 200
    keepFocusedVisible()
    // input center 80 vs list center 250: -170
    expect(list.scrollTop).toBe(30)
  })

  it('counts an input touching the edge as out of view (8px margin)', () => {
    layout(100, 300, 363) // bottom 403 > 400 - 8
    list.scrollTop = 0
    keepFocusedVisible()
    expect(list.scrollTop).toBeGreaterThan(0)
  })

  it('does nothing when nothing editable has focus', () => {
    input.blur()
    layout(100, 300, 380)
    list.scrollTop = 0
    keepFocusedVisible()
    expect(list.scrollTop).toBe(0)
  })

  it('does nothing when there is no scrolling ancestor', () => {
    Object.defineProperty(list, 'scrollHeight', { value: 300, configurable: true }) // fits
    layout(100, 300, 380)
    list.scrollTop = 0
    keepFocusedVisible()
    expect(list.scrollTop).toBe(0)
  })

  it('also moves the page around the list when the input is inside the list but below the page fold', () => {
    const page = document.createElement('div')
    page.style.overflowY = 'auto'
    Object.defineProperty(page, 'scrollHeight', { value: 700, configurable: true })
    Object.defineProperty(page, 'clientHeight', { value: 200, configurable: true })
    page.getBoundingClientRect = () => rect(0, 200)
    list.remove()
    page.appendChild(list)
    document.body.appendChild(page)
    input.focus()

    // The list's box (0-300) holds the input at 250-290, but the page only shows 0-200.
    layout(0, 300, 250)
    page.scrollTop = 0
    list.scrollTop = 0
    keepFocusedVisible()
    expect(list.scrollTop, 'the input is already inside the list box, so the list stays').toBe(0)
    expect(page.scrollTop, 'the page moved to bring it into view').toBeGreaterThan(0)
    page.remove()
  })
})
