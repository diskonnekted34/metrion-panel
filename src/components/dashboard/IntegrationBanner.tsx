import { Link } from "react-router-dom";
import { AlertCircle, Plug, X } from "lucide-react";
import { useState } from "react";
import { useIntegrations } from "@/contexts/IntegrationContext";

const IntegrationBanner = () => {
  const { hasAnyConnection, connectedCount, totalAvailable, isDemoMode, integrations } = useIntegrations();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const missingNames = integrations
    .filter(i => !i.comingSoon && !i.phase2 && i.status === "not_connected")
    .slice(0, 3)
    .map(i => i.name);

  if (!hasAnyConnection) {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-destructive/10 border border-destructive/15 mb-6">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          <div>
            <span className="text-xs font-medium text-destructive">Canlı İzleme İnaktif</span>
            {isDemoMode && (
              <span className="text-[10px] text-muted-foreground ml-2">Demo modu aktif — simüle edilmiş veriler gösteriliyor.</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/data-sources"
            className="btn-primary px-3 py-1.5 text-[10px]"
          >
            <Plug className="h-3 w-3 mr-1 inline" />
            Veri Kaynağı Bağla
          </Link>
          <button onClick={() => setDismissed(true)} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  if (connectedCount < totalAvailable) {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-warning/10 border border-warning/15 mb-6">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 text-warning shrink-0" />
          <div>
            <span className="text-xs font-medium text-warning">AI İstihbaratı Kısmen Aktif</span>
            <span className="text-[10px] text-muted-foreground ml-2">
              Eksik: {missingNames.join(", ")}{missingNames.length < totalAvailable - connectedCount ? "..." : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/data-sources"
            className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-[10px] text-foreground font-medium transition-colors"
          >
            Eksik Kaynakları Bağla
          </Link>
          <button onClick={() => setDismissed(true)} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default IntegrationBanner;
