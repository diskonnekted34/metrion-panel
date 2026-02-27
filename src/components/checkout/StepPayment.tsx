import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { useState } from "react";
import type { CheckoutState } from "@/lib/checkoutMachine";

interface Props {
  cardName: string;
  onUpdate: (patch: Partial<CheckoutState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPayment = ({ cardName, onUpdate, onNext, onBack }: Props) => {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState(cardName);

  const filled = number.length >= 16 && expiry.length >= 4 && cvc.length >= 3 && name.length > 1;

  const handleContinue = () => {
    const last4 = number.replace(/\s/g, "").slice(-4);
    onUpdate({ cardLast4: last4, cardName: name });
    onNext();
  };

  const formatNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <h2 className="text-xl font-bold text-foreground mb-1">Payment method</h2>
      <p className="text-sm text-muted-foreground mb-6">Your card will not be charged during the trial.</p>

      <div className="glass-card p-6 space-y-4 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-foreground">Card details</span>
        </div>

        <div>
          <label className="block mb-1.5 text-[11px] font-medium text-muted-foreground">Name on card</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div>
          <label className="block mb-1.5 text-[11px] font-medium text-muted-foreground">Card number</label>
          <input
            value={formatNumber(number)}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1.5 text-[11px] font-medium text-muted-foreground">Expiry</label>
            <input
              value={formatExpiry(expiry)}
              onChange={(e) => setExpiry(e.target.value.replace(/\D/g, ""))}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all font-mono"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-[11px] font-medium text-muted-foreground">CVC</label>
            <input
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="123"
              maxLength={4}
              className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 pt-2">
          <Lock className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Encrypted & secure. We never store full card numbers.</span>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!filled}
        className="w-full py-3.5 rounded-2xl text-sm font-medium btn-primary disabled:opacity-40 disabled:pointer-events-none"
      >
        Continue to review
      </button>
    </div>
  );
};

export default StepPayment;
