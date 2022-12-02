<script>
    import TimeKeeperRow from "./TimeKeeperRow.svelte";
    import { CheckpointTypes, Emergency, Known, Secret, Start, TimeKeeperEnduro as Enduro } from "../timekeeper";
    import TimeKeeperScore from "./TimeKeeperScore.svelte";

    let riderMinute = 1
    let checkData = initialChecks(1)
    
    function initialChecks(MAX) {
        const checks = []
        for (let i = 0 ; i < MAX ; i++) {
            checks.push({
                type: CheckpointTypes.Secret,
                minute: riderMinute,
                seconds: 30,
                drop: false
            })
        }
        return checks
    }

    function addCheck() {
        console.log(riderMinute)
        checkData[checkData.length] = {
            type: CheckpointTypes.Secret,
            minute: riderMinute,
            seconds: 30,
            drop: false
        }
    }

    function resetCard() {
        if (window.confirm('Are you sure you want to reset the score card?')) {
            riderMinute = 1
            checkData = initialChecks(1)
        }
    }

    $: points = computePoints(riderMinute, checkData)
    $: emergencyPoints = computeEmergencyPoints(riderMinute, checkData)
    $: totalChecks = computeTotalChecks(checkData)
    $: disqualified = computeDisqualified(riderMinute, checkData)

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

    function buildEnduro(riderMinute, checkData) {
        if (riderMinute < 1) {
            return null
        }

        const enduro = new Enduro(riderMinute)
        for (let checkDatum of checkData) {
            const check = createCheckpoint(checkDatum)
            if (!checkDatum.drop && check) {
                enduro.checkpoints.push(check)
            }
        }
        return enduro
    }

    function computePoints(riderMinute, checkData) {
        const enduro = buildEnduro(riderMinute, checkData)
        if (enduro) {
            return enduro.points
        }
        return '0'
    }

    function computeEmergencyPoints(riderMinute, checkData) {
        const enduro = buildEnduro(riderMinute, checkData)
        if (enduro) {
            return enduro.emergencyPoints
        }
        return '0'
    }

    function computeTotalChecks(checkData) {
        return checkData.length - checkData.filter((v) => v.drop).length
    }

    function computeDisqualified(riderMinute, checkData) {
        const enduro = buildEnduro(riderMinute, checkData)
        if (enduro) {
            return enduro.disqualified ? 'YES' : 'NO'
        }
        return 'NO'
    }
</script>

<div id="riderMinute">
Rider Minute: <input pattern="[0-9]*" size="3" min="1" bind:value="{riderMinute}" />
</div>

<table>
    <thead>
        <tr>
            <th></th>
            <th>#</th>
            <th>Minute</th>
            <th>Second</th>
            <th>Points</th>
            <th>Emergency<br />Points</th>
            <th>Drop</th>
        </tr>
    </thead>
    <tbody>
        {#each checkData as checkDatum, index}
            <TimeKeeperRow bind:check={checkDatum} riderMinute={riderMinute} index={index} />
        {/each} 
    </tbody>
    <tfoot>
        <tr>
            <td colspan="7">
                <TimeKeeperScore totalChecks={totalChecks} points={points} emergencyPoints={emergencyPoints} disqualified={disqualified} />
            </td>
        </tr>
        <tr>
            <th colspan="7">
                <button id="addCheck" on:click={addCheck}>Add a Check</button>
                <button id="reset" on:click={resetCard}>Reset</button>
            </th>            
        </tr>
    </tfoot>
</table>  

<style>
    table,
    th {
        border: 1px solid grey;
        border-collapse: collapse;
        vertical-align: bottom;
    }

    tfoot {
        padding: 10px;
    }

    #riderMinute {
        margin-bottom: 5px;
    }
</style>
