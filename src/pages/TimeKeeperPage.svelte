<script lang="ts">
  import SafeAreaTop from "../components/SafeAreaTop.svelte"
  import TimeKeeperFooter from "../components/TimeKeeperFooter.svelte"
  import EditHeader from "../components/EditHeader.svelte"
  import { type Race, type TimeKeeperRace } from "../models/common"
  import TimeKeeperEnduro from "../components/TimeKeeperEnduro.svelte"
  import { areEqual } from "../models/timekeeper"
  import { type ScoreCard } from "../lib/scoring/timekeeper.scoring.base"
  import RaceDetails from "../components/RaceDetails.svelte";

  interface Props {
    race: TimeKeeperRace;
    onSave: (race: Race) => void;
    onBack: () => void;
  }

  let { race: initialRace, onSave, onBack }: Props = $props();

  // svelte-ignore state_referenced_locally
  let raceLKG = $state($state.snapshot(initialRace))
  // svelte-ignore state_referenced_locally
  let race = $state($state.snapshot(initialRace))
  let scoreCard: ScoreCard = $state({
    points: 0,
    emergencyPoints: 0,
    disqualified: false,
    checkScores: [],
    nonDroppedChecks: 0
  })

  function handleSave() {
    const saved = $state.snapshot(race)
    onSave(saved)
    raceLKG = saved
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

  const isDirty: boolean = $derived(computeDirty(raceLKG, race))
</script>

<div class="h-screen flex flex-col bg-background max-w-2xl w-full mx-auto overflow-hidden">
  <SafeAreaTop color="#F6F5F2" />
  <EditHeader isDirty={isDirty} onBack={handleBack} onSave={handleSave} />
  <RaceDetails bind:race={race} />

  <section class="flex-1 overflow-hidden border-b border-border bg-card">
    <TimeKeeperEnduro bind:race={race} bind:scoreCard={scoreCard} />
  </section>

  <section class="safe-bottom shrink-0 bg-card border-t-2 border-foreground/10 px-4 pt-4">
    <p class="hidden md:block text-xs text-muted-foreground uppercase tracking-wider mb-3 font-600">Summary</p>
    <TimeKeeperFooter scoreCard={scoreCard} />
  </section>
</div>
