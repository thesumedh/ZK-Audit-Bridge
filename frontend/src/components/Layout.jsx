import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, EyeOff, Terminal, Map as MapIcon, Award,
  Shield, Bell, Menu, Lock, Globe, Wallet, AlertCircle,
  Loader2, BookOpen, Zap
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const TopNavBar = ({ onMenuToggle }) => {
  const { walletAddress, isConnecting, isWalletAvailable, connectionError, networkId, connectWallet, disconnectWallet } = useWallet();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-slate-950/80 backdrop-blur-xl shadow-[0_0_20px_rgba(0,242,255,0.08)]">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-cyan-400" onClick={onMenuToggle}>
          <Menu size={24} />
        </button>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tighter text-cyan-400 font-headline">ZK-Audit</span>
          <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-primary/20 text-primary/70">
            {networkId}
          </span>
        </div>
      </div>
      
      <nav className="hidden md:flex gap-8 items-center">
        {[
          { to: '/',                    label: 'Dashboard' },
          { to: '/audit-bridge',        label: 'Audit Bridge' },
          { to: '/warrant-verification',label: 'Verification' },
          { to: '/history',             label: 'History' },
          { to: '/how-it-works',        label: 'Docs' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `font-space-grotesk tracking-tight text-sm transition-colors ${
                isActive ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 pb-1' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/60 border border-slate-800">
          <div className={`w-1.5 h-1.5 rounded-full ${isWalletAvailable ? 'bg-primary animate-pulse' : 'bg-slate-600'}`}></div>
          <span className="text-[9px] font-mono text-slate-500 uppercase">
            {isWalletAvailable ? 'Lace Ready' : 'No Extension'}
          </span>
        </div>

        <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-300 relative">
          <Bell className="text-cyan-400" size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
        </button>
        
        {walletAddress ? (
          <button
            onClick={disconnectWallet}
            title="Click to disconnect"
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-md hover:bg-error/10 hover:border-error/20 hover:text-error transition-colors group"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse group-hover:bg-error transition-colors"></div>
            <span className="text-xs font-mono font-bold text-primary group-hover:text-error transition-colors">{walletAddress}</span>
          </button>
        ) : connectionError ? (
          <button
            onClick={connectWallet}
            title={connectionError}
            className="flex items-center gap-2 px-3 py-1.5 bg-error/10 border border-error/30 text-error rounded-md hover:bg-error/20 transition-colors text-xs font-bold"
          >
            <AlertCircle size={13} />
            Retry Connect
          </button>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? <Loader2 size={13} className="animate-spin" /> : <Wallet size={13} />}
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </header>
  );
};

const SideNavBar = ({ isMobileOpen, onClose }) => {
  const navigate = useNavigate();
  const { walletAddress, connectWallet } = useWallet();

  const handleRequestZKProof = () => {
    onClose();
    navigate('/audit-bridge');
  };

  const navItems = [
    { to: '/audit-bridge',         label: 'Warrant Queue',    Icon: Shield,    end: false },
    { to: '/audit-bridge',         label: 'Active Scopes',    Icon: EyeOff,    end: false },
    { to: '/agent-logs',           label: 'Agent Logs',       Icon: Terminal,  end: false },
    { to: '/compliance-map',       label: 'Compliance Map',   Icon: MapIcon,   end: false },
    { to: '/history',              label: 'Archived Proofs',  Icon: Award,     end: false },
  ];

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed left-0 top-0 h-full flex flex-col pt-20 bg-slate-950 w-64 border-r border-slate-800 z-40 transform transition-transform duration-300 md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-6 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-primary/20">
              <ShieldCheck className="text-primary-container" size={24} />
            </div>
            <div>
              <h3 className="text-cyan-400 font-bold text-sm leading-tight">AI Auditor Agent</h3>
              <p className="text-slate-500 font-mono tracking-wide text-[10px] uppercase">V.2.0.4-Midnight</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-3 tracking-[0.2em]">Queue Management</span>
          </div>

          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={label}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 transition-all text-xs uppercase font-inter tracking-wide ${
                  isActive && to !== '/audit-bridge'
                    ? 'bg-slate-900 text-cyan-400 border-r-2 border-cyan-400'
                    : label === 'Warrant Queue' && window.location.pathname === '/audit-bridge'
                    ? 'bg-slate-900 text-cyan-400 border-r-2 border-cyan-400'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/80'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

          <div className="px-3 mt-6 mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-3 tracking-[0.2em]">Learn</span>
          </div>
          <NavLink
            to="/how-it-works"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-xs uppercase font-inter tracking-wide transition-all ${
                isActive ? 'bg-slate-900 text-cyan-400 border-r-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/80'
              }`
            }
          >
            <BookOpen size={18} />
            <span>How It Works</span>
          </NavLink>
        </nav>

        <div className="p-6 space-y-3">
          {!walletAddress && (
            <button
              onClick={connectWallet}
              className="w-full py-2.5 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
            >
              <Wallet size={13} />
              Connect Wallet First
            </button>
          )}
          <button
            onClick={handleRequestZKProof}
            className="w-full py-3 bg-gradient-to-br from-primary-container to-primary-fixed-dim text-on-primary font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform hover:shadow-cyan-500/40 flex items-center justify-center gap-2"
          >
            <Zap size={14} />
            Request ZK Proof
          </button>
        </div>
      </aside>
    </>
  );
};

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <TopNavBar onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <SideNavBar isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <main className="md:ml-64 pt-24 px-4 sm:px-6 md:px-8 pb-20 min-h-screen">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800/50">
        <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center justify-center ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
          <Shield size={20} /><span className="text-[9px] mt-1 uppercase font-bold">Home</span>
        </NavLink>
        <NavLink to="/audit-bridge" className={({ isActive }) => `flex flex-col items-center justify-center ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
          <Lock size={20} /><span className="text-[9px] mt-1 uppercase font-bold">Bridge</span>
        </NavLink>
        <NavLink to="/how-it-works" className={({ isActive }) => `flex flex-col items-center justify-center ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
          <BookOpen size={20} /><span className="text-[9px] mt-1 uppercase font-bold">Docs</span>
        </NavLink>
      </nav>

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-900/10 blur-[150px] rounded-full"></div>
      </div>
    </div>
  );
}
