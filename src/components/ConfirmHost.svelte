<script lang="ts">
  // Renders the web confirm and alert dialog (native builds use the system dialog instead).
  // Mounted once, in App.svelte. See lib/dialogs.svelte.ts.
  import Sheet from './Sheet.svelte'
  import { answerDialog, dialogState } from '../lib/dialogs.svelte'

  const current = $derived(dialogState.current)
</script>

{#if current}
  <!-- Keyed by dialog, so a queued second dialog gets fresh focus handling. -->
  {#key current}
    {@const options = current.options}
    {@const destructive = current.kind === 'confirm' && current.options.destructive}
    <Sheet
      title={options.title ?? 'Notice'}
      labelledBy={options.title ? 'confirm-title' : 'confirm-message'}
      dataCy="confirm-sheet"
      onClose={() => answerDialog(false)}
    >
      <div class="px-4 pt-4 pb-1 md:px-6">
        {#if options.title}
          <h2 id="confirm-title" data-cy="confirm-title" class="font-display text-lg font-800 tracking-tight text-foreground">
            {options.title}
          </h2>
        {/if}
        <p id="confirm-message" data-cy="confirm-message" class="mt-1 text-sm text-muted-foreground">{options.message}</p>
      </div>

      <div class="flex flex-col-reverse gap-2 px-4 pt-4 pb-4 md:flex-row md:justify-end md:px-6">
        {#if current.kind === 'confirm'}
          <button
            type="button"
            data-cy="confirm-cancel"
            data-autofocus={destructive ? '' : undefined}
            class="min-h-touch rounded-md border border-border px-4 text-sm font-medium text-foreground"
            onclick={() => answerDialog(false)}
          >
            {current.options.cancelLabel ?? 'Cancel'}
          </button>
          <button
            type="button"
            data-cy="confirm-ok"
            data-autofocus={destructive ? undefined : ''}
            class="min-h-touch rounded-md px-4 text-sm font-medium
                   {destructive ? 'bg-red-600 text-white' : 'bg-primary text-primary-foreground'}"
            onclick={() => answerDialog(true)}
          >
            {current.options.confirmLabel ?? 'OK'}
          </button>
        {:else}
          <button
            type="button"
            data-cy="confirm-ok"
            data-autofocus
            class="min-h-touch rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            onclick={() => answerDialog(true)}
          >
            {current.options.buttonLabel ?? 'OK'}
          </button>
        {/if}
      </div>
    </Sheet>
  {/key}
{/if}
