import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Database, Plug, RefreshCw, Shield, CheckCircle2, AlertCircle,
  Loader2, Lock, X, Eye, Pencil, Zap, Clock, ExternalLink, Globe, Settings2,
  Activity, Gauge, AlertTriangle, Radio, Webhook, FileJson, RotateCcw,
  Play, ChevronRight, Copy, Download, Trash2, BarChart3, Brain, Building2,
  Users, Server, Key, ShieldCheck, FileText, CalendarClock, Timer, Hash,
  Signal, CircleDot, TrendingUp, Cpu, ChevronDown
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useIntegrations } from "@/contexts/IntegrationContext";
import { useRBAC } from "@/contexts/RBACContext";
import { usePacks } from "@/contexts/PackContext";
import { useActionMode } from "@/contexts/ActionModeContext";
import { Integration, IntegrationStatus, hasWriteCapabilities } from "@/data/integrations";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// ── Status config ──
type ExtendedStatus = IntegrationStatus | "oauth_pending" | "token_expired" | "limited";

const statusConfig: Record<ExtendedStatus, { label: string; color: string; glow: string; bg: string }> = {
  connected:     { label: "Connected",        color: "text-success",          glow: "glow-success", bg: "badge-success" },
  syncing:       { label: "Syncing",          color: "text-warning",          glow: "glow-warning", bg: "badge-warning" },
  error:         { label: "Error",            color: "text-destructive",      glow: "glow-error",   bg: "badge-error" },
  not_connected: { label: "Not Connected",    color: "text-muted-foreground", glow: "",             bg: "badge-neutral" },
  oauth_pending: { label: "OAuth Pending",    color: "text-warning",          glow: "glow-warning", bg: "badge-warning" },
  token_expired: { label: "Token Expired",    color: "text-destructive",      glow: "glow-error",   bg: "badge-error" },
  limited:       { label: "Limited (Plan)",   color: "text-warning",          glow: "glow-warning", bg: "badge-warning" },
};

// ── Mock data generators ──
const mockSyncJobs = [
  { id: "SJ-2847", startedAt: "2026-02-19T08:30:00Z", duration: "12s", records: 1847, status: "success" as const, traceId: "tr-a8f2c1" },
  { id: "SJ-2846", startedAt: "2026-02-19T02:30:00Z", duration: "14s", records: 1832, status: "success" as const, traceId: "tr-b3d4e2" },
  { id: "SJ-2845", startedAt: "2026-02-18T20:30:00Z", duration: "8s",  records: 1821, status: "success" as const, traceId: "tr-c5f6a3" },
  { id: "SJ-2844", startedAt: "2026-02-18T14:30:00Z", duration: "45s", records: 0,    status: "error" as const,   traceId: "tr-d7e8b4" },
  { id: "SJ-2843", startedAt: "2026-02-18T08:30:00Z", duration: "11s", records: 1799, status: "success" as const, traceId: "tr-e9f0c5" },
];

const mockWebhookEvents = [
  { event: "orders/create", receivedAt: "2026-02-19T09:12:33Z", status: 200, traceId: "wh-x1y2z3" },
  { event: "products/update", receivedAt: "2026-02-19T09:10:11Z", status: 200, traceId: "wh-a4b5c6" },
  { event: "inventory_levels/update", receivedAt: "2026-02-19T09:08:45Z", status: 500, traceId: "wh-d7e8f9" },
];

// ── Section Header ──
const SectionHeader = ({ icon: Icon, title, badge }: { icon: typeof Shield; title: string; badge?: string }) => (
  <div className="sticky top-0 z-10 flex items-center gap-2.5 py-3 px-1 bg-background/80 backdrop-blur-xl border-b border-border mb-4">
    <Icon className="h-4 w-4 text-primary" />
    <h2 className="text-sm font-semibold text-foreground tracking-wide">{title}</h2>
    {badge && <span className="badge-info text-[9px] font-semibold px-2 py-0.5 rounded-full">{badge}</span>}
  </div>
);

// ── Glass Panel ──
const GlassPanel = ({ children, className = "", error = false }: { children: React.ReactNode; className?: string; error?: boolean }) => (
  <div className={`glass-card p-5 ${error ? "border-destructive/30 glow-error" : ""} ${className}`}>
    {children}
  </div>
);

// ── Scope Row ──
const ScopeRow = ({ label, access, risk }: { label: string; access: string; risk: "low" | "medium" | "high" }) => (
  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-primary/20 transition-colors">
    <div className="flex items-center gap-2">
      {risk === "high" ? <AlertTriangle className="h-3 w-3 text-destructive" /> :
       risk === "medium" ? <AlertTriangle className="h-3 w-3 text-warning" /> :
       <Eye className="h-3 w-3 text-muted-foreground" />}
      <span className="text-xs text-foreground">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground">{access}</span>
      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
        risk === "high" ? "badge-error" : risk === "medium" ? "badge-warning" : "badge-neutral"
      }`}>
        {risk === "high" ? "High Risk" : risk === "medium" ? "Medium Risk" : "Low Risk"}
      </span>
    </div>
  </div>
);

// ── Metric Chip ──
const MetricChip = ({ icon: Icon, label, value, pulse }: { icon: typeof Clock; label: string; value: string; pulse?: boolean }) => (
  <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] relative overflow-hidden">
    {pulse && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-success animate-pulse" />}
    <div className="flex items-center gap-1.5">
      <Icon className="h-3 w-3 text-muted-foreground" />
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-sm font-semibold text-foreground">{value}</span>
  </div>
);

// ── Drawer Panel ──
const DrawerPanel = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-full max-w-lg z-50 glass-strong border-l border-border overflow-y-auto"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-xl border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-secondary transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="p-5">{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ── Confirm Modal ──
const ConfirmModal = ({ open, onClose, onConfirm, title, description, danger }: {
  open: boolean; onClose: () => void; onConfirm: (reason: string) => void;
  title: string; description: string; danger?: boolean;
}) => {
  const [reason, setReason] = useState("");
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`glass-card w-full max-w-md p-6 space-y-4 ${danger ? "border-destructive/30" : ""}`}>
              <h3 className={`text-base font-semibold ${danger ? "text-destructive" : "text-foreground"}`}>{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
              <input
                value={reason} onChange={e => setReason(e.target.value)}
                placeholder="Sebep giriniz..."
                className="w-full px-3 py-2 rounded-xl bg-secondary/60 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-secondary transition-colors">İptal</button>
                <button
                  onClick={() => { onConfirm(reason); setReason(""); }}
                  disabled={!reason.trim()}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-40 ${
                    danger ? "bg-destructive text-white hover:bg-destructive/80" : "btn-primary"
                  }`}
                >Onayla</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════
const IntegrationDetail = () => {
  const { integrationId } = useParams<{ integrationId: string }>();
  const navigate = useNavigate();
  const { integrations, connect, disconnect, syncManual, isConnected, getDataHealth, isWriteEnabled, toggleWriteAccess } = useIntegrations();
  const { canPerform, currentUser } = useRBAC();
  const { activeTier } = usePacks();
  const { isActionModeEnabled, toggleActionMode } = useActionMode();

  // All hooks must be before any early return
  const [syncMode, setSyncMode] = useState("24h");
  const [dataWindow, setDataWindow] = useState("90d");
  const [syncPriority, setSyncPriority] = useState("normal");
  const [storeDomain, setStoreDomain] = useState("");
  const [environment, setEnvironment] = useState<"production" | "sandbox">("production");
  const [jobDrawer, setJobDrawer] = useState<typeof mockSyncJobs[0] | null>(null);
  const [webhookDrawer, setWebhookDrawer] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [mappedDepts, setMappedDepts] = useState<string[]>(["finance", "operations"]);
  const [mappedAgents, setMappedAgents] = useState<string[]>([]);

  const integration = integrations.find(i => i.id === integrationId);

  const handleConnect = useCallback(() => {
    if (!integration) return;
    connect(integration.id);
    toast.success(`${integration.name} OAuth bağlantısı başlatıldı.`);
  }, [connect, integration]);

  const handleDisconnect = useCallback((reason: string) => {
    if (!integration) return;
    disconnect(integration.id);
    setConfirmDisconnect(false);
    toast.info(`${integration.name} bağlantısı kesildi. Sebep: ${reason}`);
  }, [disconnect, integration]);

  const toggleDept = (id: string) => setMappedDepts(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  const toggleAgent = (id: string) => setMappedAgents(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);

  if (!integration) {
    return (
      <AppLayout>
        <div className="p-12 text-center">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Entegrasyon bulunamadı.</p>
          <Link to="/data-sources" className="text-primary text-sm mt-2 inline-block">← Geri Dön</Link>
        </div>
      </AppLayout>
    );
  }

  const isAdmin = canPerform("canManageBilling");
  const connected = isConnected(integration.id);
  const hasWrite = hasWriteCapabilities(integration.id);
  const health = getDataHealth(integration.id);
  const planId = activeTier.id;
  const isCore = planId === "core";
  const isPerformance = planId === "performance";
  const isWorkforce = planId === "workforce";

  const getExtendedStatus = (): ExtendedStatus => {
    if (isCore && connected) return "limited";
    if (health.tokenExpiresAt) {
      const daysLeft = Math.floor((new Date(health.tokenExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 0) return "token_expired";
    }
    return integration.status;
  };
  const extStatus = getExtendedStatus();
  const statusCfg = statusConfig[extStatus];

  const deptOptions = [
    { id: "finance", label: "Finans", icon: BarChart3 },
    { id: "marketing", label: "Pazarlama", icon: TrendingUp },
    { id: "operations", label: "Operasyon", icon: Settings2 },
    { id: "executive", label: "Yönetim", icon: Building2 },
  ];
  const agentOptions = [
    { id: "cfo", label: "CFO Agent" }, { id: "cmo", label: "CMO Agent" },
    { id: "coo", label: "COO Agent" }, { id: "ceo", label: "CEO Agent" },
  ];

  const tokenDaysLeft = health.tokenExpiresAt
    ? Math.max(0, Math.floor((new Date(health.tokenExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* ══════ HEADER ══════ */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back */}
          <button onClick={() => navigate("/data-sources")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-3.5 w-3.5" /> Veri Kaynakları
          </button>

          <div className="glass-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Database className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-foreground">{integration.name}</h1>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusCfg.bg} ${statusCfg.glow}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{integration.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {connected && (
                      <>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3" /> {storeDomain || `${integration.id}.mystore.com`}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Server className="h-3 w-3" /> {environment === "production" ? "Production" : "Sandbox"}
                        </span>
                      </>
                    )}
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                      isWorkforce ? "badge-info" : isPerformance ? "badge-warning" : "badge-neutral"
                    }`}>
                      {activeTier.name}
                    </span>
                    {hasWrite && (
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full badge-warning flex items-center gap-0.5">
                        <Pencil className="h-2.5 w-2.5" /> Yazma Destekli
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══════ 1) CONNECTION & AUTH ══════ */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SectionHeader icon={Key} title="Bağlantı & Yetkilendirme" badge="OAuth 2.0" />

          {!connected ? (
            <GlassPanel>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">Store Domain</label>
                    <input
                      value={storeDomain} onChange={e => setStoreDomain(e.target.value)}
                      placeholder="yourstore.myshopify.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-secondary/60 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">Ortam</label>
                    <div className="flex gap-2">
                      {(["production", "sandbox"] as const).map(env => (
                        <button key={env} onClick={() => setEnvironment(env)}
                          className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                            environment === env ? "bg-primary/10 border border-primary/30 text-primary" : "bg-secondary/40 border border-border text-muted-foreground hover:bg-secondary/60"
                          }`}>
                          {env === "production" ? "Production" : "Sandbox"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scope list */}
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">İzin Kapsamları</label>
                  <div className="space-y-1.5">
                    {integration.permissions.map(p => (
                      <ScopeRow key={p.label} label={p.label} access={p.access}
                        risk={p.scope === "write" ? "medium" : "low"} />
                    ))}
                    {integration.writeCapabilities.filter(w => w.riskLevel === "high").map(w => (
                      <ScopeRow key={w.action} label={w.label} access="yazma" risk="high" />
                    ))}
                  </div>
                </div>

                {isAdmin ? (
                  <div className="space-y-2">
                    <button onClick={handleConnect} className="btn-primary w-full py-3 text-sm font-medium flex items-center justify-center gap-2">
                      <ExternalLink className="h-4 w-4" /> OAuth ile Bağlan
                    </button>
                    <p className="text-[10px] text-muted-foreground text-center">Güvenli OAuth 2.0 yetkilendirme akışına yönlendirileceksiniz.</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Yalnızca Sahip/Yönetici bağlantı kurabilir.</span>
                  </div>
                )}
              </div>
            </GlassPanel>
          ) : (
            <GlassPanel>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <MetricChip icon={Key} label="Token Durumu" value={tokenDaysLeft !== null ? `${tokenDaysLeft} gün kaldı` : "Aktif"} />
                  <MetricChip icon={Clock} label="Son Yenileme" value={integration.lastSync ? new Date(integration.lastSync).toLocaleString("tr-TR") : "—"} />
                  <MetricChip icon={Shield} label="Ortam" value={environment === "production" ? "Production" : "Sandbox"} />
                </div>

                {/* Scope transparency */}
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Aktif İzinler</label>
                  <div className="space-y-1">
                    {integration.permissions.map(p => (
                      <ScopeRow key={p.label} label={p.label} access={p.access}
                        risk={p.scope === "write" ? "medium" : "low"} />
                    ))}
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex gap-2">
                    <button onClick={() => { disconnect(integration.id); connect(integration.id); toast.info("Token yenileniyor..."); }}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs text-foreground transition-colors flex items-center justify-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5" /> Yeniden Bağlan
                    </button>
                    <button onClick={() => setConfirmDisconnect(true)}
                      className="px-4 py-2.5 rounded-xl border border-destructive/30 hover:bg-destructive/10 text-xs text-destructive transition-colors flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5" /> Bağlantıyı Kes
                    </button>
                  </div>
                )}
              </div>
            </GlassPanel>
          )}
        </motion.div>

        {/* ══════ 2) SYNC CONFIGURATION ══════ */}
        {connected && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SectionHeader icon={RefreshCw} title="Senkronizasyon Yapılandırması" />
            <GlassPanel>
              <div className="grid grid-cols-3 gap-6">
                {/* Sync Mode */}
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Senkronizasyon Modu</label>
                  <div className="space-y-1.5">
                    {[
                      { value: "manual", label: "Manuel", locked: false },
                      { value: "24h", label: "Her 24 Saat", locked: false },
                      { value: "6h", label: "Her 6 Saat", locked: isCore },
                      { value: "realtime", label: "Gerçek Zamanlı (Webhook)", locked: !isWorkforce },
                    ].map(opt => (
                      <button key={opt.value} disabled={opt.locked}
                        onClick={() => !opt.locked && setSyncMode(opt.value)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                          syncMode === opt.value ? "bg-primary/10 border border-primary/30 text-primary" :
                          opt.locked ? "bg-secondary/20 border border-border text-muted-foreground/50 cursor-not-allowed" :
                          "bg-secondary/40 border border-border text-muted-foreground hover:bg-secondary/60"
                        }`}>
                        <span className="flex items-center gap-1.5">
                          {syncMode === opt.value && <CircleDot className="h-3 w-3" />}
                          {opt.label}
                        </span>
                        {opt.locked && <Lock className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Data Window */}
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Veri Penceresi</label>
                  <div className="space-y-1.5">
                    {[
                      { value: "30d", label: "Son 30 Gün" },
                      { value: "90d", label: "Son 90 Gün" },
                      { value: "full", label: "Tüm Geçmiş" },
                      { value: "custom", label: "Özel Aralık" },
                    ].map(opt => (
                      <button key={opt.value}
                        onClick={() => setDataWindow(opt.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs text-left transition-all ${
                          dataWindow === opt.value ? "bg-primary/10 border border-primary/30 text-primary" :
                          "bg-secondary/40 border border-border text-muted-foreground hover:bg-secondary/60"
                        }`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Öncelik Kuyruğu</label>
                  <div className="space-y-1.5">
                    {[
                      { value: "low", label: "Düşük (Free)", locked: false },
                      { value: "normal", label: "Normal", locked: isCore },
                      { value: "high", label: "Yüksek (Workforce)", locked: !isWorkforce },
                    ].map(opt => (
                      <button key={opt.value} disabled={opt.locked}
                        onClick={() => !opt.locked && setSyncPriority(opt.value)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                          syncPriority === opt.value ? "bg-primary/10 border border-primary/30 text-primary" :
                          opt.locked ? "bg-secondary/20 border border-border text-muted-foreground/50 cursor-not-allowed" :
                          "bg-secondary/40 border border-border text-muted-foreground hover:bg-secondary/60"
                        }`}>
                        <span>{opt.label}</span>
                        {opt.locked && <Lock className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => toast.success("Senkronizasyon yapılandırması kaydedildi.")}
                className="btn-primary px-6 py-2.5 text-xs font-medium mt-5">
                Yapılandırmayı Kaydet
              </button>
            </GlassPanel>
          </motion.div>
        )}

        {/* ══════ 3) DATA FRESHNESS ══════ */}
        {connected && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <SectionHeader icon={Activity} title="Veri Tazeliği" />
            <GlassPanel>
              <div className="grid grid-cols-5 gap-3">
                <MetricChip icon={CheckCircle2} label="Son Başarılı Senk." value={integration.lastSync ? new Date(integration.lastSync).toLocaleString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "—"} />
                <MetricChip icon={Hash} label="Senkronize Kayıt" value="1,847" />
                <MetricChip icon={AlertCircle} label="24s Hata" value="1" />
                <MetricChip icon={CalendarClock} label="Sonraki Senk." value="14:30" />
                <MetricChip icon={Timer} label="Ort. Süre" value="12s" pulse={integration.status === "syncing"} />
              </div>
              {integration.status === "syncing" && (
                <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/15">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  <span className="text-xs text-primary font-medium">Senkronizasyon devam ediyor...</span>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary ml-2">
                    <motion.div className="h-1.5 rounded-full bg-primary" initial={{ width: "0%" }}
                      animate={{ width: "65%" }} transition={{ duration: 2, ease: "easeInOut" }} />
                  </div>
                </div>
              )}
            </GlassPanel>
          </motion.div>
        )}

        {/* ══════ 4) AI CONSUMPTION MAPPING ══════ */}
        {connected && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SectionHeader icon={Brain} title="AI Kullanım & Departman Eşlemesi" />
            <GlassPanel>
              <div className="grid grid-cols-2 gap-6">
                {/* Departments */}
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Bu Veriyi Kullanan Departmanlar</label>
                  <div className="space-y-1.5">
                    {deptOptions.map(d => {
                      const active = mappedDepts.includes(d.id);
                      return (
                        <button key={d.id} onClick={() => toggleDept(d.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all ${
                            active ? "bg-primary/10 border border-primary/30 text-primary" : "bg-secondary/40 border border-border text-muted-foreground hover:bg-secondary/60"
                          }`}>
                          <d.icon className="h-3.5 w-3.5" />
                          {d.label}
                          {active && <CheckCircle2 className="h-3 w-3 ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Agents */}
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Veriyi Tüketen AI Ajanlar</label>
                  <div className="space-y-1.5">
                    {agentOptions.map(a => {
                      const active = mappedAgents.includes(a.id);
                      return (
                        <button key={a.id} onClick={() => toggleAgent(a.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all ${
                            active ? "bg-primary/10 border border-primary/30 text-primary" : "bg-secondary/40 border border-border text-muted-foreground hover:bg-secondary/60"
                          }`}>
                          <Cpu className="h-3.5 w-3.5" />
                          {a.label}
                          {active && <CheckCircle2 className="h-3 w-3 ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Impact preview */}
              <div className="mt-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Bu Entegrasyon Şunları Etkinleştirir:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Gelir tahmini & trend analizi",
                    "Envanter risk tespiti",
                    "ROAS yeniden hesaplama",
                    "Stratejik düzeltme girdileri",
                  ].map(cap => (
                    <div key={cap} className="flex items-center gap-1.5 text-xs text-foreground">
                      <Zap className="h-3 w-3 text-primary shrink-0" /> {cap}
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {/* ══════ 5) WRITE CAPABILITIES ══════ */}
        {hasWrite && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <SectionHeader icon={Pencil} title="Yazma Yetenekleri (Risk-Aware)" badge={isCore ? "Kilitli" : undefined} />
            {isCore ? (
              <GlassPanel>
                <div className="flex flex-col items-center py-8 space-y-3">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Yazma erişimi Core planda kullanılamaz.</p>
                  <Link to="/pricing" className="btn-primary px-6 py-2.5 text-xs font-medium">Planı Yükselt</Link>
                </div>
              </GlassPanel>
            ) : (
              <GlassPanel>
                <div className="space-y-4">
                  {/* Master toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-warning/5 border border-warning/15">
                    <div className="flex items-center gap-3">
                      <Zap className={`h-4 w-4 ${isWriteEnabled(integration.id) ? "text-warning" : "text-muted-foreground"}`} />
                      <div>
                        <p className="text-xs font-medium text-foreground">Yazma İşlemlerini Etkinleştir</p>
                        <p className="text-[10px] text-muted-foreground">Tüm yazma işlemleri Aksiyon Merkezi onayı gerektirir.</p>
                      </div>
                    </div>
                    {isAdmin ? (
                      <Switch checked={isWriteEnabled(integration.id)}
                        onCheckedChange={checked => toggleWriteAccess(integration.id, checked)} />
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Yalnızca Sahip/Yönetici</span>
                    )}
                  </div>

                  {/* Capabilities list */}
                  <div className="space-y-1.5">
                    {integration.writeCapabilities.map(w => (
                      <div key={w.action} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-warning/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-foreground font-medium">{w.label}</p>
                            <p className="text-[10px] text-muted-foreground">{w.description}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-semibold px-2 py-1 rounded-full ${
                          w.riskLevel === "high" ? "badge-error" : w.riskLevel === "medium" ? "badge-warning" : "badge-success"
                        }`}>
                          {w.riskLevel === "high" ? "Yüksek Risk" : w.riskLevel === "medium" ? "Orta Risk" : "Düşük Risk"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Governance notice */}
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 border border-primary/15">
                    <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-[10px] text-primary">Tüm yazma işlemleri Aksiyon Merkezi üzerinden onay sürecine tabidir. Otomatik yürütme yapılamaz.</p>
                  </div>
                </div>
              </GlassPanel>
            )}
          </motion.div>
        )}

        {/* ══════ 6) WEBHOOK MANAGEMENT ══════ */}
        {connected && syncMode === "realtime" && isWorkforce && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <SectionHeader icon={Webhook} title="Webhook Yönetimi" badge="Active" />
            <GlassPanel>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <MetricChip icon={Signal} label="Teslimat Başarısı" value="97.8%" />
                <MetricChip icon={AlertCircle} label="24s Başarısız" value="3" />
                <MetricChip icon={Clock} label="Son Olay" value="09:12:33" pulse />
              </div>

              <div className="flex gap-2 mb-4">
                <button onClick={() => toast.success("Webhook secret döndürüldü.")}
                  className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs text-foreground transition-colors flex items-center gap-1.5">
                  <RotateCcw className="h-3 w-3" /> Secret Döndür
                </button>
                <button onClick={() => setWebhookDrawer(true)}
                  className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs text-foreground transition-colors flex items-center gap-1.5">
                  <FileJson className="h-3 w-3" /> Teslimatları Görüntüle
                </button>
                <button onClick={() => toast.info("Başarısız olay yeniden oynatılıyor...")}
                  className="px-3 py-2 rounded-xl bg-warning/10 hover:bg-warning/20 text-xs text-warning transition-colors flex items-center gap-1.5">
                  <Play className="h-3 w-3" /> Başarısız Olayı Tekrarla
                </button>
              </div>

              {/* Recent events */}
              <div className="space-y-1">
                {mockWebhookEvents.map(ev => (
                  <div key={ev.traceId} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${ev.status === 200 ? "bg-success" : "bg-destructive"}`} />
                      <span className="text-xs text-foreground font-mono">{ev.event}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono ${ev.status === 200 ? "text-success" : "text-destructive"}`}>{ev.status}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(ev.receivedAt).toLocaleTimeString("tr-TR")}</span>
                      <span className="text-[9px] text-muted-foreground font-mono">{ev.traceId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {/* ══════ 7) DIAGNOSTICS & LOGS ══════ */}
        {connected && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <SectionHeader icon={FileText} title="Tanılama & Loglar" />
            <GlassPanel>
              {/* Table header */}
              <div className="grid grid-cols-6 gap-2 px-3 py-2 text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border mb-1">
                <span>Job ID</span><span>Başlangıç</span><span>Süre</span><span>Kayıtlar</span><span>Durum</span><span>Trace ID</span>
              </div>

              {/* Table rows */}
              <div className="space-y-0.5">
                {mockSyncJobs.map(job => (
                  <button key={job.id} onClick={() => setJobDrawer(job)}
                    className="w-full grid grid-cols-6 gap-2 px-3 py-2.5 rounded-xl text-xs hover:bg-white/[0.03] transition-colors text-left group">
                    <span className="text-foreground font-mono">{job.id}</span>
                    <span className="text-muted-foreground">{new Date(job.startedAt).toLocaleString("tr-TR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}</span>
                    <span className="text-muted-foreground">{job.duration}</span>
                    <span className="text-foreground">{job.records.toLocaleString()}</span>
                    <span className={job.status === "success" ? "text-success" : "text-destructive"}>{job.status === "success" ? "Başarılı" : "Hata"}</span>
                    <span className="text-muted-foreground font-mono flex items-center gap-1">
                      {job.traceId} <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </button>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {/* ══════ 8) SECURITY & COMPLIANCE ══════ */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <SectionHeader icon={ShieldCheck} title="Güvenlik & Uyumluluk" />
          <GlassPanel>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: "OAuth 2.0 güvenli bağlantı", active: true },
                { icon: Eye, label: "Kapsamlı (scoped) izin sistemi", active: true },
                { icon: Lock, label: "Token'lar şifreli olarak saklanır (AES-256)", active: true },
                { icon: FileText, label: "Veri saklama politikası referansı", active: true },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <item.icon className="h-3.5 w-3.5 text-success" />
                  <span className="text-xs text-foreground">{item.label}</span>
                </div>
              ))}
            </div>

            {isWorkforce && (
              <div className="flex gap-2 mt-4">
                <button onClick={() => toast.info("Veri dışa aktarma talebi oluşturuldu.")}
                  className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs text-foreground transition-colors flex items-center gap-1.5">
                  <Download className="h-3 w-3" /> Veri Dışa Aktarma Talebi
                </button>
                <button onClick={() => toast.info("Veri silme talebi oluşturuldu.")}
                  className="px-4 py-2 rounded-xl border border-destructive/30 hover:bg-destructive/10 text-xs text-destructive transition-colors flex items-center gap-1.5">
                  <Trash2 className="h-3 w-3" /> Veri Silme Talebi
                </button>
              </div>
            )}
          </GlassPanel>
        </motion.div>

        {/* ══════ PLAN ENFORCEMENT ══════ */}
        {isCore && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <GlassPanel className="border-warning/20">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-warning/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">Plan Kısıtlamaları Aktif</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Core plan: Maks. 1 entegrasyon • 24s senk. • Webhook yok • Yazma erişimi yok • Düşük öncelik kuyruğu</p>
                </div>
                <Link to="/pricing" className="btn-primary px-5 py-2.5 text-xs font-medium shrink-0">Planı Yükselt</Link>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </div>

      {/* ══════ DRAWERS ══════ */}
      <DrawerPanel open={!!jobDrawer} onClose={() => setJobDrawer(null)} title={`Senkronizasyon Detayı — ${jobDrawer?.id}`}>
        {jobDrawer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <MetricChip icon={Hash} label="Job ID" value={jobDrawer.id} />
              <MetricChip icon={Clock} label="Başlangıç" value={new Date(jobDrawer.startedAt).toLocaleString("tr-TR")} />
              <MetricChip icon={Timer} label="Süre" value={jobDrawer.duration} />
              <MetricChip icon={Activity} label="Kayıtlar" value={jobDrawer.records.toLocaleString()} />
            </div>
            <div className={`p-4 rounded-xl ${jobDrawer.status === "error" ? "bg-destructive/5 border border-destructive/15" : "bg-success/5 border border-success/15"}`}>
              <p className={`text-xs font-medium ${jobDrawer.status === "error" ? "text-destructive" : "text-success"}`}>
                {jobDrawer.status === "error" ? "Rate limit exceeded — 429 Too Many Requests" : "Senkronizasyon başarıyla tamamlandı."}
              </p>
              {jobDrawer.status === "error" && (
                <pre className="text-[10px] text-muted-foreground mt-2 font-mono bg-black/20 p-3 rounded-lg overflow-x-auto">
{`{
  "error": "rate_limit_exceeded",
  "retry_after": 60,
  "message": "API call limit reached for shop"
}`}
                </pre>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-mono">Trace: {jobDrawer.traceId}</span>
              <button onClick={() => { navigator.clipboard.writeText(jobDrawer.traceId); toast.success("Trace ID kopyalandı."); }}
                className="p-1 rounded hover:bg-secondary transition-colors">
                <Copy className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            {jobDrawer.status === "error" && (
              <button onClick={() => { setJobDrawer(null); toast.info("Senkronizasyon yeniden deneniyor..."); syncManual(integration.id); }}
                className="btn-primary w-full py-2.5 text-xs font-medium flex items-center justify-center gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" /> Yeniden Dene
              </button>
            )}
          </div>
        )}
      </DrawerPanel>

      <DrawerPanel open={webhookDrawer} onClose={() => setWebhookDrawer(false)} title="Webhook Teslimatları">
        <div className="space-y-3">
          {mockWebhookEvents.map(ev => (
            <div key={ev.traceId} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground font-mono">{ev.event}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ev.status === 200 ? "badge-success" : "badge-error"}`}>{ev.status}</span>
              </div>
              <pre className="text-[10px] text-muted-foreground font-mono bg-black/20 p-3 rounded-lg overflow-x-auto">
{`{
  "id": "${ev.traceId}",
  "topic": "${ev.event}",
  "created_at": "${ev.receivedAt}",
  "payload": { "...": "..." }
}`}
              </pre>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground font-mono">{ev.traceId}</span>
                <span className="text-[9px] text-muted-foreground">{new Date(ev.receivedAt).toLocaleString("tr-TR")}</span>
              </div>
            </div>
          ))}
        </div>
      </DrawerPanel>

      {/* Confirm disconnect */}
      <ConfirmModal
        open={confirmDisconnect}
        onClose={() => setConfirmDisconnect(false)}
        onConfirm={handleDisconnect}
        title="Bağlantıyı Kes"
        description={`${integration.name} bağlantısını kesmek istediğinize emin misiniz? Tüm token'lar silinecek ve senkronizasyon duracaktır. Bu işlem denetim günlüğüne kaydedilecektir.`}
        danger
      />
    </AppLayout>
  );
};

export default IntegrationDetail;
