import { SprintEnduro } from "./sprint"
import { TimeKeeperEnduro } from "./timekeeper"

export type RaceType = 'Time Keeper' | 'Sprint'

interface RaceBase {
  id: string
  name: string
  createdAt: Date
}
export type Race =
  | (RaceBase & { raceType: 'Time Keeper'; timeCard: TimeKeeperEnduro })
  | (RaceBase & { raceType: 'Sprint'; timeCard: SprintEnduro })

export type TimeKeeperRace = Extract<Race, { raceType: "Time Keeper" }>;
export { TimeKeeperEnduro, SprintEnduro }
