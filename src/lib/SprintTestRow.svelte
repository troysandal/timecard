<script lang="ts">
    import { SprintTest } from "../sprint"
    import SprintTime from './SprintTime.svelte'
    import type { TimeData } from "../sprint"

    interface Props {
        index: number,
        testDatum: any,
        deleteTest: (index: number) => void,
        onEnter: (index: number) => void
    }
    
    let { 
        index, 
        testDatum = $bindable(),
        deleteTest,
        onEnter = (index: number) => {}
    }: Props = $props();


    function computeScore(testDatumEnter: TimeData, testDatumExit: TimeData) {
        let result = "";
        const test = SprintTest.fromTimes(testDatumEnter, testDatumExit);
        if (test) {
            result = test.scoreString;
        }
        return result;
    }

    function initRow(row: HTMLElement) {
        row.focus() 
    }

    function onEnterAny() {
        if (score !== "") {
            onEnter(index);
        }
    }

    let refHour = $state();
    let score = $derived(computeScore(testDatum.enter, testDatum.exit));
</script>

<tr>
    <td>{index + 1} <button onclick={() => {deleteTest(index)}}>&#x274C;</button></td>
    <td>
        <SprintTime 
            initRow={initRow}
            className="enterTime"
            onSeconds={() => {(refHour as HTMLInputElement).focus()}}
            bind:timeData={testDatum.enter}
            onEnter={onEnterAny} />
    </td>
    <td>
        <SprintTime
            className="exitTime"
            bind:refHour
            bind:timeData={testDatum.exit}
            onEnter={onEnterAny} />
    </td>
    <td>
        <input disabled value={score} class="score"/>
    </td>
</tr>

<style>
    td {
        border: 1px solid grey;
        border-collapse: collapse;
        padding: 2px;
    }
    .score {
        width: 8ch;
        text-align: center;
    }
</style>
