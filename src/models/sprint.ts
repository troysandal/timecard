function scoreString(seconds: number): string {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${hours}:${minutes}:${secs}`
}

export type TimeData = {
    hour: number
    minute: number
    second: number
}

function timeDataToSeconds(timeData: TimeData): number {
    return timeData.hour * 3600 + timeData.minute * 60 + timeData.second
}

export function timeDelta(enterTime: TimeData, exitTime: TimeData): number {
    return timeDataToSeconds(exitTime) - timeDataToSeconds(enterTime)
}

function validateTimeData(timeData: TimeData): TimeData | undefined {
    if (isNaN(timeData.hour + timeData.minute + timeData.second)) {
        return undefined;
    }

    if (timeData.hour < 0 || timeData.hour > 23) {
        return undefined
    }
    if (timeData.minute < 0 || timeData.minute > 59) {
        return undefined
    }
    if (timeData.second < 0 || timeData.second > 59) {
        return undefined
    }

    return Object.assign({}, timeData)
}

export class SprintEnduro {
    tests: Array<SprintTest> = []

    get score(): number {
        let result = 0
        for (let test of this.tests) {
            result += test.score
        }
        return result
    }

    get scoreString(): string {
        return scoreString(this.score);
    }
}

export class SprintTest {
    enter: TimeData = { hour: 0, minute: 0, second: 0 }
    exit: TimeData = { hour: 0, minute: 0, second: 0 }

    static fromTimes(enter: TimeData, exit: TimeData): SprintTest | undefined {
        const enterTime = validateTimeData(enter)
        const exitTime = validateTimeData(exit)

        if (!enterTime || !exitTime) {
            return undefined
        }

        const result = new SprintTest()
        result.enter = enterTime
        result.exit = exitTime

        // Noon Hour Adjust - if exit is earlier, assume exit is after 12pm,
        // e.g. enter=12:30, exit=1:05 => adjust exit=13:05
        // This could create a bad time (hour > 23)
        if (timeDelta(enterTime, exitTime) < 0) {
            let newExitTime: TimeData | undefined = Object.assign({}, exitTime)
            newExitTime.hour += 12
            newExitTime = validateTimeData(newExitTime)
            if (!newExitTime || (timeDelta(enterTime, newExitTime) < 0)) {
                return undefined
            }
            result.exit = newExitTime
        }

        return result
    }

    get score(): number {
        return timeDelta(this.enter, this.exit)
    }

    // @todo - for now, convert to Dates, then add unit tests verifying time string
    // @todo - then switch scoreString() to TimeData, make sure unit tests still work
    get scoreString(): string {
        return scoreString(this.score);
    }
};