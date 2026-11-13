// Scanned time card photo storage. All paths are relative to PHOTO_DIRECTORY
// and go through @capacitor/filesystem so they work on iOS and Android.
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export const PHOTO_DIRECTORY = Directory.Data;
/** Same value as PHOTO_DIRECTORY, in the scanner plugin's naming. */
export const PHOTO_SCAN_DIRECTORY = 'DATA' as const;

export const scanFolder = (raceId: string) => `${raceId}/scans`;

/** Converts the plugin's absolute native path into a stored, directory-relative path. */
export function toImagePath(raceId: string, nativePath: string): string {
  const name = nativePath.split('/').filter(Boolean).pop() ?? '';
  return `${scanFolder(raceId)}/${name}`;
}

export async function imageUrl(imagePath: string): Promise<string> {
  const { uri } = await Filesystem.getUri({ path: imagePath, directory: PHOTO_DIRECTORY });
  return Capacitor.convertFileSrc(uri);
}

export async function deleteImage(imagePath: string | undefined): Promise<void> {
  if (!imagePath || !Capacitor.isNativePlatform()) return;
  try {
    await Filesystem.deleteFile({ path: imagePath, directory: PHOTO_DIRECTORY });
  } catch (e) {
    console.warn('deleteImage failed', e);
  }
}

/** Deletes every scan photo for the race except `keep`. */
export async function pruneRaceImages(raceId: string, keep?: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const folder = scanFolder(raceId);
    const { files } = await Filesystem.readdir({ path: folder, directory: PHOTO_DIRECTORY });
    for (const f of files) {
      if (f.type === 'directory') continue;
      const path = `${folder}/${f.name}`;
      if (path !== keep) await deleteImage(path);
    }
  } catch {
    // folder doesn't exist: nothing to prune
  }
}

/** Removes the race's scan photos. Leaves the rest of <raceId>/ for other features. */
export async function deleteRaceImages(raceId: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await Filesystem.rmdir({ path: scanFolder(raceId), directory: PHOTO_DIRECTORY, recursive: true });
  } catch {
    // nothing stored
  }
}
