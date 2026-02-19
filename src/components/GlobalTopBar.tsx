import { useState, useRef, useEffect } from "react";
import { Bell, Sun, Moon, User, Settings, LogOut, Building2, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { usePageMeta } from "@/contexts/PageMetaContext";
import { useRBAC } from "@/contexts/RBACContext";
import { alertsData } from "@/data/alerts";
import NotificationPanel from "@/components/NotificationPanel";
import ViewModeSwitcher from "@/components/ViewModeSwitcher";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const GlobalTopBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { meta } = usePageMeta();
  const { currentUser } = useRBAC();
  const isMobile = useIsMobile();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  const criticalCount = alertsData.filter(
    (a) => a.category === "critical" && !a.resolved
  ).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isMobile) return null;

  return (
    <>
      <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-border glass-strong">
        {/* Left — page title */}
        <div className="flex flex-col justify-center min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate leading-tight">
            {meta.title}
          </h1>
          {meta.subtitle && (
            <p className="text-xs text-muted-foreground truncate leading-tight">
              {meta.subtitle}
            </p>
          )}
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2 shrink-0">
          <ViewModeSwitcher />

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className="relative p-2 rounded-xl bg-secondary/60 hover:bg-secondary transition-all duration-200 group"
                aria-label={theme === "dark" ? "Light Mode" : "Dark Mode"}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-muted-foreground group-hover:text-warning transition-colors" />
                ) : (
                  <Moon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setNotifOpen(true)}
                className="relative p-2 rounded-xl bg-secondary/60 hover:bg-secondary transition-colors"
                aria-label="Bildirimler"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                {criticalCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {criticalCount}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Bildirimler</p>
            </TooltipContent>
          </Tooltip>

          {/* User dropdown */}
          <div ref={userRef} className="relative">
            <button
              onClick={() => setUserOpen(!userOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/60 hover:bg-secondary transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {currentUser.name.charAt(0)}
                </span>
              </div>
              <span className="text-xs font-medium text-foreground max-w-[100px] truncate">
                {currentUser.name}
              </span>
              <ChevronDown
                className={`h-3 w-3 text-muted-foreground transition-transform ${userOpen ? "rotate-180" : ""}`}
              />
            </button>

            {userOpen && (
              <div className="absolute top-full mt-1 right-0 glass-strong rounded-2xl border border-border py-2 min-w-[200px] shadow-xl z-50">
                <div className="px-4 py-2.5 border-b border-border">
                  <p className="text-sm font-medium text-foreground">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <User className="h-4 w-4 text-muted-foreground" /> Profil
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" /> Hesap
                  Ayarları
                </Link>
                <button
                  onClick={() => setUserOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Building2 className="h-4 w-4 text-muted-foreground" />{" "}
                  Workspace
                </button>
                <div className="h-px bg-border mx-3 my-1" />
                <button
                  onClick={() => setUserOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Çıkış
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
    </>
  );
};

export default GlobalTopBar;
