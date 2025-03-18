import fs from 'node:fs';
import { createCA, createCert } from 'mkcert';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

async function generateCertificates(keyFile: string, certFile: string) {
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
    const certsDir = process.env.CERTS_DIR;
    if (!certsDir) {
      return console.log('❌ Missing CERTS_DIR parameter in env file.');
    }
    fs.writeFileSync(path.join(certsDir, keyFile), cert.key);
    fs.writeFileSync(path.join(certsDir, certFile), cert.cert);
    console.log('✅ Certificates generated successfully');
  } catch (error) {
    console.error('❌ Error generating certificates:', error);
  }
}

export async function checkForCerts(keyFile: string, certFile: string) {
  if (fs.existsSync(certFile) && fs.existsSync(keyFile)) {
    console.log('✅ TLS certificates already exist.');
  } else {
    await generateCertificates(keyFile, certFile);
  }
}
