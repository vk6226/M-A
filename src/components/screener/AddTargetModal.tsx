import React, { useState } from 'react';
import { useDealflow } from '../../context/DealflowContext';
import { TargetCompany, Sector, OwnershipType, DealReadiness } from '../../types/mna';
import { 
  X, 
  Sparkles, 
  Upload, 
  PlusCircle, 
  Database, 
  FileText, 
  Download, 
  Check, 
  AlertCircle, 
  Globe, 
  Building2, 
  ArrowRight,
  Cpu,
  Layers,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateCompanyWithAi } from '../../utils/aiCompanyGenerator';

export const AddTargetModal: React.FC = () => {
  const { isAddTargetOpen, setIsAddTargetOpen, addTarget, importTargets, showToast } = useDealflow();
  const [activeTab, setActiveTab] = useState<'ai-profiler' | 'manual' | 'csv' | 'api-feeds'>('ai-profiler');

  // AI Profiler State
  const [aiCompanyName, setAiCompanyName] = useState('');
  const [aiSector, setAiSector] = useState<Sector>('Cybersecurity');
  const [aiTagline, setAiTagline] = useState('');
  const [aiArrEstimate, setAiArrEstimate] = useState(35);
  const [isGenerating, setIsGenerating] = useState(false);

  // Manual Form State
  const [name, setName] = useState('');
  const [codeName, setCodeName] = useState('');
  const [sector, setSector] = useState<Sector>('Enterprise AI');
  const [subSector, setSubSector] = useState('');
  const [city, setCity] = useState('New York, NY');
  const [country, setCountry] = useState('United States');
  const [region, setRegion] = useState<'North America' | 'EMEA' | 'APAC' | 'LATAM'>('North America');
  const [arr, setArr] = useState(25);
  const [growth, setGrowth] = useState(45);
  const [ebitdaMargin, setEbitdaMargin] = useState(15);
  const [evArrMultiple, setEvArrMultiple] = useState(8.5);
  const [strategicFit, setStrategicFit] = useState(88);
  const [tagline, setTagline] = useState('');
  const [ownership, setOwnership] = useState<OwnershipType>('VC Series B/C');
  const [readiness, setReadiness] = useState<DealReadiness>('Approachable (Warm Intro)');

  if (!isAddTargetOpen) return null;

  // Handle AI Target Synthesis
  const handleGenerateAiTarget = () => {
    if (!aiCompanyName.trim()) {
      showToast('warning', 'Missing Name', 'Please enter a target company name.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const newTarget = generateCompanyWithAi(aiCompanyName.trim(), aiSector);
      addTarget(newTarget);
      setIsGenerating(false);
      setIsAddTargetOpen(false);

      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch (e) {
        // ignore
      }
    }, 600);
  };

  const handleBatchIngestUnicorns = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const unicorns = ['Wiz', 'Stripe', 'Ramp', 'Anthropic', 'Datadog', 'Supabase', 'Snyk', 'CrowdStrike', 'Plaid', 'Figma'];
      const targetsList = unicorns.map((u) => generateCompanyWithAi(u));
      importTargets(targetsList);
      setIsGenerating(false);
      setIsAddTargetOpen(false);

      try {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      } catch (e) {
        // ignore
      }
    }, 800);
  };

  // Handle Manual Target Creation
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('warning', 'Missing Name', 'Company Name is required.');
      return;
    }

    const targetArr = Number(arr);
    const targetEv = Number((targetArr * Number(evArrMultiple)).toFixed(1));
    const ruleOf40 = Number(growth) + Number(ebitdaMargin);

    const newTarget: TargetCompany = {
      id: `tgt-${Date.now()}`,
      name: name.trim(),
      codeName: codeName.trim() || `Project ${name.slice(0, 4).toUpperCase()}`,
      foundedYear: 2020,
      headcount: Math.round(targetArr * 4),
      sector,
      subSector: subSector.trim() || `${sector} Solutions`,
      headquarters: {
        city: city.trim(),
        country: country.trim(),
        region,
      },
      ownership,
      dealReadiness: readiness,
      tagline: tagline.trim() || `Enterprise platform in ${sector}`,
      executiveSummary: `${name.trim()} provides high-value capabilities in ${sector}.`,
      investmentThesis: `Strategic acquisition targets strong accretion and footprint expansion in ${subSector}.`,
      keyCustomers: ['Enterprise Account 1', 'Global Tech Co', 'Mid-Market Partner'],
      techStack: ['Python', 'TypeScript', 'AWS Cloud', 'PostgreSQL'],
      patentsCount: 4,
      financials: {
        arr: targetArr,
        revenueLTM: Number((targetArr * 0.95).toFixed(1)),
        revenueGrowthYoY: Number(growth),
        grossMargin: 80.0,
        ebitdaLTM: Number((targetArr * (Number(ebitdaMargin) / 100)).toFixed(1)),
        ebitdaMargin: Number(ebitdaMargin),
        fcfLTM: Number((targetArr * 0.12).toFixed(1)),
        ruleOf40,
        netDollarRetention: 120.0,
        cacPaybackMonths: 12.0,
        ltvCac: 5.0,
        customerCount: 120,
        top3CustomerConcentration: 20.0,
      },
      valuation: {
        evArrMultiple: Number(evArrMultiple),
        evEbitdaMultiple: Number(ebitdaMargin) > 0 ? Number((targetEv / (targetArr * (Number(ebitdaMargin) / 100))).toFixed(1)) : -1,
        targetEnterpriseValue: targetEv,
        dcfImpliedEv: Number((targetEv * 0.98).toFixed(1)),
        precedentTransactionMultiple: Number((Number(evArrMultiple) + 0.4).toFixed(1)),
        suggestedOfferRange: {
          low: Number((targetEv * 0.9).toFixed(1)),
          midpoint: targetEv,
          high: Number((targetEv * 1.1).toFixed(1)),
        },
      },
      strategicFit: {
        overallScore: Number(strategicFit),
        techStackSynergy: 88,
        marketExpansion: 90,
        culturalCompatibility: 87,
        talentIPRetention: 89,
        potentialSynergiesRunRateM: Number((targetArr * 0.35).toFixed(1)),
      },
      historicalFinancials: [
        { year: '2023', revenue: Number((targetArr * 0.6).toFixed(1)), grossProfit: Number((targetArr * 0.48).toFixed(1)), ebitda: 0.5, fcf: 0.4 },
        { year: '2024', revenue: Number((targetArr * 0.95).toFixed(1)), grossProfit: Number((targetArr * 0.76).toFixed(1)), ebitda: Number((targetArr * (Number(ebitdaMargin) / 100)).toFixed(1)), fcf: 2.0 },
        { year: '2025 (P)', revenue: Number((targetArr * 1.35).toFixed(1)), grossProfit: Number((targetArr * 1.08).toFixed(1)), ebitda: Number((targetArr * 0.22).toFixed(1)), fcf: 3.5 },
      ],
      risks: [
        {
          id: 'r-manual-1',
          category: 'Valuation Gap',
          severity: 'Medium',
          title: 'Multiple Negotiation',
          description: 'Sponsor valuation expectations subject to confirmatory DD.',
          mitigation: 'Incorporate earnout milestones.',
        },
      ],
      synergies: [
        {
          id: 's-manual-1',
          type: 'Revenue',
          title: 'Direct Cross-Sell Integration',
          annualValueM: Number((targetArr * 0.25).toFixed(1)),
          timeToRealizeMonths: 12,
          difficulty: 'Low',
          description: 'Bundle into flagship customer accounts.',
        },
      ],
      logoColor: '#3b82f6',
      logoAccent: '#60a5fa',
    };

    addTarget(newTarget);
    setIsAddTargetOpen(false);
  };

  // Handle CSV Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          showToast('warning', 'Invalid File', 'CSV must contain a header and at least one company row.');
          return;
        }

        const newImportedTargets: TargetCompany[] = [];
        // Skip header
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
          if (cols.length < 5) continue;

          const companyName = cols[0];
          const codeName = cols[1] || `Project ${companyName.slice(0, 4).toUpperCase()}`;
          const targetSector = (cols[2] as Sector) || 'Enterprise AI';
          const targetArr = parseFloat(cols[3]) || 25.0;
          const targetGrowth = parseFloat(cols[4]) || 40.0;
          const multiple = parseFloat(cols[5]) || 8.0;
          const targetEv = Number((targetArr * multiple).toFixed(1));

          newImportedTargets.push({
            id: `import-${Date.now()}-${i}`,
            name: companyName,
            codeName,
            foundedYear: 2021,
            headcount: Math.round(targetArr * 4),
            sector: targetSector,
            subSector: cols[6] || `${targetSector} Platform`,
            headquarters: {
              city: cols[7] || 'San Francisco, CA',
              country: 'United States',
              region: 'North America',
            },
            ownership: 'VC Series B/C',
            dealReadiness: 'Approachable (Warm Intro)',
            tagline: `Imported target company in ${targetSector}`,
            executiveSummary: `${companyName} is an enterprise target sourced via bulk import.`,
            investmentThesis: `Strategic fit within ${targetSector} portfolio.`,
            keyCustomers: ['Enterprise Client A', 'Partner B'],
            techStack: ['Python', 'TypeScript', 'AWS'],
            patentsCount: 3,
            financials: {
              arr: targetArr,
              revenueLTM: Number((targetArr * 0.9).toFixed(1)),
              revenueGrowthYoY: targetGrowth,
              grossMargin: 80.0,
              ebitdaLTM: Number((targetArr * 0.1).toFixed(1)),
              ebitdaMargin: 10.0,
              fcfLTM: Number((targetArr * 0.08).toFixed(1)),
              ruleOf40: targetGrowth + 10,
              netDollarRetention: 122.0,
              cacPaybackMonths: 12.0,
              ltvCac: 5.2,
              customerCount: 110,
              top3CustomerConcentration: 18.0,
            },
            valuation: {
              evArrMultiple: multiple,
              evEbitdaMultiple: 35.0,
              targetEnterpriseValue: targetEv,
              dcfImpliedEv: targetEv,
              precedentTransactionMultiple: multiple + 0.5,
              suggestedOfferRange: {
                low: Number((targetEv * 0.9).toFixed(1)),
                midpoint: targetEv,
                high: Number((targetEv * 1.1).toFixed(1)),
              },
            },
            strategicFit: {
              overallScore: 89,
              techStackSynergy: 87,
              marketExpansion: 91,
              culturalCompatibility: 88,
              talentIPRetention: 90,
              potentialSynergiesRunRateM: Number((targetArr * 0.35).toFixed(1)),
            },
            historicalFinancials: [
              { year: '2023', revenue: Number((targetArr * 0.6).toFixed(1)), grossProfit: Number((targetArr * 0.48).toFixed(1)), ebitda: 0.5, fcf: 0.4 },
              { year: '2024', revenue: Number((targetArr * 0.9).toFixed(1)), grossProfit: Number((targetArr * 0.72).toFixed(1)), ebitda: Number((targetArr * 0.1).toFixed(1)), fcf: 1.0 },
              { year: '2025 (P)', revenue: targetArr, grossProfit: Number((targetArr * 0.8).toFixed(1)), ebitda: Number((targetArr * 0.18).toFixed(1)), fcf: 2.5 },
            ],
            risks: [],
            synergies: [],
            logoColor: '#10b981',
            logoAccent: '#34d399',
          });
        }

        if (newImportedTargets.length > 0) {
          importTargets(newImportedTargets);
          setIsAddTargetOpen(false);
          try {
            confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
          } catch (e) {
            // ignore
          }
        } else {
          showToast('warning', 'Parsing Failed', 'Could not parse company rows from CSV.');
        }
      } catch (err) {
        showToast('warning', 'Error Parsing File', 'Please verify CSV format.');
      }
    };
    reader.readAsText(file);
  };

  const downloadSampleCsv = () => {
    const sample = `Name,CodeName,Sector,ARR_M,Growth_YoY_Pct,EV_ARR_Multiple,SubSector,City\n"Veritas Data Mesh","Project Veritas","Enterprise AI",32.5,65.0,9.5,"Data Governance","Seattle, WA"\n"ShieldGuard Zero Trust","Project Shield","Cybersecurity",44.0,52.0,8.8,"Identity Mesh","Austin, TX"\n"Novapay Rails","Project Nova","FinTech & Payments",58.0,30.0,6.5,"B2B Real-time Settlement","London, UK"`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_mna_targets_import.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAddTargetOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '920px', maxHeight: '92vh' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.95)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}>
              <PlusCircle size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Ingest & Discover New Target Companies</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Add proprietary targets via AI URL Profiler, manual deal entry, bulk CSV import, or enterprise API feeds.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddTargetOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 28px',
          background: 'rgba(11, 17, 32, 0.8)',
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto',
        }}>
          <button
            onClick={() => setActiveTab('ai-profiler')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'ai-profiler' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              borderColor: activeTab === 'ai-profiler' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'ai-profiler' ? '#ffffff' : 'var(--text-muted)',
            }}
          >
            <Sparkles size={14} color="var(--accent-cyan)" />
            <span>AI Smart Target Profiler</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'manual' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              borderColor: activeTab === 'manual' ? 'var(--accent-emerald)' : 'transparent',
              color: activeTab === 'manual' ? '#ffffff' : 'var(--text-muted)',
            }}
          >
            <PlusCircle size={14} color="var(--accent-emerald)" />
            <span>Manual Deal Form</span>
          </button>

          <button
            onClick={() => setActiveTab('csv')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'csv' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              borderColor: activeTab === 'csv' ? 'var(--accent-violet)' : 'transparent',
              color: activeTab === 'csv' ? '#ffffff' : 'var(--text-muted)',
            }}
          >
            <Upload size={14} color="#c084fc" />
            <span>Bulk CSV / JSON Import</span>
          </button>

          <button
            onClick={() => setActiveTab('api-feeds')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'api-feeds' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              borderColor: activeTab === 'api-feeds' ? 'var(--accent-amber)' : 'transparent',
              color: activeTab === 'api-feeds' ? '#ffffff' : 'var(--text-muted)',
            }}
          >
            <Database size={14} color="var(--accent-amber)" />
            <span>How Production Feeds Work</span>
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '28px', overflowY: 'auto' }}>
          {/* TAB 1: AI INSTANT COMPANY PROFILER */}
          {activeTab === 'ai-profiler' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="var(--accent-cyan)" />
                  Instant M&A Dossier Synthesis
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Enter any company name or domain (e.g. <em>Wiz, SentinelOne, Datadog, Brex, Ramp</em>, or any private startup). Our precision engine instantly calculates project code names, benchmark multiples, 5-year financials, risk matrix, and strategic synergy scorecards.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                    Company Name or Web Domain *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wiz, Stripe, Ramp, Anthropic, Datadog, Figma, or ANY company..."
                    value={aiCompanyName}
                    onChange={(e) => setAiCompanyName(e.target.value)}
                    className="input-text"
                  />
                  {/* Quick Real-World Presets */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Quick Presets:</span>
                    {['Wiz', 'Stripe', 'Ramp', 'Anthropic', 'Datadog', 'Figma', 'Supabase', 'CrowdStrike'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setAiCompanyName(preset);
                          if (preset === 'Wiz' || preset === 'CrowdStrike') setAiSector('Cybersecurity');
                          else if (preset === 'Stripe' || preset === 'Ramp') setAiSector('FinTech & Payments');
                          else if (preset === 'Anthropic' || preset === 'Figma') setAiSector('Enterprise AI');
                          else if (preset === 'Datadog' || preset === 'Supabase') setAiSector('DevOps & Cloud Infra');
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '12px',
                          padding: '2px 8px',
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                    Sector Vertical
                  </label>
                  <select
                    value={aiSector}
                    onChange={(e) => setAiSector(e.target.value as Sector)}
                    className="input-text"
                  >
                    <option value="Enterprise AI">Enterprise AI</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="FinTech & Payments">FinTech & Payments</option>
                    <option value="HealthTech & Bio">HealthTech & Bio</option>
                    <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                    <option value="CleanTech & Energy">CleanTech & Energy</option>
                    <option value="DevOps & Cloud Infra">DevOps & Cloud Infra</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Product Offering or Value Proposition (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autonomous cloud vulnerability discovery and eBPF kernel security"
                  value={aiTagline}
                  onChange={(e) => setAiTagline(e.target.value)}
                  className="input-text"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Estimated Current ARR Scale ($M):</span>
                  <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    ${aiArrEstimate}M ARR
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={aiArrEstimate}
                  onChange={(e) => setAiArrEstimate(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={handleBatchIngestUnicorns}
                  disabled={isGenerating}
                  className="btn btn-secondary btn-sm"
                  title="Batch generate top 10 market leaders (Wiz, Stripe, Ramp, Anthropic, Datadog, etc.)"
                >
                  <Zap size={14} color="var(--accent-amber)" />
                  <span>{isGenerating ? 'Synthesizing...' : '⚡ Batch Ingest Top 10 Tech Leaders'}</span>
                </button>

                <button
                  onClick={handleGenerateAiTarget}
                  disabled={isGenerating}
                  className="btn btn-primary"
                  style={{ minWidth: '220px' }}
                >
                  <Sparkles size={16} />
                  <span>{isGenerating ? 'Synthesizing Dossier...' : 'Generate & Ingest Target'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL DEAL ENTRY FORM */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Security Inc"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-text"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    M&A Confidential Code Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Project Orion"
                    value={codeName}
                    onChange={(e) => setCodeName(e.target.value)}
                    className="input-text"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Sector
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as Sector)}
                    className="input-text"
                  >
                    <option value="Enterprise AI">Enterprise AI</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="FinTech & Payments">FinTech & Payments</option>
                    <option value="HealthTech & Bio">HealthTech & Bio</option>
                    <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                    <option value="CleanTech & Energy">CleanTech & Energy</option>
                    <option value="DevOps & Cloud Infra">DevOps & Cloud Infra</option>
                  </select>
                </div>
              </div>

              {/* Financial Metrics */}
              <div style={{
                background: '#0b1120',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '14px',
              }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                    ARR ($M)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={arr}
                    onChange={(e) => setArr(Number(e.target.value))}
                    className="input-text"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                    YoY Growth (%)
                  </label>
                  <input
                    type="number"
                    value={growth}
                    onChange={(e) => setGrowth(Number(e.target.value))}
                    className="input-text"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                    EBITDA Margin (%)
                  </label>
                  <input
                    type="number"
                    value={ebitdaMargin}
                    onChange={(e) => setEbitdaMargin(Number(e.target.value))}
                    className="input-text"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                    EV / ARR Multiple (x)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={evArrMultiple}
                    onChange={(e) => setEvArrMultiple(Number(e.target.value))}
                    className="input-text"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Ownership Structure
                  </label>
                  <select
                    value={ownership}
                    onChange={(e) => setOwnership(e.target.value as OwnershipType)}
                    className="input-text"
                  >
                    <option value="VC Series B/C">VC Series B/C</option>
                    <option value="Founder-Led">Founder-Led</option>
                    <option value="PE Sponsor-Backed">PE Sponsor-Backed</option>
                    <option value="Bootstrap">Bootstrap</option>
                    <option value="Public Carve-Out">Public Carve-Out</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Deal Readiness
                  </label>
                  <select
                    value={readiness}
                    onChange={(e) => setReadiness(e.target.value as DealReadiness)}
                    className="input-text"
                  >
                    <option value="Immediate (Active Process)">Immediate (Active Process)</option>
                    <option value="Approachable (Warm Intro)">Approachable (Warm Intro)</option>
                    <option value="Stealth (Unsolicited)">Stealth (Unsolicited)</option>
                    <option value="Pre-Auction Market Check">Pre-Auction Market Check</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn btn-emerald">
                  <Check size={14} />
                  <span>Save Target to Platform</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BULK CSV / JSON IMPORT */}
          {activeTab === 'csv' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                border: '2px dashed var(--border-hover)',
                borderRadius: 'var(--radius-lg)',
                padding: '40px 24px',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer',
                position: 'relative',
              }}>
                <input
                  type="file"
                  accept=".csv,.txt,.json"
                  onChange={handleFileUpload}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    cursor: 'pointer',
                    width: '100%',
                    height: '100%',
                  }}
                />
                <Upload size={36} color="var(--accent-cyan)" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                  Upload Target Dataset (.CSV or .JSON)
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Drag and drop your spreadsheet here or click to browse files from your computer.
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#0b1120',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} color="var(--accent-emerald)" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                      Download Official M&A CSV Template
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
                      Pre-formatted schema with columns for Name, Sector, ARR, YoY Growth, and Multiples.
                    </div>
                  </div>
                </div>

                <button onClick={downloadSampleCsv} className="btn btn-secondary btn-sm">
                  <Download size={13} />
                  <span>Download Template</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCTION API FEEDS ARCHITECTURE */}
          {activeTab === 'api-feeds' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                How Real-World M&A Platforms Continuously Ingest Companies
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                In institutional private equity, corporate development, and investment banking, companies enter the discovery radar through <strong>4 primary automated ingestion channels</strong>:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#0b1120', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Database size={16} />
                    1. Financial Market APIs
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
                    Connects to <strong>PitchBook API</strong>, <strong>S&P Capital IQ</strong>, <strong>Crunchbase Enterprise</strong>, or <strong>SEC EDGAR API</strong> to pull financials, cap tables, valuation rounds, and shareholder registries.
                  </p>
                </div>

                <div style={{ background: '#0b1120', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Globe size={16} />
                    2. Web Crawlers & AI Extraction
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
                    Automated web scrapers inspect B2B company homepages, docs, pricing pages, and customer testimonials, using LLMs to structure unstructured text into ARR and product tags.
                  </p>
                </div>

                <div style={{ background: '#0b1120', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Cpu size={16} />
                    3. Alternative Growth Signals
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
                    Telemetry on job opening surges (headcount scaling), USPTO patent filings, open-source GitHub star velocity, and G2 customer reviews signals breakout candidates.
                  </p>
                </div>

                <div style={{ background: '#0b1120', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Layers size={16} />
                    4. Deal Room & Broker Integrations
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
                    Direct CRM connectors (Salesforce, DealCloud) and Virtual Data Room (VDR) feeds (Datasite, Intralinks) where investment bankers submit Confidential Information Memos (CIMs).
                  </p>
                </div>
              </div>

              <div style={{
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: '#e2e8f0',
              }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>AWS Cloud Pipeline: </strong>
                When hosted on AWS, you can configure an <strong>AWS Lambda function + Amazon API Gateway</strong> endpoint (`/api/targets/webhook`) that automatically receives inbound companies from any webhook and writes them into Amazon DynamoDB or S3.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
