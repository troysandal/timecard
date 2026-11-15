<script lang="ts">
    import { onMount } from 'svelte'
    import SprintTestRow from "./SprintTestRow.svelte"
    import type { SprintViewModel } from "../viewModels/viewModels.svelte"
    import type { SprintTestData } from "../models/race";
    import { canScan } from '../lib/scanCard';
    import PhotoViewerModal from './PhotoViewerModal.svelte';
    
    interface Props { 
        viewModel: SprintViewModel; 
    }

    let {viewModel = $bindable()}: Props = $props()

    const tests = $derived(viewModel.race.timeCard.tests)
    let available = $state(false);
    let showPhoto = $state(false);
    onMount(async () => { available = await canScan(); });

    function onReset() {
        if (window.confirm('Are you sure you want to reset the Sprint Enduro?')) {
            viewModel.resetCard()
        }
    }
    
    async function onScan() {
      if (!window.confirm("Warning - This will replace the contents of your score card - are you sure?")) {
        return
      }
      const result = await viewModel.scan()
      if (result === "applied") {
        window.alert("Scan Complete - WARNING - Double check score card, AI can make mistakes.")
      } else if (result === "empty") {
        window.alert("No tests found in scan.")
      } else if (result === "failed") {
        window.alert("Sorry, the scan failed, please try again.")
      }
    }

    function onDeleteTest(test: SprintTestData, index: number) {
      if (window.confirm(`You sure you want to delete test ${index + 1}?`)) {
          viewModel.deleteTest(test)
      }
    }
</script>

<div class="flex flex-col h-full">
  <div class="overflow-x-auto flex-1 overflow-y-auto">
    <table class="w-full text-sm min-w-[320px]">
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
                <SprintTestRow {index} bind:test={tests[index]!} deleteTest={() => onDeleteTest(test, index)} onEnter={() => viewModel.rowEntered(index)} />
            {/each}
        </tbody>
    </table>
  </div>
  <div class="border-t border-border px-3 py-3 flex gap-2">
    <button
      data-cy="add-test"
      onclick={() => viewModel.addTestData()}
      class="flex-1 min-h-11 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium
             hover:opacity-90 active:scale-95 transition"
    >
      Add Test
    </button>
    <button
      onclick={onReset}
      class="flex-1 min-h-11 px-4 rounded-md border border-border text-sm font-medium
             text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition"
    >
      Reset
    </button>
    {#if available}
    <button
      onclick={onScan}
      class="flex-1 min-h-11 px-4 rounded-md border border-border text-sm font-medium
             text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition"
    >
      Scan
    </button>
    {/if}
    {#if viewModel.race.imagePath}
    <button
      data-cy="view-photo"
      onclick={() => { showPhoto = true }}
      class="flex-1 min-h-11 px-4 rounded-md border border-border text-sm font-medium
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
