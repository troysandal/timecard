<script>
    import { SprintTest } from "../sprint";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function onDelete() {
        dispatch("delete", {
            index,
        });
    }

    export let testDatum;
    export let index;

    $: score = computeScore(testDatum);

    function computeScore(testDatum) {
        const test = SprintTest.fromTimes(testDatum.enter, testDatum.exit);
        if (test) {
            return test.scoreString;
        }
        return "";
    }
</script>

<tr>
    <td>{index + 1} <button on:click={onDelete}>&#x274C;</button></td>
    <td><input size="8" class="enterTime" bind:value={testDatum.enter} /></td>
    <td><input size="8" class="exitTime" bind:value={testDatum.exit} /></td>
    <td>{score}</td>
</tr>

<style>
    td {
        border: 1px solid grey;
        border-collapse: collapse;
    }
</style>
