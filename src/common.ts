import { Capacitor } from '@capacitor/core';

// Capacitor Utilites - @todo - move to platform.ts

Capacitor.isNativePlatform();   // true inside the iOS/Android app, false in a browser
Capacitor.getPlatform();        // 'web' | 'ios' | 'android'

export const isInstalledPwa =
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as any).standalone === true; // iOS Safari's non-standard flag

export type RunMode = 'native' | 'pwa' | 'browser';

export function getRunMode(): RunMode {
  if (Capacitor.isNativePlatform()) return 'native';
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true;
  return standalone ? 'pwa' : 'browser';
}