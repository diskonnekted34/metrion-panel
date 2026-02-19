import { seedObjectives, seedKeyResults, seedCycles } from "@/core/data/okrSeed";
import type { Objective, KeyResult, OKRCycle } from "@/core/types/okr";

export const OkrService = {
  getCycles(): OKRCycle[] {
    return seedCycles;
  },
  getObjectives(): Objective[] {
    return seedObjectives;
  },
  getKeyResults(): KeyResult[] {
    return seedKeyResults;
  },
  getObjectiveById(id: string): Objective | undefined {
    return seedObjectives.find(o => o.id === id);
  },
};
