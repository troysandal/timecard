<script lang="ts">
    import { CheckpointTypes, Emergency, Secret, Start, Known } from '../timekeeper'
    import type { CheckDatum } from './TimeKeeperUtil';
    import NumberInput from './NumberInput.svelte';
    import start from '/src/assets/start.png'
    import known from '/src/assets/known.png'
    import secret from '/src/assets/secret.png'
    import emergency from '/src/assets/emergency.png'

    interface Props {
        check: CheckDatum,
        index: number,
        riderMinute: number 
    }
    let { check = $bindable(), index, riderMinute }: Props = $props();

    function createCheckpoint(checkDatum: CheckDatum) {
        if (isNaN(checkDatum.minute)) {
            return null
        }

        switch (checkDatum.type) {
            case CheckpointTypes.Emergency:
                if (!isNaN(checkDatum.seconds)) {
                    return new Emergency(checkDatum.minute, checkDatum.seconds)
                }
                break;
            case CheckpointTypes.Known:
                return new Known(checkDatum.minute)
            case CheckpointTypes.Secret:
                return new Secret(checkDatum.minute)
            case CheckpointTypes.Start:
                return new Start(checkDatum.minute)
        }

        return null
    }


    function computePoints(checkDatum: CheckDatum, riderMinute: number) {
        if (isNaN(riderMinute)) {
            return ''
        }

        const check = createCheckpoint(checkDatum)
        if (check) {
            return check.points(riderMinute)
        }
        return ''
    }

    function computeEmergencyPoints(checkDatum: CheckDatum, riderMinute: number) {
        if (isNaN(riderMinute)) {
            return ''
        }

        const check = createCheckpoint(checkDatum)
        if (check && check.type === CheckpointTypes.Emergency) {
            return (check as Emergency).emergencyPoints(riderMinute)
        }
        return ''
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

    let points = $derived(computePoints(check, riderMinute));
    let emergencyPoints = $derived(computeEmergencyPoints(check, riderMinute))
    let flagSrc = $derived(flagSource(check))
    let droppedRow = $derived(check.drop ? 'dropped' : '')
</script>

<tr class={droppedRow}>
    <td>
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
        <img src={flagSrc} alt="Flag" onclick={toggleType}/>
    </td>
    <td>{index + 1}</td>
    <td>
        <NumberInput bind:value={check.minute} pattern={undefined} validator={validMinute} initRow={initRow} class={droppedRow} size="3" style="width:2em" />
    </td>
    <td>
        {#if check.type === CheckpointTypes.Emergency}
            <NumberInput bind:value={check.seconds} validator={validSeconds} class={droppedRow} size="2" style="width:2em" />
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
