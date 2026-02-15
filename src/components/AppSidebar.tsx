import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ListTodo, Bell, BarChart3, Store, Settings, Building2, Database, Zap, Palette } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationPanel from "./NotificationPanel";
import ViewModeSwitcher from "./ViewModeSwitcher";
import { alertsData } from "@/data/alerts";

const navItems = [
  { label: "Genel Bakış", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Departmanlar", icon: Building2, path: "/departments" },
  { label: "AI Ekibim", icon: Users, path: "/team" },
  { label: "Görevler", icon: ListTodo, path: "/tasks" },
  { label: "Uyarılar", icon: Bell, path: "/alerts" },
  { label: "Raporlar", icon: BarChart3, path: "/reports" },
  { label: "Pazar Yeri", icon: Store, path: "/marketplace" },
  { label: "Veri Kaynakları", icon: Database, path: "/data-sources" },
  { label: "Aksiyon Merkezi", icon: Zap, path: "/action-center" },
  { label: "Kreatif Çalışma Alanı", icon: Palette, path: "/creative-workspace" },
  { label: "Ayarlar", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [notifOpen, setNotifOpen] = useState(false);

  const criticalCount = alertsData.filter((a) => a.category === "critical" && !a.resolved).length;

  if (isMobile) return null;

  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 z-40 w-[220px] flex flex-col glass-strong border-r border-border">
        {/* Logo + Bell */}
        <div className="flex items-center justify-between px-5 h-16 shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-2xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">C</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">C-Levels</span>
          </Link>
          <button
            onClick={() => setNotifOpen(true)}
            className="relative p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            {criticalCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                {criticalCount}
              </span>
            )}
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="px-3 pb-3">
          <ViewModeSwitcher />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
              || (item.path === "/team" && location.pathname.startsWith("/workspace"))
              || (item.path === "/alerts" && location.pathname.startsWith("/alerts/"))
              || (item.path === "/departments" && location.pathname.startsWith("/departments/"));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all duration-200 group relative ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-primary" : ""}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" style={{ boxShadow: "0 0 12px rgba(30,107,255,0.5)" }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-5 py-4 border-t border-border">
          <Link to="/marketplace" className="btn-primary w-full text-center block px-4 py-2.5 text-sm">
            İş Gücünü Genişlet
          </Link>
        </div>
      </aside>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
};

export default AppSidebar;
