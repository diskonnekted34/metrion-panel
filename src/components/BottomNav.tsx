import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Target, Scale, Zap, Crown, Bell } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationPanel from "./NotificationPanel";
import { alertsData } from "@/data/alerts";

const bottomItems = [
  { label: "Merkez", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Strateji", icon: Target, path: "/strategy" },
  { label: "Kararlar", icon: Scale, path: "/decision-lab" },
  { label: "Operasyon", icon: Zap, path: "/action-center" },
  { label: "Kadro", icon: Crown, path: "/kadro" },
];

const BottomNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [notifOpen, setNotifOpen] = useState(false);

  const criticalCount = alertsData.filter((a) => a.category === "critical" && !a.resolved).length;

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
          onClick={() => setNotifOpen(true)}
          className="relative p-2 rounded-2xl hover:bg-secondary transition-colors"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {criticalCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-destructive text-destructive-foreground text-[8px] font-bold flex items-center justify-center">
              {criticalCount}
            </span>
          )}
        </button>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14">
          {bottomItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
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
              </Link>
            );
          })}
        </div>
      </nav>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
};

export default BottomNav;
