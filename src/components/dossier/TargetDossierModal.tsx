import React, { useState } from 'react';
import { TargetCompany } from '../../types/mna';
import { useDealflow } from '../../context/DealflowContext';
import { FinancialTeardownChart } from './FinancialTeardownChart';
import { SynergySimulator } from './SynergySimulator';
import { ICMemoTeaser } from './ICMemoTeaser';
import { 
  X, 
  Building, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  ShieldAlert, 
  FileText, 
  BarChart3, 
  Zap, 
  Cpu, 
  Award, 
  Plus, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { formatCurrency, formatMultiple, formatPercent } from '../../utils/financialFormulas';

type DossierTab = 'overview' | 'financials' | 'synergies' | 'risks' | 'ic-memo';

export const TargetDossierModal: React.FC = () => {
  const { selectedTarget, setSelectedTarget, addToPipeline, pipeline } = useDealflow();
  const [activeTab, setActiveTab] = useState<DossierTab>('overview');

  if (!selectedTarget) return null;

  const target = selectedTarget;
  const isAlreadyInPipeline = pipeline.some((p) => p.targetId === target.id);

  const tabs: { id: DossierTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview & Strategy', icon: <Zap size={15} /> },
    { id: 'financials', label: 'Financial Teardown', icon: <BarChart3 size={15} /> },
    { id: 'synergies', label: 'Synergy Simulator', icon: <Sparkles size={15} /> },
    { id: 'risks', label: 'Risks & Due Diligence', icon: <ShieldAlert size={15} />, count: target.risks.length },
    { id: 'ic-memo', label: 'IC Memo Generator', icon: <FileText size={15} /> },
  ];

  return (
    <div className="modal-backdrop" onClick={() => setSelectedTarget(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.95)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${target.logoColor} 0%, #1e293b 100%)`,
              border: `1px solid ${target.logoAccent}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: `0 0 15px ${target.logoColor}40`,
            }}>
              {target.name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{target.name}</h2>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {target.codeName}
                </span>
                <span className="badge badge-emerald">{target.dealReadiness}</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginTop: '4px',
              }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{target.sector}</span>
                <span>•</span>
                <span>{target.subSector}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <MapPin size={12} />
                  {target.headquarters.city}, {target.headquarters.country}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => !isAlreadyInPipeline && addToPipeline(target.id)}
              disabled={isAlreadyInPipeline}
              className={`btn btn-sm ${isAlreadyInPipeline ? 'btn-secondary' : 'btn-emerald'}`}
              id="btn-modal-add-pipeline"
            >
              {isAlreadyInPipeline ? (
                <>
                  <Check size={14} color="#10b981" />
                  <span style={{ color: '#10b981' }}>In Active Pipeline</span>
                </>
              ) : (
                <>
                  <Plus size={14} />
                  <span>Add to Deal Pipeline</span>
                </>
              )}
            </button>

            <button
              onClick={() => setSelectedTarget(null)}
              id="btn-close-dossier"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '8px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 28px',
          background: 'rgba(11, 17, 32, 0.8)',
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto',
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                id={`tab-dossier-${tab.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                  border: isActive ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.825rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-subtle)' }}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    background: 'rgba(244, 63, 94, 0.2)',
                    color: '#fb7185',
                    fontWeight: 700,
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: '28px', overflowY: 'auto' }}>
          {/* TAB 1: OVERVIEW & STRATEGY */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Executive Summary & Thesis */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '20px',
              }}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '10px' }}>
                    Executive Briefing & Architecture
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                    {target.executiveSummary}
                  </p>
                </div>

                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 700, marginBottom: '10px' }}>
                    Corporate M&A Investment Thesis
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                    {target.investmentThesis}
                  </p>
                </div>
              </div>

              {/* Strategic Scorecard Breakdown */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '16px' }}>
                  Proprietary Strategic Fit Scorecard
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Tech Stack Synergy</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {target.strategicFit.techStackSynergy}/100
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Market Expansion</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                      {target.strategicFit.marketExpansion}/100
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Cultural Compatibility</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                      {target.strategicFit.culturalCompatibility}/100
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Talent & IP Retention</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                      {target.strategicFit.talentIPRetention}/100
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack & Patents */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}>
                {/* Tech Stack */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={15} color="var(--accent-cyan)" />
                    Verified Technology Stack & Infrastructure
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {target.techStack.map((tech, i) => (
                      <span key={i} style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: '#0b1120',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#f8fafc',
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Customers & IP */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={15} color="#c084fc" />
                    Key Enterprise Customers & IP Patents
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {target.keyCustomers.map((c, i) => (
                      <span key={i} className="badge badge-purple">{c}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Granted Patents: <strong style={{ color: '#ffffff' }}>{target.patentsCount} active utility patents</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIAL TEARDOWN */}
          {activeTab === 'financials' && (
            <FinancialTeardownChart target={target} />
          )}

          {/* TAB 3: SYNERGY UNDERWRITING */}
          {activeTab === 'synergies' && (
            <SynergySimulator target={target} />
          )}

          {/* TAB 4: RISKS & DUE DILIGENCE */}
          {activeTab === 'risks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Underwriting risk radar identifies critical operational, customer concentration, and regulatory hurdles:
              </div>

              {target.risks.map((risk) => (
                <div
                  key={risk.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    padding: '20px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    borderLeft: `4px solid ${risk.severity === 'High' ? 'var(--accent-rose)' : risk.severity === 'Medium' ? 'var(--accent-amber)' : 'var(--accent-emerald)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${risk.severity === 'High' ? 'badge-rose' : risk.severity === 'Medium' ? 'badge-amber' : 'badge-emerald'}`}>
                        {risk.severity} Severity
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                        {risk.category}
                      </span>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                    {risk.title}
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
                    {risk.description}
                  </p>

                  <div style={{
                    background: '#0b1120',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '0.8rem',
                    color: '#e2e8f0',
                  }}>
                    <strong style={{ color: 'var(--accent-emerald)' }}>Mitigation Control: </strong>
                    {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: IC MEMO TEASER */}
          {activeTab === 'ic-memo' && (
            <ICMemoTeaser target={target} />
          )}
        </div>
      </div>
    </div>
  );
};
