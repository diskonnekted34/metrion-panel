import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Pack, Tier, tiers, addonPacks, allPacks, creditPacks } from "@/data/packs";
import type { DepartmentId } from "@/contexts/RBACContext";
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
  isDepartmentUnlocked: (deptId: DepartmentId) => boolean;
  getRequiredTierForDepartment: (deptId: DepartmentId) => Tier | undefined;
  getPackForAgent: (agentId: string) => Pack | undefined;
  getMonthlyTotal: () => number;
  getActivePacks: () => Pack[];
  trialDaysRemaining: number;
  isTrial: boolean;
  // Credits
  creditBalance: number;
  autoTopUp: boolean;
  setAutoTopUp: (enabled: boolean) => void;
  purchaseCredits: (packId: string) => void;
  // Legacy compat
  isCorActive: boolean;
  activePacks: string[];
  isPackActive: (packId: string) => boolean;
  activatePack: (packId: string) => void;
  deactivatePack: (packId: string) => void;
}

const PackContext = createContext<PackContextType | null>(null);

export const usePacks = (): PackContextType => {
  const ctx = useContext(PackContext);
  if (!ctx) throw new Error("usePacks must be used within PackProvider");
  return ctx;
};

export const PackProvider = ({ children }: { children: ReactNode }) => {
  const [currentTierId, setCurrentTierId] = useState<string>("core");
  const [activeAddons, setActiveAddons] = useState<string[]>([]);
  const [trialDaysRemaining] = useState(30);
  const isTrial = trialDaysRemaining > 0;
  const [creditBalance, setCreditBalance] = useState(100);
  const [autoTopUp, setAutoTopUpState] = useState(false);

  const activeTier = tiers.find(t => t.id === currentTierId) || tiers[0];

  const activateTier = useCallback((tierId: string) => {
    const tier = tiers.find(t => t.id === tierId);
    if (!tier) return;
    setCurrentTierId(tierId);
    toast.success(`${tier.name} planı aktifleştirildi.`);
  }, []);

  const activateAddon = useCallback((packId: string) => {
    const pack = addonPacks.find(p => p.id === packId);
    if (!pack) return;
    setActiveAddons(prev => [...new Set([...prev, packId])]);
    toast.success(`${pack.name} aktifleştirildi.`);
  }, []);

  const deactivateAddon = useCallback((packId: string) => {
    setActiveAddons(prev => prev.filter(id => id !== packId));
    const pack = addonPacks.find(p => p.id === packId);
    if (pack) toast.info(`${pack.name} devre dışı bırakıldı.`);
  }, []);

  const isAddonActive = useCallback((packId: string) => activeAddons.includes(packId), [activeAddons]);

  const isDepartmentUnlocked = useCallback((deptId: DepartmentId) => {
    // Legal is always locked (future)
    if (deptId === "legal") return false;
    // Check if current tier unlocks this department
    if (activeTier.departmentIds.includes(deptId)) return true;
    // Check if an active addon unlocks it
    const addon = addonPacks.find(p => p.department === deptId && activeAddons.includes(p.id));
    return !!addon;
  }, [activeTier, activeAddons]);

  const getRequiredTierForDepartment = useCallback((deptId: DepartmentId) => {
    return tiers.find(t => t.departmentIds.includes(deptId));
  }, []);

  const isAgentUnlocked = useCallback((agentId: string) => {
    if (activeTier.cumulativeAgentIds.includes(agentId)) return true;
    return addonPacks.some(p => activeAddons.includes(p.id) && p.agents.some(a => a.id === agentId));
  }, [activeTier, activeAddons]);

  const getPackForAgent = useCallback((agentId: string) => allPacks.find(p => p.agents.some(a => a.id === agentId)), []);

  const getMonthlyTotal = useCallback(() => {
    const tierCost = activeTier.monthlyPrice;
    const addonCost = addonPacks.filter(p => activeAddons.includes(p.id)).reduce((sum, p) => sum + p.monthlyPrice, 0);
    return tierCost + addonCost;
  }, [activeTier, activeAddons]);

  const getActivePacks = useCallback(() => addonPacks.filter(p => activeAddons.includes(p.id)), [activeAddons]);

  const setAutoTopUp = useCallback((enabled: boolean) => {
    setAutoTopUpState(enabled);
    toast.success(enabled ? "Otomatik yükleme aktifleştirildi." : "Otomatik yükleme kapatıldı.");
  }, []);

  const purchaseCredits = useCallback((packId: string) => {
    const pack = creditPacks.find(p => p.id === packId);
    if (!pack) return;
    setCreditBalance(prev => prev + pack.price);
    toast.success(`${pack.name} satın alındı — $${pack.price}`);
  }, []);

  // Legacy
  const isCorActive = true;
  const activePacks = [currentTierId, ...activeAddons];
  const isPackActive = useCallback((packId: string) => packId === currentTierId || activeAddons.includes(packId), [currentTierId, activeAddons]);
  const activatePack = useCallback((packId: string) => {
    const tier = tiers.find(t => t.id === packId);
    if (tier) { activateTier(packId); return; }
    activateAddon(packId);
  }, [activateTier, activateAddon]);
  const deactivatePack = useCallback((packId: string) => deactivateAddon(packId), [deactivateAddon]);

  return (
    <PackContext.Provider value={{
      currentTierId, activeTier, activeAddons,
      activateTier, activateAddon, deactivateAddon, isAddonActive,
      isAgentUnlocked, isDepartmentUnlocked, getRequiredTierForDepartment,
      getPackForAgent, getMonthlyTotal, getActivePacks,
      trialDaysRemaining, isTrial,
      creditBalance, autoTopUp, setAutoTopUp, purchaseCredits,
      isCorActive, activePacks, isPackActive, activatePack, deactivatePack,
    }}>
      {children}
    </PackContext.Provider>
  );
};
