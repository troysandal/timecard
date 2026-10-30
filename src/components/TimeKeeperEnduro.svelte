<script lang="ts">
    import TimeKeeperRow from "../components/TimeKeeperRow.svelte";
    import { type Checkpoint } from "../models/timekeeper";
    import { TimeKeeperViewModel } from "../viewModels/viewModels.svelte"

    interface Props { 
        viewModel: TimeKeeperViewModel; 
    }

    let {viewModel = $bindable()}: Props = $props()

    function onEnter(index: number) {
        if (index === viewModel.race.timeCard.checkpoints.length - 1) {
            viewModel.addCheck();
        }
    }
    
    let scoreCard = $derived(viewModel.score.scoreCard)
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
            {#each viewModel.race.timeCard.checkpoints, index}
                <TimeKeeperRow bind:check={viewModel.race.timeCard.checkpoints[index] as Checkpoint} score={scoreCard.checkScores[index]} index={index} onEnter={onEnter} />
            {/each} 
        </tbody>
    </table>  
  </div>
  <div class="border-t border-border px-3 py-3 flex gap-2">
    <button
      onclick={() => viewModel.addCheck()}
      class="flex-1 min-h-11 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium
             hover:opacity-90 active:scale-95 transition"
    >
      Add Check
    </button>
    <button
      onclick={() => viewModel.resetCard()}
      class="flex-1 min-h-11 px-4 rounded-md border border-border text-sm font-medium
             text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition"
    >
      Reset
    </button>
  </div>
</div>
