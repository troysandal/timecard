import type { CapacitorConfig } from '@capacitor/cli';
import os from 'os';

declare const process: { env: Record<string, string | undefined> };

// Plain-http dev server for the native app: `npm run dev:cap`. The PWA's https
// server (`npm run dev`) uses 5173.
const CAP_DEV_PORT = 5174;
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
      url: `http://${getLocalIp()}:${CAP_DEV_PORT}`,
      cleartext: true,
    },
  }),
};

export default config;
