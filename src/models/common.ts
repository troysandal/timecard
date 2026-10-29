import { SprintEnduro } from "./sprint"
import { TimeKeeperEnduro } from "./timekeeper"

interface RaceBase {
  id: string
  name: string
  createdAt: Date
}

export type TimeKeeperRace = RaceBase & { raceType: "time_keeper"; timeCard: TimeKeeperEnduro };
export type SprintRace = RaceBase & { raceType: "sprint"; timeCard: SprintEnduro };

export type Race = TimeKeeperRace | SprintRace;

export type RaceType = Race['raceType'];

export { TimeKeeperEnduro, SprintEnduro }
