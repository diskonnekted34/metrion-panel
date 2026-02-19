import { decisions, type Decision, type DecisionLifecycle } from "@/data/decisions";

export const DecisionService = {
  getAll(): Decision[] {
    return decisions;
  },
  getById(id: string): Decision | undefined {
    return decisions.find(d => d.id === id);
  },
  getByLifecycle(lifecycle: DecisionLifecycle): Decision[] {
    return decisions.filter(d => d.lifecycle === lifecycle);
  },
  getPending(): Decision[] {
    return decisions.filter(d => d.lifecycle === "proposed" || d.lifecycle === "under_review");
  },
};
