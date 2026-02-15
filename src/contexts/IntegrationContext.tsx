import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Integration, IntegrationStatus, DataHealth, integrations as defaultIntegrations } from "@/data/integrations";
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
  getDataHealth: (id: string) => DataHealth;
  isWriteEnabled: (id: string) => boolean;
  toggleWriteAccess: (id: string, enabled: boolean) => void;
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

  const updateIntegration = (id: string, patch: Partial<Integration>) => {
    setIntegrationState(prev =>
      prev.map(i => i.id === id ? { ...i, ...patch } : i)
    );
  };

  const connect = useCallback((id: string) => {
    const integ = integrationState.find(i => i.id === id);
    if (!integ || integ.comingSoon || integ.phase2) return;
    updateIntegration(id, {
      status: "syncing",
      dataHealth: { syncStatus: "healthy", apiHealth: "operational", rateLimitPercent: 5 },
    });
    setTimeout(() => {
      updateIntegration(id, {
        status: "connected",
        lastSync: new Date().toISOString(),
        dataHealth: {
          syncStatus: "healthy",
          apiHealth: "operational",
          rateLimitPercent: 8,
          tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });
      toast.success(`${integ.name} başarıyla bağlandı.`);
    }, 1500);
  }, [integrationState]);

  const disconnect = useCallback((id: string) => {
    const integ = integrationState.find(i => i.id === id);
    if (!integ) return;
    updateIntegration(id, {
      status: "not_connected",
      writeEnabled: false,
      dataHealth: { syncStatus: "idle", apiHealth: "unknown" },
    });
    toast.info(`${integ.name} bağlantısı kesildi. Token'lar silindi.`);
  }, [integrationState]);

  const syncManual = useCallback((id: string) => {
    const integ = integrationState.find(i => i.id === id);
    if (!integ || integ.status !== "connected") return;
    updateIntegration(id, { status: "syncing" });
    setTimeout(() => {
      updateIntegration(id, {
        status: "connected",
        lastSync: new Date().toISOString(),
        dataHealth: { ...integ.dataHealth, syncStatus: "healthy" },
      });
      toast.success(`${integ.name} senkronizasyonu tamamlandı.`);
    }, 2000);
  }, [integrationState]);

  const uploadCSV = useCallback((id: string, fileName: string) => {
    const integ = integrationState.find(i => i.id === id);
    if (!integ) return;
    updateIntegration(id, {
      status: "connected",
      lastSync: new Date().toISOString(),
      dataHealth: { syncStatus: "healthy", apiHealth: "unknown" },
    });
    toast.success(`${fileName} yüklendi — ${integ.name} manuel senkronizasyon aktif.`);
  }, [integrationState]);

  const getStatus = useCallback((id: string) => {
    return integrationState.find(i => i.id === id)?.status || "not_connected";
  }, [integrationState]);

  const isConnected = useCallback((id: string) => {
    const s = getStatus(id);
    return s === "connected" || s === "syncing";
  }, [getStatus]);

  const getDataHealth = useCallback((id: string): DataHealth => {
    return integrationState.find(i => i.id === id)?.dataHealth || { syncStatus: "idle", apiHealth: "unknown" };
  }, [integrationState]);

  const isWriteEnabled = useCallback((id: string) => {
    return integrationState.find(i => i.id === id)?.writeEnabled || false;
  }, [integrationState]);

  const toggleWriteAccess = useCallback((id: string, enabled: boolean) => {
    updateIntegration(id, { writeEnabled: enabled });
    toast[enabled ? "warning" : "info"](
      enabled ? "Yazma erişimi etkinleştirildi." : "Yazma erişimi devre dışı bırakıldı."
    );
  }, []);

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
      getDataHealth,
      isWriteEnabled,
      toggleWriteAccess,
    }}>
      {children}
    </IntegrationContext.Provider>
  );
};
