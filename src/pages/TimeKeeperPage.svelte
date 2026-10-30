<script lang="ts">
  import SafeAreaTop from "../components/SafeAreaTop.svelte"
  import EditHeader from "../components/EditHeader.svelte"
  import RaceDetails from "../components/RaceDetails.svelte";
  import TimeKeeperEnduro from "../components/TimeKeeperEnduro.svelte"
  import TimeKeeperFooter from "../components/TimeKeeperFooter.svelte"
  import { type Race } from "../models/race"
  import { createViewModel } from "../viewModels/viewModels.svelte"

  interface Props {
    race: Race;
    onSave: (race: Race) => void;
    onBack: () => void;
  }

  let { race: initialRace, onSave, onBack }: Props = $props();
  let viewModel = $derived(createViewModel(initialRace));

  function handleSave() {
    viewModel.save(onSave)
  }

  function handleBack() {
    if (viewModel.isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        onBack()
      }
    } else {
      onBack()
    }
  }
</script>

<div class="h-screen flex flex-col bg-background max-w-2xl w-full mx-auto overflow-hidden">
  <SafeAreaTop color="#F6F5F2" />
  <EditHeader {viewModel} onBack={handleBack} onSave={handleSave} />
  <RaceDetails bind:race={viewModel.race} />

  <section class="flex-1 overflow-hidden border-b border-border bg-card">
    {#if viewModel.kind === "time_keeper"}
      <TimeKeeperEnduro bind:viewModel={viewModel} />
    {/if}
  </section>

  <section class="safe-bottom shrink-0 bg-card border-t-2 border-foreground/10 px-4 pt-4">
    <p class="hidden md:block text-xs text-muted-foreground uppercase tracking-wider mb-3 font-600">Summary</p>
    {#if viewModel.kind === "time_keeper"}
      <TimeKeeperFooter {viewModel} />
    {:else }
      <p class="text-sm text-muted-foreground">Summary not available for this race type.</p>
    {/if}
  </section>
</div>
