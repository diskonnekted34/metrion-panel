import { ArrowLeft, CreditCard, Mail, Package } from "lucide-react";
import { plans } from "@/config/plans";
import type { CheckoutState } from "@/lib/checkoutMachine";

interface Props {
  state: CheckoutState;
  onSubmit: () => void;
  onBack: () => void;
}

const StepReview = ({ state, onSubmit, onBack }: Props) => {
  const plan = plans.find((p) => p.id === state.planId);

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <h2 className="text-xl font-bold text-foreground mb-1">Review your order</h2>
      <p className="text-sm text-muted-foreground mb-6">Confirm the details below to start your trial.</p>

      <div className="space-y-3 mb-8">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Plan</p>
            <p className="text-sm font-semibold text-foreground">{plan?.name ?? "—"}</p>
          </div>
          <p className="text-sm font-bold text-foreground">
            {plan?.id === "enterprise" ? "Custom" : `$${plan?.monthlyPrice}/mo`}
          </p>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Account</p>
            <p className="text-sm font-semibold text-foreground">{state.email || "—"}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Payment</p>
            <p className="text-sm font-semibold text-foreground">
              {state.cardName} •••• {state.cardLast4}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-success/5 border border-success/20 mb-8">
        <p className="text-xs text-success font-medium">
          14-day free trial — you won't be charged today.
        </p>
      </div>

      <button
        onClick={onSubmit}
        className="w-full py-3.5 rounded-2xl text-sm font-medium btn-primary"
      >
        Start free trial
      </button>
    </div>
  );
};

export default StepReview;
