<script lang="ts">
  // Bottom sheet on phones, centered dialog from md up. One component for everything that
  // overlays the page (race picker, photo viewer, the web confirm dialog). See DESIGN.md
  // "Sheets and dialogs".
  //
  // Mounted means open: render it inside {#if}. While mounted it
  //  - registers with lib/sheets so Android Back and Escape close the top sheet first,
  //  - moves focus inside (the [data-autofocus] element, else the first control), keeps Tab
  //    inside, and puts focus back where it was on close,
  //  - stops the page behind it scrolling (html.sheet-open).
  import { onMount, type Snippet } from 'svelte'
  import { hasOpenSheet, isTopSheet, registerSheet } from '../lib/sheets'

  interface Props {
    /** Accessible name when the content has no visible heading to point at. */
    title: string
    /** id of the visible heading (or text) that names the dialog. Preferred over `title`. */
    labelledBy?: string
    onClose: () => void
    /** 'full' for content that wants the screen, such as the photo viewer. */
    size?: 'auto' | 'full'
    tone?: 'light' | 'dark'
    dataCy?: string
    children: Snippet
  }

  let { title, labelledBy, onClose, size = 'auto', tone = 'light', dataCy, children }: Props = $props()

  let panel: HTMLElement | undefined = $state()
  let sheetId = 0

  const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

  function focusables(): HTMLElement[] {
    return panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : []
  }

  onMount(() => {
    const returnFocusTo = document.activeElement as HTMLElement | null
    const registration = registerSheet(() => onClose())
    sheetId = registration.id
    document.documentElement.classList.add('sheet-open')

    const first = panel?.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0] ?? panel
    first?.focus()

    return () => {
      registration.unregister()
      if (!hasOpenSheet()) document.documentElement.classList.remove('sheet-open')
      if (returnFocusTo?.isConnected) returnFocusTo.focus()
    }
  })

  function onKeydown(event: KeyboardEvent) {
    if (!isTopSheet(sheetId)) return
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== 'Tab') return
    const items = focusables()
    if (items.length === 0) {
      event.preventDefault()
      return
    }
    const first = items[0]!
    const last = items[items.length - 1]!
    const active = document.activeElement
    if (!panel?.contains(active)) {
      event.preventDefault()
      first.focus()
    } else if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div
  data-cy={dataCy}
  class="fixed inset-0 z-50 flex items-end justify-center md:items-center safe-x"
  style="padding-top: var(--safe-top)"
>
  <!-- Tap outside to close. Not a tab stop: Escape and the sheet's own buttons cover the keyboard. -->
  <button
    type="button"
    tabindex="-1"
    aria-hidden="true"
    data-cy="sheet-backdrop"
    class="sheet-backdrop absolute inset-0 cursor-default bg-black/40 active:opacity-100 active:scale-100"
    onclick={onClose}
  ></button>

  <div
    bind:this={panel}
    role="dialog"
    aria-modal="true"
    aria-labelledby={labelledBy}
    aria-label={labelledBy ? undefined : title}
    tabindex="-1"
    class="sheet-panel relative flex w-full max-w-lg flex-col overscroll-contain outline-none shadow-xl
           pb-[var(--safe-bottom)] md:pb-0
           rounded-t-xl md:w-[28rem] md:max-w-[90%] md:rounded-xl
           {size === 'full' ? 'h-[92%] md:h-[85%] md:w-[48rem] md:max-w-[95%]' : 'max-h-[90%]'}
           {tone === 'dark' ? 'bg-black text-white' : 'bg-card text-card-foreground'}"
  >
    {#if size === 'auto' && tone === 'light'}
      <div class="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border md:hidden" aria-hidden="true"></div>
    {/if}
    {@render children()}
  </div>
</div>
