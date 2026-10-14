<script lang="ts">
  import SafeAreaTop from "../lib/SafeAreaTop.svelte";
  import TypeBadge from "../lib/TypeBadge.svelte";
  import { type Race } from "../common";

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
</script>

<div class="min-h-screen bg-background flex flex-col">
  <SafeAreaTop color="#F6F5F2" />

  <main class="flex-1 px-4 py-4 max-w-2xl w-full mx-auto">
    <h2
      class="font-display font-800 text-2xl text-center tracking-tight text-foreground mb-6"
    >
      Enduro Time Cards
    </h2>
    <p class="mb-8">
      Verify your Enduro score cards using this tool. Races are busy places and with
      hundreds of riders and sometimes a mistake is made.
    </p>
    <button
      onclick={onAdd}
      class="w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-3 mb-4 hover:opacity-90 transition-opacity"
      style="borderRadius: 'var(--radius)'"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 1v12M1 7h12"
          stroke="currentColor"
          stroke-Width="2"
          stroke-Linecap="square"
        />
      </svg>
      Add Time Card
    </button>
    {#if items.length === 0}
      <div
        class="border border-dashed border-border rounded-none py-16 text-center"
      >
        <p class="text-muted-foreground text-sm">No items yet.</p>
        <p class="text-xs text-muted-foreground mt-1">
          Click <span class="font-medium">Add Item</span> to get started.
        </p>
      </div>
    {:else}
      <ul class="divide-y divide-border border border-border bg-card">
        {#each sortedItems as item (item.id)}
          <li
            class="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors group"
          >
            <button
              class="flex-1 text-left flex items-center gap-3"
              onclick={() => onEdit(item.id)}
            >
              <div class="min-w-0 flex-1">
                <span
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
                  <span class="text-xs text-muted-foreground truncate"
                    >{item.raceType}</span
                  >
                </div>
              </div>
              <svg
                class="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  stroke-Width="1.5"
                  stroke-Linecap="square"
                />
              </svg>
            </button>
            <button
              onclick={() => onDelete(item.id)}
              class="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
              style="borderRadius: 'var(--radius)'"
              aria-label="Delete item"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 3.5h10M5.5 3.5V2.5h3v1M5.5 6v4.5M8.5 6v4.5M3 3.5l.5 8h7l.5-8"
                  stroke="currentColor"
                  stroke-Width="1.4"
                  stroke-Linecap="square"
                />
              </svg>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </main>
</div>
