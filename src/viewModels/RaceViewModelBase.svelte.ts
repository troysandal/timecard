import type { Race } from '../models/race';
import { scanCard, type ScanRow } from '../lib/scanCard';
import { deleteImage } from '../lib/photos';
import type { ScanApplyResult } from './ViewModelTypes';

export abstract class RaceViewModelBase<TRace extends Race> {
  race: TRace;
  raceLKG: TRace;
  /** True from the moment Scan is confirmed until the result is applied or the scan is cancelled. The screen shows
   *  the scanning dialog while it is. */
  scanning = $state(false);
  /** The scan in flight, if any. `cancelScan` marks it so its result is thrown away when it arrives. */
  private currentRun: { cancelled: boolean } | undefined;

  constructor(race: TRace) {
    this.race = $state($state.snapshot(race)) as TRace;
    this.raceLKG = $state($state.snapshot(race)) as TRace;
  }

  protected abstract applyScanRows(rows: ScanRow[]): boolean;
  abstract resetCard(): void;

  async scan(): Promise<ScanApplyResult> {
    if (this.currentRun) return 'busy';
    const run = { cancelled: false };
    this.currentRun = run;
    this.scanning = true;
    try {
      return await this.runScan(run);
    } finally {
      // A cancelled run has already cleared these, and a newer scan may own them by now.
      if (this.currentRun === run) {
        this.currentRun = undefined;
        this.scanning = false;
      }
    }
  }

  /**
   * Throws the scan in flight away. The plugin cannot stop reading the photo (Vision runs to the end), so the
   * read finishes in the background; when it does, `runScan` sees the run is cancelled, applies nothing and deletes
   * the photo the plugin saved. A new scan can start straight away.
   */
  cancelScan(): void {
    if (!this.currentRun) return;
    this.currentRun.cancelled = true;
    this.currentRun = undefined;
    this.scanning = false;
  }

  private async runScan(run: { cancelled: boolean }): Promise<ScanApplyResult> {
    const outcome = await scanCard(this.race.id);
    if (run.cancelled) {
      // The result is discarded; the photo the plugin saved for it must not be left behind.
      if (outcome.status === 'ok' || outcome.status === 'no-table') await deleteImage(outcome.imagePath);
      return 'cancelled';
    }
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
      case 'busy':
        return 'busy';
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
