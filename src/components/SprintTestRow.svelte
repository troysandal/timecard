<script lang="ts">
    import type { SprintTestData } from "../models/race";
    import { SprintTest } from "../models/sprint";
    import SprintTime from './SprintTime.svelte'

    interface Props {
        index: number,
        test: SprintTestData,
        deleteTest: () => void,
        onEnter: (test: SprintTestData) => void
    }
    
    let { 
        index,
        test = $bindable(),
        deleteTest,
        onEnter = (test: SprintTestData) => {}
    }: Props = $props();


    function initRow(row: HTMLElement) {
        row.focus() 
    }

    function onEnterAny() {
        if (score !== "") {
            onEnter(test);
        }
    }

    let refHour:HTMLInputElement | undefined = $state();
    let testClass = $derived(SprintTest.fromTimes(test.enter, test.exit));
    let score = $derived(testClass ? testClass.scoreAsTime : '');
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
        <input class="score field h-8 w-full min-w-0" disabled value={score} />
    </td>
</tr>

<style>

    .score {
        width: 8ch;
        text-align: center;
    }
</style>
