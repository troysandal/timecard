<script>
    import NumberInput from "./NumberInput.svelte";
    export let attrs
</script>

<NumberInput {...$$restProps} attrs={{...attrs, size:"2", style:"width:1.75em", numeric: true}} on:value />
