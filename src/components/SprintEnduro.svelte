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

<table>
    <thead>
        <tr>
            <th>Test #</th>
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
    <tfoot>
        <tr>
            <th colspan="4">
                <button id="addTest" onclick={() => viewModel.addTestData()}>Add a Test</button>
                <button id="reset" onclick={() => viewModel.resetCard()}>Reset</button>
            </th>
        </tr>
    </tfoot>
</table>

<style>
    table,
    th {
        border: 1px solid grey;
        border-collapse: collapse;
    }

    tfoot {
        padding: 10px;
    }
</style>
