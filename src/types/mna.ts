export type Sector = 
  | 'Enterprise AI'
  | 'Cybersecurity'
  | 'FinTech & Payments'
  | 'HealthTech & Bio'
  | 'Supply Chain & Logistics'
  | 'CleanTech & Energy'
  | 'DevOps & Cloud Infra';

export type OwnershipType = 
  | 'Founder-Led'
  | 'PE Sponsor-Backed'
  | 'VC Series B/C'
  | 'Public Carve-Out'
  | 'Public (Listed)'
  | 'Bootstrap';

export type DealReadiness = 
  | 'Immediate (Active Process)'
  | 'Approachable (Warm Intro)'
  | 'Stealth (Unsolicited)'
  | 'Pre-Auction Market Check';

export type DealStage = 
  | 'Longlist'
  | 'Screening'
  | 'Initial DD & Valuation'
  | 'IOI Submitted'
  | 'Confirmatory DD'
  | 'Closing & SPA';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Watchlist';

export interface FinancialYear {
  year: string;
  revenue: number; // in $M
  ebitda: number; // in $M
  grossProfit: number; // in $M
  fcf: number; // in $M
}

export interface RiskItem {
  id: string;
  category: 'Regulatory' | 'Customer Concentration' | 'Tech Debt' | 'Key-Man' | 'Valuation Gap';
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  mitigation: string;
}

export interface SynergyItem {
  id: string;
  type: 'Revenue' | 'Cost';
  title: string;
  annualValueM: number;
  timeToRealizeMonths: number;
  difficulty: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface TargetCompany {
  id: string;
  name: string;
  codeName: string; // M&A Project Confidential Name (e.g., "Project Cerberus")
  ticker?: string;
  foundedYear: number;
  headcount: number;
  sector: Sector;
  subSector: string;
  headquarters: {
    city: string;
    country: string;
    region: 'North America' | 'EMEA' | 'APAC' | 'LATAM';
  };
  ownership: OwnershipType;
  dealReadiness: DealReadiness;
  
  // Executive Overview
  tagline: string;
  executiveSummary: string;
  investmentThesis: string;
  keyCustomers: string[];
  techStack: string[];
  patentsCount: number;

  // Financial Metrics (in Millions USD or Percentages)
  financials: {
    arr: number; // Annual Recurring Revenue $M
    revenueLTM: number; // Last Twelve Months Revenue $M
    revenueGrowthYoY: number; // YoY Growth %
    grossMargin: number; // Gross Margin %
    ebitdaLTM: number; // EBITDA $M
    ebitdaMargin: number; // EBITDA Margin %
    fcfLTM: number; // Free Cash Flow $M
    ruleOf40: number; // Growth % + EBITDA Margin %
    netDollarRetention: number; // NDR %
    cacPaybackMonths: number; // Months
    ltvCac: number; // Ratio e.g., 4.2x
    customerCount: number;
    top3CustomerConcentration: number; // % of total revenue
  };

  // Valuation Benchmarks
  valuation: {
    evArrMultiple: number; // Enterprise Value / ARR
    evEbitdaMultiple: number; // EV / EBITDA
    targetEnterpriseValue: number; // Target EV in $M
    dcfImpliedEv: number; // DCF implied EV $M
    precedentTransactionMultiple: number; // EV/ARR multiple benchmark
    suggestedOfferRange: {
      low: number; // $M
      midpoint: number; // $M
      high: number; // $M
    };
  };

  // Strategic Fit & Proprietary Scoring (0-100)
  strategicFit: {
    overallScore: number;
    techStackSynergy: number;
    marketExpansion: number;
    culturalCompatibility: number;
    talentIPRetention: number;
    potentialSynergiesRunRateM: number; // Estimated annual value creation in $M
  };

  historicalFinancials: FinancialYear[];
  risks: RiskItem[];
  synergies: SynergyItem[];

  logoColor: string;
  logoAccent: string;
}

export interface PipelineDeal {
  id: string;
  targetId: string;
  stage: DealStage;
  priority: PriorityLevel;
  dealLead: string;
  addedDate: string;
  nextMilestone: string;
  targetClosingDate: string;
  expectedValuationM: number;
  notes: string[];
  lastUpdated: string;
}

export interface AcquirerProfile {
  name: string;
  shortCode: string;
  marketCapM: number;
  annualRevenueM: number;
  ebitdaMargin: number;
  cashAndEquivalentsM: number;
  creditFacilityAvailableM: number;
  maxLeverageMultiple: number; // Debt / EBITDA ceiling
  strategicMandate: string;
  targetSectors: Sector[];
}

export interface ScreenerFilterState {
  searchQuery: string;
  sectors: Sector[];
  regions: ('North America' | 'EMEA' | 'APAC' | 'LATAM')[];
  ownershipTypes: OwnershipType[];
  dealReadiness: DealReadiness[];
  minArr: number;
  maxArr: number;
  minRevenueGrowth: number;
  minEbitdaMargin: number;
  minRuleOf40: number;
  maxEvArr: number;
  minStrategicFit: number;
  onlyHighSynergy: boolean;
}

export interface SynergySimulatorState {
  crossSellUptakePct: number; // 0% - 30%
  pricingPowerIncreasePct: number; // 0% - 15%
  cogsSavingsPct: number; // 0% - 25%
  sgaConsolidationPct: number; // 0% - 35%
  dealFinancing: {
    cashPct: number;
    equityPct: number;
    debtPct: number;
    debtInterestRatePct: number;
  };
}
