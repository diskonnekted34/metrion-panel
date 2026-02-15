import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Brain, TrendingUp, Shield, Layers, Sparkles, AlertTriangle, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const placeholders = [
  "Son 60 gün kârlılık riskini analiz et",
  "Büyüme hızımız sürdürülebilir mi?",
  "Kanal bazlı marj simülasyonu çalıştır",
  "Operasyonel verimlilik analizi yap",
  "Nakit akışı stres testi uygula",
];

interface AnalysisTemplate {
  title: string;
  description: string;
  icon: React.ElementType;
  agent: string;
}

const templates: AnalysisTemplate[] = [
  { title: "Finans Derin Analiz", description: "Gelir yapısı, maliyet dağılımı ve nakit akış modellemesi.", icon: TrendingUp, agent: "cfo" },
  { title: "Performans Simülasyonu", description: "Kanal bazlı ROAS ve büyüme senaryosu projeksiyonu.", icon: Sparkles, agent: "cmo" },
  { title: "Operasyonel Risk Taraması", description: "Envanter, lojistik ve tedarik zinciri risk analizi.", icon: Shield, agent: "coo" },
  { title: "Stratejik Senaryo Modeli", description: "Çoklu değişkenli senaryo simülasyonu ve etki analizi.", icon: Brain, agent: "ceo" },
  { title: "Creative Intelligence Scan", description: "Kreatif performans matrisi ve içerik etkinlik analizi.", icon: Layers, agent: "cmo" },
  { title: "Multi-Department Risk Synthesis", description: "Departmanlar arası çapraz risk korelasyonu ve sentez raporu.", icon: AlertTriangle, agent: "ceo" },
];

interface Recommendation {
  signal: string;
  action: string;
  template: string;
  risk: "critical" | "warning";
}

const recommendations: Recommendation[] = [
  { signal: "Kanal B'de marj erozyonu tespit edildi", action: "Finans Derin Analiz başlat", template: "Finans Derin Analiz", risk: "warning" },
  { signal: "3 SKU'da stok tükenme riski yükseldi", action: "Operasyonel Risk Taraması başlat", template: "Operasyonel Risk Taraması", risk: "critical" },
  { signal: "Meta Ads ROAS doygunluk eşiğine yaklaşıyor", action: "Performans Simülasyonu başlat", template: "Performans Simülasyonu", risk: "warning" },
];

const riskDot: Record<string, string> = {
  critical: "bg-destructive",
  warning: "bg-warning",
};

const IntelligenceLauncher = () => {
  const [query, setQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const full = placeholders[placeholderIdx];
    let charIdx = 0;
    setDisplayedPlaceholder("");
    const interval = setInterval(() => {
      charIdx++;
      setDisplayedPlaceholder(full.slice(0, charIdx));
      if (charIdx >= full.length) {
        clearInterval(interval);
        setTimeout(() => setPlaceholderIdx((prev) => (prev + 1) % placeholders.length), 2500);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [placeholderIdx]);

  const handleLaunch = (agentId?: string) => {
    const target = agentId || "cfo";
    navigate(`/agent/${target}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div className="glass-card p-6 relative overflow-hidden">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Derin Analiz Başlat</h2>
            </div>
            <p className="text-xs text-muted-foreground ml-10">Gelişmiş AI işlem gücüyle işletmeni detaylı analiz et.</p>
          </div>

          {/* PART 1 — Free Analysis Input */}
          <div className="mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={displayedPlaceholder}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/[0.08] bg-secondary/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-all"
                />
              </div>
              <Button onClick={() => handleLaunch()} className="h-11 px-6 gap-2 shrink-0">
                <Zap className="h-4 w-4" />
                Derin Analiz Başlat
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 ml-1">Gelişmiş analizler ek işlem gücü kullanabilir.</p>
          </div>

          {/* PART 2 — Quick Analysis Templates */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Hızlı Analiz Şablonları</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {templates.map((t) => (
                <button
                  key={t.title}
                  onClick={() => handleLaunch(t.agent)}
                  className="glass-card p-4 text-left group hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <t.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Advanced Processing
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">{t.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* PART 3 — System Recommendations */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sistem Önerileri</p>
            <div className="space-y-2">
              {recommendations.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleLaunch()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-secondary/40 hover:bg-secondary/60 hover:border-primary/20 transition-all text-left group"
                >
                  <div className={`h-2 w-2 rounded-full shrink-0 ${riskDot[r.risk]}`} />
                  <p className="text-xs text-muted-foreground flex-1">
                    <span className="text-foreground font-medium">{r.signal}</span>
                  </p>
                  <div className="flex items-center gap-1 text-primary text-[11px] font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                    {r.action}
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IntelligenceLauncher;
