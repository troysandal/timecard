import { type TimeKeeperRace, type Race, type RaceType, type SprintRace, type SprintEnduroData, type SprintTestData, sprintsAreEqual } from '../models/race';
import { SprintEnduro } from '../models/sprint';
import { type ScoreCard } from "../lib/scoring/timekeeper.scoring.base"
import { ScoreKeeper } from '../lib/scoring/timekeeper.scoring';
import { areEqual, CheckpointTypes, type Checkpoint } from "../models/timekeeper"
import { SprintTest, SprintTestTime, type TimeData } from '../models/sprint';

// Each score carries a `kind`, so the Score component can narrow it without casts.
export type SprintScore = { kind: 'sprint'; score: TimeData };
export type TimeKeeperScore = { kind: 'time_keeper'; scoreCard: ScoreCard };
export type AnyScore = SprintScore | TimeKeeperScore;


export interface RaceViewModel<TRace extends Race, TScore extends AnyScore> {
  readonly kind: RaceType;
  readonly race: TRace;
  readonly raceLKG: TRace;
  readonly score: TScore;
  readonly isDirty: boolean;

  save(onSave: (race: TRace) => void): void;
}

function toSprint(data: SprintEnduroData): SprintEnduro {
  const enduro = new SprintEnduro();
  enduro.tests = data.tests.map((test) => {
    return new SprintTest(
      new SprintTestTime(test.enter.hour, test.enter.minute, test.enter.second),
      new SprintTestTime(test.exit.hour, test.exit.minute, test.exit.second)
    );
  });
  return enduro;
}

export class SprintViewModel implements RaceViewModel<SprintRace, SprintScore> {
  readonly kind = 'sprint'; // literal type: this is what makes AnyRaceViewModel narrowable
  race: SprintRace;
  raceLKG: SprintRace;
  raceSprint: SprintEnduro = $derived.by(() => toSprint(this.race.timeCard))

  constructor(race: SprintRace) {
    this.race = $state($state.snapshot(race));
    this.raceLKG = $state($state.snapshot(race));
  }

  get score(): SprintScore {
    const result: SprintScore =  {
      kind: 'sprint',
      score: this.raceSprint.scoreAsTimeData
    };
    return result
  }

  initialTests(): SprintTestData[] {
      const tests: SprintTestData[] = []
      const MAX = 1
      for (let i = 0 ; i < MAX ; i++) {
          tests.push({
              enter: {hour: NaN, minute: NaN, second: NaN},
              exit: {hour: NaN, minute: NaN, second: NaN}
          })
      }
      return tests
  }

  addTestData() {
    this.race.timeCard.tests.push({
        enter: {hour: NaN, minute: NaN, second: NaN},
        exit: {hour: NaN, minute: NaN, second: NaN}
    });
  }

  resetCard() {
      if (window.confirm('Are you sure you want to reset the Sprint Enduro?')) {
          this.race.timeCard.tests = this.initialTests()
      }
  }

  deleteTest(item: SprintTestData) {
      const index = this.race.timeCard.tests.findIndex((i) => i === item)
      if (window.confirm(`You sure you want to delete test ${index + 1}?`)) {
          this.race.timeCard.tests = this.race.timeCard.tests.filter((i) => i !== item)
      }
  }

  save(onSave: (race: SprintRace) => void) {
    const saved = $state.snapshot(this.race)
    onSave(saved)
    this.raceLKG = saved
  }

  get isDirty(): boolean {
    const l = $state.snapshot(this.race);
    const r = $state.snapshot(this.raceLKG);

    if (l.name !== r.name) return true;
    return !sprintsAreEqual(l.timeCard, r.timeCard)
  }
}


export class TimeKeeperViewModel implements RaceViewModel<TimeKeeperRace, TimeKeeperScore> {
  readonly kind = 'time_keeper';
  race: TimeKeeperRace;
  raceLKG: TimeKeeperRace;

  constructor(race: TimeKeeperRace) {
    this.race = $state($state.snapshot(race));
    this.raceLKG = $state($state.snapshot(race));
  }

  get score(): TimeKeeperScore {
    const checks = this.race.timeCard.checkpoints;
    // @todo - won't ScoreKeeper.scoreEnduro already give us this? 
    // almost - nonDropped doesn't include invalids
    let scoreCard = {
        points: 0,
        emergencyPoints: 0,
        disqualified: false,
        checkScores: Array(checks.length).fill(null),
        nonDroppedChecks: checks.length - checks.filter((v) => v.drop).length,
    }

    if (!isNaN(this.race.timeCard.riderMinute)) {
      scoreCard = ScoreKeeper.scoreEnduro(this.race.timeCard)
    }

    return {
      kind: 'time_keeper',
      scoreCard: scoreCard
    };
  }

  private initialChecks(MAX: number): Checkpoint[] {
      const checks: Checkpoint[] = []
      for (let i = 0 ; i < MAX ; i++) {
        checks.push({
          type: CheckpointTypes.Secret,
          minute: this.race.timeCard.riderMinute,
          seconds: 30,
          drop: false
        } as Checkpoint)
      }
      return checks
  }

  addCheck() {
    this.race.timeCard.checkpoints[this.race.timeCard.checkpoints.length] = {
      type: CheckpointTypes.Secret,
      minute: this.race.timeCard.riderMinute,
      seconds: 30,
      drop: false
    }
  }

  resetCard() {
    if (window.confirm('Are you sure you want to reset the time card?')) {
        this.race.timeCard.riderMinute = 1
        this.race.timeCard.checkpoints = this.initialChecks(5)
    }
  }

  save(onSave: (race: TimeKeeperRace) => void) {
    const saved = $state.snapshot(this.race)
    onSave(saved)
    this.raceLKG = saved
  }

  get isDirty(): boolean {
    const l = this.race;
    const r = this.raceLKG;

    return (l.name != r.name) || 
           !areEqual($state.snapshot(l.timeCard), $state.snapshot(r.timeCard))
  }
}

export type AnyRaceViewModel = SprintViewModel | TimeKeeperViewModel;

/** The one place that maps a race to its view model. */
export function createViewModel(race: Race): AnyRaceViewModel {
  switch (race.raceType) {
    case 'sprint':
      return new SprintViewModel(race);
    case 'time_keeper':
      return new TimeKeeperViewModel(race);
    default: {
      // Adding a new race type without handling it here is a compile error.
      const exhaustive: never = race;
      throw new Error(`Unknown race: ${JSON.stringify(exhaustive)}`);
    }
  }
}
