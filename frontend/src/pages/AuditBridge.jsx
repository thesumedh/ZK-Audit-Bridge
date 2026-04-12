import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Terminal, Plus, ShieldCheck, Loader2,
  Eye, EyeOff, CheckCircle2, ExternalLink, Zap, User, Clock, DollarSign
} from 'lucide-react';
import { useAppContext, SARAH_DEMO } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

// ── Selective Disclosure Toggle ────────────────────────────────
function DisclosureToggle({ label, icon: Icon, revealed, onToggle }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onToggle}
      className={`flex items-center justify-between w-full p-3.5 rounded-xl border transition-all duration-300 text-left ${
        revealed
          ? 'border-primary/30 bg-primary/5 text-primary'
          : 'border-slate-800 bg-slate-900/60 text-slate-500'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={15} className={revealed ? 'text-primary' : 'text-slate-600'} />
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className={`flex items-center gap-2`}>
        {revealed ? (
          <span className="text-[9px] font-bold text-primary uppercase tracking-widest">REVEALED</span>
        ) : (
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">HIDDEN</span>
        )}
        <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${revealed ? 'bg-primary/30' : 'bg-slate-800'}`}>
          <motion.div
            animate={{ x: revealed ? 18 : 3 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute top-1 w-3 h-3 rounded-full ${revealed ? 'bg-primary' : 'bg-slate-600'}`}
          />
        </div>
      </div>
    </motion.button>
  );
}

// ── Warrant Card ───────────────────────────────────────────────
function WarrantCard({ warrant, isLoading, onAuthorize, onDismiss }) {
  const [toggles, setToggles] = useState(
    warrant.disclosureToggles || { amount: true, counterparty: true, auditor: true, timestamp: true }
  );
  const revealedCount = Object.values(toggles).filter(Boolean).length;

  const toggle = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -50 }}
      key={warrant.id}
      className={`bg-surface-container-low rounded-xl relative border-r-4 overflow-hidden ${
        warrant.isDemo ? 'border-secondary shadow-[0_0_30px_rgba(220,184,255,0.08)]' : 'border-primary/40'
      }`}
    >
      {/* Demo badge */}
      {warrant.isDemo && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-secondary/10 border border-secondary/30 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">Live Demo</span>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-surface-container-low/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary" size={36} />
          <p className="text-primary font-bold text-xs uppercase tracking-widest">
            {isLoading === 'generating' ? '⚡ Generating ZK Proof...' : '🔐 Sign in Lace Wallet...'}
          </p>
          <p className="text-[10px] text-slate-500 font-mono">ZK-SNARK circuit executing</p>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-mono text-slate-500">ID: {warrant.id}</span>
            <h3 className="text-md font-bold text-on-surface mt-1">{warrant.title}</h3>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Expires</p>
            <p className="text-xs font-mono text-primary">Block #{warrant.expiresBlock?.toLocaleString() || '—'}</p>
          </div>
        </div>

        {/* Scope + Policy */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-surface-container-lowest p-3 rounded-lg">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Scope</p>
            <p className="text-xs text-on-surface leading-tight">{warrant.requestedScope}</p>
          </div>
          <div className="bg-surface-container-lowest p-3 rounded-lg">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Legal Basis</p>
            <p className="text-xs text-on-surface leading-tight">{warrant.policyJustification}</p>
          </div>
        </div>

        {/* ⭐ SELECTIVE DISCLOSURE TOGGLES */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              Selective Disclosure Controls
            </p>
            <motion.span
              key={revealedCount}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-[10px] font-bold text-primary"
            >
              {revealedCount}/4 revealed
            </motion.span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <DisclosureToggle label="Tx Amount"    icon={DollarSign} revealed={toggles.amount}      onToggle={() => toggle('amount')} />
            <DisclosureToggle label="Counterparty" icon={User}        revealed={toggles.counterparty} onToggle={() => toggle('counterparty')} />
            <DisclosureToggle label="Auditor ID"   icon={EyeOff}     revealed={toggles.auditor}     onToggle={() => toggle('auditor')} />
            <DisclosureToggle label="Timestamp"    icon={Clock}      revealed={toggles.timestamp}   onToggle={() => toggle('timestamp')} />
          </div>
          {/* ZK Punchline */}
          <motion.div
            key={revealedCount}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-center"
          >
            <span className="text-primary font-bold">{revealedCount} fact{revealedCount !== 1 ? 's' : ''} proven</span>
            <span className="text-slate-600 mx-2">·</span>
            <span className="text-secondary font-bold">{4 - revealedCount} fact{(4 - revealedCount) !== 1 ? 's' : ''} hidden</span>
            <span className="text-slate-600 mx-2">·</span>
            <span className="text-slate-400 text-[9px] uppercase tracking-widest">This is ZK</span>
          </motion.div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onAuthorize(warrant.id)}
            disabled={!!isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-primary-container to-primary text-on-primary text-xs font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Zap size={13} />
            Authorize &amp; Generate Proof
          </button>
          <button
            onClick={() => onDismiss(warrant.id)}
            disabled={!!isLoading}
            className="px-4 py-3 bg-slate-900 text-slate-400 text-xs font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            Dismiss
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function AuditBridge() {
  const {
    vaultMode, setVaultMode, complianceRate,
    pendingWarrants, authorizeWarrant, dismissWarrant,
    demoMode, demoStep, runSarahDemo, exitDemo,
    SARAH_DEMO: sd, totalAudits,
  } = useAppContext();
  const navigate = useNavigate();
  const [loadingWarrants, setLoadingWarrants] = useState({});

  const handleAuthorize = async (warrantId) => {
    await authorizeWarrant(warrantId, (state) => {
      setLoadingWarrants(prev => ({ ...prev, [warrantId]: state }));
    });
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>

      {/* ⭐ SARAH DEMO BANNER */}
      <AnimatePresence>
        {demoMode && demoStep >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-5 bg-gradient-to-r from-secondary/10 to-primary/5 border border-secondary/25 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/3 to-transparent pointer-events-none" />
            <div className="flex items-start gap-5 relative z-10">
              <div className="w-14 h-14 rounded-full bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center text-2xl flex-shrink-0">
                👩
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[9px] font-bold text-secondary uppercase tracking-widest px-2 py-0.5 bg-secondary/10 border border-secondary/20 rounded">
                    🎬 Live Demo
                  </span>
                  {demoStep >= 4 && (
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 border border-primary/20 rounded">
                      ✅ Complete
                    </span>
                  )}
                </div>
                <h3 className="font-headline font-bold text-on-surface">
                  {sd.character} — {sd.role}
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">{sd.scenario}</p>
                {demoStep >= 4 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-sm font-bold text-primary"
                  >
                    ✅ Sarah proved AML compliance.&nbsp;
                    <span className="text-secondary">The auditor saw zero sensitive data.</span>
                    &nbsp;This is the power of ZK.
                  </motion.p>
                )}
              </div>
              <button onClick={exitDemo} className="text-slate-500 hover:text-slate-300 text-xs font-bold uppercase tracking-widest transition-colors">
                Exit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 mt-2">
        <div className="lg:col-span-8 bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-sm font-label uppercase tracking-[0.2em] text-on-surface-variant mb-2">Protocol Health</h2>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 tracking-tight">Audit Bridge</h1>
            <div className="flex flex-wrap gap-8 items-center">
              <div className="flex flex-col">
                <span className="text-xs font-label text-slate-500 uppercase mb-1">Compliance Score</span>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-headline font-bold text-primary">{complianceRate}%</span>
                  <span className="text-xs font-label text-secondary mb-1">Top 1% Tier</span>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-800 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xs font-label text-slate-500 uppercase mb-1">Total Audits</span>
                <span className="text-3xl font-headline font-bold text-on-surface">{totalAudits}</span>
              </div>
              <div className="h-10 w-px bg-slate-800 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xs font-label text-slate-500 uppercase mb-1">Gas Savings vs ETH</span>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-headline font-bold text-secondary">{sd.savingsPct}%</span>
                  <span className="text-xs text-slate-500 mb-1 font-mono">(${sd.ethEquivGas} → {sd.gasCostDust} tDUST)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-container-low p-8 rounded-xl border border-primary/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-headline font-bold text-on-surface mb-4">Confidentiality Master Switch</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
              Non-scoped data is cryptographically isolated on the Midnight network. Toggle global encryption layers.
            </p>
          </div>
          <div className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-lg mb-4">
            <div className="flex items-center gap-3">
              <Lock className="text-cyan-400" size={20} />
              <span className="text-sm font-medium">ZK Vault Mode</span>
            </div>
            <button
              onClick={() => setVaultMode(!vaultMode)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${vaultMode ? 'bg-primary-container' : 'bg-slate-700'}`}
            >
              <motion.div
                animate={{ x: vaultMode ? 24 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-background rounded-full"
              />
            </button>
          </div>
          {!demoMode && (
            <button
              onClick={runSarahDemo}
              className="w-full py-3 bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/30 text-secondary font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-secondary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              ⚡ Run Sarah Demo
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Pending Warrants */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-bold tracking-tight">Pending Audit Warrants</h2>
            {pendingWarrants.length > 0 ? (
              <span className="px-2 py-1 bg-secondary-container text-secondary text-[10px] font-bold rounded">
                {pendingWarrants.length} ACTION REQUIRED
              </span>
            ) : (
              <span className="px-2 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded">ALL CLEARED</span>
            )}
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {pendingWarrants.map((warrant) => (
                <WarrantCard
                  key={warrant.id}
                  warrant={warrant}
                  isLoading={loadingWarrants[warrant.id]}
                  onAuthorize={handleAuthorize}
                  onDismiss={dismissWarrant}
                />
              ))}
              {pendingWarrants.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-10 text-center bg-surface-container-low rounded-xl border border-dashed border-outline-variant/30"
                >
                  <CheckCircle2 className="mx-auto text-primary mb-3" size={36} />
                  <p className="text-on-surface font-bold mb-1">All Warrants Cleared</p>
                  <p className="text-on-surface-variant text-sm">No pending warrants require authorization.</p>
                  <button
                    onClick={runSarahDemo}
                    className="mt-4 px-6 py-2.5 bg-secondary/10 border border-secondary/30 text-secondary font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-secondary/20 transition-colors flex items-center gap-2 mx-auto"
                  >
                    ⚡ Run Demo Warrant
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right column: Policy Engine + Disclosure Logs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3">
            <Terminal className="text-secondary" size={24} />
            <h2 className="text-xl font-headline font-bold tracking-tight">ZK Policy Engine</h2>
          </div>

          <div className="bg-surface-container-low rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <p className="text-xs text-on-surface-variant mb-4">Configure automated disclosure rules for incoming warrants.</p>
              <div className="space-y-3">
                {[
                  { title: 'Auto-Approve High Vol', desc: 'Volume > $1M with verified KYC hash', active: true },
                  { title: 'DAO Approval Lock',     desc: 'Non-standard anomaly detections → DAO vote required', active: false },
                  { title: 'Zero-Knowledge Trace',  desc: 'Mask all PII on outbound bridge logs', active: true },
                  { title: 'Time-Bound Expiry',     desc: 'All proofs expire at specified block height', active: true },
                ].map((policy, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-lg">
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{policy.title}</h4>
                      <p className="text-[10px] text-slate-500">{policy.desc}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative flex-shrink-0 ml-3 ${policy.active ? 'bg-secondary-container' : 'bg-slate-800'}`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full ${policy.active ? 'bg-secondary right-1' : 'bg-slate-600 left-1'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-slate-900/50">
              <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-secondary uppercase tracking-widest hover:bg-secondary/10 transition-colors rounded">
                <Plus size={16} /> Add Custom Policy
              </button>
            </div>
          </div>

          {/* Recent Disclosure Logs */}
          <div>
            <h2 className="text-sm font-headline font-bold mb-4 uppercase tracking-wider text-slate-500">Verified Disclosure Log</h2>
            <div className="space-y-3">
              {[
                { title: 'Horizon Capital AML — Verified', hash: SARAH_DEMO.txHash.substring(0, 14) + '...', time: 'Just now', block: SARAH_DEMO.blockHeight },
                { title: 'Tx-Scope-882 Verified', hash: '0x4a...e2f3', time: '12m ago', block: 1462190 },
                { title: 'Warrant ALPHA-01 Released', hash: '0x92...b881', time: '1h ago', block: 1461209 },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary flex-shrink-0" size={15} />
                    <div>
                      <p className="text-xs font-medium">{log.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{log.hash} · Block #{log.block?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{log.time}</span>
                    <a href="https://explorer.preprod.midnight.network" target="_blank" rel="noopener noreferrer" title="Midnight Preprod Explorer (simulated tx)">
                      <ExternalLink size={11} className="text-slate-600 hover:text-primary transition-colors" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
