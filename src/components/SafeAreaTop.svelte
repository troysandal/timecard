<script lang="ts">
  let { color = '#FFFFFF' } = $props()
</script>

<div
  style="height:env(safe-area-inset-top); flexShrink: 0"
  style:background={color}>
</div>
