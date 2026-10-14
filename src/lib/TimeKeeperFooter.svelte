<script lang="ts">
  import { type ScoreCard } from "../timekeeper.scoring.base"
    
  let { scoreCard } = $props<{ scoreCard: ScoreCard }>()
</script>

<div class="flex items-center gap-6 flex-wrap">
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Points</p>
    <p class="mono text-2xl font-500 text-foreground">{scoreCard.points}</p>
  </div>
  <div class="w-px h-10 bg-border"></div>
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Emergency</p>
    <p class="mono text-2xl font-500 text-green-600">{scoreCard.emergencyPoints}</p>
  </div>
  <div class="w-px h-10 bg-border"></div>
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Disqualified</p>
    <p class="mono text-2xl font-500 text-[#0A6ED4]">{scoreCard.disqualified ? "YES" : "NO"}</p>
  </div>
  <div class="w-px h-10 bg-border"></div>
  <div>
    <p class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5"># Checks</p>
    <p class="mono text-2xl font-500 text-foreground">{scoreCard.nonDroppedChecks}</p>
  </div>
</div>
