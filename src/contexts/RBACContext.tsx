/**
 * @deprecated MIGRATION BRIDGE — Use AuthorizationContext for permissions.
 *
 * This context is kept as a compatibility layer during the transition
 * from the legacy 5-role RBAC to the 4-layer Authorization engine.
 * All permission checks should migrate to:
 *   - useAuthorization().can(resource, action, scope)
 *   - useAuth() for user identity (name, email)
 *
 * Department data is now sourced from src/data/departments.ts.
 * TODO: Remove this context once all consumers are migrated.
 */

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  departments,
  ALL_DEPARTMENT_IDS,
  type DepartmentId,
  type Department,
} from "@/data/departments";

// Re-export for backward compatibility
export { departments, type DepartmentId, type Department } from "@/data/departments";

export type UserRole = "owner" | "admin" | "department_lead" | "operator" | "viewer";

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

const mockTeam: TeamMember[] = [
  { id: "u1", name: "Ahmet Yılmaz", email: "ahmet@company.com", role: "owner", departments: [...ALL_DEPARTMENT_IDS], joinedAt: "2024-01-15" },
  { id: "u2", name: "Zeynep Kaya", email: "zeynep@company.com", role: "admin", departments: [...ALL_DEPARTMENT_IDS], joinedAt: "2024-02-01" },
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
  getVisibleDepartmentIds: () => string[];
}

const RBACContext = createContext<RBACContextType | null>(null);

/** @deprecated Use useAuthorization() instead */
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
    departments: [...ALL_DEPARTMENT_IDS],
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

  const getVisibleDepartments = () => departments.filter(d => hasAccessToDepartment(d.id));
  const getVisibleDepartmentIds = () => getVisibleDepartments().map(d => d.id) as string[];

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
      getVisibleDepartmentIds,
    }}>
      {children}
    </RBACContext.Provider>
  );
};
