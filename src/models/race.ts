import { SprintEnduro, SprintTest, SprintTestTime } from "./sprint"
import { TimeKeeperEnduro } from "./timekeeper"

/**
 * POJOS representing Sprint enduros - parallel to the classes in sprint.ts
 * We persist these objects to the DB, ModelView uses them for editing.
 * We don't do this for Time Keepers and maybe should but TK classes are 
 * already POJOS.  Yet doing so would be symetric.
 */
export type SprintTestTimeData = {
  hour: number;
  minute: number;
  second: number;
};
export type SprintTestData = {
  enter: SprintTestTimeData;
  exit: SprintTestTimeData;
};
export type SprintEnduroData = {
  tests: SprintTestData[];
};


export function toSprint(data: SprintEnduroData): SprintEnduro {
  const enduro = new SprintEnduro();
  const nanTest = new SprintTest(
      new SprintTestTime(NaN, NaN, NaN),
      new SprintTestTime(NaN, NaN, NaN)
    )
  enduro.tests = data.tests.map((test) => {
    return SprintTest.fromTimes(test.enter, test.exit) || nanTest
  });
  return enduro;
}

export function sprintsAreEqual(a: SprintEnduroData, b: SprintEnduroData): boolean {
  if (a.tests.length !== b.tests.length) {
    return false;
  }
  function eq(l: number, r: number): boolean {
    return l === r || (isNaN(l) && isNaN(r));
  }
  function eqTimeData(l: SprintTestTimeData, r: SprintTestTimeData): boolean {
    return eq(l.hour, r.hour) && eq(l.minute, r.minute) && eq(l.second, r.second);
  }
  for (let i = 0; i < a.tests.length; i++) {
    const testA = a.tests[i]!;
    const testB = b.tests[i]!;
    if (!eqTimeData(testA.enter, testB.enter) || !eqTimeData(testA.exit, testB.exit)) {
      return false;
    }
  }
  return true;
}

interface RaceBase {
  id: string
  name: string
  createdAt: Date
  imagePath?: string
}

export type TimeKeeperRace = RaceBase & { raceType: "time_keeper"; timeCard: TimeKeeperEnduro };
export type SprintRace = RaceBase & { raceType: "sprint"; timeCard: SprintEnduroData };

export type Race = TimeKeeperRace | SprintRace;

export type RaceType = Race['raceType'];

export { TimeKeeperEnduro, SprintEnduro }
