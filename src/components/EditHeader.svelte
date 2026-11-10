<script lang="ts">
  import { type AnyRaceViewModel } from "../viewModels/viewModels.svelte"

  interface Props {
    onSave: () => void;
    onBack: () => void;
    viewModel: AnyRaceViewModel;
  }

  let { onSave, onBack, viewModel }: Props = $props();

  function computeDirtyClass(isDirty: boolean) {
    if (isDirty) {
      return 'bg-primary text-primary-foreground hover:opacity-90'
    }
    return 'bg-green-600 text-white'
  }
  const isDirty: boolean = $derived(viewModel.isDirty)
  let dirtyClass = $derived(computeDirtyClass(isDirty))
</script>

<header class="shrink-0 border-b border-border bg-card px-4 py-3 flex items-center justify-between gap-3">
  <button
    onclick={onBack}
    class="shrink-0 flex items-center gap-1.5 p-1.5 font-medium hover:text-foreground transition-colors bg-gray-200"
    aria-label="Go back"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" />
    </svg>
    Back
  </button>
  <button
    onclick={onSave}
    class="shrink-0 flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 transition-all {dirtyClass}"
    style="borderRadius: 'var(--radius)'"
  >
  {#if !isDirty}
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" />
      </svg>
      Saved
  {:else}
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6.5l2.5 2.5L10 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" />
      </svg>
      Save
  {/if}
  </button>
</header>