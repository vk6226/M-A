import React from 'react';
import { TargetCompany } from '../../types/mna';
import { formatCurrency, formatMultiple, formatPercent } from '../../utils/financialFormulas';
import { BarChart3, TrendingUp, Users, DollarSign, PieChart, ShieldAlert } from 'lucide-react';

interface FinancialTeardownChartProps {
  target: TargetCompany;
}

export const FinancialTeardownChart: React.FC<FinancialTeardownChartProps> = ({ target }) => {
  const maxRevenue = Math.max(...target.historicalFinancials.map((f) => f.revenue));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 5-Year Historical & Projected Growth Bar Visualizer */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              5-Year Revenue & EBITDA Trajectory (Historical + Forecast)
            </h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--accent-cyan)', borderRadius: '2px' }}></span>
              Revenue ($M)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--accent-emerald)', borderRadius: '2px' }}></span>
              EBITDA ($M)
            </span>
          </div>
        </div>

        {/* Dynamic Visual Bars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${target.historicalFinancials.length}, 1fr)`,
          gap: '16px',
          height: '200px',
          alignItems: 'flex-end',
          paddingBottom: '30px',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
        }}>
          {target.historicalFinancials.map((f, idx) => {
            const revHeightPct = Math.max(15, (f.revenue / maxRevenue) * 100);
            const ebitdaHeightPct = f.ebitda > 0 ? (f.ebitda / maxRevenue) * 100 : 8;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  gap: '6px',
                }}
              >
                {/* Metrics label on top */}
                <span style={{
                  fontSize: '0.725rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: '#ffffff',
                }}>
                  ${f.revenue}M
                </span>

                {/* Bars Container */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '6px',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                }}>
                  {/* Revenue Bar */}
                  <div
                    style={{
                      width: '45%',
                      height: `${revHeightPct}%`,
                      background: f.year.includes('(P)')
                        ? 'repeating-linear-gradient(45deg, #0284c7, #0284c7 8px, #0369a1 8px, #0369a1 16px)'
                        : 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                      borderRadius: '4px 4px 0 0',
                      boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)',
                    }}
                    title={`Revenue: $${f.revenue}M`}
                  />

                  {/* EBITDA Bar */}
                  <div
                    style={{
                      width: '45%',
                      height: `${Math.max(6, ebitdaHeightPct)}%`,
                      background: f.ebitda >= 0
                        ? 'linear-gradient(180deg, #34d399 0%, #059669 100%)'
                        : '#f43f5e',
                      borderRadius: '4px 4px 0 0',
                    }}
                    title={`EBITDA: $${f.ebitda}M`}
                  />
                </div>

                {/* Year Label */}
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: f.year.includes('(P)') ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  marginTop: '6px',
                }}>
                  {f.year}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Table underneath */}
        <div style={{ overflowX: 'auto', marginTop: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ color: 'var(--text-subtle)', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <th style={{ padding: '8px' }}>Line Item ($M)</th>
                {target.historicalFinancials.map((f, i) => (
                  <th key={i} style={{ padding: '8px', textAlign: 'right' }}>{f.year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <td style={{ padding: '8px', color: 'var(--text-main)', fontWeight: 600 }}>Total Revenue</td>
                {target.historicalFinancials.map((f, i) => (
                  <td key={i} style={{ padding: '8px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    ${f.revenue.toFixed(1)}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <td style={{ padding: '8px', color: 'var(--text-muted)' }}>Gross Profit</td>
                {target.historicalFinancials.map((f, i) => (
                  <td key={i} style={{ padding: '8px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    ${f.grossProfit.toFixed(1)}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <td style={{ padding: '8px', color: 'var(--accent-emerald)', fontWeight: 600 }}>EBITDA</td>
                {target.historicalFinancials.map((f, i) => (
                  <td key={i} style={{ padding: '8px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: f.ebitda >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    ${f.ebitda.toFixed(1)}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '8px', color: 'var(--text-muted)' }}>Free Cash Flow (FCF)</td>
                {target.historicalFinancials.map((f, i) => (
                  <td key={i} style={{ padding: '8px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: f.fcf >= 0 ? '#ffffff' : 'var(--accent-rose)' }}>
                    ${f.fcf.toFixed(1)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SaaS & Enterprise Operational Unit Economics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
      }}>
        {/* Retention & CAC */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={14} color="var(--accent-cyan)" />
            Customer Retention & Acquisition Efficiency
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-subtle)' }}>Net Dollar Retention (NDR):</span>
              <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {target.financials.netDollarRetention}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-subtle)' }}>CAC Payback Period:</span>
              <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {target.financials.cacPaybackMonths} Months
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-subtle)' }}>LTV / CAC Ratio:</span>
              <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {target.financials.ltvCac}x
              </span>
            </div>
          </div>
        </div>

        {/* Customer Base & Concentration */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} color="#c084fc" />
            Customer Base & Revenue Risk
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-subtle)' }}>Total Enterprise Accounts:</span>
              <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {target.financials.customerCount} Logos
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-subtle)' }}>Top-3 Customer Concentration:</span>
              <span style={{
                color: target.financials.top3CustomerConcentration > 25 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
              }}>
                {target.financials.top3CustomerConcentration}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-subtle)' }}>Rule of 40 Benchmark:</span>
              <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {target.financials.ruleOf40.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
