<script lang="ts">
    import { CheckpointTypes, type Checkpoint } from '../models/timekeeper'
    import NumberInput from './NumberInput.svelte';
    import start from '/src/assets/start.png'
    import known from '/src/assets/known.png'
    import secret from '/src/assets/secret.png'
    import emergency from '/src/assets/emergency.png'
    import type { Score } from '../lib/scoring/timekeeper.scoring';

    interface Props {
        check: Checkpoint,
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

    function flagSource(checkDatum: Checkpoint) {
        const FLAGS: Record<CheckpointTypes, string> = {
            [CheckpointTypes.Start]: start,
            [CheckpointTypes.Known]: known,
            [CheckpointTypes.Secret]: secret,
            [CheckpointTypes.Emergency]: emergency,
        }
        return FLAGS[checkDatum.type]
    }

    function toggleType() {
        // Order we cycle through check types    
        const flagOrder = [
            CheckpointTypes.Start, 
            CheckpointTypes.Known, 
            CheckpointTypes.Secret, 
            CheckpointTypes.Emergency
        ];
        let currentIndex = flagOrder.indexOf(check.type);
        check.type = flagOrder[(currentIndex + 1) % flagOrder.length]!;
    }

    function initRow(row: HTMLElement) {
        row.focus()
    }

    function validMinute(value: any) {
        if (value === undefined || value === null || value.trim() === '') {
            return false
        }
        return !isNaN(parseInt(value))
    }
    function validSeconds(value: any) {
        if (value === undefined || value === null || value.trim() === '') {
            return false
        }
        return !isNaN(parseInt(value)) && (value >= 0) && (value <= 59)
    }

    // WebKit on iOS (Safari, and every iOS browser) gets the full alphanumeric keyboard
    const isIOSWebKit = typeof navigator !== 'undefined' &&
        (/iPhone|iPad|iPod/i.test(navigator.userAgent) ||
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    const minuteInputMode = isIOSWebKit ? 'url' : undefined;

    let points = $derived(computePoints(score));
    let emergencyPoints = $derived(computeEmergencyPoints(score))
    let flagSrc = $derived(flagSource(check))
    let droppedRow = $derived(check.drop ? 'dropped' : '')
    function strValue(x: number): string {
        return isNaN(x) ? '' : x.toString()
    }
    let strMinute: string = $state(strValue(check.minute));
    let strSeconds: string = $state(strValue(check.seconds));
</script>

<tr class={droppedRow} data-cy="tkr">   
    <td class="p-1 align-middle">
        <div class="h-12 w-12 flex items-center justify-center mx-auto">
            <button onclick={toggleType}>
                <img src={flagSrc} alt="Flag" class="h-full w-full object-contain block"/>
            </button>
        </div>
    </td>
    <td class="p-1 text-center">{index + 1}</td>
    <td class="p-1">
        <NumberInput bind:strValue={strMinute} bind:value={check.minute} pattern="-?[0-9]*"  inputmode={minuteInputMode} validator={validMinute} initRow={initRow} onEnter={onEnterMinOrSec} class="{droppedRow} w-full min-w-0" size="3" />
    </td>
    <td class="p-1">
        {#if check.type === CheckpointTypes.Emergency}
            <NumberInput bind:strValue={strSeconds} bind:value={check.seconds} validator={validSeconds} onEnter={onEnterMinOrSec} class="{droppedRow} w-full min-w-0" size="2" />
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
