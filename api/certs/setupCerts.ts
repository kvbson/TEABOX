import fs from 'node:fs';
import { createCA, createCert } from 'mkcert';
import path from 'node:path';

export const CERTS_DIR = './api/certs/';
export const CERT_FILE = 'localhost.crt';
export const KEY_FILE = 'localhost-key.pem';
export const AIVEN_FILE = 'aiven-ca.crt';

async function generateCertificates(keyFile: string, certFile: string, next?: (message: string, error?: Error) => void) {
  try {
    console.log('🔐 Generating TLS certificates...');
    const ca = await createCA({
      organization: 'Teabox',
      countryCode: 'PL',
      state: 'Silesia',
      locality: 'Katowice',
      validity: 365,
    });
    const cert = await createCert({
      ca: { key: ca.key, cert: ca.cert },
      domains: ['127.0.0.1', 'localhost'],
      validity: 365,
    });
    fs.writeFileSync(path.join(CERTS_DIR, keyFile), cert.key);
    fs.writeFileSync(path.join(CERTS_DIR, certFile), cert.cert);
    console.log('✅ Certificates generated successfully');
  } catch (error: Error | any) {
    next?.('❌ Error generating certificates:', error);
  }
}

export async function checkForCerts(keyFile: string, certFile: string) {
  if (!fs.existsSync(AIVEN_FILE)) {
    throw new Error(`Missing Aiven CA file at api/certs. Please download it from your Aiven console or contact owner. Expected path: api/certs/${AIVEN_FILE}`);
  }
  if (fs.existsSync(certFile) && fs.existsSync(keyFile)) {
    console.log('✅ TLS certificates already exist.');
  } else {
    await generateCertificates(keyFile, certFile);
  }
}

