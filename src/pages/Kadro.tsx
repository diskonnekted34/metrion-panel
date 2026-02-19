import { useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Bot, User, Search, ChevronDown
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useRBAC } from "@/contexts/RBACContext";
import { CommandService } from "@/services/CommandService";
import type { CommandSeat, HierarchyNode } from "@/core/types/command";
import { AI_MODE_COLORS } from "@/core/types/command";
import GovernanceMonitoringPanel from "@/components/command/GovernanceMonitoringPanel";
import SeatDetailDrawer from "@/components/command/SeatDetailDrawer";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";

// ── Node sizes per level ───────────────────────────────
const LEVEL_SIZE: Record<number, number> = { 0: 160, 1: 140, 2: 130, 3: 120 };

// ── Level accent colors (border + dot) ─────────────────
const LEVEL_ACCENT: Record<number, { border: string; glow: string; dot: string }> = {
  0: { border: "rgba(255,193,7,0.35)", glow: "0 0 24px rgba(255,193,7,0.12)", dot: "bg-yellow-400" },
  1: { border: "rgba(59,130,246,0.30)", glow: "0 0 20px rgba(59,130,246,0.10)", dot: "bg-blue-400" },
  2: { border: "rgba(139,92,246,0.28)", glow: "0 0 18px rgba(139,92,246,0.10)", dot: "bg-violet-400" },
  3: { border: "rgba(34,211,238,0.25)", glow: "0 0 16px rgba(34,211,238,0.08)", dot: "bg-cyan-400" },
};

// ── Minimal Seat Node ──────────────────────────────────
const SeatNode = memo(({
  seat, level, isSelected, onSelect,
}: {
  seat: CommandSeat; level: number; isSelected: boolean; onSelect: (s: CommandSeat) => void;
}) => {
  const size = LEVEL_SIZE[level] ?? 120;
  const accent = LEVEL_ACCENT[level] ?? LEVEL_ACCENT[3];
  const isHuman = seat.assigned_human !== null;
  const isRoot = level === 0;
  const modeColor = AI_MODE_COLORS[seat.ai_mode];
  const hasRisk = seat.risk_exposure === "high" || seat.risk_exposure === "critical";

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2, boxShadow: accent.glow }}
      transition={{ duration: 0.18 }}
      onClick={() => onSelect(seat)}
      className="relative flex flex-col items-center justify-center rounded-xl border bg-transparent cursor-pointer transition-all duration-200"
      style={{
        width: size,
        height: size,
        borderColor: isSelected ? "hsl(var(--primary))" : accent.border,
        boxShadow: isSelected ? `0 0 20px hsl(var(--primary) / 0.15)` : "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Risk pulse dot */}
      {hasRisk && (
        <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-warning animate-pulse" />
      )}

      {/* Role icon — tiny */}
      <div className="mb-1.5">
        {isHuman ? (
          <User className={`${isRoot ? "h-5 w-5" : "h-4 w-4"} text-muted-foreground`} />
        ) : (
          <Bot className={`${isRoot ? "h-5 w-5" : "h-4 w-4"} text-purple-400`} />
        )}
      </div>

      {/* Line 1: Role name */}
      <span className={`font-semibold text-foreground leading-tight text-center px-2 flex items-center gap-1 ${isRoot ? "text-[11px]" : "text-[10px]"}`}>
        {isRoot && <Crown className="h-3 w-3 text-yellow-400 shrink-0" />}
        {seat.label}
      </span>

      {/* Line 2: Person name or "AI" */}
      <span className={`mt-0.5 leading-tight ${isRoot ? "text-[10px]" : "text-[9px]"} ${isHuman ? "text-muted-foreground" : "text-purple-400"}`}>
        {isHuman ? seat.assigned_human!.name : "AI"}
      </span>

      {/* Line 3: Mode dot */}
      <div className="mt-1.5 flex items-center gap-1">
        <div className={`h-1.5 w-1.5 rounded-full ${modeColor.split(" ")[0].replace("text-", "bg-")}`} />
        <div className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
      </div>
    </motion.button>
  );
});
SeatNode.displayName = "SeatNode";

// ── Connector Line (vertical) ──────────────────────────
const VLine = ({ h = 24 }: { h?: number }) => (
  <div className="w-px bg-border/40" style={{ height: h }} />
);

// ── Hierarchy Level ────────────────────────────────────
const HierarchyLevel = memo(({
  nodes, level, allSeats, selectedId, onSelect,
}: {
  nodes: HierarchyNode[]; level: number; allSeats: CommandSeat[];
  selectedId: string | null; onSelect: (s: CommandSeat) => void;
}) => {
  const defaultCollapsed = level >= 3;
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  if (nodes.length === 0) return null;
  const hasChildren = nodes.some(n => n.children.length > 0);
  const allChildren = nodes.flatMap(n => n.children);

  return (
    <div className="flex flex-col items-center">
      {/* Connector from parent */}
      {level > 0 && <VLine h={20} />}

      {/* Horizontal bar across siblings */}
      {nodes.length > 1 && level > 0 && (
        <div className="relative w-full flex justify-center">
          <div
            className="h-px bg-border/30 absolute top-0"
            style={{
              left: `${100 / (nodes.length * 2)}%`,
              right: `${100 / (nodes.length * 2)}%`,
            }}
          />
        </div>
      )}

      {/* Nodes */}
      <div className="flex gap-4 justify-center flex-wrap">
        {nodes.map(node => (
          <div key={node.seat.id} className="flex flex-col items-center">
            {level > 0 && nodes.length > 1 && <VLine h={12} />}
            <SeatNode
              seat={node.seat}
              level={level}
              isSelected={selectedId === node.seat.id}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>

      {/* Children */}
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
                  allSeats={allSeats}
                  selectedId={selectedId}
                  onSelect={onSelect}
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
  const { currentUser } = useRBAC();
  const isCeo = currentUser.role === "owner";
  const [selectedSeat, setSelectedSeat] = useState<CommandSeat | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const hierarchy = useMemo(() => CommandService.buildHierarchy(), []);
  const summary = useMemo(() => CommandService.getGovernanceSummary(), []);
  const allSeats = useMemo(() => CommandService.getAllSeats(), []);

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
    setSelectedSeat(seat);
    setDrawerOpen(true);
  }, []);

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="min-h-screen relative">
          <div className="relative z-10 p-6 md:p-8 max-w-[1400px] mx-auto">

            {/* Compact header + search */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-lg font-bold text-foreground">Kadro</h1>
                <p className="text-[11px] text-muted-foreground">Organizasyon yapısı ve yetki dağılımı</p>
              </div>
              <div className="relative w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </div>

            {/* Minimal governance strip */}
            <GovernanceMonitoringPanel summary={summary} />

            {/* Search results OR org chart */}
            {filteredSeats ? (
              <div className="mt-8">
                <h2 className="text-xs font-semibold text-foreground mb-3">
                  Sonuçlar ({filteredSeats.length})
                </h2>
                <div className="flex flex-wrap gap-3 justify-center">
                  {filteredSeats.map(seat => {
                    let lvl = 0;
                    let cur = seat;
                    while (cur.parent_seat_key) {
                      const p = allSeats.find(s => s.seat_key === cur.parent_seat_key);
                      if (!p) break;
                      cur = p;
                      lvl++;
                    }
                    return (
                      <SeatNode
                        key={seat.id}
                        seat={seat}
                        level={lvl}
                        isSelected={selectedSeat?.id === seat.id}
                        onSelect={handleSelect}
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
                    allSeats={allSeats}
                    selectedId={selectedSeat?.id ?? null}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <SeatDetailDrawer
          seat={selectedSeat}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          isOwner={isCeo}
        />
      </TooltipProvider>
    </AppLayout>
  );
};

export default Kadro;
