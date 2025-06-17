import fs from 'node:fs';
import { createCA, createCert } from 'mkcert';
import path from 'node:path';
export const CERTS_DIR = './api/certs/';
export const CERT_FILE = 'localhost.crt';
export const KEY_FILE = 'localhost-key.pem';
async function generateCertificates(keyFile, certFile) {
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
    }
    catch (error) {
        console.error('❌ Error generating certificates:', error);
    }
}
export async function checkForCerts(keyFile, certFile) {
    if (fs.existsSync(certFile) && fs.existsSync(keyFile)) {
        console.log('✅ TLS certificates already exist.');
    }
    else {
        await generateCertificates(keyFile, certFile);
    }
}
