import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

const CERT_FILE = 'localhost.crt';
const KEY_FILE = 'localhost-key.pem';
const CERTS_DIR = './api/certs/';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        external: [
          /^node:.*/,
          'express',
          'fs',
          'path',
          'https',
          'child_process',
          'crypto',
          'os',
        ],
      },
    },
    ssr: {
      noExternal: [
        'child_process', 'https', 'fs', 'path', 'os', 'crypto', 'express', 'mkcert',
      ],
    },
    optimizeDeps: {
      exclude: [
        'child_process', 'https', 'fs', 'path', 'os', 'crypto', 'express', 'mkcert',
      ],
    },
    publicDir: false,
    resolve: {
      alias: {
        '/api': path.resolve(__dirname, 'api'),
      },
    },
    server: isDev
      ? {
        https: {
          key: fs.readFileSync(path.join(CERTS_DIR, KEY_FILE)),
          cert: fs.readFileSync(path.join(CERTS_DIR, CERT_FILE)),
        },
        host: 'localhost',
        port: 5173,
      }
      : undefined,
  };
});
