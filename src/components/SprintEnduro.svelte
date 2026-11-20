<script lang="ts">
    import { onMount } from 'svelte'
    import SprintTestRow from "./SprintTestRow.svelte"
    import type { SprintViewModel } from "../viewModels/viewModels.svelte"
    import type { SprintTestData } from "../models/race";
    import { canScan } from '../lib/scanCard';
    import PhotoViewerModal from './PhotoViewerModal.svelte';
    import { alertDialog, confirmDialog } from '../lib/dialogs.svelte'
    
    interface Props { 
        viewModel: SprintViewModel; 
    }

    let {viewModel = $bindable()}: Props = $props()

    const tests = $derived(viewModel.race.timeCard.tests)
    let available = $state(false);
    let showPhoto = $state(false);
    onMount(async () => { available = await canScan(); });

    // The test just added by the user; only its row grabs focus on mount.
    let addedTest: SprintTestData | undefined = $state()
    function addTest() { addedTest = viewModel.addTestData() }
    function onRowEnter(i: number) { addedTest = viewModel.rowEntered(i) ?? addedTest }

    async function onReset() {
        if (await confirmDialog({
            title: 'Reset sprint?',
            message: 'Are you sure you want to reset the Sprint Enduro?',
            confirmLabel: 'Reset',
            destructive: true,
        })) {
            viewModel.resetCard()
        }
    }
    
    async function onScan() {
      if (viewModel.scanning) return // one scan at a time
      if (!(await confirmDialog({
        title: 'Replace score card?',
        message: 'Warning - This will replace the contents of your score card - are you sure?',
        confirmLabel: 'Replace',
        destructive: true,
      }))) {
        return
      }
      const result = await viewModel.scan()
      if (result === "applied") {
        await alertDialog({ title: 'Scan complete', message: 'Scan Complete - WARNING - Double check score card, AI can make mistakes.' })
      } else if (result === "empty") {
        await alertDialog({ title: 'Nothing found', message: 'No tests found in scan.' })
      } else if (result === "failed") {
        await alertDialog({ title: 'Scan failed', message: 'Sorry, the scan failed, please try again.' })
      }
    }

    async function onDeleteTest(test: SprintTestData, index: number) {
      if (await confirmDialog({
        title: 'Delete test?',
        message: `You sure you want to delete test ${index + 1}?`,
        confirmLabel: 'Delete',
        destructive: true,
      })) {
          viewModel.deleteTest(test)
      }
    }
</script>

<div class="flex flex-col h-full">
  <div class="overflow-x-auto flex-1 overflow-y-auto overscroll-contain">
    <table class="w-full text-sm">
        <thead>
            <tr>
                <th>#</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody>
            {#each tests as test, index (test)}
                <SprintTestRow {index} bind:test={tests[index]!} deleteTest={() => onDeleteTest(test, index)} autoFocus={test === addedTest} onEnter={() => onRowEnter(index)} />
            {/each}
        </tbody>
    </table>
  </div>
  <div class="border-t border-border px-3 py-3 flex gap-2">
    <button
      data-cy="add-test"
      onclick={addTest}
      class="flex-1 min-h-touch px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium
             hover:opacity-90 active:scale-95 transition"
    >
      Add Test
    </button>
    <button
      onclick={onReset}
      class="flex-1 min-h-touch px-4 rounded-md border border-border text-sm font-medium
             text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition"
    >
      Reset
    </button>
    {#if available}
    <button
      onclick={onScan}
      class="flex-1 min-h-touch px-4 rounded-md border border-border text-sm font-medium
             text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition"
    >
      Scan
    </button>
    {/if}
    {#if viewModel.race.imagePath}
    <button
      data-cy="view-photo"
      onclick={() => { showPhoto = true }}
      class="flex-1 min-h-touch px-4 rounded-md border border-border text-sm font-medium
             text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition"
    >
      View
    </button>
    {/if}
  </div>
</div>
{#if showPhoto && viewModel.race.imagePath}
  <PhotoViewerModal imagePath={viewModel.race.imagePath} onClose={() => { showPhoto = false }} />
{/if}
