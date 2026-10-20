import React from 'react';
import { useDealflow } from '../../context/DealflowContext';
import { Target, TrendingUp, Sparkles, ShieldCheck, DollarSign, Activity } from 'lucide-react';
import { formatCurrency } from '../../utils/financialFormulas';

export const MetricRibbon: React.FC = () => {
  const { targets, pipeline, acquirer } = useDealflow();

  // Aggregate Metrics
  const totalTargetEv = targets.reduce((acc, t) => acc + t.valuation.targetEnterpriseValue, 0);
  const totalSynergies = targets.reduce((acc, t) => acc + t.strategicFit.potentialSynergiesRunRateM, 0);
  const activePipelineEv = pipeline.reduce((acc, p) => acc + p.expectedValuationM, 0);
  const avgStrategicScore = (targets.reduce((acc, t) => acc + t.strategicFit.overallScore, 0) / targets.length).toFixed(1);
  const totalDryPowder = acquirer.cashAndEquivalentsM + acquirer.creditFacilityAvailableM;

  const metrics = [
    {
      label: 'Precision Targets Monitored',
      value: targets.length.toString(),
      subtext: 'across 7 key tech sectors',
      icon: <Target size={18} style={{ color: 'var(--accent-cyan)' }} />,
      accentColor: 'var(--accent-cyan)',
    },
    {
      label: 'Monitored Dealflow Universe',
      value: formatCurrency(totalTargetEv),
      subtext: `Avg Multiple: ${(targets.reduce((a, t) => a + t.valuation.evArrMultiple, 0) / targets.length).toFixed(1)}x EV/ARR`,
      icon: <DollarSign size={18} style={{ color: 'var(--accent-emerald)' }} />,
      accentColor: 'var(--accent-emerald)',
    },
    {
      label: 'Identified Annual Synergies',
      value: formatCurrency(totalSynergies),
      subtext: 'Pre-tax run rate EBITDA value',
      icon: <Sparkles size={18} style={{ color: '#c084fc' }} />,
      accentColor: '#c084fc',
    },
    {
      label: 'Active Pipeline Underwriting',
      value: `${pipeline.length} Deals`,
      subtext: `${formatCurrency(activePipelineEv)} committed pipeline`,
      icon: <Activity size={18} style={{ color: 'var(--accent-amber)' }} />,
      accentColor: 'var(--accent-amber)',
    },
    {
      label: 'Mean Strategic Fit Score',
      value: `${avgStrategicScore}/100`,
      subtext: 'Proprietary thesis alignment',
      icon: <ShieldCheck size={18} style={{ color: '#38bdf8' }} />,
      accentColor: '#38bdf8',
    },
    {
      label: 'Acquirer M&A Firepower',
      value: formatCurrency(totalDryPowder),
      subtext: `$${acquirer.cashAndEquivalentsM}M cash + $${acquirer.creditFacilityAvailableM}M facility`,
      icon: <TrendingUp size={18} style={{ color: 'var(--accent-emerald)' }} />,
      accentColor: 'var(--accent-emerald)',
    },
  ];

  return (
    <div style={{
      maxWidth: '1600px',
      margin: '20px auto 0 auto',
      padding: '0 24px',
      width: '100%',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
      }}>
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {m.label}
              </span>
              <div style={{
                padding: '6px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {m.icon}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}>
                {m.value}
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--text-subtle)',
                marginTop: '4px',
              }}>
                {m.subtext}
              </div>
            </div>

            {/* Subtle glow accent line */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent 0%, ${m.accentColor} 50%, transparent 100%)`,
              opacity: 0.6,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
};
