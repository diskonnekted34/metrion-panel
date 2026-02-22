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
              <div className="p-8 flex justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                <div className="w-full max-w-[680px] bg-white rounded-lg shadow-2xl overflow-hidden"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.2s" }}>
                  {/* Mock document page */}
                  <div className="p-10 min-h-[880px]">
                    {/* Letterhead */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-800">
                      <div>
                        <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center mb-2">
                          <span className="text-white text-xs font-bold">C</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">C-LEVELS INTELLIGENCE</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500">GİZLİ — YALNIZCA YÖNETİM İÇİN</p>
                        <p className="text-[10px] text-gray-400">{generatedAt}</p>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
                    <p className="text-sm text-gray-500 mb-6">{period}</p>

                    {/* Executive Summary placeholder */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">Executive Summary</h3>
                      <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-3 rounded bg-gray-200" style={{ width: `${95 - i * 8}%` }} />
                        ))}
                      </div>
                    </div>

                    {/* KPI Grid placeholder */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Temel Göstergeler</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {["Gelir", "Net Kâr", "Katkı Marjı", "Nakit", "CAC", "LTV"].map(label => (
                          <div key={label} className="p-3 rounded-lg border border-gray-200">
                            <p className="text-[10px] text-gray-500 mb-1">{label}</p>
                            <div className="h-4 rounded bg-gray-200 w-3/4 mb-2" />
                            <div className="h-8 rounded bg-gray-100 w-full" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risk section placeholder */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">Risk Değerlendirmesi</h3>
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded border border-gray-100">
                            <div className="h-2 w-2 rounded-full" style={{ background: ["#ef4444", "#f59e0b", "#22c55e"][i] }} />
                            <div className="h-3 rounded bg-gray-200 flex-1" style={{ width: `${80 - i * 15}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-6 border-t border-gray-200 flex items-center justify-between">
                      <p className="text-[9px] text-gray-400">Sayfa {page} / {totalPages}</p>
                      <p className="text-[9px] text-gray-400 font-mono">{hubReport?.hash ?? "0xA3F1B2"}</p>
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
