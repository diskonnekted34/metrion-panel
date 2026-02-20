import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Target, Scale, Zap, Database,
  Building2, Settings as SettingsIcon, AlertTriangle
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { decisions } from "@/data/decisions";
import { alertsData } from "@/data/alerts";

// Dynamic counters
const pendingDecisionCount = decisions.filter(d => d.lifecycle === "proposed" || d.lifecycle === "under_review").length;
const criticalAlertCount = alertsData.filter(a => !a.resolved).length;
const hasCriticalAlert = alertsData.some(a => a.category === "critical" && !a.resolved);

// Badge components
const CountBadge = ({ count, variant = "amber" }: { count: number; variant?: "amber" | "red" | "blue" }) => {
  if (count <= 0) return null;
  const styles = {
    amber: "bg-warning/20 text-warning border-warning/30",
    red: "bg-destructive/20 text-destructive border-destructive/30",
    blue: "bg-primary/15 text-primary border-primary/20",
  };
  return (
    <span
      className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center border ${styles[variant]} ${variant === "red" ? "animate-pulse" : ""}`}
      style={{ boxShadow: variant === "red" ? "0 0 10px rgba(239,68,68,0.3)" : variant === "amber" ? "0 0 8px rgba(245,158,11,0.25)" : undefined }}
    >
      {count}
    </span>
  );
};

// Menu items — Final 7-item structure
const menuItems = [
  { label: "Merkez", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Strateji", icon: Target, path: "/strategy" },
  { label: "Kararlar", icon: Scale, path: "/decision-lab", count: pendingDecisionCount },
  { label: "Operasyon", icon: Zap, path: "/action-center" },
  { label: "Organizasyon", icon: Building2, path: "/organization" },
  { label: "Veri Kaynakları", icon: Database, path: "/data-sources" },
  { label: "Ayarlar", icon: SettingsIcon, path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (isMobile) return null;

  const isActive = (path: string) => {
    if (path === "/strategy") return location.pathname.startsWith("/strategy") || location.pathname === "/okr" || location.pathname === "/reports" || location.pathname.startsWith("/reports/");
    if (path === "/organization") return location.pathname.startsWith("/organization") || location.pathname.startsWith("/kadro") || location.pathname.startsWith("/seat/") || location.pathname.startsWith("/departments");
    if (path === "/data-sources") return location.pathname.startsWith("/data-sources") || location.pathname.startsWith("/tech-data-sources");
    if (path === "/action-center") return location.pathname.startsWith("/action-center") || location.pathname === "/tasks";
    return location.pathname === path;
  };

  return (
    <TooltipProvider>
      <aside className="fixed left-0 top-0 bottom-0 z-40 w-[277px] flex flex-col glass-strong border-r border-border">
        {/* Logo */}
        <div className="flex items-center px-5 h-16 shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-2xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">C</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">C-Levels</span>
          </Link>
        </div>

        {/* Nav */}
        <nav
          className="flex-1 px-3 py-6 space-y-1 overflow-y-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(30,107,255,0.15) transparent" }}
        >
          {/* Main navigation */}
          <div className="space-y-0.5">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] transition-all duration-200 relative group ${
                        active
                          ? "text-primary bg-primary/10"
                          : "text-foreground/80 hover:text-foreground hover:bg-secondary/60"
                      }`}
                      style={active ? { boxShadow: "0 0 16px rgba(30,107,255,0.12)" } : {}}
                    >
                      <item.icon className={`h-[18px] w-[18px] shrink-0 transition-colors ${active ? "text-primary" : "text-foreground/60 group-hover:text-foreground/80"}`} />
                      <span className="font-semibold flex-1">{item.label}</span>
                      {'count' in item && item.count ? <CountBadge count={item.count} /> : null}
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary" style={{ boxShadow: "0 0 14px rgba(30,107,255,0.6)" }} />
                      )}
                    </Link>
                  </TooltipTrigger>
                  {'count' in item && item.count && item.count > 0 ? (
                    <TooltipContent side="right">
                      <p className="text-xs">{item.count} bekleyen öğe</p>
                    </TooltipContent>
                  ) : null}
                </Tooltip>
              );
            })}
          </div>

          {/* Separator */}
          <div className="h-px mx-3 my-4" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)" }} />

          {/* Critical Alerts */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/alerts"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] transition-all duration-200 relative ${
                  location.pathname === "/alerts" || location.pathname.startsWith("/alerts/")
                    ? "text-destructive bg-destructive/8"
                    : hasCriticalAlert
                      ? "text-foreground/80 hover:text-foreground hover:bg-destructive/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <AlertTriangle
                  className={`h-[16px] w-[16px] shrink-0 ${hasCriticalAlert ? "text-destructive/80" : "text-muted-foreground"}`}
                  style={hasCriticalAlert ? { filter: "drop-shadow(0 0 4px rgba(239,68,68,0.4))" } : {}}
                />
                <span className="font-medium flex-1">Uyarılar</span>
                <CountBadge count={criticalAlertCount} variant={hasCriticalAlert ? "red" : "amber"} />
              </Link>
            </TooltipTrigger>
            {criticalAlertCount > 0 && (
              <TooltipContent side="right">
                <p className="text-xs">{criticalAlertCount} aktif uyarı</p>
              </TooltipContent>
            )}
          </Tooltip>
        </nav>

        {/* Bottom user area placeholder */}
        <div className="px-4 py-3 border-t border-border/40">
          <div className="flex items-center gap-2.5 px-2">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">AY</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-foreground truncate">Ahmet Yılmaz</p>
              <p className="text-[9px] text-muted-foreground">CEO</p>
            </div>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default AppSidebar;
