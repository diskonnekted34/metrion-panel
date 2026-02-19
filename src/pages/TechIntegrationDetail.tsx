import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Database, Plug, RefreshCw, Shield, CheckCircle2, AlertCircle,
  Clock, Settings2, Activity, AlertTriangle, Globe, Key, ShieldCheck,
  FileText, Lock, Eye, Zap, ChevronDown, Copy, ExternalLink,
  RotateCcw, TrendingUp, X, Play, Unplug, Download, Trash2,
  Lightbulb, Info,
} from "lucide-react";
import {
  GitBranch, ListTodo, Rocket, Cloud, Container, Bug, Siren, DollarSign,
  Workflow, BookOpen, Headphones, MessageSquare,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import {
  TechConnector, techConnectors as defaultConnectors, techCategories,
  computeHealthScore, computeRiskLevel, getAIInsights, getMockMetrics24h,
  generateSyncJobs, SyncJob,
} from "@/data/techIntegrations";
import { toast } from "sonner";

const iconMap: Record<string, React.ElementType> = {
  GitBranch, ListTodo, Rocket, Cloud, Container, Activity, FileText, Bug,
  Shield: ShieldCheck, Key, ShieldCheck, Siren, Globe, DollarSign, Database,
  Workflow, BookOpen, Headphones, MessageSquare,
};

/* ── Reusable components ── */
const Section = ({ id, icon: Icon, title, children, badge }: { id?: string; icon: React.ElementType; title: string; children: React.ReactNode; badge?: string }) => (
  <div id={id} className="mb-6">
    <div className="sticky top-0 z-10 flex items-center gap-2.5 py-3 px-1 bg-background/80 backdrop-blur-xl border-b border-border/50 mb-4">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="text-sm font-semibold text-foreground tracking-wide">{title}</h2>
      {badge && <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{badge}</span>}
    </div>
    {children}
  </div>
);

const GlassPanel = ({ children, className = "", error = false }: { children: React.ReactNode; className?: string; error?: boolean }) => (
  <div className={`glass-card p-5 ${error ? "border-destructive/30" : ""} ${className}`}>{children}</div>
);

const StatusBadge = ({ status }: { status: TechConnector["status"] }) => {
  const map: Record<string, { label: string; cls: string }> = {
    connected: { label: "Bağlı", cls: "bg-success/10 text-success border-success/20" },
    available: { label: "Bağlı Değil", cls: "bg-white/[0.04] text-muted-foreground border-border/40" },
    error: { label: "Hata", cls: "bg-destructive/10 text-destructive border-destructive/20" },
    disabled: { label: "Devre Dışı", cls: "bg-white/[0.04] text-muted-foreground border-border/40" },
  };
  const c = map[status] || map.available;
  return <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${c.cls}`}>{c.label}</span>;
};

const MetricCard = ({ value, label }: { value: string | number; label: string }) => (
  <div className="p-3 rounded-xl bg-white/[0.03] border border-border/40 text-center">
    <p className="text-xs font-bold text-foreground">{value}</p>
    <p className="text-[8px] text-muted-foreground mt-0.5">{label}</p>
  </div>
);

/* ══════════════════════════ MAIN ══════════════════════════ */
const TechIntegrationDetail = () => {
  const { connectorId } = useParams<{ connectorId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [connectors, setConnectors] = useState<TechConnector[]>(defaultConnectors);
  const connector = useMemo(() => connectors.find(c => c.id === connectorId), [connectors, connectorId]);
  const category = useMemo(() => connector ? techCategories.find(c => c.id === connector.category) : null, [connector]);
  const CatIcon = iconMap[category?.icon_name || "Database"] || Database;

  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [disconnectReason, setDisconnectReason] = useState("");
  const [disconnecting, setDisconnecting] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [syncFrequency, setSyncFrequency] = useState(connector?.refresh_frequency || "hourly");
  const [dataWindow, setDataWindow] = useState<string>("90d");
  const [priorityQueue, setPriorityQueue] = useState<string>("normal");
  const [envScope, setEnvScope] = useState<string[]>(connector?.environment_scope_selected || []);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [showHealthReasons, setShowHealthReasons] = useState(false);

  const syncJobs = useMemo(() => connector ? generateSyncJobs(connector) : [], [connector]);
  const selectedJob = syncJobs.find(j => j.id === selectedJobId);
  const health = useMemo(() => connector ? computeHealthScore(connector) : null, [connector]);
  const risk = useMemo(() => connector ? computeRiskLevel(connector) : null, [connector]);
  const aiInsights = useMemo(() => connector ? getAIInsights(connector) : null, [connector]);
  const metrics24h = useMemo(() => connector ? getMockMetrics24h(connector) : null, [connector]);

  if (!connector) {
    return (
      <AppLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <GlassPanel className="p-12 text-center">
            <Database className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground mb-4">Sistem bulunamadı.</p>
            <button onClick={() => navigate("/tech-data-sources")} className="btn-primary px-4 py-2 text-xs">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5 inline" /> Geri Dön
            </button>
          </GlassPanel>
        </div>
      </AppLayout>
    );
  }

  const isConnected = connector.status === "connected";
  const isError = connector.status === "error";

  const handleSync = () => {
    if (!isConnected) return;
    setSyncing(true);
    toast.loading(`${connector.name_tr} senkronizasyonu başlatıldı...`, { id: "sync" });
    setTimeout(() => {
      setConnectors(prev => prev.map(c =>
        c.id === connectorId ? { ...c, last_sync_at: new Date().toISOString(), last_sync_status: "ok" as const } : c
      ));
      setSyncing(false);
      toast.success(`${connector.name_tr} senkronizasyonu tamamlandı.`, { id: "sync" });
    }, 2000);
  };

  const handleConnect = () => {
    setConnecting(true);
    toast.loading(`${connector.name_tr} bağlantısı kuruluyor...`, { id: "connect" });
    setTimeout(() => {
      setConnectors(prev => prev.map(c =>
        c.id === connectorId ? { ...c, status: "connected" as const, last_sync_at: new Date().toISOString(), last_sync_status: "ok" as const, error_message_tr: null, environment_scope_selected: ["prod"] } : c
      ));
      setConnecting(false);
      setEnvScope(["prod"]);
      toast.success(`${connector.name_tr} başarıyla bağlandı.`, { id: "connect" });
    }, 2000);
  };

  const handleTest = () => {
    setTesting(true);
    toast.loading(`${connector.name_tr} bağlantı testi yapılıyor...`, { id: "test" });
    setTimeout(() => {
      setTesting(false);
      if (isError) {
        toast.error(`${connector.name_tr} bağlantı testi başarısız.`, { id: "test" });
      } else {
        toast.success(`${connector.name_tr} bağlantı testi başarılı — yanıt süresi: 142ms.`, { id: "test" });
      }
    }, 1500);
  };

  const handleDisconnect = () => {
    if (!disconnectReason.trim()) { toast.error("Lütfen bağlantı kesme sebebi girin."); return; }
    setDisconnecting(true);
    setTimeout(() => {
      setConnectors(prev => prev.map(c =>
        c.id === connectorId ? { ...c, status: "available" as const, last_sync_at: null, last_sync_status: "never" as const, error_message_tr: null, environment_scope_selected: [] } : c
      ));
      setDisconnecting(false);
      setShowDisconnectConfirm(false);
      setDisconnectReason("");
      setEnvScope([]);
      toast.success(`${connector.name_tr} bağlantısı kesildi. Token'lar silindi.`);
    }, 1500);
  };

  const handleSaveConfig = () => toast.success("Senkronizasyon yapılandırması kaydedildi.");
  const handleExportRequest = () => { setShowExportModal(false); toast.success("Veri dışa aktarma talebi oluşturuldu. E-posta ile bilgilendirileceksiniz."); };
  const handleDeleteRequest = () => {
    if (!deleteReason.trim()) { toast.error("Lütfen silme sebebi girin."); return; }
    setShowDeleteModal(false);
    setDeleteReason("");
    toast.success("Veri silme talebi oluşturuldu. İşlem 72 saat içinde tamamlanacak.");
  };

  const riskBadge = risk ? {
    low: { label: "Düşük", cls: "bg-success/10 text-success border-success/20" },
    medium: { label: "Orta", cls: "bg-warning/10 text-warning border-warning/20" },
    high: { label: "Yüksek", cls: "bg-destructive/10 text-destructive border-destructive/20" },
    critical: { label: "Kritik", cls: "bg-destructive/10 text-destructive border-destructive/20" },
  }[risk.level] : null;

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        {/* ── HERO ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <GlassPanel>
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => navigate("/tech-data-sources")} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              <span className="text-[10px] text-muted-foreground">Teknoloji Veri Kaynakları</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <CatIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold text-foreground">{connector.name_tr}</h1>
                    <StatusBadge status={connector.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-muted-foreground">{connector.vendor}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground">{category?.name_tr}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      category?.owner === "cto" ? "bg-primary/10 text-primary" : category?.owner === "cio" ? "bg-purple-400/10 text-purple-400" : "bg-white/[0.04] text-muted-foreground"
                    }`}>{category?.owner}</span>
                    <span className="text-[9px] text-muted-foreground capitalize">Ortam: {connector.environment_scope_selected.join(", ") || "—"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isConnected && (
                  <>
                    <button onClick={handleTest} disabled={testing} className="h-8 px-3 rounded-lg bg-secondary/60 border border-border text-[10px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center gap-1.5 disabled:opacity-50">
                      <Play className={`h-3 w-3 ${testing ? "animate-pulse" : ""}`} /> Test
                    </button>
                    <button onClick={handleSync} disabled={syncing} className="h-8 px-3 rounded-lg bg-secondary/60 border border-border text-[10px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center gap-1.5 disabled:opacity-50">
                      <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Senkronize..." : "Senkronize Et"}
                    </button>
                  </>
                )}
                {!isConnected && (
                  <button onClick={handleConnect} disabled={connecting} className="btn-primary h-8 px-4 text-[10px] font-medium flex items-center gap-1.5 disabled:opacity-50">
                    {connecting ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Plug className="h-3 w-3" />}
                    {connecting ? "Bağlanıyor..." : isError ? "Yeniden Bağlan" : "Bağlan"}
                  </button>
                )}
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* ── ERROR BANNER ── */}
        {isError && connector.error_message_tr && (
          <GlassPanel error>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-destructive mb-1">Bağlantı Hatası</p>
                <p className="text-[11px] text-muted-foreground">{connector.error_message_tr}</p>
              </div>
              <button onClick={handleConnect} disabled={connecting} className="text-[10px] font-medium px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all flex items-center gap-1 shrink-0 disabled:opacity-50">
                <RotateCcw className="h-3 w-3" /> Yeniden Bağlan
              </button>
            </div>
          </GlassPanel>
        )}

        {/* ── A) CONNECTION & AUTH ── */}
        <Section id="auth" icon={Key} title="Bağlantı & Kimlik Doğrulama">
          <GlassPanel>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Erişim Yöntemi</p>
                <p className="text-xs text-foreground capitalize">{connector.access_method === "oauth" ? "OAuth 2.0" : connector.access_method === "api_key" ? "API Anahtarı" : connector.access_method === "webhook" ? "Webhook" : "Manuel"}</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Veri Hassasiyeti</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  connector.data_sensitivity === "high" ? "bg-destructive/10 text-destructive" : connector.data_sensitivity === "med" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                }`}>{connector.data_sensitivity === "high" ? "Yüksek" : connector.data_sensitivity === "med" ? "Orta" : "Düşük"}</span>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Token Durumu</p>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">{isConnected ? "Geçerli" : isError ? "Geçersiz" : "Yok"}</span>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Ortam Kapsamı</p>
                <div className="flex gap-1">
                  {connector.environment_scope_selected.length > 0 ? connector.environment_scope_selected.map(env => (
                    <span key={env} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase">{env}</span>
                  )) : <span className="text-[9px] text-muted-foreground">Seçim yapılmadı</span>}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">İzinler (Scope)</p>
              <div className="flex flex-wrap gap-1">
                {connector.required_permissions.map(perm => (
                  <span key={perm} className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.04] text-foreground border border-border/40 font-mono">{perm}</span>
                ))}
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${isConnected ? 100 : 0}%` }} />
              </div>
              <p className="text-[8px] text-muted-foreground mt-1">Scope Tamamlanma: {isConnected ? "100" : "0"}%</p>
            </div>

            <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 flex items-start gap-2 mb-4">
              <Shield className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
              <p className="text-[10px] text-foreground">{connector.least_privilege_notes_tr}</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleTest} disabled={testing} className="text-[10px] font-medium px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all flex items-center gap-1 disabled:opacity-50">
                <Play className={`h-3 w-3 ${testing ? "animate-pulse" : ""}`} /> Bağlantıyı Test Et
              </button>
              {isConnected && !showDisconnectConfirm && (
                <button onClick={() => setShowDisconnectConfirm(true)} className="text-[10px] font-medium px-3 py-1.5 rounded-lg bg-destructive/5 border border-destructive/15 text-destructive hover:bg-destructive/10 transition-all flex items-center gap-1">
                  <Unplug className="h-3 w-3" /> Bağlantıyı Kes
                </button>
              )}
            </div>

            {showDisconnectConfirm && (
              <div className="mt-3 p-3 rounded-xl bg-destructive/5 border border-destructive/15 space-y-2">
                <p className="text-[10px] font-semibold text-destructive">⚠️ Bu işlem token'ları siler ve veri akışını durdurur.</p>
                <input value={disconnectReason} onChange={e => setDisconnectReason(e.target.value)} placeholder="Bağlantı kesme sebebi..." className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-border/40 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-destructive/40" />
                <div className="flex gap-2">
                  <button onClick={handleDisconnect} disabled={disconnecting} className="text-[10px] font-medium px-3 py-1.5 rounded-lg bg-destructive text-white hover:bg-destructive/80 transition-all disabled:opacity-50">
                    {disconnecting ? "Kesiliyor..." : "Onayla & Kes"}
                  </button>
                  <button onClick={() => { setShowDisconnectConfirm(false); setDisconnectReason(""); }} className="text-[10px] font-medium px-3 py-1.5 rounded-lg bg-secondary/60 border border-border text-muted-foreground hover:text-foreground transition-all">
                    İptal
                  </button>
                </div>
              </div>
            )}
          </GlassPanel>
        </Section>

        {/* ── B) SYNC CONFIGURATION ── */}
        <Section icon={RefreshCw} title="Senkronizasyon Yapılandırması">
          <GlassPanel>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sıklık</p>
                <div className="space-y-1">
                  {(["manual", "daily", "hourly", "realtime"] as const).map(freq => (
                    <label key={freq} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all ${syncFrequency === freq ? "bg-primary/10 border border-primary/20" : "bg-white/[0.02] border border-transparent hover:bg-white/[0.04]"}`}>
                      <input type="radio" name="freq" checked={syncFrequency === freq} onChange={() => setSyncFrequency(freq)} className="sr-only" />
                      <div className={`h-3 w-3 rounded-full border-2 flex items-center justify-center ${syncFrequency === freq ? "border-primary" : "border-muted-foreground/40"}`}>
                        {syncFrequency === freq && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </div>
                      <span className="text-[10px] text-foreground">{freq === "manual" ? "Manuel" : freq === "daily" ? "Günlük (24s)" : freq === "hourly" ? "Saatlik" : "Gerçek Zamanlı"}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Veri Penceresi</p>
                <div className="space-y-1">
                  {["30d", "90d", "all", "custom"].map(w => (
                    <label key={w} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all ${dataWindow === w ? "bg-primary/10 border border-primary/20" : "bg-white/[0.02] border border-transparent hover:bg-white/[0.04]"}`}>
                      <input type="radio" name="window" checked={dataWindow === w} onChange={() => setDataWindow(w)} className="sr-only" />
                      <div className={`h-3 w-3 rounded-full border-2 flex items-center justify-center ${dataWindow === w ? "border-primary" : "border-muted-foreground/40"}`}>
                        {dataWindow === w && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </div>
                      <span className="text-[10px] text-foreground">{w === "30d" ? "Son 30 Gün" : w === "90d" ? "Son 90 Gün" : w === "all" ? "Tümü" : "Özel"}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Öncelik Kuyruğu</p>
                <div className="space-y-1">
                  {["low", "normal", "high"].map(p => (
                    <label key={p} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all ${priorityQueue === p ? "bg-primary/10 border border-primary/20" : "bg-white/[0.02] border border-transparent hover:bg-white/[0.04]"}`}>
                      <input type="radio" name="prio" checked={priorityQueue === p} onChange={() => setPriorityQueue(p)} className="sr-only" />
                      <div className={`h-3 w-3 rounded-full border-2 flex items-center justify-center ${priorityQueue === p ? "border-primary" : "border-muted-foreground/40"}`}>
                        {priorityQueue === p && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </div>
                      <span className="text-[10px] text-foreground">{p === "low" ? "Düşük" : p === "normal" ? "Normal" : "Yüksek"}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSaveConfig} className="btn-primary px-4 py-2 text-[10px] font-medium">Yapılandırmayı Kaydet</button>
              {isConnected && (
                <button onClick={handleSync} disabled={syncing} className="h-8 px-3 rounded-lg bg-secondary/60 border border-border text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 disabled:opacity-50">
                  <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} /> Şimdi Senkronize Et
                </button>
              )}
            </div>
          </GlassPanel>
        </Section>

        {/* ── C) HEALTH & METRICS PANEL ── */}
        <Section icon={Activity} title="Veri Tazeliği & Sağlık">
          <GlassPanel>
            <div className="grid grid-cols-5 gap-2 mb-4">
              <MetricCard value={connector.last_sync_at ? new Date(connector.last_sync_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "—"} label="Son Başarılı Sync" />
              <MetricCard value={metrics24h ? metrics24h.recordsSynced.toLocaleString() : "—"} label="24s Kayıt" />
              <MetricCard value={metrics24h ? `${metrics24h.errorRatePct}%` : "—"} label="24s Hata Oranı" />
              <MetricCard value={connector.entities.reduce((s, e) => s + e.fields.length, 0)} label="Toplam Alan" />
              <MetricCard value={connector.refresh_frequency === "realtime" ? "Anlık" : connector.refresh_frequency === "hourly" ? "Saatlik" : connector.refresh_frequency === "daily" ? "Günlük" : "Manuel"} label="Yenileme" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Health Score */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-border/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Sağlık Skoru</span>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${health?.state === "green" ? "bg-success" : health?.state === "yellow" ? "bg-warning" : "bg-destructive"}`} />
                    <span className="text-sm font-bold text-foreground">{health?.score || 0}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mb-2">
                  <div className={`h-full rounded-full transition-all ${health?.state === "green" ? "bg-success" : health?.state === "yellow" ? "bg-warning" : "bg-destructive"}`} style={{ width: `${health?.score || 0}%` }} />
                </div>
                {health && health.reasons.length > 0 && (
                  <div>
                    <button onClick={() => setShowHealthReasons(!showHealthReasons)} className="text-[9px] text-primary hover:underline flex items-center gap-1">
                      <Info className="h-2.5 w-2.5" /> Neden?
                    </button>
                    {showHealthReasons && (
                      <div className="mt-2 space-y-1">
                        {health.reasons.map((r, i) => (
                          <p key={i} className="text-[9px] text-warning flex items-center gap-1"><AlertTriangle className="h-2.5 w-2.5 shrink-0" /> {r}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Risk */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-border/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Risk Seviyesi</span>
                  {riskBadge && <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${riskBadge.cls}`}>{riskBadge.label}</span>}
                </div>
                {risk && risk.reasons.length > 0 ? (
                  <div className="space-y-1">
                    {risk.reasons.map((r, i) => (
                      <p key={i} className="text-[9px] text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-2.5 w-2.5 text-warning shrink-0" /> {r}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-[9px] text-success flex items-center gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Risk faktörü tespit edilmedi.</p>
                )}
              </div>
            </div>
          </GlassPanel>
        </Section>

        {/* ── D) AI INSIGHTS ── */}
        {aiInsights && (aiInsights.insights.length > 0 || aiInsights.recommendations.length > 0) && (
          <Section icon={Lightbulb} title="AI Insights" badge="Advisory">
            <GlassPanel>
              {aiInsights.insights.length > 0 && (
                <div className="mb-4">
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gözlemler</p>
                  <div className="space-y-1.5">
                    {aiInsights.insights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
                        <Zap className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                        <p className="text-[10px] text-foreground">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {aiInsights.recommendations.length > 0 && (
                <div>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Öneriler</p>
                  <div className="space-y-1.5">
                    {aiInsights.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-xl bg-warning/5 border border-warning/10">
                        <Lightbulb className="h-3 w-3 text-warning mt-0.5 shrink-0" />
                        <p className="text-[10px] text-foreground">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassPanel>
          </Section>
        )}

        {/* ── E) DATA ENTITIES ── */}
        <Section icon={Database} title="Veri Varlıkları & Olaylar" badge={`${connector.entities.length} varlık`}>
          <GlassPanel>
            <div className="space-y-3 mb-4">
              {connector.entities.map(entity => (
                <div key={entity.name} className="p-3 rounded-xl bg-white/[0.03] border border-border/40">
                  <p className="text-[11px] font-semibold text-foreground mb-1.5">{entity.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {entity.fields.map(field => (
                      <span key={field} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-muted-foreground border border-border/30 font-mono">{field}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Desteklenen Olaylar</p>
              <div className="flex flex-wrap gap-1">
                {connector.events.map(event => (
                  <span key={event} className="text-[9px] px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/15 font-mono">{event}</span>
                ))}
              </div>
            </div>
          </GlassPanel>
        </Section>

        {/* ── F) DIAGNOSTICS & LOGS ── */}
        {isConnected && (
          <Section id="logs" icon={FileText} title="Tanılama & Senkronizasyon Günlükleri">
            <GlassPanel>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] text-muted-foreground">{syncJobs.length} iş kaydı</span>
                <button onClick={() => toast.success("Log dışa aktarımı başlatıldı.")} className="text-[9px] font-medium px-2 py-1 rounded-lg bg-secondary/60 border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-1">
                  <Download className="h-2.5 w-2.5" /> Export Logs
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/40">
                      {["Job ID", "Başlangıç", "Süre", "Kayıt", "Durum", "Trace"].map(h => (
                        <th key={h} className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider pb-2 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {syncJobs.map(job => (
                      <tr key={job.id} onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
                        className={`border-b border-border/20 cursor-pointer transition-all ${selectedJobId === job.id ? "bg-primary/5" : "hover:bg-white/[0.03]"} ${job.status === "error" ? "bg-destructive/[0.03]" : ""}`}>
                        <td className="py-2 pr-4 text-[10px] font-mono text-foreground">{job.id}</td>
                        <td className="py-2 pr-4 text-[10px] text-muted-foreground">{new Date(job.startedAt).toLocaleString("tr-TR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                        <td className="py-2 pr-4 text-[10px] text-muted-foreground">{job.duration}</td>
                        <td className="py-2 pr-4 text-[10px] text-foreground">{job.records.toLocaleString()}</td>
                        <td className="py-2 pr-4"><span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${job.status === "success" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{job.status === "success" ? "Başarılı" : "Hata"}</span></td>
                        <td className="py-2 text-[9px] font-mono text-muted-foreground">{job.traceId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <AnimatePresence>
                {selectedJob && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-border/40">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-semibold text-foreground">Job Detayı: {selectedJob.id}</p>
                      <button onClick={() => setSelectedJobId(null)} className="p-1 rounded hover:bg-secondary"><X className="h-3 w-3 text-muted-foreground" /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] mb-2">
                      <div><span className="text-muted-foreground">Trace:</span> <span className="font-mono text-foreground">{selectedJob.traceId}</span></div>
                      <div><span className="text-muted-foreground">Süre:</span> <span className="text-foreground">{selectedJob.duration}</span></div>
                      <div><span className="text-muted-foreground">Kayıt:</span> <span className="text-foreground">{selectedJob.records}</span></div>
                    </div>
                    {selectedJob.error && (
                      <div className="p-2 rounded-lg bg-destructive/5 border border-destructive/15 mb-2">
                        <p className="text-[9px] text-destructive font-mono">{selectedJob.error}</p>
                      </div>
                    )}
                    {selectedJob.status === "error" && (
                      <button onClick={() => { toast.success(`${selectedJob.id} yeniden deneniyor...`); setSelectedJobId(null); }}
                        className="text-[9px] font-medium px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all flex items-center gap-1">
                        <RotateCcw className="h-2.5 w-2.5" /> Yeniden Dene
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassPanel>
          </Section>
        )}

        {/* ── G) KNOWN FAILURES ── */}
        <Section icon={AlertTriangle} title="Bilinen Hata Senaryoları">
          <GlassPanel>
            <div className="space-y-1.5">
              {connector.common_failure_modes.map((mode, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-warning/5 border border-warning/10">
                  <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
                  <span className="text-[10px] text-foreground">{mode}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </Section>

        {/* ── H) AI IMPACT MAP ── */}
        <Section icon={Zap} title="AI Etki Haritası">
          <GlassPanel>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Kapsanan Metrikler</p>
                <div className="space-y-1">
                  {connector.coverage_impact.metrics_covered.map(m => (
                    <div key={m} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03]">
                      <TrendingUp className="h-2.5 w-2.5 text-primary" />
                      <span className="text-[10px] text-foreground">{m.replace(/_/g, " ")}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Etkilenen Ajanlar</p>
                <div className="space-y-1">
                  {connector.coverage_impact.agents_impacted.map(a => (
                    <div key={a} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03]">
                      <Zap className="h-2.5 w-2.5 text-warning" />
                      <span className="text-[10px] text-foreground capitalize">{a.replace(/-/g, " ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassPanel>
        </Section>

        {/* ── I) SECURITY & COMPLIANCE ── */}
        <Section icon={Shield} title="Güvenlik & Uyumluluk">
          <GlassPanel>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { icon: ShieldCheck, text: `${connector.access_method === "oauth" ? "OAuth 2.0" : "API Key"} ile güvenli bağlantı` },
                { icon: Lock, text: "Token'lar şifreli olarak saklanır (AES-256)" },
                { icon: Eye, text: "Minimum yetki ilkesi (Least Privilege)" },
                { icon: FileText, text: "Tüm işlemler denetim günlüğüne kaydedilir" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/5 border border-success/10">
                  <item.icon className="h-3 w-3 text-success shrink-0" />
                  <span className="text-[10px] text-success">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowExportModal(true)} className="text-[10px] font-medium px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all flex items-center gap-1">
                <Download className="h-3 w-3" /> Veri Dışa Aktarma Talebi
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="text-[10px] font-medium px-3 py-1.5 rounded-lg bg-destructive/5 border border-destructive/15 text-destructive hover:bg-destructive/10 transition-all flex items-center gap-1">
                <Trash2 className="h-3 w-3" /> Veri Silme Talebi
              </button>
            </div>
          </GlassPanel>
        </Section>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {showExportModal && (
          <ModalOverlay onClose={() => setShowExportModal(false)}>
            <h3 className="text-sm font-semibold text-foreground mb-3">Veri Dışa Aktarma Talebi</h3>
            <p className="text-[10px] text-muted-foreground mb-4">
              {connector.name_tr} ile ilişkili tüm senkronize veriler CSV formatında dışa aktarılacak ve e-posta ile gönderilecektir.
            </p>
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => setShowExportModal(false)} className="text-[10px] px-3 py-1.5 rounded-lg bg-secondary/60 border border-border text-muted-foreground hover:text-foreground transition-all">İptal</button>
              <button onClick={handleExportRequest} className="btn-primary px-4 py-1.5 text-[10px] font-medium">Talebi Oluştur</button>
            </div>
          </ModalOverlay>
        )}

        {showDeleteModal && (
          <ModalOverlay onClose={() => setShowDeleteModal(false)}>
            <h3 className="text-sm font-semibold text-destructive mb-3">⚠️ Veri Silme Talebi</h3>
            <p className="text-[10px] text-muted-foreground mb-3">
              Bu işlem {connector.name_tr} ile ilişkili tüm senkronize verilerin kalıcı olarak silinmesini talep eder. İşlem 72 saat içinde tamamlanır ve geri alınamaz.
            </p>
            <input value={deleteReason} onChange={e => setDeleteReason(e.target.value)} placeholder="Silme sebebi..." className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-border/40 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-destructive/40 mb-3" />
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => { setShowDeleteModal(false); setDeleteReason(""); }} className="text-[10px] px-3 py-1.5 rounded-lg bg-secondary/60 border border-border text-muted-foreground hover:text-foreground transition-all">İptal</button>
              <button onClick={handleDeleteRequest} className="text-[10px] font-medium px-4 py-1.5 rounded-lg bg-destructive text-white hover:bg-destructive/80 transition-all">Silme Talebi Oluştur</button>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

/* ── Modal Overlay ── */
const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md mx-4 glass-card border border-border rounded-2xl p-5">
      {children}
    </motion.div>
  </div>
);

export default TechIntegrationDetail;