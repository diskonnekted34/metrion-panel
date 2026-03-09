import { useState } from "react";
import { Bell, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePacks } from "@/contexts/PackContext";
import { alertsData } from "@/data/alerts";
import NotificationPanel from "@/components/NotificationPanel";
import ViewModeSwitcher from "@/components/ViewModeSwitcher";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardHeader = () => {
  const { currentUser } = useRBAC();
  const { isTrial, trialDaysRemaining } = usePacks();
  const isMobile = useIsMobile();
  const [notifOpen, setNotifOpen] = useState(false);
  const criticalCount = alertsData.filter(a => a.category === "critical" && !a.resolved).length;

  if (isMobile) {
    return (
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Komuta</h1>
        <p className="text-sm text-muted-foreground">Stratejik istihbarat · Öncelikli kararlar</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Komuta</h1>
          <p className="text-muted-foreground text-sm">Stratejik karar merkezi · Kontrollü otomasyon · Sürekli güncellenen zekâ</p>
        </div>

        <div className="flex items-center gap-3">
          <ViewModeSwitcher />

          <button
            onClick={() => setNotifOpen(true)}
            className="relative p-2.5 rounded-xl bg-secondary/60 hover:bg-secondary transition-colors"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            {criticalCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center animate-pulse">
                {criticalCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/60">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{currentUser.name.charAt(0)}</span>
            </div>
            <span className="text-xs font-medium text-foreground">{currentUser.name}</span>
          </div>
        </div>
      </div>

      {isTrial && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-warning/10 border border-warning/15 mb-6">
          <Clock className="h-4 w-4 text-warning shrink-0" />
          <span className="text-xs font-medium text-warning">Deneme: {trialDaysRemaining} gün kaldı</span>
          <span className="text-[10px] text-muted-foreground ml-1">— Tüm özelliklere tam erişim.</span>
        </div>
      )}

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
};

export default DashboardHeader;
