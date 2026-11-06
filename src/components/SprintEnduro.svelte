<script lang="ts">
    import SprintTestRow from "./SprintTestRow.svelte"
    import type { SprintViewModel } from "../viewModels/viewModels.svelte"
    import type { SprintTestData } from "../models/race";
    
    interface Props { 
        viewModel: SprintViewModel; 
    }

    let {viewModel = $bindable()}: Props = $props()

    function onEnter(test: SprintTestData) {
        const index = viewModel.race.timeCard.tests.findIndex((i) => i === test)
        if (index === viewModel.race.timeCard.tests.length - 1) {
            viewModel.addTestData()
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
            {#each viewModel.race.timeCard.tests as test, index (test)}
                <SprintTestRow {index} bind:test={viewModel.race.timeCard.tests[index]!} testClass={viewModel.raceSprint.tests[index]!} deleteTest={() => viewModel.deleteTest(test)} onEnter={onEnter} />
            {/each}
        </tbody>
    </table>
  </div>
  <div class="border-t border-border px-3 py-3 flex gap-2">
    <button
      onclick={() => viewModel.addTestData()}
      class="flex-1 min-h-11 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium
             hover:opacity-90 active:scale-95 transition"
    >
      Add Test
    </button>
    <button
      onclick={() => viewModel.resetCard()}
      class="flex-1 min-h-11 px-4 rounded-md border border-border text-sm font-medium
             text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition"
    >
      Reset
    </button>
  </div>
</div>
