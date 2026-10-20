import React from 'react';
import { TargetCompany } from '../../types/mna';
import { useDealflow } from '../../context/DealflowContext';
import { 
  Building, 
  TrendingUp, 
  Sparkles, 
  Scale, 
  Plus, 
  Check, 
  ChevronRight, 
  ShieldAlert, 
  MapPin, 
  Zap,
  Layers
} from 'lucide-react';
import { formatCurrency, formatMultiple, formatPercent } from '../../utils/financialFormulas';

interface TargetCardProps {
  target: TargetCompany;
}

export const TargetCard: React.FC<TargetCardProps> = ({ target }) => {
  const { 
    setSelectedTarget, 
    addToPipeline, 
    pipeline, 
    addToCompare, 
    compareTargets 
  } = useDealflow();

  const isAlreadyInPipeline = pipeline.some((p) => p.targetId === target.id);
  const isComparing = compareTargets.some((t) => t.id === target.id);

  const getReadinessBadgeClass = (readiness: string) => {
    if (readiness.includes('Immediate')) return 'badge-rose';
    if (readiness.includes('Approachable')) return 'badge-emerald';
    if (readiness.includes('Pre-Auction')) return 'badge-amber';
    return 'badge-purple';
  };

  const getFitBadge = (score: number) => {
    if (score >= 90) return 'score-high';
    if (score >= 80) return 'score-medium';
    return 'score-low';
  };

  return (
    <div
      className="glass-panel glass-panel-interactive"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Top Header: Code Name, Sector, Readiness */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Sector / Logo Icon Avatar */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${target.logoColor} 0%, #1e293b 100%)`,
              border: `1px solid ${target.logoAccent}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              color: '#ffffff',
              boxShadow: `0 0 12px ${target.logoColor}30`,
              flexShrink: 0,
            }}>
              {target.name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1.2,
                }}>
                  {target.name}
                </h3>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '3px',
                fontSize: '0.72rem',
                color: 'var(--text-subtle)',
              }}>
                <span style={{
                  color: 'var(--accent-cyan)',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {target.codeName}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <MapPin size={11} />
                  {target.headquarters.city}, {target.headquarters.country}
                </span>
              </div>
            </div>
          </div>

          {/* Strategic Fit Pill */}
          <div className="tooltip-box">
            <div className={`score-pill ${getFitBadge(target.strategicFit.overallScore)}`}>
              <Zap size={11} style={{ marginRight: '3px' }} />
              Fit: {target.strategicFit.overallScore}
            </div>
            <span className="tooltip-text">Proprietary Strategic Fit Score (0-100)</span>
          </div>
        </div>

        {/* Tagline / Subtitle */}
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          lineHeight: 1.45,
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '38px',
        }}>
          {target.tagline}
        </p>

        {/* Badges Bar: Sector, Subsector, Readiness */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '16px',
        }}>
          <span className="badge badge-cyan">{target.sector}</span>
          <span className={`badge ${getReadinessBadgeClass(target.dealReadiness)}`}>
            {target.dealReadiness}
          </span>
          <span className="badge badge-gray">{target.ownership}</span>
        </div>

        {/* Core Financial Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          background: 'rgba(11, 17, 32, 0.7)',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          marginBottom: '16px',
        }}>
          <div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              ARR (Run Rate)
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.975rem',
              fontWeight: 700,
              color: '#ffffff',
            }}>
              {formatCurrency(target.financials.arr)}
            </div>
            <div style={{
              fontSize: '0.675rem',
              color: target.financials.revenueGrowthYoY >= 40 ? 'var(--accent-emerald)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}>
              <TrendingUp size={10} />
              {formatPercent(target.financials.revenueGrowthYoY)} YoY
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Target EV
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.975rem',
              fontWeight: 700,
              color: 'var(--accent-cyan)',
            }}>
              {formatCurrency(target.valuation.targetEnterpriseValue)}
            </div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
              {formatMultiple(target.valuation.evArrMultiple)} EV/ARR
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Rule of 40
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.975rem',
              fontWeight: 700,
              color: target.financials.ruleOf40 >= 60 ? 'var(--accent-emerald)' : target.financials.ruleOf40 >= 40 ? 'var(--accent-amber)' : 'var(--accent-rose)',
            }}>
              {target.financials.ruleOf40.toFixed(0)}%
            </div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
              NDR {target.financials.netDollarRetention}%
            </div>
          </div>
        </div>

        {/* Synergies & Risks Snapshot */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          padding: '8px 10px',
          background: 'rgba(139, 92, 246, 0.08)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} style={{ color: '#c084fc' }} />
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Identified Synergies:</span>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#c084fc',
          }}>
            +{formatCurrency(target.strategicFit.potentialSynergiesRunRateM)}/yr
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '14px',
      }}>
        {/* Compare Button */}
        <button
          onClick={() => isComparing ? null : addToCompare(target)}
          id={`btn-compare-${target.id}`}
          className="btn btn-secondary btn-sm"
          style={{
            flex: '1',
            background: isComparing ? 'rgba(6, 182, 212, 0.15)' : undefined,
            borderColor: isComparing ? 'var(--accent-cyan)' : undefined,
            color: isComparing ? 'var(--accent-cyan)' : undefined,
          }}
          title={isComparing ? 'Currently in comparison' : 'Add to head-to-head comparison'}
        >
          <Scale size={13} />
          <span>{isComparing ? 'In Tray' : 'Compare'}</span>
        </button>

        {/* Add to Pipeline Button */}
        <button
          onClick={() => !isAlreadyInPipeline && addToPipeline(target.id)}
          id={`btn-pipeline-${target.id}`}
          className={`btn btn-sm ${isAlreadyInPipeline ? 'btn-secondary' : 'btn-emerald'}`}
          style={{ flex: '1' }}
          disabled={isAlreadyInPipeline}
        >
          {isAlreadyInPipeline ? (
            <>
              <Check size={13} color="#10b981" />
              <span style={{ color: '#10b981' }}>In Pipeline</span>
            </>
          ) : (
            <>
              <Plus size={13} />
              <span>Pipeline</span>
            </>
          )}
        </button>

        {/* Deep Intelligence Dossier Modal Trigger */}
        <button
          onClick={() => setSelectedTarget(target)}
          id={`btn-dossier-${target.id}`}
          className="btn btn-primary btn-sm"
          style={{ flex: '1.2' }}
        >
          <span>Dossier</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};
