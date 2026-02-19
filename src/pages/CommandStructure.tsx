import { useState, useMemo } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Crown, Shield, Bot, User, Search,
  AlertTriangle, TrendingUp, DollarSign,
  Activity, Zap, Users, Lock
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useRBAC } from "@/contexts/RBACContext";
import { CommandService } from "@/services/CommandService";
import type { CommandSeat, HierarchyNode } from "@/core/types/command";
import { AI_MODE_LABELS, AI_MODE_COLORS } from "@/core/types/command";
import GovernanceMonitoringPanel from "@/components/command/GovernanceMonitoringPanel";
import SeatDetailDrawer from "@/components/command/SeatDetailDrawer";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ── Seat Node Component ─────────────────────────────────
const SeatNode = ({
  node,
  isCeo,
  isRoot,
  onSelect,
  selectedId,
}: {
  node: HierarchyNode;
  isCeo: boolean;
  isRoot: boolean;
  onSelect: (seat: CommandSeat) => void;
  selectedId: string | null;
}) => {
  const seat = node.seat;
  const isSelected = selectedId === seat.id;
  const isHuman = seat.assigned_human !== null;
  const modeColor = AI_MODE_COLORS[seat.ai_mode];
  const hasRisk = seat.risk_exposure === "high" || seat.risk_exposure === "critical";

  return (
    <div className="flex flex-col items-center">
      {/* Seat Card */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -2, boxShadow: "0 0 32px rgba(30,107,255,0.15)" }}
        onClick={() => onSelect(seat)}
        className={`relative glass-card p-4 cursor-pointer transition-all duration-200 ${
          isRoot ? "w-[200px]" : "w-[170px]"
        } ${isSelected ? "border-primary/50 glow-blue" : ""} ${hasRisk ? "border-warning/30" : ""}`}
      >
        {/* Risk pulse */}
        {hasRisk && (
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-warning animate-pulse" />
        )}

        {/* CEO golden accent */}
        {isRoot && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,193,7,0.06) 0%, transparent 50%)",
              border: "1px solid rgba(255,193,7,0.15)",
              borderRadius: "inherit",
            }}
          />
        )}

        {/* Avatar / AI icon */}
        <div className="flex items-center justify-center mb-3">
          {isHuman ? (
            <div className="relative">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${modeColor}`}>
                <User className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card border border-border flex items-center justify-center">
                <Shield className="h-3 w-3 text-primary" />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${modeColor}`}
                style={{ boxShadow: "0 0 20px rgba(139,92,246,0.15)" }}
              >
                <Bot className="h-6 w-6" />
              </div>
            </div>
          )}
        </div>

        {/* Role name */}
        <div className="text-center">
          <h3 className={`font-bold text-foreground ${isRoot ? "text-sm" : "text-xs"}`}>
            {isRoot && <Crown className="h-3 w-3 text-warning inline mr-1" />}
            {seat.label}
          </h3>
          {isHuman ? (
            <p className="text-[10px] text-muted-foreground mt-0.5">{seat.assigned_human!.name}</p>
          ) : (
            <p className="text-[10px] text-purple-400 mt-0.5">Autonomous Mode</p>
          )}
        </div>

        {/* Mode badge */}
        <div className="flex justify-center mt-2">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${modeColor}`}>
            {AI_MODE_LABELS[seat.ai_mode]}
          </span>
        </div>

        {/* Budget mini */}
        <div className="mt-2 text-center">
          <p className="text-[9px] text-muted-foreground">Budget</p>
          <p className="text-[10px] font-bold text-foreground">
            {CommandService.formatCurrency(seat.budget.annual_limit)}
          </p>
        </div>

        {/* Override badge */}
        {seat.override_count > 0 && (
          <div className="absolute top-2 left-2">
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30">
              {seat.override_count}
            </span>
          </div>
        )}
      </motion.button>

      {/* Children */}
      {node.children.length > 0 && (
        <div className="relative mt-6">
          {/* Vertical connector */}
          <div className="absolute left-1/2 -top-6 w-px h-6 bg-border/40" />

          {/* Horizontal connector bar */}
          {node.children.length > 1 && (
            <div
              className="absolute top-0 h-px bg-border/40"
              style={{
                left: `${100 / (node.children.length * 2)}%`,
                right: `${100 / (node.children.length * 2)}%`,
              }}
            />
          )}

          <div className="flex gap-4 justify-center">
            {node.children.map((child) => (
              <div key={child.seat.id} className="relative">
                {/* Vertical line down to child */}
                <div className="absolute left-1/2 -top-0 w-px h-6 bg-border/40" />
                <div className="pt-6">
                  <SeatNode
                    node={child}
                    isCeo={isCeo}
                    isRoot={false}
                    onSelect={onSelect}
                    selectedId={selectedId}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────
const CommandStructure = () => {
  const { currentUser } = useRBAC();
  const isOwner = currentUser.role === "owner";
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

  const handleSelect = (seat: CommandSeat) => {
    setSelectedSeat(seat);
    setDrawerOpen(true);
  };

  // Non-CEO access guard
  if (!isOwner) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="glass-card p-8 text-center max-w-md">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">Yetkisiz Erişim</h2>
            <p className="text-sm text-muted-foreground">
              Emir-Komuta Yapısı yalnızca CEO (Sahip) yetkisiyle görüntülenebilir.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="min-h-screen relative">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: "linear-gradient(rgba(30,107,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

          <div className="relative z-10 p-6 md:p-8">
            {/* Header + Search */}
            <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Crown className="h-5 w-5 text-warning" />
                  Emir-Komuta Yapısı
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Kurumsal otorite hiyerarşisi, bütçe dağılımı ve yönetişim durumu
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Pozisyon, kişi veya departman ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Governance Monitoring Panel */}
            <GovernanceMonitoringPanel summary={summary} />

            {/* Search Results or Hierarchy Tree */}
            {filteredSeats ? (
              <div className="mt-8">
                <h2 className="text-sm font-bold text-foreground mb-4">
                  Arama Sonuçları ({filteredSeats.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredSeats.map(seat => {
                    const modeColor = AI_MODE_COLORS[seat.ai_mode];
                    return (
                      <motion.button
                        key={seat.id}
                        whileHover={{ y: -2 }}
                        onClick={() => handleSelect(seat)}
                        className="glass-card p-4 text-left"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${modeColor}`}>
                            {seat.assigned_human ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-foreground">{seat.label}</h3>
                            <p className="text-[10px] text-muted-foreground">{seat.department_label}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${modeColor}`}>
                            {AI_MODE_LABELS[seat.ai_mode]}
                          </span>
                          <span className="text-[9px] text-muted-foreground">
                            {CommandService.formatCurrency(seat.budget.annual_limit)}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Org Tree */
              <div className="mt-8 overflow-x-auto pb-8">
                <div className="min-w-[1000px] flex justify-center">
                  {hierarchy.map(root => (
                    <SeatNode
                      key={root.seat.id}
                      node={root}
                      isCeo={isOwner}
                      isRoot
                      onSelect={handleSelect}
                      selectedId={selectedSeat?.id ?? null}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seat Detail Drawer */}
        <SeatDetailDrawer
          seat={selectedSeat}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          isOwner={isOwner}
        />
      </TooltipProvider>
    </AppLayout>
  );
};

export default CommandStructure;
