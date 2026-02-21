/**
 * Command Layer — Public API
 * All write operations must go through this module.
 */

// Types
export type { CommandContext, CommandResult, CommandFn } from "./types";

// Decision Commands
export {
  createDecision,
  submitDecisionForApproval,
  approveDecision,
  rejectDecision,
  transitionDecisionLifecycle,
} from "./decision.commands";

// Action Commands
export {
  createAction,
  submitActionForApproval,
  approveAction as approveActionCommand,
  rejectAction as rejectActionCommand,
  executeAction,
} from "./action.commands";

// Governance Commands
export {
  updateBudgetCaps,
  changeAIMode,
} from "./governance.commands";

// Policy Wrapper
export { withPolicy } from "./policy-wrapper";
