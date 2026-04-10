import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Terminal, Plus, ShieldCheck, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

export default function AuditBridge() {
  const { 
    vaultMode, setVaultMode, 
    complianceRate, 
    pendingWarrants, 
    authorizeWarrant, 
    dismissWarrant 
  } = useAppContext();

  // Track the loading state for specifically clicked warrants
  const [loadingWarrants, setLoadingWarrants] = useState({});

  const handleAuthorize = async (warrantId) => {
    // authorizeWarrant now takes a callback to update its specific loading state
    await authorizeWarrant(warrantId, (state) => {
      setLoadingWarrants(prev => ({ ...prev, [warrantId]: state }));
    });
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Hero Section / Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 mt-2">
        <div className="lg:col-span-8 bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h2 className="text-sm font-label uppercase tracking-[0.2em] text-on-surface-variant mb-2">Protocol Health</h2>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 tracking-tight">Audit Bridge Protocol View</h1>
            <div className="flex flex-wrap gap-8 items-center">
              <div className="flex flex-col">
                <span className="text-xs font-label text-slate-500 uppercase mb-1">Compliance Score</span>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-headline font-bold text-primary">{complianceRate}</span>
                  <span className="text-xs font-label text-secondary mb-1">Top 1% Tier</span>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-xs font-label text-slate-500 uppercase mb-1">Network Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
                  <motion.span 
                    key={vaultMode ? 'vault' : 'public'}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-sm font-label text-on-surface"
                  >
                    {vaultMode ? 'Confidentiality Active' : 'Public Sync Active'}
                  </motion.span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle UI for Network Confidentiality */}
        <div className="lg:col-span-4 bg-surface-container-low p-8 rounded-xl border border-primary/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-headline font-bold text-on-surface mb-4">Confidentiality Master Switch</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-6">Non-scoped data is cryptographically isolated on the Midnight network. Toggle global encryption layers.</p>
          </div>
          <div className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="text-cyan-400" size={20} />
              <span className="text-sm font-medium">Vault Mode</span>
            </div>
            <button 
              onClick={() => setVaultMode(!vaultMode)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${vaultMode ? 'bg-primary-container' : 'bg-slate-700'}`}
            >
              <motion.div 
                animate={{ x: vaultMode ? 24 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-background rounded-full"
              ></motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Layout: Pending Warrants & ZK Policy Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Pending Audit Warrants */}
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
              {pendingWarrants.map((warrant) => {
                const isLoading = loadingWarrants[warrant.id];
                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -50 }}
                    key={warrant.id} 
                    className="group bg-surface-container-low p-6 rounded-xl hover:bg-surface-bright transition-all duration-300 relative border-r-2 border-secondary"
                  >
                    {/* Loading Overlay */}
                    {isLoading && (
                      <div className="absolute inset-0 bg-surface-container-low/80 backdrop-blur-sm rounded-xl z-20 flex flex-col items-center justify-center border-2 border-primary/20">
                        <Loader2 className="animate-spin text-primary mb-2" size={32} />
                        <p className="text-primary font-bold text-xs uppercase tracking-widest">
                          {isLoading === 'generating' ? 'Generating ZK Proof...' : 'Please Sign Transaction...'}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500">ID: {warrant.id}</span>
                        <h3 className="text-md font-bold text-on-surface mt-1">{warrant.title}</h3>
                      </div>
                      <span className="text-xs text-primary font-label">{warrant.timeRemaining}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-surface-container-lowest p-3 rounded">
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Requested Scope</p>
                        <p className="text-xs text-on-surface leading-tight font-medium">{warrant.requestedScope}</p>
                      </div>
                      <div className="bg-surface-container-lowest p-3 rounded">
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Policy Justification</p>
                        <p className="text-xs text-on-surface leading-tight font-medium">{warrant.policyJustification}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleAuthorize(warrant.id)} 
                        disabled={isLoading}
                        className="flex-1 py-2 bg-primary-container text-on-primary text-xs font-bold rounded hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50"
                      >
                        Authorize &amp; Generate Proof
                      </button>
                      <button 
                        onClick={() => dismissWarrant(warrant.id)} 
                        disabled={isLoading}
                        className="px-4 py-2 bg-slate-900 text-slate-400 text-xs font-bold rounded hover:bg-slate-800 disabled:opacity-50"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              {pendingWarrants.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="p-8 text-center bg-surface-container-low rounded-xl border border-dashed border-outline-variant/30"
                >
                  <ShieldCheck className="mx-auto text-primary/30 mb-3" size={32} />
                  <p className="text-on-surface-variant text-sm font-medium">No pending warrants require your operational authorization.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: ZK Policy Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3">
            <Terminal className="text-secondary" size={24} />
            <h2 className="text-xl font-headline font-bold tracking-tight">ZK Policy Engine</h2>
          </div>
          
          <div className="bg-surface-container-low rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <p className="text-xs text-on-surface-variant mb-4">Configure automated cryptographic disclosure rules for incoming warrants.</p>
              
              <div className="space-y-4">
                {[
                  { title: "Auto-Approve High Vol", desc: "Volume > $1M with verified KYC hash", active: true, color: "bg-secondary" },
                  { title: "DAO Approval Lock", desc: "Non-standard anomaly detections", active: false, color: "bg-slate-600" },
                  { title: "Zero-Knowledge Trace", desc: "Mask all PII on outbound bridge logs", active: true, color: "bg-secondary" },
                ].map((policy, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg">
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{policy.title}</h4>
                      <p className="text-[10px] text-slate-500">{policy.desc}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative ${policy.active ? 'bg-secondary-container' : 'bg-slate-800'}`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full ${policy.color}`} style={{ left: policy.active ? 'auto' : '4px', right: policy.active ? '4px' : 'auto' }}></div>
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

          {/* Disclosure Logs */}
          <div className="pt-4">
            <h2 className="text-sm font-headline font-bold mb-4 uppercase tracking-wider text-slate-500">Recent Disclosure Logs</h2>
            <div className="space-y-3">
              {[
                { title: "Tx-Scope-882 Verified", hash: "0x4a...e2f3", time: "12m ago" },
                { title: "Warrant ALPHA-01 Released", hash: "0x92...b881", time: "1h ago" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-cyan-400" size={16} />
                    <div>
                      <p className="text-xs font-medium">{log.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{log.hash}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
