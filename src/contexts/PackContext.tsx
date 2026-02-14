import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Pack, Tier, tiers, addonPacks, allPacks } from "@/data/packs";
import { toast } from "sonner";

interface PackContextType {
  currentTierId: string;
  activeTier: Tier;
  activeAddons: string[];
  activateTier: (tierId: string) => void;
  activateAddon: (packId: string) => void;
  deactivateAddon: (packId: string) => void;
  isAddonActive: (packId: string) => boolean;
  isAgentUnlocked: (agentId: string) => boolean;
  getPackForAgent: (agentId: string) => Pack | undefined;
  getMonthlyTotal: () => number;
  getActivePacks: () => Pack[];
  trialDaysRemaining: number;
  isTrial: boolean;
  // Legacy compat
  isCorActive: boolean;
  activePacks: string[];
  isPackActive: (packId: string) => boolean;
  activatePack: (packId: string) => void;
  deactivatePack: (packId: string) => void;
}

const PackContext = createContext<PackContextType | null>(null);

export const usePacks = () => {
  const ctx = useContext(PackContext);
  if (!ctx) throw new Error("usePacks must be used within PackProvider");
  return ctx;
};

export const PackProvider = ({ children }: { children: ReactNode }) => {
  const [currentTierId, setCurrentTierId] = useState<string>("executive-core");
  const [activeAddons, setActiveAddons] = useState<string[]>([]);
  const [trialDaysRemaining] = useState(30);
  const isTrial = trialDaysRemaining > 0;

  const activeTier = tiers.find(t => t.id === currentTierId) || tiers[0];

  const activateTier = useCallback((tierId: string) => {
    const tier = tiers.find(t => t.id === tierId);
    if (!tier) return;
    setCurrentTierId(tierId);
    toast.success(`${tier.name} tier activated.`);
  }, []);

  const activateAddon = useCallback((packId: string) => {
    const pack = addonPacks.find(p => p.id === packId);
    if (!pack) return;
    setActiveAddons(prev => [...new Set([...prev, packId])]);
    toast.success(`${pack.name} activated.`);
  }, []);

  const deactivateAddon = useCallback((packId: string) => {
    setActiveAddons(prev => prev.filter(id => id !== packId));
    const pack = addonPacks.find(p => p.id === packId);
    if (pack) toast.info(`${pack.name} deactivated.`);
  }, []);

  const isAddonActive = useCallback((packId: string) => {
    return activeAddons.includes(packId);
  }, [activeAddons]);

  const isAgentUnlocked = useCallback((agentId: string) => {
    // Check tier
    if (activeTier.cumulativeAgentIds.includes(agentId)) return true;
    // Check addons
    return addonPacks.some(p => activeAddons.includes(p.id) && p.agents.some(a => a.id === agentId));
  }, [activeTier, activeAddons]);

  const getPackForAgent = useCallback((agentId: string) => {
    return allPacks.find(p => p.agents.some(a => a.id === agentId));
  }, []);

  const getMonthlyTotal = useCallback(() => {
    const tierCost = activeTier.monthlyPrice;
    const addonCost = addonPacks
      .filter(p => activeAddons.includes(p.id))
      .reduce((sum, p) => sum + p.monthlyPrice, 0);
    return tierCost + addonCost;
  }, [activeTier, activeAddons]);

  const getActivePacks = useCallback(() => {
    return addonPacks.filter(p => activeAddons.includes(p.id));
  }, [activeAddons]);

  // Legacy compatibility
  const isCorActive = true;
  const activePacks = [currentTierId, ...activeAddons];
  const isPackActive = useCallback((packId: string) => {
    return packId === currentTierId || activeAddons.includes(packId);
  }, [currentTierId, activeAddons]);

  const activatePack = useCallback((packId: string) => {
    const tier = tiers.find(t => t.id === packId);
    if (tier) { activateTier(packId); return; }
    activateAddon(packId);
  }, [activateTier, activateAddon]);

  const deactivatePack = useCallback((packId: string) => {
    deactivateAddon(packId);
  }, [deactivateAddon]);

  return (
    <PackContext.Provider value={{
      currentTierId,
      activeTier,
      activeAddons,
      activateTier,
      activateAddon,
      deactivateAddon,
      isAddonActive,
      isAgentUnlocked,
      getPackForAgent,
      getMonthlyTotal,
      getActivePacks,
      trialDaysRemaining,
      isTrial,
      isCorActive,
      activePacks,
      isPackActive,
      activatePack,
      deactivatePack,
    }}>
      {children}
    </PackContext.Provider>
  );
};
