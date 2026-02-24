import { useParams, Navigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowLeft, Download, Share2, Copy, Users, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Maximize, Lock, FileText, Clock, Brain
} from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import ReportIntelligencePanel from "@/components/reports/ReportIntelligencePanel";
import { getReportHubById } from "@/data/reportsHubData";
import { getReportById } from "@/data/intelligenceReports";

const ReportViewer = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const totalPages = 8;

  // Try new hub data first, fall back to old data
  const hubReport = reportId ? getReportHubById(reportId) : null;
  const legacyReport = reportId ? getReportById(reportId) : null;

  if (!hubReport && !legacyReport) return <Navigate to="/reports" />;

  const title = hubReport?.title ?? legacyReport?.title ?? "";
  const period = hubReport ? `${hubReport.periodStart} – ${hubReport.periodEnd}` : legacyReport?.subtitle ?? "";
  const generatedAt = hubReport?.generatedAt ?? legacyReport?.generatedAt ?? "";
  const confidence = hubReport?.confidence ?? legacyReport?.confidenceScore ?? 0;
  const id = hubReport?.id ?? legacyReport?.id ?? "";

  return (
    <AppLayout>
      <div className="p-6 max-w-[1440px] mx-auto">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link to="/strategy" className="hover:text-foreground transition-colors">Strateji</Link>
          <span>/</span>
          <Link to="/reports" className="hover:text-foreground transition-colors">Raporlar</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[300px]">{title}</span>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}
          className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/reports" className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors">
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </Link>
              <h1 className="text-xl font-bold text-foreground">{title}</h1>
              <Lock className="h-3.5 w-3.5 text-primary/60" />
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground ml-10">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {period}</span>
              <span>•</span>
              <span>{generatedAt}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Brain className="h-3 w-3 text-primary" /> Güven %{confidence}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toast.info("PDF indiriliyor...")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              style={{ boxShadow: "0 0 20px rgba(30,107,255,0.2)" }}>
              <Download className="h-3.5 w-3.5" /> PDF İndir
            </button>
            <button onClick={() => toast.info("Paylaşım — yakında aktif")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-white/[0.16] transition-all">
              <Share2 className="h-3.5 w-3.5" /> Paylaş
            </button>
            <button onClick={() => toast.info(`${hubReport?.recipientsCount ?? 3} alıcı`)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-white/[0.16] transition-all">
              <Users className="h-3.5 w-3.5" /> Alıcılar
            </button>
            <button onClick={() => { navigator.clipboard.writeText(id); toast.success("ID kopyalandı"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-white/[0.16] transition-all">
              <Copy className="h-3.5 w-3.5" /> ID
            </button>
          </div>
        </motion.div>

        {/* Main layout: PDF Viewer + Intelligence Panel */}
        <div className="flex gap-4">
          {/* PDF Viewer */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl border border-white/[0.06] overflow-hidden"
              style={{ background: "rgba(255,255,255,0.015)", backdropFilter: "blur(16px)" }}>
              {/* Viewer controls */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                    className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] disabled:opacity-30 transition-all">
                    <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <span className="text-xs text-foreground font-medium">{page} / {totalPages}</span>
                  <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
                    className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] disabled:opacity-30 transition-all">
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setZoom(Math.max(50, zoom - 10))}
                    className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-all">
                    <ZoomOut className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <span className="text-[11px] text-muted-foreground w-10 text-center">{zoom}%</span>
                  <button onClick={() => setZoom(Math.min(200, zoom + 10))}
                    className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-all">
                    <ZoomIn className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <div className="w-px h-4 bg-white/[0.06] mx-1" />
                  <button onClick={() => setZoom(100)}
                    className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-all">
                    <Maximize className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Paper area */}
              <div className="p-8 flex justify-center bg-muted/50">
                <div className="w-full max-w-[680px] bg-white rounded-lg shadow-2xl overflow-hidden"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.2s" }}>
                  <div className="p-10 min-h-[880px]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    {/* Letterhead */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-800">
                      <div>
                        <span className="text-[18px] font-semibold text-gray-900" style={{ letterSpacing: "-0.04em" }}>Metrion</span>
                        <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-[0.15em]">Intelligence Report</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-medium">GİZLİ — YALNIZCA YÖNETİM İÇİN</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{generatedAt}</p>
                        <p className="text-[9px] text-gray-400 font-mono mt-0.5">{hubReport?.hash ?? "0xA3F1B2"}</p>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
                    <p className="text-sm text-gray-500 mb-6">{period}</p>

                    {/* Executive Summary */}
                    <div className="mb-6">
                      <h3 className="text-[11px] font-bold text-gray-800 mb-2.5 uppercase tracking-[0.12em]">Yönetici Özeti</h3>
                      <p className="text-[12px] text-gray-700 leading-relaxed mb-2">
                        Şirket genel sağlık skoru <strong>78/100</strong> ile pozitif trendini sürdürmektedir. Gelir büyümesi %12.4 ile plan üzerinde seyrederken, kâr marjı katkı marjındaki 1.3pp iyileşmeyle desteklenmektedir. Operasyonel verimlilik endeksi hafif düşüş gösterse de, teknoloji altyapısı %99.98 uptime ile güçlü performans sergilemektedir.
                      </p>
                      <p className="text-[12px] text-gray-700 leading-relaxed">
                        Temel risk alanları arasında kanal konsantrasyonu (%58 tek kanala bağımlılık) ve tedarik zinciri gecikmeleri (ortalama +2.3 gün) öne çıkmaktadır. Nakit tamponu $1.87M ile planın %8 altında seyretmekte olup, 6 aylık tampon hedefine ulaşmak için bütçe revizyonu önerilmektedir.
                      </p>
                    </div>

                    {/* KPI Grid */}
                    <div className="mb-6">
                      <h3 className="text-[11px] font-bold text-gray-800 mb-3 uppercase tracking-[0.12em]">Temel Performans Göstergeleri</h3>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { label: "Aylık Gelir", value: "₺2.84M", delta: "+12.4%", positive: true },
                          { label: "Net Kâr", value: "₺412K", delta: "+8.2%", positive: true },
                          { label: "Katkı Marjı", value: "%42.6", delta: "+1.3pp", positive: true },
                          { label: "Nakit Pozisyonu", value: "$1.87M", delta: "-8% plan", positive: false },
                          { label: "CAC", value: "₺148", delta: "-6.2%", positive: true },
                          { label: "LTV", value: "₺2,240", delta: "+14.1%", positive: true },
                        ].map(kpi => (
                          <div key={kpi.label} className="p-3 rounded-lg border border-gray-200">
                            <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</p>
                            <p className="text-[16px] font-bold text-gray-900" style={{ letterSpacing: "-0.03em" }}>{kpi.value}</p>
                            <p className={`text-[10px] font-semibold mt-0.5 ${kpi.positive ? "text-emerald-600" : "text-red-500"}`}>{kpi.delta}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risk Assessment */}
                    <div className="mb-6">
                      <h3 className="text-[11px] font-bold text-gray-800 mb-2.5 uppercase tracking-[0.12em]">Risk Değerlendirmesi</h3>
                      <div className="space-y-2">
                        {[
                          { level: "Yüksek", color: "#ef4444", text: "Kanal konsantrasyonu %58 — tek kanala bağımlılık riski. Diversifikasyon planı başlatılmalı." },
                          { level: "Orta", color: "#f59e0b", text: "Tedarik zinciri gecikmesi 3 kritik SKU'yu etkiliyor. Tahmini gelir kaybı $120K/ay." },
                          { level: "Düşük", color: "#22c55e", text: "Teknoloji altyapısı güçlü. Uptime %99.98, latency 42ms. Ölçekleme hazırlığı tamamlandı." },
                        ].map((r, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                              <span className="text-[9px] font-bold uppercase" style={{ color: r.color }}>{r.level}</span>
                            </div>
                            <p className="text-[11px] text-gray-600 leading-relaxed">{r.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strategic Recommendations */}
                    <div className="mb-6">
                      <h3 className="text-[11px] font-bold text-gray-800 mb-2.5 uppercase tracking-[0.12em]">Stratejik Öneriler</h3>
                      <div className="space-y-1.5">
                        {[
                          "Kanal çeşitlendirme stratejisi oluşturulmalı — SEO ve organik kanal yatırımı %30 artırılmalı.",
                          "Nakit rezerv politikası güncellenmeli — 6 aylık tampon hedefi için Q2 bütçe revizyonu yapılmalı.",
                          "Tedarikçi değişikliği ile COGS %2.5pp düşürülmeli — alternatif tedarikçi değerlendirmesi başlatılmalı.",
                          "Premium segment genişletme planı aktive edilmeli — tahmini etki: ARPU +18.3%, LTV +₺420.",
                        ].map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 pl-1">
                            <span className="text-[10px] font-bold text-gray-400 mt-0.5 shrink-0">{i + 1}.</span>
                            <p className="text-[11px] text-gray-700 leading-relaxed">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-6 border-t border-gray-200 flex items-center justify-between">
                      <p className="text-[9px] text-gray-400">Sayfa {page} / {totalPages}</p>
                      <p className="text-[9px] text-gray-400">Metrion Intelligence · Güven Skoru: %{confidence}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Intelligence Panel */}
          {hubReport && (
            <div className="hidden lg:block w-[340px] shrink-0 rounded-2xl border border-white/[0.06] overflow-hidden"
              style={{ background: "rgba(255,255,255,0.015)", backdropFilter: "blur(16px)" }}>
              <div className="px-5 py-3.5 border-b border-white/[0.06]">
                <h3 className="text-xs font-semibold text-foreground">Report Intelligence</h3>
              </div>
              <ReportIntelligencePanel report={hubReport} />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportViewer;
