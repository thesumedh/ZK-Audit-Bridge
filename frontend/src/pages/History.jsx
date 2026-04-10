import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Lock, Key, Info, ExternalLink, XCircle } from 'lucide-react';
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

export default function History() {
  const { ledger, verifyHash } = useAppContext();
  
  const [hashInput, setHashInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null); // 'success', 'error', null

  const handleVerify = () => {
    if (!hashInput) return;
    const isValid = verifyHash(hashInput);
    setVerificationResult(isValid ? 'success' : 'error');
    
    // Auto-clear success message after 4s
    setTimeout(() => {
      setVerificationResult(null);
    }, 4000);
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="max-w-[1400px] mx-auto mt-2"
    >
      {/* Header Section */}
      <section className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-primary mb-4">Public Verifier &amp; History</h1>
        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
          A transparent ledger of cryptographic audit proofs. Verify the integrity of any compliance check without exposing underlying private data.
        </p>
      </section>

      {/* Global Compliance Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: CheckCircle2, title: "Verified Audits", value: `${(1200000 + ledger.length).toLocaleString()}+`, desc: "Total conducted globally", color: "primary" },
          { icon: ShieldAlert, title: "Compliance Rate", value: "99.98%", desc: "Adherence to protocol rules", color: "secondary" },
          { icon: Lock, title: "Data Shielded", value: "45.8 PB", desc: "Encrypted state preserved", color: "primary" },
        ].map((stat, i) => (
          <div key={i} className={`bg-surface-container-low p-6 rounded-xl border-l-4 shadow-lg border-${stat.color}`}>
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={`text-${stat.color}`} size={24} />
              <span className={`text-[10px] font-mono text-${stat.color}-fixed-dim tracking-widest uppercase`}>{stat.title}</span>
            </div>
            <div className="font-headline text-4xl font-bold text-on-surface">{stat.value}</div>
            <div className="text-xs text-on-surface-variant mt-1">{stat.desc}</div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Public Audit Ledger */}
        <section className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl overflow-hidden shadow-2xl">
          <div className="px-8 py-6 flex items-center justify-between bg-surface-container">
            <h2 className="font-headline text-xl font-bold text-on-surface">Public Audit Ledger</h2>
            <div className="flex gap-2">
              <span className="bg-primary/10 text-primary-fixed-dim text-[10px] font-bold px-2 py-1 rounded border border-primary/20">LIVE FEED</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-lowest text-on-surface-variant text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4 font-medium">Protocol ID</th>
                  <th className="px-8 py-4 font-medium">Timestamp</th>
                  <th className="px-8 py-4 font-medium">Auditor Agent</th>
                  <th className="px-8 py-4 font-medium text-right">Compliance Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <AnimatePresence>
                  {ledger.map((row) => (
                    <motion.tr 
                      initial={{ opacity: 0, backgroundColor: 'rgba(0, 242, 255, 0.1)' }}
                      animate={{ opacity: 1, backgroundColor: 'transparent' }}
                      transition={{ duration: 1 }}
                      key={row.id} 
                      className="hover:bg-surface-bright/30 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full bg-primary ${row.active ? 'animate-pulse shadow-[0_0_8px_rgba(0,242,255,1)]' : ''}`}></div>
                          <span className="font-mono text-sm text-primary">{row.id}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-on-surface-variant">{row.time}</td>
                      <td className="px-8 py-6 text-sm">V.2.0.4-Midnight</td>
                      <td className="px-8 py-6 text-right">
                        <span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs font-mono text-primary shadow-[0_0_8px_rgba(0,242,255,0.1)] group-hover:shadow-primary/30 transition-shadow">
                          Verified {row.hash}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="px-8 py-4 bg-surface-container-lowest flex justify-center">
            <button className="text-xs uppercase tracking-widest font-bold text-primary-fixed-dim hover:text-primary transition-colors">Load More History</button>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-8">
          {/* Proof Verifier Tool */}
          <div className="bg-surface-container-highest/40 backdrop-blur-xl p-8 rounded-xl flex flex-col justify-between border border-outline-variant/10">
            <div>
              <h3 className="font-headline text-xl font-bold text-primary mb-2 flex items-center gap-2">
                <Key size={24} /> Proof Verifier Tool
              </h3>
              <p className="text-sm text-on-surface-variant mb-6">Input a hash from the Midnight blockchain to verify its cryptographic authenticity.</p>
              <input 
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                className="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary/40 rounded-lg px-4 py-3 text-sm font-mono text-primary-fixed placeholder:text-outline mb-4 transition-all" 
                placeholder="[9a2c..f1]" 
                type="text" 
              />
              
              <AnimatePresence>
                {verificationResult === 'success' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 mb-4 rounded bg-primary/20 border border-primary/40 flex gap-2 items-center text-primary text-sm font-bold">
                    <CheckCircle2 size={16} /> ZK-Snark Verified Successfully!
                  </motion.div>
                )}
                {verificationResult === 'error' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 mb-4 rounded bg-error/20 border border-error/40 flex gap-2 items-center text-error text-sm font-bold">
                    <XCircle size={16} /> Invalid or unrecognized hash.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={handleVerify}
              className="w-full bg-gradient-to-r from-primary-container to-primary-fixed-dim text-on-primary-container font-bold py-3 rounded-md hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <CheckCircle2 size={20} />
              VERIFY PROOF
            </button>
          </div>

          {/* Educational Sidebar */}
          <div className="bg-surface-container-highest p-8 rounded-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Info size={120} />
            </div>
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4">How it Works</h3>
            <div className="space-y-4 text-sm leading-relaxed text-on-surface-variant relative z-10">
              <div className="flex gap-3">
                <span className="text-primary font-bold">01</span>
                <p>Proofs show <span className="text-on-surface font-semibold">that</span> an audit happened successfully.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold">02</span>
                <p>They confirm adherence to specific compliance <span className="text-on-surface font-semibold">rules</span>.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold">03</span>
                <p>Private data remains <span className="text-on-surface font-semibold">never exposed</span> to the public ledger.</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-outline-variant/20 relative z-10">
              <a className="text-xs font-bold text-primary flex items-center gap-1 hover:underline" href="#">
                READ ZK-DOCS
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
