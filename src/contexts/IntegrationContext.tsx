import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Integration, IntegrationStatus, integrations as defaultIntegrations } from "@/data/integrations";
import { toast } from "sonner";

interface IntegrationContextType {
  integrations: Integration[];
  connectedIds: string[];
  connect: (id: string) => void;
  disconnect: (id: string) => void;
  syncManual: (id: string) => void;
  uploadCSV: (id: string, fileName: string) => void;
  getStatus: (id: string) => IntegrationStatus;
  isConnected: (id: string) => boolean;
  connectedCount: number;
  totalAvailable: number;
  hasAnyConnection: boolean;
  isDemoMode: boolean;
}

const IntegrationContext = createContext<IntegrationContextType | null>(null);

export const useIntegrations = () => {
  const ctx = useContext(IntegrationContext);
  if (!ctx) throw new Error("useIntegrations must be used within IntegrationProvider");
  return ctx;
};

export const IntegrationProvider = ({ children }: { children: ReactNode }) => {
  const [integrationState, setIntegrationState] = useState<Integration[]>(defaultIntegrations);

  const connectedIds = integrationState
    .filter(i => i.status === "connected" || i.status === "syncing")
    .map(i => i.id);

  const updateStatus = (id: string, status: IntegrationStatus, lastSync?: string) => {
    setIntegrationState(prev =>
      prev.map(i => i.id === id ? { ...i, status, lastSync: lastSync || i.lastSync } : i)
    );
  };

  const connect = useCallback((id: string) => {
    const integ = integrationState.find(i => i.id === id);
    if (!integ || integ.comingSoon || integ.phase2) return;
    updateStatus(id, "syncing");
    // Simulate sync
    setTimeout(() => {
      updateStatus(id, "connected", new Date().toISOString());
      toast.success(`${integ.name} başarıyla bağlandı.`);
    }, 1500);
  }, [integrationState]);

  const disconnect = useCallback((id: string) => {
    const integ = integrationState.find(i => i.id === id);
    if (!integ) return;
    updateStatus(id, "not_connected");
    toast.info(`${integ.name} bağlantısı kesildi.`);
  }, [integrationState]);

  const syncManual = useCallback((id: string) => {
    const integ = integrationState.find(i => i.id === id);
    if (!integ || integ.status !== "connected") return;
    updateStatus(id, "syncing");
    setTimeout(() => {
      updateStatus(id, "connected", new Date().toISOString());
      toast.success(`${integ.name} senkronizasyonu tamamlandı.`);
    }, 2000);
  }, [integrationState]);

  const uploadCSV = useCallback((id: string, fileName: string) => {
    const integ = integrationState.find(i => i.id === id);
    if (!integ) return;
    updateStatus(id, "connected", new Date().toISOString());
    toast.success(`${fileName} yüklendi — ${integ.name} manuel senkronizasyon aktif.`);
  }, [integrationState]);

  const getStatus = useCallback((id: string) => {
    return integrationState.find(i => i.id === id)?.status || "not_connected";
  }, [integrationState]);

  const isConnected = useCallback((id: string) => {
    const s = getStatus(id);
    return s === "connected" || s === "syncing";
  }, [getStatus]);

  const available = integrationState.filter(i => !i.comingSoon && !i.phase2);
  const connectedCount = connectedIds.length;
  const totalAvailable = available.length;
  const hasAnyConnection = connectedCount > 0;
  const isDemoMode = !hasAnyConnection;

  return (
    <IntegrationContext.Provider value={{
      integrations: integrationState,
      connectedIds,
      connect,
      disconnect,
      syncManual,
      uploadCSV,
      getStatus,
      isConnected,
      connectedCount,
      totalAvailable,
      hasAnyConnection,
      isDemoMode,
    }}>
      {children}
    </IntegrationContext.Provider>
  );
};
