<script lang="ts">
  import logo from './assets/icon.png';
  import HomePage from "./pages/HomePage.svelte"
  import SprintPage from './pages/SprintPage.svelte';
  import TimeKeeperPage from './pages/TimeKeeperPage.svelte'
  import RacePickerModal from './lib/RacePickerModal.svelte'
  import type { Race, RaceType } from './common'
  import { TimeKeeperEnduro as EnduroTK, SprintEnduro as EnduroSP } from './common'
  import { onMount } from 'svelte'
  import { store } from './db/store'
  
  type Page = "home" | "sprint" | "timekeeper"

  let items = $state<Race[]>([])
  let editingId = $state<string | null>(null)
  let page = $state<Page>("home")
  let showTypePicker = $state(false)
  let editingItem = $derived(items.find((i) => i.id === editingId))
	let isLoading = $state(true);

	onMount(async () => {
		const dbRaces = await store.load()
		if (dbRaces) {
      items = dbRaces;
		}
		isLoading = false;
	});

  const handleAdd = () => {
    showTypePicker = true
  }

  const handleSelectType = async (type: RaceType) => {
    const id = Math.random().toString(36).slice(2)
    const name = `Untitled ${type}`
    const createdAt = new Date()

    const newItem: Race =
      type === 'Time Keeper'
        ? { id, raceType: type, name, createdAt, timeCard: new EnduroTK(1) }
        : { id, raceType: type, name, createdAt, timeCard: new EnduroSP() }

    items.push(newItem)
    await store.save(items)
    editingId = newItem.id
    page = pageForType(newItem.raceType)
    showTypePicker = false
  }

  const pageForType = (type: RaceType) => {
    if (type === "Sprint") {
      return "sprint"
    }
    return "timekeeper"
  }

  const handleEdit = (id: string) => {
    editingId = id
    page = pageForType(editingItem!.raceType)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this race?')) {
      items = items.filter((i) => i.id !== id)
      await store.save(items)
    }
  }

  const handleSave = async (updated: Race) => {
    items = items.map((i) => (i.id === updated.id ? updated : i))
    await store.save(items)
  }

  const handleBack = () => {
    page = 'home'
    editingId = null
  }
</script>

<svelte:head>
  <link rel="apple-touch-icon" href={logo} />
</svelte:head>

{#if !isLoading}
  {#if page === "home"}
    <HomePage
      items={items}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  {:else if page === "sprint" && editingItem?.raceType === "Sprint"}
      <SprintPage item={editingItem} onSave={handleSave} onBack={handleBack} />
  {:else if page === "timekeeper" && editingItem?.raceType === "Time Keeper"}
      <TimeKeeperPage bind:race={editingItem} onSave={handleSave} onBack={handleBack} />
  {/if}

  {#if showTypePicker}
    <RacePickerModal onSelect={handleSelectType} onClose={() => { showTypePicker = false }} />
  {/if}
{:else}
  <p>Loading database...</p>
{/if}

<style>
  :global(body) {
    -webkit-user-select: none;
    user-select: none;
  }
</style>