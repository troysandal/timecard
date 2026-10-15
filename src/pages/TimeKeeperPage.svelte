<script lang="ts">
  import SafeAreaTop from "../lib/SafeAreaTop.svelte"
  import TimeKeeperFooter from "../lib/TimeKeeperFooter.svelte"
  import EditHeader from "../lib/EditHeader.svelte"
  import { type Race } from "../common"
  import TimeKeeperEnduro from "../lib/TimeKeeperEnduro.svelte"
  import { type TimeKeeperRace } from "../common"
  import { areEqual, ScoreFormat } from "../timekeeper"
  import { type ScoreCard } from "../timekeeper.scoring.base"

  interface Props {
    race: TimeKeeperRace;
    onSave: (updated: Race) => void;
    onBack: () => void;
  }

  let { race: initialRace = $bindable(), onSave, onBack }: Props = $props();

  let race = $state($state.snapshot(initialRace))
  let scoreCard: ScoreCard = $state({
    points: 0,
    emergencyPoints: 0,
    disqualified: false,
    checkScores: [],
    nonDroppedChecks: 0
  })

  function handleSave() {
    // @todo - stop passing param to onSave()
    onSave($state.snapshot(race))
    initialRace = race
  }

  function handleBack() {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        onBack()
      }
    } else {
      onBack()
    }
  }

  function computeDirty(l: TimeKeeperRace, r: TimeKeeperRace): boolean {
    return (l.name != r.name) || 
           !areEqual($state.snapshot(l.timeCard), $state.snapshot(r.timeCard))
  }

  const isDirty: boolean = $derived(computeDirty(initialRace, race))
      const formatOptions: { label: string; value: ScoreFormat }[] = [
        { label: 'AMA National', value: ScoreFormat.AMA_National },
        { label: 'Brand X', value: ScoreFormat.NETRA_BrandX }
    ]
</script>

<div class="h-screen flex flex-col bg-background max-w-2xl w-full mx-auto overflow-hidden">
  <SafeAreaTop color="#F6F5F2" />
  <EditHeader isDirty={isDirty} onBack={handleBack} onSave={handleSave} />

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
    </div>
  </section>

  <section class="flex-1 overflow-hidden border-b border-border bg-card">
    <TimeKeeperEnduro bind:race={race} bind:scoreCard={scoreCard} />
  </section>

  <section class="safe-bottom shrink-0 bg-card border-t-2 border-foreground/10 px-4 pt-4">
    <p class="hidden md:block text-xs text-muted-foreground uppercase tracking-wider mb-3 font-600">Summary</p>
    <TimeKeeperFooter scoreCard={scoreCard} />

  </section>
</div>
