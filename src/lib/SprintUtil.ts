import type {TimeData} from "../sprint"

export type SprintCheckDatum = {
    // Used as key to fix Svelte 5 issue where UI would not update when check deleted.
    id: string,
    enter: TimeData,
    exit: TimeData
};

export function datumToTimeData(datum: TimeData) {
    return {
        hour: parseInt(datum.hour.toString()),
        minute: parseInt(datum.minute.toString()),
        second: parseInt(datum.second.toString()),
    }
}

