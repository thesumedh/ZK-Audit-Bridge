import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AuditBridge from './pages/AuditBridge';
import WarrantVerification from './pages/WarrantVerification';
import History from './pages/History';
import AgentLogs from './pages/AgentLogs';
import ComplianceMap from './pages/ComplianceMap';
import HowItWorks from './pages/HowItWorks';
import { ToastProvider } from './context/ToastContext';
import { WalletProvider } from './context/WalletContext';
import { AppContextProvider } from './context/AppContext';

function App() {
  return (
    // Toast MUST be outermost — WalletContext and AppContext both call useToast()
    <ToastProvider>
      <WalletProvider>
        <AppContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="audit-bridge" element={<AuditBridge />} />
                <Route path="warrant-verification" element={<WarrantVerification />} />
                <Route path="history" element={<History />} />
                <Route path="agent-logs" element={<AgentLogs />} />
                <Route path="compliance-map" element={<ComplianceMap />} />
                <Route path="how-it-works" element={<HowItWorks />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </WalletProvider>
    </ToastProvider>
  );
}

export default App;
