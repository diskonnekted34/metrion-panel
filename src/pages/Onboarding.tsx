import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, UserCog, Users, Plug, Rocket, ArrowRight, ArrowLeft, SkipForward, Check, Plus, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "onboarding_payload";
const COMPLETED_KEY = "onboarding_completed";

interface OnboardingPayload {
  company: { name: string; industry: string; country: string; currency: string };
  role: string;
  invites: { email: string; role: string }[];
  dataSources: string[];
  skipped: string[];
}

const STEPS = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "role", label: "Your Role", icon: UserCog },
  { id: "invite", label: "Invite Team", icon: Users },
  { id: "connect", label: "Data Sources", icon: Plug },
  { id: "finish", label: "Finish", icon: Rocket },
];

const INDUSTRIES = ["E-Commerce", "SaaS", "FinTech", "Healthcare", "Manufacturing", "Logistics", "Retail", "Other"];
const COUNTRIES = ["Turkey", "United States", "Germany", "United Kingdom", "France", "UAE", "Other"];
const CURRENCIES = ["TRY", "USD", "EUR", "GBP"];
const ROLES = ["CEO", "CFO", "CTO", "COO", "Team Member"];
const INVITE_ROLES = ["Admin", "Department Lead", "Operator", "Viewer"];
const DATA_SOURCES = [
  { id: "shopify", label: "Shopify", desc: "E-commerce data" },
  { id: "meta_ads", label: "Meta Ads", desc: "Ad performance" },
  { id: "google_ads", label: "Google Ads", desc: "Search campaigns" },
  { id: "github", label: "GitHub", desc: "Engineering metrics" },
  { id: "datadog", label: "Datadog", desc: "Infrastructure monitoring" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [payload, setPayload] = useState<OnboardingPayload>({
    company: { name: "", industry: "", country: "", currency: "USD" },
    role: "",
    invites: [],
    dataSources: [],
    skipped: [],
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Operator");

  useEffect(() => {
    if (localStorage.getItem(COMPLETED_KEY) === "true") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const patch = (updates: Partial<OnboardingPayload>) =>
    setPayload((p) => ({ ...p, ...updates }));

  const patchCompany = (field: string, value: string) =>
    setPayload((p) => ({ ...p, company: { ...p.company, [field]: value } }));

  const canNext = () => {
    if (step === 0) return payload.company.name.trim().length > 0 && payload.company.industry && payload.company.country;
    if (step === 1) return !!payload.role;
    return true;
  };

  const isSkippable = step === 2 || step === 3;

  const goNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSkip = () => {
    patch({ skipped: [...payload.skipped, STEPS[step].id] });
    goNext();
  };

  const addInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) return;
    patch({ invites: [...payload.invites, { email: inviteEmail.trim(), role: inviteRole }] });
    setInviteEmail("");
  };

  const removeInvite = (idx: number) => {
    patch({ invites: payload.invites.filter((_, i) => i !== idx) });
  };

  const toggleSource = (id: string) => {
    const ds = payload.dataSources.includes(id)
      ? payload.dataSources.filter((s) => s !== id)
      : [...payload.dataSources, id];
    patch({ dataSources: ds });
  };

  const handleFinish = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem(COMPLETED_KEY, "true");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Progress */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : active
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-xs mt-1.5 ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-1 rounded-full bg-secondary overflow-hidden mt-2">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-8 min-h-[420px] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            {/* Step 0: Company */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Create your company</h2>
                  <p className="text-muted-foreground mt-1">Tell us about your organization.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>Company Name *</Label>
                    <Input placeholder="Acme Inc." value={payload.company.name} onChange={(e) => patchCompany("name", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Industry *</Label>
                    <Select value={payload.company.industry} onValueChange={(v) => patchCompany("industry", v)}>
                      <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                      <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Country *</Label>
                    <Select value={payload.company.country} onValueChange={(v) => patchCompany("country", v)}>
                      <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                      <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Currency</Label>
                    <Select value={payload.company.currency} onValueChange={(v) => patchCompany("currency", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Role */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Choose your role</h2>
                  <p className="text-muted-foreground mt-1">This determines your default dashboard and permissions.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      onClick={() => patch({ role: r })}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        payload.role === r
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/30 hover:bg-secondary"
                      }`}
                    >
                      <span className="font-medium">{r}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Invite */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Invite your team</h2>
                  <p className="text-muted-foreground mt-1">Add team members now or skip and do it later.</p>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="colleague@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addInvite()} className="flex-1" />
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>{INVITE_ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" onClick={addInvite}><Plus className="w-4 h-4" /></Button>
                </div>
                {payload.invites.length > 0 && (
                  <div className="space-y-2">
                    {payload.invites.map((inv, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{inv.email}</span>
                          <Badge variant="secondary" className="text-xs">{inv.role}</Badge>
                        </div>
                        <button onClick={() => removeInvite(i)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Data sources */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Connect data sources</h2>
                  <p className="text-muted-foreground mt-1">Select the platforms you'd like to integrate. You can add more later.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DATA_SOURCES.map((ds) => {
                    const active = payload.dataSources.includes(ds.id);
                    return (
                      <button
                        key={ds.id}
                        onClick={() => toggleSource(ds.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border bg-secondary/50 hover:border-primary/30"
                        }`}
                      >
                        <span className="font-medium text-foreground">{ds.label}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{ds.desc}</p>
                        {active && <Check className="w-4 h-4 text-primary mt-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Finish */}
            {step === 4 && (
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">You're all set!</h2>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    <strong className="text-foreground">{payload.company.name || "Your company"}</strong> is ready.
                    {payload.skipped.length > 0 && (
                      <span className="block text-xs mt-2 text-muted-foreground">
                        Skipped: {payload.skipped.join(", ")} — you can complete these anytime in Settings.
                      </span>
                    )}
                  </p>
                </div>
                <Button size="lg" onClick={handleFinish} className="gap-2">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
            <Button variant="ghost" onClick={goBack} disabled={step === 0} className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <div className="flex gap-2">
              {isSkippable && (
                <Button variant="ghost" onClick={handleSkip} className="gap-1 text-muted-foreground">
                  Skip <SkipForward className="w-4 h-4" />
                </Button>
              )}
              <Button onClick={goNext} disabled={!canNext()} className="gap-1">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
