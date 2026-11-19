<script lang="ts">
    import { type RaceType } from '../models/race'
    import { raceTypeTint } from '../lib/raceTypeStyle'

    interface Props {
      raceType: RaceType
    }
    
    let { 
        raceType
    }: Props = $props();

    let raceTypeClass = $derived(raceTypeTint(raceType))
    let raceTypeName = $derived(raceType === "sprint" ? 'Sprint' : 'Time Keeper')
</script>

<span
  data-cy="type-badge"
  class="mono text-[0.625rem] font-medium px-2.5 py-0.5 uppercase tracking-widest border rounded-full {raceTypeClass}"
>
  {raceTypeName}
</span>