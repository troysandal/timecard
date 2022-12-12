<script>
    import NumberInput from "./NumberInput.svelte";
    export let value
    export let ref = null
</script>

<NumberInput {...$$props} pad="2" maxlength="2" style="width:1.75em" bind:value bind:ref/>
