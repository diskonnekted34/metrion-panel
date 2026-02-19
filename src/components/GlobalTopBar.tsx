import { useState, useRef, useEffect } from "react";
import {
  Bell, Sun, Moon, User, Settings, LogOut, Building2,
  ChevronDown, Monitor, HelpCircle, MessageSquare,
  ArrowRightLeft, X, Check, Search, Globe,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { usePageMeta } from "@/contexts/PageMetaContext";
import { useRBAC } from "@/contexts/RBACContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { alertsData } from "@/data/alerts";
import NotificationPanel from "@/components/NotificationPanel";
import CommandPalette from "@/components/CommandPalette";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

/* ── Breadcrumb map ── */
const getBreadcrumb = (pathname: string, lang: "tr" | "en") => {
  const labels: Record<string, Record<string, string>> = {
    tr: {
      "/departments": "Departmanlar",
      "/tech-data-sources": "Teknoloji Veri Kaynakları",
      "/data-sources": "Veri Kaynakları",
      "/alerts": "Uyarılar",
      "/reports": "Raporlar",
      "/team": "Ekip",
      "/kadro": "Kadro",
      "/dashboard": "Komuta",
    },
    en: {
      "/departments": "Departments",
      "/tech-data-sources": "Tech Data Sources",
      "/data-sources": "Data Sources",
      "/alerts": "Alerts",
      "/reports": "Reports",
      "/team": "Team",
      "/kadro": "Workforce",
      "/dashboard": "Command Center",
    },
  };
  const l = labels[lang];

  const patterns: [string, string, string][] = [
    ["/departments/", "/departments", l["/departments"]],
    ["/tech-data-sources/", "/tech-data-sources", l["/tech-data-sources"]],
    ["/data-sources/", "/data-sources", l["/data-sources"]],
    ["/alerts/", "/alerts", l["/alerts"]],
    ["/reports/", "/reports", l["/reports"]],
    ["/expert/", "/team", l["/team"]],
    ["/workspace/", "/kadro", l["/kadro"]],
    ["/intelligence/", "/dashboard", l["/dashboard"]],
  ];

  for (const [prefix, parent, parentLabel] of patterns) {
    if (pathname.startsWith(prefix) && pathname !== parent) {
      return { parent, parentLabel };
    }
  }
  return null;
};

const GlobalTopBar = () => {
  const { theme, themeChoice, setThemeChoice, toggleTheme } = useTheme();
  const { meta } = usePageMeta();
  const { currentUser } = useRBAC();
  const { lang, setLang, t } = useLanguage();
  const tb = t.topBar;
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [themeSubOpen, setThemeSubOpen] = useState(false);
  const [switchWsOpen, setSwitchWsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [signOutConfirm, setSignOutConfirm] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);

  const criticalCount = alertsData.filter(a => a.category === "critical" && !a.resolved).length;
  const breadcrumb = getBreadcrumb(location.pathname, lang);

  // ⌘K / Ctrl+K global handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
        setThemeSubOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setUserOpen(false);
    setThemeSubOpen(false);
  }, [location.pathname]);

  if (isMobile) return null;

  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  const shortcutLabel = isMac ? "⌘K" : "Ctrl K";

  return (
    <>
      <header className="sticky top-0 z-30 h-[72px] flex items-center justify-between px-6 border-b border-border/50 bg-transparent backdrop-blur-[2px]">
        {/* Left — breadcrumb + title */}
        <div className="flex flex-col justify-center min-w-0">
          {breadcrumb && (
            <div className="flex items-center gap-1 mb-0.5">
              <Link
                to={breadcrumb.parent}
                className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
              >
                {breadcrumb.parentLabel}
              </Link>
              <span className="text-[11px] text-muted-foreground/50">/</span>
            </div>
          )}
          <h1 className="text-[22px] font-semibold text-foreground truncate leading-tight tracking-[-0.02em]">
            {meta.title}
          </h1>
          {meta.subtitle && (
            <p className="text-[12px] text-muted-foreground/70 truncate mt-0.5 max-w-[400px]">
              {meta.subtitle}
            </p>
          )}
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Search bar */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/40 hover:bg-secondary/60 border border-border/40 transition-all group min-w-[180px] lg:min-w-[220px]"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-[12px] text-muted-foreground/60 flex-1 text-left truncate hidden md:block">
              {tb.searchShort}
            </span>
            <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background/50 text-[10px] text-muted-foreground border border-border/60 font-mono">
              {shortcutLabel}
            </kbd>
          </button>

          {/* Language switch */}
          <div className="flex items-center rounded-xl border border-border/40 overflow-hidden">
            {(["tr", "en"] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-2 text-[11px] font-semibold uppercase transition-all ${
                  lang === l
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className="relative p-2.5 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                aria-label={theme === "dark" ? tb.themeLight : tb.themeDark}
              >
                {theme === "dark" ? (
                  <Sun className="h-[18px] w-[18px] text-muted-foreground group-hover:text-amber-400 transition-colors duration-200" />
                ) : (
                  <Moon className="h-[18px] w-[18px] text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{theme === "dark" ? tb.themeLight : tb.themeDark}</p>
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setNotifOpen(true)}
                className="relative p-2.5 rounded-xl hover:bg-secondary/60 transition-colors"
                aria-label={tb.notifications}
              >
                <Bell className="h-[18px] w-[18px] text-muted-foreground" />
                {criticalCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                    {criticalCount}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{tb.notifications}</p>
            </TooltipContent>
          </Tooltip>

          {/* User menu */}
          <div ref={userRef} className="relative">
            <button
              onClick={() => setUserOpen(!userOpen)}
              className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-secondary/60 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center ring-1 ring-primary/20">
                <span className="text-xs font-bold text-primary">
                  {currentUser.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground max-w-[120px] truncate hidden md:block">
                {currentUser.name}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${userOpen ? "rotate-180" : ""}`}
              />
            </button>

            {userOpen && (
              <div className="absolute top-full mt-2 right-0 bg-popover rounded-xl border border-border py-1.5 min-w-[240px] shadow-xl z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>

                {/* Account */}
                <div className="py-1">
                  <p className="px-4 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{tb.account}</p>
                  <MenuLink to="/settings" icon={User} label={tb.profileLink} onClose={() => setUserOpen(false)} />
                  <MenuLink to="/settings" icon={Settings} label={tb.accountSettings} onClose={() => setUserOpen(false)} />
                </div>

                <div className="h-px bg-border mx-3" />

                {/* Workspace */}
                <div className="py-1">
                  <p className="px-4 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{tb.workspace}</p>
                  <MenuLink to="/settings" icon={Building2} label={tb.workspaceSettings} onClose={() => setUserOpen(false)} />
                  <MenuButton
                    icon={ArrowRightLeft}
                    label={tb.switchWorkspace}
                    onClick={() => { setSwitchWsOpen(true); setUserOpen(false); }}
                  />
                </div>

                <div className="h-px bg-border mx-3" />

                {/* Preferences */}
                <div className="py-1">
                  <p className="px-4 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{tb.preferences}</p>
                  <div className="relative">
                    <MenuButton
                      icon={theme === "dark" ? Moon : Sun}
                      label={tb.theme}
                      rightLabel={themeChoice === "dark" ? tb.themeDark : themeChoice === "light" ? tb.themeLight : tb.themeSystem}
                      onClick={() => setThemeSubOpen(!themeSubOpen)}
                    />
                    {themeSubOpen && (
                      <div className="ml-4 mr-3 mb-1 rounded-lg border border-border bg-popover overflow-hidden">
                        {([
                          { key: "light" as const, label: tb.themeLight, icon: Sun },
                          { key: "dark" as const, label: tb.themeDark, icon: Moon },
                          { key: "system" as const, label: tb.themeSystem, icon: Monitor },
                        ]).map(opt => (
                          <button
                            key={opt.key}
                            onClick={() => { setThemeChoice(opt.key); setThemeSubOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                              themeChoice === opt.key ? "text-primary bg-primary/5" : "text-foreground hover:bg-secondary/60"
                            }`}
                          >
                            <opt.icon className="h-3.5 w-3.5" />
                            <span>{opt.label}</span>
                            {themeChoice === opt.key && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <MenuButton
                    icon={Globe}
                    label={tb.language}
                    rightLabel={lang.toUpperCase()}
                    onClick={() => { setLang(lang === "tr" ? "en" : "tr"); }}
                  />
                </div>

                <div className="h-px bg-border mx-3" />

                {/* Help */}
                <div className="py-1">
                  <p className="px-4 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{tb.help}</p>
                  <MenuButton icon={HelpCircle} label={tb.helpCenter} onClick={() => { toast.info(lang === "tr" ? "Yardım merkezi yakında açılacak." : "Help center coming soon."); setUserOpen(false); }} />
                  <MenuButton icon={MessageSquare} label={tb.contactSupport} onClick={() => { setContactOpen(true); setUserOpen(false); }} />
                </div>

                <div className="h-px bg-border mx-3" />

                {/* Sign out */}
                <div className="py-1">
                  <button
                    onClick={() => { setSignOutConfirm(true); setUserOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> {tb.signOut}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Notification Panel */}
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />

      {/* Switch Workspace Modal */}
      {switchWsOpen && (
        <ModalOverlay onClose={() => setSwitchWsOpen(false)}>
          <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">{tb.switchWsTitle}</h2>
              <button onClick={() => setSwitchWsOpen(false)} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-1.5">
              {["Acme Corp", "Beta Labs", "Startup Inc"].map(ws => (
                <button
                  key={ws}
                  onClick={() => { toast.success(`${tb.switchedTo} "${ws}".`); setSwitchWsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-secondary/60 transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {ws.charAt(0)}
                  </div>
                  {ws}
                </button>
              ))}
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Contact Support Modal */}
      {contactOpen && <ContactModal tb={tb} onClose={() => setContactOpen(false)} />}

      {/* Sign Out Confirm */}
      {signOutConfirm && (
        <ModalOverlay onClose={() => setSignOutConfirm(false)}>
          <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-xs shadow-2xl text-center">
            <LogOut className="h-8 w-8 text-destructive mx-auto mb-3" />
            <h2 className="text-base font-semibold text-foreground mb-1">{tb.signOutConfirmTitle}</h2>
            <p className="text-xs text-muted-foreground mb-5">{tb.signOutConfirmDesc}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setSignOutConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
              >
                {tb.cancel}
              </button>
              <button
                onClick={() => { toast.success(tb.sessionClosed); setSignOutConfirm(false); navigate("/"); }}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors"
              >
                {tb.exit}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </>
  );
};

/* ── Helpers ── */

const MenuLink = ({ to, icon: Icon, label, onClose }: { to: string; icon: any; label: string; onClose: () => void }) => (
  <Link
    to={to}
    onClick={onClose}
    className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary/60 transition-colors"
  >
    <Icon className="h-4 w-4 text-muted-foreground" /> {label}
  </Link>
);

const MenuButton = ({ icon: Icon, label, onClick, rightLabel }: { icon: any; label: string; onClick: () => void; rightLabel?: string }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary/60 transition-colors"
  >
    <Icon className="h-4 w-4 text-muted-foreground" />
    <span>{label}</span>
    {rightLabel && <span className="ml-auto text-[10px] text-muted-foreground">{rightLabel}</span>}
  </button>
);

const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
    <div className="relative z-10">{children}</div>
  </div>
);

const ContactModal = ({ tb, onClose }: { tb: any; onClose: () => void }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">{tb.contactTitle}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{tb.subject}</label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder={tb.subjectPlaceholder}
              className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{tb.message}</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={tb.messagePlaceholder}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>
          <button
            onClick={() => { toast.success(tb.supportSent); onClose(); }}
            disabled={!subject.trim() || !message.trim()}
            className="w-full py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {tb.send}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default GlobalTopBar;
