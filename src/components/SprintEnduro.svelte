<script lang="ts">
    import SprintTestRow from "./SprintTestRow.svelte"
    import type { SprintViewModel } from "../viewModels/viewModels.svelte"
    import type { SprintTestData } from "../models/race";
    
    interface Props { 
        viewModel: SprintViewModel; 
    }

    let {viewModel = $bindable()}: Props = $props()

    const tests = $derived(viewModel.race.timeCard.tests)

    function onEnter(index: number) {
        if (index === tests.length - 1) {
            viewModel.addTestData()
        }
    }

    function onReset() {
        if (window.confirm('Are you sure you want to reset the Sprint Enduro?')) {
            viewModel.resetCard()
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
                <SprintTestRow {index} bind:test={tests[index]!} deleteTest={() => onDeleteTest(test, index)} onEnter={() => onEnter(index)} />
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
  </div>
</div>
