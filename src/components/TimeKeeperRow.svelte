<script lang="ts">
    import { CheckpointTypes } from '../models/timekeeper'
    import type { CheckDatum } from '../lib/TimeKeeperUtil';
    import NumberInput from './NumberInput.svelte';
    import start from '/src/assets/start.png'
    import known from '/src/assets/known.png'
    import secret from '/src/assets/secret.png'
    import emergency from '/src/assets/emergency.png'
    import type { Score } from '../lib/scoring/timekeeper.scoring';

    interface Props {
        check: CheckDatum,
        index: number,
        score: Score | undefined,
        onEnter: (index: number) => void
    }
    let { check = $bindable(), index, score, onEnter = () => {} }: Props = $props();
    
    function onEnterMinOrSec() {
        if (score && !score.invalid) {
            onEnter(index);
        }
    }
    
    function computePoints(score: Score | undefined) {
        return score && !score.invalid ? score.points : ''
    }

    function computeEmergencyPoints(score: Score | undefined) {
        return score && !score.invalid ? score.emergencyPoints : ''
    }

    function flagSource(checkDatum: CheckDatum) {
        const FLAGS = {
            [CheckpointTypes.Start]: start,
            [CheckpointTypes.Known]: known,
            [CheckpointTypes.Secret]: secret,
            [CheckpointTypes.Emergency]: emergency,
        }
        return FLAGS[checkDatum.type]
    }

    function toggleType() {
        check.type = (check.type + 1) % 4
    }

    function initRow(row: HTMLElement) {
        row.focus()
    }

    function validMinute(value: any) {
        if (value === undefined || value === null || value === '') {
            return false
        }
        return true
    }
    function validSeconds(value: any) {
        if (value === undefined || value === '') {
            return false
        }
        return !isNaN(parseInt(value)) && (value >= 0) && (value <= 59)
    }

    let points = $derived(computePoints(score));
    let emergencyPoints = $derived(computeEmergencyPoints(score))
    let flagSrc = $derived(flagSource(check))
    let droppedRow = $derived(check.drop ? 'dropped' : '')
</script>

<tr class={droppedRow} data-cy="tkr">   
    <td class="p-1 align-middle">
        <div class="h-12 w-12 flex items-center justify-center mx-auto">
        <!-- h-full scales the flag to fill this box -->
            <!-- @todo - switch to a button -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <img src={flagSrc} alt="Flag" onclick={toggleType} class="h-full w-full object-contain block"/>
        </div>
    </td>
    <td class="p-1 text-center">{index + 1}</td>
    <td class="p-1">
        <NumberInput strValue={check.minute.toString()} bind:value={check.minute} pattern={undefined} validator={validMinute} initRow={initRow} onEnter={onEnterMinOrSec} class="{droppedRow} w-full min-w-0" size="3" />
    </td>
    <td class="p-1">
        {#if check.type === CheckpointTypes.Emergency}
            <NumberInput strValue={check.seconds.toString()} bind:value={check.seconds} validator={validSeconds} onEnter={onEnterMinOrSec} class="{droppedRow} w-full min-w-0" size="2" />
        {/if}
    </td>
    <td class="p-1"><input class="{droppedRow} field h-8 w-full min-w-0" disabled value={points} size="3" /></td>
    <td class="p-1"><input class="{droppedRow} field h-8 w-full min-w-0" disabled value={emergencyPoints} size="4" /></td>
    <td class="p-1">
        <div class="flex items-center justify-center">
        <input class="size-5 accent-primary" type="checkbox" bind:checked={check.drop}>
        </div>
    </td>
</tr>

<style>
    input {
        text-align: center;
    }
    .dropped {
        text-decoration: line-through;
    }
    :global(.dropped) {
        text-decoration: line-through;
    }

</style>
