import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ExternalLink, Loader2 } from 'lucide-react';

const WalletContext = createContext();

const NETWORK_ID = import.meta.env.VITE_MIDNIGHT_NETWORK_ID || 'preprod';

/**
 * Finds the first available Midnight wallet provider injected by any
 * compatible browser extension (Lace, Nightscape, etc.)
 * 
 * Midnight extensions inject under window.midnight.<providerId>
 * Lace uses 'mnLace' as its provider ID.
 */
const getMidnightProvider = () => {
  const midnight = window?.midnight;
  if (!midnight) return null;
  if (midnight.mnLace) return midnight.mnLace;
  // Future-proof: use any available provider key
  const keys = Object.keys(midnight);
  if (keys.length > 0) return midnight[keys[0]];
  return null;
};

// ── Install Gate Modal ────────────────────────────────────────
function WalletInstallGate({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <ShieldAlert className="text-primary" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-headline font-bold text-on-surface">Wallet Not Detected</h2>
            <p className="text-xs text-on-surface-variant font-mono">Midnight Lace Extension</p>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
          The <span className="text-primary font-semibold">ZK-Audit Bridge</span> requires the{' '}
          <span className="text-primary font-semibold">Midnight Lace wallet</span> browser extension
          to generate zero-knowledge proofs and sign on-chain transactions.
        </p>

        <div className="p-3 mb-5 bg-primary/5 border border-primary/10 rounded-lg">
          <p className="text-[10px] text-primary/70 font-bold uppercase tracking-widest mb-1">
            Already installed?
          </p>
          <p className="text-xs text-on-surface-variant">
            Complete the Midnight Lace wallet setup first, then refresh this page and click Connect Wallet again.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="https://midnight.network/lace"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <ExternalLink size={14} />
            Get Midnight Lace Wallet
          </a>
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-outline-variant/20 text-on-surface-variant text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-surface-bright transition-colors"
          >
            I'll try again after setup
          </button>
        </div>

        <div className="mt-5 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Network Target</p>
          <p className="text-xs font-mono text-primary">{NETWORK_ID}</p>
          <p className="text-[10px] font-mono text-slate-600 mt-1">preprod.midnight.network</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Provider ──────────────────────────────────────────────────
export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [connectedApi, setConnectedApi] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletAvailable, setIsWalletAvailable] = useState(false);
  const [showInstallGate, setShowInstallGate] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Poll continuously for extension injection.
  // Lace injects AFTER first-time setup is completed — not just on install.
  // We poll at increasing intervals to catch it whenever it becomes available.
  useEffect(() => {
    const check = () => {
      const found = !!getMidnightProvider();
      setIsWalletAvailable(found);
      return found;
    };

    if (check()) return; // Already found on first check

    const delays = [300, 600, 1000, 2000, 3000, 5000, 8000];
    const timers = delays.map(ms => setTimeout(check, ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  const connectWallet = useCallback(async () => {
    setConnectionError(null);

    const provider = getMidnightProvider();

    if (!provider) {
      setShowInstallGate(true);
      return;
    }

    setIsConnecting(true);
    try {
      console.log('[WalletContext] Provider found. API version:', provider.apiVersion);
      console.log('[WalletContext] Connecting to network:', NETWORK_ID);

      // Trigger Lace extension popup — user must approve in the extension
      const api = await provider.connect(NETWORK_ID);
      setConnectedApi(api);

      // Fetch the user's real shielded address from the connected wallet
      const shieldedData = await api.getShieldedAddresses();

      console.log('[WalletContext] Shielded data received:', typeof shieldedData, shieldedData);

      let raw = '';
      if (typeof shieldedData === 'string') {
        raw = shieldedData;
      } else if (shieldedData?.shieldedAddress) {
        raw = shieldedData.shieldedAddress;
      } else if (Array.isArray(shieldedData) && shieldedData.length > 0) {
        raw = typeof shieldedData[0] === 'string' ? shieldedData[0] : shieldedData[0]?.shieldedAddress || '';
      }

      if (!raw) {
        throw new Error(
          'Wallet connected but returned no address. Ensure your Midnight Lace wallet has an account created on the preprod network.'
        );
      }

      // Format for display in the nav bar
      const display = raw.length > 22
        ? `${raw.substring(0, 10)}...${raw.substring(raw.length - 6)}`
        : raw;

      setWalletAddress(display);
      console.log('[WalletContext] Connected successfully:', display);

    } catch (err) {
      console.error('[WalletContext] Connection error:', err);
      const msg = err?.message || 'Connection was rejected or failed.';
      setConnectionError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setConnectedApi(null);
    setConnectionError(null);
  }, []);

  return (
    <WalletContext.Provider value={{
      walletAddress,
      connectedApi,
      isConnecting,
      isWalletAvailable,
      connectionError,
      networkId: NETWORK_ID,
      connectWallet,
      disconnectWallet,
    }}>
      {children}

      <AnimatePresence>
        {showInstallGate && (
          <WalletInstallGate onClose={() => setShowInstallGate(false)} />
        )}
      </AnimatePresence>
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
