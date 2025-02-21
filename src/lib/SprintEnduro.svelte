<script lang="ts">
    import SprintTestRow from "./SprintTestRow.svelte"
    import { SprintTest, SprintEnduro } from "../sprint"
    import type { SprintCheckDatum } from "./SprintUtil"

    function initialTests(): SprintCheckDatum[] {
        const tests: SprintCheckDatum[] = []
        const MAX = 1
        for (let i = 0 ; i < MAX ; i++) {
            tests.push({ 
                id: Math.random().toString(),
                enter: {hour: NaN, minute: NaN, second: NaN}, 
                exit: {hour: NaN, minute: NaN, second: NaN}
            })
        }
        return tests
    }

    let testData = $state(initialTests())

    function addTestData() {
        testData[testData.length] = { 
            id: Math.random().toString(),
            enter: {hour: NaN, minute: NaN, second: NaN}, 
            exit: {hour: NaN, minute: NaN, second: NaN}
        };
    }

    function resetCard() {
        if (window.confirm('Are you sure you want to reset the Sprint Enduro?')) {
            testData = initialTests()
        }
    }

    function computeScore() {
        let enduro = new SprintEnduro()
        for (let testDatum of testData) {
            const test = SprintTest.fromTimes(testDatum.enter, testDatum.exit)
            if (test) {
                enduro.tests.push(test)
            }
        }
        return enduro.scoreString
    }

    function deleteTest(index: number) {
        if (window.confirm(`You sure you want to delete test ${index + 1}?`)) {
            console.log($state.snapshot(testData))
            testData = testData.filter(
                (_v, ix) => index !== ix
            );
            console.log($state.snapshot(testData))
        }
    }

    let score = $derived(computeScore())
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
        {#each testData as _testDatum, index (_testDatum.id)}
            <SprintTestRow bind:testDatum={testData[index]} {index} {deleteTest} />
        {/each}
    </tbody>
    <tfoot>
        <tr>
            <th colspan="4">
                <div id="overallScore">
                    Total Score: <span class="score">{score}</span>
                </div>
                <button id="addTest" onclick={addTestData}>Add a Test</button>
                <button id="reset" onclick={resetCard}>Reset</button>
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
