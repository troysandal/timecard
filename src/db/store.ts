import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

type ScoreCardDb = Object

export interface ScoreCardStore {
  load(): Promise<ScoreCardDb | null>;
  save(db: ScoreCardDb): Promise<void>;
}

function revive(db: any): ScoreCardDb {
  if (db && db.races && Array.isArray(db.races)) {
    db.races.forEach((race: any) => { 
      race.createdAt = new Date(race.createdAt); 
    });
  }

  return db;
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
      return revive(db);
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
          return revive(db);
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