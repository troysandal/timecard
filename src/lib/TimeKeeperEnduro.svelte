<script lang="ts">
    import TimeKeeperRow from "./TimeKeeperRow.svelte";
    import { CheckpointTypes, Emergency, Known, Secret, Start, TimeKeeperEnduro as Enduro } from "../timekeeper";
    import type { CheckDatum } from "./TimeKeeperUtil";
    import TimeKeeperScore from "./TimeKeeperScore.svelte";
    import NumberInput from "./NumberInput.svelte";

    const DEFAULT_RIDER_MINUTE = 1;
    let riderMinute = $state(DEFAULT_RIDER_MINUTE)
    let checkData = $state(initialChecks(1))
    
    function initialChecks(MAX: number): CheckDatum[] {
        const checks: CheckDatum[] = []
        for (let i = 0 ; i < MAX ; i++) {
            checks.push({
                type: CheckpointTypes.Secret,
                minute: riderMinute,
                seconds: 30,
                drop: false
            } as CheckDatum)
        }
        return checks
    }

    function addCheck() {
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

    function buildEnduro(riderMinute: number, checkData: CheckDatum[]) {
        if (isNaN(riderMinute)) {
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

    function computePoints(riderMinute: number, checkData: CheckDatum[]) {
        const enduro = buildEnduro(riderMinute, checkData)
        if (enduro) {
            return enduro.points
        }
        return ''
    }

    function computeEmergencyPoints(riderMinute: number, checkData: CheckDatum[]) {
        const enduro = buildEnduro(riderMinute, checkData)
        if (enduro) {
            return enduro.emergencyPoints
        }
        return ''
    }

    function computeTotalChecks(checkData: CheckDatum[]) {
        return checkData.length - checkData.filter((v) => v.drop).length
    }

    function computeDisqualified(riderMinute: number, checkData: CheckDatum[]) {
        const enduro = buildEnduro(riderMinute, checkData)
        if (enduro) {
            return enduro.disqualified ? 'YES' : 'NO'
        }
        return ''
    }

    function validMinute(value: string) {
        if (value === undefined || value === '') {
            return false
        }
        const ivalue = parseInt(value)
        return !isNaN(ivalue) && (ivalue >= 1)
    }

    let points = $derived(computePoints(riderMinute, checkData))
    let emergencyPoints = $derived(computeEmergencyPoints(riderMinute, checkData))
    let totalChecks = $derived(computeTotalChecks(checkData))
    let disqualified = $derived(computeDisqualified(riderMinute, checkData))
</script>

<div id="riderMinute">
Rider Minute: <NumberInput bind:value={riderMinute} strValue={DEFAULT_RIDER_MINUTE.toString()} validator={validMinute} size="3" min="1" style="width:3em" />
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
        {#each checkData, index}
            <TimeKeeperRow bind:check={checkData[index]as CheckDatum} riderMinute={riderMinute} index={index} />
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
                <button id="addCheck" onclick={addCheck}>Add a Check</button>
                <button id="reset" onclick={resetCard}>Reset</button>
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
