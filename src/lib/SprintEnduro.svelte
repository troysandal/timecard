<script>
    import SprintTestRow from './SprintTestRow.svelte'
    import { SprintTest, SprintEnduro } from '../sprint'


    let testData = []
    
    function addTestData() {
        testData[testData.length] = {enter:'', exit:''}
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
</script>
  
<table class="scorecard">
    <thead>
        <tr>
            <th>Test #</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>SCORE</th>
        </tr>
    </thead>
    <tbody>
        {#each testData as testDatum, index}
            <SprintTestRow bind:testDatum={testDatum} index={index} />
        {/each}
    </tbody>
    <tfoot>
        <tr>
            <th colspan="4">
                <button on:click={addTestData}>Add a Test</button>
                <p>Total Score: <span class="score">{score}</span></p>
            </th>            
        </tr>
    </tfoot>
</table>  