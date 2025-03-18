import fs from 'node:fs';
import { createCA, createCert } from 'mkcert';
import path from 'node:path';
import { execSync } from 'node:child_process';
import os from 'node:os';

const CERTS_DIR = path.resolve('./certs');
const CA_CERT = path.join(CERTS_DIR, 'rootCA.pem');

async function generateCertificates() {
  try {
    console.log('🔐 Generating TLS certificates...');

    // Generate Root CA
    const ca = await createCA({
      organization: 'Teabox',
      countryCode: 'PL',
      state: 'Silesia',
      locality: 'Katowice',
      validity: 365,
    });

    // Save the CA key and cert
    fs.mkdirSync(CERTS_DIR, { recursive: true });
    fs.writeFileSync(CA_CERT, ca.cert);
    fs.writeFileSync(path.join(CERTS_DIR, 'rootCA-key.pem'), ca.key);

    // Generate the TLS certificate
    const cert = await createCert({
      ca: { key: ca.key, cert: ca.cert },
      domains: ['127.0.0.1', 'localhost'],
      validity: 365,
    });

    fs.writeFileSync(path.join(CERTS_DIR, 'server-key.pem'), cert.key);
    fs.writeFileSync(path.join(CERTS_DIR, 'server-cert.pem'), cert.cert);

    console.log('✅ Certificates generated successfully');
  } catch (error) {
    console.error('❌ Error generating certificates:', error);
  }
}

function installCertificate() {
  try {
    console.log('📥 Installing root CA certificate...');

    if (os.platform() === 'win32') {
      // Windows: Add to Trusted Root Certification Authorities
      execSync(`certutil -addstore Root "${CA_CERT}"`, { stdio: 'inherit' });
    } else if (os.platform() === 'darwin') {
      // macOS: Add to System Keychain
      execSync(`sudo security add-trusted-cert -d
         -r trustRoot -k /Library/Keychains/System.keychain "${CA_CERT}"`, { stdio: 'inherit' });
    } else if (os.platform() === 'linux') {
      // Linux: Copy to system CA directory and update certs
      execSync(`sudo cp "${CA_CERT}" /usr/local/share/ca-certificates/rootCA.crt`, { stdio: 'inherit' });
      execSync('sudo update-ca-certificates', { stdio: 'inherit' });
    } else {
      console.warn('⚠️ Unsupported OS. Please install the certificate manually.');
    }

    console.log('✅ Root CA installed successfully');
  } catch (error) {
    console.error('❌ Failed to install root CA:', error);
  }
}

export async function checkForCerts() {
  await generateCertificates();
  installCertificate();
}
