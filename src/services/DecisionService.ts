/**
 * DecisionService — Data Access Layer
 *
 * Provides both sync and async methods.
 */

import type { Decision } from "@/data/decisions";
import { decisions as allDecisions } from "@/data/decisions";

export const DecisionService = {
  // Sync methods (existing consumers)
  getAll(): Decision[] {
    return allDecisions;
  },

  getById(id: string): Decision | undefined {
    return allDecisions.find(d => d.id === id);
  },

  // Async methods (future API replacement)
  async fetchAll(): Promise<Decision[]> {
    return Promise.resolve(allDecisions);
  },

  async fetchById(id: string): Promise<Decision | undefined> {
    return Promise.resolve(allDecisions.find(d => d.id === id));
  },
};
