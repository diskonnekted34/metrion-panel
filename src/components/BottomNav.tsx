import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Bell, ListTodo, Users, BarChart3, Store } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const bottomItems = [
  { label: "Genel Bakış", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Uyarılar", icon: Bell, path: "/alerts" },
  { label: "Görevler", icon: ListTodo, path: "/tasks" },
  { label: "Ekip", icon: Users, path: "/team" },
  { label: "Raporlar", icon: BarChart3, path: "/reports" },
];

const BottomNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isMobile) return null;

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-12 glass-strong border-b border-border flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-2xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-[10px] font-bold">C</span>
          </div>
          <span className="text-sm font-semibold text-foreground">C-Levels</span>
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-2xl hover:bg-secondary transition-colors relative"
        >
          <Store className="h-5 w-5 text-muted-foreground" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-4 top-11 z-50 glass-strong rounded-2xl border border-border py-2 min-w-[160px] shadow-xl">
              <Link to="/marketplace" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary">
                <Store className="h-4 w-4 text-muted-foreground" /> Pazar Yeri
              </Link>
              <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary">
                <BarChart3 className="h-4 w-4 text-muted-foreground" /> Ayarlar
              </Link>
              <Link to="/pricing" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary">
                <BarChart3 className="h-4 w-4 text-muted-foreground" /> Fiyatlandırma
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14">
          {bottomItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-1 w-5 h-[2px] rounded-full bg-primary" style={{ boxShadow: "0 0 6px rgba(76,141,255,0.4)" }} />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
