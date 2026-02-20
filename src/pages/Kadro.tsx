import { useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Bot, User, Search, ChevronDown, AlertTriangle, Target
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useRBAC } from "@/contexts/RBACContext";
import { CommandService } from "@/services/CommandService";
import { GovernanceIntelligenceService } from "@/services/GovernanceIntelligenceService";
import type { CommandSeat, HierarchyNode } from "@/core/types/command";
import { AI_MODE_COLORS } from "@/core/types/command";
import type { SeatIntelligence } from "@/core/engine/governance-intelligence";
import GovernanceMonitoringPanel from "@/components/command/GovernanceMonitoringPanel";
import { Input } from "@/components/ui/input";
import {
  Tooltip, TooltipContent, TooltipTrigger, TooltipProvider,
} from "@/components/ui/tooltip";

// ── Node sizes per level ───────────────────────────────
const LEVEL_SIZE: Record<number, number> = { 0: 160, 1: 140, 2: 130, 3: 120, 4: 110, 5: 105, 6: 100, 7: 96 };

// ── Level accent colors ────────────────────────────────
const LEVEL_ACCENT: Record<number, { border: string; glow: string; dot: string; label: string }> = {
  0: { border: "rgba(255,193,7,0.35)", glow: "0 0 24px rgba(255,193,7,0.12)", dot: "bg-yellow-400", label: "CEO" },
  1: { border: "rgba(59,130,246,0.30)", glow: "0 0 20px rgba(59,130,246,0.10)", dot: "bg-blue-400", label: "C-Level" },
  2: { border: "rgba(139,92,246,0.28)", glow: "0 0 18px rgba(139,92,246,0.10)", dot: "bg-violet-400", label: "Director" },
  3: { border: "rgba(34,211,238,0.25)", glow: "0 0 16px rgba(34,211,238,0.08)", dot: "bg-cyan-400", label: "Manager" },
  4: { border: "rgba(34,197,94,0.25)", glow: "0 0 14px rgba(34,197,94,0.08)", dot: "bg-green-400", label: "Lead" },
  5: { border: "rgba(168,85,247,0.22)", glow: "0 0 12px rgba(168,85,247,0.06)", dot: "bg-purple-400", label: "Specialist" },
  6: { border: "rgba(156,163,175,0.20)", glow: "0 0 10px rgba(156,163,175,0.05)", dot: "bg-gray-400", label: "Junior" },
  7: { border: "rgba(156,163,175,0.15)", glow: "0 0 8px rgba(156,163,175,0.04)", dot: "bg-gray-300", label: "Intern" },
};

// ── Minimal Seat Node ──────────────────────────────────
const SeatNode = memo(({
  seat, level, intel, onClick,
}: {
  seat: CommandSeat; level: number; intel?: SeatIntelligence; onClick: () => void;
}) => {
  const size = LEVEL_SIZE[level] ?? 96;
  const accent = LEVEL_ACCENT[level] ?? LEVEL_ACCENT[7];
  const isHuman = seat.assigned_human !== null;
  const isRoot = level === 0;
  const modeColor = AI_MODE_COLORS[seat.ai_mode];
  const hasRisk = intel ? intel.risk.level === "high" : (seat.risk_exposure === "high" || seat.risk_exposure === "critical");
  const noOKR = intel ? !intel.hasActiveOKR : false;
  const hasMisalignment = intel ? intel.alignment.has_misalignment_warning : false;
  const governanceScore = intel?.governance.score ?? 0;

  // Upper levels show more detail
  const showDetails = level <= 2;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -2, boxShadow: accent.glow }}
          transition={{ duration: 0.18 }}
          onClick={onClick}
          className="relative flex flex-col items-center justify-center rounded-xl border bg-transparent cursor-pointer transition-all duration-200"
          style={{
            width: size, height: size,
            borderColor: accent.border,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          {/* Status dots */}
          {hasRisk && <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-warning animate-pulse" />}
          {noOKR && !hasRisk && <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-400/80" />}
          {hasMisalignment && <div className="absolute -top-1 -left-1 h-2.5 w-2.5 rounded-full bg-orange-400/80" />}

          {/* Icon */}
          <div className="mb-1">
            {isHuman ? (
              <User className={`${isRoot ? "h-5 w-5" : "h-4 w-4"} text-muted-foreground`} />
            ) : (
              <Bot className={`${isRoot ? "h-5 w-5" : "h-4 w-4"} text-purple-400`} />
            )}
          </div>

          {/* Role name */}
          <span className={`font-semibold text-foreground leading-tight text-center px-2 flex items-center gap-1 ${isRoot ? "text-[11px]" : "text-[10px]"}`}>
            {isRoot && <Crown className="h-3 w-3 text-yellow-400 shrink-0" />}
            {seat.label}
          </span>

          {/* Occupant */}
          <span className={`mt-0.5 leading-tight ${isRoot ? "text-[10px]" : "text-[9px]"} ${isHuman ? "text-muted-foreground" : "text-purple-400"}`}>
            {isHuman ? seat.assigned_human!.name : "AI"}
          </span>

          {/* Upper levels: show score + OKR count */}
          {showDetails && (
            <div className="mt-1 flex items-center gap-1.5 text-[8px] text-muted-foreground">
              <span>Gov %{governanceScore}</span>
              <span>· OKR {seat.linked_okr_ids.length}</span>
            </div>
          )}

          {/* Mode dot */}
          <div className="mt-1 flex items-center gap-1">
            <div className={`h-1.5 w-1.5 rounded-full ${modeColor.split(" ")[0].replace("text-", "bg-")}`} />
            <div className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
          </div>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-[10px] p-2">
        <div className="space-y-0.5">
          <div className="font-semibold">{seat.label} — {seat.department_label}</div>
          <div>Governance: %{governanceScore}</div>
          {intel && <div>Risk: {intel.risk.level === "low" ? "Düşük" : intel.risk.level === "medium" ? "Orta" : "Yüksek"} ({intel.risk.score})</div>}
          {noOKR && <div className="text-amber-400">⚠ Aktif OKR Yok</div>}
          {hasMisalignment && <div className="text-orange-400">⚠ Strategic Misalignment</div>}
          <div className="text-muted-foreground mt-1">Tıkla → Detay sayfası</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
});
SeatNode.displayName = "SeatNode";

// ── Connector ──────────────────────────────────────────
const VLine = ({ h = 24 }: { h?: number }) => (
  <div className="w-px bg-border/40" style={{ height: h }} />
);

// ── Hierarchy Level (recursive) ────────────────────────
const HierarchyLevel = memo(({
  nodes, level, selectedId, onSelect, intelMap,
}: {
  nodes: HierarchyNode[]; level: number;
  selectedId: string | null; onSelect: (s: CommandSeat) => void;
  intelMap: Map<string, SeatIntelligence>;
}) => {
  // Collapse levels >= 3 by default (Manager and below)
  const defaultCollapsed = level >= 3;
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  if (nodes.length === 0) return null;
  const hasChildren = nodes.some(n => n.children.length > 0);
  const allChildren = nodes.flatMap(n => n.children);

  return (
    <div className="flex flex-col items-center">
      {level > 0 && <VLine h={20} />}

      {nodes.length > 1 && level > 0 && (
        <div className="relative w-full flex justify-center">
          <div
            className="h-px bg-border/30 absolute top-0"
            style={{ left: `${100 / (nodes.length * 2)}%`, right: `${100 / (nodes.length * 2)}%` }}
          />
        </div>
      )}

      <div className="flex gap-4 justify-center flex-wrap">
        {nodes.map(node => (
          <div key={node.seat.id} className="flex flex-col items-center">
            {level > 0 && nodes.length > 1 && <VLine h={12} />}
            <SeatNode
              seat={node.seat}
              level={level}
              intel={intelMap.get(node.seat.seat_key)}
              onClick={() => onSelect(node.seat)}
            />
          </div>
        ))}
      </div>

      {hasChildren && (
        <>
          <VLine h={16} />
          {defaultCollapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-border/40 text-[9px] text-muted-foreground hover:text-foreground transition-colors mb-1"
            >
              <ChevronDown className={`h-2.5 w-2.5 transition-transform ${collapsed ? "" : "rotate-180"}`} />
              {collapsed ? `${allChildren.length} pozisyon` : "Daralt"}
            </button>
          )}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <HierarchyLevel
                  nodes={allChildren}
                  level={level + 1}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  intelMap={intelMap}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
});
HierarchyLevel.displayName = "HierarchyLevel";

// ── Main ───────────────────────────────────────────────
const Kadro = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const hierarchy = useMemo(() => CommandService.buildHierarchy(), []);
  const summary = useMemo(() => CommandService.getGovernanceSummary(), []);
  const allSeats = useMemo(() => CommandService.getAllSeats(), []);
  const intelMap = useMemo(() => GovernanceIntelligenceService.computeAll(), []);
  const aggStats = useMemo(() => GovernanceIntelligenceService.getAggregateStats(), []);

  const filteredSeats = useMemo(() => {
    if (!searchQuery) return null;
    const q = searchQuery.toLowerCase();
    return allSeats.filter(s =>
      s.label.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.department_label.toLowerCase().includes(q) ||
      (s.assigned_human?.name.toLowerCase().includes(q))
    );
  }, [searchQuery, allSeats]);

  const handleSelect = useCallback((seat: CommandSeat) => {
    navigate(`/seat/${seat.seat_key}`);
  }, [navigate]);

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="min-h-screen relative">
          <div className="relative z-10 p-6 md:p-8 max-w-[1400px] mx-auto">
            {/* Header + search */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-lg font-bold text-foreground">Kadro</h1>
                <p className="text-[11px] text-muted-foreground">Organizasyon yapısı ve seat-based governance</p>
              </div>
              <div className="relative w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input placeholder="Ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 h-8 text-xs" />
              </div>
            </div>

            {/* Governance strip */}
            <GovernanceMonitoringPanel summary={summary} intelligenceStats={aggStats} />

            {/* Search results OR org chart */}
            {filteredSeats ? (
              <div className="mt-8">
                <h2 className="text-xs font-semibold text-foreground mb-3">Sonuçlar ({filteredSeats.length})</h2>
                <div className="flex flex-wrap gap-3 justify-center">
                  {filteredSeats.map(seat => {
                    let lvl = 0;
                    let cur = seat;
                    while (cur.parent_seat_key) {
                      const p = allSeats.find(s => s.seat_key === cur.parent_seat_key);
                      if (!p) break; cur = p; lvl++;
                    }
                    return (
                      <SeatNode
                        key={seat.id}
                        seat={seat}
                        level={lvl}
                        intel={intelMap.get(seat.seat_key)}
                        onClick={() => handleSelect(seat)}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-8 flex justify-center pb-12">
                {hierarchy.map(root => (
                  <HierarchyLevel
                    key={root.seat.id}
                    nodes={[root]}
                    level={0}
                    selectedId={null}
                    onSelect={handleSelect}
                    intelMap={intelMap}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </TooltipProvider>
    </AppLayout>
  );
};

export default Kadro;
