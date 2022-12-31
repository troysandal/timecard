<script>
    import { CheckpointTypes, Emergency, Secret, Start, Known } from '../timekeeper'
    import NumberInput from './NumberInput.svelte';

    export let check
    export let index
    export let riderMinute

    function createCheckpoint(checkDatum) {
        const minute = parseInt(checkDatum.minute)

        if (isNaN(minute)) {
            return null
        }

        switch (checkDatum.type) {
            case CheckpointTypes.Emergency:
                const seconds = parseInt(checkDatum.seconds)
                if (!isNaN(seconds)) {
                    return new Emergency(minute, seconds)
                }
                break;
            case CheckpointTypes.Known:
                return new Known(minute)
            case CheckpointTypes.Secret:
                return new Secret(minute)
            case CheckpointTypes.Start:
                return new Start(minute)
        }

        return null
    }

    $: points = computePoints(check, riderMinute);
    $: emergencyPoints = computeEmergencyPoints(check, riderMinute)
    $: flagSrc = flagSource(check)

    function computePoints(checkDatum, riderMinute) {
        const check = createCheckpoint(checkDatum)
        if (check) {
            return check.points(riderMinute)
        }
        return 0
    }

    function computeEmergencyPoints(checkDatum, riderMinute) {
        const check = createCheckpoint(checkDatum)
        if (check && check.type === CheckpointTypes.Emergency) {
            return check.emergencyPoints(riderMinute)
        }
        return 0
    }

    function flagSource(checkDatum) {
        const FLAGS = {
            [CheckpointTypes.Start]: './images/start.png',
            [CheckpointTypes.Known]: './images/known.png',
            [CheckpointTypes.Secret]: './images/secret.png',
            [CheckpointTypes.Emergency]: './images/emergency.png'
        }
        return FLAGS[checkDatum.type]
    }

    function toggleType() {
        check.type = (check.type + 1) % 4
    }

    function initRow(row) {
        row.focus()
    }
    $: droppedRow = check.drop ? 'dropped' : ''

    function validMinute(value) {
        if (value === undefined || value === null || value === '') {
            return false
        }
        return true
    }
    function validSeconds(value) {
        if (value === undefined || value === '') {
            return false
        }
        return !isNaN(parseInt(value)) && (value >= 0) && (value <= 59)
    }

</script>

<tr class={droppedRow}>
    <td><img src={flagSrc} alt="Flag" on:click={toggleType} on:keydown={() => {}}/></td>
    <td>{index + 1}</td>
    <td>
        <NumberInput bind:value={check.minute} pattern={null} validator={validMinute} initRow={initRow} class="{droppedRow}" size="3" style="width:2em" />
    </td>
    <td>
        {#if check.type === CheckpointTypes.Emergency}
            <NumberInput bind:value={check.seconds} validator={validSeconds} class="{droppedRow}" size="2" style="width:2em" />
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
