import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, Clock, User, BarChart3, CheckCircle2, Users } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { alertsData } from "@/data/alerts";

const AlertDetail = () => {
  const { alertId } = useParams();
  const alert = alertsData.find((a) => a.id === alertId);

  if (!alert) {
    return (
      <AppLayout>
        <div className="p-6 max-w-3xl mx-auto text-center">
          <p className="text-muted-foreground">Uyarı bulunamadı.</p>
          <Link to="/alerts" className="text-primary text-sm hover:underline mt-2 inline-block">← Uyarılara Dön</Link>
        </div>
      </AppLayout>
    );
  }

  const urgencyColor = (u: string) => {
    if (u === "Kritik") return "bg-destructive/15 text-destructive";
    if (u === "Yüksek") return "bg-warning/15 text-warning";
    if (u === "Orta") return "bg-primary/15 text-primary";
    return "bg-secondary text-muted-foreground";
  };

  const borderColor = (u: string) => {
    if (u === "Kritik") return "border-l-destructive";
    if (u === "Yüksek") return "border-l-warning";
    return "border-l-primary";
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back */}
          <Link to="/alerts" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Uyarılara Dön
          </Link>

          {/* Header */}
          <div className={`glass-card p-6 border-l-[3px] ${borderColor(alert.urgency)} mb-6`}>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-destructive/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-foreground mb-2">{alert.text}</h1>
                <p className="text-sm text-muted-foreground mb-3">{alert.detail}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className={`font-medium px-2.5 py-1 rounded-2xl ${urgencyColor(alert.urgency)}`}>
                    {alert.urgency}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> {alert.agent}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {alert.timestamp}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" /> Güven: {alert.confidence}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          {alert.metrics && alert.metrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {alert.metrics.map((m, i) => (
                <div key={i} className="glass-card p-4 text-center">
                  <p className="text-lg font-bold text-foreground">{m.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* What Happened + Why It Matters */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {alert.whatHappened && (
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">Ne Oldu</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{alert.whatHappened}</p>
              </div>
            )}
            {alert.whyItMatters && (
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">Neden Önemli</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{alert.whyItMatters}</p>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {alert.recommendations && alert.recommendations.length > 0 && (
            <div className="glass-card p-5 mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Önerilen Aksiyonlar</h3>
              <div className="space-y-2">
                {alert.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collaboration */}
          {alert.collaboration && (
            <div className="glass-card p-4 mb-6 border-l-[3px] border-l-accent">
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-accent mb-0.5">İşbirliği Önerisi</p>
                  <p className="text-xs text-muted-foreground">{alert.collaboration}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button className="flex-1 min-w-[160px] text-sm font-medium py-3 rounded-2xl bg-accent/15 text-accent hover:bg-accent/25 transition-colors flex items-center justify-center gap-2">
              Göreve Dönüştür <ArrowRight className="h-4 w-4" />
            </button>
            <Link to={`/workspace/${alert.agentId}`} className="flex-1 min-w-[160px] text-sm font-medium py-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 text-center">
              Ajana Ata
            </Link>
            <button className="text-sm font-medium py-3 px-6 rounded-2xl bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors">
              Kapat
            </button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AlertDetail;
