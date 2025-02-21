<script lang="ts">
    import SprintNumberInput from './SprintNumberInput.svelte'

    let { 
        timeData = $bindable(),
        onSeconds = () => {}, 
        refHour = $bindable(), 
        initRow = null,
        className,
    } = $props();
    let refMinute: HTMLInputElement = $state() as HTMLInputElement;
    let refSecond: HTMLInputElement = $state() as HTMLInputElement;
  
    type Validator = (value: string | undefined) => boolean;

    function valid(min: number, max: number): Validator {
        return (value: string | undefined) => {
            // Don't show errors for empty inputs, only invalid #s.
            if (value === undefined || value === '') {
                return true;
            }
            const numValue: number = parseInt(value);
            return !isNaN(numValue) && (numValue >= min) && (numValue <= max);
        }
    }
    
    const validHour = valid(0, 23);
    const validMinute = valid(0, 59);
    const validSecond = valid(0, 59);
    
    function nextInput(field: number, strValue: string, onNext: () => void) {
        if (!isNaN(field) && (strValue.length == 2)) {
            onNext();
        }
    }

    let strHour: string = $state('');
    let strMinute: string = $state('');
    let strSecond: string = $state('');
    
    $effect(() => { nextInput(timeData.hour,   strHour,   () => { refMinute.focus() }) });
    $effect(() => { nextInput(timeData.minute, strMinute, () => { refSecond.focus() }) });
    $effect(() => { nextInput(timeData.second, strSecond, () => { onSeconds() }) });
</script>

<SprintNumberInput 
    placeholder="hh" 
    class={className}
    validator={validHour}
    initRow={initRow}
    bind:ref={refHour}
    bind:value={timeData.hour}
    bind:strValue={strHour} />
<SprintNumberInput 
    placeholder="mm" 
    class={className}
    validator={validMinute}
    bind:ref={refMinute}
    bind:value={timeData.minute}
    bind:strValue={strMinute} />
<SprintNumberInput 
    placeholder="ss"
    class={className}
    validator={validSecond}
    bind:ref={refSecond}
    bind:value={timeData.second}
    bind:strValue={strSecond} />
