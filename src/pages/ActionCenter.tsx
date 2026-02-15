import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, ChevronDown, ChevronUp, CheckCircle2, XCircle, Send, Clock,
  AlertTriangle, Shield, ArrowRight, FileText, BarChart3, Undo2, DollarSign,
  History, X, Filter, Brain, Users, ChevronRight
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useActionMode, ActionDraft, ActionStatus, RiskLevel } from "@/contexts/ActionModeContext";
import { useRBAC } from "@/contexts/RBACContext";

const statusConfig: Record<ActionStatus, { label: string; color: string; icon: typeof Clock; bg: string }> = {
  draft: { label: "Taslak", color: "text-muted-foreground", icon: FileText, bg: "bg-secondary/50" },
  pending_approval: { label: "Onay Bekliyor", color: "text-warning", icon: Clock, bg: "bg-warning/10" },
  approved: { label: "Onaylandı", color: "text-success", icon: CheckCircle2, bg: "bg-success/10" },
  published: { label: "Yayınlandı", color: "text-primary", icon: Send, bg: "bg-primary/10" },
  rejected: { label: "Reddedildi", color: "text-destructive", icon: XCircle, bg: "bg-destructive/10" },
};

const riskColors: Record<RiskLevel, string> = {
  low: "text-success bg-success/10",
  medium: "text-warning bg-warning/10",
  high: "text-destructive bg-destructive/10",
};

type ViewMode = "list" | "detail";
type TabId = "pending" | "all" | "audit";
type FilterStatus = "all" | ActionStatus;

const ActionCenter = () => {
  const { actions, auditLog, pendingCount, draftCount, approveDraft, publishAction, rejectAction, actionTypeLabels, riskLabels } = useActionMode();
  const { currentUser } = useRBAC();
  const isAdmin = currentUser.role === "owner" || currentUser.role === "admin";

  const [activeTab, setActiveTab] = useState<TabId>("pending");
  const [selectedAction, setSelectedAction] = useState<ActionDraft | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "pending", label: "Bekleyen", count: pendingCount + draftCount },
    { id: "all", label: "Tümü" },
    { id: "audit", label: "Denetim Kaydı" },
  ];

  let filteredActions = activeTab === "pending"
    ? actions.filter(a => a.status === "draft" || a.status === "pending_approval" || a.status === "approved")
    : actions;

  if (statusFilter !== "all") filteredActions = filteredActions.filter(a => a.status === statusFilter);
  if (riskFilter !== "all") filteredActions = filteredActions.filter(a => a.riskLevel === riskFilter);

  // Detail view
  if (selectedAction) {
    return (
      <AppLayout>
        <ActionDetailView
          action={selectedAction}
          onBack={() => setSelectedAction(null)}
          auditLog={auditLog.filter(l => l.actionId === selectedAction.id)}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-warning/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Action Control Center</h1>
                <p className="text-sm text-muted-foreground">Tüm önerilen ve onay sürecindeki aksiyonları yönetin.</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${showFilters ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filtreler
            </button>
          </div>

          {/* Warning banner */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-warning/5 border border-warning/15 mb-6">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-warning font-medium">Kontrollü Otomasyon Aktif</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Tüm aksiyonlar Taslak → Risk İnceleme → Onay → Yürütme sürecinden geçer. Doğrudan yürütme yapılamaz.
              </p>
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                <div className="flex flex-wrap gap-2 p-4 glass-card">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1.5">Durum</p>
                    <div className="flex gap-1">
                      {(["all", "draft", "pending_approval", "approved", "published", "rejected"] as FilterStatus[]).map(s => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${statusFilter === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground bg-secondary/50"}`}
                        >
                          {s === "all" ? "Tümü" : statusConfig[s as ActionStatus].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-[10px] text-muted-foreground mb-1.5">Risk</p>
                    <div className="flex gap-1">
                      {(["all", "low", "medium", "high"] as (RiskLevel | "all")[]).map(r => (
                        <button
                          key={r}
                          onClick={() => setRiskFilter(r)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${riskFilter === r ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground bg-secondary/50"}`}
                        >
                          {r === "all" ? "Tümü" : riskLabels[r]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-secondary/30 rounded-2xl p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-warning/15 text-warning text-[9px] font-bold">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab !== "audit" ? (
            <div className="space-y-2">
              {filteredActions.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Eşleşen aksiyon bulunamadı.</p>
                </div>
              ) : (
                filteredActions.map(action => (
                  <ActionRow
                    key={action.id}
                    action={action}
                    onViewDetail={() => setSelectedAction(action)}
                    isAdmin={isAdmin}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {auditLog.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Denetim kaydı boş.</p>
                </div>
              ) : (
                auditLog.map(entry => (
                  <div key={entry.id} className="glass-card p-4 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                      <History className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">{entry.event}</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">{entry.userName}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{entry.details}</p>
                      <p className="text-[9px] text-muted-foreground/60 mt-1">{new Date(entry.timestamp).toLocaleString("tr-TR")}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

// ── Hybrid Card-List Row ──

const ActionRow = ({ action, onViewDetail, isAdmin }: { action: ActionDraft; onViewDetail: () => void; isAdmin: boolean }) => {
  const { approveDraft, publishAction, rejectAction, actionTypeLabels, riskLabels } = useActionMode();
  const { currentUser } = useRBAC();
  const cfg = statusConfig[action.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="glass-card p-4 flex items-center gap-4 hover:border-primary/20 transition-all cursor-pointer group" onClick={onViewDetail}>
      {/* LEFT */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="text-sm font-medium text-foreground">{action.title}</p>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
            {actionTypeLabels[action.type]}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <Brain className="h-3 w-3" />
          <span>{action.createdBy}</span>
          <span>·</span>
          <span>{new Date(action.createdAt).toLocaleDateString("tr-TR")}</span>
        </div>
      </div>

      {/* CENTER */}
      <div className="hidden lg:flex items-center gap-5">
        <div className="text-center">
          <p className="text-[9px] text-muted-foreground">Etki</p>
          <p className="text-[10px] font-medium text-foreground truncate max-w-[120px]">{action.estimatedImpact.split("·")[0]}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-muted-foreground">Risk</p>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${riskColors[action.riskLevel]}`}>
            {riskLabels[action.riskLevel]}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
          <StatusIcon className="h-3 w-3" />
          {cfg.label}
        </span>

        {isAdmin && (action.status === "draft" || action.status === "pending_approval") && (
          <button
            onClick={(e) => { e.stopPropagation(); approveDraft(action.id, currentUser.name); }}
            className="px-2.5 py-1 rounded-lg bg-success/10 text-success text-[10px] font-medium hover:bg-success/20 transition-colors"
          >
            <CheckCircle2 className="h-3 w-3 inline mr-1" />Onayla
          </button>
        )}
        {isAdmin && action.status === "approved" && (
          <button
            onClick={(e) => { e.stopPropagation(); publishAction(action.id, currentUser.name); }}
            className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-medium hover:bg-primary/20 transition-colors"
          >
            <Send className="h-3 w-3 inline mr-1" />Yayınla
          </button>
        )}
        {isAdmin && (action.status === "draft" || action.status === "pending_approval") && (
          <button
            onClick={(e) => { e.stopPropagation(); rejectAction(action.id, currentUser.name); }}
            className="px-2.5 py-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-[10px] transition-colors"
          >
            <XCircle className="h-3 w-3" />
          </button>
        )}

        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

// ── Action Detail View (Full Screen) ──

interface ActionDetailViewProps {
  action: ActionDraft;
  onBack: () => void;
  auditLog: { id: string; event: string; userName: string; timestamp: string; details: string }[];
}

const ActionDetailView = ({ action, onBack, auditLog }: ActionDetailViewProps) => {
  const { approveDraft, publishAction, rejectAction, actionTypeLabels, riskLabels } = useActionMode();
  const { currentUser } = useRBAC();
  const isAdmin = currentUser.role === "owner" || currentUser.role === "admin";
  const cfg = statusConfig[action.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowRight className="h-3 w-3 rotate-180" /> Listeye Dön
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                <StatusIcon className="h-3 w-3" /> {cfg.label}
              </span>
              <span className="text-[10px] text-muted-foreground">{actionTypeLabels[action.type]}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${riskColors[action.riskLevel]}`}>
                Risk: {riskLabels[action.riskLevel]}
              </span>
            </div>
            <h1 className="text-xl font-bold text-foreground">{action.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              {(action.status === "draft" || action.status === "pending_approval") && (
                <>
                  <button onClick={() => approveDraft(action.id, currentUser.name)} className="btn-primary px-4 py-2 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1.5 inline" /> Onayla
                  </button>
                  <button onClick={() => rejectAction(action.id, currentUser.name)} className="px-4 py-2 rounded-xl hover:bg-destructive/10 text-xs text-muted-foreground hover:text-destructive transition-colors">
                    <XCircle className="h-3 w-3 mr-1.5 inline" /> Reddet
                  </button>
                </>
              )}
              {action.status === "approved" && (
                <button onClick={() => publishAction(action.id, currentUser.name)} className="btn-primary px-4 py-2 text-xs">
                  <Send className="h-3 w-3 mr-1.5 inline" /> Yayınla
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Impact Breakdown */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Etki Analizi</h3>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
              <BarChart3 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-foreground">{action.estimatedImpact}</p>
            </div>
          </div>

          {/* Risk Evaluation */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Risk Değerlendirmesi</h3>
            <div className="space-y-2">
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${riskColors[action.riskLevel]}`}>
                {riskLabels[action.riskLevel]}
              </span>
              {action.riskFlags.map((flag, i) => (
                <div key={i} className="flex items-center gap-1.5 mt-2">
                  <AlertTriangle className="h-3 w-3 text-warning" />
                  <span className="text-[11px] text-warning">{flag}</span>
                </div>
              ))}
              {action.riskFlags.length === 0 && <p className="text-[10px] text-muted-foreground">Risk bayrağı yok.</p>}
            </div>
          </div>

          {/* Changes */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Değişiklik Detayları</h3>
            <div className="space-y-1.5">
              {action.changes.map((c, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-secondary/30">
                  <span className="text-xs text-foreground">{c.field}</span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-muted-foreground">{c.from}</span>
                    <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                    <span className="text-foreground font-medium">{c.to}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Plan */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Yürütme Planı</h3>
            <div className="space-y-3">
              {action.budgetCap && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[11px] text-foreground">Bütçe Sınırı: ${action.budgetCap}</span>
                </div>
              )}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-secondary/30">
                <Undo2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Geri Alma Planı</p>
                  <p className="text-xs text-foreground mt-0.5">{action.rollbackPlan}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Chain */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Onay Zinciri</h3>
            <div className="space-y-2">
              <StepItem label="Oluşturuldu" by={action.createdBy} at={action.createdAt} done />
              <StepItem label="Onaylandı" by={action.approvedBy} at={action.approvedAt} done={!!action.approvedBy} />
              <StepItem label="Yayınlandı" by={action.publishedBy} at={action.publishedAt} done={!!action.publishedBy} />
              {action.rejectedBy && <StepItem label="Reddedildi" by={action.rejectedBy} at={action.rejectedAt} done isRejected />}
            </div>
          </div>

          {/* Audit Log */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Denetim Günlüğü</h3>
            {auditLog.length === 0 ? (
              <p className="text-[10px] text-muted-foreground">Bu aksiyon için kayıt yok.</p>
            ) : (
              <div className="space-y-2">
                {auditLog.map(entry => (
                  <div key={entry.id} className="flex items-start gap-2">
                    <History className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-medium text-foreground">{entry.event}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">— {entry.userName}</span>
                      <p className="text-[9px] text-muted-foreground">{new Date(entry.timestamp).toLocaleString("tr-TR")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="mt-6 text-[10px] text-muted-foreground glass-card p-4">
          <p>Oluşturan: {action.createdBy} · {new Date(action.createdAt).toLocaleString("tr-TR")}</p>
          {action.approvedBy && <p>Onaylayan: {action.approvedBy} · {new Date(action.approvedAt!).toLocaleString("tr-TR")}</p>}
          {action.publishedBy && <p>Yayınlayan: {action.publishedBy} · {new Date(action.publishedAt!).toLocaleString("tr-TR")}</p>}
        </div>
      </motion.div>
    </div>
  );
};

const StepItem = ({ label, by, at, done, isRejected }: { label: string; by?: string; at?: string; done: boolean; isRejected?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
      isRejected ? "bg-destructive/15" : done ? "bg-success/15" : "bg-secondary/50"
    }`}>
      {isRejected ? <XCircle className="h-3 w-3 text-destructive" /> : done ? <CheckCircle2 className="h-3 w-3 text-success" /> : <Clock className="h-3 w-3 text-muted-foreground" />}
    </div>
    <div>
      <p className={`text-[11px] font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
      {by && <p className="text-[9px] text-muted-foreground">{by} · {new Date(at!).toLocaleString("tr-TR")}</p>}
    </div>
  </div>
);

export default ActionCenter;
