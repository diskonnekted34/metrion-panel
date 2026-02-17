import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Zap, ChevronDown, Lock, Eye, FileText, Activity, Building2, Users, ListTodo, Bell, BarChart3, Database, Settings as SettingsIcon, Scale, Crown, ArrowUpRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationPanel from "./NotificationPanel";
import UpgradeModal from "./UpgradeModal";
import { departments, type DepartmentId } from "@/contexts/RBACContext";
import { usePacks } from "@/contexts/PackContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const deptSubItems = [
  { label: "Genel Bakış", suffix: "", icon: Eye },
  { label: "Raporlar", suffix: "/reports", icon: FileText },
  { label: "Aksiyonlar", suffix: "/actions", icon: Zap },
  { label: "Modüller", suffix: "/modules", icon: Activity },
];

// Dynamic counters from decision data
import { decisions } from "@/data/decisions";
const pendingDecisionCount = decisions.filter(d => d.lifecycle === "proposed" || d.lifecycle === "under_review").length;
const pendingStrategicCount = 3;
const pendingActionCount = decisions.filter(d => d.lifecycle === "in_execution" || d.lifecycle === "approved").length;

const CountBadge = ({ count }: { count: number }) => {
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

// Command Layer items — strategic top-level
const commandLayerItems = [
  { label: "Karar", icon: Scale, path: "/decision-lab", count: pendingDecisionCount },
  { label: "Komuta", icon: LayoutDashboard, path: "/dashboard", count: pendingStrategicCount },
  { label: "Aksiyon", icon: Zap, path: "/action-center", count: pendingActionCount },
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

  // SİSTEM section items (without Karar/Komuta/Aksiyon which moved to Command Layer)
  const sistemItems = [
    { label: "Kadro", icon: Crown, path: "/kadro", count: 0 },
    { label: "Görevler", icon: ListTodo, path: "/tasks", count: 0 },
    { label: "Uyarılar", icon: Bell, path: "/alerts", count: 0 },
    { label: "Raporlar", icon: BarChart3, path: "/reports", count: 0 },
    { label: "Veri Kaynakları", icon: Database, path: "/data-sources", count: 0 },
    { label: "Teknoloji Veri Kaynakları", icon: Database, path: "/tech-data-sources", count: 0 },
    { label: "Ekibi Genişlet", icon: Users, path: "/marketplace", count: 0 },
    { label: "Ayarlar", icon: SettingsIcon, path: "/settings", count: 0 },
  ];

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

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">

          {/* ═══ COMMAND LAYER ═══ */}
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
                        <CountBadge count={item.count} />
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

          {/* Gradient divider */}
          <div className="h-px mx-3 my-2" style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(30,107,255,0.2) 50%, transparent 100%)",
          }} />

          {/* Departmanlar Accordion */}
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

          {/* SİSTEM Section */}
          <div className="pt-4">
            <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Sistem</span>
            <div className="mt-2 space-y-0.5">
              {sistemItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all duration-200 relative ${
                          active
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-primary" : ""}`} />
                        <span className="font-medium flex-1">{item.label}</span>
                        <CountBadge count={item.count} />
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" style={{ boxShadow: "0 0 12px rgba(30,107,255,0.5)" }} />
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
