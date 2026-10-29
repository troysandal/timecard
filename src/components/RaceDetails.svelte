<script lang="ts">
    import type { Race } from "../models/race";
    import { ScoreFormat } from "../models/timekeeper";

  interface Props {
    race: Race;
  }

  let { race = $bindable() }: Props = $props();

  const formatOptions: { label: string; value: ScoreFormat }[] = [
    { label: 'AMA National', value: ScoreFormat.AMA_National },
    { label: 'Brand X', value: ScoreFormat.NETRA_BrandX }
  ]
</script>

<section class="shrink-0 border-b border-border bg-card px-4 py-4">
    <div class="flex flex-col gap-3 max-w-2xl">
      <div>
        <label class="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
          Name
          <input
          class="w-full border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
          placeholder="Race Name"
          bind:value={race.name}
          />
        </label>
      </div>
      {#if race.raceType === "time_keeper"}
      <div class="flex items-start gap-4">
        <div class="w-24">
          <label class="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
            Rider Minute
            <input
            maxlength="3"
            inputmode="numeric"
            class="field block h-10 w-full border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
            bind:value={race.timeCard.riderMinute}
            />
          </label>
        </div>
        <div class="flex-1">
          <label class="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
            Format
            <select class="field block h-10 w-full normal-case tracking-normal text-foreground" id="score-format" data-cy="format-select" bind:value={race.timeCard.format}>
                {#each formatOptions as opt}
                <option data-cy="format-option-{opt.value}" value={opt.value}>
                {opt.label}
                </option>
            {/each}
            </select>
          </label>
        </div>
      </div>
      {/if}
    </div>
  </section>