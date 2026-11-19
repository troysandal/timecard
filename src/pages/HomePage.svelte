<script lang="ts">
  import RaceActionsSheet from "../components/RaceActionsSheet.svelte";
  import SafeAreaTop from "../components/SafeAreaTop.svelte";
  import TypeBadge from "../components/TypeBadge.svelte";
  import { longPress } from "../lib/longPress";
  import { type Race } from "../models/race";

  interface Props {
    items: Race[];
    onAdd: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  }

  let { items, onAdd, onEdit, onDelete }: Props = $props();
  let sortedItems = $derived(
    items.toSorted((a, b) => {
      return b.createdAt < a.createdAt ? -1 : 1;
    })
  );
  let menuFor: Race | null = $state(null);
</script>

<div class="h-app flex flex-col bg-background max-w-2xl w-full mx-auto overflow-hidden safe-x">
  <SafeAreaTop />

  <header class="shrink-0 border-b border-border bg-card px-4 py-3">
    <h2 class="font-display font-800 text-2xl tracking-tight text-foreground">
      Enduro Score Cards
    </h2>
  </header>

  <main class="flex-1 min-h-0 overflow-y-auto overscroll-contain">
    {#if items.length === 0}
      <div
        data-cy="empty-state"
        class="m-4 border border-dashed border-border py-16 text-center"
      >
        <p class="text-muted-foreground text-sm">No items yet.</p>
        <p class="text-xs text-muted-foreground mt-1">
          Tap <span class="font-medium">+</span> below to add a score card.
        </p>
      </div>
    {:else}
      <ul data-cy="race-list" class="divide-y divide-border border-b border-border bg-card">
        {#each sortedItems as item (item.id)}
          <li data-cy="race-item">
            <button
              data-cy="race-edit"
              class="w-full min-h-touch px-4 py-3 text-left flex items-center gap-3"
              onclick={() => onEdit(item.id)}
              use:longPress={() => (menuFor = item)}
            >
              <div class="min-w-0 flex-1">
                <span
                  data-cy="race-name"
                  class="font-medium text-sm text-foreground truncate block"
                >
                  {#if item.name}
                    {item.name}
                  {:else}
                    <span class="text-muted-foreground italic">Untitled</span>
                  {/if}
                </span>
                <div class="flex items-center gap-2 mt-1">
                  <TypeBadge raceType={item.raceType} />
                </div>
              </div>
              <svg
                class="text-muted-foreground shrink-0"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 2l5 5-5 5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </main>

  <footer class="safe-bottom-edge shrink-0 bg-card border-t-2 border-foreground/10">
    <div class="px-4 py-2 flex justify-end">
      <button
        onclick={onAdd}
        data-cy="add-enduro"
        aria-label="Add Score Card"
        class="size-touch rounded-full flex items-center justify-center bg-secondary text-secondary-foreground"
      >
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </footer>
</div>

{#if menuFor}
  <RaceActionsSheet
    name={menuFor.name}
    onClose={() => (menuFor = null)}
    onDelete={() => {
      const target = menuFor;
      menuFor = null;
      if (target) onDelete(target.id);
    }}
  />
{/if}
