import React from 'react';
import { DealflowProvider, useDealflow } from './context/DealflowContext';
import { Header } from './components/layout/Header';
import { DealOverviewDashboard } from './components/dashboard/DealOverviewDashboard';
import { TargetScreener } from './components/screener/TargetScreener';
import { DealPipelineKanban } from './components/pipeline/DealPipelineKanban';
import { HeadToHeadCompare } from './components/compare/HeadToHeadCompare';
import { AwsDeploymentGuide } from './components/aws/AwsDeploymentGuide';
import { TargetDossierModal } from './components/dossier/TargetDossierModal';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, toasts, dismissToast } = useDealflow();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Platform Header */}
      <Header />

      {/* Main View Router */}
      <main style={{ flex: 1, width: '100%' }}>
        {currentView === 'dashboard' && <DealOverviewDashboard />}
        {currentView === 'screener' && <TargetScreener />}
        {currentView === 'pipeline' && <DealPipelineKanban />}
        {currentView === 'compare' && <HeadToHeadCompare />}
        {currentView === 'aws-guide' && <AwsDeploymentGuide />}
      </main>

      {/* Target Deep Dive Modal */}
      <TargetDossierModal />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              {toast.type === 'success' && <CheckCircle2 size={16} color="var(--accent-emerald)" />}
              {toast.type === 'warning' && <AlertTriangle size={16} color="var(--accent-amber)" />}
              {toast.type === 'info' && <Info size={16} color="var(--accent-cyan)" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-subtle)',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Platform Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(9, 13, 22, 0.95)',
        padding: '20px 24px',
        fontSize: '0.75rem',
        color: 'var(--text-subtle)',
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>AURA M&A™ Intelligence Platform</span>
            <span> — Proprietary Target Discovery, Underwriting & Valuation Orchestration</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>AWS Cloud Ready</span>
            <span>•</span>
            <span>SOC2 Type II & FedRAMP Ready Architecture</span>
            <span>•</span>
            <span>Confidential Corporate Finance Underwriting</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <DealflowProvider>
      <MainAppContent />
    </DealflowProvider>
  );
}
