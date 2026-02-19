import { useState } from "react";
import { toast } from "sonner";
import { X, ArrowRight, Eye, CheckCircle2, AlertTriangle, Lock, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { alertsData } from "@/data/alerts";
import { useRBAC } from "@/contexts/RBACContext";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

type NTab = "all" | "critical" | "system";

const NotificationPanel = ({ open, onClose }: NotificationPanelProps) => {
  const { canPerform } = useRBAC();
  const canCreateTask = canPerform("canCreateTasks");
  const [activeTab, setActiveTab] = useState<NTab>("all");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  if (!open) return null;

  const critical = alertsData.filter(a => a.category === "critical");
  const system = alertsData.filter(a => a.category === "completed" || a.category === "recommendation");
  const all = alertsData;

  const visibleAlerts =
    activeTab === "critical" ? critical :
    activeTab === "system" ? system : all;

  const markAsRead = (id: string) => {
    setReadIds(prev => new Set(prev).add(id));
    toast.success("Okundu olarak işaretlendi.");
  };

  const urgencyBorder = (u: string) => {
    if (u === "Kritik") return "border-l-destructive";
    if (u === "Yüksek") return "border-l-warning";
    if (u === "Orta") return "border-l-primary";
    return "border-l-muted";
  };

  const tabs: { key: NTab; label: string; count: number }[] = [
    { key: "all", label: "Tümü", count: all.length },
    { key: "critical", label: "Kritik", count: critical.length },
    { key: "system", label: "Sistem", count: system.length },
  ];

  const renderCard = (alert: typeof alertsData[0]) => {
    const isRead = readIds.has(alert.id);
    return (
      <div
        key={alert.id}
        className={`rounded-xl p-3.5 border border-border border-l-[3px] ${urgencyBorder(alert.urgency)} transition-colors ${
          alert.resolved || isRead ? "opacity-50" : "bg-secondary/20"
        }`}
      >
        <div className="flex items-start gap-2 mb-1.5">
          {alert.resolved ? (
            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
              alert.urgency === "Kritik" ? "text-destructive" : alert.urgency === "Yüksek" ? "text-warning" : "text-primary"
            }`} />
          )}
          <p className="text-sm font-medium text-foreground leading-tight">{alert.text}</p>
        </div>
        <p className="text-xs text-muted-foreground mb-2 ml-5.5">{alert.detail}</p>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground ml-5.5 mb-2">
          <span>{alert.agent}</span>
          <span>·</span>
          <span>{alert.timestamp}</span>
        </div>
        {!alert.resolved && (
          <div className="flex gap-1.5 mt-2 ml-5.5">
            <button
              onClick={() => canCreateTask ? toast.success("Görev oluşturuldu.") : toast.error("Yetkiniz yok.")}
              disabled={!canCreateTask}
              className={`text-[11px] font-medium py-1.5 px-2.5 rounded-lg transition-colors flex items-center gap-1 ${
                canCreateTask
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-muted/30 text-muted-foreground/50 cursor-not-allowed"
              }`}
            >
              {canCreateTask ? <ArrowRight className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              Göreve Dönüştür
            </button>
            <Link
              to={`/alerts/${alert.id}`}
              onClick={onClose}
              className="text-[11px] font-medium py-1.5 px-2.5 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors flex items-center gap-1"
            >
              <Eye className="h-3 w-3" /> Analiz
            </Link>
            {!isRead && (
              <button
                onClick={() => markAsRead(alert.id)}
                className="text-[11px] font-medium py-1.5 px-2.5 rounded-lg hover:bg-secondary/60 text-muted-foreground transition-colors flex items-center gap-1"
              >
                <Check className="h-3 w-3" /> Okundu
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-popover border-l border-border flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">Bildirimler</h2>
          <div className="flex items-center gap-2">
            <Link to="/alerts" onClick={onClose} className="text-xs text-primary hover:underline">
              Tümünü Gör
            </Link>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 py-2.5 border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-60">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {visibleAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <CheckCircle2 className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">Şimdilik bildirim yok</p>
            </div>
          ) : (
            visibleAlerts.map(renderCard)
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
