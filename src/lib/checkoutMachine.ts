/** Lightweight checkout state machine – no external deps */

export type CheckoutStep = "plan" | "account" | "payment" | "review";
export type CheckoutStatus = "idle" | "collecting" | "processing" | "success" | "failure";

export interface CheckoutState {
  step: CheckoutStep;
  status: CheckoutStatus;
  planId: string | null;
  email: string;
  cardLast4: string;
  cardName: string;
}

const STEPS: CheckoutStep[] = ["plan", "account", "payment", "review"];

export const initialState = (preselectedPlan?: string | null): CheckoutState => ({
  step: "plan",
  status: "idle",
  planId: preselectedPlan ?? null,
  email: "",
  cardLast4: "",
  cardName: "",
});

export function nextStep(state: CheckoutState): CheckoutState {
  const idx = STEPS.indexOf(state.step);
  if (idx < STEPS.length - 1) {
    return { ...state, step: STEPS[idx + 1] };
  }
  return state;
}

export function prevStep(state: CheckoutState): CheckoutState {
  const idx = STEPS.indexOf(state.step);
  if (idx > 0) {
    return { ...state, step: STEPS[idx - 1] };
  }
  return state;
}

export function stepIndex(step: CheckoutStep): number {
  return STEPS.indexOf(step);
}

export const STEP_LABELS: Record<CheckoutStep, string> = {
  plan: "Plan",
  account: "Account",
  payment: "Payment",
  review: "Review",
};

export const ALL_STEPS = STEPS;

/** Persist/retrieve chosen plan */
const STORAGE_KEY = "selected_plan";
export const persistPlan = (planId: string) => localStorage.setItem(STORAGE_KEY, planId);
export const retrievePlan = (): string | null => localStorage.getItem(STORAGE_KEY);
export const clearPlan = () => localStorage.removeItem(STORAGE_KEY);
