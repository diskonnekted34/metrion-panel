import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { executives } from "@/data/experts";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface TaskCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillObjective?: string;
  prefillAgent?: string;
}

const priorities = [
  { label: "Kritik", value: "critical", color: "bg-destructive/20 text-destructive border-destructive/30" },
  { label: "Yüksek", value: "high", color: "bg-warning/20 text-warning border-warning/30" },
  { label: "Orta", value: "medium", color: "bg-primary/20 text-primary border-primary/30" },
  { label: "Düşük", value: "low", color: "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30" },
];

const outcomeTypes = [
  { label: "Rapor", value: "report", desc: "Yapılandırılmış analiz çıktısı" },
  { label: "Strateji", value: "strategy", desc: "Aksiyon planı ve öneriler" },
  { label: "Uygulama", value: "execution", desc: "Doğrudan operasyonel yürütme" },
  { label: "İzleme", value: "monitoring", desc: "Sürekli gözlem ve uyarı" },
];

const steps = ["Hedef", "Ajan Seçimi", "Öncelik", "Çıktı Tipi", "Onayla"];

const TaskCreationModal = ({ open, onOpenChange, prefillObjective = "", prefillAgent }: TaskCreationModalProps) => {
  const [step, setStep] = useState(0);
  const [objective, setObjective] = useState(prefillObjective);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(prefillAgent ? [prefillAgent] : []);
  const [priority, setPriority] = useState("");
  const [outcomeType, setOutcomeType] = useState("");

  const toggleAgent = (id: string) => {
    setSelectedAgents(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const canNext = () => {
    if (step === 0) return objective.trim().length > 0;
    if (step === 1) return selectedAgents.length > 0;
    if (step === 2) return priority.length > 0;
    if (step === 3) return outcomeType.length > 0;
    return true;
  };

  const handleConfirm = () => {
    onOpenChange(false);
    setStep(0);
    setObjective("");
    setSelectedAgents([]);
    setPriority("");
    setOutcomeType("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Yeni Görev Oluştur</DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center gap-1 mb-4">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-white/[0.08]"}`} />
              {i < steps.length - 1 && <div className={`h-px w-6 transition-colors ${i < step ? "bg-primary/50" : "bg-white/[0.06]"}`} />}
            </div>
          ))}
          <span className="text-[10px] text-muted-foreground ml-2">{steps[step]}</span>
        </div>

        {/* Step content */}
        <div className="min-h-[200px]">
          {step === 0 && (
            <div className="space-y-3">
              <label className="text-sm text-secondary-foreground">Görev Hedefi</label>
              <textarea
                value={objective}
                onChange={e => setObjective(e.target.value)}
                placeholder="Örn: Q4 kampanya ROAS analizini tamamla"
                className="w-full h-24 bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <label className="text-sm text-secondary-foreground">Ajan Seçimi (çoklu seçim)</label>
              <div className="grid grid-cols-2 gap-2">
                {executives.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => toggleAgent(ex.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                      selectedAgents.includes(ex.id)
                        ? "border-primary/50 bg-primary/10"
                        : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><span className="text-[9px] font-bold text-primary">{ex.role.charAt(0)}</span></div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{ex.role}</p>
                      <p className="text-[10px] text-muted-foreground">{ex.name}</p>
                    </div>
                    {selectedAgents.includes(ex.id) && <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <label className="text-sm text-secondary-foreground">Öncelik Seviyesi</label>
              <div className="grid grid-cols-2 gap-2">
                {priorities.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      priority === p.value ? p.color : "border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:bg-white/[0.04]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <label className="text-sm text-secondary-foreground">Çıktı Tipi</label>
              <div className="space-y-2">
                {outcomeTypes.map(o => (
                  <button
                    key={o.value}
                    onClick={() => setOutcomeType(o.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      outcomeType === o.value
                        ? "border-primary/50 bg-primary/10"
                        : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{o.label}</p>
                      <p className="text-[10px] text-muted-foreground">{o.desc}</p>
                    </div>
                    {outcomeType === o.value && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <label className="text-sm text-secondary-foreground">Özet</label>
              <div className="space-y-3 bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
                <div>
                  <p className="text-[10px] text-muted-foreground">Hedef</p>
                  <p className="text-sm text-foreground">{objective}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Ajanlar</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAgents.map(id => {
                      const ex = executives.find(e => e.id === id);
                      return ex ? <Badge key={id} variant="secondary" className="text-[10px]">{ex.role}</Badge> : null;
                    })}
                  </div>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Öncelik</p>
                    <p className="text-sm text-foreground capitalize">{priorities.find(p => p.value === priority)?.label}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Çıktı Tipi</p>
                    <p className="text-sm text-foreground">{outcomeTypes.find(o => o.value === outcomeType)?.label}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="text-muted-foreground"
          >
            Geri
          </Button>
          {step < 4 ? (
            <Button
              size="sm"
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="gap-1"
            >
              İleri <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button size="sm" onClick={handleConfirm} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Görevi Oluştur
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreationModal;
