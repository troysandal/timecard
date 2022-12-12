<script>
    import SprintNumberInput from './SprintNumberInput.svelte'

    export let hour
    export let minute
    export let second
    export let onSeconds = () => {}

    export let refHour
    let refMinute, refSecond
  
    function valid(min, max) {
    return (value) => {
        if (value === undefined || value === '') {
            return true
        }
        return !isNaN(parseInt(value)) && (value >= min) && (value <= max)
        }
    }
    
    const validHour = valid(0, 23)
    const validMinute = valid(0, 59)
    const validSecond = valid(0, 59)
    
    function nextInput(field, input, validator = () => true) {
        if (field && field.length == 2 && validator(field)) {
            input.focus()
        }
    }
    function onSecond() {
        if (second && second.length == 2 && validSecond(second)) {
            onSeconds()
        }
    }
    
    $: hour, nextInput(hour, refMinute, validHour)
    $: minute, nextInput(minute, refSecond, validMinute)
    $: second, onSecond()
    $: score = `${hour}:${minute}:${second}`
</script>

<SprintNumberInput 
    placeholder="hh" 
    class={$$props.initRow ? "enterTime" : 'exitTime' }
    validator={validHour}
    initRow={$$props.initRow}
    bind:ref={refHour}
    bind:value={hour} />
<SprintNumberInput 
    placeholder="mm" 
    class={$$props.initRow ? "enterTime" : 'exitTime' }
    validator={validMinute}
    bind:ref={refMinute}
    bind:value={minute} />
<SprintNumberInput 
    placeholder="ss"
    class={$$props.initRow ? "enterTime" : 'exitTime' }
    validator={validSecond}
    bind:ref={refSecond}
    bind:value={second} />
