<script lang="ts">
  import SafeAreaTop from "../components/SafeAreaTop.svelte"
  import EditHeader from "../components/EditHeader.svelte"
  import RaceDetails from "../components/RaceDetails.svelte";
  import TimeKeeperEnduro from "../components/TimeKeeperEnduro.svelte"
  import SprintEnduro from "../components/SprintEnduro.svelte"
  import TimeKeeperFooter from "../components/TimeKeeperFooter.svelte"
  import SprintFooter from "../components/SprintFooter.svelte"
  import { type Race } from "../models/race"
  import { createViewModel } from "../viewModels/viewModels.svelte"
  import { keyboardState } from "../lib/keyboardState.svelte"
  import { keepFocusedVisible } from "../lib/keepFocusedVisible"
  import { tick } from "svelte"

  interface Props {
    race: Race;
    onSave: (race: Race) => void;
    onBack: () => void;
    isDirty?: boolean;
  }

  let { race: initialRace, onSave, onBack, isDirty = $bindable(false) }: Props = $props();
  let viewModel = $derived(createViewModel(initialRace));

  $effect(() => {
    isDirty = viewModel.isDirty
  })

  function handleSave() {
    viewModel.save(onSave)
  }

  // Keyboard up (time keeper and sprint): the score footer gives up its space, and so does
  // the details panel, but only while the focus is in the list. Name, Rider Minute and
  // Format live in that panel, so it must stay while one of them is focused.
  // Hidden with CSS, not removed, so no component state is lost.
  let listFocused = $state(false)
  const hideSummary = $derived(keyboardState.open)
  const hideDetails = $derived(keyboardState.open && listFocused)

  // The layout changes when the keyboard comes and goes (viewport height, collapsed panels),
  // which can leave the tapped input out of view: put it back. Again on each resize while
  // the keyboard is up, because the web view settles in steps.
  $effect(() => {
    keyboardState.open
    tick().then(keepFocusedVisible)
  })
  $effect(() => {
    if (!keyboardState.open) return
    const settle = () => keepFocusedVisible()
    window.addEventListener("resize", settle)
    window.visualViewport?.addEventListener("resize", settle)
    return () => {
      window.removeEventListener("resize", settle)
      window.visualViewport?.removeEventListener("resize", settle)
    }
  })

  function onListFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null
    if (!(event.currentTarget as HTMLElement).contains(next)) listFocused = false
  }
</script>

<div class="h-app flex flex-col bg-background max-w-2xl w-full mx-auto overflow-hidden short:overflow-y-auto safe-x">
  <SafeAreaTop />
  <EditHeader {viewModel} {onBack} onSave={handleSave} />
  <div class="shrink-0" class:hidden={hideDetails} data-cy="race-details-wrap">
    <RaceDetails bind:race={viewModel.race} />
  </div>

  <section
    class="flex-1 overflow-hidden border-b border-border bg-card short:flex-none short:h-72"
    onfocusin={() => (listFocused = true)}
    onfocusout={onListFocusOut}
  >
    {#if viewModel.kind === "time_keeper"}
      <TimeKeeperEnduro bind:viewModel={viewModel} />
    {:else if viewModel.kind === "sprint"}
      <SprintEnduro bind:viewModel={viewModel} />
    {/if}
  </section>

  <section
    class="safe-bottom shrink-0 bg-card border-t-2 border-foreground/10 px-4 pt-4"
    class:hidden={hideSummary}
    data-cy="summary"
  >
    <p class="hidden md:block text-xs text-muted-foreground uppercase tracking-wider mb-3 font-600">Summary</p>
    {#if viewModel.kind === "time_keeper"}
      <TimeKeeperFooter {viewModel} />
    {:else if viewModel.kind === "sprint"}
      <SprintFooter {viewModel} />
    {/if}
  </section>
</div>
