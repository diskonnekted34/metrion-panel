import { useParams, Navigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowLeft, Download, Share2, Copy, Users, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Maximize, Lock, Clock, Brain, Shield, AlertTriangle,
  TrendingUp, Target, BarChart3, Zap
} from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import ReportIntelligencePanel from "@/components/reports/ReportIntelligencePanel";
import { getReportHubById } from "@/data/reportsHubData";

// ── Report page content data ──
interface PageContent {
  pageNum: number;
  render: (report: ReturnType<typeof getReportHubById>) => React.ReactNode;
}

const tierLabel = { core: "CORE", growth: "GROWTH", enterprise: "ENTERPRISE" } as const;
const confLabel = { public: "GENEL", internal: "İÇ KULLANIM", executive: "YALNIZCA YÖNETİM" } as const;

const CoverPage = ({ report }: { report: NonNullable<ReturnType<typeof getReportHubById>> }) => (
  <div className="flex flex-col h-full min-h-[880px] justify-between" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
    {/* Top bar */}
    <div className="flex items-center justify-between pb-4 border-b border-gray-300">
      <span className="text-[20px] font-semibold text-gray-900" style={{ letterSpacing: "-0.04em" }}>Metrion</span>
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-gray-300 rounded text-gray-500 tracking-widest">
          {confLabel[report.confidentiality]}
        </span>
        <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-gray-300 rounded text-gray-500 tracking-widest">
          {tierLabel[report.packageTier]}
        </span>
      </div>
    </div>

    {/* Center content */}
    <div className="flex-1 flex flex-col justify-center py-16">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Corporate Intelligence Report</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight" style={{ letterSpacing: "-0.02em" }}>
        {report.title}
      </h1>
      <p className="text-lg text-gray-500 mb-8">{report.periodStart} – {report.periodEnd}</p>
      
      <div className="grid grid-cols-3 gap-4 max-w-[420px]">
        <div className="p-3 border border-gray-200 rounded-lg">
          <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Sağlık Skoru</p>
          <p className="text-2xl font-bold text-gray-900" style={{ letterSpacing: "-0.03em" }}>{report.healthScore}</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-lg">
          <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Risk Seviyesi</p>
          <p className={`text-sm font-bold uppercase ${report.risk === "high" || report.risk === "critical" ? "text-red-600" : report.risk === "medium" ? "text-amber-600" : "text-emerald-600"}`}>
            {report.risk}
          </p>
        </div>
        <div className="p-3 border border-gray-200 rounded-lg">
          <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Güven Skoru</p>
          <p className="text-2xl font-bold text-gray-900" style={{ letterSpacing: "-0.03em" }}>%{report.confidence}</p>
        </div>
      </div>
    </div>

    {/* Bottom metadata */}
    <div className="pt-4 border-t border-gray-200">
      <div className="grid grid-cols-2 gap-y-2 text-[10px] text-gray-400">
        <div><span className="text-gray-500 font-medium">Rapor ID:</span> {report.id}</div>
        <div><span className="text-gray-500 font-medium">Hash:</span> <span className="font-mono">{report.hash}</span></div>
        <div><span className="text-gray-500 font-medium">Oluşturulma:</span> {report.generatedAt}</div>
        <div><span className="text-gray-500 font-medium">Model:</span> {report.aiModelVersion}</div>
        <div><span className="text-gray-500 font-medium">Versiyon:</span> v{report.version}</div>
        <div><span className="text-gray-500 font-medium">Bölüm Sayısı:</span> {report.sections}</div>
      </div>
    </div>
  </div>
);

const ExecSummaryPage = ({ report }: { report: NonNullable<ReturnType<typeof getReportHubById>> }) => {
  const summaries: Record<string, { overview: string; financial: string; operational: string; recommendation: string }> = {
    default: {
      overview: `Dönem genelinde şirket sağlık skoru ${report.healthScore}/100 seviyesinde ölçülmüştür. Genel performans ${report.kpiDelta} değişim ile ${report.kpiLabel} metriğinde belirgin hareketlilik göstermiştir. Risk endeksi "${report.risk}" olarak değerlendirilmiş olup, mevcut operasyonel sürdürülebilirlik güçlü temeller üzerinde ilerlemektedir.`,
      financial: "Konsolide gelir ₺2.84M ile bütçenin %3.1 üzerinde gerçekleşmiştir. Net kâr marjı %17.2 ile sektör ortalamasının 2.4pp üzerinde seyreden şirket, katkı marjında 1.3pp iyileşme kaydetmiştir. Nakit pozisyonu $1.87M ile 14.2 aylık runway sunmaktadır. AR aging 32 gün ile kontrol altındadır ancak 28 gün hedefinin üzerindedir.",
      operational: "Operasyonel verimlilik endeksi %87.3 ile hedefin 1.7pp üzerinde ölçülmüştür. Sipariş tamamlama oranı %96.4, ortalama teslimat süresi 2.3 gün ile sektör standardının altında kalmaktadır. Depo kapasitesi %88 ile kritik eşiğe yaklaşmakta olup genişleme kararı beklenmektedir. Teknoloji altyapısı %99.98 uptime ve 42ms latency ile güçlü performans sergilemektedir.",
      recommendation: "Yönetim kuruluna üç kritik öneri sunulmaktadır: (1) Kanal çeşitlendirme stratejisi — tek kanala bağımlılık %58'den %40'ın altına çekilmelidir, (2) Nakit tampon politikası güncellenmeli — 6 aylık tampon hedefi için Q2 bütçe revizyonu yapılmalıdır, (3) Depo genişleme yatırımı — mevcut kapasite Q3'te tükenecek olup erken karar avantajı ₺240K tasarruf sağlayacaktır.",
    },
  };

  const s = summaries.default;

  return (
    <div className="min-h-[880px]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <PageHeader title="Yönetici Özeti" pageNum={2} report={report} />

      {/* Health & Risk Strip */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Sağlık Skoru", value: String(report.healthScore), sub: "/100" },
          { label: "Risk Seviyesi", value: report.risk.toUpperCase(), sub: "", color: report.risk === "high" ? "text-red-600" : report.risk === "medium" ? "text-amber-600" : "text-emerald-600" },
          { label: "Güven", value: `%${report.confidence}`, sub: "" },
          { label: "Runway", value: "14.2", sub: "ay" },
        ].map(m => (
          <div key={m.label} className="p-3 rounded-lg border border-gray-200">
            <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">{m.label}</p>
            <p className={`text-xl font-bold ${m.color ?? "text-gray-900"}`} style={{ letterSpacing: "-0.03em" }}>
              {m.value}<span className="text-xs text-gray-400 font-normal ml-0.5">{m.sub}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <Section title="Genel Değerlendirme" content={s.overview} />
      <Section title="Finansal Durum" content={s.financial} />
      <Section title="Operasyonel Performans" content={s.operational} />
      
      {/* Deviations */}
      <div className="mb-5">
        <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.12em] mb-2 flex items-center gap-1.5">
          <AlertTriangle className="h-3 w-3 text-amber-500" /> Plandan Sapma Tespitleri
        </h4>
        <div className="space-y-1.5">
          {[
            { metric: "Nakit Pozisyonu", deviation: "Planın %8 altında", severity: "medium" },
            { metric: "AR Aging", deviation: "28 gün hedefinin 4 gün üstünde", severity: "low" },
            { metric: "Kanal Konsantrasyonu", deviation: "%58 tek kanala bağımlılık", severity: "high" },
          ].map(d => (
            <div key={d.metric} className="flex items-center gap-2 p-2 rounded border border-gray-100 text-[11px]">
              <div className={`h-2 w-2 rounded-full shrink-0 ${d.severity === "high" ? "bg-red-500" : d.severity === "medium" ? "bg-amber-500" : "bg-emerald-500"}`} />
              <span className="font-medium text-gray-700">{d.metric}</span>
              <span className="text-gray-400">—</span>
              <span className="text-gray-600">{d.deviation}</span>
            </div>
          ))}
        </div>
      </div>

      <Section title="AI Stratejik Yorum & Öneri" content={s.recommendation} />
    </div>
  );
};

const KPIPage = ({ report }: { report: NonNullable<ReturnType<typeof getReportHubById>> }) => {
  const kpis = [
    { label: "Aylık Gelir", value: "₺2.84M", plan: "₺2.75M", actual: "₺2.84M", delta: "+3.3%", positive: true, min: "₺2.41M", avg: "₺2.68M", max: "₺2.92M", forecast30: "₺2.91M", forecast90: "₺3.12M" },
    { label: "Net Kâr", value: "₺412K", plan: "₺380K", actual: "₺412K", delta: "+8.4%", positive: true, min: "₺340K", avg: "₺388K", max: "₺425K", forecast30: "₺420K", forecast90: "₺445K" },
    { label: "Katkı Marjı", value: "%42.6", plan: "%41.0", actual: "%42.6", delta: "+1.6pp", positive: true, min: "%38.2", avg: "%40.8", max: "%43.1", forecast30: "%42.9", forecast90: "%43.4" },
    { label: "Nakit Pozisyonu", value: "$1.87M", plan: "$2.03M", actual: "$1.87M", delta: "-7.9%", positive: false, min: "$1.62M", avg: "$1.78M", max: "$2.03M", forecast30: "$1.92M", forecast90: "$2.14M" },
    { label: "CAC", value: "₺148", plan: "₺160", actual: "₺148", delta: "-7.5%", positive: true, min: "₺142", avg: "₺154", max: "₺168", forecast30: "₺145", forecast90: "₺139" },
    { label: "LTV", value: "₺2,240", plan: "₺2,100", actual: "₺2,240", delta: "+6.7%", positive: true, min: "₺1,980", avg: "₺2,120", max: "₺2,280", forecast30: "₺2,310", forecast90: "₺2,450" },
    { label: "LTV/CAC", value: "15.1x", plan: "13.1x", actual: "15.1x", delta: "+2.0x", positive: true, min: "11.8x", avg: "13.8x", max: "15.5x", forecast30: "15.9x", forecast90: "17.6x" },
    { label: "Churn Oranı", value: "%1.8", plan: "%2.2", actual: "%1.8", delta: "-0.4pp", positive: true, min: "%1.6", avg: "%2.0", max: "%2.4", forecast30: "%1.7", forecast90: "%1.5" },
    { label: "ROAS", value: "4.2x", plan: "3.8x", actual: "4.2x", delta: "+0.4x", positive: true, min: "3.4x", avg: "3.9x", max: "4.4x", forecast30: "4.3x", forecast90: "4.6x" },
    { label: "NPS", value: "72", plan: "68", actual: "72", delta: "+4pt", positive: true, min: "64", avg: "69", max: "74", forecast30: "73", forecast90: "76" },
    { label: "Sipariş Tamamlama", value: "%96.4", plan: "%95.0", actual: "%96.4", delta: "+1.4pp", positive: true, min: "%93.8", avg: "%95.2", max: "%97.1", forecast30: "%96.6", forecast90: "%97.0" },
    { label: "Uptime", value: "%99.98", plan: "%99.95", actual: "%99.98", delta: "+0.03pp", positive: true, min: "%99.92", avg: "%99.96", max: "%99.99", forecast30: "%99.98", forecast90: "%99.98" },
  ];

  return (
    <div className="min-h-[880px]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <PageHeader title="KPI & Trend Analizi" pageNum={3} report={report} />

      {/* KPI Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="grid grid-cols-[1fr_70px_70px_60px_50px_50px_50px_60px_60px] gap-0 px-3 py-2 bg-gray-50 text-[8px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
          <span>Metrik</span>
          <span>Plan</span>
          <span>Gerçekleşen</span>
          <span>Δ</span>
          <span>Min</span>
          <span>Ort</span>
          <span>Max</span>
          <span>30G Tah.</span>
          <span>90G Tah.</span>
        </div>
        {kpis.map((k, i) => (
          <div key={k.label} className={`grid grid-cols-[1fr_70px_70px_60px_50px_50px_50px_60px_60px] gap-0 px-3 py-2 text-[10px] ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} border-b border-gray-100 last:border-0`}>
            <span className="font-medium text-gray-800">{k.label}</span>
            <span className="text-gray-500">{k.plan}</span>
            <span className="font-semibold text-gray-900">{k.actual}</span>
            <span className={`font-bold ${k.positive ? "text-emerald-600" : "text-red-500"}`}>{k.delta}</span>
            <span className="text-gray-400">{k.min}</span>
            <span className="text-gray-400">{k.avg}</span>
            <span className="text-gray-400">{k.max}</span>
            <span className="text-blue-600">{k.forecast30}</span>
            <span className="text-blue-600">{k.forecast90}</span>
          </div>
        ))}
      </div>

      {/* Anomaly Detection */}
      <div className="mb-5">
        <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.12em] mb-2 flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-amber-500" /> Anomali Tespiti
        </h4>
        <div className="space-y-1.5">
          {[
            "Nakit pozisyonu plandan %7.9 sapma göstermekte — tahsilat hızlandırma önerilmektedir.",
            "LTV/CAC oranı benchmark üstünde — premium segment genişletme fırsatı tespit edilmiştir.",
            "Churn oranı 3 aydır düşüş trendinde — retention stratejisi etkili, sürdürülmeli.",
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded border border-gray-100 text-[10px] text-gray-600">
              <Zap className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
              {a}
            </div>
          ))}
        </div>
      </div>

      {/* Benchmark */}
      <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/50">
        <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">Sektör Benchmark Karşılaştırması</h4>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Kâr Marjı", company: "%17.2", sector: "%14.8", status: "above" },
            { label: "CAC", company: "₺148", sector: "₺172", status: "above" },
            { label: "NPS", company: "72", sector: "65", status: "above" },
            { label: "Churn", company: "%1.8", sector: "%2.6", status: "above" },
          ].map(b => (
            <div key={b.label} className="text-center">
              <p className="text-[9px] text-gray-400 mb-0.5">{b.label}</p>
              <p className="text-[12px] font-bold text-gray-900">{b.company}</p>
              <p className="text-[9px] text-gray-400">Sektör: {b.sector}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RiskActionsPage = ({ report }: { report: NonNullable<ReturnType<typeof getReportHubById>> }) => (
  <div className="min-h-[880px]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
    <PageHeader title="Risk & Aksiyonlar" pageNum={4} report={report} />

    {/* Risk Matrix */}
    <div className="mb-6">
      <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.12em] mb-3">Risk Matrisi (Etki × Olasılık)</h4>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_80px_90px_100px] gap-0 px-3 py-2 bg-gray-50 text-[8px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
          <span>Risk Alanı</span>
          <span>Olasılık</span>
          <span>Etki</span>
          <span>Finansal Etki</span>
          <span>Trend</span>
        </div>
        {[
          { area: "Kanal Konsantrasyonu", prob: "Yüksek", impact: "Yüksek", financial: "₺1.2M/çeyrek", trend: "Kötüleşiyor", color: "text-red-600" },
          { area: "Tedarik Zinciri Fragilitesi", prob: "Orta", impact: "Yüksek", financial: "₺480K/ay", trend: "Stabil", color: "text-amber-600" },
          { area: "Yetenek Kaybı", prob: "Düşük", impact: "Orta", financial: "₺220K/çeyrek", trend: "İyileşiyor", color: "text-emerald-600" },
          { area: "Teknoloji Borclanması", prob: "Orta", impact: "Orta", financial: "₺180K/ay", trend: "Kötüleşiyor", color: "text-amber-600" },
          { area: "Regülasyon Uyumu", prob: "Düşük", impact: "Yüksek", financial: "₺2.4M (ceza riski)", trend: "Stabil", color: "text-emerald-600" },
        ].map((r, i) => (
          <div key={r.area} className={`grid grid-cols-[1fr_80px_80px_90px_100px] gap-0 px-3 py-2 text-[10px] ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} border-b border-gray-100 last:border-0`}>
            <span className="font-medium text-gray-800">{r.area}</span>
            <span className={`font-semibold ${r.color}`}>{r.prob}</span>
            <span className={`font-semibold ${r.color}`}>{r.impact}</span>
            <span className="text-gray-700 font-medium">{r.financial}</span>
            <span className={`${r.color} font-medium`}>{r.trend}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Critical Risk Breakdown */}
    <div className="mb-6">
      <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.12em] mb-2">Kritik Risk Detay</h4>
      <div className="space-y-2">
        {[
          { level: "Yüksek", color: "#ef4444", text: "Kanal konsantrasyonu %58 seviyesinde — tek kanala gelir bağımlılığı stratejik risk oluşturuyor. E-ticaret dışı kanalların payı son 6 ayda %3 düştü. Diversifikasyon planı Q2'de başlatılmalı, hedef: %40'ın altına çekilmesi.", financial: "Tahmini Kayıp: ₺1.2M/çeyrek" },
          { level: "Orta", color: "#f59e0b", text: "Tedarik zinciri gecikmesi 3 kritik SKU'yu etkiliyor. Ortalama tedarik süresi 14 güne çıktı (hedef: 10 gün). Alternatif tedarikçi değerlendirmesi başlatılmalı.", financial: "Tahmini Kayıp: ₺480K/ay" },
          { level: "Düşük", color: "#22c55e", text: "Teknoloji altyapısı güçlü. Uptime %99.98, latency 42ms. Auto-scaling yapılandırması tamamlandı. Ölçekleme 3x'e kadar desteklenmektedir.", financial: "Kontrol Altında" },
        ].map((r, i) => (
          <div key={i} className="p-3 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                <span className="text-[10px] font-bold uppercase" style={{ color: r.color }}>{r.level}</span>
              </div>
              <span className="text-[9px] font-medium text-gray-500">{r.financial}</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Opportunity Areas */}
    <div className="mb-6">
      <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.12em] mb-2 flex items-center gap-1.5">
        <TrendingUp className="h-3 w-3 text-emerald-500" /> Fırsat Alanları
      </h4>
      <div className="space-y-1.5">
        {[
          { area: "Premium Segment Genişletme", roi: "+₺420K/çeyrek", confidence: 87 },
          { area: "Organik Kanal Büyümesi", roi: "+₺280K/çeyrek", confidence: 82 },
          { area: "Otomasyon ile Verimlilik", roi: "+₺180K/çeyrek", confidence: 91 },
        ].map(o => (
          <div key={o.area} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100">
            <span className="text-[11px] font-medium text-gray-800">{o.area}</span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-emerald-600">{o.roi}</span>
              <span className="text-[9px] text-gray-400">Güven: %{o.confidence}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* AI Proposed Actions */}
    <div className="mb-5">
      <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.12em] mb-2 flex items-center gap-1.5">
        <Target className="h-3 w-3 text-blue-500" /> AI Önerilen Aksiyonlar
      </h4>
      <div className="space-y-1.5">
        {[
          { action: "Kanal çeşitlendirme stratejisi oluştur — SEO ve organik yatırımı %30 artır", roi: "+₺280K/çeyrek", decision: true },
          { action: "Nakit tampon politikası güncelle — 6 aylık tampon hedefi için bütçe revize et", roi: "+4 ay runway", decision: true },
          { action: "Tedarikçi değişikliği ile COGS %2.5pp düşür — alternatif tedarikçi değerlendir", roi: "+₺180K/çeyrek", decision: false },
          { action: "Premium segment genişletme planı aktive et — ARPU +18.3%, LTV +₺420", roi: "+₺420K/çeyrek", decision: false },
        ].map((a, i) => (
          <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 mt-0.5 shrink-0">{i + 1}.</span>
            <div className="flex-1">
              <p className="text-[11px] text-gray-700 leading-relaxed">{a.action}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[9px] font-bold text-emerald-600">ROI: {a.roi}</span>
                {a.decision && (
                  <span className="text-[8px] font-bold text-red-500 uppercase px-1.5 py-0.5 border border-red-200 rounded bg-red-50">
                    Karar Gerekli
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Shared components ──

const PageHeader = ({ title, pageNum, report }: { title: string; pageNum: number; report: NonNullable<ReturnType<typeof getReportHubById>> }) => (
  <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
    <div className="flex items-center gap-3">
      <span className="text-[16px] font-semibold text-gray-900" style={{ letterSpacing: "-0.04em" }}>Metrion</span>
      <div className="h-4 w-px bg-gray-300" />
      <span className="text-[10px] text-gray-400 uppercase tracking-widest">{title}</span>
    </div>
    <div className="flex items-center gap-2 text-[9px] text-gray-400">
      <span>{report.periodStart} – {report.periodEnd}</span>
      <span>·</span>
      <span>Sayfa {pageNum}</span>
    </div>
  </div>
);

const Section = ({ title, content }: { title: string; content: string }) => (
  <div className="mb-5">
    <h4 className="text-[10px] font-bold text-gray-800 mb-2 uppercase tracking-[0.12em]">{title}</h4>
    <p className="text-[11px] text-gray-600 leading-relaxed">{content}</p>
  </div>
);

const PageFooter = ({ pageNum, totalPages, confidence }: { pageNum: number; totalPages: number; confidence: number }) => (
  <div className="mt-auto pt-6 border-t border-gray-200 flex items-center justify-between">
    <p className="text-[9px] text-gray-400">Sayfa {pageNum} / {totalPages}</p>
    <p className="text-[9px] text-gray-400">Metrion Intelligence · Güven: %{confidence}</p>
  </div>
);

// ── Main Component ──

const ReportViewer = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const totalPages = 4;

  const report = reportId ? getReportHubById(reportId) : null;
  if (!report) return <Navigate to="/reports" />;

  const pages = [
    { num: 1, label: "Kapak", component: <CoverPage report={report} /> },
    { num: 2, label: "Yönetici Özeti", component: <ExecSummaryPage report={report} /> },
    { num: 3, label: "KPI Analizi", component: <KPIPage report={report} /> },
    { num: 4, label: "Risk & Aksiyonlar", component: <RiskActionsPage report={report} /> },
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-[1440px] mx-auto">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link to="/reports" className="hover:text-foreground transition-colors">Raporlar</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[300px]">{report.title}</span>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}
          className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/reports" className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-secondary/50 transition-colors">
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </Link>
              <h1 className="text-xl font-bold text-foreground">{report.title}</h1>
              <Lock className="h-3.5 w-3.5 text-primary/60" />
              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                { core: "border-border/30 text-muted-foreground", growth: "border-primary/20 text-primary", enterprise: "border-warning/20 text-warning" }[report.packageTier]
              }`}>{report.packageTier}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground ml-10">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {report.periodStart} – {report.periodEnd}</span>
              <span>·</span>
              <span>{report.generatedAt}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Brain className="h-3 w-3 text-primary" /> Güven %{report.confidence}</span>
              <span>·</span>
              <span className="font-mono text-[10px]">v{report.version}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toast.info("PDF indiriliyor...")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
              <Download className="h-3.5 w-3.5" /> PDF İndir
            </button>
            <button onClick={() => toast.info("Paylaşım — yakında aktif")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60 transition-all">
              <Share2 className="h-3.5 w-3.5" /> Paylaş
            </button>
            <button onClick={() => toast.info(`${report.recipientsCount} alıcı: ${report.recipients.join(", ")}`)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60 transition-all">
              <Users className="h-3.5 w-3.5" /> Alıcılar
            </button>
            <button onClick={() => { navigator.clipboard.writeText(report.id); toast.success("ID kopyalandı"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60 transition-all">
              <Copy className="h-3.5 w-3.5" /> ID
            </button>
          </div>
        </motion.div>

        {/* Main layout */}
        <div className="flex gap-4">
          {/* PDF Viewer */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl border border-border/20 overflow-hidden bg-card/50 backdrop-blur-xl">
              {/* Controls */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/20">
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                    className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary/50 disabled:opacity-30 transition-all">
                    <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <div className="flex items-center gap-1">
                    {pages.map(p => (
                      <button key={p.num} onClick={() => setPage(p.num)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                          page === p.num ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        }`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
                    className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary/50 disabled:opacity-30 transition-all">
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setZoom(Math.max(50, zoom - 10))}
                    className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary/50 transition-all">
                    <ZoomOut className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <span className="text-[11px] text-muted-foreground w-10 text-center">{zoom}%</span>
                  <button onClick={() => setZoom(Math.min(200, zoom + 10))}
                    className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary/50 transition-all">
                    <ZoomIn className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <div className="w-px h-4 bg-border/20 mx-1" />
                  <button onClick={() => setZoom(100)}
                    className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary/50 transition-all">
                    <Maximize className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Paper */}
              <div className="p-8 flex justify-center bg-muted/30">
                <div className="w-full max-w-[680px] bg-white rounded-lg shadow-2xl overflow-hidden"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.2s" }}>
                  <div className="p-10">
                    {pages.find(p => p.num === page)?.component}
                    <PageFooter pageNum={page} totalPages={totalPages} confidence={report.confidence} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Intelligence Panel */}
          <div className="hidden lg:block w-[340px] shrink-0 rounded-2xl border border-border/20 overflow-hidden bg-card/50 backdrop-blur-xl">
            <div className="px-5 py-3.5 border-b border-border/20">
              <h3 className="text-xs font-semibold text-foreground">Report Intelligence</h3>
            </div>
            <ReportIntelligencePanel report={report} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportViewer;
