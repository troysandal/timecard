<script lang="ts">
    import type { SprintTestData } from "../models/race";
    import { SprintTest } from "../models/sprint";
    import SprintTime from './SprintTime.svelte'
    import { scoreString } from '../lib/SprintUtil'

    interface Props {
        index: number,
        test: SprintTestData,
        deleteTest: () => void,
        onEnter: () => void,
        autoFocus?: boolean
    }

    let {
        index,
        test = $bindable(),
        deleteTest,
        onEnter = () => {},
        autoFocus = false
    }: Props = $props();


    function initRow(row: HTMLElement) {
        if (autoFocus) row.focus()
    }

    function onEnterAny() {
        if (score !== "") {
            onEnter();
        }
    }

    let refHour:HTMLInputElement | undefined = $state();
    let testClass = $derived(SprintTest.fromTimes(test.enter, test.exit));
    let score = $derived(testClass && !isNaN(testClass.score) ? scoreString(testClass.score) : '');
</script>

<tr>
    <td>{index + 1} <button onclick={deleteTest}>&#x274C;</button></td>
    <td>
        <SprintTime 
            initRow={initRow}
            className="enterTime"
            onSeconds={() => {(refHour as HTMLInputElement)?.focus()}}
            bind:timeData={test.enter}
            onEnter={onEnterAny} />
    </td>
    <td>
        <SprintTime
            className="exitTime"
            bind:refHour
            bind:timeData={test.exit}
            onEnter={onEnterAny} />
    </td>
    <td>
        <span class="mono text-base">{score}</span>
    </td>
</tr>
