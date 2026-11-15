<script lang="ts">
  // Spacer the height of the top safe area (notch / Dynamic Island / status bar), so
  // content starts below it while the background still draws behind it.
  // Default is the page background token; pass a CSS color only for a distinct header band.
  let { color = 'var(--background)' } = $props()
</script>

<div data-cy="safe-area-top" class="shrink-0" style="height: var(--safe-top); background: {color}"></div>
