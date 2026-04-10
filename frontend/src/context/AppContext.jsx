import React, { createContext, useContext, useState, useEffect } from 'react';
import { MidnightClient } from '../midnight-sdk/client';
import { useToast } from './ToastContext';
import { useWallet } from './WalletContext';

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const { addToast } = useToast();
  const { walletAddress, connectedApi } = useWallet();

  // Global Settings
  const [vaultMode, setVaultMode] = useState(true);

  // Dynamic Metrics
  const [anomalyScore, setAnomalyScore] = useState(0.04);
  const [activePeers, setActivePeers] = useState(1402);
  const [complianceRate] = useState(99.98);

  // ZK Signals Feed
  const [zkSignals] = useState([
    { title: 'Volume Threshold Exceeded', hash: '0x92...f2A', desc: 'Protocol 4-A recorded outlier volume deviation.', accent: 'border-primary-container', id: 1 },
    { title: 'Risk Score Deviation', hash: '0xA1...98C', desc: 'Intelligence engine detected non-standard risk patterns.', accent: 'border-secondary', id: 2 },
    { title: 'Large Batch Movement', hash: '0xFD...211', desc: 'Batch grouping detected crossing confidential boundary.', accent: 'border-primary-container', id: 3 },
  ]);

  // Pending Warrants
  const [pendingWarrants, setPendingWarrants] = useState([
    {
      id: 'WNT-092-ALPHA',
      title: 'Institutional Liquidity Probe',
      requestedScope: 'Transactions > $500k in pool #4492 between UTC 14:00-16:00',
      policyJustification: 'Anti-Wash Trading Regulation V.4 (Anomaly detected in block 19223)',
      timeRemaining: '2h remaining',
    },
    {
      id: 'WNT-114-SIGMA',
      title: 'Cross-Chain Bridge Audit',
      requestedScope: 'Validator key rotation history for Epoch 9022-9045',
      policyJustification: 'Annual Security Recertification (Protocol Standard 2.2)',
      timeRemaining: 'Scheduled',
    },
  ]);

  // Active Scopes
  const [activeScopes, setActiveScopes] = useState([
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
    { id: 'PRT-7721-ZK', time: ts(2),  hash: '[9a2c..f1]', active: true  },
    { id: 'PRT-6502-ZK', time: ts(14), hash: '[8e41..0d]', active: false },
    { id: 'PRT-9001-ZK', time: ts(28), hash: '[3f12..bb]', active: false },
    { id: 'PRT-9122-ZK', time: ts(55), hash: '[1c4a..88]', active: false },
  ]);

  // ── Authorize Warrant ────────────────────────────────────────
  // Called by AuditBridge. setLoadingState controls the card's loading overlay.
  const authorizeWarrant = async (warrantId, setLoadingState) => {
    if (!walletAddress) {
      addToast('Wallet Required', 'Connect your Midnight Lace wallet to sign transactions.', 'error');
      return;
    }

    const warrant = pendingWarrants.find(w => w.id === warrantId);
    if (!warrant) return;

    try {
      // Phase 1 — Generate ZK-SNARK proof
      setLoadingState('generating');
      addToast('⚙️ Generating Proof', `ZK-SNARK circuit executing for ${warrantId}...`, 'success');

      const { proofHash, executionTimeMs, blockHeight } = await MidnightClient.generateAuditProof(
        warrantId,
        connectedApi   // Pass real connectedApi — SDK uses it when contract is deployed
      );

      addToast('✅ Proof Generated', `Circuit ran in ${executionTimeMs}ms · Block #${blockHeight}`, 'success');

      // Phase 2 — Submit disclosure transaction
      setLoadingState('signing');
      addToast('🔐 Awaiting Signature', 'Confirm the transaction in your Midnight Lace wallet.', 'success');

      const { txHash, explorerUrl } = await MidnightClient.authorizeDisclosureTx(
        proofHash,
        walletAddress,
        warrantId,
        connectedApi
      );

      addToast('⛓️ Transaction Mined', `Proof on-chain: ${txHash}`, 'success');

      // Phase 3 — Update local state
      setPendingWarrants(prev => prev.filter(w => w.id !== warrantId));

      setActiveScopes(prev => [{
        entity: warrant.title.substring(0, 18),
        id: warrant.id.replace('WNT-', '#'),
        initial: warrant.title.charAt(0),
        color: 'border-primary',
        text: 'text-primary',
        progress: '0%',
        time: '23:59:59',
        status: 'Active',
      }, ...prev]);

      setLedger(prev => [{
        id: `PRT-${Math.floor(1000 + Math.random() * 9000)}-ZK`,
        time: ts(0),
        hash: txHash,
        active: true,
        explorerUrl,
      }, ...prev.map(l => ({ ...l, active: false }))]);

    } catch (err) {
      console.error('[AppContext] Authorization failed:', err);
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

  // ── Live Network Simulation ───────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      setAnomalyScore(prev => {
        let s = prev + (Math.random() - 0.5) * 0.008;
        return Number(Math.min(0.15, Math.max(0.01, s)).toFixed(3));
      });
      setActivePeers(prev => prev + Math.floor((Math.random() - 0.5) * 5));
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <AppContext.Provider value={{
      vaultMode, setVaultMode,
      anomalyScore, activePeers, complianceRate,
      zkSignals,
      pendingWarrants,
      activeScopes,
      ledger,
      authorizeWarrant,
      dismissWarrant,
      verifyHash,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
