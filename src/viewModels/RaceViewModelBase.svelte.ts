import type { Race } from '../models/race';
import { scanCard, type ScanRow } from '../lib/scanCard';
import { deleteImage } from '../lib/photos';
import type { ScanApplyResult } from './ViewModelTypes';

export abstract class RaceViewModelBase<TRace extends Race> {
  race: TRace;
  raceLKG: TRace;

  constructor(race: TRace) {
    this.race = $state($state.snapshot(race)) as TRace;
    this.raceLKG = $state($state.snapshot(race)) as TRace;
  }

  protected abstract applyScanRows(rows: ScanRow[]): boolean;
  abstract resetCard(): void;

  async scan(): Promise<ScanApplyResult> {
    const outcome = await scanCard(this.race.id);
    switch (outcome.status) {
      case 'ok':
        if (!this.applyScanRows(outcome.result.rows)) {
          await deleteImage(outcome.imagePath);
          return 'empty';
        }
        this.race.imagePath = outcome.imagePath;
        return 'applied';
      case 'cancelled':
        return 'cancelled';
      case 'no-table':
        await deleteImage(outcome.imagePath);
        return 'failed';
      default:
        return 'failed';
    }
  }

  protected clearPhoto() {
    this.race.imagePath = undefined;
  }

  protected isBaseDirty(): boolean {
    return this.race.name !== this.raceLKG.name || this.race.imagePath !== this.raceLKG.imagePath;
  }

  save(onSave: (race: TRace) => void) {
    this.raceLKG = $state.snapshot(this.race) as TRace;
    onSave($state.snapshot(this.race) as TRace);
  }
}
