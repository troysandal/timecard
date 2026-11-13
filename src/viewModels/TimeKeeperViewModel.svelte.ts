import { type TimeKeeperRace, } from '../models/race';
import { ScoreKeeper } from '../lib/scoring/timekeeper.scoring';
import { areEqual, CheckpointTypes, type Checkpoint } from "../models/timekeeper"
import { scanToCheckpoints, type ScanRow } from '../lib/scanCard';
import { RaceViewModelBase } from './RaceViewModelBase.svelte';
import type { RaceViewModel, TimeKeeperScore } from './ViewModelTypes';

export class TimeKeeperViewModel extends RaceViewModelBase<TimeKeeperRace> implements RaceViewModel<TimeKeeperRace, TimeKeeperScore> {
  readonly kind = 'time_keeper';

  get score(): TimeKeeperScore {
    return {
      kind: 'time_keeper',
      scoreCard: ScoreKeeper.scoreEnduro(this.race.timeCard)
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
    return this.race.timeCard.checkpoints[this.race.timeCard.checkpoints.length - 1] 
  }

  deleteCheck(check: Checkpoint) {
    this.race.timeCard.checkpoints = this.race.timeCard.checkpoints.filter((c) => c !== check)
  }

  /** Called when Enter is pressed in a row; the last row grows the card. */
  rowEntered(index: number) {
    if (index === this.race.timeCard.checkpoints.length - 1) this.addCheck()
  }

  resetCard() {
    // this.race.timeCard.riderMinute = 1
    this.race.timeCard.checkpoints = this.initialChecks(1)
    this.clearPhoto()
  }

  protected applyScanRows(rows: ScanRow[]): boolean {
    const checks = scanToCheckpoints(rows)
    if (checks.length === 0) return false
    this.race.timeCard.checkpoints = checks
    return true
  }

  get isDirty(): boolean {
    return this.isBaseDirty() ||
           !areEqual($state.snapshot(this.race).timeCard, $state.snapshot(this.raceLKG).timeCard)
  }
}
