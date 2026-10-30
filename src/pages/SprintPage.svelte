<script lang="ts">
  import SafeAreaTop from "../components/SafeAreaTop.svelte";
  import EditHeader from "../components/EditHeader.svelte";
  import SprintEnduro from "../components/SprintEnduro.svelte";
  import type { Race, SprintRace } from "../models/race"
  import { createViewModel } from "../viewModels/viewModels.svelte"

  interface Props {
    race: SprintRace;
    onSave: (race: Race) => void;
    onBack: () => void;
  }

  let { race: initialRace, onSave, onBack }: Props = $props();
  let viewModel = $derived(createViewModel(initialRace));

  function handleSave() {
    viewModel.save(onSave)
  }

  function handleBack() {
      onBack()
  }
</script>

<SafeAreaTop color="#F6F5F2" />

<div class="min-h-screen bg-background flex flex-col">
  <SafeAreaTop color="#F6F5F2" />
  <EditHeader {viewModel} onBack={handleBack} onSave={handleSave} />

  <main class="flex-1 px-4 py-4 max-w-2xl w-full mx-auto">
    <h2 class="font-display font-800 text-2xl text-center tracking-tight text-foreground mb-6">Time Keeper</h2>
    {#if viewModel.kind === "sprint"}
    <SprintEnduro bind:race={viewModel.race} />
    {/if}
  </main>
</div>
