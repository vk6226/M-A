import { AcquirerProfile, PipelineDeal } from '../types/mna';

export const CURRENT_ACQUIRER: AcquirerProfile = {
  name: 'Apex Strategic Enterprise Group',
  shortCode: 'APEX',
  marketCapM: 14200.0,
  annualRevenueM: 1850.0,
  ebitdaMargin: 26.5,
  cashAndEquivalentsM: 680.0,
  creditFacilityAvailableM: 1200.0,
  maxLeverageMultiple: 3.5,
  strategicMandate:
    'Accelerate inorganic platform expansion across Mission-Critical Cybersecurity, Agentic AI Workflows, and Cross-Border FinTech Rails. Primary target profile: ARR between $25M-$70M, Net Retention >115%, Rule of 40 >50%, and strong strategic IP differentiation.',
  targetSectors: [
    'Cybersecurity',
    'Enterprise AI',
    'FinTech & Payments',
    'HealthTech & Bio',
    'DevOps & Cloud Infra',
    'Supply Chain & Logistics',
  ],
};

export const INITIAL_PIPELINE: PipelineDeal[] = [
  {
    id: 'pipe-01',
    targetId: 'tgt-01', // Aegis Sentinel
    stage: 'Confirmatory DD',
    priority: 'Critical',
    dealLead: 'Marcus Vance (MD, Corp Dev)',
    addedDate: '2026-08-15',
    nextMilestone: 'Quality of Earnings (QoE) Audit signoff & IP Code Audit review',
    targetClosingDate: '2026-12-15',
    expectedValuationM: 460.0,
    notes: [
      'Preliminary antitrust FTC review indicates minimal horizontal concentration risk.',
      'Customer calls completed with top 5 clients; Net Promoter Score is an outstanding 72.',
      'Special focus on retaining key eBPF security kernel engineers (12 engineers flagged for retention pool).',
    ],
    lastUpdated: '2026-10-18',
  },
  {
    id: 'pipe-02',
    targetId: 'tgt-02', // CognitiveCore AI
    stage: 'IOI Submitted',
    priority: 'Critical',
    dealLead: 'Elena Rostova (VP, AI Strategy)',
    addedDate: '2026-09-02',
    nextMilestone: 'Management presentation and preliminary valuation model review',
    targetClosingDate: '2027-01-30',
    expectedValuationM: 430.0,
    notes: [
      'Submitted non-binding IOI at $425M - $445M EV range with $50M performance earnout.',
      'Sponsor requested clarification on cloud compute GPU subsidies post-acquisition.',
    ],
    lastUpdated: '2026-10-19',
  },
  {
    id: 'pipe-03',
    targetId: 'tgt-07', // KubeMesh
    stage: 'Initial DD & Valuation',
    priority: 'High',
    dealLead: 'Sarah Chen (Director, Infrastructure)',
    addedDate: '2026-09-20',
    nextMilestone: 'DCF sensitivity analysis and founder equity rollover structure',
    targetClosingDate: '2027-02-28',
    expectedValuationM: 357.0,
    notes: [
      'Bootstrapped cap table makes transaction structure straightforward (no liquidation preferences).',
      'Cost synergies estimated at $7.5M annually just by deploying internally.',
    ],
    lastUpdated: '2026-10-14',
  },
  {
    id: 'pipe-04',
    targetId: 'tgt-03', // VelocePay
    stage: 'Screening',
    priority: 'High',
    dealLead: 'Julian Thorne (Principal, FinTech)',
    addedDate: '2026-10-01',
    nextMilestone: 'Initial teaser review with PE sponsor bank advisors',
    targetClosingDate: '2027-03-31',
    expectedValuationM: 400.0,
    notes: [
      'FCA & BaFin regulatory change-of-control requirements being reviewed by UK legal counsel.',
      'Generates $16.8M EBITDA immediately, accretive to cash flow.',
    ],
    lastUpdated: '2026-10-17',
  },
  {
    id: 'pipe-05',
    targetId: 'tgt-04', // SynapseBio
    stage: 'Longlist',
    priority: 'Medium',
    dealLead: 'Dr. Aris Thorne (Healthcare Fellow)',
    addedDate: '2026-10-10',
    nextMilestone: 'Confidentiality Agreement (NDA) execution',
    targetClosingDate: '2027-05-15',
    expectedValuationM: 390.0,
    notes: [
      'Unique proprietary dataset with 72 hospital networks; need deep dive on HIPAA safe harbor audit.',
    ],
    lastUpdated: '2026-10-16',
  },
];
