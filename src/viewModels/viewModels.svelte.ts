import type { Race } from '../models/race';
import { SprintViewModel } from './SprintViewModel.svelte';
import { TimeKeeperViewModel } from './TimeKeeperViewModel.svelte';

export { SprintViewModel, TimeKeeperViewModel }

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
