import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Loader2, Plug,
  Shield, Clock, Eye
} from "lucide-react";
import { TechConnector } from "@/data/techIntegrations";

const statusConfig = {
  connected: { label: "Bağlı", color: "text-success", bg: "bg-success/10", icon: CheckCircle2 },
  available: { label: "Kullanılabilir", color: "text-muted-foreground", bg: "bg-secondary/30", icon: Plug },
  error: { label: "Hata", color: "text-destructive", bg: "bg-destructive/10", icon: AlertCircle },
  disabled: { label: "Devre Dışı", color: "text-muted-foreground", bg: "bg-secondary/30", icon: Plug },
};

const sensitivityLabel = { low: "Düşük", med: "Orta", high: "Yüksek" };
const sensitivityColor = { low: "text-success", med: "text-warning", high: "text-destructive" };

interface TechConnectorCardProps {
  connector: TechConnector;
  onConnect: (id: string) => void;
}

const TechConnectorCard = ({ connector, onConnect }: TechConnectorCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[connector.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 text-left"
      >
        {/* Status dot */}
        <div className={`h-10 w-10 rounded-2xl ${cfg.bg} flex items-center justify-center shrink-0`}>
          <StatusIcon className={`h-5 w-5 ${cfg.color} ${connector.status === "connected" ? "" : ""}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{connector.name_tr}</p>
            <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full border ${
              connector.data_sensitivity === "high" ? "border-destructive/20 text-destructive bg-destructive/5" :
              connector.data_sensitivity === "med" ? "border-warning/20 text-warning bg-warning/5" :
              "border-border text-muted-foreground bg-secondary/30"
            }`}>
              {sensitivityLabel[connector.data_sensitivity]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{connector.description_tr}</p>
        </div>

        {/* Sync status */}
        <div className="flex items-center gap-3 shrink-0">
          {connector.status === "connected" && connector.last_sync_at && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground">
                {new Date(connector.last_sync_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          )}
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>

        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-border space-y-3">
              {/* Error message */}
              {connector.error_message_tr && (
                <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/15">
                  <AlertCircle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                  <p className="text-[11px] text-destructive">{connector.error_message_tr}</p>
                </div>
              )}

              {/* Meta grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                <MetaItem label="Erişim" value={connector.access_method.toUpperCase()} />
                <MetaItem label="Frekans" value={
                  connector.refresh_frequency === "realtime" ? "Gerçek Zamanlı" :
                  connector.refresh_frequency === "hourly" ? "Saatlik" :
                  connector.refresh_frequency === "daily" ? "Günlük" : "Manuel"
                } />
                <MetaItem label="Hassasiyet" value={sensitivityLabel[connector.data_sensitivity]} className={sensitivityColor[connector.data_sensitivity]} />
                <MetaItem label="Ortamlar" value={connector.environments_supported.join(", ")} />
              </div>

              {/* Entities */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 mb-2">
                  <Eye className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Varlıklar & Olaylar</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {connector.entities.map(e => (
                    <span key={e.name} className="text-[10px] px-2 py-1 rounded-lg bg-primary/5 border border-primary/10 text-primary font-medium">
                      {e.name}
                    </span>
                  ))}
                  {connector.events.slice(0, 4).map(e => (
                    <span key={e} className="text-[10px] px-2 py-1 rounded-lg bg-secondary/50 border border-border text-muted-foreground">
                      {e}
                    </span>
                  ))}
                  {connector.events.length > 4 && (
                    <span className="text-[9px] px-2 py-1 rounded-lg bg-secondary/30 text-muted-foreground">
                      +{connector.events.length - 4} daha
                    </span>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 mb-2">
                  <Shield className="h-3 w-3 text-success" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Minimum Yetki</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {connector.required_permissions.map(p => (
                    <code key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary/50 text-muted-foreground font-mono">
                      {p}
                    </code>
                  ))}
                </div>
                <p className="text-[10px] text-success mt-1.5">{connector.least_privilege_notes_tr}</p>
              </div>

              {/* Agent impact */}
              {connector.coverage_impact.agents_impacted.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Etkilenen Ajanlar</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {connector.coverage_impact.agents_impacted.map(a => (
                      <span key={a} className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/15">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {connector.status === "available" && (
                  <button onClick={() => onConnect(connector.id)} className="btn-primary px-4 py-2 text-xs">
                    <Plug className="h-3 w-3 mr-1.5 inline" />
                    Bağlan
                  </button>
                )}
                {connector.status === "error" && (
                  <button onClick={() => onConnect(connector.id)} className="px-4 py-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-xs text-destructive transition-colors">
                    <AlertCircle className="h-3 w-3 mr-1.5 inline" />
                    Yeniden Dene
                  </button>
                )}
                {connector.status === "connected" && (
                  <span className="text-[10px] text-success flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Senkronizasyon aktif
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MetaItem = ({ label, value, className }: { label: string; value: string; className?: string }) => (
  <div className="px-2.5 py-1.5 rounded-xl bg-secondary/30">
    <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
    <p className={`text-[10px] font-medium ${className || "text-foreground"}`}>{value}</p>
  </div>
);

export default TechConnectorCard;
