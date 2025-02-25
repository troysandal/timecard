function scoreString(delta: Date): string {
    const hours = delta.getUTCHours().toString().padStart(2, '0')
    const minutes = delta.getUTCMinutes().toString().padStart(2, '0')
    const seconds = delta.getUTCSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
}

export type TimeData = {
    hour: number
    minute: number
    second: number
}

export function isValidTime(time: TimeData) {
    return !isNaN(time.hour + time.minute + time.second)
}

function timeDataToDate(timeData: TimeData): Date | undefined {
    if (!isValidTime(timeData)) {
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

    const date = new Date(`1970-01-01`)
    date.setUTCHours(timeData.hour)
    date.setUTCMinutes(timeData.minute)
    date.setUTCSeconds(timeData.second)

    if (isNaN(date.valueOf())) {
        return undefined
    }

    return date
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
        return scoreString(new Date(this.score * 1000))
    }
}

export class SprintTest {
    private enter: Date
    private exit: Date

    static fromTimes(enterTime: TimeData, exitTime: TimeData): SprintTest | undefined {
        const enterDate = timeDataToDate(enterTime)
        let exitDate = timeDataToDate(exitTime)

        if (!enterDate || !exitDate) {
            return undefined
        }

        if (exitDate < enterDate) {
            const newExitTime = Object.assign({}, exitTime)
            newExitTime.hour += 12
            exitDate = timeDataToDate(newExitTime)
            if (!exitDate || (exitDate < enterDate)) {
                return undefined
            }
        }

        const result = new SprintTest()
        result.enter = enterDate
        result.exit = exitDate
        return result
    }

    get score(): number {
        const delta = this.exit.valueOf() - this.enter.valueOf()
        return delta / 1000
    }

    get scoreString(): string {
        return scoreString(new Date(this.exit.valueOf() - this.enter.valueOf()))
    }
};