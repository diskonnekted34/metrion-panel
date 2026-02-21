/**
 * OkrService — Data Access Layer
 *
 * Provides both sync and async methods.
 * Sync methods for existing consumers, async for future API replacement.
 */

import { seedObjectives, seedKeyResults, seedCycles } from "@/core/data/okrSeed";
import type { Objective, KeyResult, OKRCycle } from "@/core/types/okr";

export const OkrService = {
  // Sync methods (existing consumers)
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

  // Async methods (future API replacement)
  async fetchCycles(): Promise<OKRCycle[]> {
    return Promise.resolve(seedCycles);
  },

  async fetchObjectives(): Promise<Objective[]> {
    return Promise.resolve(seedObjectives);
  },

  async fetchKeyResults(): Promise<KeyResult[]> {
    return Promise.resolve(seedKeyResults);
  },

  async fetchObjectiveById(id: string): Promise<Objective | undefined> {
    return Promise.resolve(seedObjectives.find(o => o.id === id));
  },
};
