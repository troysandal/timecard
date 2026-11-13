import type { CapacitorConfig } from '@capacitor/cli';
import os from 'os';

declare const process: { env: Record<string, string | undefined> };

const isDev = process.env.CAP_DEV === 'true';

function getLocalIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const config: CapacitorConfig = {
  appId: 'com.troysandal.endurocomputer',
  appName: 'Enduro Time Card',
  webDir: 'dist',
  ...(isDev && {
    server: {
      url: `http://${getLocalIp()}:5173`,
      cleartext: true,
    },
  }),
};

export default config;
