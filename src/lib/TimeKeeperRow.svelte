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
    <td>
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
        <img src={flagSrc} alt="Flag" onclick={toggleType}/>
    </td>
    <td>{index + 1}</td>
    <td>
        <NumberInput bind:value={check.minute} pattern={undefined} validator={validMinute} initRow={initRow} onEnter={onEnterMinOrSec} class={droppedRow} size="3" style="width:2em" />
    </td>
    <td>
        {#if check.type === CheckpointTypes.Emergency}
            <NumberInput bind:value={check.seconds} validator={validSeconds} onEnter={onEnterMinOrSec} class={droppedRow} size="2" style="width:2em" />
        {/if}
    </td>
    <td><input class="{droppedRow}" disabled value={points} size="3" style="width:2em" /></td>
    <td><input class="{droppedRow}" disabled value={emergencyPoints} size="4" style="width:3em" /></td>
    <td><input type="checkbox" bind:checked={check.drop}></td>
</tr>

<style>
    img {
        vertical-align: middle;
    }
    td {
        border: 1px solid grey;
        border-collapse: collapse;
        text-align: center;
    }

    img {
        width: 30px;
        height: 30px;
    }
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
