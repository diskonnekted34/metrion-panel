import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Pack, corePack, addonPacks, allPacks } from "@/data/packs";
import { toast } from "sonner";

interface PackContextType {
  isCorActive: boolean;
  activePacks: string[];
  activatePack: (packId: string) => void;
  deactivatePack: (packId: string) => void;
  isPackActive: (packId: string) => boolean;
  isAgentUnlocked: (agentId: string) => boolean;
  getPackForAgent: (agentId: string) => Pack | undefined;
  getMonthlyTotal: () => number;
  getActivePacks: () => Pack[];
}

const PackContext = createContext<PackContextType | null>(null);

export const usePacks = () => {
  const ctx = useContext(PackContext);
  if (!ctx) throw new Error("usePacks must be used within PackProvider");
  return ctx;
};

export const PackProvider = ({ children }: { children: ReactNode }) => {
  const [activePacks, setActivePacks] = useState<string[]>(["executive-bundle"]);

  const isCorActive = activePacks.includes("executive-bundle");

  const activatePack = useCallback((packId: string) => {
    const pack = allPacks.find(p => p.id === packId);
    if (!pack) return;
    if (pack.requiresCore && !activePacks.includes("executive-bundle")) {
      toast.error("Executive Bundle must be active before adding packs.");
      return;
    }
    setActivePacks(prev => [...new Set([...prev, packId])]);
    toast.success(`${pack.name} activated.`);
  }, [activePacks]);

  const deactivatePack = useCallback((packId: string) => {
    if (packId === "executive-bundle") {
      // Deactivating core deactivates everything
      setActivePacks([]);
      toast.info("All packs deactivated.");
      return;
    }
    setActivePacks(prev => prev.filter(id => id !== packId));
    const pack = allPacks.find(p => p.id === packId);
    if (pack) toast.info(`${pack.name} deactivated.`);
  }, []);

  const isPackActive = useCallback((packId: string) => {
    return activePacks.includes(packId);
  }, [activePacks]);

  const isAgentUnlocked = useCallback((agentId: string) => {
    return allPacks.some(p => activePacks.includes(p.id) && p.agents.some(a => a.id === agentId));
  }, [activePacks]);

  const getPackForAgent = useCallback((agentId: string) => {
    return allPacks.find(p => p.agents.some(a => a.id === agentId));
  }, []);

  const getMonthlyTotal = useCallback(() => {
    return allPacks
      .filter(p => activePacks.includes(p.id))
      .reduce((sum, p) => sum + p.monthlyPrice, 0);
  }, [activePacks]);

  const getActivePacks = useCallback(() => {
    return allPacks.filter(p => activePacks.includes(p.id));
  }, [activePacks]);

  return (
    <PackContext.Provider value={{
      isCorActive,
      activePacks,
      activatePack,
      deactivatePack,
      isPackActive,
      isAgentUnlocked,
      getPackForAgent,
      getMonthlyTotal,
      getActivePacks,
    }}>
      {children}
    </PackContext.Provider>
  );
};
