/** Where the captured photo is stored. Same names as `@capacitor/filesystem`'s `Directory`. */
export type ScanDirectory = 'DOCUMENTS' | 'DATA' | 'LIBRARY' | 'CACHE';

export interface CaptureOptions {
  /** Base directory for the saved photo. Default `'DOCUMENTS'`. */
  directory?: ScanDirectory;
  /** Folder inside `directory` to save into, created if missing. The file name is generated. */
  folder?: string;
}

export interface Row {
  /** Each cell is `''` when blank, never `null`. Characters are limited to `0-9` and `:`. */
  c1: string;
  c2: string;
  c3: string;
  /** True when the scanner had a reason to doubt this row (see `warnings`, or a mapped character). */
  flagged?: boolean;
}

export interface ScanResult {
  image: {
    /** Native file path; usable with `@capacitor/filesystem`. */
    path: string;
    /** URL for `<img src>` in the web view. */
    webPath: string;
  };
  /** One entry per table row on the card, including blank trailing rows. */
  rows: Row[];
  warnings: string[];
}

/** `error.code` values the plugin rejects with. */
export type ScanErrorCode =
  | 'CANCELLED' // the user closed the scanner: ignore it
  | 'UNAVAILABLE' // not iOS 26+, no document scanner, or not running on iOS
  | 'NO_TABLE' // a photo was taken but no table found; `error.data` holds a ScanResult-shaped `image`
  | 'INVALID_ARGUMENT'
  | 'BUSY' // a capture is already in progress
  | 'SCAN_FAILED';

export interface TimeCardScannerPlugin {
  /** True only on iOS 26+ on a device with the document scanner. Always safe to call. */
  isAvailable(): Promise<{ available: boolean }>;

  /**
   * Opens the system document scanner, saves the photo and returns it with
   * the table read from it. Pick Manual shutter, then Save. Rejects with a
   * {@link ScanErrorCode}.
   */
  captureCard(options?: CaptureOptions): Promise<ScanResult>;

  /** Reads the table from a photo already on disk (e.g. one from `captureCard`). */
  scanImage(options: { path: string }): Promise<ScanResult>;
}
