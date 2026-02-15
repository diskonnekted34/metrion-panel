import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Brain, TrendingUp, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const placeholders = [
  "Son 60 gün kârlılık riskini analiz et",
  "Büyüme hızımız sürdürülebilir mi?",
  "Kanal bazlı marj simülasyonu çalıştır",
  "Operasyonel verimlilik analizi yap",
  "Nakit akışı stres testi uygula",
];

const quickTemplates = [
  { title: "Finans Derin Analiz", description: "Gelir, marj ve nakit akışı üzerinde çok katmanlı risk değerlendirmesi.", icon: TrendingUp, agent: "cfo", clusterId: "finans" },
  { title: "Performans Simülasyonu", description: "Kanal bazlı büyüme senaryolarını modelleyerek optimal bütçe dağılımını hesapla.", icon: Brain, agent: "cmo", clusterId: "buyume" },
  { title: "Operasyonel Risk Taraması", description: "Tedarik zinciri, stok ve süreç darboğazlarını proaktif olarak tespit et.", icon: Shield, agent: "coo", clusterId: "operasyon" },
];

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

  const handleLaunch = (clusterId?: string) => {
    navigate(`/intelligence/${clusterId || "finans"}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Derin Analiz Başlat</h2>
        <span className="text-[10px] text-muted-foreground">Gelişmiş AI işlem gücüyle detaylı analiz çalıştırın.</span>
      </div>

      <div className="glass-card p-5 relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: "linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />

        <div className="relative z-10 space-y-4">
          {/* Full-width input */}
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

          {/* Templates row below input */}
          <div className="flex gap-3 overflow-x-auto">
            {quickTemplates.map((t) => (
              <button
                key={t.title}
                onClick={() => handleLaunch(t.clusterId)}
                className="glass-card px-3.5 py-2.5 text-left group hover:border-primary/30 hover:shadow-[0_0_16px_rgba(30,107,255,0.08)] transition-all cursor-pointer min-w-[190px] flex items-center gap-3 shrink-0"
              >
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <t.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-foreground leading-[1.3] group-hover:text-white transition-colors truncate">{t.title}</p>
                  <p className="text-[10px] text-muted-foreground/60 leading-[1.35] mt-0.5 line-clamp-1 group-hover:text-muted-foreground/80 transition-colors">{t.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IntelligenceLauncher;
