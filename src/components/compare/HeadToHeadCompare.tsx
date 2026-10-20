import React from 'react';
import { useDealflow } from '../../context/DealflowContext';
import { formatCurrency, formatMultiple, formatPercent } from '../../utils/financialFormulas';
import { Scale, X, Plus, Check, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';

export const HeadToHeadCompare: React.FC = () => {
  const { 
    compareTargets, 
    removeFromCompare, 
    clearCompare, 
    setCurrentView, 
    setSelectedTarget,
    addToPipeline,
    pipeline 
  } = useDealflow();

  if (compareTargets.length === 0) {
    return (
      <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Scale size={48} style={{ color: 'var(--accent-cyan)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Comparison Tray is Empty</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', fontSize: '0.875rem' }}>
            Select up to 3 acquisition targets from the Target Screener to evaluate them side-by-side across financial benchmarks, growth metrics, and valuation multiples.
          </p>
          <button
            onClick={() => setCurrentView('screener')}
            className="btn btn-primary"
            id="btn-go-screener-from-compare"
          >
            Open Target Screener
          </button>
        </div>
      </div>
    );
  }

  const comparisonRows: { category: string; label: string; render: (t: any) => React.ReactNode }[] = [
    // Identification
    { category: 'Overview', label: 'M&A Code Name', render: (t) => <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{t.codeName}</strong> },
    { category: 'Overview', label: 'Sector & Domain', render: (t) => <span>{t.sector} <br /><small style={{ color: 'var(--text-subtle)' }}>{t.subSector}</small></span> },
    { category: 'Overview', label: 'Headquarters', render: (t) => <span>{t.headquarters.city}, {t.headquarters.country}</span> },
    { category: 'Overview', label: 'Deal Readiness', render: (t) => <span className="badge badge-cyan">{t.dealReadiness}</span> },
    { category: 'Overview', label: 'Ownership Structure', render: (t) => <span>{t.ownership}</span> },

    // Financial Scale & Growth
    { category: 'Financials', label: 'ARR (Run Rate)', render: (t) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{formatCurrency(t.financials.arr)}</span> },
    { category: 'Financials', label: 'YoY Revenue Growth', render: (t) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-emerald)' }}>{formatPercent(t.financials.revenueGrowthYoY)}</span> },
    { category: 'Financials', label: 'Gross Margin', render: (t) => <span style={{ fontFamily: 'var(--font-mono)' }}>{t.financials.grossMargin.toFixed(1)}%</span> },
    { category: 'Financials', label: 'EBITDA Margin', render: (t) => <span style={{ fontFamily: 'var(--font-mono)', color: t.financials.ebitdaMargin >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{t.financials.ebitdaMargin.toFixed(1)}%</span> },
    { category: 'Financials', label: 'Rule of 40 Score', render: (t) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: t.financials.ruleOf40 >= 50 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>{t.financials.ruleOf40.toFixed(0)}%</span> },
    { category: 'Financials', label: 'Net Dollar Retention', render: (t) => <span style={{ fontFamily: 'var(--font-mono)' }}>{t.financials.netDollarRetention}%</span> },
    { category: 'Financials', label: 'LTV / CAC Ratio', render: (t) => <span style={{ fontFamily: 'var(--font-mono)' }}>{t.financials.ltvCac}x</span> },

    // Valuation & Multiples
    { category: 'Valuation', label: 'Asking Enterprise Value', render: (t) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '1rem' }}>{formatCurrency(t.valuation.targetEnterpriseValue)}</span> },
    { category: 'Valuation', label: 'EV / ARR Multiple', render: (t) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-amber)' }}>{formatMultiple(t.valuation.evArrMultiple)}</span> },
    { category: 'Valuation', label: 'Benchmark Peer Multiple', render: (t) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>{formatMultiple(t.valuation.precedentTransactionMultiple)}</span> },
    { category: 'Valuation', label: 'DCF Implied EV', render: (t) => <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(t.valuation.dcfImpliedEv)}</span> },

    // Strategic Fit & Synergies
    { category: 'Strategy', label: 'Overall Strategic Fit', render: (t) => <span className="score-pill score-high" style={{ fontSize: '0.85rem' }}>{t.strategicFit.overallScore}/100</span> },
    { category: 'Strategy', label: 'Annual Synergy Potential', render: (t) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#c084fc' }}>+{formatCurrency(t.strategicFit.potentialSynergiesRunRateM)}/yr</span> },
    { category: 'Strategy', label: 'Key Identified Synergies', render: (t) => <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.synergies.map((s: any) => s.title).join(' • ')}</span> },
    { category: 'Strategy', label: 'Key Customer Logos', render: (t) => <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.keyCustomers.join(', ')}</span> },
  ];

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px', width: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Target Comparison Matrix</h1>
            <span className="badge badge-cyan">{compareTargets.length} Targets Selected</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Evaluate relative valuation multiples, capital efficiency, SaaS rule of 40, and synergy upside side-by-side.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={clearCompare}
            className="btn btn-secondary btn-sm"
            id="btn-clear-compare"
          >
            Clear Comparison Tray
          </button>
          <button
            onClick={() => setCurrentView('screener')}
            className="btn btn-primary btn-sm"
            id="btn-add-more-compare"
          >
            <Plus size={14} />
            <span>Add Targets</span>
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          {/* Table Header: Target Cards */}
          <thead>
            <tr style={{ background: '#0b1120', borderBottom: '2px solid var(--border-hover)' }}>
              <th style={{ padding: '20px 24px', width: '260px', color: 'var(--text-subtle)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                Evaluation Dimension
              </th>
              {compareTargets.map((target) => {
                const inPipeline = pipeline.some((p) => p.targetId === target.id);
                return (
                  <th key={target.id} style={{ padding: '20px 24px', minWidth: '320px', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{target.name}</h3>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                          {target.codeName}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCompare(target.id)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: 'none',
                          color: 'var(--text-subtle)',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        title="Remove from comparison"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button
                        onClick={() => setSelectedTarget(target)}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                      >
                        <span>Dossier</span>
                        <ChevronRight size={12} />
                      </button>
                      <button
                        onClick={() => !inPipeline && addToPipeline(target.id)}
                        disabled={inPipeline}
                        className={`btn btn-sm ${inPipeline ? 'btn-secondary' : 'btn-emerald'}`}
                        style={{ flex: 1 }}
                      >
                        {inPipeline ? <Check size={12} /> : <Plus size={12} />}
                        <span>{inPipeline ? 'In Pipeline' : 'Pipeline'}</span>
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body Rows */}
          <tbody>
            {comparisonRows.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent',
                }}
              >
                <td style={{ padding: '14px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {row.category}
                  </div>
                  {row.label}
                </td>
                {compareTargets.map((target) => (
                  <td key={target.id} style={{ padding: '14px 24px', color: 'var(--text-main)' }}>
                    {row.render(target)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
