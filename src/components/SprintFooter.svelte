<script lang="ts">
  import { SprintViewModel } from "../viewModels/viewModels.svelte"
  function formatTime(value: number): string {
    return isNaN(value) ? '??' : value.toString().padStart(2, '0')
  }
  let { viewModel }: { viewModel: SprintViewModel } = $props()
  let hour = $derived(formatTime(viewModel.score.score.hour))
  let minute = $derived(formatTime(viewModel.score.score.minute))
  let second = $derived(formatTime(viewModel.score.score.second))
  
</script>

<div class="flex items-center gap-2 md:gap-6 flex-wrap">
  <div>
    <p class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">SCORE</p>
    <p class="mono text-2xl font-500 text-foreground">&nbsp;</p>
  </div>
  <div class="mx-3 w-0px h-10 bg-border"></div>
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Hours</p>
    <p class="mono text-2xl font-500 text-foreground">{hour}</p>
  </div>
  <div class="w-px h-10 bg-border"></div>
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Minutes</p>
    <p class="mono text-2xl font-500 text-foreground">{minute}</p>
  </div>
  <div class="w-px h-10 bg-border"></div>
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Seconds</p>
    <p class="mono text-2xl font-500 text-foreground">{second}</p>
  </div>
</div>
