<script lang="ts">
  import { TimeKeeperViewModel } from "../viewModels/viewModels.svelte"
    
  let { viewModel }: { viewModel: TimeKeeperViewModel } = $props()
  let scoreCard = $derived(viewModel.score.scoreCard)
  const dq = $derived(scoreCard.disqualified ? "text-red-600" : "text-green-600")
</script>

<div class="flex items-center gap-2 md:gap-6 flex-wrap">
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Points</p>
    <p class="mono text-2xl font-500 text-foreground">{scoreCard.points}</p>
  </div>
  <div class="w-px h-10 bg-border"></div>
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Emergency</p>
    <p class="mono text-2xl font-500 text-blue-600">{scoreCard.emergencyPoints}</p>
  </div>
  <div class="w-px h-10 bg-border"></div>
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Disqualified</p>
    <p class="mono text-2xl font-500 {dq}">{scoreCard.disqualified ? "YES" : "NO"}</p>
  </div>
  <div class="w-px h-10 bg-border"></div>
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5"># Checks</p>
    <p class="mono text-2xl font-500 text-foreground">{scoreCard.nonDroppedChecks}</p>
  </div>
</div>
