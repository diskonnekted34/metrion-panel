import { Copy, ExternalLink, Download, Users, Shield, Hash, Clock, Brain, Database, Lock, Tag } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { ReportRow } from "@/data/reportsHubData";

interface ReportPreviewPanelProps {
  report: ReportRow | null;
}

const tierColors: Record<string, string> = {
  core: "text-muted-foreground bg-muted/50",
  growth: "text-primary bg-primary/8",
  enterprise: "text-warning bg-warning/8",
};

const ReportPreviewPanel = ({ report }: ReportPreviewPanelProps) => {
  if (!report) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Bir rapor seçin</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Detay ve önizleme burada görünecek</p>
        </div>
      </div>
    );
  }

  const riskColor = {
    low: "text-success bg-success/10",
    medium: "text-warning bg-warning/10",
    high: "text-destructive bg-destructive/10",
    critical: "text-destructive bg-destructive/15",
  }[report.risk];

  return (
    <div className="p-5 space-y-4 h-full overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>
      {/* Cover preview */}
      <div className="rounded-xl overflow-hidden bg-secondary/20">
        <div className="aspect-[4/3] flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-[16px] font-semibold text-foreground mb-1" style={{ letterSpacing: "-0.04em" }}>Metrion</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-3">Intelligence Report</p>
            <p className="text-sm font-semibold text-foreground">{report.title}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{report.periodStart} – {report.periodEnd}</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${tierColors[report.packageTier]}`}>
                {report.packageTier}
              </span>
              <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                {report.confidentiality === "executive" ? "Yönetim" : report.confidentiality === "internal" ? "İç" : "Genel"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Rapor ID</span>
          <span className="text-foreground font-mono text-[11px]">{report.id}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" /> Oluşturulma</span>
          <span className="text-foreground">{report.generatedAt}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5"><Brain className="h-3 w-3" /> Güven</span>
          <span className="text-primary font-semibold">%{report.confidence}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Sağlık</span>
          <span className="text-foreground font-bold text-base">{report.healthScore}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Risk</span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${riskColor}`}>
            {report.risk.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5"><Tag className="h-3 w-3" /> Versiyon</span>
          <span className="text-foreground font-mono text-[10px]">v{report.version}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5"><Lock className="h-3 w-3" /> Model</span>
          <span className="text-foreground text-[10px]">{report.aiModelVersion}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5"><Hash className="h-3 w-3" /> Hash</span>
          <button onClick={() => { navigator.clipboard.writeText(report.hash); toast.success("Hash kopyalandı"); }}
            className="text-foreground font-mono text-[10px] hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
            {report.hash} <Copy className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      {/* Top Risk & Opportunity */}
      <div className="space-y-2">
        <div className="p-2.5 rounded-xl bg-destructive/5">
          <p className="text-[9px] font-bold text-destructive uppercase tracking-wider mb-1">Top Risk</p>
          <p className="text-[10px] text-foreground leading-relaxed">{report.topRisk}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-success/5">
          <p className="text-[9px] font-bold text-success uppercase tracking-wider mb-1">Top Fırsat</p>
          <p className="text-[10px] text-foreground leading-relaxed">{report.topOpportunity}</p>
        </div>
      </div>

      {/* Sources */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Database className="h-3 w-3" /> Veri Kaynakları
        </p>
        <div className="flex flex-wrap gap-1.5">
          {report.sources.map(s => (
            <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary/50 text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <Link to={`/reports/${report.id}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-all">
          <ExternalLink className="h-3.5 w-3.5" /> Raporu Aç
        </Link>
        <button onClick={() => toast.info("PDF indiriliyor...")}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-foreground bg-secondary/30 hover:bg-secondary/50 transition-all">
          <Download className="h-3.5 w-3.5" /> PDF İndir
        </button>
        <button onClick={() => { navigator.clipboard.writeText(report.id); toast.success("Rapor ID kopyalandı"); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Copy className="h-3 w-3" /> Kopyala: Report ID
        </button>
        <button onClick={() => toast.info(`${report.recipientsCount} alıcı: ${report.recipients.join(", ")}`)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Users className="h-3 w-3" /> Alıcıları Gör
        </button>
      </div>
    </div>
  );
};

export default ReportPreviewPanel;
