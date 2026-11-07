<script lang="ts">
  import logo from './assets/icon.png';
  import HomePage from "./pages/HomePage.svelte"
  import EditPage from './pages/EditPage.svelte'
  import RacePickerModal from './components/RacePickerModal.svelte'
  import type { Race, RaceType } from './models/race'
  import { TimeKeeperEnduro as EnduroTK, SprintEnduro as EnduroSP } from './models/race'
  import { onMount } from 'svelte'
  import { loadDB, saveDB } from './db/database'
  
  type Page = "home" | "sprint" | "timekeeper"

  let items = $state<Race[]>([])
  let editingId = $state<string | null>(null)
  let page = $state<Page>("home")
  let showTypePicker = $state(false)
  let editingItem = $derived(items.find((i) => i.id === editingId))
  let isLoading = $state(true);

	onMount(async () => {
		const db = await loadDB()
		if (db) {
      items = (db as any).races as Race[];
		}
		isLoading = false;
	});

  const handleAdd = () => {
    showTypePicker = true
  }

  const save = async () => {
    await saveDB({races: items})
  }

  const handleSelectType = async (type: RaceType) => {
    const id = Math.random().toString(36).slice(2)
    const name = `Untitled ${type === 'sprint' ? 'Sprint' : 'Time Keeper'}`
    const createdAt = new Date()

    const newItem: Race =
      type === 'time_keeper'
        ? { id, raceType: type, name, createdAt, timeCard: new EnduroTK(1) }
        : { id, raceType: type, name, createdAt, timeCard: new EnduroSP() }

    items.push(newItem)
    await save()
    editingId = newItem.id
    page = pageForType(newItem.raceType)
    showTypePicker = false
  }

  const pageForType = (type: RaceType) => {
    if (type === "sprint") {
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
      await save()
    }
  }

  const handleSave = async (updated: Race) => {
    items = items.map((item) => (item.id === updated.id ? updated : item))
    await save()
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
  {:else if (page === "sprint" || page === "timekeeper") && editingItem?.raceType }
      <EditPage race={editingItem} onSave={handleSave} onBack={handleBack} />
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