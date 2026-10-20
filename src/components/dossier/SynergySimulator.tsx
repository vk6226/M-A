import React, { useState } from 'react';
import { TargetCompany, SynergySimulatorState } from '../../types/mna';
import { useDealflow } from '../../context/DealflowContext';
import { calculateSynergyModel, formatCurrency, formatPercent, formatMultiple } from '../../utils/financialFormulas';
import { Sliders, Sparkles, DollarSign, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SynergySimulatorProps {
  target: TargetCompany;
}

export const SynergySimulator: React.FC<SynergySimulatorProps> = ({ target }) => {
  const { acquirer } = useDealflow();

  const [simState, setSimState] = useState<SynergySimulatorState>({
    crossSellUptakePct: 15, // 15% revenue cross sell
    pricingPowerIncreasePct: 5, // 5% pricing power uplift
    cogsSavingsPct: 12, // 12% hosting & infrastructure consolidation
    sgaConsolidationPct: 18, // 18% corporate overhead elimination
    dealFinancing: {
      cashPct: 40,
      debtPct: 40,
      equityPct: 20,
      debtInterestRatePct: 6.5,
    },
  });

  const result = calculateSynergyModel(acquirer, target, simState);

  const handleCashChange = (newCashPct: number) => {
    // Keep total at 100%
    const remaining = 100 - newCashPct;
    const debtRatio = simState.dealFinancing.debtPct / Math.max(1, (simState.dealFinancing.debtPct + simState.dealFinancing.equityPct));
    const newDebt = Math.round(remaining * debtRatio);
    const newEquity = remaining - newDebt;

    setSimState((prev) => ({
      ...prev,
      dealFinancing: {
        ...prev.dealFinancing,
        cashPct: newCashPct,
        debtPct: newDebt,
        equityPct: newEquity,
      },
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Intro Context Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '10px',
            borderRadius: '10px',
            background: 'rgba(139, 92, 246, 0.2)',
            color: '#c084fc',
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Interactive Synergy & Pro-Forma Accretion Underwriter
            </h4>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Model revenue cross-selling, COGS/SG&A elimination, and deal capital structure to test EPS accretion and post-synergy multiples.
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Target Purchase EV:</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>
            {formatCurrency(target.valuation.targetEnterpriseValue)}
          </span>
        </div>
      </div>

      {/* Main Grid: Sliders on Left, Live Pro Forma Model on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
      }}>
        {/* Left Column: Interactive Levers */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Sliders size={16} style={{ color: 'var(--accent-cyan)' }} />
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Value Creation Levers</h4>
          </div>

          {/* Revenue Cross-Sell */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>Customer Base Cross-Sell Uplift</span>
              <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                +{simState.crossSellUptakePct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={simState.crossSellUptakePct}
              onChange={(e) => setSimState((p) => ({ ...p, crossSellUptakePct: Number(e.target.value) }))}
              className="range-slider"
            />
            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              Distribute target modules to acquirer's global enterprise accounts
            </div>
          </div>

          {/* Pricing Power Uplift */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>Pricing Realization & Packaging Uplift</span>
              <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                +{simState.pricingPowerIncreasePct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={simState.pricingPowerIncreasePct}
              onChange={(e) => setSimState((p) => ({ ...p, pricingPowerIncreasePct: Number(e.target.value) }))}
              className="range-slider"
            />
            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              Price harmonization to acquirer standard tier
            </div>
          </div>

          {/* COGS Savings */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>Cloud & Tech Infrastructure Consolidation</span>
              <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                -{simState.cogsSavingsPct}% COGS
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={simState.cogsSavingsPct}
              onChange={(e) => setSimState((p) => ({ ...p, cogsSavingsPct: Number(e.target.value) }))}
              className="range-slider"
            />
            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              AWS enterprise discounts + consolidated server footprints
            </div>
          </div>

          {/* SG&A Consolidation */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>SG&A Redundancy Elimination</span>
              <span style={{ color: '#c084fc', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                -{simState.sgaConsolidationPct}% SG&A
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={simState.sgaConsolidationPct}
              onChange={(e) => setSimState((p) => ({ ...p, sgaConsolidationPct: Number(e.target.value) }))}
              className="range-slider"
            />
            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              Duplicative legal, audit, G&A and corporate overhead
            </div>
          </div>

          {/* Financing Structure */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Deal Consideration Mix (% Cash / Debt / Equity)
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
              <div style={{ background: '#0b1120', padding: '8px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Cash</span>
                <div style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  {simState.dealFinancing.cashPct}%
                </div>
              </div>
              <div style={{ background: '#0b1120', padding: '8px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Debt</span>
                <div style={{ fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                  {simState.dealFinancing.debtPct}%
                </div>
              </div>
              <div style={{ background: '#0b1120', padding: '8px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Equity</span>
                <div style={{ fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {simState.dealFinancing.equityPct}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Impact */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
              <TrendingUp size={16} style={{ color: 'var(--accent-emerald)' }} />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Pro-Forma Underwriting Outputs</h4>
            </div>

            {/* Accretion Highlight Box */}
            <div style={{
              background: result.estimatedNetIncomeAccretionPct >= 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: `1px solid ${result.estimatedNetIncomeAccretionPct >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Estimated EPS Accretion / (Dilution)
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: result.estimatedNetIncomeAccretionPct >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                fontFamily: 'var(--font-mono)',
                margin: '4px 0',
              }}>
                {formatPercent(result.estimatedNetIncomeAccretionPct)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {result.estimatedNetIncomeAccretionPct >= 0
                  ? 'Accretive to Acquirer EPS in Year 1 post-closing'
                  : 'Dilutive in Year 1 due to debt interest or equity issuance'}
              </div>
            </div>

            {/* Metrics Breakdown Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', padding: '6px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Annual Pre-Tax Synergies:</span>
                <span style={{ color: '#c084fc', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  +{formatCurrency(result.totalRunRateSynergyM)}/yr
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', padding: '6px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pro Forma Combined Revenue:</span>
                <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {formatCurrency(result.postDealCombinedRevenueM)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', padding: '6px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pro Forma Combined EBITDA:</span>
                <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {formatCurrency(result.postDealCombinedEbitdaM)} ({result.postDealCombinedEbitdaMargin}% margin)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', padding: '6px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Effective Post-Synergy Multiple:</span>
                <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {formatMultiple(result.postSynergyEffectiveMultiple)} EV/EBITDA
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', padding: '6px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pro Forma Net Debt / EBITDA:</span>
                <span style={{
                  color: result.proFormaNetDebtToEbitda <= acquirer.maxLeverageMultiple ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                }}>
                  {result.proFormaNetDebtToEbitda}x (Cap: {acquirer.maxLeverageMultiple}x)
                </span>
              </div>
            </div>
          </div>

          {/* Underwriting Conclusion Tag */}
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: '#0b1120',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <ShieldCheck size={16} color="var(--accent-emerald)" />
            <span>
              Underwriting recommendation: Strong commercial fit with <strong>{result.postSynergyEffectiveMultiple}x</strong> effective entry multiple post-synergy integration.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
