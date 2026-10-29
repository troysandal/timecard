import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import type { Race } from '../models/race';

type ScoreCardDb = Race[]

export interface ScoreCardStore {
  load(): Promise<ScoreCardDb | null>;
  save(db: ScoreCardDb): Promise<void>;
}

function restoreDates(races: ScoreCardDb): ScoreCardDb {
  return races.map((race) => { race.createdAt = new Date(race.createdAt); return race; });
}

class FileStore implements ScoreCardStore {
  async load(): Promise<ScoreCardDb | null> {
    try {
      const result = await Filesystem.readFile({
        path: 'races.json',
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      const data = JSON.parse(result.data as string);
      return restoreDates(data.races);
    } catch (error) {
      console.error('Error reading or parsing JSON file:', error);
    }
    return [];
  }

  async save(db: ScoreCardDb): Promise<void> {
    await Filesystem.writeFile({
      path: 'races.json',
      directory: Directory.Data,
      data: JSON.stringify({ races: db }),
      encoding: Encoding.UTF8,
    });
  } 
}

class LocalStorageStore implements ScoreCardStore {
  static LOCAL_DB_KEY = "enduro_time_card"

  async load(): Promise<ScoreCardDb | null> {
    const savedData = localStorage.getItem(LocalStorageStore.LOCAL_DB_KEY);
    if (savedData) {
      try {
        const dbData = JSON.parse(savedData);
        return restoreDates(dbData.races);
      } catch (e) {
        console.error('Failed to parse localStorage data:', e);
      }
    }
    return [];
  }

  async save(db: ScoreCardDb): Promise<void> {
    localStorage.setItem(LocalStorageStore.LOCAL_DB_KEY, JSON.stringify({races: db}))
  } 
}

export const store: ScoreCardStore =
  Capacitor.isNativePlatform() ? new FileStore() : new LocalStorageStore();