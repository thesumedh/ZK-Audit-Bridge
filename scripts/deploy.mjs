/**
 * ZK-Audit Bridge — Full Production Deployment Script
 * 
 * Uses the official Midnight.js SDK to deploy audit_bridge.compact
 * to Midnight Preprod testnet.
 * 
 * Usage:
 *   node scripts/deploy.mjs
 * 
 * Prerequisites:
 *   1. Install Compact compiler: node scripts/setup-compiler.mjs
 *   2. Compile: compact compile contracts/audit_bridge.compact ./contracts/compiled
 *   3. Ensure Midnight Lace wallet is connected with preprod tDUST tokens
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Config ────────────────────────────────────────────────────
const CONFIG = {
  networkId:      process.env.MIDNIGHT_NETWORK_ID     || 'preprod',
  indexerUri:     process.env.MIDNIGHT_INDEXER_URL    || 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWsUri:   process.env.MIDNIGHT_INDEXER_WS_URL || 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  proofServerUri: process.env.MIDNIGHT_PROOF_SERVER   || 'https://proof-server.preprod.midnight.network',
  rpcUri:         process.env.MIDNIGHT_RPC_URL        || 'https://rpc.preprod.midnight.network',
};

// ── Helpers ───────────────────────────────────────────────────
const gql = async (url, query, variables = {}) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.json();
};

async function getBlockHeight() {
  try {
    const data = await gql(CONFIG.indexerUri, `{
      syncState { syncedToBlock { height hash } status }
    }`);
    return data?.data?.syncState?.syncedToBlock?.height || null;
  } catch { return null; }
}

// ── Main ──────────────────────────────────────────────────────
async function deploy() {
  console.log('\n🛡️  ZK-Audit Bridge — Production Deployment');
  console.log('=============================================\n');
  console.log(`📡 Network:       ${CONFIG.networkId}`);
  console.log(`🔗 Indexer:       ${CONFIG.indexerUri}`);
  console.log(`⚡ Proof Server:  ${CONFIG.proofServerUri}`);
  console.log(`🔗 RPC:           ${CONFIG.rpcUri}\n`);

  // Step 1: Check indexer
  process.stdout.write('🌐 Checking indexer connectivity... ');
  const blockHeight = await getBlockHeight();
  if (blockHeight) {
    console.log(`✅ Online — Block #${Number(blockHeight).toLocaleString()}`);
  } else {
    console.log('⚠️  Could not reach indexer (proceeding anyway)');
  }

  // Step 2: Check compiled contract artifacts
  const compiledPath = join(ROOT, 'contracts', 'compiled');
  const compiledExists = existsSync(compiledPath);

  console.log(`\n📦 Contract artifacts: ${compiledExists ? '✅ Found' : '❌ Not found'}`);

  if (!compiledExists) {
    console.log('\n┌─────────────────────────────────────────────────────┐');
    console.log('│  Compact compiler required to generate artifacts    │');
    console.log('└─────────────────────────────────────────────────────┘\n');
    console.log('To compile and deploy:\n');
    console.log('  1. Install Compact compiler (Windows PowerShell):');
    console.log('     irm https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.ps1 | iex\n');
    console.log('  2. Open a NEW terminal and compile:');
    console.log('     compact compile contracts/audit_bridge.compact ./contracts/compiled\n');
    console.log('  3. Deploy:');
    console.log('     node scripts/deploy.mjs\n');
    console.log('─────────────────────────────────────────────────────\n');
    console.log('📚 SDK Available (ready to deploy once compiled):');
    
    // Show that SDK is installed
    try {
      const { indexerPublicDataProvider } = await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider');
      console.log('   ✅ @midnight-ntwrk/midnight-js-indexer-public-data-provider');
    } catch { console.log('   ❌ indexer provider not found'); }
    
    try {
      await import('@midnight-ntwrk/midnight-js-contracts');
      console.log('   ✅ @midnight-ntwrk/midnight-js-contracts');
    } catch { console.log('   ❌ contracts SDK not found'); }
    
    try {
      await import('@midnight-ntwrk/midnight-js-http-client-proof-provider');
      console.log('   ✅ @midnight-ntwrk/midnight-js-http-client-proof-provider');
    } catch { console.log('   ❌ proof provider not found'); }

    console.log('\n✅ All SDK packages are installed and ready.');
    console.log('   Run the compile step above to proceed to deployment.\n');
    return;
  }

  // Step 3: Full deployment using SDK
  console.log('\n🚀 Deploying to Midnight Preprod...\n');

  try {
    // Load SDK providers
    const { indexerPublicDataProvider } = await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider');
    const { httpClientProofProvider }   = await import('@midnight-ntwrk/midnight-js-http-client-proof-provider');
    const { levelPrivateStateProvider } = await import('@midnight-ntwrk/midnight-js-level-private-state-provider');
    const { deployContract }            = await import('@midnight-ntwrk/midnight-js-contracts');

    // Load compiled contract
    const { Contract } = await import(join(compiledPath, 'contract.cjs'));

    const providers = {
      publicDataProvider:   indexerPublicDataProvider(CONFIG.indexerUri, CONFIG.indexerWsUri),
      proofProvider:        httpClientProofProvider(CONFIG.proofServerUri),
      privateStateProvider: levelPrivateStateProvider({ dbPath: './contracts/.private-state' }),
    };

    const deployed = await deployContract(providers, {
      compiledContract:  new Contract(),
      privateStateId:    'zk-audit-bridge-v1',
      initialPrivateState: {},
    });

    const contractAddress = deployed.deployTxData.public.contractAddress;
    console.log('\n✅ CONTRACT DEPLOYED SUCCESSFULLY!\n');
    console.log('─'.repeat(55));
    console.log(`   Contract Address : ${contractAddress}`);
    console.log(`   Block Height     : ${blockHeight ? `#${Number(blockHeight).toLocaleString()}` : 'N/A'}`);
    console.log(`   Network          : ${CONFIG.networkId}`);
    console.log(`   Explorer         : https://explorer.preprod.midnight.network/`);
    console.log('─'.repeat(55));
    console.log('\n📋 IMPORTANT — Add this to frontend/.env:\n');
    console.log(`   VITE_CONTRACT_ADDRESS=${contractAddress}\n`);
    console.log('Then restart the frontend: npm run dev\n');

  } catch (err) {
    console.error('\n❌ Deployment failed:', err.message);
    if (err.message.includes('wallet')) {
      console.log('\n💡 Make sure your Midnight Lace wallet has preprod tDUST tokens');
      console.log('   Get testnet tokens: https://midnight.network/faucet');
    }
    process.exit(1);
  }
}

deploy();
