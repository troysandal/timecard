<script>
    import { SprintTest } from '../sprint'
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function onDelete() {
		dispatch('delete', {
			index
		});
	}

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
    <th>{index + 1} <button on:click={onDelete}>&#x274C;</button></th>
    <th><input class="enterTime" bind:value={testDatum.enter}></th>
    <th><input class="exitTime" bind:value={testDatum.exit}></th>
    <th>{score}</th>
</tr>
