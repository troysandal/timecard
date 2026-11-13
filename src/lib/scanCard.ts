// scanCard.ts
import { TimeCardScanner, type ScanResult } from 'time-card-scanner';
import { CheckpointTypes, type Checkpoint } from "../models/timekeeper"
import type { SprintTestData, SprintTestTimeData } from "../models/race"

export type ScanOutcome =
  | { status: 'ok'; result: ScanResult }
  | { status: 'cancelled' }
  | { status: 'no-table'; imagePath: string } // photo taken, nothing readable
  | { status: 'unavailable' }
  | { status: 'error'; message: string };

export async function canScan(): Promise<boolean> {
  return (await TimeCardScanner.isAvailable()).available;
}

export async function scanCard(id:string): Promise<ScanOutcome> {
  try {
    const result = await TimeCardScanner.captureCard({
      directory: 'DOCUMENTS',
      folder: id, // created if missing; file name is generated
    });
    return { status: 'ok', result };
  } catch (e: any) {
    switch (e.code) {
      case 'CANCELLED':
        return { status: 'cancelled' }; // user backed out; not an error
      case 'UNAVAILABLE':
        return { status: 'unavailable' };
      case 'NO_TABLE':
        // The photo was saved; e.data.image.path / webPath point at it.
        return { status: 'no-table', imagePath: e.data?.image?.webPath };
      default:
        return { status: 'error', message: e.message ?? String(e) };
    }
  }
}

const SECRET_SECONDS = 30

// Cells from the scanner only contain [0-9:], so no character normalization.
// Always returns a check; unreadable rows become a dropped Secret with NaN minute.
export function parseRow(c1: string, c2: string): Checkpoint {
  const fallback: Checkpoint = { type: CheckpointTypes.Secret, minute: NaN, seconds: SECRET_SECONDS, drop: true }
  const joined = c2 ? `${c1}:${c2}` : c1
  const text = joined.replace(/:+/g, ':').replace(/^:|:$/g, '')

  const emergency = (minute: number, seconds: number): Checkpoint =>
    seconds > 59 ? fallback : { type: CheckpointTypes.Emergency, minute, seconds, drop: false }

  let m = /^(\d+):(\d{1,2})$/.exec(text)
  if (m) return emergency(parseInt(m[1]!), parseInt(m[2]!))

  m = /^(\d{2,})(\d{2})$/.exec(text) // mmss with no separator, 4+ digits (3 digits is a Secret)
  if (m) return emergency(parseInt(m[1]!), parseInt(m[2]!))

  if (/^\d{1,3}$/.test(text)) { // minutes can exceed 99
    return { type: CheckpointTypes.Secret, minute: parseInt(text), seconds: SECRET_SECONDS, drop: false }
  }
  return fallback
}

type ScanRow = { c1: string; c2: string; c3: string }

const isEmptyRow = (r: ScanRow) => !r.c1 && !r.c2 && !r.c3

// Trailing blank rows are dropped; blank rows in the middle are kept to preserve positions.
function trimTrailingEmptyRows(rows: ScanRow[]): ScanRow[] {
  let end = rows.length
  while (end > 0 && isEmptyRow(rows[end - 1]!)) end--
  return rows.slice(0, end)
}

export function scanToCheckpoints(rows: ScanRow[]): Checkpoint[] {
  return trimTrailingEmptyRows(rows).map(r => parseRow(r.c1 ?? '', r.c2 ?? ''))
}

const unreadableTime = (): SprintTestTimeData => ({ hour: NaN, minute: NaN, second: NaN })

const HMM_OR_HHMM_OPTIONAL_SS = /^(?<hour>\d{1,2})(?<minute>\d{2})(?<second>\d{2})?$/

const isTimeOfDay = ({ hour, minute, second }: SprintTestTimeData) =>
  hour <= 23 && minute <= 59 && second <= 59

// ['9:26', '29'] -> '92629', ['158', '26'] -> '15826', ['9:5:7'] -> '90507'
function joinIntoDigits(parts: string[]): string | undefined {
  const [leading = '', ...pairs] = parts.join(':').split(':').filter(Boolean)
  if (pairs.some(pair => pair.length > 2)) return undefined
  return leading + pairs.map(pair => pair.padStart(2, '0')).join('')
}

export function parseSprintTime(...parts: string[]): SprintTestTimeData {
  const groups = HMM_OR_HHMM_OPTIONAL_SS.exec(joinIntoDigits(parts) ?? '')?.groups
  if (!groups) return unreadableTime()

  const time = {
    hour: Number(groups.hour),
    minute: Number(groups.minute),
    second: Number(groups.second ?? 0),
  }
  return isTimeOfDay(time) ? time : unreadableTime()
}

export function scanToSprintTests(rows: ScanRow[]): SprintTestData[] {
  return trimTrailingEmptyRows(rows).map(r => ({
    enter: parseSprintTime(r.c1 ?? ''),
    exit: parseSprintTime(r.c2 ?? '', r.c3 ?? ''),
  }))
}
