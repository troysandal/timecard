import { type TimeKeeperRace, } from '../models/race';
import { ScoreKeeper } from '../lib/scoring/timekeeper.scoring';
import { areEqual, CheckpointTypes, type Checkpoint } from "../models/timekeeper"
import type { RaceViewModel, TimeKeeperScore } from './ViewModelTypes';

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
    // this.race.timeCard.riderMinute = 1
    this.race.timeCard.checkpoints = this.initialChecks(1)
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
