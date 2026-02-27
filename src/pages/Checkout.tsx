import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PublicNav from "@/components/PublicNav";
import {
  CheckoutState,
  initialState,
  nextStep,
  prevStep,
  stepIndex,
  ALL_STEPS,
  STEP_LABELS,
  persistPlan,
  retrievePlan,
} from "@/lib/checkoutMachine";
import StepPlan from "@/components/checkout/StepPlan";
import StepAccount from "@/components/checkout/StepAccount";
import StepPayment from "@/components/checkout/StepPayment";
import StepReview from "@/components/checkout/StepReview";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselected = searchParams.get("plan") || retrievePlan();

  const [state, setState] = useState<CheckoutState>(() => initialState(preselected));
  const [forceFailure, setForceFailure] = useState(false);

  const update = useCallback((patch: Partial<CheckoutState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const goNext = useCallback(() => setState((s) => nextStep(s)), []);
  const goBack = useCallback(() => setState((s) => prevStep(s)), []);

  const handleSubmit = useCallback(() => {
    setState((s) => ({ ...s, status: "processing" }));

    if (state.planId) persistPlan(state.planId);

    setTimeout(() => {
      if (forceFailure) {
        navigate("/checkout/failure");
      } else {
        navigate("/checkout/success");
      }
    }, 2200);
  }, [forceFailure, navigate, state.planId]);

  const currentIdx = stepIndex(state.step);
  const isProcessing = state.status === "processing";

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="pt-28 pb-24 px-6">
        <div className="container mx-auto max-w-lg">
          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              {ALL_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-2 flex-1 last:flex-initial">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i <= currentIdx
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      i <= currentIdx ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {STEP_LABELS[step]}
                  </span>
                  {i < ALL_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-2 transition-all ${
                        i < currentIdx ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Processing overlay */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
              >
                <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Processing payment…</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={state.step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {state.step === "plan" && (
                <StepPlan
                  selectedPlan={state.planId}
                  onSelect={(id) => update({ planId: id })}
                  onNext={goNext}
                />
              )}
              {state.step === "account" && (
                <StepAccount
                  email={state.email}
                  onChange={(email) => update({ email })}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {state.step === "payment" && (
                <StepPayment
                  cardName={state.cardName}
                  onUpdate={(patch) => update(patch)}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {state.step === "review" && (
                <StepReview
                  state={state}
                  onSubmit={handleSubmit}
                  onBack={goBack}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Dev toggle */}
          {import.meta.env.DEV && (
            <div className="mt-10 p-4 rounded-2xl border border-border bg-secondary/20 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Dev: Force failure?</span>
              <button
                onClick={() => setForceFailure((v) => !v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  forceFailure
                    ? "bg-destructive/20 text-destructive"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {forceFailure ? "Failure ON" : "Failure OFF"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
