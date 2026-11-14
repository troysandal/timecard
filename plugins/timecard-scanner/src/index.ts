import { registerPlugin } from '@capacitor/core';

import type { TimeCardScannerPlugin } from './definitions';

const loadUnsupported = () => import('./web').then((m) => new m.TimeCardScannerUnsupported());

const TimeCardScanner = registerPlugin<TimeCardScannerPlugin>('TimeCardScanner', {
  web: loadUnsupported,
  android: loadUnsupported,
});

export * from './definitions';
export { TimeCardScanner };
