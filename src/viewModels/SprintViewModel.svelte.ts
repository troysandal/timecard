import { type SprintRace, type SprintEnduroData, type SprintTestData, sprintsAreEqual } from '../models/race';
import { SprintEnduro } from '../models/sprint';
import { SprintTest, SprintTestTime } from '../models/sprint';
import type { RaceViewModel, SprintScore } from './ViewModelTypes';

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

