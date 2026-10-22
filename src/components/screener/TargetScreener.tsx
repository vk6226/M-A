import React, { useState } from 'react';
import { useDealflow } from '../../context/DealflowContext';
import { FilterPanel } from './FilterPanel';
import { TargetCard } from './TargetCard';
import { TargetCompany } from '../../types/mna';
import { ArrowUpDown, AlertCircle, Sparkles, Plus, Zap } from 'lucide-react';
import { generateCompanyWithAi } from '../../utils/aiCompanyGenerator';
import confetti from 'canvas-confetti';

type SortOption = 'fitScore' | 'arr' | 'growth' | 'ev' | 'multiple' | 'synergy';

export const TargetScreener: React.FC = () => {
  const { targets, filterState, setIsAddTargetOpen, resetTargets, addTarget, showToast } = useDealflow();
  const [sortBy, setSortBy] = useState<SortOption>('fitScore');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Filter logic
  const filteredTargets = targets.filter((target) => {
    // Search query (name, codeName, sector, subSector, techStack)
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase();
      const matchName = target.name.toLowerCase().includes(q);
      const matchCode = target.codeName.toLowerCase().includes(q);
      const matchSector = target.sector.toLowerCase().includes(q);
      const matchSubSector = target.subSector.toLowerCase().includes(q);
      const matchTech = target.techStack.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchCode && !matchSector && !matchSubSector && !matchTech) {
        return false;
      }
    }

    // Sector Filter
    if (filterState.sectors.length > 0 && !filterState.sectors.includes(target.sector)) {
      return false;
    }

    // Numerical criteria
    if (target.financials.arr < filterState.minArr) return false;
    if (target.financials.revenueGrowthYoY < filterState.minRevenueGrowth) return false;
    if (target.financials.ruleOf40 < filterState.minRuleOf40) return false;
    if (target.valuation.evArrMultiple > filterState.maxEvArr) return false;
    if (target.strategicFit.overallScore < filterState.minStrategicFit) return false;

    return true;
  });

  // Sort logic
  const sortedTargets = [...filteredTargets].sort((a, b) => {
    switch (sortBy) {
      case 'fitScore':
        return b.strategicFit.overallScore - a.strategicFit.overallScore;
      case 'arr':
        return b.financials.arr - a.financials.arr;
      case 'growth':
        return b.financials.revenueGrowthYoY - a.financials.revenueGrowthYoY;
      case 'ev':
        return b.valuation.targetEnterpriseValue - a.valuation.targetEnterpriseValue;
      case 'multiple':
        return a.valuation.evArrMultiple - b.valuation.evArrMultiple; // lower multiple first
      case 'synergy':
        return b.strategicFit.potentialSynergiesRunRateM - a.strategicFit.potentialSynergiesRunRateM;
      default:
        return 0;
    }
  });

  const handleQuickAiGenerate = (queryName: string) => {
    if (!queryName.trim()) return;
    setIsAiGenerating(true);

    setTimeout(() => {
      const newTarget = generateCompanyWithAi(queryName.trim());
      addTarget(newTarget);
      setIsAiGenerating(false);
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch (e) {
        // ignore
      }
    }, 600);
  };

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px', width: '100%' }}>
      {/* Page Title & Context */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Precision Target Discovery & Screener
            </h1>
            <span className="badge badge-cyan">Live Multi-Factor Radar</span>
            <span className="badge badge-purple">AI Sourcing Active</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Filter institutional targets across financial benchmarks, or use the <strong>AI Sourcing Model</strong> to discover and underwrite any company in the world.
          </p>
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={15} style={{ color: 'var(--text-subtle)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            id="select-sort-screener"
            style={{
              background: '#0b1120',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="fitScore">Strategic Fit Score (High to Low)</option>
            <option value="arr">Annual Recurring Revenue (ARR)</option>
            <option value="growth">YoY Revenue Growth Rate</option>
            <option value="ev">Enterprise Value (EV)</option>
            <option value="multiple">EV / ARR Multiple (Lowest First)</option>
            <option value="synergy">Estimated Annual Synergies</option>
          </select>
        </div>
      </div>

      {/* Interactive Filter Panel */}
      <FilterPanel />

      {/* AI On-Demand Search Discovery Banner */}
      {filterState.searchQuery.trim().length > 1 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="#c084fc" />
            <div>
              <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>
                Looking to underwrite <strong>"{filterState.searchQuery}"</strong>?
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Our AI Model will instantly generate verified financials, multiples, customer logos, tech stack, and synergy scorecards.
              </div>
            </div>
          </div>

          <button
            onClick={() => handleQuickAiGenerate(filterState.searchQuery)}
            disabled={isAiGenerating}
            className="btn btn-primary btn-sm"
          >
            <Sparkles size={13} />
            <span>{isAiGenerating ? 'Synthesizing Dossier...' : `AI Generate & Ingest "${filterState.searchQuery}"`}</span>
          </button>
        </div>
      )}

      {/* Results Header with Ingest Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
        fontSize: '0.825rem',
        color: 'var(--text-muted)',
      }}>
        <div>
          Showing <span style={{ color: '#ffffff', fontWeight: 700 }}>{sortedTargets.length}</span> of {targets.length} targets matching precision criteria
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsAddTargetOpen(true)}
            className="btn btn-emerald btn-sm"
            id="btn-screener-ingest-target"
          >
            <Sparkles size={13} />
            <span>+ Ingest Target Company</span>
          </button>

          <button
            onClick={resetTargets}
            className="btn btn-secondary btn-sm"
            title="Reset universe to benchmark target set"
          >
            <span>Reset Universe</span>
          </button>
        </div>
      </div>

      {/* Target Cards Grid */}
      {sortedTargets.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '20px',
        }}>
          {sortedTargets.map((target) => (
            <TargetCard key={target.id} target={target} />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{
          padding: '60px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}>
          <AlertCircle size={44} style={{ color: 'var(--accent-amber)' }} />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {filterState.searchQuery.trim()
                ? `Company "${filterState.searchQuery}" Not In Local Database`
                : 'No Target Companies Match Current Filters'}
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '520px', fontSize: '0.875rem', marginTop: '6px' }}>
              {filterState.searchQuery.trim()
                ? `You can underwrite any company in the world. Click below to let the AI Model research, synthesize, and create the full M&A dossier for "${filterState.searchQuery}" right now.`
                : 'Try relaxing your numerical filters or click Reset Filters to browse the complete universe.'}
            </p>
          </div>

          {filterState.searchQuery.trim() && (
            <button
              onClick={() => handleQuickAiGenerate(filterState.searchQuery)}
              disabled={isAiGenerating}
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
            >
              <Sparkles size={16} />
              <span>{isAiGenerating ? 'AI Synthesizing Target...' : `AI Generate & Ingest "${filterState.searchQuery}"`}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
