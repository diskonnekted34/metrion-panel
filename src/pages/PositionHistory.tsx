import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useRBAC } from "@/contexts/RBACContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { PositionHistoryService } from "@/services/PositionHistoryService";
import type { PositionWithMetrics, PositionAssignment } from "@/core/types/positionHistory";
import PositionFilterBar from "@/components/position-history/PositionFilterBar";
import PositionListPanel from "@/components/position-history/PositionListPanel";
import PositionSummary from "@/components/position-history/PositionSummary";
import AssignmentTimeline from "@/components/position-history/AssignmentTimeline";
import TransitionDrawer from "@/components/position-history/TransitionDrawer";
import { ShieldAlert } from "lucide-react";

export type SortKey = "recent" | "stability" | "vacancy" | "impact";
export type DepartmentFilter = "all" | "Executive" | "Finance" | "Technology" | "Marketing" | "Operations" | "Legal";
export type LevelFilter = "all" | "C_LEVEL" | "DIRECTOR" | "MANAGER" | "IC";

const PositionHistory = () => {
  const { currentUser } = useRBAC();
  const { lang } = useLanguage();

  // CEO-only gate
  const isCeo = currentUser.role === "owner";

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerAssignment, setDrawerAssignment] = useState<PositionAssignment | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentFilter>("all");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [search, setSearch] = useState("");
  const [toggles, setToggles] = useState({ highChurn: false, vacant: false, weakHandover: false });

  const allPositions = useMemo(() => PositionHistoryService.getPositions(), []);

  const filtered = useMemo(() => {
    let list = allPositions;

    if (departmentFilter !== "all") list = list.filter(p => p.department === departmentFilter);
    if (levelFilter !== "all") list = list.filter(p => p.level === levelFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        (p.current_holder?.full_name.toLowerCase().includes(q))
      );
    }
    if (toggles.highChurn) list = list.filter(p => p.metrics.changes_12m >= 2);
    if (toggles.vacant) list = list.filter(p => p.metrics.status === "VACANT");
    if (toggles.weakHandover) list = list.filter(p => p.metrics.handover_quality === "RISKY");

    // Sort
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "stability": return a.metrics.stability_score - b.metrics.stability_score;
        case "vacancy": return b.metrics.vacancy_days - a.metrics.vacancy_days;
        case "recent":
        default: {
          const aLast = a.assignments[a.assignments.length - 1]?.start_date ?? "";
          const bLast = b.assignments[b.assignments.length - 1]?.start_date ?? "";
          return bLast.localeCompare(aLast);
        }
      }
    });

    return list;
  }, [allPositions, departmentFilter, levelFilter, sortKey, search, toggles]);

  const selected: PositionWithMetrics | null = selectedId
    ? (filtered.find(p => p.id === selectedId) ?? allPositions.find(p => p.id === selectedId) ?? null)
    : (filtered[0] ?? null);

  if (!isCeo) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-sm">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {lang === "tr" ? "Yetersiz Yetki" : "Insufficient Permissions"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {lang === "tr"
                ? "Bu sayfaya erişim yalnızca CEO düzeyinde yetkilendirilmiştir (403)."
                : "Access to this page is restricted to CEO-level authorization (403)."}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-4">
        <PositionFilterBar
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
          sortKey={sortKey}
          setSortKey={setSortKey}
          search={search}
          setSearch={setSearch}
          toggles={toggles}
          setToggles={setToggles}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left — Position List */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-[88px] space-y-1.5 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
              <PositionListPanel
                positions={filtered}
                selectedId={selected?.id ?? null}
                onSelect={(id) => setSelectedId(id)}
              />
            </div>
          </div>

          {/* Right — Summary + Timeline */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">
            {selected ? (
              <>
                <PositionSummary position={selected} />
                <AssignmentTimeline
                  position={selected}
                  onOpenDrawer={(assignment) => setDrawerAssignment(assignment)}
                />
              </>
            ) : (
              <div className="glass-card p-12 text-center">
                <p className="text-muted-foreground text-sm">
                  {lang === "tr" ? "Henüz pozisyon tanımlanmamış." : "No positions defined yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transition Detail Drawer */}
      <TransitionDrawer
        assignment={drawerAssignment}
        position={selected}
        onClose={() => setDrawerAssignment(null)}
      />
    </AppLayout>
  );
};

export default PositionHistory;
