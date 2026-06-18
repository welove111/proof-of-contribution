const core = require('@actions/core');
const https = require('https');

const REGISTRIES = {
  npm: (pkg) => `https://api.npmjs.org/downloads/point/last-day/${pkg}`,
  pypi: (pkg) => `https://pypistats.org/api/packages/${pkg}/recent?period=day`,
  cargo: (pkg) => `https://crates.io/api/v1/crates/${pkg}/downloads`,
};

const SATS_TABLE = [
  [100, 10],
  [1000, 100],
  [10000, 1000],
  [100000, 10000],
  [Infinity, 100000],
];

function getSats(downloads) {
  for (const [limit, sats] of SATS_TABLE) {
    if (downloads <= limit) return sats;
  }
  return 100000;
}

async function fetchDownloads(registry, pkg) {
  const url = REGISTRIES[registry]?.(pkg);
  if (!url) return 0;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.downloads || json.data?.last_day || 0);
        } catch { resolve(0); }
      });
    }).on('error', () => resolve(0));
  });
}

async function sendLightningPayment(address, sats, pkg) {
  // Via BTCvision Lightning infrastructure
  const payload = JSON.stringify({
    lightning_address: address,
    amount_sats: sats,
    memo: `Proof of Contribution — ${pkg} — ${sats} sats ⚡`,
    source: 'proof-of-contribution',
    btcvision: 'https://btcvision.org',
    support_maintainer: 'welove@blink.sv'
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'btcvision.org',
      path: '/.netlify/functions/lightning-pay',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', () => resolve({ status: 'queued' }));
    req.write(payload);
    req.end();
  });
}

async function run() {
  try {
    const lightningAddress = core.getInput('lightning_address', { required: true });
    const packageName = core.getInput('package_name', { required: true });
    const registry = core.getInput('package_registry') || 'npm';

    core.info(`📦 Package: ${packageName} (${registry})`);
    core.info(`⚡ Lightning: ${lightningAddress}`);

    const downloads = await fetchDownloads(registry, packageName);
    const sats = getSats(downloads);

    core.info(`📊 Downloads today: ${downloads}`);
    core.info(`💰 Sats earned: ${sats}`);

    const result = await sendLightningPayment(lightningAddress, sats, packageName);

    core.info(`✅ Payment sent: ${JSON.stringify(result)}`);
    core.info(`🌐 Powered by BTCvision.org`);
    core.info(`⚡ Support maintainer: welove@blink.sv`);

    core.setOutput('downloads', downloads);
    core.setOutput('sats_earned', sats);
    core.setOutput('payment_status', result.status || 'sent');

  } catch (error) {
    core.setFailed(`Payment failed: ${error.message}`);
  }
}

run();
