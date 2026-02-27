import { plans } from "@/config/plans";
import { Check } from "lucide-react";

interface Props {
  selectedPlan: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
}

const StepPlan = ({ selectedPlan, onSelect, onNext }: Props) => (
  <div>
    <h2 className="text-xl font-bold text-foreground mb-1">Select your plan</h2>
    <p className="text-sm text-muted-foreground mb-6">You can change this later.</p>

    <div className="space-y-3 mb-8">
      {plans.map((plan) => {
        const active = selectedPlan === plan.id;
        const isEnterprise = plan.id === "enterprise";
        return (
          <button
            key={plan.id}
            onClick={() => onSelect(plan.id)}
            className={`w-full text-left p-5 rounded-2xl border transition-all ${
              active
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30 bg-secondary/20"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground">{plan.name}</span>
              <div className="flex items-center gap-2">
                {plan.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-xl bg-primary/15 text-primary uppercase tracking-wider">
                    {plan.badge}
                  </span>
                )}
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    active ? "border-primary bg-primary" : "border-muted-foreground/30"
                  }`}
                >
                  {active && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{plan.description}</p>
            <p className="text-lg font-bold text-foreground mt-2">
              {isEnterprise ? "Custom" : `$${plan.monthlyPrice}/mo`}
            </p>
          </button>
        );
      })}
    </div>

    <button
      onClick={onNext}
      disabled={!selectedPlan}
      className="w-full py-3.5 rounded-2xl text-sm font-medium btn-primary disabled:opacity-40 disabled:pointer-events-none"
    >
      Continue
    </button>
  </div>
);

export default StepPlan;
