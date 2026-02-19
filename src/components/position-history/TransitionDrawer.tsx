import { useState } from "react";
import type { PositionAssignment, PositionWithMetrics } from "@/core/types/positionHistory";
import { useLanguage } from "@/i18n/LanguageContext";
import { PositionHistoryService } from "@/services/PositionHistoryService";
import { getPersonById } from "@/data/positionHistory";
import { X, FileText, CheckCircle2, AlertTriangle, ClipboardList } from "lucide-react";

interface Props {
  assignment: PositionAssignment | null;
  position: PositionWithMetrics | null;
  onClose: () => void;
}

const reasonLabels: Record<string, Record<string, string>> = {
  RESIGNED: { tr: "İstifa", en: "Resigned" },
  PROMOTED: { tr: "Terfi", en: "Promoted" },
  TERMINATED: { tr: "İhraç", en: "Terminated" },
  REORG: { tr: "Yeniden Yapılanma", en: "Re-org" },
  BACKFILL: { tr: "Yedek Atama", en: "Backfill" },
  ACTING_APPOINTMENT: { tr: "Vekil Atama", en: "Acting" },
  OTHER: { tr: "Diğer", en: "Other" },
};

type Tab = "snapshot" | "scope" | "handover" | "impact";

const TransitionDrawer = ({ assignment, position, onClose }: Props) => {
  const { lang } = useLanguage();
  const [tab, setTab] = useState<Tab>("snapshot");

  if (!assignment || !position) return null;

  const person = getPersonById(assignment.person_id);
  const snapshots = PositionHistoryService.getSnapshots(assignment.id);
  const handover = PositionHistoryService.getHandover(assignment.id);
  const auditLogs = PositionHistoryService.getAuditLogs(assignment.id);

  // Find the previous assignment for before/after diff
  const idx = position.assignments.findIndex(a => a.id === assignment.id);
  const prevAssignment = idx > 0 ? position.assignments[idx - 1] : null;
  const prevSnapshots = prevAssignment ? PositionHistoryService.getSnapshots(prevAssignment.id) : [];
  const prevPerson = prevAssignment ? getPersonById(prevAssignment.person_id) : null;

  const beforeScope = prevSnapshots[prevSnapshots.length - 1]?.scope_json ?? null;
  const afterScope = snapshots[0]?.scope_json ?? null;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "snapshot", label: lang === "tr" ? "Değişim Özeti" : "Change Snapshot", icon: <FileText className="h-3.5 w-3.5" /> },
    { key: "scope", label: lang === "tr" ? "Scope Karşılaştırma" : "Scope Diff", icon: <ClipboardList className="h-3.5 w-3.5" /> },
    { key: "handover", label: lang === "tr" ? "Devir-Teslim" : "Handover", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    { key: "impact", label: lang === "tr" ? "Etki Sinyalleri" : "Impact Signals", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      {/* Drawer */}
      <div
        className="relative w-full max-w-lg bg-popover border-l border-border h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right-full duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-popover/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {lang === "tr" ? "Geçiş Detayı" : "Transition Detail"}
            </h3>
            <p className="text-xs text-muted-foreground">{position.title} — {position.department}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all border-b-2 ${
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {tab === "snapshot" && (
            <SnapshotTab
              assignment={assignment}
              person={person}
              prevPerson={prevPerson}
              prevAssignment={prevAssignment}
              auditLogs={auditLogs}
              lang={lang}
            />
          )}

          {tab === "scope" && (
            <ScopeDiffTab beforeScope={beforeScope} afterScope={afterScope} lang={lang} />
          )}

          {tab === "handover" && (
            <HandoverTab handover={handover} lang={lang} />
          )}

          {tab === "impact" && (
            <ImpactTab lang={lang} />
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Tab Components ── */

function SnapshotTab({ assignment, person, prevPerson, prevAssignment, auditLogs, lang }: {
  assignment: PositionAssignment;
  person: ReturnType<typeof getPersonById>;
  prevPerson: ReturnType<typeof getPersonById>;
  prevAssignment: PositionAssignment | null;
  auditLogs: ReturnType<typeof PositionHistoryService.getAuditLogs>;
  lang: string;
}) {
  return (
    <div className="space-y-4">
      {/* Outgoing / Incoming */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary/30 border border-border/30 rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground uppercase mb-1">{lang === "tr" ? "Ayrılan" : "Outgoing"}</p>
          <p className="text-sm font-semibold text-foreground">{prevPerson?.full_name ?? "—"}</p>
          <p className="text-[11px] text-muted-foreground">{prevAssignment?.end_date ?? "—"}</p>
        </div>
        <div className="bg-secondary/30 border border-border/30 rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground uppercase mb-1">{lang === "tr" ? "Gelen" : "Incoming"}</p>
          <p className="text-sm font-semibold text-foreground">{person?.full_name ?? "—"}</p>
          <p className="text-[11px] text-muted-foreground">{assignment.start_date}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="space-y-2">
        <DetailRow label={lang === "tr" ? "Değişim Tipi" : "Change Type"} value={reasonLabels[assignment.transition_reason]?.[lang] ?? assignment.transition_reason} />
        <DetailRow label={lang === "tr" ? "Atama Tipi" : "Assignment Type"} value={assignment.assignment_type} />
        <DetailRow label={lang === "tr" ? "Geçerlilik Tarihi" : "Effective Date"} value={assignment.start_date} />
        <DetailRow label={lang === "tr" ? "Onaylayan" : "Approved By"} value={assignment.approved_by.join(", ")} />
        {assignment.notes_private && (
          <DetailRow label={lang === "tr" ? "Gizli Not (CEO)" : "Confidential Note (CEO)"} value={assignment.notes_private} />
        )}
      </div>

      {/* Audit */}
      {auditLogs.length > 0 && (
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{lang === "tr" ? "Denetim Kaydı" : "Audit Trail"}</p>
          <div className="space-y-1">
            {auditLogs.map(log => (
              <div key={log.id} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="badge-neutral px-1.5 py-0.5 rounded text-[9px]">{log.action}</span>
                <span>{log.created_at}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ScopeDiffTab({ beforeScope, afterScope, lang }: {
  beforeScope: import("@/core/types/positionHistory").ScopeSnapshot | null;
  afterScope: import("@/core/types/positionHistory").ScopeSnapshot | null;
  lang: string;
}) {
  if (!beforeScope && !afterScope) {
    return (
      <EmptyState text={lang === "tr" ? "Bu geçiş için scope snapshot alınmamış." : "No scope snapshot captured for this transition."} />
    );
  }

  const before = beforeScope;
  const after = afterScope;

  const diffList = (beforeItems: string[] | undefined, afterItems: string[] | undefined) => {
    const b = beforeItems ?? [];
    const a = afterItems ?? [];
    const added = a.filter(x => !b.includes(x));
    const removed = b.filter(x => !a.includes(x));
    return { added, removed };
  };

  const respDiff = diffList(before?.responsibilities, after?.responsibilities);
  const okrDiff = diffList(before?.okr_ownership, after?.okr_ownership);
  const sysDiff = diffList(before?.systems_owned, after?.systems_owned);

  return (
    <div className="space-y-4">
      {/* Responsibilities */}
      <DiffSection
        title={lang === "tr" ? "Sorumluluklar" : "Responsibilities"}
        added={respDiff.added}
        removed={respDiff.removed}
      />

      {/* Budget */}
      <div className="grid grid-cols-2 gap-3">
        <ScalarDiff label={lang === "tr" ? "Bütçe Limiti" : "Budget Limit"} before={before?.budget_limit} after={after?.budget_limit} format={v => `$${(v ?? 0).toLocaleString()}`} />
        <ScalarDiff label={lang === "tr" ? "Onay Seviyesi" : "Approval Level"} before={before?.approval_level} after={after?.approval_level} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ScalarDiff label={lang === "tr" ? "Direkt Raporlar" : "Direct Reports"} before={before?.direct_reports_count} after={after?.direct_reports_count} />
      </div>

      <DiffSection title={lang === "tr" ? "OKR Sahipliği" : "OKR Ownership"} added={okrDiff.added} removed={okrDiff.removed} />
      <DiffSection title={lang === "tr" ? "Sistemler" : "Systems Owned"} added={sysDiff.added} removed={sysDiff.removed} />
    </div>
  );
}

function HandoverTab({ handover, lang }: {
  handover: import("@/core/types/positionHistory").HandoverChecklist | null;
  lang: string;
}) {
  if (!handover) {
    return <EmptyState text={lang === "tr" ? "Devir-teslim verisi yok (Unknown)." : "No handover data (Unknown)."} />;
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="bg-secondary/30 border border-border/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{lang === "tr" ? "Tamamlanma" : "Completion"}</span>
          <span className={`text-sm font-bold ${handover.completion_percent >= 80 ? "text-success" : handover.completion_percent >= 50 ? "text-warning" : "text-destructive"}`}>
            {handover.completion_percent}%
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${handover.completion_percent >= 80 ? "bg-success" : handover.completion_percent >= 50 ? "bg-warning" : "bg-destructive"}`}
            style={{ width: `${handover.completion_percent}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <DetailBox label={lang === "tr" ? "Toplantı Sayısı" : "Meetings"} value={String(handover.meetings_count)} />
        <DetailBox label={lang === "tr" ? "Açık Öğeler" : "Open Items"} value={String(handover.open_items_count)} />
      </div>

      {/* Open items */}
      {handover.open_items.length > 0 && (
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
            {lang === "tr" ? "Açık Öğeler" : "Open Items"}
          </p>
          <ul className="space-y-1">
            {handover.open_items.map((item, i) => (
              <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                <span className="text-destructive mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Access */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
          {lang === "tr" ? "Erişim Devri" : "Access Handover"}
        </p>
        <p className="text-xs text-foreground/80">
          {handover.access_handover.completed
            ? `✅ ${lang === "tr" ? "Tamamlandı" : "Completed"} (${handover.access_handover.completed_at})`
            : `⏳ ${lang === "tr" ? "Devam ediyor" : "In progress"}: ${handover.access_handover.tools.join(", ")}`
          }
        </p>
      </div>

      {/* Time to productivity */}
      {handover.time_to_productivity && (
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
            {lang === "tr" ? "Verimlilik Süresi" : "Time to Productivity"}
          </p>
          <div className="flex gap-2">
            {(["d30", "d60", "d90"] as const).map(period => {
              const status = handover.time_to_productivity?.[period];
              return (
                <span key={period} className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                  status === "on_track" ? "badge-success" :
                  status === "delayed" ? "badge-warning" : "badge-neutral"
                }`}>
                  {period.toUpperCase()}: {status === "on_track" ? "✓" : status === "delayed" ? "!" : "—"}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Docs */}
      {handover.docs_links.length > 0 && (
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{lang === "tr" ? "Dokümanlar" : "Documents"}</p>
          {handover.docs_links.map((link, i) => (
            <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline block">
              {link}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ImpactTab({ lang }: { lang: string }) {
  return <EmptyState text={lang === "tr" ? "Henüz yeterli veri yok." : "Not enough data yet."} />;
}

/* ── Shared helpers ── */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b border-border/20">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[11px] font-medium text-foreground text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary/30 border border-border/30 rounded-xl p-3 text-center">
      <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}

function DiffSection({ title, added, removed }: { title: string; added: string[]; removed: string[] }) {
  if (added.length === 0 && removed.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">{title}</p>
      <div className="flex flex-wrap gap-1">
        {added.map(item => (
          <span key={item} className="badge-success text-[10px] px-2 py-0.5 rounded">+ {item}</span>
        ))}
        {removed.map(item => (
          <span key={item} className="badge-error text-[10px] px-2 py-0.5 rounded">− {item}</span>
        ))}
      </div>
    </div>
  );
}

function ScalarDiff<T>({ label, before, after, format }: { label: string; before: T | undefined; after: T | undefined; format?: (v: T) => string }) {
  const fmt = format ?? ((v: T) => String(v));
  const changed = before !== undefined && after !== undefined && before !== after;
  return (
    <div className="bg-secondary/30 border border-border/30 rounded-xl p-3">
      <p className="text-[10px] text-muted-foreground uppercase mb-1">{label}</p>
      {changed ? (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground line-through">{fmt(before!)}</span>
          <span className="text-xs">→</span>
          <span className="text-xs font-semibold text-primary">{fmt(after!)}</span>
        </div>
      ) : (
        <p className="text-xs font-semibold text-foreground">{after !== undefined ? fmt(after) : before !== undefined ? fmt(before) : "—"}</p>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-8 text-center">
      <AlertTriangle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export default TransitionDrawer;
