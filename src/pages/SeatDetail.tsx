import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, User, Bot, Crown, Shield, Target,
  BarChart3, Zap, Activity, Clock, Brain,
  AlertTriangle, TrendingUp, TrendingDown, Minus,
  DollarSign, Eye, Lock, UserPlus, UserMinus
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { CommandService } from "@/services/CommandService";
import { GovernanceIntelligenceService } from "@/services/GovernanceIntelligenceService";
import { useRBAC } from "@/contexts/RBACContext";
import { AI_MODE_LABELS, AI_MODE_COLORS } from "@/core/types/command";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Budget visibility policy
type BudgetPolicy = "CEO_ONLY" | "C_LEVEL_VISIBLE" | "ROLE_BASED" | "FULL_VISIBILITY";
const BUDGET_VISIBILITY_POLICY: BudgetPolicy = "CEO_ONLY";
function canSeeBudget(isOwner: boolean, seatLevel: number): boolean {
  switch (BUDGET_VISIBILITY_POLICY) {
    case "CEO_ONLY": return isOwner;
    case "C_LEVEL_VISIBLE": return isOwner || seatLevel <= 1;
    case "FULL_VISIBILITY": return true;
    default: return isOwner;
  }
}

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "improving") return <TrendingUp className="h-3 w-3 text-emerald-400" />;
  if (trend === "declining") return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

const SeatDetail = () => {
  const { seatKey } = useParams<{ seatKey: string }>();
  const { currentUser } = useRBAC();
  const isOwner = currentUser.role === "owner";

  const seat = useMemo(() => CommandService.getSeatByKey(seatKey || ""), [seatKey]);
  const allSeats = useMemo(() => CommandService.getAllSeats(), []);
  const intelMap = useMemo(() => GovernanceIntelligenceService.computeAll(), []);

  if (!seat) {
    return (
      <AppLayout>
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Pozisyon bulunamadı.</p>
          <Link to="/kadro" className="text-primary text-sm mt-2 inline-block">← Kadro'ya Dön</Link>
        </div>
      </AppLayout>
    );
  }

  const intel = intelMap.get(seat.seat_key) ?? null;
  const recentEvents = CommandService.getGovernanceEvents(seat.seat_key);
  const seatKPIs = GovernanceIntelligenceService.getKPIsBySeat(seat.seat_key);
  const seatActions = GovernanceIntelligenceService.getActionsBySeat(seat.seat_key);
  const seatObjectives = GovernanceIntelligenceService.getObjectivesBySeat(seat.seat_key);

  const modeColor = AI_MODE_COLORS[seat.ai_mode];
  const isHuman = seat.assigned_human !== null;

  // Calculate seat level
  let seatLevel = 0;
  let cur = seat;
  while (cur.parent_seat_key) {
    const parent = allSeats.find(s => s.seat_key === cur.parent_seat_key);
    if (!parent) break;
    cur = parent;
    seatLevel++;
  }

  const showBudget = canSeeBudget(isOwner, seatLevel);
  const budgetUtilization = seat.budget.annual_limit > 0
    ? Math.round(((seat.budget.spent + seat.budget.reserved) / seat.budget.annual_limit) * 100) : 0;

  const unalignedCount = seatActions.filter(a => a.alignment_status === "UNALIGNED" && a.status === "active").length;

  const handleAction = (action: string) => {
    if (!isOwner) { toast.error("Bu işlem yalnızca CEO (Sahip) yetkisiyle yapılabilir."); return; }
    toast.success(`${action}: ${seat.label}`);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  const eventTypeLabel = (t: string) => {
    const map: Record<string, string> = { role_update: "Rol Güncelleme", budget_change: "Bütçe Değişikliği", approval_change: "Onay Değişikliği", visibility_change: "Görünürlük Değişikliği", ai_mode_change: "AI Mod Değişikliği", human_assigned: "İnsan Atandı", human_removed: "İnsan Kaldırıldı" };
    return map[t] || t;
  };

  // Determine previous occupants mock
  const previousOccupants = seat.assigned_human
    ? [{ name: "AI Only", period: "2024-01 — 2024-06" }]
    : [{ name: "Eski Yönetici", period: "2024-01 — 2025-01" }];

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back */}
          <Link to="/kadro" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-5 transition-colors">
            <ArrowLeft className="h-3 w-3" /> Kadro'ya Dön
          </Link>

          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center border ${modeColor}`}>
              {isHuman ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                {seat.seat_key === "CEO" && <Crown className="h-4 w-4 text-warning" />}
                {seat.label}
                {intel && <span className="text-[10px] font-normal text-muted-foreground">Gov: %{intel.governance.score}</span>}
              </h1>
              <p className="text-xs text-muted-foreground">{seat.title} — {seat.department_label}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${modeColor}`}>{AI_MODE_LABELS[seat.ai_mode]}</span>
                <span className="text-[9px] text-muted-foreground">Authority: {seat.authority_level}/100</span>
              </div>
            </div>
          </div>

          {/* Strategic Drift Banner */}
          {intel?.inactivity.detected && (
            <div className="p-3 rounded-lg border border-amber-400/30 bg-amber-400/5 mb-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                Strategic Drift Detected
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{intel.inactivity.reason}</p>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="general" className="w-full">
            <TabsList className={`w-full grid mb-5 ${showBudget ? "grid-cols-7" : "grid-cols-6"}`}>
              <TabsTrigger value="general" className="text-[9px]">Genel</TabsTrigger>
              <TabsTrigger value="performance" className="text-[9px]">Performans</TabsTrigger>
              <TabsTrigger value="actions" className="text-[9px]">Aksiyonlar</TabsTrigger>
              <TabsTrigger value="decisions" className="text-[9px]">Kararlar</TabsTrigger>
              {showBudget && <TabsTrigger value="budget" className="text-[9px]">Bütçe</TabsTrigger>}
              <TabsTrigger value="history" className="text-[9px]">Geçmiş</TabsTrigger>
              <TabsTrigger value="audit" className="text-[9px]">Denetim</TabsTrigger>
            </TabsList>

            {/* ═══ GENERAL ═══ */}
            <TabsContent value="general" className="space-y-4">
              <div className="glass-card p-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Pozisyon Bilgileri</h3>
                <div className="space-y-2.5 text-[11px]">
                  <div className="flex justify-between"><span className="text-muted-foreground">Seviye</span><span className="text-foreground font-medium">{["CEO", "C-Level", "Direktör", "Müdür", "Lider", "Uzman", "Junior", "Stajyer"][seatLevel] || `Level ${seatLevel}`}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Departman</span><span className="text-foreground font-medium">{seat.department_label}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Atanan</span><span className="text-foreground font-medium">{seat.assigned_human?.name ?? "AI Only"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">AI Modu</span><span className={`font-bold ${modeColor.split(" ").find(c => c.startsWith("text-")) || ""}`}>{AI_MODE_LABELS[seat.ai_mode]}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Son Aktivite</span><span className="text-foreground font-medium">{formatDate(seat.last_activity)}</span></div>
                </div>
              </div>

              {!isHuman && !seat.assigned_human && (
                <div className="glass-card p-4">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">AI Ajan Bilgileri</h3>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between"><span className="text-muted-foreground">Ajan Adı</span><span className="text-violet-400 font-medium">{seat.label} Agent</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Versiyon</span><span className="text-foreground font-medium">v2.1</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Confidence</span><span className="text-foreground font-medium">%{85 + Math.floor(Math.random() * 10)}</span></div>
                  </div>
                </div>
              )}

              <div className="glass-card p-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Pozisyon Yönetimi</h3>
                <div className="space-y-2">
                  {isHuman ? (
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-[11px]" disabled={!isOwner} onClick={() => handleAction("İnsan Kaldır")}>
                      {isOwner ? <UserMinus className="h-3.5 w-3.5 text-destructive" /> : <Lock className="h-3.5 w-3.5" />}
                      İnsan Atamasını Kaldır
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-[11px]" disabled={!isOwner} onClick={() => handleAction("İnsan Ata")}>
                      {isOwner ? <UserPlus className="h-3.5 w-3.5 text-primary" /> : <Lock className="h-3.5 w-3.5" />}
                      İnsan Ata
                    </Button>
                  )}
                  {!isOwner && <p className="text-[9px] text-muted-foreground/60">Pozisyon yönetimi yalnızca CEO yetkisiyle yapılabilir.</p>}
                </div>
              </div>

              <Button asChild size="sm" className="w-full gap-2">
                <Link to={`/workspace/${seat.seat_key.toLowerCase()}`}>
                  <Activity className="h-3.5 w-3.5" />
                  Ajan Konsoluna Git
                </Link>
              </Button>
            </TabsContent>

            {/* ═══ PERFORMANCE ═══ */}
            <TabsContent value="performance" className="space-y-4">
              {/* OKR */}
              <div className="glass-card p-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">OKR İlerleme ({seatObjectives.length})</h3>
                {seatObjectives.length > 0 ? (
                  <div className="space-y-2">
                    {seatObjectives.map(obj => (
                      <div key={obj.id} className="p-3 rounded-lg border border-border/30">
                        <div className="flex items-center gap-2 text-[11px] mb-1.5">
                          <Target className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="text-foreground font-medium flex-1">{obj.title}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${obj.deviation_flag ? "bg-amber-400/10 text-amber-400" : "bg-emerald-400/10 text-emerald-400"}`}>
                            {obj.deviation_flag ? "Sapma" : "Yolunda"}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className={`h-full rounded-full ${obj.health_score >= 60 ? "bg-emerald-400" : "bg-amber-400"}`} style={{ width: `${obj.health_score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-muted-foreground">Aktif OKR yok</p>
                    <p className="text-[10px] text-amber-400 mt-1">⚠ Governance skoru etkilenir</p>
                  </div>
                )}
              </div>

              {/* Governance Score */}
              {intel && (
                <div className="glass-card p-4">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Governance Skoru: %{intel.governance.score}</h3>
                  <div className="space-y-2">
                    {[
                      { label: "OKR Aktif", value: intel.governance.components.okr_active },
                      { label: "OKR İlerleme", value: intel.governance.components.okr_progress },
                      { label: "KPI Stabilite", value: intel.governance.components.kpi_stability },
                      { label: "Bütçe Uyumu", value: intel.governance.components.budget_compliance },
                      { label: "Hizalama", value: intel.governance.components.alignment },
                    ].map(c => (
                      <div key={c.label} className="flex items-center gap-2 text-[11px]">
                        <span className="text-muted-foreground w-24">{c.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className={`h-full rounded-full ${c.value >= 60 ? "bg-emerald-400" : c.value >= 30 ? "bg-amber-400" : "bg-destructive"}`} style={{ width: `${c.value}%` }} />
                        </div>
                        <span className="text-foreground font-medium w-8 text-right">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* KPI */}
              {seatKPIs.length > 0 && (
                <div className="glass-card p-4">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">KPI Katkısı ({seatKPIs.length})</h3>
                  <div className="space-y-2">
                    {seatKPIs.map(kpi => {
                      const progress = kpi.target_value !== 0 ? Math.min(100, Math.round((kpi.current_value / kpi.target_value) * 100)) : 0;
                      return (
                        <div key={kpi.id} className="flex items-center gap-3 text-[11px]">
                          <TrendIcon trend={kpi.trend} />
                          <span className="flex-1 text-foreground">{kpi.label}</span>
                          <span className="text-muted-foreground">{kpi.current_value}/{kpi.target_value}</span>
                          <span className="w-8 text-right font-medium">%{progress}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ═══ ACTIONS ═══ */}
            <TabsContent value="actions" className="space-y-4">
              <div className="glass-card p-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Aksiyonlar ({seatActions.length}) {unalignedCount >= 3 && <span className="text-orange-400 ml-1">⚠ Misalignment</span>}
                </h3>
                {seatActions.length > 0 ? (
                  <div className="space-y-2">
                    {seatActions.map(action => (
                      <div key={action.id} className="flex items-center gap-2 text-[11px] p-2 rounded-lg border border-border/30">
                        <Zap className={`h-3 w-3 shrink-0 ${action.source === "AI" ? "text-violet-400" : "text-primary"}`} />
                        <span className="flex-1 text-foreground">{action.title}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${action.alignment_status === "ALIGNED" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                          {action.alignment_status === "ALIGNED" ? "Aligned" : "⚠ Unaligned"}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${action.status === "active" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{action.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">Aksiyon bulunamadı.</p>
                )}
              </div>
            </TabsContent>

            {/* ═══ DECISIONS ═══ */}
            <TabsContent value="decisions" className="space-y-4">
              <div className="glass-card p-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Karar Özeti</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-border/30 text-center">
                    <p className="text-[9px] text-muted-foreground">Karar Hacmi (30g)</p>
                    <p className="text-lg font-bold text-foreground">{seat.decision_volume_30d}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/30 text-center">
                    <p className="text-[9px] text-muted-foreground">Override</p>
                    <p className={`text-lg font-bold ${seat.override_count > 0 ? "text-warning" : "text-foreground"}`}>{seat.override_count}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/30 text-center">
                    <p className="text-[9px] text-muted-foreground">AI Challenge</p>
                    <p className="text-lg font-bold text-violet-400">{seat.ai_challenge_count}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/30 text-center">
                    <p className="text-[9px] text-muted-foreground">Onay Seviyesi</p>
                    <p className="text-lg font-bold text-foreground">L{seat.approval.level}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ═══ BUDGET ═══ */}
            {showBudget && (
              <TabsContent value="budget" className="space-y-4">
                <div className="glass-card p-4">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Bütçe Dağılımı</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] mb-1.5">
                      <span className="text-muted-foreground">Kullanım</span>
                      <span className={`font-bold ${budgetUtilization > 80 ? "text-warning" : "text-foreground"}`}>%{budgetUtilization}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full rounded-full ${budgetUtilization > 80 ? "bg-warning" : "bg-primary"}`} style={{ width: `${budgetUtilization}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2.5 text-[11px]">
                    <div className="flex justify-between"><span className="text-muted-foreground">Yıllık Limit</span><span className="text-foreground font-bold">{CommandService.formatCurrency(seat.budget.annual_limit)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Harcanan</span><span className="text-warning font-medium">{CommandService.formatCurrency(seat.budget.spent)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Ayrılmış</span><span className="text-primary font-medium">{CommandService.formatCurrency(seat.budget.reserved)}</span></div>
                    <div className="flex justify-between border-t border-border pt-2"><span className="text-foreground font-bold">Kullanılabilir</span><span className="text-emerald-400 font-bold">{CommandService.formatCurrency(seat.budget.available)}</span></div>
                  </div>
                </div>
              </TabsContent>
            )}

            {/* ═══ HISTORY ═══ */}
            <TabsContent value="history" className="space-y-4">
              <div className="glass-card p-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Seat Geçmişi</h3>
                <div className="space-y-3">
                  {/* Current */}
                  <div className="flex items-start gap-3 text-[11px]">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-foreground font-medium">{seat.assigned_human?.name ?? "AI Only"} (Aktif)</p>
                      <p className="text-[10px] text-muted-foreground">2025-01 — Devam Ediyor</p>
                    </div>
                  </div>
                  {/* Previous */}
                  {previousOccupants.map((occ, i) => (
                    <div key={i} className="flex items-start gap-3 text-[11px]">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/40 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-muted-foreground font-medium">{occ.name}</p>
                        <p className="text-[10px] text-muted-foreground/60">{occ.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ═══ AUDIT ═══ */}
            <TabsContent value="audit" className="space-y-4">
              <div className="glass-card p-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Yönetişim Değişiklikleri</h3>
                {recentEvents.length > 0 ? (
                  <div className="space-y-3">
                    {recentEvents.slice(0, 10).map(ev => (
                      <div key={ev.id} className="flex items-start gap-3 text-[11px]">
                        <div className="h-6 w-6 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground font-medium">{eventTypeLabel(ev.event_type)}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{ev.old_value} → {ev.new_value}</p>
                          <p className="text-[9px] text-muted-foreground/60 mt-0.5">{ev.changed_by} • {formatDate(ev.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">Kayıt yok.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default SeatDetail;
