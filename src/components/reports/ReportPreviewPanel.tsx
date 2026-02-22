import { Copy, ExternalLink, Download, Users, Shield, Hash, Clock, Brain, Database } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { ReportRow } from "@/data/reportsHubData";

interface ReportPreviewPanelProps {
  report: ReportRow | null;
}

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
    low: "text-success bg-success/10 border-success/20",
    medium: "text-warning bg-warning/10 border-warning/20",
    high: "text-destructive bg-destructive/10 border-destructive/20",
    critical: "text-destructive bg-destructive/15 border-destructive/30",
  }[report.risk];

  return (
    <div className="p-5 space-y-4 h-full overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>
      {/* Report cover placeholder */}
      <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent">
          <div className="text-center">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3" style={{ boxShadow: "0 0 30px rgba(30,107,255,0.15)" }}>
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">{report.title}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{report.periodStart} – {report.periodEnd}</p>
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
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${riskColor}`}>
            {report.risk.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5"><Hash className="h-3 w-3" /> Hash</span>
          <button onClick={() => { navigator.clipboard.writeText(report.hash); toast.success("Hash kopyalandı"); }}
            className="text-foreground font-mono text-[10px] hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
            {report.hash} <Copy className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      {/* Sources */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Database className="h-3 w-3" /> Veri Kaynakları
        </p>
        <div className="flex flex-wrap gap-1.5">
          {report.sources.map(s => (
            <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] border border-white/[0.06] text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <Link to={`/reports/${report.id}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-all"
          style={{ boxShadow: "0 0 20px rgba(30,107,255,0.2)" }}>
          <ExternalLink className="h-3.5 w-3.5" /> Raporu Aç
        </Link>
        <button onClick={() => toast.info("PDF indiriliyor...")}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-foreground border border-white/[0.08] hover:border-white/[0.16] bg-white/[0.02] transition-all">
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
