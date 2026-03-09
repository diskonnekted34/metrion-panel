/**
 * AlertService — Data Access Layer
 *
 * Uses mock data when isMockEnabled() is true.
 * Otherwise delegates to API endpoints.
 */

import { alertsData, type Alert } from "@/data/alerts";
import { isMockEnabled } from "@/lib/env";

export const AlertService = {
  // Sync methods (mock-only, used by existing consumers)
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

  // Async methods (API-ready)
  async fetchAll(): Promise<Alert[]> {
    if (isMockEnabled()) return alertsData;
    // When backend is connected:
    // const res = await apiGet<ApiResponse<Alert[]>>(API_ROUTES.alerts.alerts);
    // return res.data;
    return alertsData; // Temporary: still using mock until backend endpoint exists
  },

  async fetchById(id: string): Promise<Alert | undefined> {
    if (isMockEnabled()) return alertsData.find(a => a.id === id);
    return alertsData.find(a => a.id === id);
  },

  async fetchUnresolved(): Promise<Alert[]> {
    return alertsData.filter(a => !a.resolved);
  },

  async fetchCritical(): Promise<Alert[]> {
    return alertsData.filter(a => a.category === "critical" && !a.resolved);
  },
};
