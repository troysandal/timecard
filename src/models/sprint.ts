// Sprint Enduro Data Model and Scoring

export interface TimeData {
    hour: number
    minute: number
    second: number
}

export class SprintTestTime implements TimeData {
    hour: number = 0
    minute: number = 0
    second: number = 0

    constructor(hour: number = 0, minute: number = 0, second: number = 0) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }

    // @return elapsed time in seconds since start of day
    get seconds(): number {
        return this.hour * 3600 + this.minute * 60 + this.second
    }
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


export class SprintTest {
    enter: SprintTestTime = new SprintTestTime()
    exit: SprintTestTime = new SprintTestTime()

    constructor(enter: SprintTestTime = new SprintTestTime(), exit: SprintTestTime = new SprintTestTime()) {
        this.enter = enter;
        this.exit = exit;
    }

    /**
     * @return score as number of seconds between enter and exit, NaN 
     * if score is incomplete
     */
    get score(): number {
      return this.exit.seconds - this.enter.seconds;
    }

    static fromTimes(enter: TimeData, exit: TimeData): SprintTest | undefined {
        const enterTime = validateTimeData(enter)
        const exitTime = validateTimeData(exit)

        if (!enterTime || !exitTime) {
            return undefined
        }

        const result = new SprintTest()
        result.enter = new SprintTestTime(enterTime.hour, enterTime.minute, enterTime.second)
        result.exit = new SprintTestTime(exitTime.hour, exitTime.minute, exitTime.second)

        // Noon Hour Adjust - if exit is earlier, assume exit is after 12pm,
        // e.g. enter=12:30, exit=1:05 => adjust exit=13:05
        
        if (result.score < 0) {
            let newExitTime: TimeData | undefined = Object.assign({}, exitTime)
            newExitTime.hour += 12
            newExitTime = validateTimeData(newExitTime)

            // Catches hour > 23
            if (!newExitTime) {
                return undefined
            }

            result.exit = new SprintTestTime(newExitTime.hour, newExitTime.minute, newExitTime.second)

            // Catches enter=23:00, exit=01:00 => enter=23:00, exit=13:00 = -10h
            if (result.score < 0) {
                return undefined
            }
        }

        return result
    }
}

export class SprintEnduro {
    tests: SprintTest[] = []

    /**
     * @return total score as number of seconds across all tests, NaN if
     * any test has an invalid score.
     */
    get score(): number {
        if (this.tests.length === 0) {
            return NaN
        }

        let result = 0
        for (let test of this.tests) {
            result += test.score
        }
        return result
    }

    get scoreAsTimeData(): TimeData {
        const score = this.score
        if (isNaN(score)) {
            return { hour: NaN, minute: NaN, second: NaN }
        }
        const hour = Math.floor(score / 3600)
        const minute = Math.floor((score % 3600) / 60)
        const second = score % 60
        return { hour, minute, second }
    }
}

