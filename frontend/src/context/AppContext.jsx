import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MidnightClient } from '../midnight-sdk/client';
import { useToast } from './ToastContext';
import { useWallet } from './WalletContext';

const AppContext = createContext();

// ── Pre-generated Demo Proof (Sarah scenario) ──────────────────
// These look exactly like real Midnight preprod transaction data.
export const SARAH_DEMO = {
  warrantId:    'WNT-SARAH-01',
  character:    'Sarah Chen',
  role:         'Chief Compliance Officer — Horizon Capital DeFi Fund',
  scenario:     'SEC requested audit of $2.3M USDC positions for AML compliance review',
  txHash:       '0x7f4a2c91e8b3d056f1a9c4e82b7d3f0a1c8e5b92d4f6a7e3c1b0d8f5a2e9c47',
  proofHash:    '0x3e8f1a92c4b7d05e6f2a8c3b1d9e4f7a0c5b2d8e1f3a6c9b4d7e0f2a5c8b1d4',
  blockHeight:  1462841,
  expiresBlock: 1463841,
  proofSizeBytes: 248,
  circuitId:    'zkp_audit_v4_p3',
  merkleRoot:   '0x7f2a9c4b1d8e3f6a0c7b5d2e9f4a1c8b3d6f0a7c4b2e5f8a1d3c6b9e2f5a8c1',
  generationMs: 2341,
  gasCostDust:  '0.0003',
  ethEquivGas:  '$47.20',
  savingsPct:   '99.4',
  disclosureFields: {
    txAmount:     '2,300,000.00 USDC',
    counterparty: '0x88De...2B11',
    auditorName:  'Sarah Chen / Horizon Capital',
    timestamp:    '2024-03-14 14:22:01 UTC',
  },
};

export function AppContextProvider({ children }) {
  const { addToast } = useToast();
  const { walletAddress, connectedApi } = useWallet();

  // Global Settings
  const [vaultMode, setVaultMode] = useState(true);
  const [demoMode, setDemoMode]   = useState(false);
  const [demoStep, setDemoStep]   = useState(0); // 0=idle,1=requesting,2=proving,3=verified,4=done

  // Dynamic Metrics
  const [anomalyScore, setAnomalyScore] = useState(0.055);
  const [activePeers,  setActivePeers]  = useState(1402);
  const [complianceRate] = useState(99.98);
  const [totalAudits, setTotalAudits]   = useState(147);

  // ZK Signals Feed
  const [zkSignals] = useState([
    { title: 'Volume Threshold Exceeded', hash: '0x92...f2A', desc: 'Protocol 4-A recorded outlier volume deviation. Block #1,461,919.', accent: 'border-primary-container', id: 1 },
    { title: 'Risk Score Deviation',      hash: '0xA1...98C', desc: 'Intelligence engine detected non-standard risk patterns.', accent: 'border-secondary', id: 2 },
    { title: 'Large Batch Movement',      hash: '0xFD...211', desc: 'Batch grouping detected crossing confidential boundary.', accent: 'border-primary-container', id: 3 },
  ]);

  // Pending Warrants — each has a block-height expiry
  const [pendingWarrants, setPendingWarrants] = useState([
    {
      id: 'WNT-092-ALPHA',
      title: 'Institutional Liquidity Probe',
      requestedScope: 'Transactions > $500k in pool #4492 between UTC 14:00–16:00',
      policyJustification: 'Anti-Wash Trading Regulation V.4 (Anomaly detected in block 1,461,223)',
      timeRemaining: '2h 14m',
      expiresBlock: 1463120,
      disclosureToggles: { amount: true, counterparty: true, auditor: true, timestamp: true },
    },
    {
      id: 'WNT-114-SIGMA',
      title: 'Cross-Chain Bridge Audit',
      requestedScope: 'Validator key rotation history for Epoch 9022–9045',
      policyJustification: 'Annual Security Recertification (Protocol Standard 2.2)',
      timeRemaining: 'Scheduled',
      expiresBlock: 1465000,
      disclosureToggles: { amount: true, counterparty: false, auditor: false, timestamp: true },
    },
  ]);

  // Active Scopes
  const [activeScopes, setActiveScopes] = useState([
    { entity: 'Institutional Liqu', id: '#092-ALPHA', initial: 'I', color: 'border-primary', text: 'text-primary', progress: '95%', time: '23:59:59', status: 'Active' },
    { entity: 'Confidential_Pool_Alpha', id: '#902-88X', initial: 'A', color: 'border-secondary', text: 'text-secondary', progress: '75%', time: '02:14:55', status: 'Decrypting' },
    { entity: 'Validator_Node_44', id: '#811-32F', initial: 'V', color: 'border-primary-container', text: 'text-primary', progress: '25%', time: '00:42:10', status: 'Active' },
  ]);

  // Audit Ledger
  const ts = (m) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - m);
    return d.toISOString().replace('T', ' ').substring(0, 19);
  };

  const [ledger, setLedger] = useState([
    { id: 'PRT-7721-ZK', time: ts(2),  hash: SARAH_DEMO.txHash.substring(0, 14) + '...', blockHeight: 1462841, active: true,  explorerUrl: 'https://explorer.preprod.midnight.network' },
    { id: 'PRT-6502-ZK', time: ts(14), hash: '0x8e41...0d99', blockHeight: 1462190, active: false, explorerUrl: 'https://explorer.preprod.midnight.network' },
    { id: 'PRT-9001-ZK', time: ts(28), hash: '0x3f12...bb4a', blockHeight: 1461882, active: false, explorerUrl: 'https://explorer.preprod.midnight.network' },
    { id: 'PRT-9122-ZK', time: ts(55), hash: '0x1c4a...8801', blockHeight: 1461209, active: false, explorerUrl: 'https://explorer.preprod.midnight.network' },
  ]);

  // ── Sarah Demo Run ────────────────────────────────────────────
  const runSarahDemo = useCallback(async () => {
    setDemoMode(true);
    setDemoStep(1);

    addToast('🎬 Demo Mode', 'Following Sarah Chen, CCO of Horizon Capital', 'success');

    // Step 1 — Warrant appears (instant)
    await new Promise(r => setTimeout(r, 800));

    const sarahWarrant = {
      id: SARAH_DEMO.warrantId,
      title: 'AML Compliance Review — Horizon Capital',
      requestedScope: 'USDC positions > $500k, March 14 2024, 14:00–16:00 UTC',
      policyJustification: 'SEC AML Audit Request — Case #2024-SEC-04819',
      timeRemaining: 'Expires Block #' + SARAH_DEMO.expiresBlock.toLocaleString(),
      expiresBlock: SARAH_DEMO.expiresBlock,
      isDemo: true,
      disclosureToggles: { amount: true, counterparty: false, auditor: false, timestamp: true },
    };

    setPendingWarrants(prev => [sarahWarrant, ...prev]);
    setDemoStep(2);

    // Step 2 — Auto-authorize after short delay
    await new Promise(r => setTimeout(r, 1200));
    addToast('⚙️ Generating ZK Proof', 'Circuit executing for WNT-SARAH-01...', 'success');
    setDemoStep(3);

    // Step 3 — Proof generated (simulate real timing)
    await new Promise(r => setTimeout(r, SARAH_DEMO.generationMs));

    addToast('✅ Proof Verified', `Circuit ran in ${SARAH_DEMO.generationMs}ms · Block #${SARAH_DEMO.blockHeight.toLocaleString()}`, 'success');
    await new Promise(r => setTimeout(r, 600));

    addToast('⛓ Transaction Confirmed', `Hash: ${SARAH_DEMO.txHash.substring(0, 18)}...`, 'success');

    // Step 4 — Update ledger + scopes
    setPendingWarrants(prev => prev.filter(w => w.id !== SARAH_DEMO.warrantId));
    setActiveScopes(prev => [{
      entity: 'Horizon Capital AML', id: '#SARAH-01',
      initial: 'S', color: 'border-primary', text: 'text-primary',
      progress: '0%', time: '23:59:59', status: 'Active',
    }, ...prev]);
    setLedger(prev => [{
      id: 'PRT-SARAH-ZK', time: ts(0),
      hash: SARAH_DEMO.txHash.substring(0, 14) + '...',
      blockHeight: SARAH_DEMO.blockHeight, active: true,
      explorerUrl: `https://explorer.preprod.midnight.network/tx/${SARAH_DEMO.txHash}`,
      isDemo: true,
    }, ...prev.map(l => ({ ...l, active: false }))]);
    setTotalAudits(n => n + 1);
    setDemoStep(4);

    addToast('🏆 Demo Complete', 'Sarah proved AML compliance. Zero sensitive data revealed.', 'success');
  }, [addToast]);

  const exitDemo = useCallback(() => {
    setDemoMode(false);
    setDemoStep(0);
  }, []);

  // ── Real Authorize Warrant ────────────────────────────────────
  const authorizeWarrant = async (warrantId, setLoadingState) => {
    if (!walletAddress) {
      addToast('Wallet Required', 'Connect your Midnight Lace wallet to sign transactions.', 'error');
      return;
    }
    const warrant = pendingWarrants.find(w => w.id === warrantId);
    if (!warrant) return;

    try {
      setLoadingState('generating');
      addToast('⚙️ Generating Proof', `ZK-SNARK circuit executing for ${warrantId}...`, 'success');
      const { proofHash, executionTimeMs, blockHeight } = await MidnightClient.generateAuditProof(warrantId, connectedApi);
      addToast('✅ Proof Generated', `Circuit ran in ${executionTimeMs}ms · Block #${blockHeight?.toLocaleString()}`, 'success');

      setLoadingState('signing');
      addToast('🔐 Awaiting Signature', 'Confirm the transaction in your Midnight Lace wallet.', 'success');
      const { txHash, explorerUrl, blockHeight: txBlock } = await MidnightClient.authorizeDisclosureTx(proofHash, walletAddress, warrantId, connectedApi);
      addToast('⛓ Transaction Confirmed', `On-chain: ${txHash}`, 'success');

      setPendingWarrants(prev => prev.filter(w => w.id !== warrantId));
      setActiveScopes(prev => [{
        entity: warrant.title.substring(0, 18), id: warrant.id.replace('WNT-', '#'),
        initial: warrant.title.charAt(0), color: 'border-primary', text: 'text-primary',
        progress: '0%', time: '23:59:59', status: 'Active',
      }, ...prev]);
      setLedger(prev => [{
        id: `PRT-${Math.floor(1000 + Math.random() * 9000)}-ZK`,
        time: ts(0), hash: txHash, blockHeight: txBlock, active: true, explorerUrl,
      }, ...prev.map(l => ({ ...l, active: false }))]);
      setTotalAudits(n => n + 1);
    } catch (err) {
      addToast('❌ Transaction Failed', err.message, 'error');
    } finally {
      setLoadingState(null);
    }
  };

  const dismissWarrant = (warrantId) => {
    setPendingWarrants(prev => prev.filter(w => w.id !== warrantId));
    addToast('Warrant Dismissed', `${warrantId} removed from queue.`, 'success');
  };

  const verifyHash = (hash) => hash.trim().length >= 5;

  // ── Live Simulation ───────────────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      setAnomalyScore(prev => {
        const s = prev + (Math.random() - 0.5) * 0.008;
        return Number(Math.min(0.15, Math.max(0.01, s)).toFixed(3));
      });
      setActivePeers(prev => prev + Math.floor((Math.random() - 0.5) * 5));
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <AppContext.Provider value={{
      vaultMode, setVaultMode,
      demoMode, demoStep, runSarahDemo, exitDemo,
      anomalyScore, activePeers, complianceRate, totalAudits,
      zkSignals, pendingWarrants, activeScopes, ledger,
      authorizeWarrant, dismissWarrant, verifyHash,
      SARAH_DEMO,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
