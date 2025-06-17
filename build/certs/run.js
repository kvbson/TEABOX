import { checkForCerts, KEY_FILE, CERT_FILE } from './setupCerts.js';
await checkForCerts(KEY_FILE, CERT_FILE);
