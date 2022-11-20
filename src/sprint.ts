function scoreString(delta: Date): string {
    const hours = delta.getUTCHours().toString().padStart(2, '0')
    const minutes = delta.getUTCMinutes().toString().padStart(2, '0')
    const seconds = delta.getUTCSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
}

function timeStringToDate(timeString:string): Date | undefined {
    timeString = timeString.trim()

    if (timeString.length === 0) {
        return undefined
    }
    if (timeString.split(':').length !== 3) {
        return undefined
    }
    const date = new Date(`1970-01-01 ${timeString}`)

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
    static fromTimes(enterTime: string, exitTime: string): SprintTest | undefined {
        const enterDate = timeStringToDate(enterTime)
        const exitDate = timeStringToDate(exitTime)

        if (!enterDate || !exitDate) {
            return undefined
        }

        if (exitDate < enterDate) {
            return undefined
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

    private enter: Date
    private exit: Date
};