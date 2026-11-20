<script lang="ts">
  // Shown while a scan is in progress: from the moment Scan is confirmed (behind the system camera) until the
  // card has been read. Every way of closing it, the Cancel button, a tap outside, Escape and Android Back,
  // cancels the scan and throws the result away. See DESIGN.md "Sheets and dialogs".
  import Sheet from './Sheet.svelte'

  interface Props {
    onCancel: () => void;
  }

  let { onCancel }: Props = $props();
</script>

<Sheet title="Scanning" labelledBy="scan-progress-title" dataCy="scan-progress" onClose={onCancel}>
  <div class="px-4 pt-4 pb-1 md:px-6 flex items-center gap-3">
    <div
      class="h-6 w-6 shrink-0 animate-spin rounded-full border-2 border-border border-t-primary motion-reduce:animate-none"
      aria-hidden="true"
    ></div>
    <div role="status">
      <h2 id="scan-progress-title" class="font-display text-lg font-800 tracking-tight text-foreground">Scanning</h2>
      <p class="mt-1 text-sm text-muted-foreground">Scanning your score card…</p>
    </div>
  </div>
  <div class="flex flex-col-reverse gap-2 px-4 pt-4 pb-4 md:flex-row md:justify-end md:px-6">
    <button
      type="button"
      data-cy="scan-cancel"
      data-autofocus
      class="min-h-touch rounded-md border border-border px-4 text-sm font-medium text-foreground"
      onclick={onCancel}
    >
      Cancel
    </button>
  </div>
</Sheet>
