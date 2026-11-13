<script lang="ts">
  import logo from './assets/icon.png';
  import HomePage from "./pages/HomePage.svelte"
  import EditPage from './pages/EditPage.svelte'
  import RacePickerModal from './components/RacePickerModal.svelte'
  import type { Race, RaceType } from './models/race'
  import { SprintTest, SprintTestTime } from './models/sprint'
  import { CheckpointTypes } from './models/timekeeper'
  import { TimeKeeperEnduro as EnduroTK, SprintEnduro as EnduroSP } from './models/race'
  import { onMount } from 'svelte'
  import { loadDB, saveDB } from './db/database'
  import { installAndroidBackButton } from './lib/backButton'
  import { pruneRaceImages, deleteRaceImages } from './lib/photos'

  type Page = "home" | "sprint" | "timekeeper"

  let items = $state<Race[]>([])
  let editingId = $state<string | null>(null)
  let page = $state<Page>("home")
  let showTypePicker = $state(false)
  let editingItem = $derived(items.find((i) => i.id === editingId))
  let isLoading = $state(true);
  let editDirty = $state(false)

  const editHash = (id: string) => `#/edit/${id}`

  // Only called from popstate, i.e. when leaving the Edit page via history.
  // editDirty can be stale after EditPage unmounts, so check page too.
  const confirmLeave = () =>
    page === 'home' ||
    !editDirty ||
    window.confirm('You have unsaved changes. Are you sure you want to discard them?')

  const showHome = () => {
    page = 'home'
    editingId = null
    editDirty = false
  }

  const showEdit = (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return false
    editingId = id
    page = pageForType(item.raceType)
    return true
  }

  const pushEdit = (id: string) => {
    history.pushState({ page: 'edit', id }, '', editHash(id))
  }

  const handlePopState = (event: PopStateEvent) => {
    const id: string | undefined = event.state?.id
    if (!id) {
      // Navigated to Home
      if (page === 'home') return
      if (confirmLeave()) {
        showHome()
      } else {
        // popstate can't be cancelled, so put the Edit entry back
        pushEdit(editingId!)
      }
    } else if (!showEdit(id)) {
      history.replaceState({ page: 'home' }, '', '#/')
      showHome()
    }
  }

	onMount(() => {
    history.scrollRestoration = 'manual'
    window.addEventListener('popstate', handlePopState)
    installAndroidBackButton()

    ;(async () => {
      const db = await loadDB()
      if (db) {
        items = (db as any).races as Race[];
      }
      const hashId = location.hash.match(/^#\/edit\/(.+)$/)?.[1]
      history.replaceState({ page: 'home' }, '', '#/')
      if (hashId && showEdit(hashId)) {
        pushEdit(hashId)
      }
      isLoading = false;
    })()

    return () => window.removeEventListener('popstate', handlePopState)
	});

  const handleAdd = () => {
    showTypePicker = true
  }

  const save = async () => {
    await saveDB({races: items})
  }
  const newTimeKeeper = (): EnduroTK => {
    const result = new EnduroTK(1)
    result.checkpoints.push({
      type: CheckpointTypes.Secret,
      minute: result.riderMinute,
      seconds: 30,
      drop: false
    })
    return result
  }
  // @todo - shouldn't we be using race.ts SprintXxx types instead?
  const newSprint = (): EnduroSP => {
    const result = new EnduroSP()
    result.tests.push(new SprintTest(
      new SprintTestTime(NaN, NaN, NaN),
      new SprintTestTime(NaN, NaN, NaN)
    ))
    return result
  }

  const handleSelectType = async (type: RaceType) => {
    const id = Math.random().toString(36).slice(2)
    const name = `Untitled ${type === 'sprint' ? 'Sprint' : 'Time Keeper'}`
    const createdAt = new Date()

    const newItem: Race =
      type === 'time_keeper'
        ? { id, raceType: type, name, createdAt, timeCard: newTimeKeeper() }
        : { id, raceType: type, name, createdAt, timeCard: newSprint() }

    items.push(newItem)
    await save()
    showEdit(newItem.id)
    pushEdit(newItem.id)
    showTypePicker = false
  }

  const pageForType = (type: RaceType) => {
    if (type === "sprint") {
      return "sprint"
    }
    return "timekeeper"
  }

  const handleEdit = (id: string) => {
    if (showEdit(id)) pushEdit(id)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this race?')) {
      items = items.filter((i) => i.id !== id)
      await save()
      await deleteRaceImages(id)
    }
  }

  const handleSave = async (updated: Race) => {
    items = items.map((item) => (item.id === updated.id ? updated : item))
    await save()
    await pruneRaceImages(updated.id, updated.imagePath)
  }

  // Navigation goes through history; handlePopState does the guard + page switch.
  const handleBack = () => {
    history.back()
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
      <EditPage race={editingItem} onSave={handleSave} onBack={handleBack} bind:isDirty={editDirty} />
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