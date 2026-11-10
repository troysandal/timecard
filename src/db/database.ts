import type { SprintEnduroData, TimeKeeperEnduro } from '../models/race';
import { CheckpointTypes } from '../models/timekeeper';
import { store } from './store';

function reviveSprintEnduroData(sprint: SprintEnduroData) {
  sprint.tests.forEach((test) => {
    if (test.enter.hour === null) test.enter.hour = NaN;
    if (test.enter.minute === null) test.enter.minute = NaN;
    if (test.enter.second === null) test.enter.second = NaN;
    if (test.exit.hour === null) test.exit.hour = NaN;
    if (test.exit.minute === null) test.exit.minute = NaN;
    if (test.exit.second === null) test.exit.second = NaN;
  });
}

function reviveTimeKeeperEnduroData(timekeeper: TimeKeeperEnduro) {
  if (timekeeper.riderMinute === null) {
    timekeeper.riderMinute = NaN;
  }
  timekeeper.checkpoints.forEach((checkpoint) => {
    if (checkpoint.minute === null) checkpoint.minute = NaN;
    if (checkpoint.seconds === null) checkpoint.seconds = NaN;
  });
}

const CURRENT_SCHEMA_VERSION = 3;
type Migration = (data: any) => Object;

const migrations: Record<number, Migration> = {
  // Migrate v1 -> v2
  1: (db: any) => {
    const races = db.races;
    // 2026-10-06 - timekeeper.ts:CheckpointTypes number -> string
    if (races && Array.isArray(races)) {
      const CHECKPOINT_REMAP = [
        CheckpointTypes.Start,
        CheckpointTypes.Known,
        CheckpointTypes.Secret,
        CheckpointTypes.Emergency
      ]
      races.forEach((race: any) => { 
        if (race.raceType === 'time_keeper' && race.timeCard && Array.isArray(race.timeCard.checkpoints)) {
          race.timeCard.checkpoints.forEach((checkpoint: any) => {
            checkpoint.type = CHECKPOINT_REMAP[checkpoint.type];
          })
        }
      });
    }
    return db;
  },
  // Migrate v2 -> v3
  2: (db: any) => {
    // Moved database into data field to avoid root conflicts
    db.data = { races: db.races };
    delete db.races;
    return db;
  }
};

export function unwrapDB(db: any): Object {
  let v = db?.schemaVersion;
  if (typeof v !== "number") throw new Error("missing or invalid schemaVersion");
  if (v > CURRENT_SCHEMA_VERSION) throw new Error(`file is from a newer version (${v})`);

  while (v < CURRENT_SCHEMA_VERSION) {
    let migration = migrations[v++];
    if (migration) {
      db = migration(db);
    }
  }

  db.schemaVersion = CURRENT_SCHEMA_VERSION;

  // Revive races (Dates, NaN)
  const races = db?.data?.races;
  if (races && Array.isArray(races)) {
    races.forEach((race: any) => {
      race.createdAt = new Date(race.createdAt); 

      if (race.raceType === 'sprint') {
        reviveSprintEnduroData(race.timeCard);
      } else if (race.raceType === 'time_keeper') {
        reviveTimeKeeperEnduroData(race.timeCard);
      }
    });
  }
  return db;
}

function wrapDB(db: Object) {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    data: db
  }
}

export async function loadDB(): Promise<Object> {
  const db = await store.load();
  if (!db) {
    console.info("database not found");
    return {races: []}
  }
  return (unwrapDB(db) as any).data;
}

export async function saveDB(db: Object): Promise<void> {
  await store.save(wrapDB(db));
}
