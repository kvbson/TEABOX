import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

const CERT_FILE = 'localhost.crt';
const KEY_FILE = 'localhost-key.pem';
const CERTS_DIR = './api/certs/';

// https://vite.dev/config/
export default defineConfig({
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
    noExternal: ['child_process', 'https', 'fs', 'path', 'os', 'crypto', 'express', 'mkcert'],
  },
  optimizeDeps: {
    exclude: ['child_process', 'https', 'fs', 'path', 'os', 'crypto', 'express', 'mkcert'],
  },
  // Explicitly exclude the api/ directory
  publicDir: false,
  resolve: {
    alias: {
      // Ensure Vite ignores the api/ directory
      '/api': path.resolve(__dirname, 'api'),
    },
  },
  server: {
    https: {
      key: fs.readFileSync(path.join(CERTS_DIR as string, KEY_FILE)),
      cert: fs.readFileSync(path.join(CERTS_DIR as string, CERT_FILE)),
      // key: 'api/server/certs/localhost-key.pem',
      // cert: 'api/server/certs/localhost.pem',
    },
    host: 'localhost',
    port: 5173,
  },
});
