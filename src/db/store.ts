import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import type { Race, SprintEnduroData, TimeKeeperEnduro } from '../models/race';

type ScoreCardDb = Object

export interface ScoreCardStore {
  load(): Promise<ScoreCardDb | null>;
  save(db: ScoreCardDb): Promise<void>;
}

class FileStore implements ScoreCardStore {
  async load(): Promise<ScoreCardDb | null> {
    try {
      const result = await Filesystem.readFile({
        path: 'races.json',
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      const db = JSON.parse(result.data as string);
      return reviveDB(db);
    } catch (error) {
      console.error('Error reading or parsing JSON file:', error);
    }
    return null;
  }

  async save(db: ScoreCardDb): Promise<void> {
    await Filesystem.writeFile({
      path: 'races.json',
      directory: Directory.Data,
      data: JSON.stringify(db),
      encoding: Encoding.UTF8,
    });
  } 
}

class LocalStorageStore implements ScoreCardStore {
  static LOCAL_DB_KEY = "enduro_time_card"

  async load(): Promise<ScoreCardDb | null> {
    try {
      const savedData = localStorage.getItem(LocalStorageStore.LOCAL_DB_KEY);
      if (savedData) {
          const db = JSON.parse(savedData);
          return reviveDB(db);
      }
    } catch (e) {
        console.error('Failed to parse localStorage data:', e);
      }
    return null;
  }

  async save(db: ScoreCardDb): Promise<void> {
    localStorage.setItem(LocalStorageStore.LOCAL_DB_KEY, JSON.stringify(db))
  } 
}

export const store: ScoreCardStore =
  Capacitor.isNativePlatform() ? new FileStore() : new LocalStorageStore();


// Database Revival - @todo - move to a better place

export function reviveSprintEnduroData(sprint: SprintEnduroData) {
  sprint.tests.forEach((test) => {
    if (test.enter.hour === null) test.enter.hour = NaN;
    if (test.enter.minute === null) test.enter.minute = NaN;
    if (test.enter.second === null) test.enter.second = NaN;
    if (test.exit.hour === null) test.exit.hour = NaN;
    if (test.exit.minute === null) test.exit.minute = NaN;
    if (test.exit.second === null) test.exit.second = NaN;
  });
}

export function reviveTimeKeeperEnduroData(timekeeper: TimeKeeperEnduro) {
  if (timekeeper.riderMinute === null) {
    timekeeper.riderMinute = NaN;
  }
  timekeeper.checkpoints.forEach((checkpoint) => {
    if (checkpoint.minute === null) checkpoint.minute = NaN;
    if (checkpoint.seconds === null) checkpoint.seconds = NaN;
  });
}

const CURRENT_SCHEMA_VERSION = 1;
type Migration = (data: Object) => Object;

const migrations: Record<number, Migration> = {
  1: (d) => {
    // convert your changed field from its old shape to the new one
    return d;
  },
};

export function reviveDB(db: any): ScoreCardDb {
  let v = db?.schemaVersion;
  if (typeof v !== "number") throw new Error("missing or invalid schemaVersion");
  if (v > CURRENT_SCHEMA_VERSION) throw new Error(`file is from a newer version (${v})`);

  while (v < CURRENT_SCHEMA_VERSION) {
    let migration = migrations[v++];
    if (migration) {
      db = migration(db);
    }
  }

  // Revive races (Dates, NaN)
  if (db && db.races && Array.isArray(db.races)) {
    db.races.forEach((race: any) => { 
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

export function wrapDB(races: Race[]) {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    races: races 
  }
}