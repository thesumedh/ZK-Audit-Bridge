import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Download, RefreshCw } from 'lucide-react';

const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };

const LOG_TEMPLATES = [
  { level: 'INFO',  color: 'text-primary',   msgs: ['ZK-SNARK circuit loaded', 'Indexer connection established', 'Agent heartbeat OK', 'Proof cache refreshed', 'Token balance synced'] },
  { level: 'AUDIT', color: 'text-secondary',  msgs: ['Warrant WNT-092-ALPHA received', 'Policy hash validated', 'Disclosure window opened', 'Scope boundary enforced', 'ZK proof submitted'] },
  { level: 'WARN',  color: 'text-yellow-400', msgs: ['Anomaly score elevated', 'Batch size near threshold', 'Peer latency degraded', 'Re-syncing with indexer...'] },
  { level: 'ERROR', color: 'text-error',      msgs: ['Circuit timeout — retrying', 'Proof server unreachable', 'Invalid witness format'] },
];

function makeLog() {
  const tpl = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
  const msg = tpl.msgs[Math.floor(Math.random() * tpl.msgs.length)];
  const ts  = new Date().toISOString().replace('T', ' ').substring(0, 23);
  return { id: Date.now() + Math.random(), level: tpl.level, color: tpl.color, msg, ts };
}

export default function AgentLogs() {
  const [logs, setLogs] = useState(() => Array.from({ length: 14 }, makeLog).sort((a,b) => a.id - b.id));
  const [paused, setPaused] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    const iv = setInterval(() => {
      setLogs(prev => [...prev.slice(-80), makeLog()]);
    }, 1800);
    return () => clearInterval(iv);
  }, [paused]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const downloadLogs = () => {
    const text = logs.map(l => `[${l.ts}] [${l.level}] ${l.msg}`).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = `zk-audit-agent-logs-${Date.now()}.txt`;
    a.click();
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.4 }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tighter">Agent Logs</h1>
          <p className="text-on-surface-variant text-sm mt-1">Live output from the AI Auditor Agent process</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setPaused(p => !p)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-colors ${paused ? 'bg-primary/10 border-primary/30 text-primary' : 'border-slate-700 text-slate-400 hover:text-slate-200'}`}>
            <RefreshCw size={13} className={paused ? '' : 'animate-spin'} />
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button onClick={downloadLogs} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-widest transition-colors">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      <div className="bg-slate-950 rounded-xl border border-slate-800 p-0 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-900/50">
          <div className="w-3 h-3 rounded-full bg-error/60"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400/60"></div>
          <div className="w-3 h-3 rounded-full bg-primary/60"></div>
          <span className="ml-3 text-[10px] font-mono text-slate-500">zk-audit-agent · pid 9823</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${paused ? 'bg-yellow-400' : 'bg-primary animate-pulse'}`}></div>
            <span className="text-[9px] font-mono text-slate-500">{paused ? 'PAUSED' : 'LIVE'}</span>
          </div>
        </div>

        <div className="h-[520px] overflow-y-auto p-5 font-mono text-xs space-y-1.5">
          {logs.map(l => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 leading-relaxed"
            >
              <span className="text-slate-600 flex-shrink-0 select-none">{l.ts}</span>
              <span className={`font-bold w-14 flex-shrink-0 ${l.color}`}>[{l.level}]</span>
              <span className="text-slate-300">{l.msg}</span>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </motion.div>
  );
}
