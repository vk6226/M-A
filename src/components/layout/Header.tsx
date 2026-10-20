import React from 'react';
import { useDealflow, AppView } from '../../context/DealflowContext';
import { 
  Radar, 
  Search, 
  GitPullRequest, 
  Columns3, 
  Scale, 
  Cloud, 
  Download, 
  Building2, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { exportTargetsCsv } from '../../utils/exportUtils';

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    pipeline, 
    compareTargets, 
    targets, 
    acquirer,
    showToast 
  } = useDealflow();

  const handleExportCsv = () => {
    exportTargetsCsv(targets);
    showToast('success', 'CSV Export Complete', `Exported ${targets.length} targets with full financial intelligence metrics.`);
  };

  const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: <Radar size={16} /> },
    { id: 'screener', label: 'Target Screener', icon: <Search size={16} />, badge: targets.length },
    { id: 'pipeline', label: 'Deal Pipeline', icon: <Columns3 size={16} />, badge: pipeline.length },
    { id: 'compare', label: 'Head-to-Head', icon: <Scale size={16} />, badge: compareTargets.length > 0 ? compareTargets.length : undefined },
    { id: 'aws-guide', label: 'AWS Cloud Hosting', icon: <Cloud size={16} />, badge: 'Deploy' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 13, 22, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Top Banner: Acquirer Mandate Bar */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '5px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
              display: 'inline-block'
            }}></span>
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>AURA Radar Active</span>
            <span style={{ color: 'var(--text-subtle)' }}>|</span>
            <span>Real-time proprietary deal origination & synergy engine</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={13} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{acquirer.name}</span>
            <span style={{ color: 'var(--text-subtle)' }}>({acquirer.shortCode})</span>
          </div>
          <span style={{ color: 'var(--text-subtle)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Available War Chest:</span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              ${acquirer.cashAndEquivalentsM + acquirer.creditFacilityAvailableM}M
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
      }}>
        {/* Brand / Logo */}
        <div 
          onClick={() => setCurrentView('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
          }}>
            <Radar size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}>
                AURA <span style={{ color: 'var(--accent-cyan)' }}>M&A</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                padding: '2px 5px',
                borderRadius: '4px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                fontWeight: 700,
              }}>
                PRO v3.4
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 500 }}>
              Precision Target Discovery & Intelligence Platform
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                id={`nav-btn-${item.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)' : 'transparent',
                  border: isActive ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <span style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-subtle)' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    background: isActive ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
                    color: isActive ? '#090d16' : 'var(--text-muted)',
                    fontWeight: 700,
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleExportCsv}
            id="btn-export-csv"
            className="btn btn-secondary btn-sm"
            title="Export M&A Target Dataset to CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setCurrentView('aws-guide')}
            id="btn-deploy-aws-top"
            className="btn btn-primary btn-sm"
          >
            <Cloud size={14} />
            <span>Host on AWS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
