import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, TrendingUp, BarChart3, Layers, Palette, ShoppingCart, FileText, Check, FileBarChart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Executive } from "@/data/experts";

const domainIcons: Record<string, any> = {
  ceo: Brain, cmo: TrendingUp, cfo: BarChart3, coo: Layers, legal: FileText,
  "accounting-agent": BarChart3, "growth-agent": TrendingUp, "inventory-agent": Layers,
  "creative-director": Palette, "graphic-designer": Palette, "art-director": Palette,
  "marketplace-agent": ShoppingCart,
};

interface AgentCardProps {
  agent: Executive;
  index: number;
}

const CapabilityMatrix = ({ capabilities }: { capabilities: string[] }) => {
  return (
    <div className="mb-3">
      <p className="text-[9px] font-bold uppercase tracking-widest mb-[12px]" style={{ color: "rgba(30, 107, 255, 0.7)" }}>
        Yetkinlik Matrisi
      </p>
      <div className="flex flex-col gap-[8px]">
        {capabilities.map((cap, i) => (
          <CapabilityItem key={i} cap={cap} />
        ))}
      </div>
    </div>
  );
};

const CapabilityItem = ({ cap }: { cap: string }) => {
  const desc = getCapabilityDescription(cap);
  return (
    <div className="flex items-start gap-[6px] min-w-0">
      <div className="w-[16px] shrink-0 pt-[2px]">
        <Check
          className="h-3 w-3"
          style={{
            color: "#00E676",
            filter: "drop-shadow(0 0 4px rgba(0, 230, 118, 0.5))",
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium leading-tight truncate" style={{ color: "rgba(255,255,255,0.85)" }}>
          {cap}
        </p>
        {desc && (
          <p className="text-[10px] leading-[1.4] mt-[2px] line-clamp-2" style={{ color: "rgba(255,255,255,0.35)" }}>
            {desc}
          </p>
        )}
      </div>
    </div>
  );
};

const AgentCard = ({ agent, index }: AgentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = domainIcons[agent.id] || Brain;
  const isCLevel = agent.tier === "c-level";

  const capabilities = agent.capabilities || agent.responsibilities;
  const reports = agent.reports || agent.outputs;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <div
        className="relative h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: isHovered
            ? "linear-gradient(180deg, rgba(20, 30, 55, 0.7) 0%, rgba(10, 15, 28, 0.85) 100%)"
            : "linear-gradient(180deg, rgba(18, 26, 46, 0.55) 0%, rgba(10, 15, 28, 0.6) 100%)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: isHovered
            ? "1px solid rgba(30, 107, 255, 0.3)"
            : "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: isHovered
            ? "0 0 40px rgba(30, 107, 255, 0.1), 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 relative"
              style={{
                background: isCLevel
                  ? "linear-gradient(135deg, rgba(30, 107, 255, 0.2) 0%, rgba(30, 107, 255, 0.08) 100%)"
                  : "linear-gradient(135deg, rgba(30, 107, 255, 0.15) 0%, rgba(91, 141, 239, 0.08) 100%)",
                boxShadow: "0 0 20px rgba(30, 107, 255, 0.12)",
              }}
            >
              <Icon className="h-5 w-5" style={{ color: isCLevel ? "#5B8DEF" : "#7BA3F0" }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate" style={{ color: "rgba(255,255,255,0.95)" }}>{agent.role}</h3>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(91, 141, 239, 0.8)" }}>{agent.intelligenceDomain}</p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-[11px] mb-3 line-clamp-2" style={{ color: "rgba(255,255,255,0.45)" }}>{agent.tagline}</p>

          {/* Tags */}
          {agent.tags && (
            <div className="flex flex-wrap gap-1 mb-3">
              {agent.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-[9px] px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, rgba(30, 107, 255, 0.1) 0%, rgba(30, 107, 255, 0.04) 100%)",
                    border: "1px solid rgba(30, 107, 255, 0.15)",
                    color: "rgba(145, 180, 255, 0.85)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* ─── HOVER EXPANSION ─── */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                className="overflow-hidden"
              >
                {/* Section A — Yetkinlik Matrisi */}
                <CapabilityMatrix capabilities={capabilities} />

                {/* Divider */}
                <div className="h-px mb-3" style={{ background: "linear-gradient(90deg, transparent, rgba(30, 107, 255, 0.2), transparent)" }} />

                {/* Section B — Üretebildiği Raporlar */}
                <div className="mb-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(30, 107, 255, 0.7)" }}>
                    Üretebildiği Raporlar
                  </p>
                  <div className="space-y-1.5">
                    {reports.map((report, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <FileBarChart
                          className="h-3 w-3 shrink-0"
                          style={{ color: "rgba(91, 141, 239, 0.7)" }}
                        />
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>{report}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confidence Score */}
          <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-14 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #1E6BFF, #5B8DEF)",
                    boxShadow: "0 0 8px rgba(30, 107, 255, 0.4)",
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${agent.performanceScore}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <span
                className="text-[11px] font-bold"
                style={{
                  color: "#5B8DEF",
                  textShadow: "0 0 10px rgba(91, 141, 239, 0.4)",
                }}
              >
                {agent.performanceScore}%
              </span>
            </div>
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              {agent.tasksCompleted.toLocaleString()} analiz
            </span>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <Link
              to={`/expert/${agent.id}`}
              className="flex-1 text-center text-[11px] font-medium px-3 py-2 rounded-xl transition-all"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.55)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(30, 107, 255, 0.3)";
                e.currentTarget.style.color = "rgba(255,255,255,0.85)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,255,255,0.55)";
              }}
            >
              Profili İncele
            </Link>
            <Link
              to={`/workspace/${agent.id}`}
              className="flex-1 text-center text-[11px] font-medium px-3 py-2 rounded-xl transition-all relative overflow-hidden"
              style={{
                background: "rgba(30, 107, 255, 0.12)",
                color: "#5B8DEF",
                border: "1px solid rgba(30, 107, 255, 0.15)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(30, 107, 255, 0.2)";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(30, 107, 255, 0.15)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(30, 107, 255, 0.12)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Demo Çalıştır
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/** Short descriptions for common capability keywords */
function getCapabilityDescription(cap: string): string {
  const map: Record<string, string> = {
    "Departmanlar arası risk sentezi": "Çapraz departman risk sinyallerini birleştirir",
    "Sermaye tahsis modelleme": "Kaynak dağılımını optimize eder",
    "Büyüme vs kârlılık dengeleme analizi": "Sürdürülebilir büyüme dengesini hesaplar",
    "Senaryo bazlı yönetici simülasyonu": "What-if karar modelleri üretir",
    "Stratejik nakit pisti modelleme": "Uzun vadeli likidite tahmini",
    "Rekabetçi performans kıyaslama": "Sektör kıyaslama endeksi",
    "Organizasyonel verimlilik puanlama": "Departman bazlı verimlilik skoru",
    "Üst düzey maliyet yapısı optimizasyonu": "Maliyet kalemlerini analiz eder",
    "Gelir yoğunlaşma riski tespiti": "Tek kanala bağımlılık riski",
    "KPI uyum değerlendirmesi": "Hedef-gerçekleşme sapma analizi",
    "Risk ısı haritası sentezi": "Çok boyutlu risk görselleştirmesi",
    "Uzun vadeli büyüme sürdürülebilirlik endeksi": "5 yıllık büyüme sağlamlığı",
    "Çapraz kanal performans sentezi": "Tüm kanalları birleşik analiz eder",
    "Kâr-duyarlı ROAS analizi": "Gerçek kâr etkisini hesaplar",
    "Kreatif yorgunluk tespiti": "Görsel performans bozulmasını izler",
    "Bütçe verimlilik eğrisi analizi": "Harcama-getiri eğrisi modelleme",
    "Incrementality tahmini": "Ek satış etkisini ölçer",
    "Hedef kitle örtüşme analizi": "Kitle kesişim ve kaçak tespiti",
    "Kampanya doygunluk tespiti": "Azalan getiri noktası analizi",
    "Marjinal ROAS modelleme": "Ek bütçenin marjinal etkisi",
    "Dinamik katkı marjı modelleme": "Ürün bazlı gerçek kârlılık",
    "Senaryo bazlı KDV projeksiyonu": "Vergi yükü tahminleme",
    "Nakit akışı şok simülasyonu": "Likidite stres testi",
    "Burn rate diagnostiği": "Sermaye tüketim hızı analizi",
    "Envanter hız modelleme": "Stok devir optimizasyonu",
    "Sermaye kilitleme analizi": "Stoktaki sermaye maliyeti",
    "Teslimat gecikme tahmini": "Lojistik risk erken uyarı",
    "Operasyonel marjin erozyonu uyarıları": "Maliyet artış sinyalleri",
    "Pazaryeri ücret etki modelleme": "Komisyon etki analizi",
    "Kanal marjin karşılaştırma": "Kanal bazlı kârlılık farkı",
    "Listing performans diagnostiği": "Ürün listeleme sağlık skoru",
    "Buy box rekabet sinyalleri": "Rekabet pozisyon takibi",
    "Marka tutarlılık puanlama": "Çok kanallı marka uyumu",
    "Kreatif performans korelasyonu": "Görsel-dönüşüm ilişkisi",
  };
  return map[cap] || "";
}

export default AgentCard;
