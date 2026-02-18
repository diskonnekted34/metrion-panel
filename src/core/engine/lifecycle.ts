/**
 * Lifecycle State Machine Engine
 * Controls all state transitions for Decision and Action entities.
 * No transition can happen outside this engine.
 */

import {
  DecisionLifecycleState,
  ActionLifecycleState,
  DECISION_TRANSITIONS,
  ACTION_TRANSITIONS,
} from "../types/governance";

export interface TransitionResult<S> {
  success: boolean;
  from: S;
  to: S;
  error?: string;
}

function canTransition<S extends string>(
  current: S,
  target: S,
  transitions: Record<S, S[]>
): boolean {
  const allowed = transitions[current];
  return allowed ? allowed.includes(target) : false;
}

export function transitionDecision(
  current: DecisionLifecycleState,
  target: DecisionLifecycleState
): TransitionResult<DecisionLifecycleState> {
  if (canTransition(current, target, DECISION_TRANSITIONS)) {
    return { success: true, from: current, to: target };
  }
  return {
    success: false,
    from: current,
    to: target,
    error: `Invalid decision transition: ${current} → ${target}. Allowed: [${DECISION_TRANSITIONS[current].join(", ")}]`,
  };
}

export function transitionAction(
  current: ActionLifecycleState,
  target: ActionLifecycleState
): TransitionResult<ActionLifecycleState> {
  if (canTransition(current, target, ACTION_TRANSITIONS)) {
    return { success: true, from: current, to: target };
  }
  return {
    success: false,
    from: current,
    to: target,
    error: `Invalid action transition: ${current} → ${target}. Allowed: [${ACTION_TRANSITIONS[current].join(", ")}]`,
  };
}

/** Get valid next states */
export function getDecisionNextStates(current: DecisionLifecycleState): DecisionLifecycleState[] {
  return DECISION_TRANSITIONS[current] || [];
}

export function getActionNextStates(current: ActionLifecycleState): ActionLifecycleState[] {
  return ACTION_TRANSITIONS[current] || [];
}
