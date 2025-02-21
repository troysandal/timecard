<script lang="ts">
    let {
        placeholder = "",
        value = $bindable(),
        strValue = $bindable(),
        ref = $bindable(),
        pad = null,
        maxlength = null,
        pattern = "[0-9]*",
        validator = () => true,
        style,
        initRow = () => {},
        size = undefined,
        min = undefined,
        class: className = "",
    } = $props();

    function isValid() {
        return validator(strValue);
    }

    function padValue() {
        if (pad > 0 && strValue && isValid() && strValue.length === 1) {
            strValue = strValue.padStart(pad, "0");
        }
    }

    function defaultInputMode() {
        let isChrome = !!("chrome" in window);
        isChrome = isChrome && /Android|iPhone/i.test(navigator.userAgent);
        return isChrome ? "numeric" : undefined;
    }

    $effect(() => {
        if (isValid()) {
            value = parseInt(strValue);
        } else {
            value = NaN;
        }
    });
</script>

<input
    class:error={!isValid()}
    class={className}
    {style}
    {placeholder}
    {maxlength}
    {pattern}
    inputmode={defaultInputMode()}
    {size}
    {min}
    bind:value={strValue}
    bind:this={ref}
    onblur={padValue}
    use:initRow
/>

<style>
    .error {
        background-color: rgba(255, 0, 0, 0.47);
    }
</style>
