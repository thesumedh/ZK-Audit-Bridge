import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Radio, Server, Zap } from 'lucide-react';
import { MidnightClient } from '../midnight-sdk/client';

export default function LiveNetworkStatus() {
  const [network, setNetwork]       = useState(null);
  const [proofSrv, setProofSrv]     = useState(null);
  const [ledger, setLedger]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = async () => {
    const [netStatus, proofHealth, ledgerState] = await Promise.all([
      MidnightClient.getNetworkStatus(),
      MidnightClient.getProofServerHealth(),
      MidnightClient.getLedgerState(),
    ]);
    setNetwork(netStatus);
    setProofSrv(proofHealth);
    if (ledgerState) setLedger(ledgerState);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15_000);
    return () => clearInterval(interval);
  }, []);

  const isLive    = network?.live === true;
  const hasLedger = !!ledger;

  return (
    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio size={13} className={isLive ? 'text-primary' : 'text-slate-600'} />
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Midnight Preprod
          </span>
        </div>
        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
          loading
            ? 'text-slate-600 border-slate-800'
            : isLive
              ? 'text-primary border-primary/30 bg-primary/5'
              : 'text-slate-500 border-slate-700 bg-slate-900'
        }`}>
          {loading ? 'POLLING…' : isLive ? 'INDEXER LIVE' : 'OFFLINE'}
        </span>
      </div>

      {/* Service Status Row */}
      <div className="grid grid-cols-2 gap-2">
        {/* Indexer */}
        <div className="flex items-center gap-2 p-2.5 bg-surface-container-lowest rounded-lg">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isLive ? 'bg-primary animate-pulse' : 'bg-slate-600'}`}></div>
          <div>
            <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Indexer</p>
            <p className={`text-[10px] font-mono ${isLive ? 'text-primary' : 'text-slate-600'}`}>
              {isLive && network?.blockHeight
                ? `#${Number(network.blockHeight).toLocaleString()}`
                : isLive ? 'OK' : 'N/A'}
            </p>
          </div>
        </div>

        {/* Proof Server */}
        <div className="flex items-center gap-2 p-2.5 bg-surface-container-lowest rounded-lg">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${proofSrv?.ok ? 'bg-primary animate-pulse' : 'bg-slate-600'}`}></div>
          <div>
            <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Proof Server</p>
            <p className={`text-[10px] font-mono ${proofSrv?.ok ? 'text-primary' : 'text-slate-600'}`}>
              {proofSrv?.ok ? 'Remote OK' : loading ? '…' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Contract / Ledger section */}
      {hasLedger ? (
        <motion.div
          key="ledger"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">On-chain Ledger</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Audit Count',    value: ledger.audit_count?.toString(), highlight: true },
              { label: 'Status',         value: ledger.compliance_status },
              { label: 'Latest Warrant', value: ledger.latest_warrant_id },
              { label: 'Proof Hash',     value: ledger.latest_proof_hash },
            ].map(item => (
              <div key={item.label} className="p-2.5 bg-surface-container-highest/20 rounded-lg">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">{item.label}</p>
                <p className={`text-[11px] font-mono truncate ${item.highlight ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                  {item.value || '—'}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="p-3 rounded-lg border border-dashed border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Server size={11} className="text-slate-600" />
            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Contract</p>
          </div>
          {MidnightClient.isDeployed ? (
            <p className="text-[10px] font-mono text-primary truncate">{MidnightClient.contractAddress}</p>
          ) : (
            <p className="text-[10px] font-mono text-slate-600 italic">
              {"Awaiting compile → deploy"}
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="pt-1 border-t border-slate-800/50 flex justify-between items-center">
        <p className="text-[9px] font-mono text-slate-700">
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading…'}
        </p>
        <a
          href="https://explorer.preprod.midnight.network"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[9px] font-mono text-slate-600 hover:text-primary transition-colors"
        >
          Explorer <ExternalLink size={9} />
        </a>
      </div>
    </div>
  );
}
