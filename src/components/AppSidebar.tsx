import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Target, Scale, Zap, Network, ChevronDown,
  Database, Settings as SettingsIcon, FileText, ChevronRight,
  Eye, BarChart3, Crosshair, Activity, ClipboardList,
  ShoppingBag, Bot, Brain,
} from "lucide-react";
import { allExperts } from "@/data/experts";
import { useIsMobile } from "@/hooks/use-mobile";
import { departments } from "@/contexts/RBACContext";
import { motion, AnimatePresence } from "framer-motion";

/* ── Department color dots ── */
const deptColors: Record<string, string> = {
  executive: "hsl(220, 100%, 56%)",
  technology: "hsl(190, 90%, 50%)",
  marketing: "hsl(280, 70%, 55%)",
  finance: "hsl(160, 76%, 44%)",
  operations: "hsl(38, 92%, 50%)",
  creative: "hsl(330, 70%, 55%)",
  marketplace: "hsl(25, 85%, 55%)",
  legal: "hsl(210, 30%, 55%)",
  hr: "hsl(350, 65%, 55%)",
  sales: "hsl(140, 60%, 45%)",
};

/* ── Department submenu items ── */
const deptSubItems = [
  { label: "Genel Bakış", icon: Eye, suffix: "" },
  { label: "KPI", icon: BarChart3, suffix: "/intelligence/overview" },
  { label: "OKR", icon: Crosshair, suffix: "/modules" },
  { label: "Aksiyon", icon: Activity, suffix: "/actions" },
  { label: "Rapor", icon: ClipboardList, suffix: "/reports" },
];

/* ── Top nav items ── */
const topItems = [
  { label: "Merkez", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Strateji", icon: Target, path: "/strategy" },
  { label: "Analiz", icon: Brain, path: "/analysis" },
  { label: "Kararlar", icon: Scale, path: "/decision-lab" },
  { label: "Aksiyonlar", icon: Zap, path: "/action-center" },
];

/* ── Bottom nav items ── */
const bottomItems = [
  { label: "Raporlar", icon: FileText, path: "/reports" },
  { label: "Veri Kaynakları", icon: Database, path: "/data-sources" },
  { label: "Ayarlar", icon: SettingsIcon, path: "/settings" },
];

const statusDot: Record<string, string> = {
  Monitoring: "bg-emerald-500",
  "Running Task": "bg-blue-500",
  Idle: "bg-muted-foreground/40",
  Alerting: "bg-destructive",
};

const AppSidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [orgOpen, setOrgOpen] = useState(true);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [agentsOpen, setAgentsOpen] = useState(false);

  const isActive = useCallback((path: string) => {
    if (path === "/strategy") return location.pathname.startsWith("/strategy") || location.pathname === "/okr";
    if (path === "/action-center") return location.pathname.startsWith("/action-center") || location.pathname === "/tasks";
    if (path === "/data-sources") return location.pathname.startsWith("/data-sources") || location.pathname.startsWith("/tech-data-sources");
    if (path === "/reports") return location.pathname.startsWith("/reports");
    return location.pathname === path;
  }, [location.pathname]);

  const isDeptActive = useCallback((deptId: string) => {
    return location.pathname === `/departments/${deptId}` || location.pathname.startsWith(`/departments/${deptId}/`);
  }, [location.pathname]);

  const isDeptSubActive = useCallback((deptId: string, suffix: string) => {
    if (suffix === "") return location.pathname === `/departments/${deptId}`;
    return location.pathname === `/departments/${deptId}${suffix}`;
  }, [location.pathname]);

  const toggleDept = (deptId: string) => {
    setExpandedDept(prev => prev === deptId ? null : deptId);
  };

  if (isMobile) return null;

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-[290px] flex flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex items-center px-5 h-16 shrink-0">
        <Link to="/" className="flex items-center">
          <span className="text-[20px] font-semibold text-foreground" style={{ letterSpacing: "-0.04em", fontFamily: "'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif" }}>Metrion</span>
        </Link>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 sidebar-scroll">
        {/* Top items */}
        <div className="space-y-0.5">
          {topItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] transition-all duration-200 relative group ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] shrink-0 transition-colors ${active ? "text-primary" : "text-sidebar-foreground group-hover:text-foreground"}`} />
                <span className="font-semibold">{item.label}</span>
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-4 my-5 h-px bg-sidebar-border" />

        {/* Organizasyon section */}
        <div>
          <button
            onClick={() => setOrgOpen(!orgOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] font-semibold text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200"
          >
            <Network className="h-[18px] w-[18px] shrink-0 text-sidebar-foreground" />
            <span className="flex-1 text-left">Organizasyon</span>
            <motion.div
              animate={{ rotate: orgOpen ? 180 : 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {orgOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-1 space-y-0.5 pl-2">
                  {departments.map((dept) => {
                    const deptActive = isDeptActive(dept.id);
                    const isExpanded = expandedDept === dept.id;
                    const color = deptColors[dept.id] || "hsl(220, 100%, 56%)";

                    return (
                      <div key={dept.id}>
                        {/* Department row */}
                        <button
                          onClick={() => toggleDept(dept.id)}
                          className={`w-full flex items-center gap-2.5 pl-4 pr-3 rounded-xl transition-all duration-200 relative group ${
                            deptActive
                              ? "text-foreground bg-sidebar-accent"
                              : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
                          }`}
                          style={{ height: 42 }}
                        >
                          {/* Emoji prefix */}
                          <span className="text-[13px] shrink-0">{dept.icon}</span>
                          <span className={`flex-1 text-left text-[13px] ${deptActive ? "font-semibold" : "font-medium"}`}>
                            {dept.name}
                          </span>
                          {/* Health score bubble */}
                          <span
                            className="text-[10px] font-semibold tabular-nums px-2 py-0.5 mr-1"
                            style={{
                              borderRadius: "var(--radius-pill, 999px)",
                              background: dept.healthScore >= 80 ? "hsl(var(--success) / 0.12)" : dept.healthScore >= 70 ? "hsl(var(--warning) / 0.12)" : "hsl(var(--destructive) / 0.12)",
                              color: dept.healthScore >= 80 ? "hsl(var(--success))" : dept.healthScore >= 70 ? "hsl(var(--warning))" : "hsl(var(--destructive))",
                            }}
                          >{dept.healthScore}</span>
                          {/* Expand arrow */}
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.18 }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                            style={{ opacity: isExpanded ? 1 : undefined }}
                          >
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                          </motion.div>
                          {/* Active bar */}
                          {deptActive && (
                            <div
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                            />
                          )}
                        </button>

                        {/* Submenu */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="relative ml-7 mt-0.5 mb-1 pl-3 space-y-0.5">
                                {/* Vertical guide line */}
                                <div className="absolute left-0 top-1 bottom-1 w-px bg-sidebar-border" />
                                {deptSubItems.map((sub) => {
                                  const subPath = `/departments/${dept.id}${sub.suffix}`;
                                  const subActive = isDeptSubActive(dept.id, sub.suffix);
                                  return (
                                    <Link
                                      key={sub.suffix}
                                      to={subPath}
                                      className={`flex items-center gap-2.5 px-3 rounded-lg text-[12px] transition-all duration-150 ${
                                        subActive
                                          ? "text-primary bg-primary/10 font-semibold"
                                          : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
                                      }`}
                                      style={{ height: 36 }}
                                    >
                                      <sub.icon className={`h-3.5 w-3.5 shrink-0 ${subActive ? "text-primary" : "text-muted-foreground"}`} />
                                      <span>{sub.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ajanlar dropdown */}
        <div className="mt-1">
          <button
            onClick={() => setAgentsOpen(!agentsOpen)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] font-semibold transition-all duration-200 ${
              location.pathname.startsWith("/workspace") || location.pathname === "/kadro"
                ? "text-primary bg-primary/10"
                : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
            }`}
          >
            <Bot className="h-[18px] w-[18px] shrink-0 text-sidebar-foreground" />
            <span className="flex-1 text-left">Ajanlar</span>
            <span className="text-[10px] font-medium text-muted-foreground mr-1">{allExperts.length}</span>
            <motion.div
              animate={{ rotate: agentsOpen ? 180 : 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {agentsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-0.5 space-y-0.5 pl-2">
                  {allExperts.map((agent) => {
                    const isAgentActive = location.pathname === `/workspace/${agent.id}`;
                    return (
                      <Link
                        key={agent.id}
                        to={`/workspace/${agent.id}`}
                        className={`flex items-center gap-2.5 pl-4 pr-3 rounded-xl text-[12px] transition-all duration-200 relative ${
                          isAgentActive
                            ? "text-primary bg-primary/10 font-semibold"
                            : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent font-medium"
                        }`}
                        style={{ height: 36 }}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDot[agent.status] || "bg-muted-foreground/40"}`} />
                        <span className="truncate">{agent.name}</span>
                        {isAgentActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="mx-4 my-5 h-px bg-sidebar-border" />

        {/* Bottom items */}
        <div className="space-y-0.5">
          {bottomItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] transition-all duration-200 relative group ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className={`h-[16px] w-[16px] shrink-0 transition-colors ${active ? "text-primary" : "text-sidebar-foreground group-hover:text-foreground"}`} />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
                )}
              </Link>
            );
          })}

          {/* Ekibi Genişlet */}
          <Link
            to="/marketplace"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] transition-all duration-200 relative group ${
              location.pathname === "/marketplace"
                ? "text-primary bg-primary/10"
                : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
            }`}
          >
            <ShoppingBag className={`h-[16px] w-[16px] shrink-0 transition-colors ${location.pathname === "/marketplace" ? "text-primary" : "text-sidebar-foreground group-hover:text-foreground"}`} />
            <span className="font-medium">Ekibi Genişlet</span>
            {location.pathname === "/marketplace" && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
            )}
          </Link>
        </div>
      </nav>

      {/* Bottom user */}
      <div className="px-4 py-3 shrink-0 border-t border-sidebar-border">
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
  );
};

export default AppSidebar;
