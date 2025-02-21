import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.troysandal.EnduroTimeCard',
  appName: 'Enduro Time Card',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic'
  }
};

export default config;
