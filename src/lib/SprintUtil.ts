import type {TimeData} from "../models/sprint"

// @todo - remove
export type SprintCheckDatum = {
    // Used as key to fix Svelte 5 issue where UI would not update when check deleted.
    id: string,
    enter: TimeData,
    exit: TimeData
};

// @todo - remove

export function datumToTimeData(datum: TimeData) {
    return {
        hour: parseInt(datum.hour.toString()),
        minute: parseInt(datum.minute.toString()),
        second: parseInt(datum.second.toString()),
    }
}

