import { useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  X, User, Bot, Shield, DollarSign, Eye, Target,
  Activity, Brain, Crown, Lock,
  UserPlus, UserMinus, ArrowUpRight, Clock,
  AlertTriangle, TrendingUp, TrendingDown, Minus,
  BarChart3, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { CommandSeat } from "@/core/types/command";
import { AI_MODE_LABELS, AI_MODE_COLORS } from "@/core/types/command";
import { CommandService } from "@/services/CommandService";
import { GovernanceIntelligenceService } from "@/services/GovernanceIntelligenceService";
import type { SeatIntelligence } from "@/core/engine/governance-intelligence";
import type { KPI } from "@/core/types/kpi";

// Budget visibility policy
type BudgetPolicy = "CEO_ONLY" | "C_LEVEL_VISIBLE" | "ROLE_BASED" | "FULL_VISIBILITY";
const BUDGET_VISIBILITY_POLICY: BudgetPolicy = "CEO_ONLY";

function canSeeBudget(isOwner: boolean, _seatLevel: number): boolean {
  switch (BUDGET_VISIBILITY_POLICY) {
    case "CEO_ONLY": return isOwner;
    case "C_LEVEL_VISIBLE": return isOwner || _seatLevel <= 1;
    case "FULL_VISIBILITY": return true;
    default: return isOwner;
  }
}

interface Props {
  seat: CommandSeat | null;
  open: boolean;
  onClose: () => void;
  isOwner: boolean;
  intel?: SeatIntelligence | null;
}

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "improving") return <TrendingUp className="h-3 w-3 text-emerald-400" />;
  if (trend === "declining") return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

const SeatDetailDrawer = ({ seat, open, onClose, isOwner, intel }: Props) => {
  const recentEvents = useMemo(
    () => (seat ? CommandService.getGovernanceEvents(seat.seat_key) : []),
    [seat]
  );

  const seatKPIs = useMemo(
    () => (seat ? GovernanceIntelligenceService.getKPIsBySeat(seat.seat_key) : []),
    [seat]
  );

  const seatActions = useMemo(
    () => (seat ? GovernanceIntelligenceService.getActionsBySeat(seat.seat_key) : []),
    [seat]
  );

  const seatObjectives = useMemo(
    () => (seat ? GovernanceIntelligenceService.getObjectivesBySeat(seat.seat_key) : []),
    [seat]
  );

  if (!seat) return null;

  const modeColor = AI_MODE_COLORS[seat.ai_mode];
  const isHuman = seat.assigned_human !== null;
  const budgetUtilization = seat.budget.annual_limit > 0
    ? Math.round(((seat.budget.spent + seat.budget.reserved) / seat.budget.annual_limit) * 100)
    : 0;

  const allSeats = CommandService.getAllSeats();
  let seatLevel = 0;
  let cur = seat;
  while (cur.parent_seat_key) {
    const parent = allSeats.find(s => s.seat_key === cur.parent_seat_key);
    if (!parent) break;
    cur = parent;
    seatLevel++;
  }

  const showBudget = canSeeBudget(isOwner, seatLevel);

  const handleAction = (action: string) => {
    if (!isOwner) {
      toast.error("Bu işlem yalnızca CEO (Sahip) yetkisiyle yapılabilir.");
      return;
    }
    toast.success(`${action} işlemi gerçekleştirildi: ${seat.label}`);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const eventTypeLabel = (t: string) => {
    const map: Record<string, string> = {
      role_update: "Rol Güncelleme",
      budget_change: "Bütçe Değişikliği",
      approval_change: "Onay Değişikliği",
      visibility_change: "Görünürlük Değişikliği",
      ai_mode_change: "AI Mod Değişikliği",
      human_assigned: "İnsan Atandı",
      human_removed: "İnsan Kaldırıldı",
    };
    return map[t] || t;
  };

  const agentIdMap: Record<string, string> = {
    CEO: "ceo", CFO: "cfo", CTO: "cto", CMO: "cmo", COO: "coo",
    CHRO: "chro", CIO: "cio", SALES_DIRECTOR: "sales-director",
    CREATIVE_DIRECTOR: "creative-director", LEGAL_COUNSEL: "legal",
    MARKETPLACE_LEAD: "marketplace-agent", GROWTH_LEAD: "growth-lead",
    ACCOUNTING_LEAD: "finance-controller", INVENTORY_LEAD: "operations-manager",
  };
  const agentId = agentIdMap[seat.seat_key] ?? seat.seat_key.toLowerCase();

  const unalignedCount = seatActions.filter(a => a.alignment_status === "UNALIGNED" && a.status === "active").length;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl z-50 glass-strong border-l border-border overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 glass-strong border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${modeColor}`}>
                  {isHuman ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    {seat.seat_key === "CEO" && <Crown className="h-3.5 w-3.5 text-warning" />}
                    {seat.label}
                    {intel && (
                      <span className="text-[9px] font-normal text-muted-foreground ml-1">
                        Gov: %{intel.governance.score}
                      </span>
                    )}
                  </h2>
                  <p className="text-[10px] text-muted-foreground">{seat.title} — {seat.department_label}</p>
                </div>
              </div>
              <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Strategic Drift Banner */}
            {intel?.inactivity.detected && (
              <div className="mx-6 mt-4 p-3 rounded-lg border border-amber-400/30 bg-amber-400/5">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Strategic Drift Detected
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{intel.inactivity.reason}</p>
                {intel.suggestion && (
                  <div className="mt-2 p-2 rounded border border-border/40 text-[10px]">
                    <span className="text-muted-foreground">Öneri: </span>
                    <span className="text-foreground">{intel.suggestion.suggested_title}</span>
                    <span className="text-muted-foreground ml-1">
                      ({intel.suggestion.approval_required === "self" ? "Onaysız" : intel.suggestion.approval_required === "parent" ? "Üst onayı" : "Eskalasyon"})
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* No Active OKR Banner */}
            {intel && !intel.hasActiveOKR && !intel.inactivity.detected && (
              <div className="mx-6 mt-4 p-3 rounded-lg border border-amber-400/20 bg-amber-400/5">
                <div className="flex items-center gap-2 text-[11px] font-medium text-amber-400">
                  <Target className="h-3.5 w-3.5" />
                  No Active OKR
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Bu pozisyonda aktif OKR bulunmuyor. Governance skoru etkilenir.</p>
              </div>
            )}

            <div className="px-6 py-5">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className={`w-full grid ${showBudget ? "grid-cols-7" : "grid-cols-6"} mb-5`}>
                  <TabsTrigger value="profile" className="text-[9px]">Profil</TabsTrigger>
                  <TabsTrigger value="governance" className="text-[9px]">Yönetişim</TabsTrigger>
                  <TabsTrigger value="kpi" className="text-[9px]">KPI</TabsTrigger>
                  <TabsTrigger value="okr" className="text-[9px]">OKR</TabsTrigger>
                  <TabsTrigger value="risk" className="text-[9px]">Risk</TabsTrigger>
                  {showBudget && <TabsTrigger value="budget" className="text-[9px]">Bütçe</TabsTrigger>}
                  <TabsTrigger value="audit" className="text-[9px]">Denetim</TabsTrigger>
                </TabsList>

                {/* ═══ PROFILE TAB ═══ */}
                <TabsContent value="profile" className="space-y-5">
                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Profil Bilgileri</h3>
                    <div className="space-y-2.5 text-[11px]">
                      <div className="flex justify-between"><span className="text-muted-foreground">Rol</span><span className="text-foreground font-medium">{seat.title}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Ajan / Kişi</span><span className="text-foreground font-medium">{seat.assigned_human?.name ?? "AI Only"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">AI Modu</span><span className={`font-bold ${modeColor.split(" ").find(c => c.startsWith("text-")) || "text-foreground"}`}>{AI_MODE_LABELS[seat.ai_mode]}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Departman</span><span className="text-foreground font-medium">{seat.department_label}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Son Aktivite</span><span className="text-foreground font-medium">{formatDate(seat.last_activity)}</span></div>
                    </div>
                  </div>

                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">KPI Sorumlulukları</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {seat.kpi_responsibilities.map(kpi => (
                        <span key={kpi} className="text-[10px] px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">{kpi}</span>
                      ))}
                    </div>
                  </div>

                  <Button asChild size="sm" className="w-full gap-2">
                    <Link to={`/workspace/${agentId}`}>
                      <Activity className="h-3.5 w-3.5" />
                      Ajan Konsoluna Git
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </Button>

                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Pozisyon Yönetimi</h3>
                    <div className="space-y-2">
                      {isHuman ? (
                        <>
                          <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-[11px]" disabled={!isOwner} onClick={() => handleAction("İnsan Kaldır")}>
                            {isOwner ? <UserMinus className="h-3.5 w-3.5 text-destructive" /> : <Lock className="h-3.5 w-3.5" />}
                            İnsan Atamasını Kaldır
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-[11px]" disabled={!isOwner} onClick={() => handleAction("AI Mod Değiştir")}>
                            {isOwner ? <Brain className="h-3.5 w-3.5 text-violet-400" /> : <Lock className="h-3.5 w-3.5" />}
                            AI Modunu Değiştir
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-[11px]" disabled={!isOwner} onClick={() => handleAction("İnsan Ata")}>
                          {isOwner ? <UserPlus className="h-3.5 w-3.5 text-primary" /> : <Lock className="h-3.5 w-3.5" />}
                          İnsan Ata
                        </Button>
                      )}
                      {!isOwner && (
                        <p className="text-[9px] text-muted-foreground/60">Pozisyon yönetimi yalnızca CEO yetkisiyle yapılabilir.</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* ═══ GOVERNANCE TAB ═══ */}
                <TabsContent value="governance" className="space-y-5">
                  {/* Governance Score Breakdown */}
                  {intel && (
                    <div className="glass-card p-4">
                      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Governance Skoru: %{intel.governance.score}</h3>
                      <div className="space-y-2">
                        {[
                          { label: "OKR Aktif", value: intel.governance.components.okr_active, weight: "20%" },
                          { label: "OKR İlerleme", value: intel.governance.components.okr_progress, weight: "20%" },
                          { label: "KPI Stabilite", value: intel.governance.components.kpi_stability, weight: "20%" },
                          { label: "Bütçe Uyumu", value: intel.governance.components.budget_compliance, weight: "20%" },
                          { label: "Hizalama", value: intel.governance.components.alignment, weight: "20%" },
                        ].map(c => (
                          <div key={c.label} className="flex items-center gap-2 text-[11px]">
                            <span className="text-muted-foreground w-24">{c.label}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${c.value >= 60 ? "bg-emerald-400" : c.value >= 30 ? "bg-amber-400" : "bg-destructive"}`} style={{ width: `${c.value}%` }} />
                            </div>
                            <span className="text-foreground font-medium w-8 text-right">{c.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Yetki & Onay</h3>
                    <div className="space-y-2.5 text-[11px]">
                      <div className="flex justify-between"><span className="text-muted-foreground">Otorite Seviyesi</span><span className="text-foreground font-bold">{seat.authority_level}/100</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Onay Seviyesi</span><span className="text-foreground font-medium">Level {seat.approval.level}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Finansal Onay Limiti</span><span className="text-foreground font-medium">{seat.approval.financial_limit >= 999999999 ? "Sınırsız" : CommandService.formatCurrency(seat.approval.financial_limit)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Stratejik Onay</span><span className={seat.approval.strategic_authority ? "text-emerald-400 font-medium" : "text-muted-foreground"}>{seat.approval.strategic_authority ? "Aktif" : "Pasif"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Eskalasyon</span><span className="text-foreground font-medium">{seat.escalation_scope.length > 0 ? seat.escalation_scope.join(", ") : "—"}</span></div>
                    </div>
                  </div>

                  {/* Alignment & Actions */}
                  {intel && (
                    <div className="glass-card p-4">
                      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Hizalama</h3>
                      <div className="space-y-2.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Durum</span>
                          <span className={`font-bold ${intel.alignment.status === "ALIGNED" ? "text-emerald-400" : intel.alignment.status === "WEAK" ? "text-amber-400" : "text-destructive"}`}>
                            {intel.alignment.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Unaligned Aksiyon</span>
                          <span className={`font-medium ${unalignedCount >= 3 ? "text-destructive" : "text-foreground"}`}>{unalignedCount}</span>
                        </div>
                        {intel.alignment.has_misalignment_warning && (
                          <div className="flex items-center gap-1.5 text-orange-400 text-[10px]">
                            <AlertTriangle className="h-3 w-3" />
                            Strategic Misalignment — 3+ unaligned aksiyon
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Görünürlük Kapsamı</h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {seat.visibility.departments.map(dept => (
                        <span key={dept} className="text-[10px] px-2 py-1 rounded-lg bg-secondary text-foreground border border-border">{dept}</span>
                      ))}
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      {[
                        { label: "Kararlar", val: seat.visibility.decisions },
                        { label: "Bütçeler", val: seat.visibility.budgets },
                        { label: "OKR'lar", val: seat.visibility.okrs },
                        { label: "Risk Raporları", val: seat.visibility.risk_reports },
                      ].map(item => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className={item.val ? "text-emerald-400" : "text-muted-foreground/40"}>
                            {item.val ? <Eye className="h-3 w-3 inline" /> : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* ═══ KPI TAB ═══ */}
                <TabsContent value="kpi" className="space-y-5">
                  {seatKPIs.length > 0 ? (
                    <div className="glass-card p-4">
                      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">KPI Metrikleri ({seatKPIs.length})</h3>
                      <div className="space-y-3">
                        {seatKPIs.map(kpi => {
                          const deviation = kpi.target_value !== 0
                            ? Math.round(Math.abs((kpi.current_value - kpi.target_value) / kpi.target_value) * 100)
                            : 0;
                          const progress = kpi.target_value !== 0
                            ? Math.min(100, Math.round((kpi.current_value / kpi.target_value) * 100))
                            : 0;
                          return (
                            <div key={kpi.id} className="glass-card p-3">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-medium text-foreground">{kpi.label}</span>
                                <TrendIcon trend={kpi.trend} />
                              </div>
                              <div className="flex items-center gap-2 text-[10px] mb-1.5">
                                <span className="text-muted-foreground">Mevcut:</span>
                                <span className="font-semibold text-foreground">{kpi.current_value}{kpi.unit === "%" ? "%" : kpi.unit === "TRY" ? " ₺" : ` ${kpi.unit}`}</span>
                                <span className="text-muted-foreground">/ Hedef:</span>
                                <span className="font-medium text-foreground">{kpi.target_value}{kpi.unit === "%" ? "%" : kpi.unit === "TRY" ? " ₺" : ` ${kpi.unit}`}</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${deviation > 30 ? "bg-destructive" : deviation > 15 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${progress}%` }} />
                              </div>
                              <div className="text-[9px] text-muted-foreground mt-1">Sapma: %{deviation}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="glass-card p-8 text-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-xs text-muted-foreground">Bu pozisyona tanımlı KPI bulunmuyor.</p>
                    </div>
                  )}
                </TabsContent>

                {/* ═══ OKR TAB ═══ */}
                <TabsContent value="okr" className="space-y-5">
                  {seatObjectives.length > 0 ? (
                    <div className="glass-card p-4">
                      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Bağlı OKR'lar ({seatObjectives.length})</h3>
                      <div className="space-y-2">
                        {seatObjectives.map(obj => (
                          <div key={obj.id} className="glass-card p-3">
                            <div className="flex items-center gap-2 text-[11px] mb-1.5">
                              <Target className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="text-foreground font-medium flex-1">{obj.title}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded ${obj.deviation_flag ? "bg-amber-400/10 text-amber-400" : "bg-emerald-400/10 text-emerald-400"}`}>
                                {obj.deviation_flag ? "Sapma" : "Yolunda"}
                              </span>
                            </div>
                            <div className="flex gap-3 text-[10px] text-muted-foreground">
                              <span>Sağlık: {obj.health_score}</span>
                              <span>Risk: {obj.risk_score}</span>
                              <span>Başarı: %{obj.probability_of_success}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-secondary overflow-hidden mt-1.5">
                              <div className={`h-full rounded-full ${obj.health_score >= 60 ? "bg-emerald-400" : obj.health_score >= 40 ? "bg-amber-400" : "bg-destructive"}`} style={{ width: `${obj.health_score}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="glass-card p-8 text-center">
                      <Target className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-xs text-muted-foreground">Bu pozisyona henüz OKR bağlanmamış.</p>
                      <p className="text-[10px] text-amber-400 mt-1">⚠ Governance skoru etkilenir</p>
                    </div>
                  )}

                  {/* Actions linked to OKR */}
                  {seatActions.length > 0 && (
                    <div className="glass-card p-4">
                      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Aksiyonlar ({seatActions.length})</h3>
                      <div className="space-y-2">
                        {seatActions.map(action => (
                          <div key={action.id} className="flex items-center gap-2 text-[11px] p-2 rounded-lg border border-border/30">
                            <Zap className={`h-3 w-3 shrink-0 ${action.source === "AI" ? "text-violet-400" : "text-primary"}`} />
                            <span className="flex-1 text-foreground">{action.title}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${action.alignment_status === "ALIGNED" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                              {action.alignment_status === "ALIGNED" ? "Aligned" : "⚠ Unaligned"}
                            </span>
                            <span className="text-[9px] text-muted-foreground">{action.source}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* ═══ RISK TAB ═══ */}
                <TabsContent value="risk" className="space-y-5">
                  {intel && (
                    <>
                      <div className="glass-card p-4">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Risk Skoru</h3>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`text-3xl font-bold ${intel.risk.level === "low" ? "text-emerald-400" : intel.risk.level === "medium" ? "text-amber-400" : "text-destructive"}`}>
                            {intel.risk.score}
                          </div>
                          <div>
                            <span className={`text-[11px] font-bold uppercase ${intel.risk.level === "low" ? "text-emerald-400" : intel.risk.level === "medium" ? "text-amber-400" : "text-destructive"}`}>
                              {intel.risk.level === "low" ? "Düşük" : intel.risk.level === "medium" ? "Orta" : "Yüksek"}
                            </span>
                            <p className="text-[9px] text-muted-foreground mt-0.5">0-30 Düşük · 31-60 Orta · 61+ Yüksek</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {[
                            { label: "KPI Sapması", value: intel.risk.components.kpi_deviation, weight: "×0.4" },
                            { label: "Bütçe Riski", value: intel.risk.components.budget_exposure, weight: "×0.3" },
                            { label: "Hizalama Zayıflığı", value: intel.risk.components.alignment_weakness, weight: "×0.2" },
                            { label: "Rol Ağırlığı", value: Math.round(intel.risk.components.role_weight * 10), weight: "×0.1" },
                          ].map(c => (
                            <div key={c.label} className="flex items-center gap-2 text-[11px]">
                              <span className="text-muted-foreground w-32">{c.label}</span>
                              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                                <div className={`h-full rounded-full ${c.value > 60 ? "bg-destructive" : c.value > 30 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${c.value}%` }} />
                              </div>
                              <span className="text-foreground font-medium w-12 text-right">{c.value} {c.weight}</span>
                            </div>
                          ))}
                        </div>

                        <p className="text-[9px] text-muted-foreground mt-3 italic">{intel.risk.explanation}</p>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="glass-card p-3">
                          <p className="text-[9px] text-muted-foreground uppercase">Karar Hacmi (30g)</p>
                          <p className="text-lg font-bold text-foreground">{seat.decision_volume_30d}</p>
                        </div>
                        <div className="glass-card p-3">
                          <p className="text-[9px] text-muted-foreground uppercase">Override</p>
                          <p className={`text-lg font-bold ${seat.override_count > 0 ? "text-warning" : "text-foreground"}`}>{seat.override_count}</p>
                        </div>
                        <div className="glass-card p-3">
                          <p className="text-[9px] text-muted-foreground uppercase">AI Challenge</p>
                          <p className="text-lg font-bold text-violet-400">{seat.ai_challenge_count}</p>
                        </div>
                        <div className="glass-card p-3">
                          <p className="text-[9px] text-muted-foreground uppercase">Eskalasyon</p>
                          <p className="text-lg font-bold text-foreground">{seat.escalation_scope.length}</p>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* ═══ BUDGET TAB (conditional) ═══ */}
                {showBudget && (
                  <TabsContent value="budget" className="space-y-5">
                    <div className="glass-card p-4">
                      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Bütçe Dağılımı</h3>
                      <div className="mb-4">
                        <div className="flex justify-between text-[10px] mb-1.5">
                          <span className="text-muted-foreground">Kullanım</span>
                          <span className={`font-bold ${budgetUtilization > 80 ? "text-warning" : "text-foreground"}`}>%{budgetUtilization}</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${budgetUtilization > 80 ? "bg-warning" : "bg-primary"}`} style={{ width: `${budgetUtilization}%` }} />
                        </div>
                      </div>
                      <div className="space-y-3 text-[11px]">
                        <div className="flex justify-between"><span className="text-muted-foreground">Yıllık Limit</span><span className="text-foreground font-bold">{CommandService.formatCurrency(seat.budget.annual_limit)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Aylık Aktif</span><span className="text-foreground font-medium">{CommandService.formatCurrency(seat.budget.monthly_active)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Harcanan</span><span className="text-warning font-medium">{CommandService.formatCurrency(seat.budget.spent)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Ayrılmış</span><span className="text-primary font-medium">{CommandService.formatCurrency(seat.budget.reserved)}</span></div>
                        <div className="flex justify-between border-t border-border pt-2"><span className="text-foreground font-bold">Kullanılabilir</span><span className="text-emerald-400 font-bold">{CommandService.formatCurrency(seat.budget.available)}</span></div>
                      </div>
                    </div>
                    {isOwner && (
                      <Button variant="outline" size="sm" className="w-full gap-2 text-[11px]" onClick={() => handleAction("Bütçe Düzenle")}>
                        <DollarSign className="h-3.5 w-3.5" />
                        Bütçe Limitini Düzenle
                      </Button>
                    )}
                  </TabsContent>
                )}

                {/* ═══ AUDIT TAB ═══ */}
                <TabsContent value="audit" className="space-y-5">
                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Son Yönetişim Değişiklikleri</h3>
                    {recentEvents.length > 0 ? (
                      <div className="space-y-3">
                        {recentEvents.slice(0, 5).map(ev => (
                          <div key={ev.id} className="flex items-start gap-3 text-[11px]">
                            <div className="h-6 w-6 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground font-medium">{eventTypeLabel(ev.event_type)}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{ev.old_value} → {ev.new_value}</p>
                              <p className="text-[9px] text-muted-foreground/60 mt-0.5">{ev.changed_by} • {formatDate(ev.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">Henüz kayıt yok.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SeatDetailDrawer;
