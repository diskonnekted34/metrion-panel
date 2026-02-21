/**
 * Command Layer — Shared Types
 * All commands return a CommandResult. All commands receive a CommandContext.
 */

import type { UserRole } from "@/contexts/RBACContext";
import type { SeatKey } from "../types/identity";

export interface CommandContext {
  tenant_id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  seat_key: SeatKey | null;
}

export interface CommandResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  audit_id?: string;
}

export type CommandFn<TInput, TOutput = void> = (
  input: TInput,
  ctx: CommandContext
) => CommandResult<TOutput>;
