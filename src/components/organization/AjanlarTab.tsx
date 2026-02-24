import { Link } from "react-router-dom";
import { Bot, ArrowRight } from "lucide-react";
import { executives } from "@/data/experts";

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  Monitoring: { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "Aktif" },
  "Running Task": { bg: "bg-blue-500/15", text: "text-blue-400", label: "Çalışıyor" },
  Idle: { bg: "bg-muted/30", text: "text-muted-foreground", label: "Beklemede" },
  Alerting: { bg: "bg-destructive/15", text: "text-destructive", label: "Uyarı" },
};

const AjanlarTab = () => {
  const activeCount = executives.filter(e => e.status === "Monitoring" || e.status === "Running Task").length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <p className="text-[12px] text-muted-foreground">
          <span className="font-semibold text-foreground">{executives.length}</span> ajan ·{" "}
          <span className="font-semibold text-emerald-500">{activeCount}</span> aktif
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {executives.map((agent) => {
          const status = statusColors[agent.status] || statusColors.Idle;
          return (
            <div
              key={agent.id}
              className="glass-card flex items-center gap-3 px-4 py-3 group hover:translate-y-[-1px] transition-all duration-200"
            >
              {/* Icon */}
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-foreground truncate">{agent.name}</span>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">{agent.tagline}</p>
              </div>

              {/* Action */}
              <Link
                to={`/workspace/${agent.id}`}
                className="shrink-0 p-2 rounded-lg hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AjanlarTab;
