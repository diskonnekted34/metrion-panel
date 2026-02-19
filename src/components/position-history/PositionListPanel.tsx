import type { PositionWithMetrics } from "@/core/types/positionHistory";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface Props {
  positions: PositionWithMetrics[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusColors: Record<string, string> = {
  ACTIVE: "badge-success",
  ACTING: "badge-warning",
  VACANT: "badge-error",
};

const statusLabels: Record<string, Record<string, string>> = {
  ACTIVE: { tr: "Aktif", en: "Active" },
  ACTING: { tr: "Vekil", en: "Acting" },
  VACANT: { tr: "Boş", en: "Vacant" },
};

const handoverColors: Record<string, string> = {
  GOOD: "badge-success",
  RISKY: "badge-error",
  UNKNOWN: "badge-neutral",
};

const reasonLabels: Record<string, Record<string, string>> = {
  RESIGNED: { tr: "İstifa", en: "Resigned" },
  PROMOTED: { tr: "Terfi", en: "Promoted" },
  TERMINATED: { tr: "İhraç", en: "Terminated" },
  REORG: { tr: "Yeniden Yapılanma", en: "Re-org" },
  BACKFILL: { tr: "Yedek Atama", en: "Backfill" },
  ACTING_APPOINTMENT: { tr: "Vekil Atama", en: "Acting" },
  OTHER: { tr: "Diğer", en: "Other" },
};

const PositionListPanel = ({ positions, selectedId, onSelect }: Props) => {
  const { lang } = useLanguage();

  if (positions.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {lang === "tr" ? "Filtrelere uygun pozisyon bulunamadı." : "No positions match filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {positions.map(pos => {
        const m = pos.metrics;
        const isSelected = pos.id === selectedId;
        const tenureLabel = m.tenure_days > 0
          ? `${Math.floor(m.tenure_days / 30)}${lang === "tr" ? " ay" : "mo"} ${m.tenure_days % 30}${lang === "tr" ? " gün" : "d"}`
          : "—";

        return (
          <button
            key={pos.id}
            onClick={() => onSelect(pos.id)}
            className={`w-full text-left glass-card p-3.5 transition-all duration-200 ${
              isSelected
                ? "ring-1 ring-primary/40 border-primary/30"
                : "hover:border-primary/15"
            }`}
          >
            {/* Row 1: Title + Status */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">{pos.title}</span>
                <span className="text-[10px] text-muted-foreground">— {pos.department}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[m.status]}`}>
                {statusLabels[m.status]?.[lang] ?? m.status}
              </span>
            </div>

            {/* Row 2: Current holder + tenure */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-foreground/80 truncate">
                {pos.current_holder?.full_name ?? (lang === "tr" ? "Atanmamış" : "Unassigned")}
              </span>
              <span className="text-[11px] text-muted-foreground">{tenureLabel}</span>
            </div>

            {/* Row 3: Mini metrics */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Stability */}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                m.stability_score >= 80 ? "badge-success" :
                m.stability_score >= 50 ? "badge-warning" : "badge-error"
              }`}>
                {lang === "tr" ? "Stb" : "Stb"} {m.stability_score}
              </span>

              {/* Changes 12M */}
              <span className="text-[10px] text-muted-foreground">
                {m.changes_12m} {lang === "tr" ? "değişim" : "chg"} / 12M
              </span>

              {/* Avg tenure */}
              <span className="text-[10px] text-muted-foreground">
                ø {Math.round(m.avg_tenure_days / 30)}{lang === "tr" ? " ay" : "mo"}
              </span>

              {/* Vacancy */}
              {m.vacancy_days > 0 && (
                <span className="text-[10px] badge-warning px-1.5 py-0.5 rounded">
                  {m.vacancy_days}{lang === "tr" ? " gün boş" : "d vacant"}
                </span>
              )}

              {/* Handover */}
              <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 ${handoverColors[m.handover_quality]}`}>
                {m.handover_quality}
              </Badge>

              {/* Last reason */}
              {pos.last_transition_reason && (
                <span className="text-[10px] text-muted-foreground/70">
                  {reasonLabels[pos.last_transition_reason]?.[lang] ?? pos.last_transition_reason}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PositionListPanel;
