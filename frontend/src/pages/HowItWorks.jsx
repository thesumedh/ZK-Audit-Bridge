import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, Shield, Lock, Eye, Zap, Globe, CheckCircle2 } from 'lucide-react';

const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };

const STEPS = [
  {
    icon: Eye,
    title: 'Step 1 — AI Detects an Anomaly',
    color: 'text-primary',
    border: 'border-primary/30',
    summary: 'The AI Auditor watches all on-chain activity in real time.',
    detail: `The AI Auditor Agent continuously monitors on-chain transactions for unusual patterns — large fund movements, suspicious batch groupings, or protocol deviations. When it spots something unusual, it creates a ZK Signal and flags it on your dashboard. No raw transaction data is exposed at this stage; only a cryptographic fingerprint is generated.`,
  },
  {
    icon: Shield,
    title: 'Step 2 — A Warrant is Issued',
    color: 'text-secondary',
    border: 'border-secondary/30',
    summary: 'A compliance authority submits a time-limited audit warrant.',
    detail: `A regulated compliance authority (e.g., a financial regulator or internal audit team) submits an audit warrant describing what data they need and why — the policy justification is written into the Compact smart contract. The warrant has a strict time window (e.g., 24 hours) after which it automatically expires on-chain. No one can extend it without re-authorizing.`,
  },
  {
    icon: Zap,
    title: 'Step 3 — ZK Proof is Generated',
    color: 'text-yellow-400',
    border: 'border-yellow-400/30',
    summary: 'Your wallet runs a ZK circuit to prove compliance privately.',
    detail: `Your Midnight Lace wallet sends the warrant to the Midnight Proof Server which runs a ZK-SNARK circuit (the "submit_audit_warrant" circuit from the Compact contract). This circuit mathematically proves that the data matches the warrant scope — without ever revealing the underlying data itself. The proof takes ~2-3 seconds and is entirely private. The raw data never leaves your device.`,
  },
  {
    icon: Lock,
    title: 'Step 4 — Warrant is Authorized On-Chain',
    color: 'text-primary',
    border: 'border-primary/30',
    summary: 'The proof is submitted to Midnight blockchain as a transaction.',
    detail: `The generated ZK proof is bundled into a Midnight transaction and sent to the network via the "authorize_disclosure" circuit. Your Midnight Lace wallet signs this transaction. Once mined, the Midnight Indexer records the proof hash as an immutable entry on the shared ledger. The compliance authority now has cryptographic proof that the audit occurred — without seeing any raw data.`,
  },
  {
    icon: Globe,
    title: 'Step 5 — Anyone Can Verify',
    color: 'text-secondary',
    border: 'border-secondary/30',
    summary: 'The proof hash is public and verifiable by anyone.',
    detail: `The proof hash stored on-chain can be independently verified by any third party (auditors, regulators, courts) using the Midnight Verification Flow. They simply paste the hash into our Verification page and the Midnight Indexer confirms: "Yes, this audit occurred, at this block height, under this policy." The underlying data remains completely private. This is the power of zero-knowledge proofs.`,
  },
];

const FAQ = [
  {
    q: 'What is a Zero-Knowledge Proof?',
    a: `A ZK proof lets you prove something is true without revealing WHY it's true. Classic example: you can prove you know a password without typing the password. In ZK-Audit, you prove a transaction matches the audit scope without revealing the transaction amount, sender, or receiver.`,
  },
  {
    q: 'What is the Midnight Network?',
    a: `Midnight is a purpose-built blockchain by Input Output (creators of Cardano) designed specifically for privacy-preserving applications. It uses a special programming language called Compact to write smart contracts that can execute ZK proofs natively. Unlike Ethereum, private data never touches the public chain.`,
  },
  {
    q: 'What is the Midnight Lace wallet?',
    a: `Midnight Lace is the official browser extension wallet for the Midnight Network, similar to MetaMask for Ethereum. It stores your shielded keys, signs ZK transactions, and communicates with Midnight nodes. Download it at midnight.network/lace.`,
  },
  {
    q: 'Is this auditing me without my consent?',
    a: `No. You control everything. A warrant must be submitted and approved — you sign the authorization transaction from your own wallet. The data only becomes selectively disclosed within the exact scope of the warrant, for the exact time window specified. When the warrant expires, access ends automatically on-chain.`,
  },
  {
    q: 'What is "Simulation Mode"?',
    a: `The ZK circuit execution requires a deployed Compact smart contract on the Midnight preprod network. Until the contract is deployed (which requires compiling on Linux/WSL2), the app simulates the 2.5 second proof generation timing and generates placeholder hashes. The wallet connection, block data, and UI flow are all fully real.`,
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-outline-variant/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-bright transition-colors"
      >
        <span className="text-sm font-bold text-on-surface pr-4">{q}</span>
        <ChevronDown size={18} className={`text-slate-500 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-on-surface-variant leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-primary" size={28} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Plain Language Guide</p>
        </div>
        <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tighter leading-tight mb-4">
          How ZK-Audit Works
        </h1>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed">
          ZK-Audit Bridge lets regulators verify your compliance <strong className="text-on-surface">without seeing your data</strong>. 
          Here's exactly how it works — explained simply.
        </p>
      </div>

      {/* The Big Idea */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-8 mb-10">
        <h2 className="text-xl font-headline font-bold text-on-surface mb-3">The Big Idea</h2>
        <p className="text-on-surface-variant leading-relaxed max-w-3xl">
          Imagine you have a bank statement. A regulator asks: "Did you receive more than $500,000 last week?"<br /><br />
          Normally, you'd hand over the whole statement — exposing every transaction.<br /><br />
          With ZK-Audit, you hand over a <span className="text-primary font-semibold">mathematical proof</span> that says "yes" or "no" — and the regulator gets their answer without seeing a single number. That mathematical proof is called a <span className="text-primary font-semibold">zero-knowledge proof (ZK proof)</span>.
        </p>
      </div>

      {/* Step by Step */}
      <h2 className="text-2xl font-headline font-bold text-on-surface mb-6">How It Works — Step by Step</h2>
      <div className="space-y-4 mb-12">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-surface-container-low rounded-xl border ${step.border} p-6`}
          >
            <div className="flex items-start gap-5">
              <div className={`w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 border ${step.border}`}>
                <step.icon size={22} className={step.color} />
              </div>
              <div className="flex-1">
                <h3 className="font-headline font-bold text-on-surface mb-1">{step.title}</h3>
                <p className={`text-xs font-bold mb-3 ${step.color}`}>{step.summary}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{step.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Key Benefits */}
      <h2 className="text-2xl font-headline font-bold text-on-surface mb-6">Why This Matters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[
          { icon: Lock,        title: 'Total Privacy',       desc: 'Underlying data never leaves your device. Regulators only see cryptographic proofs.' },
          { icon: CheckCircle2,title: 'Legally Verifiable', desc: 'On-chain proof hashes are immutable. Courts and regulators can independently verify compliance.' },
          { icon: Zap,         title: 'Instant Verification',desc: 'Proof generation takes seconds. No lawyers, no document exchange, no waiting weeks.' },
        ].map(b => (
          <div key={b.title} className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
            <b.icon size={28} className="text-primary mb-4" />
            <h3 className="font-bold text-on-surface mb-2">{b.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="text-2xl font-headline font-bold text-on-surface mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3 mb-10">
        {FAQ.map(faq => <FAQItem key={faq.q} {...faq} />)}
      </div>

      {/* CTA */}
      <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10 text-center">
        <h3 className="text-xl font-headline font-bold text-on-surface mb-3">Ready to Try It?</h3>
        <p className="text-on-surface-variant mb-6">Connect your Midnight Lace wallet and submit your first audit warrant.</p>
        <a href="/audit-bridge" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-110 active:scale-95 transition-all">
          <Zap size={14} /> Open Audit Bridge
        </a>
      </div>
    </motion.div>
  );
}
