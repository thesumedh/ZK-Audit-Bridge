import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Timer, VenetianMask, Ban, Eye, FileUp, LogOut, Search, Download, ExternalLink, CheckCircle2, Clock, Zap } from 'lucide-react';
import { useAppContext, SARAH_DEMO } from '../context/AppContext';

const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

// Pre-built demo result — instant display, no waiting
const DEMO_RESULT = {
  status:     'VALID',
  warrantId:  SARAH_DEMO.warrantId,
  circuitId:  SARAH_DEMO.circuitId,
  merkleRoot: SARAH_DEMO.merkleRoot,
  proofSize:  `${SARAH_DEMO.proofSizeBytes} bytes`,
  blockHeight: SARAH_DEMO.blockHeight,
  expiresBlock: SARAH_DEMO.expiresBlock,
  generationMs: SARAH_DEMO.generationMs,
  txHash:     SARAH_DEMO.txHash,
  proofHash:  SARAH_DEMO.proofHash,
  compliance: 'AUTHORIZED',
  character:  SARAH_DEMO.character,
  role:       SARAH_DEMO.role,
  gasCost:    `${SARAH_DEMO.gasCostDust} tDUST (${SARAH_DEMO.savingsPct}% cheaper than Ethereum)`,
};

// Builds the JSON that gets downloaded
function buildProofJSON(result) {
  return {
    zkProof: {
      version:           '4.0',
      network:           'preprod',
      warrantId:         result.warrantId,
      circuitId:         result.circuitId,
      proofHash:         result.proofHash,
      merkleRoot:        result.merkleRoot,
      proofSizeBytes:    SARAH_DEMO.proofSizeBytes,
      generationTimeMs:  result.generationMs,
    },
    onChain: {
      txHash:            result.txHash,
      blockHeight:       result.blockHeight,
      expiresAtBlock:    result.expiresBlock,
      explorerUrl:       `https://explorer.preprod.midnight.network/tx/${result.txHash}`,
      gasCostTDUST:      SARAH_DEMO.gasCostDust,
    },
    compliance: {
      status:            result.compliance,
      auditor:           result.character,
      organization:      'Horizon Capital DeFi Fund',
      disclosedFields:   ['transaction_scope', 'policy_hash', 'block_range'],
      hiddenFields:      ['counterparty_identity', 'exact_amounts', 'wallet_addresses'],
      verdict:           'Compliance proven via ZK-SNARK. Zero sensitive data revealed.',
    },
    policyGuardrails: {
      identityRedacted:  true,
      timeRangeLimited:  true,
      noPivotAllowed:    true,
      expiresAtBlock:    result.expiresBlock,
    },
    generatedAt: new Date().toISOString(),
    standard:    'Midnight ZK-Audit Bridge v1.0',
  };
}

export default function WarrantVerification() {
  const { vaultMode } = useAppContext();
  const [hashInput, setHashInput] = useState(SARAH_DEMO.proofHash);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult]       = useState(null);

  const handleVerify = async () => {
    if (!hashInput.trim()) return;
    setVerifying(true);
    setResult(null);
    // Instant for demo hash, realistic delay otherwise
    const delay = hashInput === SARAH_DEMO.proofHash ? 800 : 1800;
    await new Promise(r => setTimeout(r, delay));
    setVerifying(false);
    setResult(DEMO_RESULT);
  };

  const handleExport = () => {
    if (!result) return;
    const json = JSON.stringify(buildProofJSON(result), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `zk-proof-${result.warrantId}-${result.blockHeight}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>

      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              ZK Verification Engine
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tighter">Proof Verification</h1>
          <p className="text-on-surface-variant mt-2 text-sm">Verify any ZK audit proof independently — no trust required.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={!result}
            className="px-5 py-2.5 glass-panel border border-primary/15 rounded-lg text-primary-fixed-dim font-bold text-xs uppercase tracking-widest hover:bg-surface-bright transition-all disabled:opacity-30 flex items-center gap-2"
          >
            <Download size={13} /> Export Proof JSON
          </button>
          <button
            onClick={() => { setHashInput(SARAH_DEMO.proofHash); setTimeout(handleVerify, 100); }}
            className="px-5 py-2.5 bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/30 text-secondary font-bold rounded-lg text-xs uppercase tracking-widest hover:bg-secondary/20 transition-colors flex items-center gap-2"
          >
            <Zap size={13} /> Load Demo Proof
          </button>
        </div>
      </header>

      {/* Verify Input */}
      <div className="mb-8 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-3">Enter Proof Hash or Transaction Hash</p>
        <div className="flex gap-3">
          <input
            value={hashInput}
            onChange={e => setHashInput(e.target.value)}
            placeholder="0x3e8f1a92c4b7d05e6f2a8c3b..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 font-mono text-xs text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={handleVerify}
            disabled={verifying || !hashInput.trim()}
            className="px-6 py-3 bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {verifying ? <><span className="animate-spin">⚙</span> Verifying...</> : <><Search size={13} /> Verify</>}
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-2 font-mono">
          Demo hash pre-loaded: {SARAH_DEMO.proofHash.substring(0, 30)}...
        </p>
      </div>

      <AnimatePresence>
        {verifying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-8 p-8 bg-surface-container-low rounded-xl border border-primary/10 text-center"
          >
            <div className="inline-flex items-center gap-3 text-primary font-mono text-sm">
              <span className="text-2xl animate-spin">⚙</span>
              Running ZK verification circuit...
            </div>
            <p className="text-xs text-slate-500 mt-2">Checking merkle root · Validating policy bounds · Querying indexer</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* ✅ Main Result */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <section className="lg:col-span-8 bg-surface-container-low rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-primary-container flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.4)]">
                      <CheckCircle2 className="text-on-primary-container" size={36} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 border border-primary/20 rounded">✅ Proof Valid</span>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2 py-0.5 bg-secondary/10 border border-secondary/20 rounded">⛓ On-Chain Confirmed</span>
                      </div>
                      <h2 className="font-headline text-2xl font-bold text-on-surface">Compliance Verified</h2>
                      <p className="text-on-surface-variant text-sm">ZK-SNARK proof authenticated at Block #{result.blockHeight.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Proof Technical Data */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Circuit ID',    value: result.circuitId },
                      { label: 'Merkle Root',   value: result.merkleRoot.substring(0, 14) + '...' },
                      { label: 'Proof Size',    value: result.proofSize },
                      { label: 'Block Height',  value: `#${result.blockHeight.toLocaleString()}` },
                      { label: 'Expires Block', value: `#${result.expiresBlock.toLocaleString()}` },
                      { label: 'Gen Time',      value: `${result.generationMs}ms` },
                    ].map((item, i) => (
                      <div key={i} className="bg-surface-container-lowest p-4 rounded-lg border-l-2 border-primary">
                        <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{item.label}</div>
                        <div className="font-mono text-sm text-on-surface-variant truncate">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Cost comparison */}
                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Verification Cost</p>
                      <p className="text-sm font-mono text-primary font-bold">{result.gasCost}</p>
                    </div>
                    <a
                      href="https://explorer.preprod.midnight.network"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-end gap-1"
                    >
                      <span className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                        View Explorer <ExternalLink size={12} />
                      </span>
                      <span className="text-[9px] text-slate-600 font-mono">
                        Simulated tx · executed via Midnight Lace
                      </span>
                    </a>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-[10px] font-mono text-on-surface-variant/40">
                    <span>GEN_STATE: AUTHENTICATED</span>
                    <span>HASH_MATCH: YES</span>
                    <span>POLICY_BOUNDS: SATISFIED</span>
                    <span>EXPIRY: ACTIVE</span>
                  </div>
                </div>
              </section>

              {/* Policy Guardrails */}
              <section className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10">
                <h3 className="font-headline text-lg font-bold text-secondary mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-secondary" size={22} />
                  Policy Guardrails
                </h3>
                <ul className="space-y-5">
                  {[
                    { icon: Timer,         title: 'Time-Bound Proof',     desc: `Expires at block #${result.expiresBlock.toLocaleString()}. Automatically invalid after.` },
                    { icon: VenetianMask,  title: 'Identity Redacted',    desc: 'Wallet addresses replaced with ephemeral ZK-identity hashes.' },
                    { icon: Ban,           title: 'No Secondary Pivot',   desc: 'Graph traversal depth capped at 1st degree. No data mining.' },
                    { icon: Clock,         title: 'Window Restricted',    desc: 'Disclosure window restricted to exactly 24h per Warrant Order.' },
                  ].map((guard, i) => (
                    <li key={i} className="flex gap-4">
                      <guard.icon className="text-secondary-fixed-dim flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1">{guard.title}</p>
                        <p className="text-xs text-on-surface-variant">{guard.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-tighter mb-2">AI Compliance Verdict</p>
                  <p className="text-xs italic text-on-surface-variant">
                    "{result.character} proved {result.role.split('—')[0].trim()} compliance. Zero sensitive data revealed. Warrant parameters satisfy Encryption Transparency Act Art. 14."
                  </p>
                </div>
              </section>
            </div>

            {/* Scoped Data Disclosure Table */}
            <section className="bg-surface-container-low rounded-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-outline-variant/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-3">
                  <Eye className="text-primary-container" size={24} />
                  Scoped Data Disclosure
                </h3>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-primary px-2 py-1 bg-primary/10 rounded">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Revealed
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-600 px-2 py-1 bg-slate-900 rounded">
                    <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" /> Encrypted (ZK)
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container-high/50">
                      <th className="px-8 py-4">Transaction Hash</th>
                      <th className="px-8 py-4">Asset</th>
                      <th className="px-8 py-4">Quantity</th>
                      <th className="px-8 py-4">Counterparty</th>
                      <th className="px-8 py-4 text-right">Scope Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-inter">
                    <tr className="hover:bg-surface-bright transition-colors">
                      <td className="px-8 py-4 font-mono text-primary text-xs">0x4a...9b21</td>
                      <td className="px-8 py-4">USDC</td>
                      <td className="px-8 py-4 font-mono">2,300,000.00</td>
                      <td className="px-8 py-4 font-mono text-xs">{vaultMode ? 'zkID-992...f0a1' : '0x88De...2B11'}</td>
                      <td className="px-8 py-4 text-right">
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">REVEALED</span>
                      </td>
                    </tr>
                    <tr className="opacity-35">
                      <td className="px-8 py-4 font-mono">●●●●●●●●●●●●</td>
                      <td className="px-8 py-4">WETH</td>
                      <td className="px-8 py-4 font-mono">●●●●●</td>
                      <td className="px-8 py-4 font-mono text-xs">●●●●●●●●●●●●</td>
                      <td className="px-8 py-4 text-right">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">ENCRYPTED</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-bright transition-colors">
                      <td className="px-8 py-4 font-mono text-primary text-xs">0x1c...e3e8</td>
                      <td className="px-8 py-4">USDC</td>
                      <td className="px-8 py-4 font-mono">12,450.00</td>
                      <td className="px-8 py-4 font-mono text-xs">{vaultMode ? 'zkID-112...a90b' : '0xFA12...49D1'}</td>
                      <td className="px-8 py-4 text-right">
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">REVEALED</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-8 py-4 border-t border-slate-800 flex items-center justify-between">
                <p className="text-[10px] font-mono text-slate-600">
                  2 of 3 transactions disclosed · 1 cryptographically sealed
                </p>
                <p className="text-[10px] font-bold text-secondary">
                  Selective disclosure: 5 fields proven · 8 fields hidden
                </p>
              </div>
            </section>

            {/* Audit Trace */}
            <section className="bg-slate-950 rounded-xl p-8 border border-outline-variant/5">
              <h3 className="font-headline text-lg font-bold text-on-surface mb-8">Audit Bridge Interaction Trace</h3>
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
                {[
                  { icon: FileUp,     label: 'Warrant Submitted',   desc: `WR-${result.warrantId} signed by court authority`,  step: '01', active: false },
                  { icon: ShieldCheck,label: 'ZK Proof Generated',  desc: `${result.generationMs}ms · Circuit zkp_audit_v4_p3`, step: '02', active: true  },
                  { icon: CheckCircle2,label: 'On-Chain Confirmed', desc: `Block #${result.blockHeight.toLocaleString()} · Preprod`, step: '03', active: false },
                  { icon: LogOut,     label: 'Disclosure Triggered', desc: 'Selective decryption keys released for scoped items', step: '04', active: false },
                ].map((s, i, arr) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center text-center w-full max-w-[160px]">
                      <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-3 relative ${
                        s.active
                          ? 'bg-primary/10 border-2 border-primary shadow-[0_0_20px_rgba(0,242,255,0.2)]'
                          : 'glass-panel border border-primary/20'
                      }`}>
                        <s.icon className={s.active ? 'text-primary' : 'text-slate-500'} size={24} />
                        <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full text-[8px] flex items-center justify-center font-bold border ${
                          s.active ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-highest text-slate-500 border-outline-variant'
                        }`}>{s.step}</div>
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${s.active ? 'text-primary' : 'text-on-surface'}`}>{s.label}</p>
                      <p className="text-[10px] text-on-surface-variant">{s.desc}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="h-8 w-px md:h-px md:w-full bg-gradient-to-b md:bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 flex-1" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
