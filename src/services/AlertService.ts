/**
 * AlertService — Data Access Layer
 *
 * Provides both sync and async methods.
 */

import { alertsData, type Alert } from "@/data/alerts";

export const AlertService = {
  // Sync methods (existing consumers)
  getAll(): Alert[] {
    return alertsData;
  },

  getById(id: string): Alert | undefined {
    return alertsData.find(a => a.id === id);
  },

  getUnresolved(): Alert[] {
    return alertsData.filter(a => !a.resolved);
  },

  getCritical(): Alert[] {
    return alertsData.filter(a => a.category === "critical" && !a.resolved);
  },

  // Async methods (future API replacement)
  async fetchAll(): Promise<Alert[]> {
    return Promise.resolve(alertsData);
  },

  async fetchById(id: string): Promise<Alert | undefined> {
    return Promise.resolve(alertsData.find(a => a.id === id));
  },

  async fetchUnresolved(): Promise<Alert[]> {
    return Promise.resolve(alertsData.filter(a => !a.resolved));
  },

  async fetchCritical(): Promise<Alert[]> {
    return Promise.resolve(
      alertsData.filter(a => a.category === "critical" && !a.resolved)
    );
  },
};
