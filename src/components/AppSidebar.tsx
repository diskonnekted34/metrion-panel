import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ListTodo, Bell, BarChart3, Store, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { label: "Genel Bakış", icon: LayoutDashboard, path: "/dashboard" },
  { label: "AI Ekibim", icon: Users, path: "/team" },
  { label: "Görevler", icon: ListTodo, path: "/tasks" },
  { label: "Uyarılar", icon: Bell, path: "/alerts" },
  { label: "Raporlar", icon: BarChart3, path: "/reports" },
  { label: "Pazar Yeri", icon: Store, path: "/marketplace" },
  { label: "Ayarlar", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-[220px] flex flex-col glass-strong border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-2xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">C</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">C-Levels</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === "/team" && location.pathname.startsWith("/workspace"));
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
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" style={{ boxShadow: "0 0 8px rgba(76,141,255,0.4)" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-5 py-4 border-t border-border">
        <Link to="/pricing" className="btn-primary w-full text-center block px-4 py-2.5 text-sm">
          Planları Gör
        </Link>
      </div>
    </aside>
  );
};

export default AppSidebar;
