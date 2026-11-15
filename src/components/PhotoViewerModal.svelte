<script lang="ts">
  import { onMount } from 'svelte'
  import { imageUrl } from '../lib/photos'
  import Sheet from './Sheet.svelte'

  interface Props {
    imagePath: string;
    onClose: () => void;
  }

  let { imagePath, onClose }: Props = $props();
  let src = $state('')
  let failed = $state(false)

  onMount(async () => {
    try { src = await imageUrl(imagePath) } catch { failed = true }
  })
</script>

<Sheet title="Scanned time card" size="full" tone="dark" dataCy="photo-viewer" {onClose}>
  <div class="flex-1 min-h-0 flex items-center justify-center p-2">
    {#if failed}
      <p class="text-white text-sm">Photo not found.</p>
    {:else if src}
      <img {src} alt="Scanned time card" class="max-h-full max-w-full object-contain"
           onerror={() => { failed = true }} />
    {/if}
  </div>
  <button
    onclick={onClose}
    data-cy="close-photo"
    data-autofocus
    class="m-3 min-h-touch px-4 rounded-md bg-white text-black text-sm font-medium"
  >
    Close
  </button>
</Sheet>
