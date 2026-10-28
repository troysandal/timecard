<script lang="ts">
  import SafeAreaTop from "../components/SafeAreaTop.svelte";
  import EditHeader from "../components/EditHeader.svelte";
  import SprintEnduro from "../components/SprintEnduro.svelte";
  import { type Race } from "../models/common"

  type SprintRace = Extract<Race, { raceType: "Sprint" }>;

  interface Props {
    item: SprintRace;
    onSave: (updated: Race) => void;
    onBack: () => void;
  }

  let { item, onSave, onBack }: Props = $props();

  // @todo - fix
  // svelte-ignore state_referenced_locally
  let draft = $state(structuredClone(item))

  function handleSave() {
    onSave(draft)
  }
</script>

<SafeAreaTop color="#F6F5F2" />

<div class="min-h-screen bg-background flex flex-col">
  <SafeAreaTop color="#F6F5F2" />
  <EditHeader isDirty={false} onBack={onBack} onSave={handleSave} />

  <main class="flex-1 px-4 py-4 max-w-2xl w-full mx-auto">
    <h2 class="font-display font-800 text-2xl text-center tracking-tight text-foreground mb-6">Time Keeper</h2>
    <SprintEnduro />
  </main>
</div>
