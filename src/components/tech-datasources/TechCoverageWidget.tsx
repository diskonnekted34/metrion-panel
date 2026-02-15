import { TrendingUp, AlertCircle } from "lucide-react";
import { TechConnector, calculateCoverage, getCTOImpact, getCIOImpact } from "@/data/techIntegrations";

interface TechCoverageWidgetProps {
  connectors: TechConnector[];
}

const TechCoverageWidget = ({ connectors }: TechCoverageWidgetProps) => {
  const coverage = calculateCoverage(connectors);
  const cto = getCTOImpact(connectors);
  const cio = getCIOImpact(connectors);
  const totalConnected = connectors.filter(c => c.status === "connected").length;
  const totalAvailable = connectors.length;
  const overallPercent = Math.round((totalConnected / totalAvailable) * 100);
  const errorCount = connectors.filter(c => c.status === "error").length;

  return (
    <div className="glass-card p-4 space-y-4">
      {/* Overall */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Veri Kapsam Durumu</span>
        </div>
        <span className="text-lg font-bold text-primary">{overallPercent}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
          style={{ width: `${overallPercent}%` }}
        />
      </div>

      <div className="flex items-center gap-4 text-[10px]">
        <span className="text-muted-foreground">{totalConnected}/{totalAvailable} bağlı</span>
        {errorCount > 0 && (
          <span className="text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errorCount} hata
          </span>
        )}
      </div>

      {/* CTO / CIO impact */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
        <ImpactBar label="CTO Kapsamı" covered={cto.covered} total={cto.total} color="bg-primary" />
        <ImpactBar label="CIO Kapsamı" covered={cio.covered} total={cio.total} color="bg-purple-400" />
      </div>

      {/* Missing recommendations */}
      {coverage.filter(c => c.connected === 0 && c.total > 0).length > 0 && (
        <div className="pt-2 border-t border-border">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Eksik Kategoriler</p>
          <div className="flex flex-wrap gap-1">
            {coverage.filter(c => c.connected === 0).slice(0, 6).map(c => (
              <span key={c.category} className="text-[9px] px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/15">
                {c.category_name_tr}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ImpactBar = ({ label, covered, total, color }: { label: string; covered: number; total: number; color: string }) => {
  const pct = total > 0 ? Math.round((covered / total) * 100) : 0;
  return (
    <div className="px-3 py-2 rounded-xl bg-secondary/30">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-semibold text-muted-foreground">{label}</span>
        <span className="text-[10px] font-bold text-foreground">{covered}/{total}</span>
      </div>
      <div className="h-1 rounded-full bg-secondary/50">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default TechCoverageWidget;
