import { X, ArrowRight, Eye, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { alertsData } from "@/data/alerts";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ open, onClose }: NotificationPanelProps) => {
  if (!open) return null;

  const critical = alertsData.filter((a) => a.category === "critical");
  const recommendations = alertsData.filter((a) => a.category === "recommendation");
  const completed = alertsData.filter((a) => a.category === "completed");

  const urgencyBorder = (u: string) => {
    if (u === "Kritik") return "border-l-destructive";
    if (u === "Yüksek") return "border-l-warning";
    if (u === "Orta") return "border-l-primary";
    return "border-l-muted";
  };

  const renderCard = (alert: typeof alertsData[0]) => (
    <div key={alert.id} className={`glass-card p-4 border-l-[3px] ${urgencyBorder(alert.urgency)} ${alert.resolved ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-2 mb-1.5">
        <AlertTriangle className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
          alert.urgency === "Kritik" ? "text-destructive" : alert.urgency === "Yüksek" ? "text-warning" : "text-primary"
        }`} />
        <p className="text-sm font-medium text-foreground leading-tight">{alert.text}</p>
      </div>
      <p className="text-xs text-muted-foreground mb-2 ml-5.5">{alert.detail}</p>
      <div className="flex items-center justify-between ml-5.5">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>{alert.agent}</span>
          <span>·</span>
          <span>{alert.timestamp}</span>
          <span>·</span>
          <span>Güven: {alert.confidence}</span>
        </div>
      </div>
      {!alert.resolved && (
        <div className="flex gap-2 mt-3 ml-5.5">
          <button className="text-[11px] font-medium py-1.5 px-3 rounded-2xl bg-accent/15 text-accent hover:bg-accent/25 transition-colors flex items-center gap-1">
            Göreve Dönüştür <ArrowRight className="h-3 w-3" />
          </button>
          <Link to={`/alerts/${alert.id}`} onClick={onClose} className="text-[11px] font-medium py-1.5 px-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors flex items-center gap-1">
            <Eye className="h-3 w-3" /> Analiz
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] glass-strong border-l border-border flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">Bildirimler</h2>
          <div className="flex items-center gap-2">
            <Link to="/alerts" onClick={onClose} className="text-xs text-primary hover:underline">
              Tümünü Gör
            </Link>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-secondary transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {critical.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-destructive uppercase tracking-wider mb-3">Kritik</h3>
              <div className="space-y-2.5">{critical.map(renderCard)}</div>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Öneriler</h3>
              <div className="space-y-2.5">{recommendations.map(renderCard)}</div>
            </div>
          )}

          {completed.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tamamlanan</h3>
              <div className="space-y-2.5">
                {completed.map((alert) => (
                  <div key={alert.id} className="glass-card p-4 border-l-[3px] border-l-muted opacity-60">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-success shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{alert.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{alert.agent} · {alert.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
