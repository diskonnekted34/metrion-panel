import { useState, useRef, useEffect } from "react";
import {
  Bell, Sun, Moon, User, Settings, LogOut, Building2,
  ChevronDown, Monitor, HelpCircle, MessageSquare,
  ArrowRightLeft, X, Check,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { usePageMeta } from "@/contexts/PageMetaContext";
import { useRBAC } from "@/contexts/RBACContext";
import { alertsData } from "@/data/alerts";
import NotificationPanel from "@/components/NotificationPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

/* ── Breadcrumb map ── */
const breadcrumbMap: Record<string, { parent?: string; label: string }> = {
  "/dashboard": { label: "Komuta" },
  "/decision-lab": { label: "Karar Merkezi" },
  "/action-center": { label: "Aksiyon Merkezi" },
  "/kadro": { label: "Kadro" },
  "/okr": { label: "OKR" },
  "/tasks": { label: "Görevler" },
  "/reports": { label: "Raporlar" },
  "/alerts": { label: "Uyarılar" },
  "/departments": { label: "Departmanlar" },
  "/team": { label: "Ekip" },
  "/marketplace": { label: "Pazar Yeri" },
  "/settings": { label: "Ayarlar" },
  "/data-sources": { label: "Veri Kaynakları" },
  "/tech-data-sources": { label: "Teknoloji Veri Kaynakları" },
  "/pricing": { label: "Fiyatlandırma" },
  "/creative-workspace": { label: "Kreatif Çalışma Alanı" },
};

const getBreadcrumb = (pathname: string) => {
  // Root pages — no breadcrumb
  if (breadcrumbMap[pathname]) return null;

  // Dynamic sub-pages
  if (pathname.startsWith("/departments/")) return { parent: "/departments", parentLabel: "Departmanlar" };
  if (pathname.startsWith("/tech-data-sources/")) return { parent: "/tech-data-sources", parentLabel: "Teknoloji Veri Kaynakları" };
  if (pathname.startsWith("/data-sources/")) return { parent: "/data-sources", parentLabel: "Veri Kaynakları" };
  if (pathname.startsWith("/alerts/")) return { parent: "/alerts", parentLabel: "Uyarılar" };
  if (pathname.startsWith("/reports/")) return { parent: "/reports", parentLabel: "Raporlar" };
  if (pathname.startsWith("/expert/")) return { parent: "/team", parentLabel: "Ekip" };
  if (pathname.startsWith("/workspace/")) return { parent: "/kadro", parentLabel: "Kadro" };
  if (pathname.startsWith("/intelligence/")) return { parent: "/dashboard", parentLabel: "Komuta" };

  return null;
};

const GlobalTopBar = () => {
  const { theme, themeChoice, setThemeChoice, toggleTheme } = useTheme();
  const { meta } = usePageMeta();
  const { currentUser } = useRBAC();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [themeSubOpen, setThemeSubOpen] = useState(false);
  const [switchWsOpen, setSwitchWsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [signOutConfirm, setSignOutConfirm] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);

  const criticalCount = alertsData.filter(a => a.category === "critical" && !a.resolved).length;
  const breadcrumb = getBreadcrumb(location.pathname);

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

  // Close dropdown on route change
  useEffect(() => {
    setUserOpen(false);
    setThemeSubOpen(false);
  }, [location.pathname]);

  if (isMobile) return null;

  const themeChoiceLabel = themeChoice === "dark" ? "Koyu" : themeChoice === "light" ? "Açık" : "Sistem";

  return (
    <>
      <header className="sticky top-0 z-30 h-[72px] flex items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-sm">
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
          <h1 className="text-xl font-semibold text-foreground truncate leading-tight tracking-[-0.01em]">
            {meta.title}
          </h1>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Theme toggle pill */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className="relative p-2.5 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                aria-label={theme === "dark" ? "Açık Mod" : "Koyu Mod"}
              >
                {theme === "dark" ? (
                  <Sun className="h-[18px] w-[18px] text-muted-foreground group-hover:text-amber-400 transition-colors duration-200" />
                ) : (
                  <Moon className="h-[18px] w-[18px] text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{theme === "dark" ? "Açık Mod" : "Koyu Mod"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setNotifOpen(true)}
                className="relative p-2.5 rounded-xl hover:bg-secondary/60 transition-colors"
                aria-label="Bildirimler"
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
              <p className="text-xs">Bildirimler</p>
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
                  <p className="px-4 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Hesap</p>
                  <MenuLink to="/settings" icon={User} label="Profil" onClose={() => setUserOpen(false)} />
                  <MenuLink to="/settings" icon={Settings} label="Hesap Ayarları" onClose={() => setUserOpen(false)} />
                </div>

                <div className="h-px bg-border mx-3" />

                {/* Workspace */}
                <div className="py-1">
                  <p className="px-4 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Workspace</p>
                  <MenuLink to="/settings" icon={Building2} label="Workspace Ayarları" onClose={() => setUserOpen(false)} />
                  <MenuButton
                    icon={ArrowRightLeft}
                    label="Workspace Değiştir"
                    onClick={() => { setSwitchWsOpen(true); setUserOpen(false); }}
                  />
                </div>

                <div className="h-px bg-border mx-3" />

                {/* Preferences */}
                <div className="py-1">
                  <p className="px-4 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Tercihler</p>
                  <div className="relative">
                    <MenuButton
                      icon={theme === "dark" ? Moon : Sun}
                      label="Tema"
                      rightLabel={themeChoiceLabel}
                      onClick={() => setThemeSubOpen(!themeSubOpen)}
                    />
                    {themeSubOpen && (
                      <div className="ml-4 mr-3 mb-1 rounded-lg border border-border bg-popover overflow-hidden">
                        {([
                          { key: "light" as const, label: "Açık", icon: Sun },
                          { key: "dark" as const, label: "Koyu", icon: Moon },
                          { key: "system" as const, label: "Sistem", icon: Monitor },
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
                </div>

                <div className="h-px bg-border mx-3" />

                {/* Help */}
                <div className="py-1">
                  <p className="px-4 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Yardım</p>
                  <MenuButton icon={HelpCircle} label="Yardım Merkezi" onClick={() => { toast.info("Yardım merkezi yakında açılacak."); setUserOpen(false); }} />
                  <MenuButton icon={MessageSquare} label="Destek İletişimi" onClick={() => { setContactOpen(true); setUserOpen(false); }} />
                </div>

                <div className="h-px bg-border mx-3" />

                {/* Sign out */}
                <div className="py-1">
                  <button
                    onClick={() => { setSignOutConfirm(true); setUserOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />

      {/* Switch Workspace Modal */}
      {switchWsOpen && (
        <ModalOverlay onClose={() => setSwitchWsOpen(false)}>
          <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">Workspace Değiştir</h2>
              <button onClick={() => setSwitchWsOpen(false)} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-1.5">
              {["Acme Corp", "Beta Labs", "Startup Inc"].map(ws => (
                <button
                  key={ws}
                  onClick={() => { toast.success(`"${ws}" workspace'ine geçildi.`); setSwitchWsOpen(false); }}
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
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}

      {/* Sign Out Confirm */}
      {signOutConfirm && (
        <ModalOverlay onClose={() => setSignOutConfirm(false)}>
          <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-xs shadow-2xl text-center">
            <LogOut className="h-8 w-8 text-destructive mx-auto mb-3" />
            <h2 className="text-base font-semibold text-foreground mb-1">Çıkış Yap</h2>
            <p className="text-xs text-muted-foreground mb-5">Oturumunuz sonlandırılacak.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setSignOutConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => { toast.success("Oturum kapatıldı."); setSignOutConfirm(false); navigate("/"); }}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors"
              >
                Çıkış
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

const ContactModal = ({ onClose }: { onClose: () => void }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Destek İletişimi</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Konu</label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Konu başlığı"
              className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Mesaj</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>
          <button
            onClick={() => { toast.success("Destek talebi gönderildi."); onClose(); }}
            disabled={!subject.trim() || !message.trim()}
            className="w-full py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Gönder
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default GlobalTopBar;
