import { type RaceType } from '../models/race'

// One place for the race-type identity colors (tokens --time-keeper / --sprint in app.css),
// shared by the type badge and the race picker. Full class names so Tailwind can see them.
const tint: Record<RaceType, string> = {
  time_keeper: 'border-time-keeper text-time-keeper bg-time-keeper/5',
  sprint: 'border-sprint text-sprint bg-sprint/5',
}

export function raceTypeTint(raceType: RaceType): string {
  return tint[raceType]
}
