<script>
    import SprintTestRow from "./SprintTestRow.svelte"
    import { SprintTest, SprintEnduro, isValidTime } from "../sprint"
    import { datumToTimeData } from "./SprintUtil"

    function initialTests() {
        const tests = []
        const MAX = 1
        for (let i = 0 ; i < MAX ; i++) {
            tests.push({ enter: {hour: '', minute: '', second: ''}, exit: {hour: '', minute: '', second: ''} })
        }
        return tests
    }

    let testData = initialTests()

    function addTestData() {
        testData[testData.length] = { enter: {hour: '', minute: '', second: ''}, exit: {hour: '', minute: '', second: ''} }
    }

    function resetCard() {
        if (window.confirm('Are you sure you want to reset the Sprint Enduro?')) {
            testData = initialTests()
        }
    }

    $: score = computeScore(testData)

    function computeScore() {
        let enduro = new SprintEnduro()
        for (let testDatum of testData) {
            const testEnter = datumToTimeData(testDatum.enter)
            const testExit = datumToTimeData(testDatum.exit)

            if (isValidTime(testEnter) && isValidTime(testExit)) {
                const test = SprintTest.fromTimes(testEnter, testExit)
                if (test) {
                    enduro.tests.push(test)
                }
            }
        }
        return enduro.scoreString
    }
    function deleteTest(event) {
        if (window.confirm(`You sure you want to delete test ${event.detail.index + 1}?`)) {
            testData = testData.filter(
                (v, index) => index !== event.detail.index
            )
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
        {#each testData as testDatum, index}
            <SprintTestRow bind:testDatumEnter={testDatum.enter} bind:testDatumExit={testDatum.exit} {index} on:delete={deleteTest} />
        {/each}
    </tbody>
    <tfoot>
        <tr>
            <th colspan="4">
                <div id="overallScore">
                    Total Score: <span class="score">{score}</span>
                </div>
                <button id="addTest" on:click={addTestData}>Add a Test</button>
                <button id="reset" on:click={resetCard}>Reset</button>
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
