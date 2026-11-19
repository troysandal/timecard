<script lang="ts">
    import { type RaceType } from '../models/race'
    import Sheet from './Sheet.svelte'
    import { raceTypeTint } from '../lib/raceTypeStyle'

    interface Props {
      onSelect: (t: RaceType) => void;
      onClose: () => void
    }

    let {
        onSelect, onClose
    }: Props = $props();
</script>

<Sheet title="New item" labelledBy="race-picker-title" dataCy="race-picker" {onClose}>
  <div class="px-4 pt-4 md:px-6">
    <h2 id="race-picker-title" class="font-display text-lg font-800 tracking-tight mb-1 text-foreground">New Score Card</h2>
    <div class="flex flex-col gap-3">
      <button
        data-cy="add-time-keeper"
        onclick={() => onSelect('time_keeper')}
        class="w-full border rounded-lg text-left px-4 py-3 {raceTypeTint('time_keeper')}"
      >
        <div class="font-display font-700 font-bold text-sm ">Time Keeper</div>
        <div class="text-xs text-muted-foreground mt-0.5">AMA or BrandX Format</div>
      </button>
      <button
        data-cy="add-sprint"
        onclick={() => onSelect('sprint')}
        class="w-full border rounded-lg text-left px-4 py-3 {raceTypeTint('sprint')}"
      >
        <div class="font-display font-700 font-bold text-sm ">Sprint</div>
        <div class="text-xs text-muted-foreground mt-0.5">Timed Tests</div>
      </button>
    </div>
  </div>
  <button
    onclick={onClose}
    data-cy="cancel-picker"
    class="mt-2 mb-2 min-h-touch w-full text-xs font-extrabold hover:text-foreground transition-colors"
  >
    Cancel
  </button>
</Sheet>
