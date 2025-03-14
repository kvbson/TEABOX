import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { createCA, createCert } from "mkcert";
import path from 'path';


// Certificate filenames
const CERTS_DIR = './api/server/certs/'
const CERT_FILE = 'localhost.pem';
const KEY_FILE = 'localhost-key.pem';


// check if mkcert is installed
const isMkcertInstalled = () => {
  try {
    execSync('mkcert --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

async function generateCertificates() {
  try {
    console.log('🔐 Generating TLS certificates...');
    const ca = await createCA({
      organization: "Teabox",
      countryCode: "PL",
      state: "Silesia",
      locality: "Katowice",
      validity: 365
    });
    const cert = await createCert({
      ca: { key: ca.key, cert: ca.cert },
      domains: ["127.0.0.1", "localhost"],
      validity: 365
    });
    fs.writeFileSync(path.join(CERTS_DIR, KEY_FILE), cert.key);
    fs.writeFileSync(path.join(CERTS_DIR, CERT_FILE), cert.cert);
    console.log('✅ Certificates generated successfully');
  } catch (error) {
    console.error('❌ Error generating certificates:', error);
  }
}

// Check if certs already exist
if (fs.existsSync(CERT_FILE) && fs.existsSync(KEY_FILE)) {
  console.log('✅ TLS certificates already exist.');
} else {
  if (!isMkcertInstalled()) {
    console.error('❌ mkcert is not installed. Install it first: https://github.com/FiloSottile/mkcert');
    process.exit(1);
  }
  generateCertificates();
}