/**
 * OKR Context
 * Provides OKR state management with plan-based feature gating.
 * Integrates with TenantContext for tenant isolation and PackContext for plan enforcement.
 */

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import {
  OKRCycle, Objective, KeyResult, OKRLink, CorrectiveDecisionDraft,
  StrategicHealthIndex, DepartmentAlignment, OKRPlanLevel, getOKRPlanLevel,
  OKR_PLAN_LIMITS,
} from "../types/okr";
import {
  recalculateObjectiveHealth, generateCorrectiveDecisionDraft,
  calculateStrategicHealthIndex, calculateDepartmentAlignments,
  canAccessOKR, canUseHierarchy, canUseAICorrection, canUseMultiCycle, canUseAlignment,
} from "../engine/okr";
import { seedCycles, seedObjectives, seedKeyResults, seedOKRLinks, seedCorrectiveDrafts } from "../data/okrSeed";
import { usePacks } from "@/contexts/PackContext";
import { useTenant } from "./TenantContext";

interface OKRContextValue {
  // Plan gating
  planLevel: OKRPlanLevel;
  isOKREnabled: boolean;
  isHierarchyEnabled: boolean;
  isAICorrectionEnabled: boolean;
  isMultiCycleEnabled: boolean;
  isAlignmentEnabled: boolean;

  // Data
  cycles: OKRCycle[];
  objectives: Objective[];
  keyResults: KeyResult[];
  links: OKRLink[];
  correctiveDrafts: CorrectiveDecisionDraft[];

  // Computed
  strategicHealthIndex: StrategicHealthIndex;
  departmentAlignments: DepartmentAlignment[];

  // Filters
  activeCycleId: string | null;
  setActiveCycleId: (id: string) => void;
  activeCycles: OKRCycle[];
  objectivesForCycle: (cycleId: string) => Objective[];
  keyResultsForObjective: (objectiveId: string) => KeyResult[];
  strategicObjectives: Objective[];
  tacticalObjectives: Objective[];
  atRiskObjectives: Objective[];
  childObjectives: (parentId: string) => Objective[];

  // Mutations
  recalculateHealth: (objectiveId: string) => void;
  generateCorrectionDraft: (objectiveId: string) => CorrectiveDecisionDraft | null;
  updateObjectiveStatus: (objectiveId: string, status: Objective["status"]) => void;
  updateCorrectionDraftStatus: (draftId: string, status: CorrectiveDecisionDraft["status"]) => void;
}

const OKRContext = createContext<OKRContextValue | null>(null);

export const useOKR = () => {
  const ctx = useContext(OKRContext);
  if (!ctx) throw new Error("useOKR must be used within OKRProvider");
  return ctx;
};

export const OKRProvider = ({ children }: { children: ReactNode }) => {
  const { tenant, tenantId } = useTenant();
  const { currentTierId } = usePacks();

  const planLevel = getOKRPlanLevel(currentTierId);
  const isOKREnabled = canAccessOKR(planLevel);
  const isHierarchyEnabled = canUseHierarchy(planLevel);
  const isAICorrectionEnabled = canUseAICorrection(planLevel);
  const isMultiCycleEnabled = canUseMultiCycle(planLevel);
  const isAlignmentEnabled = canUseAlignment(planLevel);

  const [cycles] = useState<OKRCycle[]>(seedCycles);
  const [objectives, setObjectives] = useState<Objective[]>(seedObjectives);
  const [keyResults] = useState<KeyResult[]>(seedKeyResults);
  const [links] = useState<OKRLink[]>(seedOKRLinks);
  const [correctiveDrafts, setCorrectiveDrafts] = useState<CorrectiveDecisionDraft[]>(seedCorrectiveDrafts);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(
    cycles.find(c => c.status === "active")?.id || null
  );

  const activeCycles = useMemo(() => {
    if (!isMultiCycleEnabled) {
      const active = cycles.find(c => c.status === "active");
      return active ? [active] : [];
    }
    return cycles.filter(c => c.status === "active");
  }, [cycles, isMultiCycleEnabled]);

  const objectivesForCycle = useCallback((cycleId: string) =>
    objectives.filter(o => o.cycle_id === cycleId), [objectives]);

  const keyResultsForObjective = useCallback((objectiveId: string) =>
    keyResults.filter(kr => kr.objective_id === objectiveId), [keyResults]);

  const strategicObjectives = useMemo(() =>
    objectives.filter(o => o.level === "strategic"), [objectives]);

  const tacticalObjectives = useMemo(() =>
    objectives.filter(o => o.level === "tactical"), [objectives]);

  const atRiskObjectives = useMemo(() =>
    objectives.filter(o => o.deviation_flag || o.risk_score > 50), [objectives]);

  const childObjectives = useCallback((parentId: string) =>
    objectives.filter(o => o.parent_objective_id === parentId), [objectives]);

  const strategicHealthIndex = useMemo(() =>
    calculateStrategicHealthIndex(objectives), [objectives]);

  const departmentAlignments = useMemo(() =>
    isAlignmentEnabled ? calculateDepartmentAlignments(tacticalObjectives, strategicObjectives) : [],
    [tacticalObjectives, strategicObjectives, isAlignmentEnabled]);

  const recalculateHealth = useCallback((objectiveId: string) => {
    setObjectives(prev => prev.map(obj => {
      if (obj.id !== objectiveId) return obj;
      const krs = keyResults.filter(kr => kr.objective_id === objectiveId);
      const cycle = cycles.find(c => c.id === obj.cycle_id);
      if (!cycle) return obj;
      const updates = recalculateObjectiveHealth(obj, krs, cycle);
      return { ...obj, ...updates };
    }));
  }, [keyResults, cycles]);

  const generateCorrectionDraft = useCallback((objectiveId: string): CorrectiveDecisionDraft | null => {
    if (!isAICorrectionEnabled) return null;
    const obj = objectives.find(o => o.id === objectiveId);
    if (!obj) return null;
    const draft = generateCorrectiveDecisionDraft(obj, tenantId);
    if (draft) {
      setCorrectiveDrafts(prev => [...prev, draft]);
    }
    return draft;
  }, [objectives, tenantId, isAICorrectionEnabled]);

  const updateObjectiveStatus = useCallback((objectiveId: string, status: Objective["status"]) => {
    setObjectives(prev => prev.map(o =>
      o.id === objectiveId ? { ...o, status } : o
    ));
  }, []);

  const updateCorrectionDraftStatus = useCallback((draftId: string, status: CorrectiveDecisionDraft["status"]) => {
    setCorrectiveDrafts(prev => prev.map(d =>
      d.id === draftId ? { ...d, status } : d
    ));
  }, []);

  return (
    <OKRContext.Provider value={{
      planLevel, isOKREnabled, isHierarchyEnabled, isAICorrectionEnabled,
      isMultiCycleEnabled, isAlignmentEnabled,
      cycles, objectives, keyResults, links, correctiveDrafts,
      strategicHealthIndex, departmentAlignments,
      activeCycleId, setActiveCycleId, activeCycles,
      objectivesForCycle, keyResultsForObjective,
      strategicObjectives, tacticalObjectives, atRiskObjectives,
      childObjectives,
      recalculateHealth, generateCorrectionDraft,
      updateObjectiveStatus, updateCorrectionDraftStatus,
    }}>
      {children}
    </OKRContext.Provider>
  );
};
