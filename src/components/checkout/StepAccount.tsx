import { ArrowLeft } from "lucide-react";

interface Props {
  email: string;
  onChange: (email: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepAccount = ({ email, onChange, onNext, onBack }: Props) => {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <h2 className="text-xl font-bold text-foreground mb-1">Your account</h2>
      <p className="text-sm text-muted-foreground mb-6">We'll create an account for you or link to an existing one.</p>

      <label className="block mb-2 text-xs font-medium text-muted-foreground">Email address</label>
      <input
        type="email"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        placeholder="you@company.com"
        className="w-full px-4 py-3 rounded-2xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
      />

      <button
        onClick={onNext}
        disabled={!valid}
        className="w-full mt-8 py-3.5 rounded-2xl text-sm font-medium btn-primary disabled:opacity-40 disabled:pointer-events-none"
      >
        Continue
      </button>
    </div>
  );
};

export default StepAccount;
