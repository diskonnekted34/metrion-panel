import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Search, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  recommendations,
  getDisplayedRecommendations,
  categoryOptions,
  type AnalysisRecommendation,
} from "@/data/analysisRecommendations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ── Typing placeholder ── */
const placeholders = [
  "Son 60 gün kârlılık riskini analiz et",
  "Büyüme hızımız sürdürülebilir mi?",
  "Kanal bazlı marj simülasyonu çalıştır",
  "Operasyonel verimlilik analizi yap",
  "Nakit akışı stres testi uygula",
];

/* ── Recommendation Card ── */
const RecommendationCard = ({
  rec,
  onLaunch,
}: {
  rec: AnalysisRecommendation;
  onLaunch: (clusterId: string) => void;
}) => {
  const Icon = rec.icon;
  return (
    <button
      onClick={() => onLaunch(rec.clusterId)}
      className="glass-card p-5 text-left group hover:border-primary/30 hover:shadow-[0_0_20px_rgba(30,107,255,0.1)] transition-all duration-150 cursor-pointer flex flex-col gap-3 min-h-[120px] w-full"
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h4 className="text-[18px] font-semibold text-foreground leading-[1.3] group-hover:text-white transition-colors truncate">
          {rec.title}
        </h4>
      </div>
      <p className="text-[14px] text-muted-foreground/65 leading-[1.4] line-clamp-2">
        {rec.description}
      </p>
    </button>
  );
};

/* ── All Recommendations Modal ── */
const AllRecommendationsModal = ({
  open,
  onOpenChange,
  onLaunch,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onLaunch: (clusterId: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Tümü");

  const filtered = useMemo(() => {
    let list = [...recommendations];
    if (category !== "Tümü") list = list.filter((r) => r.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.usageScore - a.usageScore);
  }, [search, category]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-card border-white/[0.06]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Tüm Analiz Şablonları
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            16 önceden yapılandırılmış derin analiz şablonu
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Şablon ara..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-white/[0.08] bg-secondary/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === cat
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-secondary/60 text-muted-foreground border border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto max-h-[55vh] mt-3 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((rec) => (
              <RecommendationCard
                key={rec.id}
                rec={rec}
                onLaunch={(id) => {
                  onOpenChange(false);
                  onLaunch(id);
                }}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-12">
              Eşleşen şablon bulunamadı.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ── Main Component ── */
const IntelligenceLauncher = () => {
  const [query, setQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const displayed = useMemo(() => getDisplayedRecommendations(), []);

  useEffect(() => {
    const full = placeholders[placeholderIdx];
    let charIdx = 0;
    setDisplayedPlaceholder("");
    const interval = setInterval(() => {
      charIdx++;
      setDisplayedPlaceholder(full.slice(0, charIdx));
      if (charIdx >= full.length) {
        clearInterval(interval);
        setTimeout(
          () => setPlaceholderIdx((prev) => (prev + 1) % placeholders.length),
          2500
        );
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
        <h2 className="text-lg font-semibold text-foreground">
          Derin Analiz Başlat
        </h2>
        <span className="text-[10px] text-muted-foreground">
          Gelişmiş AI işlem gücüyle detaylı analiz çalıştırın.
        </span>
      </div>

      <div className="glass-card p-5 relative overflow-hidden">
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 space-y-5">
          {/* Command Bar */}
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={displayedPlaceholder}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-white/[0.08] bg-secondary/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-all"
                />
              </div>
              <Button
                onClick={() => handleLaunch()}
                className="h-12 px-6 gap-2 shrink-0"
              >
                <Zap className="h-4 w-4" />
                Derin Analiz Başlat
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground/50 pl-1">
              Gelişmiş analizler ek işlem gücü kullanabilir.
            </p>
          </div>

          {/* Quick Analysis Section */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold tracking-[0.08em] uppercase text-muted-foreground/60">
              Hızlı Analiz Şablonları
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayed.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  onLaunch={handleLaunch}
                />
              ))}
            </div>

            {/* View All */}
            <div className="flex justify-center pt-1">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1.5 text-[13px] text-primary/80 hover:text-primary font-medium transition-colors group"
              >
                Tüm Önerileri Gör
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AllRecommendationsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onLaunch={handleLaunch}
      />
    </motion.div>
  );
};

export default IntelligenceLauncher;
