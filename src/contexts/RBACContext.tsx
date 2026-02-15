import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "owner" | "admin" | "department_lead" | "operator" | "viewer";

export type DepartmentId = "executive" | "marketing" | "finance" | "operations" | "creative" | "marketplace" | "legal";

export interface Department {
  id: DepartmentId;
  name: string;
  icon: string;
  agentIds: string[];
  healthScore: number;
  activeAlerts: number;
  activeTasks: number;
  trend: "up" | "down" | "stable";
  description: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departments: DepartmentId[];
  avatar?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departments: DepartmentId[];
  joinedAt: string;
}

export const departments: Department[] = [
  { id: "executive", name: "Yönetim", icon: "👔", agentIds: ["ceo"], healthScore: 82, activeAlerts: 1, activeTasks: 4, trend: "up", description: "Stratejik önceliklendirme, karar yönetimi ve yönetici brifingleri." },
  { id: "marketing", name: "Pazarlama", icon: "📢", agentIds: ["cmo", "nova"], healthScore: 68, activeAlerts: 3, activeTasks: 8, trend: "down", description: "Kampanya stratejisi, performans izleme ve büyüme yönetimi." },
  { id: "finance", name: "Finans", icon: "💰", agentIds: ["cfo", "accounting"], healthScore: 91, activeAlerts: 1, activeTasks: 3, trend: "up", description: "Kârlılık analizi, nakit akış tahmini ve bütçe kontrolü." },
  { id: "operations", name: "Operasyon", icon: "⚙️", agentIds: ["coo", "inventory"], healthScore: 74, activeAlerts: 2, activeTasks: 5, trend: "stable", description: "Tedarik zinciri, envanter yönetimi ve süreç optimizasyonu." },
  { id: "creative", name: "Kreatif", icon: "🎨", agentIds: ["creative-director", "graphic-designer", "art-director"], healthScore: 79, activeAlerts: 1, activeTasks: 6, trend: "up", description: "Marka yönetimi, görsel üretim ve kreatif strateji." },
  { id: "marketplace", name: "Pazaryeri", icon: "🏪", agentIds: ["marketplace-manager"], healthScore: 76, activeAlerts: 1, activeTasks: 4, trend: "stable", description: "Çoklu pazaryeri listeleme, fiyat senkronizasyonu ve sipariş yönetimi." },
  { id: "legal", name: "Hukuk", icon: "⚖️", agentIds: ["legal-advisor"], healthScore: 85, activeAlerts: 0, activeTasks: 0, trend: "stable", description: "Sözleşme analizi, uyum denetimi ve hukuki risk değerlendirmesi." },
];

const mockTeam: TeamMember[] = [
  { id: "u1", name: "Ahmet Yılmaz", email: "ahmet@company.com", role: "owner", departments: ["executive", "marketing", "finance", "operations", "creative", "marketplace", "legal"], joinedAt: "2024-01-15" },
  { id: "u2", name: "Zeynep Kaya", email: "zeynep@company.com", role: "admin", departments: ["executive", "marketing", "finance", "operations", "creative", "marketplace", "legal"], joinedAt: "2024-02-01" },
  { id: "u3", name: "Mehmet Demir", email: "mehmet@company.com", role: "department_lead", departments: ["marketing"], joinedAt: "2024-03-10" },
  { id: "u4", name: "Elif Öztürk", email: "elif@company.com", role: "department_lead", departments: ["finance"], joinedAt: "2024-03-15" },
  { id: "u5", name: "Can Arslan", email: "can@company.com", role: "operator", departments: ["operations"], joinedAt: "2024-04-01" },
  { id: "u6", name: "Selin Çelik", email: "selin@company.com", role: "viewer", departments: ["marketing", "finance"], joinedAt: "2024-05-20" },
];

const roleLabels: Record<UserRole, string> = {
  owner: "Sahip",
  admin: "Yönetici",
  department_lead: "Departman Lideri",
  operator: "Operatör",
  viewer: "İzleyici",
};

const rolePermissions: Record<UserRole, { canCreateTasks: boolean; canEditThresholds: boolean; canManageBilling: boolean; canInviteUsers: boolean; canAssignTasks: boolean }> = {
  owner: { canCreateTasks: true, canEditThresholds: true, canManageBilling: true, canInviteUsers: true, canAssignTasks: true },
  admin: { canCreateTasks: true, canEditThresholds: true, canManageBilling: false, canInviteUsers: true, canAssignTasks: true },
  department_lead: { canCreateTasks: true, canEditThresholds: false, canManageBilling: false, canInviteUsers: false, canAssignTasks: true },
  operator: { canCreateTasks: false, canEditThresholds: false, canManageBilling: false, canInviteUsers: false, canAssignTasks: false },
  viewer: { canCreateTasks: false, canEditThresholds: false, canManageBilling: false, canInviteUsers: false, canAssignTasks: false },
};

interface RBACContextType {
  currentUser: MockUser;
  setCurrentUser: (user: MockUser) => void;
  team: TeamMember[];
  departments: Department[];
  roleLabels: Record<UserRole, string>;
  hasAccessToDepartment: (deptId: DepartmentId) => boolean;
  hasAccessToAgent: (agentId: string) => boolean;
  canPerform: (action: keyof typeof rolePermissions.owner) => boolean;
  viewMode: DepartmentId | "company";
  setViewMode: (mode: DepartmentId | "company") => void;
  getVisibleDepartments: () => Department[];
  getVisibleAlerts: () => string[];
}

const RBACContext = createContext<RBACContextType | null>(null);

export const useRBAC = () => {
  const ctx = useContext(RBACContext);
  if (!ctx) throw new Error("useRBAC must be used within RBACProvider");
  return ctx;
};

export const RBACProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<MockUser>({
    id: "u1",
    name: "Ahmet Yılmaz",
    email: "ahmet@company.com",
    role: "owner",
    departments: ["executive", "marketing", "finance", "operations", "creative", "marketplace", "legal"],
  });

  const [viewMode, setViewMode] = useState<DepartmentId | "company">("company");

  const hasAccessToDepartment = (deptId: DepartmentId) => {
    if (currentUser.role === "owner" || currentUser.role === "admin") return true;
    return currentUser.departments.includes(deptId);
  };

  const hasAccessToAgent = (agentId: string) => {
    const dept = departments.find(d => d.agentIds.includes(agentId));
    if (!dept) return false;
    return hasAccessToDepartment(dept.id);
  };

  const canPerform = (action: keyof typeof rolePermissions.owner) => {
    return rolePermissions[currentUser.role][action];
  };

  const getVisibleDepartments = () => {
    return departments.filter(d => hasAccessToDepartment(d.id));
  };

  const getVisibleAlerts = () => {
    const visibleDeptIds = getVisibleDepartments().map(d => d.id);
    return visibleDeptIds as string[];
  };

  return (
    <RBACContext.Provider value={{
      currentUser,
      setCurrentUser,
      team: mockTeam,
      departments,
      roleLabels,
      hasAccessToDepartment,
      hasAccessToAgent,
      canPerform,
      viewMode,
      setViewMode,
      getVisibleDepartments,
      getVisibleAlerts,
    }}>
      {children}
    </RBACContext.Provider>
  );
};
