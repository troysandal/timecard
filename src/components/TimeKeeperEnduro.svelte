<script lang="ts">
    import { onMount } from 'svelte'
    import TimeKeeperRow from "../components/TimeKeeperRow.svelte";
    import { TimeKeeperViewModel } from "../viewModels/viewModels.svelte"
    import { canScan } from '../lib/scanCard';
    import PhotoViewerModal from './PhotoViewerModal.svelte';

    interface Props { 
        viewModel: TimeKeeperViewModel; 
    }

    let {viewModel = $bindable()}: Props = $props()

    const checkpoints = $derived(viewModel.race.timeCard.checkpoints)
    let available = $state(false);
    let showPhoto = $state(false);
    onMount(async () => { available = await canScan(); });

    function onReset() {
      if (window.confirm('Are you sure you want to reset the time card?')) {
        viewModel.resetCard()
      }
    }

    async function onScan() {
      if (!window.confirm("Warning - This will replace the contents of your time card - are you sure?")) {
        return 
      }
      const result = await viewModel.scan()
      if (result === "applied") {
        window.alert("Scan Complete - WARNING - Double check time card, AI can make mistakes.")
      } else if (result === "empty") {
        window.alert("No checkpoints found in scan.")
      } else if (result === "failed") {
        window.alert("Sorry, the scan failed, please try again.")
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
            {#each checkpoints as check, index (check)}
                <TimeKeeperRow bind:check={checkpoints[index]!} score={scoreCard.checkScores[index]} {index} onEnter={(i: number) => viewModel.rowEntered(i)} />
            {/each}
        </tbody>
    </table>  
  </div>
  <div class="border-t border-border px-3 py-3 flex gap-2">
    <button
      data-cy="add-check"
      onclick={() => viewModel.addCheck()}
      class="flex-1 min-h-11 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium
             hover:opacity-90 active:scale-95 transition"
    >
      Add Check
    </button>
    <button
      onclick={onReset}
      class="flex-1 min-h-11 px-4 rounded-md border border-border text-sm font-medium
             text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition"
    >
      Reset
    </button>
    {#if available}
    <button
      onclick={onScan}
      class="flex-1 min-h-11 px-4 rounded-md border border-border text-sm font-medium
             text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition"
    >
      Scan
    </button>
    {/if}
    {#if viewModel.race.imagePath}
    <button
      data-cy="view-photo"
      onclick={() => { showPhoto = true }}
      class="flex-1 min-h-11 px-4 rounded-md border border-border text-sm font-medium
             text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition"
    >
      View
    </button>
    {/if}
  </div>
</div>
{#if showPhoto && viewModel.race.imagePath}
  <PhotoViewerModal imagePath={viewModel.race.imagePath} onClose={() => { showPhoto = false }} />
{/if}
