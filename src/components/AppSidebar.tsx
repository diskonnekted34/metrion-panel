import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Zap, ChevronDown, Lock, Eye, FileText, Activity, Building2, Users, ListTodo, Bell, BarChart3, Database, Settings as SettingsIcon, Scale, Crown, AlertTriangle, Target } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationPanel from "./NotificationPanel";
import UpgradeModal from "./UpgradeModal";
import { departments, type DepartmentId } from "@/contexts/RBACContext";
import { usePacks } from "@/contexts/PackContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { decisions } from "@/data/decisions";
import { alertsData } from "@/data/alerts";

const deptSubItems = [
  { label: "Genel Bakış", suffix: "", icon: Eye },
  { label: "Raporlar", suffix: "/reports", icon: FileText },
  { label: "Aksiyonlar", suffix: "/actions", icon: Zap },
  { label: "Modüller", suffix: "/modules", icon: Activity },
];

// Dynamic counters
const pendingDecisionCount = decisions.filter(d => d.lifecycle === "proposed" || d.lifecycle === "under_review").length;
const pendingStrategicCount = 3;
const pendingActionCount = decisions.filter(d => d.lifecycle === "in_execution" || d.lifecycle === "approved").length;
const criticalAlertCount = alertsData.filter(a => !a.resolved).length;
const hasCriticalAlert = alertsData.some(a => a.category === "critical" && !a.resolved);

// Badge components
const AmberBadge = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  return (
    <span
      className="min-w-[20px] h-5 px-1.5 rounded-full bg-warning/20 text-warning text-[10px] font-bold flex items-center justify-center border border-warning/30 animate-pulse"
      style={{ boxShadow: "0 0 8px rgba(245,158,11,0.25)" }}
    >
      {count}
    </span>
  );
};

const AlertBadge = ({ count, critical }: { count: number; critical: boolean }) => {
  if (count <= 0) return null;
  return (
    <span
      className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center border ${
        critical
          ? "bg-destructive/20 text-destructive border-destructive/30 animate-pulse"
          : "bg-warning/15 text-warning border-warning/25"
      }`}
      style={{ boxShadow: critical ? "0 0 10px rgba(239,68,68,0.3)" : "0 0 6px rgba(245,158,11,0.2)" }}
    >
      {count}
    </span>
  );
};

const BlueBadge = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  return (
    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary/15 text-primary text-[9px] font-bold flex items-center justify-center border border-primary/20">
      {count}
    </span>
  );
};

// Layer divider
const LayerDivider = ({ color = "primary" }: { color?: "primary" | "warning" | "muted" }) => {
  const gradients: Record<string, string> = {
    primary: "linear-gradient(90deg, transparent 0%, rgba(30,107,255,0.2) 50%, transparent 100%)",
    warning: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.15) 50%, transparent 100%)",
    muted: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
  };
  return <div className="h-px mx-3 my-3" style={{ background: gradients[color] }} />;
};

// Command Layer items
const commandLayerItems = [
  { label: "Karar", icon: Scale, path: "/decision-lab", count: pendingDecisionCount },
  { label: "Komuta", icon: LayoutDashboard, path: "/dashboard", count: pendingStrategicCount },
  { label: "Aksiyon", icon: Zap, path: "/action-center", count: pendingActionCount },
  { label: "OKR", icon: Target, path: "/okr", count: 0 },
];

// Executive Control items
const executiveControlItems = [
  { label: "Kadro", icon: Crown, path: "/kadro" },
  { label: "Görevler", icon: ListTodo, path: "/tasks" },
  { label: "Raporlar", icon: BarChart3, path: "/reports" },
];

// System items
const sistemItems = [
  { label: "Veri Kaynakları", icon: Database, path: "/data-sources" },
  { label: "Teknoloji Veri Kaynakları", icon: Database, path: "/tech-data-sources" },
  { label: "Ekibi Genişlet", icon: Users, path: "/marketplace" },
  { label: "Ayarlar", icon: SettingsIcon, path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [notifOpen, setNotifOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeDeptId, setUpgradeDeptId] = useState<DepartmentId | undefined>();
  const { isDepartmentUnlocked } = usePacks();
  const [deptsOpen, setDeptsOpen] = useState(true);
  const [expandedDept, setExpandedDept] = useState<string | null>(() => {
    const match = location.pathname.match(/^\/departments\/([^/]+)/);
    return match ? match[1] : null;
  });

  if (isMobile) return null;

  const healthColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-primary";
    return "text-warning";
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <TooltipProvider>
      <aside className="fixed left-0 top-0 bottom-0 z-40 w-[264px] flex flex-col glass-strong border-r border-border">
        {/* Logo */}
        <div className="flex items-center px-5 h-16 shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-2xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">C</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">C-Levels</span>
          </Link>
        </div>

        {/* Nav — custom thin scrollbar */}
        <nav
          className="flex-1 px-3 py-4 space-y-1 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(30,107,255,0.15) transparent",
          }}
        >

          {/* ═══ LAYER 1: COMMAND LAYER ═══ */}
          <div className="relative rounded-2xl p-1 mb-1" style={{
            background: "linear-gradient(135deg, rgba(30,107,255,0.06) 0%, rgba(30,107,255,0.02) 100%)",
            boxShadow: "inset 0 0 20px rgba(30,107,255,0.04), 0 0 1px rgba(30,107,255,0.1)",
          }}>
            <div className="space-y-0.5">
              {commandLayerItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] transition-all duration-200 relative ${
                          active
                            ? "text-primary bg-primary/12"
                            : "text-foreground/90 hover:text-foreground hover:bg-secondary/60"
                        }`}
                        style={active ? { boxShadow: "0 0 16px rgba(30,107,255,0.15)" } : {}}
                      >
                        <item.icon className={`h-[19px] w-[19px] shrink-0 ${active ? "text-primary" : "text-foreground/70"}`} />
                        <span className="font-semibold flex-1">{item.label}</span>
                        <AmberBadge count={item.count} />
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary" style={{ boxShadow: "0 0 14px rgba(30,107,255,0.6)" }} />
                        )}
                      </Link>
                    </TooltipTrigger>
                    {item.count > 0 && (
                      <TooltipContent side="right">
                        <p className="text-xs">{item.count} bekleyen öğe</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </div>
          </div>

          <LayerDivider color="warning" />

          {/* ═══ LAYER 2: ALERT CENTER ═══ */}
          <div>
            <span className="px-3 text-[9px] font-bold uppercase tracking-[0.15em] text-destructive/70">Kritik Uyarılar</span>
            <div
              className="mt-1.5 rounded-2xl p-1 relative"
              style={{
                background: hasCriticalAlert
                  ? "linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(245,158,11,0.03) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)",
                boxShadow: hasCriticalAlert
                  ? "inset 0 0 16px rgba(239,68,68,0.04), 0 0 1px rgba(239,68,68,0.08)"
                  : "none",
              }}
            >
              {/* Left gradient border */}
              {hasCriticalAlert && (
                <div
                  className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full"
                  style={{
                    background: "linear-gradient(180deg, rgba(239,68,68,0.6) 0%, rgba(245,158,11,0.4) 100%)",
                    boxShadow: "0 0 8px rgba(239,68,68,0.3)",
                  }}
                />
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/alerts"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 relative ${
                      isActive("/alerts")
                        ? "text-destructive bg-destructive/10"
                        : hasCriticalAlert
                          ? "text-foreground/90 hover:text-foreground hover:bg-destructive/8"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                    style={isActive("/alerts") ? { boxShadow: "0 0 14px rgba(239,68,68,0.12)" } : {}}
                  >
                    <AlertTriangle
                      className={`h-[18px] w-[18px] shrink-0 ${
                        isActive("/alerts") ? "text-destructive" :
                        hasCriticalAlert ? "text-destructive/80" : "text-muted-foreground"
                      }`}
                      style={hasCriticalAlert ? { filter: "drop-shadow(0 0 4px rgba(239,68,68,0.4))" } : {}}
                    />
                    <span className="font-semibold flex-1">Uyarılar</span>
                    <AlertBadge count={criticalAlertCount} critical={hasCriticalAlert} />
                    {isActive("/alerts") && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-destructive" style={{ boxShadow: "0 0 12px rgba(239,68,68,0.5)" }} />
                    )}
                  </Link>
                </TooltipTrigger>
                {criticalAlertCount > 0 && (
                  <TooltipContent side="right">
                    <p className="text-xs">{criticalAlertCount} aktif uyarı</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </div>

          <LayerDivider color="muted" />

          {/* ═══ LAYER 3: EXECUTIVE CONTROL ═══ */}
          <div
            className="rounded-2xl p-1"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="space-y-0.5">
              {executiveControlItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12.5px] transition-all duration-200 relative ${
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <item.icon className={`h-[17px] w-[17px] shrink-0 ${active ? "text-primary" : ""}`} />
                    <span className="font-medium flex-1">{item.label}</span>
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" style={{ boxShadow: "0 0 12px rgba(30,107,255,0.5)" }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <LayerDivider color="muted" />

          {/* ═══ LAYER 4: DEPARTMANLAR ═══ */}
          <div>
            <button
              onClick={() => setDeptsOpen(!deptsOpen)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm w-full text-left text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
            >
              <Building2 className="h-[18px] w-[18px] shrink-0" />
              <span className="font-medium flex-1">Departmanlar</span>
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${deptsOpen ? "rotate-0" : "-rotate-90"}`} />
            </button>

            {deptsOpen && (
              <div className="mt-1 ml-3 pl-3 border-l border-border/40 space-y-0.5">
                {departments.map((dept) => {
                  const unlocked = isDepartmentUnlocked(dept.id);
                  const isExpanded = expandedDept === dept.id;
                  const isDeptActive = location.pathname.startsWith(`/departments/${dept.id}`);

                  if (!unlocked) {
                    return (
                      <button
                        key={dept.id}
                        onClick={() => {
                          if (dept.id !== "legal") {
                            setUpgradeDeptId(dept.id);
                            setUpgradeOpen(true);
                          }
                        }}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] w-full text-left opacity-40 hover:opacity-60 transition-opacity cursor-pointer"
                      >
                        <span className="shrink-0">{dept.icon}</span>
                        <span className="font-medium text-muted-foreground flex-1 truncate">{dept.name}</span>
                        {dept.id === "legal" ? (
                          <span className="text-[8px] text-muted-foreground px-1.5 py-0.5 rounded-full border border-border">Yakında</span>
                        ) : (
                          <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                        )}
                      </button>
                    );
                  }

                  return (
                    <div key={dept.id}>
                      <button
                        onClick={() => setExpandedDept(isExpanded ? null : dept.id)}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] w-full text-left transition-all duration-200 relative group ${
                          isDeptActive
                            ? "text-primary bg-primary/8"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        }`}
                        style={isDeptActive ? { boxShadow: "0 0 12px rgba(30,107,255,0.08)" } : {}}
                      >
                        <span className="shrink-0">{dept.icon}</span>
                        <span className="font-medium flex-1 truncate">{dept.name}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-secondary border border-border/60 ${healthColor(dept.healthScore)}`} style={{ boxShadow: "0 0 6px rgba(30,107,255,0.06)" }}>
                              {dept.healthScore}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="text-xs">Departman Genel Skoru</p>
                          </TooltipContent>
                        </Tooltip>
                        <ChevronDown className={`h-3 w-3 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
                      </button>

                      {isExpanded && (
                        <div className="ml-4 pl-3 border-l border-border/30 mt-0.5 mb-1 space-y-0.5">
                          {deptSubItems.map((sub) => {
                            const subPath = `/departments/${dept.id}${sub.suffix}`;
                            const isSubActive = sub.suffix === ""
                              ? location.pathname === `/departments/${dept.id}`
                              : location.pathname === subPath;
                            return (
                              <Link
                                key={sub.suffix}
                                to={subPath}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition-colors ${
                                  isSubActive
                                    ? "text-primary bg-primary/8 font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                                }`}
                              >
                                <sub.icon className="h-3 w-3 shrink-0" />
                                <span>{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <LayerDivider color="muted" />

          {/* ═══ LAYER 5: SİSTEM ═══ */}
          <div>
            <span className="px-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">Sistem</span>
            <div className="mt-1.5 space-y-0.5">
              {sistemItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] transition-all duration-200 relative ${
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground/70 hover:text-muted-foreground hover:bg-secondary/40"
                    }`}
                  >
                    <item.icon className={`h-[16px] w-[16px] shrink-0 ${active ? "text-primary" : ""}`} />
                    <span className="font-medium flex-1">{item.label}</span>
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-primary/60" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom */}
        <div className="px-5 py-4 border-t border-border">
          <Link to="/pricing" className="btn-primary w-full text-center block px-4 py-2.5 text-sm">
            Planı Yükselt
          </Link>
        </div>
      </aside>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} departmentId={upgradeDeptId} />
    </TooltipProvider>
  );
};

export default AppSidebar;
