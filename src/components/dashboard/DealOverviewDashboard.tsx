import React from 'react';
import { useDealflow } from '../../context/DealflowContext';
import { TargetCard } from '../screener/TargetCard';
import { MetricRibbon } from '../layout/MetricRibbon';
import { formatCurrency, formatPercent } from '../../utils/financialFormulas';
import { 
  Radar, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  Building2, 
  Compass, 
  AlertCircle,
  Cloud 
} from 'lucide-react';

export const DealOverviewDashboard: React.FC = () => {
  const { targets, acquirer, setCurrentView, setSelectedTarget } = useDealflow();

  // Sort targets by strategic fit score
  const topFitTargets = [...targets]
    .sort((a, b) => b.strategicFit.overallScore - a.strategicFit.overallScore)
    .slice(0, 3);

  // Group by sector
  const sectorCounts: { [key: string]: { count: number; totalEv: number } } = {};
  targets.forEach((t) => {
    if (!sectorCounts[t.sector]) {
      sectorCounts[t.sector] = { count: 0, totalEv: 0 };
    }
    sectorCounts[t.sector].count += 1;
    sectorCounts[t.sector].totalEv += t.valuation.targetEnterpriseValue;
  });

  const strategicSignals = [
    {
      type: 'signal',
      badge: 'Ownership Event',
      badgeClass: 'badge-emerald',
      title: 'Aegis Sentinel (Project Cerberus) series lead investor seeking liquidity',
      time: '2 hours ago',
      impact: 'Opportunity for negotiated bilateral transaction prior to broad auction process.',
    },
    {
      type: 'regulatory',
      badge: 'Antitrust Clearance',
      badgeClass: 'badge-cyan',
      title: 'FTC & DOJ Hart-Scott-Rodino 2026 threshold adjustment published',
      time: 'Yesterday',
      impact: 'Transactions below $126.9M qualify for expedited closing clearance.',
    },
    {
      type: 'macro',
      badge: 'Multiple Compression',
      badgeClass: 'badge-purple',
      title: 'B2B Cyber Infrastructure public multiples expanded to 9.8x EV/ARR',
      time: '2 days ago',
      impact: 'Reinforces favorable entry valuation for Project Vulcan and Bastion.',
    },
    {
      type: 'ip',
      badge: 'Patent Grant',
      badgeClass: 'badge-amber',
      title: 'QuantumKey Cryptography granted critical PQC lattice patent by USPTO',
      time: '3 days ago',
      impact: 'Strengthens IP defensive moat ahead of federal 2030 crypto-agility mandate.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', paddingBottom: '40px' }}>
      {/* Metric Ribbon */}
      <MetricRibbon />

      {/* Main Content Area */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        {/* Top Hero Card: Acquirer Thesis & Firepower */}
        <div
          className="glass-panel"
          style={{
            padding: '24px 28px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(11, 17, 32, 0.98) 100%)',
            border: '1px solid var(--border-accent)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '900px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className="badge badge-cyan">Inorganic Growth Radar</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>•</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>M&A Investment Thesis v2026.4</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
                {acquirer.name} Precision M&A Mandate
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                {acquirer.strategicMandate}
              </p>
            </div>

            {/* Quick stats box */}
            <div style={{
              background: '#0b1120',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              minWidth: '240px',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                Group Dry Powder
              </div>
              <div style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'var(--accent-emerald)',
                fontFamily: 'var(--font-mono)',
                margin: '2px 0 6px 0',
              }}>
                ${acquirer.cashAndEquivalentsM + acquirer.creditFacilityAvailableM}M
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Cash: ${acquirer.cashAndEquivalentsM}M | Facility: ${acquirer.creditFacilityAvailableM}M
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Sector Heatmap & Signals on Left, Top Matches on Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}>
          {/* Sector Radar Heatmap */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Target Sector Heatmap</h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {targets.length} Assets Monitored
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(sectorCounts).map(([sector, data]) => {
                const pctOfTotal = (data.totalEv / targets.reduce((a, b) => a + b.valuation.targetEnterpriseValue, 0)) * 100;
                return (
                  <div key={sector}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{sector}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {data.count} targets ({formatCurrency(data.totalEv)})
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.max(10, pctOfTotal)}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategic Market Signals Ticker */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} style={{ color: 'var(--accent-emerald)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>M&A Market Signals & Intelligence</h3>
              </div>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {strategicSignals.map((signal, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#0b1120',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className={`badge ${signal.badgeClass}`}>{signal.badge}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{signal.time}</span>
                  </div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', margin: '4px 0' }}>
                    {signal.title}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {signal.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Highest-Ranked Strategic Targets */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Top Strategic Fit Acquisition Targets</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Highest-scoring targets ranked by thesis fit, technology stack alignment, and synergy creation potential.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('screener')}
              className="btn btn-secondary btn-sm"
              id="btn-view-all-screener"
            >
              <span>View All 12 Targets</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '20px',
          }}>
            {topFitTargets.map((target) => (
              <TargetCard key={target.id} target={target} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
