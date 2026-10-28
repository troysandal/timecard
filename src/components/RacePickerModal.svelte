<script lang="ts">
    import { type RaceType } from '../models/common'

    interface Props {
      onSelect: (t: RaceType) => void;
      onClose: () => void
    }
    
    let { 
        onSelect, onClose
    }: Props = $props();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div class="bg-card border border-border shadow-lg w-80 p-6" style="borderRadius: 'var(--radius)'">
    <h2 class="font-display text-lg font-800 tracking-tight mb-1 text-foreground">New Item</h2>
    <p class="text-sm text-muted-foreground mb-5">Choose the item type to add.</p>
    <div class="flex flex-col gap-3">
      <button
        onclick={() => onSelect('Time Keeper')}
        class="w-full border border-border hover:border-[#D4420A] hover:bg-[#D4420A]/5 text-left px-4 py-3 transition-colors group"
        style="borderRadius: 'var(--radius)'"
      >
        <div class="font-display font-700 text-sm text-foreground group-hover:text-[#D4420A] transition-colors">Time Keeper</div>
        <div class="text-xs text-muted-foreground mt-0.5">Track tasks and hours</div>
      </button>
      <button
        onclick={() => onSelect('Sprint')}
        class="w-full border border-border hover:border-[#0A6ED4] hover:bg-[#0A6ED4]/5 text-left px-4 py-3 transition-colors group"
        style="borderRadius: 'var(--radius)'"
      >
        <div class="font-display font-700 text-sm text-foreground group-hover:text-[#0A6ED4] transition-colors">Sprint</div>
        <div class="text-xs text-muted-foreground mt-0.5">Plan stories and points</div>
      </button>
    </div>
    <button
      onclick={onClose}
      class="mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
    >
      Cancel
    </button>
  </div>
</div>
