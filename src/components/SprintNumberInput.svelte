<script lang="ts">
    import NumberInput from "./NumberInput.svelte";
    let { value = $bindable(), ref = $bindable(), strValue = $bindable(), ...rest } = $props();
</script>

<NumberInput {...rest} pad="2" maxlength="2" style="width:3em" bind:value bind:ref bind:strValue/>
