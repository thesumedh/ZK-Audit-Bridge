# ZK-Audit Bridge — Compact Contracts

This directory contains the Midnight Compact smart contracts for the ZK-Audit Bridge.

## `audit_bridge.compact`

The core compliance primitive. Manages the public audit ledger state on the Midnight blockchain.

### Ledger State (Public On-Chain)
| Field | Type | Description |
|---|---|---|
| `audit_count` | `Counter` | Total number of audit events recorded |
| `latest_warrant_id` | `Opaque<"string">` | ID of the most recent warrant processed |
| `latest_proof_hash` | `Opaque<"string">` | ZK proof hash of the last authorization |
| `compliance_status` | `Opaque<"string">` | Current compliance state |

### Circuits (ZK-Proven Transitions)
| Circuit | Description |
|---|---|
| `submit_audit_warrant(warrant_id, policy_hash)` | AI Agent submits a compliance-triggered warrant |
| `authorize_disclosure(warrant_id, proof_hash)` | Institutional authority signs off on selective disclosure |
| `dismiss_warrant(warrant_id)` | Records a warranted dismissal on the audit trail |

## Compiling

```bash
# Requires the Midnight Compact compiler
compact compile audit_bridge.compact ./compiled
```

## Deploying to Testnet

```bash
cd ..
node scripts/deploy.mjs
```

## Testnet Explorer

After deployment, verify your contract on the Midnight testnet explorer:
`https://explorer.testnet-02.midnight.network/`
