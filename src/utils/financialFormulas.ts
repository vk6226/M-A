import { AcquirerProfile, TargetCompany, SynergySimulatorState } from '../types/mna';

export function formatCurrency(value: number, decimals: number = 1): string {
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(decimals)}B`;
  }
  return `$${value.toFixed(decimals)}M`;
}

export function formatMultiple(value: number, decimals: number = 1): string {
  if (value < 0) return 'N/A';
  return `${value.toFixed(decimals)}x`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

export interface SynergyCalculationResult {
  revenueSynergyM: number;
  costSynergyM: number;
  totalRunRateSynergyM: number;
  postDealCombinedRevenueM: number;
  postDealCombinedEbitdaM: number;
  preDealAcquirerEbitdaM: number;
  postDealCombinedEbitdaMargin: number;
  effectivePurchasePriceM: number;
  debtIncurredM: number;
  cashUtilizedM: number;
  equityIssuedM: number;
  annualInterestCostM: number;
  estimatedNetIncomeAccretionPct: number;
  proFormaNetDebtToEbitda: number;
  postSynergyEffectiveMultiple: number;
}

export function calculateSynergyModel(
  acquirer: AcquirerProfile,
  target: TargetCompany,
  sim: SynergySimulatorState
): SynergyCalculationResult {
  const targetRevenue = target.financials.revenueLTM;
  const targetEbitda = target.financials.ebitdaLTM;
  const acquirerRevenue = acquirer.annualRevenueM;
  const acquirerEbitda = (acquirer.annualRevenueM * acquirer.ebitdaMargin) / 100;

  // Synergies
  // Revenue cross-sell: applied to target revenue base + acquirer relevant base
  const revenueSynergyM = targetRevenue * (sim.crossSellUptakePct / 100) + targetRevenue * (sim.pricingPowerIncreasePct / 100);
  
  // Cost synergies: COGS optimization + SG&A reduction
  const targetCogs = targetRevenue * (1 - target.financials.grossMargin / 100);
  const targetSga = targetRevenue - targetCogs - targetEbitda;
  const costSynergyM = Math.max(0, targetCogs * (sim.cogsSavingsPct / 100) + targetSga * (sim.sgaConsolidationPct / 100));

  const totalRunRateSynergyM = revenueSynergyM * 0.7 + costSynergyM; // ~70% flow-through on revenue synergies to EBITDA

  // Pro forma combined
  const postDealCombinedRevenueM = acquirerRevenue + targetRevenue + revenueSynergyM;
  const postDealCombinedEbitdaM = acquirerEbitda + targetEbitda + totalRunRateSynergyM;
  const postDealCombinedEbitdaMargin = (postDealCombinedEbitdaM / postDealCombinedRevenueM) * 100;

  // Financing breakdown
  const purchasePriceM = target.valuation.targetEnterpriseValue;
  const cashUtilizedM = purchasePriceM * (sim.dealFinancing.cashPct / 100);
  const debtIncurredM = purchasePriceM * (sim.dealFinancing.debtPct / 100);
  const equityIssuedM = purchasePriceM * (sim.dealFinancing.equityPct / 100);

  const annualInterestCostM = debtIncurredM * (sim.dealFinancing.debtInterestRatePct / 100);

  // Accretion / Dilution estimation (Tax-adjusted at standard 21% US corporate rate)
  const corporateTaxRate = 0.21;
  const acquirerStandaloneNetIncome = acquirerEbitda * 0.75 * (1 - corporateTaxRate); // rough proxy: D&A ~25%
  const targetStandaloneNetIncome = (targetEbitda > 0 ? targetEbitda * 0.8 : targetEbitda) * (1 - corporateTaxRate);
  const postTaxSynergies = totalRunRateSynergyM * (1 - corporateTaxRate);
  const postTaxInterestCost = annualInterestCostM * (1 - corporateTaxRate);

  const proFormaCombinedNetIncome =
    acquirerStandaloneNetIncome + targetStandaloneNetIncome + postTaxSynergies - postTaxInterestCost;
  
  // Equity dilution adjustment
  const acquirerSharePriceProxy = 100;
  const acquirerBaseShares = acquirer.marketCapM / acquirerSharePriceProxy;
  const newSharesIssued = equityIssuedM / acquirerSharePriceProxy;
  const proFormaShares = acquirerBaseShares + newSharesIssued;

  const standaloneEps = acquirerStandaloneNetIncome / acquirerBaseShares;
  const proFormaEps = proFormaCombinedNetIncome / proFormaShares;
  const estimatedNetIncomeAccretionPct = ((proFormaEps - standaloneEps) / standaloneEps) * 100;

  // Leverage
  const currentAcquirerNetDebt = Math.max(0, 450 - acquirer.cashAndEquivalentsM);
  const proFormaNetDebt = currentAcquirerNetDebt + debtIncurredM + cashUtilizedM;
  const proFormaNetDebtToEbitda = proFormaNetDebt / Math.max(1, postDealCombinedEbitdaM);

  // Post-Synergy Effective Multiple
  const postSynergyEffectiveMultiple =
    purchasePriceM / Math.max(1, targetEbitda + totalRunRateSynergyM);

  return {
    revenueSynergyM: Number(revenueSynergyM.toFixed(1)),
    costSynergyM: Number(costSynergyM.toFixed(1)),
    totalRunRateSynergyM: Number(totalRunRateSynergyM.toFixed(1)),
    postDealCombinedRevenueM: Number(postDealCombinedRevenueM.toFixed(1)),
    postDealCombinedEbitdaM: Number(postDealCombinedEbitdaM.toFixed(1)),
    preDealAcquirerEbitdaM: Number(acquirerEbitda.toFixed(1)),
    postDealCombinedEbitdaMargin: Number(postDealCombinedEbitdaMargin.toFixed(1)),
    effectivePurchasePriceM: purchasePriceM,
    debtIncurredM: Number(debtIncurredM.toFixed(1)),
    cashUtilizedM: Number(cashUtilizedM.toFixed(1)),
    equityIssuedM: Number(equityIssuedM.toFixed(1)),
    annualInterestCostM: Number(annualInterestCostM.toFixed(1)),
    estimatedNetIncomeAccretionPct: Number(estimatedNetIncomeAccretionPct.toFixed(2)),
    proFormaNetDebtToEbitda: Number(proFormaNetDebtToEbitda.toFixed(2)),
    postSynergyEffectiveMultiple: Number(postSynergyEffectiveMultiple.toFixed(1)),
  };
}
