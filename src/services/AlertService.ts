import { alertsData, type Alert } from "@/data/alerts";

export const AlertService = {
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
};
