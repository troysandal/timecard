<script lang="ts">
  import { SprintViewModel } from "../viewModels/viewModels.svelte"
    
  let { viewModel }: { viewModel: SprintViewModel } = $props()
  let scoreCard = $derived(viewModel.score.score)
</script>

<div class="flex items-center gap-2 md:gap-6 flex-wrap">
  <div>
    <p class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">SCORE</p>
    <p class="mono text-2xl font-500 text-foreground">&nbsp;</p>
  </div>
  <div class="mx-3 w-0px h-10 bg-border"></div>
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Hours</p>
    <p class="mono text-2xl font-500 text-foreground">{scoreCard.hour}</p>
  </div>
  <div class="w-px h-10 bg-border"></div>
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Minutes</p>
    <p class="mono text-2xl font-500 text-foreground">{scoreCard.minute}</p>
  </div>
  <div class="w-px h-10 bg-border"></div>
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Seconds</p>
    <p class="mono text-2xl font-500 text-foreground">{scoreCard.second}</p>
  </div>
</div>
