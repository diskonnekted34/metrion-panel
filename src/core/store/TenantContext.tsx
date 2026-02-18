/**
 * Tenant Context
 * Provides tenant-scoped state to the entire application.
 * Every query and mutation MUST go through this context to ensure tenant isolation.
 */

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  Tenant, User, Membership, Seat, SeatKey, SeatCapability,
} from "../types/identity";
import {
  Decision, Action, DecisionApproval, ActionApproval, ApprovalPolicy,
} from "../types/governance";
import {
  DomainEvent, AuditLog, UsageLog, MetricPack,
} from "../types/infrastructure";
import { seatHasCapability, getCapabilitiesForLevel } from "../engine/seats";
import { eventBus } from "../engine/events";
import { auditLogger } from "../engine/audit";
import { usageEngine } from "../engine/usage";
import {
  seedTenant, seedUsers, seedMemberships, seedSeats, DEFAULT_TENANT_ID,
} from "../data/seed";

// ── Context Value ───────────────────────────────────────
interface TenantContextValue {
  // Identity
  tenant: Tenant;
  currentUser: User;
  currentMembership: Membership;
  seats: Seat[];
  users: User[];
  memberships: Membership[];

  // Seat authority
  getCurrentSeat: () => Seat | null;
  getSeatByKey: (key: SeatKey) => Seat | undefined;
  seatCan: (seatKey: SeatKey, cap: SeatCapability) => boolean;

  // Tenant isolation
  tenantId: string;

  // Engine access
  emitEvent: typeof eventBus.emit;
  logAudit: typeof auditLogger.log;
  consumeUsage: typeof usageEngine.consume;
  checkUsageLimit: () => ReturnType<typeof usageEngine.checkLimit>;

  // Queries
  getAuditLogs: (limit?: number) => AuditLog[];
  getEvents: (limit?: number) => DomainEvent[];
  getUsageLogs: (limit?: number) => UsageLog[];
}

const TenantContext = createContext<TenantContextValue | null>(null);

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
};

// ── Provider ────────────────────────────────────────────
export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [tenant] = useState<Tenant>(seedTenant);
  const [users] = useState<User[]>(seedUsers);
  const [memberships] = useState<Membership[]>(seedMemberships);
  const [seats] = useState<Seat[]>(seedSeats);

  // Default to first user (owner)
  const currentUser = users[0];
  const currentMembership = memberships[0];
  const tenantId = DEFAULT_TENANT_ID;

  const getCurrentSeat = useCallback((): Seat | null => {
    return seats.find(s => s.human_user_id === currentUser.id) || null;
  }, [seats, currentUser]);

  const getSeatByKey = useCallback((key: SeatKey): Seat | undefined => {
    return seats.find(s => s.seat_key === key);
  }, [seats]);

  const seatCan = useCallback((seatKey: SeatKey, cap: SeatCapability): boolean => {
    const seat = seats.find(s => s.seat_key === seatKey);
    if (!seat) return false;
    return seatHasCapability(seat, cap);
  }, [seats]);

  const emitEvent = useCallback(
    (...args: Parameters<typeof eventBus.emit>) => eventBus.emit(...args),
    []
  );

  const logAudit = useCallback(
    (...args: Parameters<typeof auditLogger.log>) => auditLogger.log(...args),
    []
  );

  const consumeUsage = useCallback(
    (...args: Parameters<typeof usageEngine.consume>) => usageEngine.consume(...args),
    []
  );

  const checkUsageLimit = useCallback(
    () => usageEngine.checkLimit(tenantId, tenant.plan),
    [tenantId, tenant.plan]
  );

  const getAuditLogs = useCallback(
    (limit?: number) => auditLogger.query(tenantId, { limit }),
    [tenantId]
  );

  const getEvents = useCallback(
    (limit?: number) => eventBus.getEvents(tenantId, { limit }),
    [tenantId]
  );

  const getUsageLogs = useCallback(
    (limit?: number) => usageEngine.query(tenantId, limit),
    [tenantId]
  );

  return (
    <TenantContext.Provider value={{
      tenant,
      currentUser,
      currentMembership,
      seats,
      users,
      memberships,
      tenantId,
      getCurrentSeat,
      getSeatByKey,
      seatCan,
      emitEvent,
      logAudit,
      consumeUsage,
      checkUsageLimit,
      getAuditLogs,
      getEvents,
      getUsageLogs,
    }}>
      {children}
    </TenantContext.Provider>
  );
};
