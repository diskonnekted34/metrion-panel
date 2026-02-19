import type { PositionWithMetrics } from "@/core/types/positionHistory";
import { useLanguage } from "@/i18n/LanguageContext";
import { Shield, AlertTriangle, Clock, Users, TrendingDown } from "lucide-react";

interface Props {
  position: PositionWithMetrics;
}

const PositionSummary = ({ position: pos }: Props) => {
  const { lang } = useLanguage();
  const m = pos.metrics;

  const statusLabel: Record<string, Record<string, string>> = {
    ACTIVE: { tr: "Aktif", en: "Active" },
    ACTING: { tr: "Vekil", en: "Acting" },
    VACANT: { tr: "Boş", en: "Vacant" },
  };

  const statusColor = m.status === "ACTIVE" ? "text-success" : m.status === "ACTING" ? "text-warning" : "text-destructive";

  const riskBadges: { label: string; active: boolean }[] = [
    { label: lang === "tr" ? "Yüksek Değişim" : "High Churn", active: m.changes_12m >= 2 },
    { label: lang === "tr" ? "Zayıf Devir-Teslim" : "Weak Handover", active: m.handover_quality === "RISKY" },
    { label: lang === "tr" ? "Boş Gün Yüksek" : "High Vacancy", active: m.vacancy_days > 30 },
  ];

  const activeRisks = riskBadges.filter(r => r.active);

  return (
    <div className="glass-card p-5 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-foreground">{pos.title}</h2>
            <span className={`text-xs font-bold ${statusColor}`}>
              {statusLabel[m.status]?.[lang] ?? m.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{pos.department} • {pos.level.replace("_", " ")}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
            m.stability_score >= 80 ? "bg-success/10 text-success" :
            m.stability_score >= 50 ? "bg-warning/10 text-warning" :
            "bg-destructive/10 text-destructive"
          }`}>
            <Shield className="h-5 w-5" />
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${
              m.stability_score >= 80 ? "text-success" :
              m.stability_score >= 50 ? "text-warning" :
              "text-destructive"
            }`}>{m.stability_score}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {lang === "tr" ? "Stabilite" : "Stability"}
            </p>
          </div>
        </div>
      </div>

      {/* Current holder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricBox
          icon={<Users className="h-3.5 w-3.5" />}
          label={lang === "tr" ? "Mevcut Atanan" : "Current Holder"}
          value={pos.current_holder?.full_name ?? (lang === "tr" ? "Boş" : "Vacant")}
        />
        <MetricBox
          icon={<Clock className="h-3.5 w-3.5" />}
          label={lang === "tr" ? "Görev Süresi" : "Tenure"}
          value={m.tenure_days > 0
            ? `${Math.floor(m.tenure_days / 30)} ${lang === "tr" ? "ay" : "mo"} ${m.tenure_days % 30} ${lang === "tr" ? "gün" : "d"}`
            : "—"}
        />
        <MetricBox
          icon={<TrendingDown className="h-3.5 w-3.5" />}
          label={lang === "tr" ? "Değişim (12A)" : "Changes (12M)"}
          value={String(m.changes_12m)}
        />
        <MetricBox
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          label={lang === "tr" ? "Boş Gün (24A)" : "Vacancy (24M)"}
          value={`${m.vacancy_days} ${lang === "tr" ? "gün" : "days"}`}
        />
      </div>

      {/* Additional metrics */}
      <div className="flex flex-wrap gap-3 mb-4">
        <MiniStat label={lang === "tr" ? "Ort. Görev Süresi" : "Avg Tenure"} value={`${Math.round(m.avg_tenure_days / 30)} ${lang === "tr" ? "ay" : "mo"}`} />
        <MiniStat label={lang === "tr" ? "Vekil Oranı" : "Acting Ratio"} value={`${Math.round(m.acting_ratio * 100)}%`} />
        <MiniStat label={lang === "tr" ? "Devir Kalitesi" : "Handover"} value={m.handover_quality} className={
          m.handover_quality === "GOOD" ? "text-success" : m.handover_quality === "RISKY" ? "text-destructive" : "text-muted-foreground"
        } />
      </div>

      {/* Risk badges */}
      {activeRisks.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3">
          {activeRisks.map(r => (
            <span key={r.label} className="badge-error text-[10px] font-medium px-2 py-0.5 rounded-full">
              {r.label}
            </span>
          ))}
        </div>
      )}

      {/* Microcopy */}
      <p className="text-[11px] text-muted-foreground/60 italic">
        {lang === "tr"
          ? "Kurumsal hafıza: pozisyon değişimleri, scope/yetki diff'leri ve devir-teslim kalitesi tek yerde."
          : "Corporate memory: position transitions, scope/authority diffs and handover quality in one place."}
      </p>
    </div>
  );
};

const MetricBox = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-secondary/30 border border-border/30 rounded-xl p-3">
    <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">{icon}<span className="text-[10px] uppercase tracking-wider">{label}</span></div>
    <p className="text-sm font-semibold text-foreground truncate">{value}</p>
  </div>
);

const MiniStat = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
  <div className="bg-secondary/20 border border-border/20 rounded-lg px-3 py-2">
    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
    <p className={`text-xs font-bold ${className || "text-foreground"}`}>{value}</p>
  </div>
);

export default PositionSummary;
