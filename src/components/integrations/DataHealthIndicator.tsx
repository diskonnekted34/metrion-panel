import { Activity, AlertTriangle, CheckCircle2, XCircle, Clock, Gauge } from "lucide-react";
import { DataHealth } from "@/data/integrations";

interface DataHealthIndicatorProps {
  health: DataHealth;
  compact?: boolean;
}

const syncStatusConfig = {
  healthy: { label: "Sağlıklı", color: "text-success", bg: "bg-success/10", icon: CheckCircle2 },
  warning: { label: "Uyarı", color: "text-warning", bg: "bg-warning/10", icon: AlertTriangle },
  error: { label: "Hata", color: "text-destructive", bg: "bg-destructive/10", icon: XCircle },
  idle: { label: "Beklemede", color: "text-muted-foreground", bg: "bg-secondary/30", icon: Clock },
};

const apiHealthConfig = {
  operational: { label: "Operasyonel", color: "text-success" },
  degraded: { label: "Düşük Performans", color: "text-warning" },
  down: { label: "Çevrimdışı", color: "text-destructive" },
  unknown: { label: "Bilinmiyor", color: "text-muted-foreground" },
};

const DataHealthIndicator = ({ health, compact }: DataHealthIndicatorProps) => {
  const sync = syncStatusConfig[health.syncStatus];
  const api = apiHealthConfig[health.apiHealth];
  const SyncIcon = sync.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <div className={`h-1.5 w-1.5 rounded-full ${sync.color.replace("text-", "bg-")}`} />
        <span className={`text-[9px] font-medium ${sync.color}`}>{sync.label}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 mb-1">
        <Activity className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Veri Sağlığı</span>
      </div>
      
      <div className="grid grid-cols-2 gap-1.5">
        {/* Sync Status */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${sync.bg}`}>
          <SyncIcon className={`h-3 w-3 ${sync.color}`} />
          <span className={`text-[10px] font-medium ${sync.color}`}>{sync.label}</span>
        </div>
        
        {/* API Health */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-secondary/30">
          <div className={`h-1.5 w-1.5 rounded-full ${api.color.replace("text-", "bg-")}`} />
          <span className={`text-[10px] font-medium ${api.color}`}>{api.label}</span>
        </div>
      </div>

      {/* Rate Limit */}
      {health.rateLimitPercent !== undefined && health.rateLimitPercent > 0 && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-secondary/30">
          <Gauge className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            API Limit: {health.rateLimitPercent}%
          </span>
          <div className="flex-1 h-1 rounded-full bg-secondary ml-1">
            <div
              className={`h-1 rounded-full transition-all ${
                health.rateLimitPercent > 80 ? "bg-destructive" : health.rateLimitPercent > 50 ? "bg-warning" : "bg-success"
              }`}
              style={{ width: `${health.rateLimitPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Token expiry */}
      {health.tokenExpiresAt && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-warning/5 border border-warning/10">
          <Clock className="h-3 w-3 text-warning" />
          <span className="text-[10px] text-warning">
            Token süresi: {new Date(health.tokenExpiresAt).toLocaleDateString("tr-TR")}
          </span>
        </div>
      )}

      {/* Last error */}
      {health.lastError && (
        <div className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-xl bg-destructive/5 border border-destructive/10">
          <XCircle className="h-3 w-3 text-destructive mt-0.5 shrink-0" />
          <span className="text-[10px] text-destructive">{health.lastError}</span>
        </div>
      )}
    </div>
  );
};

export default DataHealthIndicator;
