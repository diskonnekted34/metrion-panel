import { useState, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import {
  Crown, Bot, User, Search, Shield,
  AlertTriangle, Users, Activity, ChevronDown
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useRBAC } from "@/contexts/RBACContext";
import { CommandService } from "@/services/CommandService";
import type { CommandSeat, HierarchyNode } from "@/core/types/command";
import { AI_MODE_LABELS, AI_MODE_COLORS } from "@/core/types/command";
import GovernanceMonitoringPanel from "@/components/command/GovernanceMonitoringPanel";
import SeatDetailDrawer from "@/components/command/SeatDetailDrawer";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";

// ── Level-based tint styles (premium gradient) ────────
const LEVEL_TINTS: Record<number, string> = {
  0: "linear-gradient(135deg, rgba(255,193,7,0.06) 0%, rgba(255,160,0,0.02) 100%)",   // CEO — warm gold
  1: "linear-gradient(135deg, rgba(30,107,255,0.05) 0%, rgba(59,130,246,0.02) 100%)",  // C-Level — electric blue
  2: "linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(168,85,247,0.02) 100%)",  // Director — deep violet
  3: "linear-gradient(135deg, rgba(34,211,238,0.05) 0%, rgba(6,182,212,0.02) 100%)",   // Manager — muted cyan
};

const LEVEL_BORDER: Record<number, string> = {
  0: "rgba(255,193,7,0.18)",
  1: "rgba(30,107,255,0.15)",
  2: "rgba(139,92,246,0.15)",
  3: "rgba(34,211,238,0.12)",
};

function getLevel(seat: CommandSeat, allSeats: CommandSeat[]): number {
  let level = 0;
  let current = seat;
  while (current.parent_seat_key) {
    const parent = allSeats.find(s => s.seat_key === current.parent_seat_key);
    if (!parent) break;
    current = parent;
    level++;
  }
  return level;
}

// ── Seat Card (memoized) ───────────────────────────────
const SeatCard = memo(({
  seat,
  level,
  isSelected,
  isCeo,
  onSelect,
}: {
  seat: CommandSeat;
  level: number;
  isSelected: boolean;
  isCeo: boolean;
  onSelect: (s: CommandSeat) => void;
}) => {
  const modeColor = AI_MODE_COLORS[seat.ai_mode];
  const isHuman = seat.assigned_human !== null;
  const hasRisk = seat.risk_exposure === "high" || seat.risk_exposure === "critical";
  const isRoot = level === 0;
  const tint = LEVEL_TINTS[level] ?? LEVEL_TINTS[3];
  const borderTint = LEVEL_BORDER[level] ?? LEVEL_BORDER[3];

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3, boxShadow: `0 0 36px ${borderTint}` }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(seat)}
      className={`relative glass-card cursor-pointer transition-all duration-200 text-left ${
        isRoot ? "w-[220px] p-5" : "w-[180px] p-4"
      } ${isSelected ? "border-primary/50 glow-blue" : ""} ${hasRisk ? "border-warning/30" : ""}`}
      style={{
        background: tint,
        borderColor: isSelected ? undefined : borderTint,
      }}
    >
      {/* Risk pulse */}
      {hasRisk && (
        <div className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full bg-warning animate-pulse" />
      )}

      {/* Override count */}
      {seat.override_count > 0 && (
        <div className="absolute top-2 left-2">
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30">
            {seat.override_count}
          </span>
        </div>
      )}

      {/* Avatar / AI icon */}
      <div className="flex items-center justify-center mb-3">
        {isHuman ? (
          <div className="relative">
            <div className={`${isRoot ? "h-14 w-14" : "h-11 w-11"} rounded-2xl flex items-center justify-center border ${modeColor}`}>
              <User className={`${isRoot ? "h-7 w-7" : "h-5 w-5"}`} />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card border border-border flex items-center justify-center">
              <Shield className="h-3 w-3 text-primary" />
            </div>
          </div>
        ) : (
          <div className={`${isRoot ? "h-14 w-14" : "h-11 w-11"} rounded-2xl flex items-center justify-center border ${modeColor}`}
            style={{ boxShadow: "0 0 20px rgba(139,92,246,0.12)" }}
          >
            <Bot className={`${isRoot ? "h-7 w-7" : "h-5 w-5"}`} />
          </div>
        )}
      </div>

      {/* Role name */}
      <div className="text-center">
        <h3 className={`font-bold text-foreground flex items-center justify-center gap-1 ${isRoot ? "text-sm" : "text-xs"}`}>
          {isRoot && <Crown className="h-3.5 w-3.5 text-warning" />}
          {seat.label}
        </h3>
        {isHuman ? (
          <p className="text-[10px] text-muted-foreground mt-0.5">{seat.assigned_human!.name}</p>
        ) : (
          <p className="text-[10px] text-purple-400 mt-0.5">Autonomous Mode</p>
        )}
      </div>

      {/* Mode + Authority badges */}
      <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${modeColor}`}>
          {AI_MODE_LABELS[seat.ai_mode]}
        </span>
        <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
          L{seat.approval.level}
        </span>
      </div>

      {/* CEO + C-Level extras: governance score, decision count */}
      {level <= 1 && (
        <div className="flex items-center justify-center gap-3 mt-2.5 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <Activity className="h-2.5 w-2.5" />
            {seat.decision_volume_30d}
          </span>
          {seat.linked_okr_ids.length > 0 && (
            <span className="text-primary font-medium">OKR ✓</span>
          )}
          {seat.escalation_scope.length > 0 && (
            <span className="text-violet-400">↑ {seat.escalation_scope[0]}</span>
          )}
        </div>
      )}

      {/* CEO budget (only CEO sees) */}
      {isCeo && isRoot && (
        <div className="mt-2 text-center">
          <p className="text-[8px] text-muted-foreground">Budget</p>
          <p className="text-[10px] font-bold text-foreground">
            {CommandService.formatCurrency(seat.budget.annual_limit)}
          </p>
        </div>
      )}
    </motion.button>
  );
});

SeatCard.displayName = "SeatCard";

// ── Hierarchy Level Row ────────────────────────────────
const HierarchyLevel = memo(({
  nodes,
  level,
  allSeats,
  selectedId,
  isCeo,
  onSelect,
  defaultCollapsed,
}: {
  nodes: HierarchyNode[];
  level: number;
  allSeats: CommandSeat[];
  selectedId: string | null;
  isCeo: boolean;
  onSelect: (s: CommandSeat) => void;
  defaultCollapsed: boolean;
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  // Collect all nodes at this level from the hierarchy
  if (nodes.length === 0) return null;

  const hasChildren = nodes.some(n => n.children.length > 0);
  const allChildren = nodes.flatMap(n => n.children);

  return (
    <div className="flex flex-col items-center">
      {/* Connector from parent */}
      {level > 0 && (
        <div className="w-px h-6 bg-border/30" />
      )}

      {/* Horizontal bar */}
      {nodes.length > 1 && level > 0 && (
        <div className="relative w-full flex justify-center mb-0">
          <div
            className="h-px bg-border/30 absolute top-0"
            style={{
              left: `${100 / (nodes.length * 2)}%`,
              right: `${100 / (nodes.length * 2)}%`,
            }}
          />
        </div>
      )}

      {/* Seat cards */}
      <div className="flex gap-5 justify-center flex-wrap">
        {nodes.map(node => (
          <div key={node.seat.id} className="flex flex-col items-center">
            {level > 0 && nodes.length > 1 && (
              <div className="w-px h-4 bg-border/30" />
            )}
            <SeatCard
              seat={node.seat}
              level={level}
              isSelected={selectedId === node.seat.id}
              isCeo={isCeo}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>

      {/* Child level toggle (Manager level collapsible) */}
      {hasChildren && (
        <>
          <div className="w-px h-4 bg-border/30" />

          {defaultCollapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-card text-[10px] text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ChevronDown className={`h-3 w-3 transition-transform ${collapsed ? "" : "rotate-180"}`} />
              {collapsed ? `${allChildren.length} pozisyon göster` : "Daralt"}
            </button>
          )}

          {!collapsed && (
            <HierarchyLevel
              nodes={allChildren}
              level={level + 1}
              allSeats={allSeats}
              selectedId={selectedId}
              isCeo={isCeo}
              onSelect={onSelect}
              defaultCollapsed={level + 1 >= 3}
            />
          )}
        </>
      )}
    </div>
  );
});

HierarchyLevel.displayName = "HierarchyLevel";

// ── Main Page ──────────────────────────────────────────
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
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: "linear-gradient(rgba(30,107,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

          <div className="relative z-10 p-6 md:p-8 max-w-[1400px] mx-auto">
            {/* Search bar */}
            <div className="flex justify-end mb-6">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Pozisyon, kişi veya departman ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </div>

            {/* Governance overview panel */}
            <GovernanceMonitoringPanel summary={summary} />

            {/* Search results OR hierarchy tree */}
            {filteredSeats ? (
              <div className="mt-8">
                <h2 className="text-sm font-bold text-foreground mb-4">
                  Arama Sonuçları ({filteredSeats.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredSeats.map(seat => (
                    <SeatCard
                      key={seat.id}
                      seat={seat}
                      level={getLevel(seat, allSeats)}
                      isSelected={selectedSeat?.id === seat.id}
                      isCeo={isCeo}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Hierarchical tree */
              <div className="mt-10 flex justify-center pb-12">
                {hierarchy.map(root => (
                  <HierarchyLevel
                    key={root.seat.id}
                    nodes={[root]}
                    level={0}
                    allSeats={allSeats}
                    selectedId={selectedSeat?.id ?? null}
                    isCeo={isCeo}
                    onSelect={handleSelect}
                    defaultCollapsed={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Seat Profile Drawer */}
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
