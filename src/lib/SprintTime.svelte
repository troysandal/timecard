<script>
    import SprintNumberInput from './SprintNumberInput.svelte'

    export let hour
    export let minute
    export let second
</script>

<SprintNumberInput 
    attrs={{placeholder:"hh", min:"0", max:"23"}} 
    class={$$props.initRow ? "enterTime" : 'exitTime' }
    value={hour}
    initRow={$$props.initRow}
    on:value={(v) => {hour = v.detail.value}} />
<SprintNumberInput 
    attrs={{placeholder:"mm", min:"0", max:"59"}} 
    class={$$props.initRow ? "enterTime" : 'exitTime' }
    value={minute}
    on:value={(v) => {minute = v.detail.value}} />
<SprintNumberInput 
    attrs={{placeholder:"ss", min:"0", max:"59"}} 
    class={$$props.initRow ? "enterTime" : 'exitTime' }
    value={second}
    on:value={(v) => {second = v.detail.value}} />
