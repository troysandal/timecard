<script>
    import { SprintTest, isValidTime } from "../sprint"
    import { createEventDispatcher } from "svelte"
    import NumberInput from "./NumberInput.svelte"
    import SprintNumberInput from "./SprintNumberInput.svelte"
    import SprintTime from './SprintTime.svelte'

    const dispatch = createEventDispatcher();

    function onDelete() {
        dispatch("delete", {
            index,
        });
    }

    export let index;
    export let testDatumEnter;
    export let testDatumExit;

    $: score = computeScore(testDatumEnter, testDatumExit);

    function computeScore(testDatumEnter, testDatumExit) {
        if (isValidTime(testDatumEnter) && isValidTime(testDatumExit)) {
            const test = SprintTest.fromTimes(testDatumEnter, testDatumExit);
            if (test) {
                return test.scoreString;
            }
        }
        return "";
    }
    function initRow(row) {
        row.focus()
    }
    let refHour
</script>

<tr>
    <td>{index + 1} <button on:click={onDelete}>&#x274C;</button></td>
    <td>
        <SprintTime initRow={initRow}
            onSeconds={() => {refHour.focus()}}
            bind:hour={testDatumEnter.hour}
            bind:minute={testDatumEnter.minute}
            bind:second={testDatumEnter.second} />
    </td>
    <td>
        <SprintTime
            bind:refHour
            bind:hour={testDatumExit.hour}
            bind:minute={testDatumExit.minute}
            bind:second={testDatumExit.second} />
    </td>
    <td>{score}</td>
</tr>

<style>
    td {
        border: 1px solid grey;
        border-collapse: collapse;
    }
</style>
