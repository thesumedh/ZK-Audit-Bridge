import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Timer, VenetianMask, Ban, Eye, FileUp, LogOut } from 'lucide-react';
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

export default function WarrantVerification() {
  const { vaultMode } = useAppContext();

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Active Disclosure Flow
            </span>
            <span className="text-on-surface-variant font-mono text-xs opacity-60">ID: WR-8829-ZK-04</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tighter">Warrant Verification</h1>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 glass-panel border border-primary/15 rounded-md text-primary-fixed-dim font-bold text-xs uppercase tracking-widest hover:bg-surface-bright transition-all">
            Export Raw JSON
          </button>
          <button className="px-6 py-3 bg-gradient-to-br from-primary to-primary-fixed-dim text-on-primary font-bold rounded-md text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(0,242,255,0.2)] hover:scale-[0.98] transition-transform">
            Generate Public Proof
          </button>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. Warrant Proof Verification */}
        <section className="lg:col-span-8 bg-surface-container-low rounded-xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-primary-container flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.4)]">
                <ShieldCheck className="text-on-primary-container" size={32} />
              </div>
              <div>
                <h2 className="font-headline text-2xl font-bold text-on-surface">Proof of Policy Adherence: Valid</h2>
                <p className="text-on-surface-variant text-sm">ZK-SNARK Verification successful at block #19,203,441</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Circuit ID', value: 'zkp_auth_v4_p3' },
                { label: 'Merkle Root', value: '0x7f2...e4a2' },
                { label: 'Proof Size', value: '248 bytes' }
              ].map((item, i) => (
                <div key={i} className="bg-surface-container-lowest p-4 rounded-lg border-l-2 border-primary">
                  <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="font-mono text-sm text-on-surface-variant truncate">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-on-surface-variant/40">
            <span>GEN_STATE: AUTHENTICATED</span>
            <span>TIMESTAMP: 2023.11.14.04.12.01.UTC</span>
            <span>HASH_MATCH: YES</span>
          </div>
        </section>

        {/* 2. Policy Guardrails Sidebar */}
        <section className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10">
          <h3 className="font-headline text-lg font-bold text-secondary mb-6 flex items-center gap-2">
            <ShieldCheck className="text-secondary" size={24} />
            Policy Guardrails
          </h3>
          <ul className="space-y-6">
            {[
              { icon: Timer, title: "Time Range Limited", desc: "Disclosure window restricted to exactly 24h as per Warrant Order #88." },
              { icon: VenetianMask, title: "Identity Redacted", desc: "Wallet address replaced with ephemeral ZK-Identity hash." },
              { icon: Ban, title: "No Secondary Pivot", desc: "Graph traversal depth limited to 1st degree relatives only." }
            ].map((guard, i) => (
              <li key={i} className="flex gap-4">
                <guard.icon className="text-secondary-fixed-dim" size={24} />
                <div>
                  <p className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1">{guard.title}</p>
                  <p className="text-xs text-on-surface-variant">{guard.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="mt-10 p-4 rounded bg-secondary/5 border border-secondary/20">
            <p className="text-[10px] text-secondary font-bold uppercase tracking-tighter mb-2">AI COMPLIANCE VERDICT</p>
            <p className="text-xs italic text-on-surface-variant">"The warrant parameters are minimal and adhere to Article 14 of the Encryption Transparency Act."</p>
          </div>
        </section>

        {/* 3. Scoped Data View (Detailed Table) */}
        <section className="lg:col-span-12 bg-surface-container-low rounded-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-outline-variant/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-3">
              <Eye className="text-primary-container" size={24} />
              Scoped Data Disclosure
            </h3>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-primary px-2 py-1 bg-primary/10 rounded">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Revealed
              </span>
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-600 px-2 py-1 bg-slate-900 rounded">
                <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span> Encrypted
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
                  <td className="px-8 py-4 font-mono text-primary">0x4a...9b21</td>
                  <td className="px-8 py-4">USDC</td>
                  <td className="px-8 py-4">50,000.00</td>
                  <td className="px-8 py-4 font-mono text-xs">{vaultMode ? 'zkID-992...f0a1' : '0x88De...2B11'}</td>
                  <td className="px-8 py-4 text-right">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shadow-[0_0_5px_rgba(0,242,255,0.3)]">REVEALED</span>
                  </td>
                </tr>
                <tr className="opacity-40">
                  <td className="px-8 py-4 font-mono">••••••••••••</td>
                  <td className="px-8 py-4">WETH</td>
                  <td className="px-8 py-4">•••••</td>
                  <td className="px-8 py-4 font-mono text-xs">••••••••••••</td>
                  <td className="px-8 py-4 text-right">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">ENCRYPTED</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-bright transition-colors">
                  <td className="px-8 py-4 font-mono text-primary">0x1c...e3e8</td>
                  <td className="px-8 py-4">USDC</td>
                  <td className="px-8 py-4">12,450.00</td>
                  <td className="px-8 py-4 font-mono text-xs">{vaultMode ? 'zkID-112...a90b' : '0xFA12...49D1'}</td>
                  <td className="px-8 py-4 text-right">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shadow-[0_0_5px_rgba(0,242,255,0.3)]">REVEALED</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Cryptographic Trace (Visual Interaction) */}
        <section className="lg:col-span-12 bg-slate-950 rounded-xl p-8 border border-outline-variant/5">
          <h3 className="font-headline text-lg font-bold text-on-surface mb-8">Audit Bridge Interaction Trace</h3>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center w-full max-w-[200px]">
              <div className="h-12 w-12 rounded-full glass-panel border border-primary/20 flex items-center justify-center mb-4 relative">
                <FileUp className="text-primary" size={24} />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-surface-container-highest text-[8px] flex items-center justify-center border border-outline-variant">01</div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface mb-1">Warrant Submission</p>
              <p className="text-[10px] text-on-surface-variant">Warrant WR-8829 signed by Court Authority</p>
            </div>
            
            <div className="h-8 w-px md:h-px md:w-full bg-gradient-to-b md:bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20"></div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center w-full max-w-[200px]">
              <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4 relative md:scale-110 shadow-[0_0_20px_rgba(0,242,255,0.15)]">
                <ShieldCheck className="text-primary-fixed-dim" size={32} />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary text-on-primary text-[8px] flex items-center justify-center font-bold">02</div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Proof Verification</p>
              <p className="text-[10px] text-on-surface-variant">ZK-Circuit validates warrant within policy limits</p>
            </div>
            
            <div className="h-8 w-px md:h-px md:w-full bg-gradient-to-b md:bg-gradient-to-r from-primary/20 via-secondary/50 to-secondary/20"></div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center w-full max-w-[200px]">
              <div className="h-12 w-12 rounded-full glass-panel border border-secondary/20 flex items-center justify-center mb-4 relative">
                <LogOut className="text-secondary" size={24} />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-surface-container-highest text-[8px] flex items-center justify-center border border-outline-variant">03</div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface mb-1">Disclosure Trigger</p>
              <p className="text-[10px] text-on-surface-variant">Selective decryption keys released for scoped items</p>
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  );
}
