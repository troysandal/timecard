<script lang="ts">
    import TimeKeeperRow from "./TimeKeeperRow.svelte";
    import { CheckpointTypes, Emergency, Known, Secret, Start, TimeKeeperEnduro as Enduro } from "../timekeeper";
    import type { CheckDatum } from "./TimeKeeperUtil";
    import TimeKeeperScore from "./TimeKeeperScore.svelte";
    import NumberInput from "./NumberInput.svelte";
    import { ScoreFormat, type Score } from "../timekeeper.scoring"

    const DEFAULT_RIDER_MINUTE = 1;
    let riderMinute = $state(DEFAULT_RIDER_MINUTE)
    let checkData = $state(initialChecks(1))
    let format = $state<ScoreFormat>(ScoreFormat.AMA_National)

    const formatOptions: { label: string; value: ScoreFormat }[] = [
        { label: 'AMA National', value: ScoreFormat.AMA_National },
        { label: 'Brand X', value: ScoreFormat.NETRA_BrandX }
    ]

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
        switch (checkDatum.type) {
            case CheckpointTypes.Emergency:
                if (!isNaN(checkDatum.seconds)) {
                    return new Emergency(checkDatum.minute, checkDatum.seconds, checkDatum.drop)
                }
                break;
            case CheckpointTypes.Known:
                return new Known(checkDatum.minute, checkDatum.drop)
            case CheckpointTypes.Secret:
                return new Secret(checkDatum.minute, checkDatum.drop)
            case CheckpointTypes.Start:
                return new Start(checkDatum.minute, checkDatum.drop)
        }
        // Will score as invalid
        return new Secret(NaN)
    }

    function buildEnduro(riderMinute: number, checkData: CheckDatum[]) {
        if (isNaN(riderMinute)) {
            return null
        }

        const enduro = new Enduro(riderMinute, format)
        for (let checkDatum of checkData) {
            const check = createCheckpoint(checkDatum)
            if (check) {
                enduro.checkpoints.push(check)
            }
        }
        return enduro
    }

    type UIScoreCard = {
        points: number | string
        emergencyPoints: number | string
        disqualified: string
        checkScores: Score[]
        nonDroppedChecks: number
    }

    function computeScoreCard(riderMinute: number, checkData: CheckDatum[]): UIScoreCard {
        const enduro = buildEnduro(riderMinute, checkData)
        if (enduro) {
            const score = enduro.score
            return {
                points: score.points,
                emergencyPoints: score.emergencyPoints,
                disqualified: score.disqualified ? 'YES':'NO',
                checkScores: score.checkScores,
                nonDroppedChecks: score.nonDroppedChecks,
            }
        }
        return {
            points: '',
            emergencyPoints: '',
            disqualified: 'NO',
            checkScores: Array(checkData.length).fill(null),
            nonDroppedChecks: checkData.length - checkData.filter((v) => v.drop).length,
        }
    }
    function validMinute(value: string) {
        if (value === undefined || value === '') {
            return false
        }
        const ivalue = parseInt(value)
        return !isNaN(ivalue) && (ivalue >= 1)
    }

    function onEnter(index: number) {
        if (index === checkData.length - 1) {
            addCheck();
        }
    }
    let scoreCard = $derived(computeScoreCard(riderMinute, checkData))
</script>

<div id="riderMinute">
Rider Minute: <NumberInput bind:value={riderMinute} strValue={DEFAULT_RIDER_MINUTE.toString()} validator={validMinute} size="3" min="1" style="width:3em" />
<br />
<label for="score-format">Scoring Format:</label>
<select id="score-format" data-cy="format-select" bind:value={format}>
    {#each formatOptions as opt}
    <option data-cy="format-option-{opt.value}" value={opt.value}>
      {opt.label}
    </option>
  {/each}
</select>
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
            <TimeKeeperRow bind:check={checkData[index]as CheckDatum} score={scoreCard.checkScores[index]} index={index} onEnter={onEnter} />
        {/each} 
    </tbody>
    <tfoot>
        <tr>
            <td colspan="7">
                <TimeKeeperScore totalChecks={scoreCard.nonDroppedChecks} points={scoreCard.points} emergencyPoints={scoreCard.emergencyPoints} disqualified={scoreCard.disqualified} />
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
