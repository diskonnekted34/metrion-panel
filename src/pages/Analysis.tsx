import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { Brain, FileText, BarChart3, FileDown, Send, Play, Archive, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Rotating placeholders ── */
const placeholders = [
  "2025 Q4 ile 2026 Q1 finans karşılaştırması",
  "Son 5 ay satış faturaları özet raporu",
  "Risk seviyesi en çok artan departman hangisi?",
  "Gelir %10 düşerse runway ne olur?",
  "Pazarlama ROI analizi — son 90 gün",
  "Operasyonel maliyet optimizasyon fırsatları",
];

type OutputMode = "text" | "structured" | "pdf";

interface AnalysisSection {
  title: string;
  content: string;
}

/* ── Mock AI output generator ── */
function generateMockAnalysis(query: string, mode: OutputMode): AnalysisSection[] {
  const base: AnalysisSection[] = [
    {
      title: "Yönetici Özeti",
      content: `"${query}" sorgusu kapsamında yapılan analiz, mevcut operasyonel ve finansal göstergelerin stratejik hedeflerle uyumunu değerlendirmektedir. Genel performans endeksi %78.4 seviyesinde olup, önceki döneme göre +2.1 puan artış göstermiştir. Kritik sapma alanları aşağıda detaylandırılmıştır.`,
    },
    {
      title: "KPI Karşılaştırması",
      content: "Gelir Büyümesi: %12.4 (Hedef: %15) · Müşteri Edinme Maliyeti: ₺2,340 (Hedef: ₺2,100) · Net Kâr Marjı: %18.7 (Hedef: %20) · Operasyonel Verimlilik: %84.2 (Hedef: %85) · Çalışan Başına Gelir: ₺142K (Hedef: ₺150K) · Müşteri Yaşam Boyu Değeri: ₺28,400 (Hedef: ₺30,000)",
    },
    {
      title: "Trend Analizi",
      content: "Son 90 günlük veri seti incelendiğinde gelir büyümesinde yatay bir seyir gözlemlenmektedir. Pazarlama harcama etkinliği (ROAS) 3.2x'ten 2.8x'e gerilemiş, bu durum kanal doygunluğuna işaret etmektedir. Operasyonel maliyetler aylık %1.3 artış trendi göstermekte olup, Q2 sonunda marj baskısı oluşturma riski taşımaktadır.",
    },
    {
      title: "Risk Etkisi",
      content: "Yüksek Risk: Pazarlama kanal doygunluğu — Tahmini finansal etki: ₺840K/çeyrek · Orta Risk: Operasyonel maliyet artışı — Tahmini etki: ₺320K/çeyrek · Düşük Risk: Tedarik zinciri gecikmeleri — Tahmini etki: ₺150K/çeyrek",
    },
    {
      title: "AI Önerisi",
      content: "1. Pazarlama bütçesinin %15'ini düşük performanslı kanallardan yüksek ROAS kanallarına yeniden tahsis edin (Tahmini ROI: 2.4x). 2. Operasyonel otomasyon yatırımını Q2'de %20 artırarak maliyet artış trendini kırın. 3. Müşteri edinme stratejisini organik büyüme kanallarına kaydırarak CAC'yi ₺2,100 hedefine çekin.",
    },
  ];

  if (mode === "structured" || mode === "pdf") {
    base.push(
      {
        title: "Karşılaştırma Tablosu",
        content: "Departman | Q4 Performans | Q1 Performans | Değişim\nFinans | %82 | %85 | +3.0pp\nPazarlama | %76 | %72 | -4.0pp\nOperasyon | %88 | %87 | -1.0pp\nTeknoloji | %91 | %93 | +2.0pp\nSatış | %79 | %81 | +2.0pp",
      },
      {
        title: "Risk Matrisi",
        content: "Yüksek Etki / Yüksek Olasılık: Kanal doygunluğu, Marj baskısı\nYüksek Etki / Düşük Olasılık: Regülasyon değişikliği\nDüşük Etki / Yüksek Olasılık: Tedarik gecikmeleri\nDüşük Etki / Düşük Olasılık: Kur dalgalanması",
      },
      {
        title: "Aksiyon Önerileri",
        content: "1. Pazarlama bütçe rebalansı — Sahip: CMO — Süre: 2 hafta — Tahmini ROI: ₺1.2M/yıl\n2. Otomasyon yatırım artışı — Sahip: COO — Süre: Q2 — Tahmini ROI: ₺960K/yıl\n3. Organik büyüme programı — Sahip: CMO — Süre: Q2-Q3 — Tahmini ROI: ₺640K/yıl",
      }
    );
  }

  return base;
}

const modeConfig: { key: OutputMode; label: string; icon: typeof FileText; tier: string }[] = [
  { key: "text", label: "Analitik Metin", icon: FileText, tier: "Core" },
  { key: "structured", label: "Yapılandırılmış Rapor", icon: BarChart3, tier: "Growth" },
  { key: "pdf", label: "PDF Hazırla", icon: FileDown, tier: "Enterprise" },
];

export default function Analysis() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<OutputMode>("text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AnalysisSection[] | null>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  // Rotate placeholders
  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx((p) => (p + 1) % placeholders.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleGenerate = useCallback(() => {
    if (!query.trim()) return;
    setIsGenerating(true);
    setResult(null);
    // Simulate AI processing
    setTimeout(() => {
      setResult(generateMockAnalysis(query, mode));
      setIsGenerating(false);
    }, 2200);
  }, [query, mode]);

  return (
    <AppLayout>
      <div className="max-w-[960px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/12 flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              Executive Intelligence Terminal
            </h1>
          </div>
          <p className="text-sm text-muted-foreground pl-11">
            Doğal dil ile özel analiz üretin.
          </p>
        </div>

        {/* Input area */}
        <div className="mb-8">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholders[placeholderIdx]}
              rows={4}
              className="w-full resize-none rounded-2xl bg-card px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all duration-200"
              style={{ minHeight: 120, maxHeight: 280 }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
              }}
            />
          </div>

          {/* Mode toggles */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {modeConfig.map((m) => {
              const active = mode === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary/12 text-primary"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <m.icon className="h-3.5 w-3.5" />
                  <span>{m.label}</span>
                  <span className="text-[9px] uppercase tracking-wider opacity-50 ml-1">{m.tier}</span>
                </button>
              );
            })}
          </div>

          {/* Generate button */}
          <div className="mt-5">
            <motion.button
              onClick={handleGenerate}
              disabled={!query.trim() || isGenerating}
              className="relative flex items-center gap-2.5 px-7 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Subtle glow */}
              <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: "0 0 30px 4px hsl(220 100% 59% / 0.25)" }} />
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span>Analiz üretiliyor…</span>
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  <span>Analizi Üret</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Loading state */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-card">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-muted-foreground">Veri kaynakları taranıyor, analiz modeli çalışıyor…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Output */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Metadata strip */}
              <div className="flex items-center gap-4 mb-6 text-[10px] text-muted-foreground uppercase tracking-widest">
                <span>Manual Intelligence Report</span>
                <span>·</span>
                <span>{new Date().toLocaleDateString("tr-TR")}</span>
                <span>·</span>
                <span>{result.length} bölüm</span>
                <span>·</span>
                <span>Güven: %94.2</span>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                {result.map((section, i) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-2xl bg-card p-6"
                  >
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                      {section.title}
                    </h3>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-8 pt-6" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                {[
                  { label: "PDF'ye Dönüştür", icon: FileDown, tier: "Enterprise" },
                  { label: "Karar Merkezine Gönder", icon: Send, tier: "Enterprise" },
                  { label: "Simülasyon Olarak Çalıştır", icon: Play, tier: "Enterprise" },
                  { label: "Raporlar Arşivine Kaydet", icon: Archive, tier: "Growth" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                  >
                    <action.icon className="h-3.5 w-3.5" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
