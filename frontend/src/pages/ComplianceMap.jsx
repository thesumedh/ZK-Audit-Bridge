import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, CheckCircle2, XCircle, Clock } from 'lucide-react';

const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };

const JURISDICTIONS = [
  { id: 'US',  name: 'United States',      status: 'compliant', frameworks: ['FinCEN AML/KYC', 'SEC Rule 17a-4', 'BSA'],             risk: 'Low',    audits: 142 },
  { id: 'EU',  name: 'European Union',      status: 'compliant', frameworks: ['MiCA Regulation', 'GDPR Art.17', 'AMLD6'],             risk: 'Low',    audits: 98 },
  { id: 'UK',  name: 'United Kingdom',      status: 'review',    frameworks: ['FCA PS21/19', 'MLR 2017'],                             risk: 'Medium', audits: 34 },
  { id: 'SG',  name: 'Singapore',           status: 'compliant', frameworks: ['MAS PSA', 'FATF Travel Rule'],                         risk: 'Low',    audits: 57 },
  { id: 'AE',  name: 'UAE / ADGM',         status: 'compliant', frameworks: ['VARA Framework', 'FSRA CryptoFA'],                      risk: 'Low',    audits: 21 },
  { id: 'JP',  name: 'Japan',               status: 'pending',   frameworks: ['FSA JVCEA', 'Payment Services Act'],                   risk: 'Medium', audits: 12 },
  { id: 'CH',  name: 'Switzerland',         status: 'compliant', frameworks: ['FINMA Guidelines', 'AMLA'],                            risk: 'Low',    audits: 76 },
  { id: 'AU',  name: 'Australia',           status: 'review',    frameworks: ['AUSTRAC DCE', 'ASIC RG 271'],                         risk: 'Medium', audits: 19 },
  { id: 'CA',  name: 'Canada',              status: 'compliant', frameworks: ['FINTRAC PCMLTFA', 'CSA Staff Notice 21-327'],         risk: 'Low',    audits: 44 },
  { id: 'BR',  name: 'Brazil',              status: 'pending',   frameworks: ['BCB Resolution 4,893/21', 'CVM Instruction 626'],      risk: 'High',   audits: 8 },
  { id: 'IN',  name: 'India',               status: 'non-compliant', frameworks: ['VDA TDS Rules', 'PMLA Amendment 2023'],           risk: 'High',   audits: 3 },
  { id: 'KR',  name: 'South Korea',        status: 'compliant', frameworks: ['VASP Act', 'FATF Korea Implementation'],               risk: 'Low',    audits: 31 },
];

const STATUS_CONFIG = {
  compliant:      { icon: CheckCircle2, color: 'text-primary',      bg: 'bg-primary/10 border-primary/20',   label: 'COMPLIANT' },
  review:         { icon: Clock,        color: 'text-yellow-400',    bg: 'bg-yellow-400/10 border-yellow-400/20', label: 'UNDER REVIEW' },
  pending:        { icon: Clock,        color: 'text-slate-400',     bg: 'bg-slate-700/30 border-slate-600/30',  label: 'PENDING' },
  'non-compliant':{ icon: XCircle,      color: 'text-error',         bg: 'bg-error/10 border-error/20',       label: 'NON-COMPLIANT' },
};

const RISK_COLOR = { Low: 'text-primary', Medium: 'text-yellow-400', High: 'text-error' };

export default function ComplianceMap() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? JURISDICTIONS : JURISDICTIONS.filter(j => j.status === filter);
  const jur = selected ? JURISDICTIONS.find(j => j.id === selected) : null;

  const counts = {
    compliant: JURISDICTIONS.filter(j => j.status === 'compliant').length,
    review:    JURISDICTIONS.filter(j => j.status === 'review').length,
    pending:   JURISDICTIONS.filter(j => j.status === 'pending').length,
    fail:      JURISDICTIONS.filter(j => j.status === 'non-compliant').length,
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.4 }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tighter">Compliance Map</h1>
          <p className="text-on-surface-variant text-sm mt-1">Global regulatory compliance status across {JURISDICTIONS.length} jurisdictions</p>
        </div>
        {/* Summary Pills */}
        <div className="hidden md:flex gap-3">
          {[
            { label: 'Compliant', count: counts.compliant, color: 'text-primary border-primary/30' },
            { label: 'Review',    count: counts.review,    color: 'text-yellow-400 border-yellow-400/30' },
            { label: 'Pending',   count: counts.pending,   color: 'text-slate-400 border-slate-600' },
            { label: 'Failed',    count: counts.fail,      color: 'text-error border-error/30' },
          ].map(s => (
            <div key={s.label} className={`px-3 py-1.5 rounded border text-xs font-bold ${s.color}`}>
              {s.count} {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'compliant', 'review', 'pending', 'non-compliant'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border ${
              filter === f
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Grid */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map(j => {
            const cfg = STATUS_CONFIG[j.status];
            const Icon = cfg.icon;
            return (
              <motion.button
                key={j.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(selected === j.id ? null : j.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selected === j.id
                    ? 'bg-surface-container-high border-primary'
                    : 'bg-surface-container-low border-outline-variant/10 hover:border-outline-variant/30'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg font-bold text-on-surface">{j.id}</span>
                  <Icon size={16} className={cfg.color} />
                </div>
                <p className="text-xs text-on-surface-variant leading-tight">{j.name}</p>
                <div className={`mt-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border inline-block ${cfg.bg} ${cfg.color}`}>
                  {cfg.label}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="md:col-span-4">
          {jur ? (
            <motion.div
              key={jur.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 sticky top-28"
            >
              <div className="flex items-center gap-3 mb-4">
                <Globe size={24} className="text-primary" />
                <div>
                  <h3 className="font-headline font-bold text-on-surface">{jur.name}</h3>
                  <p className="text-[10px] font-mono text-on-surface-variant">{jur.id} Jurisdiction</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-2">Status</p>
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-bold ${STATUS_CONFIG[jur.status].bg} ${STATUS_CONFIG[jur.status].color}`}>
                    {STATUS_CONFIG[jur.status].label}
                  </div>
                </div>

                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-2">Risk Level</p>
                  <p className={`text-sm font-bold ${RISK_COLOR[jur.risk]}`}>{jur.risk}</p>
                </div>

                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-2">Regulatory Frameworks</p>
                  <div className="space-y-1.5">
                    {jur.frameworks.map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs">
                        <Shield size={10} className="text-primary flex-shrink-0" />
                        <span className="text-on-surface-variant">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">ZK Audits Logged</p>
                  <p className="text-2xl font-headline font-bold text-primary">{jur.audits}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 border-dashed text-center">
              <Globe size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Select a jurisdiction to view details</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
