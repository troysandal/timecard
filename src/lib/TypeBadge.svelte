<script lang="ts">
    import { type RaceType } from '../common'

    interface Props {
      raceType: RaceType
    }
    
    let { 
        raceType
    }: Props = $props();

    function computeClass(raceType: RaceType): string {
      if (raceType === "Sprint") {
        return 'border-[#D4420A] text-[#D4420A] bg-[#D4420A]/5'
      }
      return 'border-[#0A6ED4] text-[#0A6ED4] bg-[#0A6ED4]/5'
    }

    let raceTypeClass = $derived(computeClass(raceType))
</script>

<span
  class="mono text-[10px] font-medium px-1.5 py-0.5 uppercase tracking-widest border {raceTypeClass}"
  style="borderRadius: 'var(--radius)'"
>
  {raceType}
</span>