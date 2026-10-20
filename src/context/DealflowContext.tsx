import React, { createContext, useContext, useState, useEffect } from 'react';
import { TargetCompany, PipelineDeal, DealStage, PriorityLevel, AcquirerProfile, ScreenerFilterState } from '../types/mna';
import { MOCK_TARGETS } from '../data/mockTargets';
import { CURRENT_ACQUIRER, INITIAL_PIPELINE } from '../data/acquirerProfile';

export type AppView = 'dashboard' | 'screener' | 'pipeline' | 'compare' | 'aws-guide';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface DealflowContextType {
  targets: TargetCompany[];
  pipeline: PipelineDeal[];
  acquirer: AcquirerProfile;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedTarget: TargetCompany | null;
  setSelectedTarget: (target: TargetCompany | null) => void;
  compareTargets: TargetCompany[];
  addToCompare: (target: TargetCompany) => void;
  removeFromCompare: (targetId: string) => void;
  clearCompare: () => void;
  
  // Target Ingestion & Management
  addTarget: (target: TargetCompany) => void;
  importTargets: (imported: TargetCompany[]) => void;
  resetTargets: () => void;
  isAddTargetOpen: boolean;
  setIsAddTargetOpen: (open: boolean) => void;

  // Pipeline management
  addToPipeline: (targetId: string, stage?: DealStage, priority?: PriorityLevel) => void;
  updateDealStage: (pipelineId: string, newStage: DealStage) => void;
  updateDealPriority: (pipelineId: string, newPriority: PriorityLevel) => void;
  addDealNote: (pipelineId: string, noteText: string) => void;
  removeFromPipeline: (pipelineId: string) => void;

  // Filters
  filterState: ScreenerFilterState;
  setFilterState: React.Dispatch<React.SetStateAction<ScreenerFilterState>>;
  resetFilters: () => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
  dismissToast: (id: string) => void;
}

const DEFAULT_FILTERS: ScreenerFilterState = {
  searchQuery: '',
  sectors: [],
  regions: [],
  ownershipTypes: [],
  dealReadiness: [],
  minArr: 0,
  maxArr: 100,
  minRevenueGrowth: 0,
  minEbitdaMargin: -30,
  minRuleOf40: 0,
  maxEvArr: 20,
  minStrategicFit: 0,
  onlyHighSynergy: false,
};

const DealflowContext = createContext<DealflowContextType | undefined>(undefined);

export const DealflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [targets, setTargets] = useState<TargetCompany[]>(() => {
    const saved = localStorage.getItem('aura_mna_targets');
    return saved ? JSON.parse(saved) : MOCK_TARGETS;
  });
  const [pipeline, setPipeline] = useState<PipelineDeal[]>(() => {
    const saved = localStorage.getItem('aura_mna_pipeline');
    return saved ? JSON.parse(saved) : INITIAL_PIPELINE;
  });
  const [acquirer] = useState<AcquirerProfile>(CURRENT_ACQUIRER);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedTarget, setSelectedTarget] = useState<TargetCompany | null>(null);
  const [compareTargetIds, setCompareTargetIds] = useState<string[]>(['tgt-01', 'tgt-02']);
  const [filterState, setFilterState] = useState<ScreenerFilterState>(DEFAULT_FILTERS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAddTargetOpen, setIsAddTargetOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('aura_mna_targets', JSON.stringify(targets));
  }, [targets]);

  useEffect(() => {
    localStorage.setItem('aura_mna_pipeline', JSON.stringify(pipeline));
  }, [pipeline]);

  const showToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCompare = (target: TargetCompany) => {
    if (compareTargetIds.includes(target.id)) {
      showToast('info', 'Already in Comparison', `${target.name} is already in the comparison tray.`);
      return;
    }
    if (compareTargetIds.length >= 3) {
      showToast('warning', 'Comparison Limit Reached', 'You can compare a maximum of 3 targets simultaneously.');
      return;
    }
    setCompareTargetIds((prev) => [...prev, target.id]);
    showToast('success', 'Added to Comparison', `${target.name} (${target.codeName}) added to comparison.`);
  };

  const removeFromCompare = (targetId: string) => {
    setCompareTargetIds((prev) => prev.filter((id) => id !== targetId));
  };

  const clearCompare = () => {
    setCompareTargetIds([]);
  };

  const compareTargets = targets.filter((t) => compareTargetIds.includes(t.id));

  const addToPipeline = (targetId: string, stage: DealStage = 'Longlist', priority: PriorityLevel = 'High') => {
    const target = targets.find((t) => t.id === targetId);
    if (!target) return;

    const existing = pipeline.find((p) => p.targetId === targetId);
    if (existing) {
      showToast('info', 'Active Deal Found', `${target.name} is already in the pipeline at stage: ${existing.stage}.`);
      return;
    }

    const newDeal: PipelineDeal = {
      id: `pipe-${Date.now()}`,
      targetId,
      stage,
      priority,
      dealLead: 'Corporate Development Team',
      addedDate: new Date().toISOString().slice(0, 10),
      nextMilestone: 'Initial internal underwriting review',
      targetClosingDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      expectedValuationM: target.valuation.targetEnterpriseValue,
      notes: [`Initiated precision discovery review for ${target.name}.`],
      lastUpdated: new Date().toISOString().slice(0, 10),
    };

    setPipeline((prev) => [newDeal, ...prev]);
    showToast('success', 'Added to M&A Pipeline', `${target.name} has entered stage: ${stage}`);
  };

  const updateDealStage = (pipelineId: string, newStage: DealStage) => {
    setPipeline((prev) =>
      prev.map((deal) => {
        if (deal.id === pipelineId) {
          const target = targets.find((t) => t.id === deal.targetId);
          showToast('success', 'Pipeline Stage Updated', `${target?.name || 'Deal'} moved to ${newStage}`);
          return {
            ...deal,
            stage: newStage,
            lastUpdated: new Date().toISOString().slice(0, 10),
          };
        }
        return deal;
      })
    );
  };

  const updateDealPriority = (pipelineId: string, newPriority: PriorityLevel) => {
    setPipeline((prev) =>
      prev.map((deal) =>
        deal.id === pipelineId
          ? { ...deal, priority: newPriority, lastUpdated: new Date().toISOString().slice(0, 10) }
          : deal
      )
    );
  };

  const addDealNote = (pipelineId: string, noteText: string) => {
    if (!noteText.trim()) return;
    setPipeline((prev) =>
      prev.map((deal) =>
        deal.id === pipelineId
          ? {
              ...deal,
              notes: [noteText.trim(), ...deal.notes],
              lastUpdated: new Date().toISOString().slice(0, 10),
            }
          : deal
      )
    );
    showToast('info', 'Deal Note Logged', 'Underwriting note saved to pipeline record.');
  };

  const removeFromPipeline = (pipelineId: string) => {
    setPipeline((prev) => prev.filter((d) => d.id !== pipelineId));
    showToast('info', 'Deal Archived', 'Target removed from active deal pipeline.');
  };

  const resetFilters = () => {
    setFilterState(DEFAULT_FILTERS);
  };

  const addTarget = (newTarget: TargetCompany) => {
    setTargets((prev) => [newTarget, ...prev]);
    showToast('success', 'Target Ingested', `${newTarget.name} (${newTarget.codeName}) added to target universe.`);
  };

  const importTargets = (imported: TargetCompany[]) => {
    setTargets((prev) => [...imported, ...prev]);
    showToast('success', 'Bulk Import Complete', `Successfully imported ${imported.length} new company targets.`);
  };

  const resetTargets = () => {
    setTargets(MOCK_TARGETS);
    localStorage.removeItem('aura_mna_targets');
    showToast('info', 'Universe Reset', 'Restored default benchmark targets.');
  };

  return (
    <DealflowContext.Provider
      value={{
        targets,
        pipeline,
        acquirer,
        currentView,
        setCurrentView,
        selectedTarget,
        setSelectedTarget,
        compareTargets,
        addToCompare,
        removeFromCompare,
        clearCompare,
        addTarget,
        importTargets,
        resetTargets,
        isAddTargetOpen,
        setIsAddTargetOpen,
        addToPipeline,
        updateDealStage,
        updateDealPriority,
        addDealNote,
        removeFromPipeline,
        filterState,
        setFilterState,
        resetFilters,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </DealflowContext.Provider>
  );
};

export const useDealflow = () => {
  const context = useContext(DealflowContext);
  if (!context) {
    throw new Error('useDealflow must be used within a DealflowProvider');
  }
  return context;
};
