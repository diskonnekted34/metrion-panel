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
  { title: "Finans Derin Analiz", icon: TrendingUp, agent: "cfo", clusterId: "finans" },
  { title: "Performans Simülasyonu", icon: Brain, agent: "cmo", clusterId: "buyume" },
  { title: "Operasyonel Risk Taraması", icon: Shield, agent: "coo", clusterId: "operasyon" },
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

      <div className="glass-card p-4 relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: "linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />

        <div className="relative z-10 flex gap-4 items-start">
          {/* Left — Input */}
          <div className="flex-1 min-w-0">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={displayedPlaceholder}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-white/[0.08] bg-secondary/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-all"
                />
              </div>
              <Button onClick={() => handleLaunch()} className="h-10 px-5 gap-2 shrink-0">
                <Zap className="h-4 w-4" />
                Başlat
              </Button>
            </div>
            <p className="text-[9px] text-muted-foreground mt-1.5 ml-1">Gelişmiş analizler ek işlem gücü kullanabilir.</p>
          </div>

          {/* Right — 3 horizontal templates */}
          <div className="flex gap-2 shrink-0 overflow-x-auto">
            {quickTemplates.map((t) => (
              <button
                key={t.title}
                onClick={() => handleLaunch(t.clusterId)}
                className="glass-card px-3 py-2.5 text-left group hover:border-primary/30 transition-all cursor-pointer min-w-[140px]"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <t.icon className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Advanced
                  </span>
                </div>
                <p className="text-[11px] font-medium text-foreground leading-tight">{t.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IntelligenceLauncher;
