import type { PositionWithMetrics, PositionAssignment } from "@/core/types/positionHistory";
import { useLanguage } from "@/i18n/LanguageContext";
import { getPersonById } from "@/data/positionHistory";
import { daysBetween } from "@/lib/positionHistory/metrics";
import { ChevronRight } from "lucide-react";

interface Props {
  position: PositionWithMetrics;
  onOpenDrawer: (assignment: PositionAssignment) => void;
}

const reasonLabels: Record<string, Record<string, string>> = {
  RESIGNED: { tr: "İstifa", en: "Resigned" },
  PROMOTED: { tr: "Terfi", en: "Promoted" },
  TERMINATED: { tr: "İhraç", en: "Terminated" },
  REORG: { tr: "Yeniden Yapılanma", en: "Re-org" },
  BACKFILL: { tr: "Yedek Atama", en: "Backfill" },
  ACTING_APPOINTMENT: { tr: "Vekil Atama", en: "Acting Appt." },
  OTHER: { tr: "Diğer", en: "Other" },
};

const AssignmentTimeline = ({ position, onOpenDrawer }: Props) => {
  const { lang } = useLanguage();
  const assignments = position.assignments;

  if (assignments.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {lang === "tr" ? "Bu pozisyon için atama geçmişi yok." : "No assignment history for this position."}
        </p>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="glass-card p-5 md:p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
        {lang === "tr" ? "Atama Zaman Çizgisi" : "Assignment Timeline"}
      </h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border/50" />

        <div className="space-y-0">
          {assignments.map((a, idx) => {
            const person = getPersonById(a.person_id);
            const isCurrent = a.end_date === null;
            const endStr = a.end_date ?? today;
            const duration = daysBetween(a.start_date, endStr);
            const durationLabel = `${Math.floor(duration / 30)}${lang === "tr" ? " ay" : "mo"} ${duration % 30}${lang === "tr" ? " gün" : "d"}`;

            // Show vacancy gap between segments
            let vacancyGap: number | null = null;
            if (idx > 0) {
              const prevEnd = assignments[idx - 1].end_date;
              if (prevEnd && prevEnd < a.start_date) {
                vacancyGap = daysBetween(prevEnd, a.start_date);
              }
            }

            const isActing = a.assignment_type === "ACTING";

            return (
              <div key={a.id}>
                {/* Vacancy gap indicator */}
                {vacancyGap !== null && vacancyGap > 0 && (
                  <div className="relative flex items-center pl-[10px] py-2">
                    <div className="h-[18px] w-[18px] rounded-full border-2 border-dashed border-destructive/40 bg-destructive/5 flex items-center justify-center z-10">
                      <span className="text-[7px] text-destructive font-bold">V</span>
                    </div>
                    <span className="ml-3 text-[10px] text-destructive/70 italic">
                      {vacancyGap} {lang === "tr" ? "gün boşluk" : "day vacancy gap"}
                    </span>
                  </div>
                )}

                {/* Assignment segment */}
                <button
                  onClick={() => onOpenDrawer(a)}
                  className="relative flex items-start pl-[10px] py-3 w-full text-left group hover:bg-primary/[0.03] rounded-xl transition-all"
                >
                  {/* Dot */}
                  <div className={`h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center z-10 shrink-0 transition-all ${
                    isCurrent
                      ? "border-primary bg-primary/15 shadow-[0_0_8px_rgba(30,107,255,0.25)]"
                      : isActing
                        ? "border-warning bg-warning/10"
                        : "border-border bg-secondary/50"
                  }`}>
                    {isCurrent && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>

                  {/* Content */}
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-foreground">
                        {person?.full_name ?? "—"}
                      </span>
                      {isActing && (
                        <span className="badge-warning text-[9px] px-1.5 py-0 rounded">
                          {lang === "tr" ? "Vekil" : "Acting"}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="badge-success text-[9px] px-1.5 py-0 rounded">
                          {lang === "tr" ? "Mevcut" : "Current"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{a.start_date}</span>
                      <span>→</span>
                      <span>{isCurrent ? (lang === "tr" ? "Devam" : "Present") : a.end_date}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span>{durationLabel}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] badge-neutral px-1.5 py-0.5 rounded">
                        {reasonLabels[a.transition_reason]?.[lang] ?? a.transition_reason}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 mt-1" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignmentTimeline;
