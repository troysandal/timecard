import { type SprintRace, toSprint, type SprintTestData, sprintsAreEqual } from '../models/race';
import { SprintEnduro } from '../models/sprint';
import { scanToSprintTests, type ScanRow } from '../lib/scanCard';
import { RaceViewModelBase } from './RaceViewModelBase.svelte';
import type { RaceViewModel, SprintScore } from './ViewModelTypes';

export class SprintViewModel extends RaceViewModelBase<SprintRace> implements RaceViewModel<SprintRace, SprintScore> {
  readonly kind = 'sprint'; // literal type: this is what makes AnyRaceViewModel narrowable
  raceSprint: SprintEnduro = $derived.by(() => toSprint(this.race.timeCard))

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
    for (let i = 0; i < MAX; i++) {
      tests.push({
        enter: { hour: NaN, minute: NaN, second: NaN },
        exit: { hour: NaN, minute: NaN, second: NaN }
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

  /** Called when Enter is pressed in a row; the last row grows the card. */
  rowEntered(index: number) {
    if (index === this.race.timeCard.tests.length - 1) this.addTestData()
  }

  resetCard() {
    this.race.timeCard.tests = this.initialTests()
    this.clearPhoto()
  }

  protected applyScanRows(rows: ScanRow[]): boolean {
    const tests = scanToSprintTests(rows)
    if (tests.length === 0) return false
    this.race.timeCard.tests = tests
    return true
  }

  deleteTest(item: SprintTestData) {
    this.race.timeCard.tests = this.race.timeCard.tests.filter((i) => i !== item)
  }

  get isDirty(): boolean {
    if (this.isBaseDirty()) return true;
    return !sprintsAreEqual($state.snapshot(this.race).timeCard, $state.snapshot(this.raceLKG).timeCard)
  }
}
