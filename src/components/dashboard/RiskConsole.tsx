import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, TrendingUp, TrendingDown, ArrowRight, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RiskRow {
  category: string;
  score: number;
  trend: "up" | "down" | "stable";
  driver: string;
  recommendation: string;
  owner: string;
  eta: string;
  tint: string;
  detail: {
    summary: string;
    evidence: string[];
    hypotheses: { text: string; confidence: number }[];
    actions: string[];
  };
}

const risks: RiskRow[] = [
  {
    category: "Finansal",
    score: 42,
    trend: "down",
    driver: "Nakit tamponu planın altında",
    recommendation: "6 aylık tampon hedefi belirle",
    owner: "CFO Agent",
    eta: "3 gün",
    tint: "245,158,11",
    detail: {
      summary: "Nakit tamponu planın %8 altında. Maliyet artışı baskısı devam ediyor ancak gelir büyümesi riski dengeliyor.",
      evidence: ["Cash balance $1.87M (plan: $2.03M)", "Burn rate $195K/ay (↓%3.2)", "Revenue growth +12.4%"],
      hypotheses: [
        { text: "Maliyet enflasyonu tamponun altında kalmasına neden oluyor", confidence: 78 },
        { text: "Q1 yatırımları tam geri dönüş sağlamamış olabilir", confidence: 62 },
      ],
      actions: ["Nakit rezerv politikasını güncelle", "Q2 bütçe planlamasını revize et"],
    },
  },
  {
    category: "Operasyonel",
    score: 58,
    trend: "up",
    driver: "3 SKU stok tükenme eşiğinde",
    recommendation: "Acil sipariş tetikle",
    owner: "COO Agent",
    eta: "Acil",
    tint: "239,68,68",
    detail: {
      summary: "Tedarik zinciri gecikmesi 3 kritik SKU'yu etkiliyor. Tahmini gelir kaybı $120K/ay.",
      evidence: ["SKU-A12 stok: 3 gün", "SKU-B45 stok: 5 gün", "Tedarik süresi +2.3 gün"],
      hypotheses: [
        { text: "Tedarikçi üretim kapasitesi yetersiz", confidence: 85 },
        { text: "Lojistik darboğazı geçici", confidence: 45 },
      ],
      actions: ["Acil sipariş tetikle", "Alternatif tedarikçi değerlendir"],
    },
  },
  {
    category: "Büyüme",
    score: 35,
    trend: "down",
    driver: "Kanal doygunluğu %72",
    recommendation: "Çeşitlendirme başlat",
    owner: "CMO Agent",
    eta: "7 gün",
    tint: "30,107,255",
    detail: {
      summary: "Kanal konsantrasyonu %58 tek kanala bağlı. Diversifikasyon kritik.",
      evidence: ["Google Ads payı %58", "Organik kanal %22", "Sosyal medya %12"],
      hypotheses: [
        { text: "Google Ads doygunluk noktasına yaklaşıyor", confidence: 72 },
        { text: "Organik kanal hızlı büyüme potansiyeline sahip", confidence: 68 },
      ],
      actions: ["Kanal çeşitlendirme stratejisi oluştur", "SEO yatırımını artır"],
    },
  },
  {
    category: "Teknoloji",
    score: 28,
    trend: "down",
    driver: "Altyapı güncelleme tamamlanıyor",
    recommendation: "Monitoring genişlet",
    owner: "CTO Agent",
    eta: "14 gün",
    tint: "0,229,255",
    detail: {
      summary: "Altyapı kapasitesi artırıldı, uptime %99.98'e ulaştı. Minimal risk.",
      evidence: ["Uptime %99.98", "Latency 42ms (↓%15)", "Error rate %0.02"],
      hypotheses: [
        { text: "Mevcut altyapı Q2 yüküne dayanabilir", confidence: 88 },
      ],
      actions: ["Auto-scaling politikasını aktifleştir"],
    },
  },
];

const severityColor = (score: number) => {
  if (score >= 70) return "#EF4444";
  if (score >= 50) return "#F59E0B";
  if (score >= 30) return "#1E6BFF";
  return "#16C784";
};

const overallScore = Math.round(risks.reduce((s, r) => s + r.score, 0) / risks.length);
const topDrivers = risks.sort((a, b) => b.score - a.score).slice(0, 3).map(r => r.driver);

const RiskConsole = () => {
  const [openDetail, setOpenDetail] = useState<number | null>(null);
  const [sortCol, setSortCol] = useState<"score" | "category">("score");
  const navigate = useNavigate();

  const sorted = [...risks].sort((a, b) =>
    sortCol === "score" ? b.score - a.score : a.category.localeCompare(b.category)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-warning" />
          <h2 className="text-lg font-semibold text-foreground">Risk Radarı</h2>
        </div>
        <button
          onClick={() => navigate("/alerts")}
          className="text-[0.65rem] text-primary/70 hover:text-primary transition-colors flex items-center gap-1"
        >
          Detaylı Analiz <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Summary strip */}
      <div className="flex items-center gap-4 px-4 py-2.5 mb-3 bg-secondary/50 border border-black" style={{ borderRadius: "var(--radius-inner, 12px)" }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold" style={{ color: severityColor(overallScore) }}>{overallScore}</span>
          <span className="text-[0.6rem] text-muted-foreground/40">/ 100</span>
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex-1">
          <p className="text-[0.6rem] text-muted-foreground/50 mb-0.5">En kritik etkenler</p>
          <p className="text-[0.68rem] text-foreground/70">{topDrivers.join(" · ")}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden glass-card" style={{ padding: 0 }}>
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[0.6rem] font-semibold text-muted-foreground/50 uppercase tracking-wider border-b border-black">
          <button className="col-span-2 text-left flex items-center gap-1" onClick={() => setSortCol("category")}>
            Kategori {sortCol === "category" && <ChevronDown className="h-2.5 w-2.5" />}
          </button>
          <button className="col-span-1 text-left flex items-center gap-1" onClick={() => setSortCol("score")}>
            Risk {sortCol === "score" && <ChevronDown className="h-2.5 w-2.5" />}
          </button>
          <div className="col-span-1">Trend</div>
          <div className="col-span-3">Etken</div>
          <div className="col-span-2">Öneri</div>
          <div className="col-span-2">Sahip</div>
          <div className="col-span-1">ETA</div>
        </div>

        {/* Rows */}
        {sorted.map((r, i) => {
          const sc = severityColor(r.score);
          return (
            <div key={r.category}>
              <button
                onClick={() => setOpenDetail(openDetail === i ? null : i)}
                className="w-full grid grid-cols-12 gap-2 px-4 py-3 text-left hover:bg-secondary/30 transition-colors items-center border-b border-black"
              >
                <div className="col-span-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ background: sc, boxShadow: `0 0 6px ${sc}40` }} />
                  <span className="text-[0.72rem] font-medium text-foreground">{r.category}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-[0.8rem] font-bold" style={{ color: sc }}>{r.score}</span>
                </div>
                <div className="col-span-1">
                  {r.trend === "up" ? (
                    <TrendingUp className="h-3.5 w-3.5 text-destructive" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-success" />
                  )}
                </div>
                <div className="col-span-3 text-[0.68rem] text-muted-foreground/70 truncate">{r.driver}</div>
                <div className="col-span-2 text-[0.68rem] text-primary/60 truncate">{r.recommendation}</div>
                <div className="col-span-2 text-[0.65rem] text-muted-foreground/50">{r.owner}</div>
                <div className={`col-span-1 text-[0.65rem] font-medium ${r.eta === "Acil" ? "text-destructive" : "text-muted-foreground"}`}>{r.eta}</div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Risk Detail Drawer */}
      <AnimatePresence>
        {openDetail !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end"
            onClick={() => setOpenDetail(null)}
          >
            <div className="absolute inset-0 bg-black/60" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md h-full p-6 overflow-y-auto"
              style={{
                background: "linear-gradient(180deg, rgba(8,8,8,0.98) 0%, rgba(2,2,2,0.99) 100%)",
                borderLeft: "0.5px solid rgba(255,255,255,0.08)",
              }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setOpenDetail(null)} className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-white/[0.04]">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-10 w-10 flex items-center justify-center text-lg font-bold"
                  style={{
                    background: `${severityColor(sorted[openDetail].score)}15`,
                    color: severityColor(sorted[openDetail].score),
                    borderRadius: "var(--radius-inner, 12px)",
                  }}
                >
                  {sorted[openDetail].score}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{sorted[openDetail].category} Risk</h3>
                  <p className="text-[0.65rem] text-muted-foreground/50">{sorted[openDetail].owner} · {sorted[openDetail].eta}</p>
                </div>
              </div>

              <p className="text-[0.8rem] text-foreground/80 leading-relaxed mb-5">{sorted[openDetail].detail.summary}</p>

              <div className="space-y-5">
                <div>
                  <p className="text-[0.65rem] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">Kanıtlar</p>
                  <div className="space-y-1.5">
                    {sorted[openDetail].detail.evidence.map((e, i) => (
                      <div key={i} className="flex items-center gap-2 text-[0.72rem] text-foreground/70">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                        {e}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[0.65rem] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">Hipotezler</p>
                  <div className="space-y-2">
                    {sorted[openDetail].detail.hypotheses.map((h, i) => (
                      <div key={i} className="flex items-center justify-between gap-2">
                        <span className="text-[0.72rem] text-foreground/70">{h.text}</span>
                        <span
                          className="text-[0.6rem] font-bold shrink-0 px-2 py-0.5"
                          style={{
                            background: h.confidence >= 70 ? "rgba(22,199,132,0.12)" : "rgba(245,158,11,0.12)",
                            color: h.confidence >= 70 ? "#16C784" : "#F59E0B",
                            borderRadius: "var(--radius-pill, 999px)",
                          }}
                        >
                          %{h.confidence}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[0.65rem] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">Önerilen Aksiyonlar</p>
                  <div className="space-y-1.5">
                    {sorted[openDetail].detail.actions.map((a, i) => (
                      <div key={i} className="text-[0.72rem] text-primary/80 flex items-center gap-2">
                        <ArrowRight className="h-2.5 w-2.5 text-primary/50" />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RiskConsole;
