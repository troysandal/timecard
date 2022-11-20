<script>
    import { SprintTest } from '../sprint'

    export let testDatum
    export let index

    $: score = computeScore(testDatum);

    function computeScore(testDatum) {
        const test = SprintTest.fromTimes(testDatum.enter, testDatum.exit)
        if (test) {
            return test.scoreString
        }
        return ''
    }
</script>

<tr>
    <th>{index + 1}</th>
    <th><input class="enterTime" bind:value={testDatum.enter}></th>
    <th><input class="exitTime" bind:value={testDatum.exit}></th>
    <th>{score}</th>
</tr>
