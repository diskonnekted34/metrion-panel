import { useState } from "react";
import { X, Send, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { scenarios, comparisonKPIs } from "@/data/strategyMock";
import { toast } from "sonner";

const decisionTypes = ["Budget", "Hiring", "Pricing", "Ops", "Risk", "Product"];

interface Props {
  open: boolean;
  onClose: () => void;
  onSaveDraft: (title: string) => void;
}

const DecisionBuilder = ({ open, onClose, onSaveDraft }: Props) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [objective, setObjective] = useState("");
  const [impact, setImpact] = useState("");
  const [risks, setRisks] = useState("");
  const [confidence, setConfidence] = useState(50);
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([]);
  const [scenario, setScenario] = useState("");

  const isValid = title.trim() && type && objective.trim();

  const handleSave = () => {
    onSaveDraft(title);
    toast.success("Taslak kaydedildi", { description: `"${title}" stratejik inbox'a eklendi.` });
    resetAndClose();
  };

  const handleSend = () => {
    toast.success("Karar merkezi'ne gönderildi", { description: `"${title}" karar merkezi kuyruğuna eklendi.` });
    resetAndClose();
  };

  const resetAndClose = () => {
    setTitle(""); setType(""); setObjective(""); setImpact(""); setRisks("");
    setConfidence(50); setSelectedKPIs([]); setScenario("");
    onClose();
  };

  const toggleKPI = (id: string) => {
    setSelectedKPIs(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-card border-l border-border overflow-y-auto">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">Karar Taslağı Oluştur</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1 block">Karar Başlığı *</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ör: Q2 bütçe artışı" />
            </div>

            {/* Type */}
            <div>
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">Karar Tipi *</label>
              <div className="flex flex-wrap gap-1.5">
                {decisionTypes.map(t => (
                  <button key={t} onClick={() => setType(t)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors ${
                      type === t ? "bg-primary/10 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>

            {/* Objective */}
            <div>
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1 block">Hedef *</label>
              <textarea value={objective} onChange={e => setObjective(e.target.value)}
                className="w-full h-20 rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                placeholder="Bu kararın stratejik hedefi nedir?" />
            </div>

            {/* Impact */}
            <div>
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1 block">Beklenen Etki</label>
              <Input value={impact} onChange={e => setImpact(e.target.value)} placeholder="Ör: ARR +%15, CAC -%8" />
            </div>

            {/* Risks */}
            <div>
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1 block">Riskler</label>
              <Input value={risks} onChange={e => setRisks(e.target.value)} placeholder="Ör: Burn rate artışı, takım kapasitesi" />
            </div>

            {/* Confidence */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Güven</label>
                <span className="text-[10px] text-foreground font-medium tabular-nums">%{confidence}</span>
              </div>
              <Slider min={0} max={100} step={1} value={[confidence]} onValueChange={([v]) => setConfidence(v)} />
            </div>

            {/* Supporting KPIs */}
            <div>
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">Destekleyen KPI'lar</label>
              <div className="flex flex-wrap gap-1.5">
                {comparisonKPIs.slice(0, 6).map(kpi => (
                  <button key={kpi.id} onClick={() => toggleKPI(kpi.id)}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-medium border transition-colors ${
                      selectedKPIs.includes(kpi.id) ? "bg-primary/10 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >{kpi.name}</button>
                ))}
              </div>
            </div>

            {/* Attach Scenario */}
            <div>
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1 block">Senaryo Bağla</label>
              <select value={scenario} onChange={e => setScenario(e.target.value)}
                className="w-full h-9 rounded-xl border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              >
                <option value="">Senaryo seçin</option>
                {scenarios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
            <button onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Save className="h-3.5 w-3.5" /> Taslak Kaydet
            </button>
            <button onClick={handleSend} disabled={!isValid}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-3.5 w-3.5" /> Gönder
            </button>
          </div>

          {!isValid && (
            <p className="text-[9px] text-muted-foreground mt-2 text-center">* ile işaretli alanları doldurun.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecisionBuilder;
