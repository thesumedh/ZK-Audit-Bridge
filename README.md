# 🛡️ ZK-Audit Bridge + AI Auditor Agent
### Privacy-Preserving Compliance Infrastructure on Midnight Network

[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod-00dbe7?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMMiAyMmgyMEwxMiAyem0wIDRsNyAxNEg1bDctMTR6Ii8+PC9zdmc+)](https://midnight.network)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

---

## 🎯 Problem Statement

Financial institutions, DAOs, and compliance authorities need to audit on-chain activity — but **existing audit systems expose sensitive data**. There's no way to prove compliance without revealing private transaction details in plain sight.

**The Privacy Trilemma**: Transparency vs. Privacy vs. Compliance.

---

## 💡 Solution: ZK-Audit Bridge

A privacy-preserving audit layer built on **Midnight Network** that enables:

- ✅ **Prove compliance** without revealing underlying transaction data
- ✅ **Time-bound warrant authorization** — selective disclosure with cryptographic expiry
- ✅ **AI-powered anomaly detection** — flags suspicious patterns as ZK signals
- ✅ **On-chain audit trail** — immutable ledger of approved disclosures

> Auditors see proof of compliance. The underlying data stays private. Always.

---

## 🔐 How It Works

```
Compliance Authority                    Midnight Network
        │                                       │
        │  1. Submits audit warrant             │
        ├──────────────────────────────────────►│
        │                                       │
        │  2. ZK-SNARK proof generated          │
        │     (no raw data leaves the system)   │
        │◄──────────────────────────────────────┤
        │                                       │
        │  3. Warrant authorized on-chain       │
        ├──────────────────────────────────────►│
        │                                       │
        │  4. Proof hash recorded in ledger     │
        │     (public, verifiable, auditable)   │
        │◄──────────────────────────────────────┤
```

### Circuits (Compact Smart Contract)

| Circuit | Description |
|---|---|
| `submit_audit_warrant` | Creates a ZK-sealed warrant with scope + policy hash |
| `authorize_disclosure` | Approves selective disclosure, stamps proof on-chain |
| `dismiss_warrant` | Formally rejects a warrant with cryptographic proof |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vite + React)               │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │  Dashboard   │  │ Audit Bridge│  │  Verification  │  │
│  │  (Live ZK    │  │ (Warrant    │  │  Flow (Proof   │  │
│  │   Signals)   │  │  Auth Flow) │  │  Verification) │  │
│  └──────────────┘  └─────────────┘  └────────────────┘  │
│           │               │                │             │
│  ┌─────────────────────────────────────────────────────┐ │
│  │               Midnight SDK Client                   │ │
│  │   - getNetworkStatus()  - generateAuditProof()     │ │
│  │   - getLedgerState()    - authorizeDisclosureTx()  │ │
│  └─────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌───────────────┐ ┌──────────────┐ ┌──────────────────────┐
│ Midnight Lace │ │ Proof Server │ │  Midnight Indexer    │
│ Wallet        │ │ (Remote)     │ │  GraphQL v4 (Live)   │
│ window.mx.    │ │ preprod.mn   │ │  Block Height, State │
│ mnLace        │ │              │ │                      │
└───────────────┘ └──────────────┘ └──────────────────────┘
```

---

## ✨ Features

### 🔴 Live & Real
- **Real wallet connection** via `window.midnight.mnLace` (Midnight Lace extension)
- **Live block height** polled from `indexer.preprod.midnight.network/api/v4/graphql`
- **Proof server health** monitored from `proof-server.preprod.midnight.network`
- **Real preprod network** — `NETWORK_ID: preprod`

### 🟡 Simulation (Demo Mode)
- ZK circuit execution — simulated with real timing (2.5s, matching production)
- Transaction hashes — deterministically generated
- Block height — real preprod height stamped onto every proof event

> Circuit calls become fully real once contract is deployed via `node scripts/deploy.mjs`

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone https://github.com/YOUR_USER/midnight-zk-audit-bridge
cd midnight-zk-audit-bridge

# 2. Install frontend dependencies
cd frontend && npm install

# 3. Start development server
npm run dev
# → http://localhost:5173
```

### Connect Wallet
1. Install [Midnight Lace](https://midnight.network/lace) browser extension
2. Configure: **Network → Preprod**, **Proof Server → Remote**
3. Create/restore wallet, get tDUST from the [faucet](https://midnight.network/faucet)
4. Click **Connect Wallet** in the app
5. Approve the connection in Lace

---

## 📦 Deploy to Preprod (Full Production)

### Prerequisites
- WSL2 (Windows) or Linux/macOS terminal
- Midnight Lace wallet with preprod tDUST

```bash
# Step 1: Install Compact compiler (Linux/macOS/WSL2)
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh

# Step 2: Compile the contract
compact compile contracts/audit_bridge.compact ./contracts/compiled

# Step 3: Install deployment SDK
npm install  # (from project root)

# Step 4: Deploy to Midnight Preprod
node scripts/deploy.mjs

# Step 5: Set contract address
echo "VITE_CONTRACT_ADDRESS=<address-from-step-4>" >> frontend/.env

# Step 6: Restart frontend
cd frontend && npm run dev
```

---

## 🌐 Deploy to Vercel

```bash
# Push to GitHub
git init && git add . && git commit -m "feat: ZK-Audit Bridge"
git push origin main

# On vercel.com:
# 1. New Project → Import from GitHub
# 2. Root Directory: frontend
# 3. Framework Preset: Vite
# Deploy!
```

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Animations | Framer Motion |
| Blockchain | Midnight Network (Preprod) |
| Smart Contract | Compact Language (.compact) |
| Wallet | Midnight Lace (`window.midnight.mnLace`) |
| ZK Proofs | Midnight Proof Server (Remote) |
| Indexer | Midnight GraphQL Indexer v4 |
| Deployment | Vercel (frontend) |

---

## 📊 Project Status

| Component | Status | Details |
|---|---|---|
| Wallet Connection | ✅ Production | Real `window.midnight.mnLace` |
| Live Block Data | ✅ Production | Polling preprod indexer every 15s |
| Proof Server | ✅ Connected | Remote preprod endpoint |
| ZK Warrant Flow | ✅ Production-ready | Wired to `connectedApi.submitTransaction` |
| Contract Deployed | ⏳ Pending | Requires WSL2 for Compact compiler |
| Circuit Execution | ⏳ Pending | Ready once contract address set |

---

## 📁 Repository Structure

```
midnight-zk-audit-bridge/
├── contracts/
│   └── audit_bridge.compact     # Compact ZK smart contract
├── scripts/
│   ├── deploy.mjs               # Full SDK deployment
│   └── setup-compiler.mjs       # Compiler installation guide
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── WalletContext.jsx # Real window.midnight.mnLace
│   │   │   ├── AppContext.jsx    # State + circuit orchestration
│   │   │   └── ToastContext.jsx  # Notification system
│   │   ├── midnight-sdk/
│   │   │   └── client.js        # Production SDK client
│   │   ├── components/
│   │   │   └── LiveNetworkStatus.jsx # Real indexer + proof server status
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── AuditBridge.jsx
│   │       ├── WarrantVerification.jsx
│   │       └── History.jsx
│   └── vercel.json              # Production deployment config
└── package.json                 # Midnight SDK dependencies
```

---

## 🏆 Hackathon Notes

This project demonstrates **the only privacy-preserving audit infrastructure** built natively on Midnight Network's zero-knowledge architecture. Unlike traditional compliance tools that require full data disclosure, ZK-Audit Bridge proves compliance **without revealing anything**.

**Key differentiators:**
1. Uses Midnight's native ZK capabilities (not a layer on top)
2. Selective disclosure via time-bound warrants
3. AI anomaly detection feeds into on-chain proofs
4. Enterprise-grade UI rivaling production compliance dashboards

---

*Built with ❤️ for the Midnight Network Hackathon*
