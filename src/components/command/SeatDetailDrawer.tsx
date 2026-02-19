import { useState } from "react";
import { toast } from "sonner";
import {
  X, User, Bot, Shield, DollarSign, Eye, Target,
  Activity, AlertTriangle, Brain, Crown, Lock,
  UserPlus, UserMinus, ChevronRight, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { CommandSeat, GovernanceEvent } from "@/core/types/command";
import { AI_MODE_LABELS, AI_MODE_COLORS } from "@/core/types/command";
import { CommandService } from "@/services/CommandService";

interface Props {
  seat: CommandSeat | null;
  open: boolean;
  onClose: () => void;
  isOwner: boolean;
}

const SeatDetailDrawer = ({ seat, open, onClose, isOwner }: Props) => {
  const [events] = useState<GovernanceEvent[]>(() =>
    seat ? CommandService.getGovernanceEvents(seat.seat_key) : []
  );

  if (!seat) return null;

  const modeColor = AI_MODE_COLORS[seat.ai_mode];
  const isHuman = seat.assigned_human !== null;
  const budgetUtilization = seat.budget.annual_limit > 0
    ? Math.round(((seat.budget.spent + seat.budget.reserved) / seat.budget.annual_limit) * 100)
    : 0;

  const recentEvents = CommandService.getGovernanceEvents(seat.seat_key);

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

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg z-50 glass-strong border-l border-border overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 glass-strong border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${modeColor}`}>
                  {isHuman ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    {seat.seat_key === "CEO" && <Crown className="h-3.5 w-3.5 text-warning" />}
                    {seat.label}
                  </h2>
                  <p className="text-[10px] text-muted-foreground">{seat.title} — {seat.department_label}</p>
                </div>
              </div>
              <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="px-6 py-5">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full grid grid-cols-4 mb-5">
                  <TabsTrigger value="overview" className="text-[10px]">Genel</TabsTrigger>
                  <TabsTrigger value="budget" className="text-[10px]">Bütçe</TabsTrigger>
                  <TabsTrigger value="visibility" className="text-[10px]">Görünürlük</TabsTrigger>
                  <TabsTrigger value="audit" className="text-[10px]">Denetim</TabsTrigger>
                </TabsList>

                {/* ═══ OVERVIEW TAB ═══ */}
                <TabsContent value="overview" className="space-y-5">
                  {/* Assignment & Mode */}
                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Atama & Mod</h3>
                    <div className="space-y-2.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Atanan Kişi</span>
                        <span className="text-foreground font-medium">{seat.assigned_human?.name || "AI Only"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">AI Modu</span>
                        <span className={`font-bold ${modeColor.split(" ").find(c => c.startsWith("text-")) || "text-foreground"}`}>
                          {AI_MODE_LABELS[seat.ai_mode]}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Otorite Seviyesi</span>
                        <span className="text-foreground font-bold">{seat.authority_level}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Onay Seviyesi</span>
                        <span className="text-foreground font-medium">Level {seat.approval.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Eskalasyon Kapsamı</span>
                        <span className="text-foreground font-medium">
                          {seat.escalation_scope.length > 0 ? seat.escalation_scope.join(", ") : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card p-3">
                      <p className="text-[9px] text-muted-foreground uppercase">Karar Hacmi (30g)</p>
                      <p className="text-lg font-bold text-foreground">{seat.decision_volume_30d}</p>
                    </div>
                    <div className="glass-card p-3">
                      <p className="text-[9px] text-muted-foreground uppercase">Risk Maruziyeti</p>
                      <p className={`text-lg font-bold ${
                        seat.risk_exposure === "high" || seat.risk_exposure === "critical" ? "text-warning" : "text-success"
                      }`}>{seat.risk_exposure.toUpperCase()}</p>
                    </div>
                    <div className="glass-card p-3">
                      <p className="text-[9px] text-muted-foreground uppercase">Override</p>
                      <p className={`text-lg font-bold ${seat.override_count > 0 ? "text-warning" : "text-foreground"}`}>{seat.override_count}</p>
                    </div>
                    <div className="glass-card p-3">
                      <p className="text-[9px] text-muted-foreground uppercase">AI Challenge</p>
                      <p className="text-lg font-bold text-violet-400">{seat.ai_challenge_count}</p>
                    </div>
                  </div>

                  {/* KPI Responsibilities */}
                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">KPI Sorumlulukları</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {seat.kpi_responsibilities.map((kpi) => (
                        <span key={kpi} className="text-[10px] px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                          {kpi}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* OKR Links */}
                  {seat.linked_okr_ids.length > 0 && (
                    <div className="glass-card p-4">
                      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Bağlı OKR'lar</h3>
                      <div className="space-y-1.5">
                        {seat.linked_okr_ids.map((id) => (
                          <div key={id} className="flex items-center gap-2 text-[11px]">
                            <Target className="h-3 w-3 text-primary" />
                            <span className="text-foreground">{id}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CEO Actions */}
                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Pozisyon Yönetimi</h3>
                    <div className="space-y-2">
                      {isHuman ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2 text-[11px]"
                            disabled={!isOwner}
                            onClick={() => handleAction("İnsan Kaldır")}
                          >
                            {isOwner ? <UserMinus className="h-3.5 w-3.5 text-destructive" /> : <Lock className="h-3.5 w-3.5" />}
                            İnsan Atamasını Kaldır
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2 text-[11px]"
                            disabled={!isOwner}
                            onClick={() => handleAction("AI Mod Değiştir")}
                          >
                            {isOwner ? <Brain className="h-3.5 w-3.5 text-violet-400" /> : <Lock className="h-3.5 w-3.5" />}
                            AI Modunu Değiştir
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start gap-2 text-[11px]"
                          disabled={!isOwner}
                          onClick={() => handleAction("İnsan Ata")}
                        >
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

                {/* ═══ BUDGET TAB ═══ */}
                <TabsContent value="budget" className="space-y-5">
                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Bütçe Dağılımı</h3>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] mb-1.5">
                        <span className="text-muted-foreground">Kullanım</span>
                        <span className={`font-bold ${budgetUtilization > 80 ? "text-warning" : "text-foreground"}`}>
                          %{budgetUtilization}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            budgetUtilization > 80 ? "bg-warning" : "bg-primary"
                          }`}
                          style={{ width: `${budgetUtilization}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Yıllık Limit</span>
                        <span className="text-foreground font-bold">{CommandService.formatCurrency(seat.budget.annual_limit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Aylık Aktif</span>
                        <span className="text-foreground font-medium">{CommandService.formatCurrency(seat.budget.monthly_active)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Harcanan</span>
                        <span className="text-warning font-medium">{CommandService.formatCurrency(seat.budget.spent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ayrılmış</span>
                        <span className="text-primary font-medium">{CommandService.formatCurrency(seat.budget.reserved)}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2">
                        <span className="text-foreground font-bold">Kullanılabilir</span>
                        <span className="text-success font-bold">{CommandService.formatCurrency(seat.budget.available)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Onay Yetkileri</h3>
                    <div className="space-y-2.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Onay Seviyesi</span>
                        <span className="text-foreground font-bold">Level {seat.approval.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Finansal Onay Limiti</span>
                        <span className="text-foreground font-medium">
                          {seat.approval.financial_limit >= 999999999
                            ? "Sınırsız"
                            : CommandService.formatCurrency(seat.approval.financial_limit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stratejik Onay</span>
                        <span className={`font-medium ${seat.approval.strategic_authority ? "text-success" : "text-muted-foreground"}`}>
                          {seat.approval.strategic_authority ? "Aktif" : "Pasif"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 text-[11px]"
                      onClick={() => handleAction("Bütçe Düzenle")}
                    >
                      <DollarSign className="h-3.5 w-3.5" />
                      Bütçe Limitini Düzenle
                    </Button>
                  )}
                </TabsContent>

                {/* ═══ VISIBILITY TAB ═══ */}
                <TabsContent value="visibility" className="space-y-5">
                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Departman Görünürlüğü</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {seat.visibility.departments.map((dept) => (
                        <span key={dept} className="text-[10px] px-2 py-1 rounded-lg bg-secondary text-foreground border border-border">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Erişim Matrisi</h3>
                    <div className="space-y-2 text-[11px]">
                      {[
                        { label: "Kararlar", val: seat.visibility.decisions },
                        { label: "Bütçeler", val: seat.visibility.budgets },
                        { label: "OKR'lar", val: seat.visibility.okrs },
                        { label: "Risk Raporları", val: seat.visibility.risk_reports },
                      ].map(item => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className={`font-medium ${item.val ? "text-success" : "text-muted-foreground"}`}>
                            {item.val ? "✓ Görünür" : "✗ Gizli"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 text-[11px]"
                      onClick={() => handleAction("Görünürlük Düzenle")}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Görünürlük Kapsamını Düzenle
                    </Button>
                  )}
                </TabsContent>

                {/* ═══ AUDIT TAB ═══ */}
                <TabsContent value="audit" className="space-y-5">
                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Son Yönetişim Değişiklikleri</h3>
                    {recentEvents.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground">Bu koltuk için kayıtlı değişiklik yok.</p>
                    ) : (
                      <div className="space-y-3">
                        {recentEvents.map(ev => (
                          <div key={ev.id} className="flex items-start gap-3 text-[11px]">
                            <div className="h-6 w-6 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                              <Activity className="h-3 w-3 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground font-medium">{eventTypeLabel(ev.event_type)}</p>
                              <p className="text-muted-foreground text-[10px]">
                                {ev.old_value} → {ev.new_value}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[9px] text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(ev.timestamp)}</span>
                                <span>•</span>
                                <span>{ev.changed_by}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
