<script>
    import SprintTestRow from './SprintTestRow.svelte'
    import { SprintTest, SprintEnduro } from '../sprint'

    function newTest() {
        return {enter:'', exit:''}
    }
    function initialTests(MAX) {
        const tests = []
        for (let i = 0 ; i < MAX ; i++) {
            tests.push(newTest)
        }
        return tests
    }

    let testData = initialTests(7)
    
    function addTestData() {
        testData[testData.length] = newTest()
    }
    
    $: score = computeScore(testData);
    
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
    function deleteTest(event) {
        if (window.confirm(`You sure you want to delete test ${event.detail.index + 1}?`)) {
            testData = testData.filter((v, index) => index !== event.detail.index)
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
            <SprintTestRow bind:testDatum={testDatum} index={index} on:delete={deleteTest}/>
        {/each}
    </tbody>
    <tfoot>
        <tr>
            <th colspan="4">
                <div id="overallScore">Total Score: <span class="score">{score}</span></div>
                <button id="addTest" on:click={addTestData}>Add a Test</button>
            </th>            
        </tr>
    </tfoot>
</table>  