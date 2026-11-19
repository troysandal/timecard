<script lang="ts">
  import Sheet from './Sheet.svelte'

  interface Props {
    name: string
    onDelete: () => void
    onClose: () => void
  }

  let { name, onDelete, onClose }: Props = $props()
</script>

<Sheet title="Score card actions" labelledBy="race-actions-title" dataCy="race-actions" {onClose}>
  <div class="px-4 pt-4 md:px-6">
    <h2 id="race-actions-title" class="font-display text-lg font-800 tracking-tight mb-4 text-foreground truncate">
      {#if name}{name}{:else}<span class="text-muted-foreground italic">Untitled</span>{/if}
    </h2>
    <button
      onclick={onDelete}
      data-cy="race-delete"
      class="w-full min-h-touch bg-destructive text-destructive-foreground font-medium text-sm px-4 rounded-lg"
    >
      Delete
    </button>
  </div>
  <button
    onclick={onClose}
    data-cy="race-actions-cancel"
    data-autofocus
    class="mt-2 mb-2 min-h-touch w-full text-xs font-extrabold hover:text-foreground transition-colors"
  >
    Cancel
  </button>
</Sheet>
