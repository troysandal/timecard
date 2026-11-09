<script lang="ts">
    import { untrack } from "svelte";

    let {
        placeholder = "",
        value = $bindable(),
        strValue = $bindable(),
        ref = $bindable(),
        pad = null,
        maxlength = null,
        pattern = "[0-9]*",
        validator = () => true,
        style = "",
        initRow = () => {},
        onEnter = () => {},
        size = undefined,
        min = undefined,
        inputmode = undefined,
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

    // Lots of complication in this component to ensure that NaN works
    // for value.  The first effect keeps value in sync with strValue,
    // the second keeps the string strValue in sync with value.
    // Another reason to revisit rewriting this component.

    $effect(() => {
        if (isValid()) {
            value = parseInt(strValue);
        } else {
            value = NaN;
        }
    });

    $effect(() => {
        const v = value;
        const parsed = untrack(() => isValid() ? parseInt(strValue) : NaN);
        if (Object.is(v, parsed)) return;      // text already represents v, so do nothing
        strValue = Number.isFinite(v) ? String(v) : '';   // external change, so overwrite the text
    });
</script>

<input
    class:error={!isValid()}
    class="{className} field h-10"
    {style}
    {placeholder}
    {maxlength}
    {pattern}
    inputmode={inputmode ?? defaultInputMode()}
    {size}
    {min}
    bind:value={strValue}
    bind:this={ref}
    onblur={padValue}
    use:initRow
    onkeydown={(e) => {
        if (e.key === "Enter") {
            onEnter();
        }
    }}
/>

<style>
    .error {
        background-color: rgba(255, 0, 0, 0.47);
    }
</style>
