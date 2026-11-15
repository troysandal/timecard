<script lang="ts">
    import NumberInput from "./NumberInput.svelte";
    let { value = $bindable(), ref = $bindable(), strValue = $bindable(), class: className = "", ...rest } = $props();
</script>

<!-- Two digits only: compact padding and a width in em so it scales with the text. Six of these share a row. -->
<NumberInput {...rest} class="{className} field-compact" pad="2" maxlength="2" style="width:2.25em" bind:value bind:ref bind:strValue/>
