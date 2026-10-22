import React, { useState } from 'react';
import { useDealflow } from '../../context/DealflowContext';
import { FilterPanel } from './FilterPanel';
import { TargetCard } from './TargetCard';
import { TargetCompany } from '../../types/mna';
import { ArrowUpDown, AlertCircle, Sparkles, Plus, Zap, Globe, Cpu, Shield, CreditCard, Building2, Search, ArrowRight } from 'lucide-react';
import { generateCompanyWithAi, generateBatchFromPrompt, generateGlobalMegaUniverse } from '../../utils/aiCompanyGenerator';
import confetti from 'canvas-confetti';

type SortOption = 'fitScore' | 'arr' | 'growth' | 'ev' | 'multiple' | 'synergy';

export const TargetScreener: React.FC = () => {
  const { targets, filterState, setFilterState, setIsAddTargetOpen, resetTargets, addTarget, importTargets, showToast } = useDealflow();
  const [sortBy, setSortBy] = useState<SortOption>('fitScore');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [isPromptBatchLoading, setIsPromptBatchLoading] = useState(false);

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
      showToast('success', 'AI Target Ingested', `Synthesized institutional M&A profile for ${newTarget.name}`);
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch (e) {
        // ignore
      }
    }, 600);
  };

  const handleGlobalMegaIngest = () => {
    setIsPromptBatchLoading(true);
    setTimeout(() => {
      const megaUniverse = generateGlobalMegaUniverse();
      importTargets(megaUniverse);
      setIsPromptBatchLoading(false);
      showToast('success', 'Global Universe Ingested', `Ingested ${megaUniverse.length} world-class companies across all 7 sectors.`);
      try {
        confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 } });
      } catch (e) {
        // ignore
      }
    }, 800);
  };

  const handlePromptBatchIngest = (customPromptText?: string) => {
    const promptToUse = (customPromptText || aiPromptInput).trim();
    if (!promptToUse) {
      showToast('warning', 'Prompt Required', 'Please enter a target query or category prompt.');
      return;
    }

    setIsPromptBatchLoading(true);
    setTimeout(() => {
      const batch = generateBatchFromPrompt(promptToUse);
      importTargets(batch);
      setIsPromptBatchLoading(false);
      setAiPromptInput('');
      showToast('success', 'AI Batch Ingestion Complete', `Sourced and underwrote ${batch.length} companies matching "${promptToUse}"`);
      try {
        confetti({ particleCount: 110, spread: 90, origin: { y: 0.5 } });
      } catch (e) {
        // ignore
      }
    }, 700);
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
            <span className="badge badge-purple">AI Universal Sourcing</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Filter institutional targets across financial benchmarks, or use the <strong>AI Sourcing Model</strong> to discover, synthesize, and underwrite any company in the world.
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

      {/* AI Universal Discovery & Batch Sourcing Command Center */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.6) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 24px',
        marginBottom: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sparkles size={17} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                AI Model Universal Company Discovery Engine
                <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Any Company on Earth</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Type any category prompt, sector theme, or click a fast preset below to instantly synthesize complete institutional M&A dossiers.
              </div>
            </div>
          </div>

          <button
            onClick={handleGlobalMegaIngest}
            disabled={isPromptBatchLoading}
            className="btn btn-primary btn-sm"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              border: 'none',
              fontWeight: 700,
              padding: '8px 16px',
            }}
          >
            <Globe size={14} />
            <span>{isPromptBatchLoading ? 'Synthesizing Mega-Universe...' : '⚡ Ingest 35+ Worldwide Giants (All Sectors)'}</span>
          </button>
        </div>

        {/* Natural Language Prompt Search Bar */}
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          marginBottom: '14px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            position: 'relative',
            flex: 1,
            minWidth: '280px',
          }}>
            <Search size={15} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)',
            }} />
            <input
              type="text"
              placeholder="Ask AI Model: e.g. 'Top 8 European AI scale-ups' or 'Indian FinTech unicorns' or 'B2B SaaS with >$50M ARR'..."
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePromptBatchIngest();
              }}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '9px 14px 9px 36px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={() => handlePromptBatchIngest()}
            disabled={isPromptBatchLoading || !aiPromptInput.trim()}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'rgba(139, 92, 246, 0.25)',
              borderColor: 'rgba(139, 92, 246, 0.5)',
              color: '#c084fc',
              fontWeight: 600,
            }}
          >
            <Sparkles size={13} />
            <span>Ask AI Model to Sourced Targets</span>
          </button>
        </div>

        {/* Thematic Fast Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Instant Sourcing Themes:
          </span>
          <button
            onClick={() => handlePromptBatchIngest('AI & Foundation Models')}
            disabled={isPromptBatchLoading}
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Cpu size={11} />
            <span>AI Titans (OpenAI, Databricks, Palantir...)</span>
          </button>

          <button
            onClick={() => handlePromptBatchIngest('Cybersecurity')}
            disabled={isPromptBatchLoading}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Shield size={11} />
            <span>Cybersecurity (Wiz, Palo Alto, Snyk...)</span>
          </button>

          <button
            onClick={() => handlePromptBatchIngest('FinTech & Payments')}
            disabled={isPromptBatchLoading}
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <CreditCard size={11} />
            <span>FinTech Giants (Stripe, Ramp, Plaid...)</span>
          </button>

          <button
            onClick={() => handlePromptBatchIngest('Indian Tech Leaders')}
            disabled={isPromptBatchLoading}
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span>🇮🇳 Indian Scale-Ups (Razorpay, Swiggy, Cred...)</span>
          </button>

          <button
            onClick={() => handlePromptBatchIngest('European Tech Champions')}
            disabled={isPromptBatchLoading}
            style={{
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#22d3ee',
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span>🇪🇺 European Scale-Ups (Mistral, Spotify, Adyen...)</span>
          </button>
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
