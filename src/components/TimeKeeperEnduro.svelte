<script lang="ts">
    import TimeKeeperRow from "../components/TimeKeeperRow.svelte";
    import { type Checkpoint, CheckpointTypes, Emergency, Known, Secret, Start, TimeKeeperEnduro as Enduro } from "../models/timekeeper";
    import type { ScoreCard } from "../lib/scoring/timekeeper.scoring.base";
    import { ScoreKeeper } from "../lib/scoring/timekeeper.scoring"
    import { type TimeKeeperRace } from "../models/common"

    interface Props { 
        race: TimeKeeperRace; 
        scoreCard: ScoreCard;
    }

    let {race = $bindable(), scoreCard: scoreCardProp = $bindable()}: Props = $props()

    function initialChecks(MAX: number): Checkpoint[] {
        const checks: Checkpoint[] = []
        for (let i = 0 ; i < MAX ; i++) {
            checks.push({
                type: CheckpointTypes.Secret,
                minute: race.timeCard.riderMinute,
                seconds: 30,
                drop: false
            } as Checkpoint)
        }
        return checks
    }

    function addCheck() {
        race.timeCard.checkpoints[race.timeCard.checkpoints.length] = {
            type: CheckpointTypes.Secret,
            minute: race.timeCard.riderMinute,
            seconds: 30,
            drop: false
        }
    }

    function resetCard() {
        if (window.confirm('Are you sure you want to reset the time card?')) {
            race.timeCard.riderMinute = 1
            race.timeCard.checkpoints = initialChecks(1)
        }
    }

    function createCheckpoint(checkDatum: Checkpoint) {
        switch (checkDatum.type) {
            case CheckpointTypes.Emergency:
                // @todo - remove 
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

    function buildEnduro(riderMinute: number, checkData: Checkpoint[]) {
        if (isNaN(riderMinute)) {
            return null
        }

        const enduro = new Enduro(riderMinute, race.timeCard.format)
        for (let checkDatum of checkData) {
            const check = createCheckpoint(checkDatum)
            if (check) {
                enduro.checkpoints.push(check)
            }
        }
        return enduro
    }

    $effect(() => {
        scoreCardProp = scoreCard
    })

    function computeScoreCard(riderMinute: number, checkData: Checkpoint[]): ScoreCard {
        const enduro = buildEnduro(riderMinute, checkData)
        if (enduro) {
            return ScoreKeeper.scoreEnduro(enduro)
        }
        return {
            points: 0,
            emergencyPoints: 0,
            disqualified: false,
            checkScores: Array(checkData.length).fill(null),
            nonDroppedChecks: checkData.length - checkData.filter((v) => v.drop).length,
        }
    }

    // function validMinute(value: string) {
    //     if (value === undefined || value === '') {
    //         return false
    //     }
    //     const ivalue = parseInt(value)
    //     return !isNaN(ivalue) && (ivalue >= 1)
    // }

    function onEnter(index: number) {
        if (index === race.timeCard.checkpoints.length - 1) {
            addCheck();
        }
    }
    
    let scoreCard = $derived(computeScoreCard(race.timeCard.riderMinute, race.timeCard.checkpoints))
</script>

<div class="flex flex-col h-full">
  <div class="overflow-x-auto flex-1 overflow-y-auto">
    <table class="w-full text-sm min-w-[320px]">
        <colgroup>
        <col class="w-8 md:w-16"> <!-- Flag/Image -->
        <col class="w-8 md:w-12"> <!-- Chk. # -->
        <col class="w-12 md:w-20"> <!-- Minute Input -->
        <col class="w-12 md:w-20"> <!-- Second Input -->
        <col class="w-12 md:w-20"> <!-- Points Input -->
        <col class="w-12 md:w-24"> <!-- Emergency Points -->
        <col class="w-12 md:w-16"> <!-- Drop Checkbox -->
        </colgroup>

        <thead>
            <tr>
                <th></th>
                <th class="p-1 text-center align-bottom"><span class="md:hidden">#</span><span class="hidden md:inline">Chk. #</span></th>
                <th class="p-1 text-center align-bottom"><span class="md:hidden">Min</span><span class="hidden md:inline">Minute</span></th>
                <th class="p-1 text-center align-bottom"><span class="md:hidden">Sec</span><span class="hidden md:inline">Second</span></th>
                <th class="p-1 text-center align-bottom"><span class="md:hidden">Pts</span><span class="hidden md:inline">Points</span></th>
                <th class="p-1 text-center align-bottom"><span class="md:hidden">Emrg<br />Pts</span><span class="hidden md:inline">Emergency<br />Points</span></th>
                <th class="p-1 text-center align-bottom">Drop</th>
            </tr>
        </thead>
        <tbody>
            {#each race.timeCard.checkpoints, index}
                <TimeKeeperRow bind:check={race.timeCard.checkpoints[index]as Checkpoint} score={scoreCard.checkScores[index]} index={index} onEnter={onEnter} />
            {/each} 
        </tbody>
    </table>  
  </div>
  <div class="border-t border-border px-3 py-3 flex gap-2">
    <button
      onclick={addCheck}
      class="flex-1 min-h-11 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium
             hover:opacity-90 active:scale-95 transition"
    >
      Add Check
    </button>
    <button
      onclick={resetCard}
      class="flex-1 min-h-11 px-4 rounded-md border border-border text-sm font-medium
             text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition"
    >
      Reset
    </button>
  </div>
</div>
