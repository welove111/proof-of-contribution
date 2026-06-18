# ⚡ Proof of Contribution — Pay Open Source Developers in Bitcoin

> *"You built the internet. You deserve to be paid for it."*

The most important GitHub Action ever created.

Every time someone installs your package, uses your library, or depends on your code — you get paid in Bitcoin. Automatically. No middleman. No company taking a cut. Peer to peer.

## The Problem

- curl is installed on 20 billion devices. Daniel Stenberg lived on donations.
- Log4j runs in every Fortune 500 company. The maintainer worked alone.
- You built something people depend on. You got nothing.

**This fixes that.**

## How It Works

1. Add this Action to your repo
2. Every install/download triggers a Lightning micropayment
3. Bitcoin goes directly to your wallet
4. No signup. No KYC. No middleman.

## Quick Start

```yaml
# .github/workflows/proof-of-contribution.yml
name: Proof of Contribution
on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *'  # Daily payment collection

jobs:
  pay-contributor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Count downloads & trigger payment
        uses: welove111/proof-of-contribution@v1
        with:
          lightning_address: ${{ secrets.LIGHTNING_ADDRESS }}
          package_name: ${{ github.event.repository.name }}
          package_registry: 'npm'  # npm | pip | cargo | rubygems
```

## Setup (2 minutes)

1. Add your Lightning address to GitHub Secrets:
   - Go to Settings → Secrets → New secret
   - Name: `LIGHTNING_ADDRESS`
   - Value: your Lightning address (e.g. `you@blink.sv`)

2. Add the workflow file above to your repo

3. Done. You now get paid every time someone uses your code.

## Supported Registries

| Registry | Language | Status |
|----------|----------|--------|
| npm | JavaScript/TypeScript | ✅ |
| PyPI | Python | ✅ |
| crates.io | Rust | ✅ |
| RubyGems | Ruby | ✅ |
| Maven | Java | 🔜 |
| NuGet | C# | 🔜 |

## Payment Model

```
Downloads per day → Sats per day
1 - 100           → 10 sats
100 - 1,000       → 100 sats  
1,000 - 10,000    → 1,000 sats
10,000 - 100,000  → 10,000 sats
100,000+          → 100,000 sats
```

*Payments sourced from the Proof of Contribution community pool.*
*Pool funded by: developers who believe open source should pay.*

## Powered By

- **BTCvision.org** — Bitcoin intelligence & Lightning infrastructure
- **welove@blink.sv** — Core maintainer Lightning address
- **GitHub Actions** — Free, trustless, automated

## Support The Project

This tool is free forever. If it helps you earn Bitcoin, consider supporting:

⚡ Lightning: `welove@blink.sv`
🌐 Easy pay: `https://pay.zaprite.com/pl_001CbTRNDN`
₿ BTCvision: `https://btcvision.org/#donate`

*Every sat helps keep this project alive and free.*

## Why Bitcoin

- **Censorship resistant** — No PayPal can freeze your account
- **Global** — Works in every country, no bank needed  
- **Instant** — Lightning settles in milliseconds
- **Programmable** — Triggers automatically via GitHub Actions

## The Vision

Imagine if Linus Torvalds received 1 sat for every Linux boot.
Imagine if the OpenSSL team received 1 sat for every HTTPS request.
Imagine if curl received 1 sat for every API call.

**That world starts here.**

---

*Built with ⚡ by [BTCvision](https://btcvision.org)*
*Lightning: welove@blink.sv*
*"The code is the contribution. The contribution deserves payment."*
