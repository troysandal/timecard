<script lang="ts">
    import { CheckpointTypes } from '../timekeeper'
    import type { CheckDatum } from './TimeKeeperUtil';
    import NumberInput from './NumberInput.svelte';
    import start from '/src/assets/start.png'
    import known from '/src/assets/known.png'
    import secret from '/src/assets/secret.png'
    import emergency from '/src/assets/emergency.png'
    import type { Score } from '../timekeeper.scoring';

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
        <div class="h-7 w-7 md:h-12 md:w-12 flex items-center justify-center mx-auto">
        <!-- h-12 matches standard DaisyUI input height, h-full scales it -->
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
    <td class="p-1"><input class="{droppedRow} input w-full min-w-0 px-1!" disabled value={points} size="3" /></td>
    <td class="p-1"><input class="{droppedRow} input w-full min-w-0 px-1!" disabled value={emergencyPoints} size="4" /></td>
    <td class="p-1"><input class="checkbox" type="checkbox" bind:checked={check.drop}></td>
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
