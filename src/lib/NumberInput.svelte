<script>
    export let placeholder = "";
    export let value = "";
    export let ref = null;
    export let pad = null;
    export let maxlength = null;
    export let pattern = "[0-9]*"
    export let validator = () => true;
    export let style;
    export let initRow = () => {};
    export let inputmode

    function isValid(value) {
        return validator(value);
    }
    function padValue() {
        if (pad > 0 && value && isValid(value) && value.length === 1) {
            value = value.padStart(pad, "0");
        }
    }
</script>

<input
    class:error={!isValid(value)}
    class={$$props.class}
    {style}
    {placeholder}
    {maxlength}
    {pattern}
    {inputmode}
    bind:value
    bind:this={ref}
    on:blur={padValue}
    use:initRow
/>

<style>
    .error {
        background-color: rgba(255, 0, 0, 0.47);
    }
</style>
