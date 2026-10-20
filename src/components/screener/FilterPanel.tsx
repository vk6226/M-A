import React from 'react';
import { useDealflow } from '../../context/DealflowContext';
import { Sector } from '../../types/mna';
import { Search, RotateCcw, Filter, SlidersHorizontal, Check } from 'lucide-react';

const ALL_SECTORS: Sector[] = [
  'Enterprise AI',
  'Cybersecurity',
  'FinTech & Payments',
  'HealthTech & Bio',
  'Supply Chain & Logistics',
  'CleanTech & Energy',
  'DevOps & Cloud Infra',
];

export const FilterPanel: React.FC = () => {
  const { filterState, setFilterState, resetFilters, targets } = useDealflow();

  const handleSectorToggle = (sector: Sector) => {
    setFilterState((prev) => {
      const exists = prev.sectors.includes(sector);
      return {
        ...prev,
        sectors: exists
          ? prev.sectors.filter((s) => s !== sector)
          : [...prev.sectors, sector],
      };
    });
  };

  const handleRegionToggle = (region: 'North America' | 'EMEA' | 'APAC' | 'LATAM') => {
    setFilterState((prev) => {
      const exists = prev.regions.includes(region);
      return {
        ...prev,
        regions: exists
          ? prev.regions.filter((r) => r !== region)
          : [...prev.regions, region],
      };
    });
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px',
        marginBottom: '24px',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Top row: Search input + Quick Reset */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        {/* Search Bar */}
        <div style={{
          position: 'relative',
          flex: '1',
          minWidth: '280px',
        }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)',
            }}
          />
          <input
            type="text"
            id="input-target-search"
            placeholder="Search targets by name, M&A code, tech stack (e.g. eBPF, Rust, AI agents), or sub-sector..."
            value={filterState.searchQuery}
            onChange={(e) => setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="input-text"
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Reset Filters */}
        <button
          onClick={resetFilters}
          id="btn-reset-filters"
          className="btn btn-secondary btn-sm"
          title="Reset all filters to defaults"
        >
          <RotateCcw size={13} />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Sector Selection Chips */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Filter size={12} style={{ color: 'var(--accent-cyan)' }} />
          <span>Industry Sector Focus:</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {ALL_SECTORS.map((sector) => {
            const isSelected = filterState.sectors.includes(sector);
            return (
              <button
                key={sector}
                onClick={() => handleSectorToggle(sector)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                {isSelected && <Check size={12} color="var(--accent-cyan)" />}
                <span>{sector}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Numerical Sliders Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        {/* Min ARR Slider */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '6px',
          }}>
            <span>Min ARR</span>
            <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              ${filterState.minArr}M+
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={filterState.minArr}
            onChange={(e) => setFilterState((prev) => ({ ...prev, minArr: Number(e.target.value) }))}
            className="range-slider"
          />
        </div>

        {/* Min Growth YoY Slider */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '6px',
          }}>
            <span>Min YoY Revenue Growth</span>
            <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              +{filterState.minRevenueGrowth}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={filterState.minRevenueGrowth}
            onChange={(e) => setFilterState((prev) => ({ ...prev, minRevenueGrowth: Number(e.target.value) }))}
            className="range-slider"
          />
        </div>

        {/* Min Rule of 40 */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '6px',
          }}>
            <span>Min Rule of 40 Score</span>
            <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {filterState.minRuleOf40}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={filterState.minRuleOf40}
            onChange={(e) => setFilterState((prev) => ({ ...prev, minRuleOf40: Number(e.target.value) }))}
            className="range-slider"
          />
        </div>

        {/* Max EV/ARR Multiple */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '6px',
          }}>
            <span>Max EV / ARR Multiple</span>
            <span style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {filterState.maxEvArr}x
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="15"
            step="0.5"
            value={filterState.maxEvArr}
            onChange={(e) => setFilterState((prev) => ({ ...prev, maxEvArr: Number(e.target.value) }))}
            className="range-slider"
          />
        </div>

        {/* Min Strategic Fit */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '6px',
          }}>
            <span>Min Strategic Fit</span>
            <span style={{ color: '#c084fc', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {filterState.minStrategicFit}/100
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={filterState.minStrategicFit}
            onChange={(e) => setFilterState((prev) => ({ ...prev, minStrategicFit: Number(e.target.value) }))}
            className="range-slider"
          />
        </div>
      </div>
    </div>
  );
};
