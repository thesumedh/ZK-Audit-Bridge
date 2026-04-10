import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Link as LinkIcon, History, AlertTriangle, Eye, ChevronRight, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import LiveNetworkStatus from '../components/LiveNetworkStatus';

const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

// Clamped gauge: anomaly 0‑0.15 → 0-100%
function AnomalyGauge({ score }) {
  const SIZE = 220;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R_OUTER = 90;
  const R_INNER = 70;
  const STROKE = 6;

  // circumference
  const circOuter = 2 * Math.PI * R_OUTER;
  const circInner = 2 * Math.PI * R_INNER;

  // clamp 0-0.15 → 0-1
  const pct = Math.min(1, Math.max(0, score / 0.15));

  const outerOffset = circOuter * (1 - pct);
  const innerOffset = circInner * (1 - pct * 0.65);

  const color = pct > 0.7 ? '#ffb4ab' : pct > 0.4 ? '#fed83a' : '#00dbe7';

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} className="transform -rotate-90 absolute inset-0">
        {/* Track rings */}
        <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="#1e2330" strokeWidth={STROKE} />
        <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="#1e2330" strokeWidth={STROKE} />
        {/* Live rings */}
        <circle
          cx={CX} cy={CY} r={R_OUTER} fill="none"
          stroke={color} strokeWidth={STROKE}
          strokeDasharray={circOuter}
          strokeDashoffset={outerOffset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dashoffset 0.6s ease, stroke 0.6s ease' }}
        />
        <circle
          cx={CX} cy={CY} r={R_INNER} fill="none"
          stroke="#dcb8ff" strokeWidth={STROKE - 2}
          strokeDasharray={circInner}
          strokeDashoffset={innerOffset}
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 4px rgba(220,184,255,0.6))', transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      {/* Centered label — always inside the inner circle */}
      <div className="flex flex-col items-center justify-center z-10 pointer-events-none" style={{ width: R_INNER * 1.5 }}>
        <span
          className="font-headline font-bold leading-none text-center"
          style={{ fontSize: 34, color, transition: 'color 0.6s ease' }}
        >
          {score.toFixed(3)}
        </span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 text-center">
          Anomaly Score
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { anomalyScore, activePeers, complianceRate, zkSignals, activeScopes } = useAppContext();
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const navigate = useNavigate();

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-headline font-bold text-primary tracking-tighter leading-none">
            Compliance Dashboard
          </h1>
          <p className="text-on-surface-variant mt-2 font-inter text-sm max-w-lg">
            Autonomous auditing via zero-knowledge proofs. Confidential state integrity:{' '}
            <span className="text-secondary font-bold">100% SECURE</span>
          </p>
        </div>
        <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full border border-outline-variant/15">
          <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#dcb8ff] animate-pulse"></div>
          <span className="text-[10px] uppercase font-bold tracking-[0.1em] text-secondary">Midnight Network Active</span>
          <Shield className="text-secondary" size={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Intelligence Overview */}
        <section className="md:col-span-8 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-xl font-headline font-bold text-on-surface">Intelligence Overview</h2>
            <span className="text-xs font-mono text-primary-fixed-dim opacity-70">NODE_ID: 9823-AUDIT-AI</span>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
            {/* Fixed Gauge */}
            <div className="flex-shrink-0">
              <AnomalyGauge score={anomalyScore} />
            </div>

            {/* Metrics */}
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              {[
                { label: 'DEX Integrity',  value: `${complianceRate}%`, progress: complianceRate / 100 },
                { label: 'Bridge Latency', value: '12ms',               progress: 0.25 },
                { label: 'ZK Proof Gen',   value: '0.8s',               progress: 0.33 },
                { label: 'Active Peers',   value: activePeers.toLocaleString(), progress: Math.min(1, activePeers / 2000) },
              ].map((m, i) => (
                <div key={i} className="bg-surface-container-highest/30 p-4 rounded-lg border border-outline-variant/5 hover:bg-surface-container-highest/50 transition-colors">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{m.label}</p>
                  <p className="text-2xl font-headline text-on-surface">{m.value}</p>
                  <div className="w-full bg-slate-900 h-1 mt-2 rounded-full overflow-hidden">
                    <motion.div
                      key={m.value}
                      initial={{ width: 0 }}
                      animate={{ width: `${m.progress * 100}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ZK Signals */}
        <section className="md:col-span-4 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 flex flex-col">
          <h2 className="text-lg font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
            <LinkIcon className="text-primary" size={20} />
            ZK Signals
          </h2>
          <div className="space-y-4 flex-1">
            <AnimatePresence>
              {zkSignals.map((sig) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={sig.id}
                  className={`p-4 bg-surface-container-lowest border-l-2 ${sig.accent}/40 rounded-r-lg hover:bg-surface-bright transition-all cursor-pointer`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-on-surface tracking-tight">{sig.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary-container uppercase font-bold border border-primary/20">Verified</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-mono">HASH: {sig.hash}</p>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{sig.desc}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button
            onClick={() => navigate('/audit-bridge')}
            className="mt-6 text-[10px] font-bold uppercase tracking-widest text-primary-fixed-dim hover:text-primary transition-colors text-center w-full"
          >
            View All Real-time Signals →
          </button>
        </section>

        {/* Active Warrant Scopes */}
        <section className="md:col-span-12 lg:col-span-7 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-headline font-bold text-on-surface">Active Warrant Scopes</h2>
              <p className="text-xs text-on-surface-variant mt-1">Time-bound selective disclosure windows</p>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <History size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{activeScopes.length} Active</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  <th className="pb-2 font-bold px-4">Entity Scoped</th>
                  <th className="pb-2 font-bold">Warrant ID</th>
                  <th className="pb-2 font-bold">Time Remaining</th>
                  <th className="pb-2 font-bold text-right px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {activeScopes.map((scope) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={scope.id}
                      className="bg-surface-container-lowest hover:bg-surface-bright transition-colors cursor-pointer"
                      onClick={() => navigate('/audit-bridge')}
                    >
                      <td className={`py-4 px-4 rounded-l-lg border-l-2 ${scope.color}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                            <span className={`${scope.text} font-mono font-bold text-xs`}>{scope.initial}</span>
                          </div>
                          <span className="text-sm font-bold truncate max-w-[120px]">{scope.entity}</span>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-mono text-on-surface-variant">{scope.id}</td>
                      <td className="py-4">
                        <span className={`text-xs font-bold font-mono ${scope.text}`}>{scope.time}</span>
                      </td>
                      <td className="py-4 px-4 text-right rounded-r-lg">
                        <span className={`text-[10px] font-bold uppercase ${scope.text}`}>{scope.status}</span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {activeScopes.length === 0 && (
              <div className="text-center py-6 text-on-surface-variant text-sm border border-dashed border-outline-variant/30 rounded-lg">
                No active scopes — authorize a warrant to begin
              </div>
            )}
          </div>
        </section>

        {/* Alerts + Network */}
        <section className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
          <AnimatePresence>
            {isAlertVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 border-t-4 border-t-error"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center text-error border border-error/30">
                    <AlertTriangle size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-error bg-error/10 px-2 py-1 rounded">Critical Alert</span>
                </div>
                <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Non-Deterministic State Shift</h3>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                  System has detected a state inconsistency in Contract 0x889... which cannot be resolved via public headers. High confidence of compliance violation.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => { setIsAlertVisible(false); navigate('/audit-bridge'); }}
                    className="w-full py-4 bg-error text-on-error font-bold text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-error/90"
                  >
                    Review &amp; Request Warrant
                  </button>
                  <button
                    onClick={() => setIsAlertVisible(false)}
                    className="w-full py-4 glass-panel border border-outline-variant/20 text-on-surface font-bold text-xs uppercase tracking-widest rounded-lg active:scale-95 transition-transform hover:bg-surface-bright"
                  >
                    Dismiss False Positive
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How It Works teaser */}
          <div
            className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 flex items-center justify-between group hover:bg-surface-bright transition-colors cursor-pointer"
            onClick={() => navigate('/how-it-works')}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <BookOpen className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">How ZK-Audit Works</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">Plain-Language Guide</p>
              </div>
            </div>
            <ChevronRight className="text-slate-600 group-hover:text-primary transition-colors" size={24} />
          </div>

          <LiveNetworkStatus />
        </section>
      </div>
    </motion.div>
  );
}
