<script>
    import { createEventDispatcher } from "svelte";
    export let attrs
    export let value
    export let initRow = () => {}
    
    const dispatch = createEventDispatcher();

    function handleInput(e) {
        dispatch("value", { value: e.target.value });
    }

    function isValid(value) {
        const intValue = parseInt(value)

        if (isNaN(intValue)) {
            return false
        }
        if (attrs.min !== undefined) {
            if (intValue < attrs.min) {
                return false
            }
        }

        if (attrs.max !== undefined) {
            if (intValue > attrs.max) {
                return false
            }
        }
        return true
    }
    $: error = !isValid(value) ? 'error' : ''
</script>

<input class="{error} {$$props.class}" pattern={attrs.numeric ? "[0-9]*" : null} type="number" on:input={handleInput} {...attrs} value={value} use:initRow />

<style>
    .error {
        background-color: rgba(255, 0, 0, 0.47);
    }
</style>