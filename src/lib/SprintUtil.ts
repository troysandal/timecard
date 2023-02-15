export function datumToTimeData(datum: any) {
    return {
        hour: parseInt(datum.hour),
        minute: parseInt(datum.minute),
        second: parseInt(datum.second),
    }
}

