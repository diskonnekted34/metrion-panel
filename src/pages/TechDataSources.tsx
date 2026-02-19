import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, Search, CheckCircle2, AlertCircle, Plug, Clock,
  RefreshCw, Settings2, Shield, TrendingUp, AlertTriangle,
  ChevronRight, Zap, Filter, MoreVertical, Play, Eye, Unplug,
  FileText, ChevronDown, X,
} from "lucide-react";
import {
  GitBranch, ListTodo, Rocket, Cloud, Container, Activity, Bug,
  Key, ShieldCheck, Siren, Globe, DollarSign, Workflow, BookOpen,
  Headphones, MessageSquare,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import TechConnectWizard from "@/components/tech-datasources/TechConnectWizard";
import {
  TechConnectorCategory, TechConnector, TechConnectorCategoryDef,
  techCategories, techConnectors as defaultConnectors,
  calculateCoverage, getCTOImpact, getCIOImpact,
  computeHealthScore, computeRiskLevel,
} from "@/data/techIntegrations";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const iconMap: Record<string, React.ElementType> = {
  GitBranch, ListTodo, Rocket, Cloud, Container, Activity, FileText, Bug,
  Shield: ShieldCheck, Key, ShieldCheck, Siren, Globe, DollarSign, Database,
  Workflow, BookOpen, Headphones, MessageSquare,
};

type StatusFilter = "all" | "connected" | "available" | "error";
type OwnerFilter = "all" | "cto" | "cio" | "shared";

/* ═══════════════ MAIN PAGE ═══════════════ */
const TechDataSources = () => {
  const navigate = useNavigate();
  const [connectors, setConnectors] = useState<TechConnector[]>(defaultConnectors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("all");
  const [wizardConnector, setWizardConnector] = useState<TechConnector | null>(null);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [batchSyncing, setBatchSyncing] = useState(false);
  const [kebabOpen, setKebabOpen] = useState<string | null>(null);
  const [missingCatModal, setMissingCatModal] = useState(false);
  const categorySectionRef = useRef<HTMLDivElement>(null);

  // ── Derived data ──
  const connectedSystems = useMemo(() => connectors.filter(c => c.status === "connected"), [connectors]);
  const errorSystems = useMemo(() => connectors.filter(c => c.status === "error"), [connectors]);
  const coverage = useMemo(() => calculateCoverage(connectors), [connectors]);
  const cto = useMemo(() => getCTOImpact(connectors), [connectors]);
  const cio = useMemo(() => getCIOImpact(connectors), [connectors]);
  const ctoPct = cto.total > 0 ? Math.round((cto.covered / cto.total) * 100) : 0;
  const cioPct = cio.total > 0 ? Math.round((cio.covered / cio.total) * 100) : 0;
  const missingCats = coverage.filter(c => c.connected === 0);
  const avgHealth = connectedSystems.length > 0
    ? Math.round(connectedSystems.reduce((s, c) => s + computeHealthScore(c).score, 0) / connectedSystems.length)
    : 0;
  const overallPct = connectors.filter(c => c.status !== "disabled").length > 0
    ? Math.round((connectedSystems.length / connectors.filter(c => c.status !== "disabled").length) * 100)
    : 0;

  // ── Grouped categories ──
  const grouped = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return techCategories
      .filter(cat => ownerFilter === "all" || cat.owner === ownerFilter)
      .map(cat => {
        let items = connectors.filter(c => c.category === cat.id);
        if (q) items = items.filter(c => c.name_tr.toLowerCase().includes(q) || c.vendor.toLowerCase().includes(q) || cat.name_tr.toLowerCase().includes(q));
        if (statusFilter === "connected") items = items.filter(c => c.status === "connected");
        else if (statusFilter === "error") items = items.filter(c => c.status === "error");
        else if (statusFilter === "available") items = items.filter(c => c.status === "available");
        const connectedCount = items.filter(c => c.status === "connected").length;
        return { cat, items, connectedCount };
      })
      .filter(g => g.items.length > 0);
  }, [connectors, searchQuery, statusFilter, ownerFilter]);

  // Recommended next connections
  const recommendedNext = useMemo(() => {
    const critical: TechConnectorCategory[] = ["security", "iam", "waf_edge", "logging", "observability"];
    return connectors
      .filter(c => c.status === "available" && critical.includes(c.category))
      .slice(0, 3);
  }, [connectors]);

  // ── Handlers ──
  const handleConnect = useCallback((id: string) => {
    const conn = connectors.find(c => c.id === id);
    if (conn) setWizardConnector(conn);
  }, [connectors]);

  const handleSync = useCallback((id: string) => {
    const conn = connectors.find(c => c.id === id);
    if (!conn || conn.status !== "connected") return;
    setSyncingIds(prev => new Set(prev).add(id));
    toast.loading(`${conn.name_tr} senkronizasyonu başlatıldı...`, { id: `sync-${id}` });
    setTimeout(() => {
      setConnectors(prev => prev.map(c =>
        c.id === id ? { ...c, last_sync_at: new Date().toISOString(), last_sync_status: "ok" as const } : c
      ));
      setSyncingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      toast.success(`${conn.name_tr} senkronizasyonu tamamlandı.`, { id: `sync-${id}` });
    }, 2000);
  }, [connectors]);

  const handleManage = useCallback((id: string) => {
    navigate(`/tech-data-sources/${id}`);
  }, [navigate]);

  const handleTestConnection = useCallback((id: string) => {
    const conn = connectors.find(c => c.id === id);
    if (!conn) return;
    toast.loading(`${conn.name_tr} bağlantı testi yapılıyor...`, { id: `test-${id}` });
    setTimeout(() => {
      if (conn.status === "error") {
        toast.error(`${conn.name_tr} bağlantı testi başarısız.`, { id: `test-${id}` });
      } else {
        toast.success(`${conn.name_tr} bağlantı testi başarılı.`, { id: `test-${id}` });
      }
    }, 1500);
  }, [connectors]);

  const handleDisconnect = useCallback((id: string) => {
    const conn = connectors.find(c => c.id === id);
    if (!conn) return;
    setConnectors(prev => prev.map(c =>
      c.id === id ? { ...c, status: "available" as const, last_sync_at: null, last_sync_status: "never" as const, error_message_tr: null, environment_scope_selected: [] } : c
    ));
    toast.success(`${conn.name_tr} bağlantısı kesildi. Token'lar silindi.`);
  }, [connectors]);

  const handleBatchSync = useCallback(() => {
    if (connectedSystems.length === 0) return;
    setBatchSyncing(true);
    toast.loading(`${connectedSystems.length} sistem senkronize ediliyor...`, { id: "batch" });
    const ids = connectedSystems.map(c => c.id);
    ids.forEach(id => setSyncingIds(prev => new Set(prev).add(id)));
    setTimeout(() => {
      setConnectors(prev => prev.map(c =>
        ids.includes(c.id) ? { ...c, last_sync_at: new Date().toISOString(), last_sync_status: "ok" as const } : c
      ));
      setSyncingIds(new Set());
      setBatchSyncing(false);
      toast.success(`${ids.length} sistem başarıyla senkronize edildi.`, { id: "batch" });
    }, 3000);
  }, [connectedSystems]);

  const handleWizardComplete = useCallback((id: string) => {
    setConnectors(prev => prev.map(c =>
      c.id === id ? { ...c, status: "connected" as const, last_sync_at: new Date().toISOString(), last_sync_status: "ok" as const, error_message_tr: null, environment_scope_selected: ["prod"] } : c
    ));
    setWizardConnector(null);
    const name = connectors.find(c => c.id === id)?.name_tr || id;
    toast.success(`${name} başarıyla bağlandı.`);
  }, [connectors]);

  const handleScrollToCategory = useCallback((catId: TechConnectorCategory) => {
    setOpenAccordions(prev => prev.includes(catId) ? prev : [...prev, catId]);
    setStatusFilter("all");
    setOwnerFilter("all");
    setSearchQuery("");
    setTimeout(() => {
      document.getElementById(`cat-${catId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  }, []);

  const handleFilterChange = useCallback((f: StatusFilter) => {
    setStatusFilter(prev => prev === f ? "all" : f);
  }, []);

  const getCatIcon = (iconName: string) => iconMap[iconName] || Database;

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* ═══════════ HEADER ═══════════ */}
          <div className="glass-card p-5 mb-5">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
              </div>

              {/* Quick Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 px-3 rounded-lg bg-primary/10 border border-primary/25 text-[10px] font-medium text-primary hover:bg-primary/15 transition-all flex items-center gap-1.5">
                    <Zap className="h-3 w-3" /> Hızlı İşlemler <ChevronDown className="h-2.5 w-2.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleBatchSync} disabled={batchSyncing || connectedSystems.length === 0}>
                    <RefreshCw className={`h-3.5 w-3.5 mr-2 ${batchSyncing ? "animate-spin" : ""}`} />
                    Tüm Bağlıları Senkronize Et
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange("error")}>
                    <AlertCircle className="h-3.5 w-3.5 mr-2" />
                    Hataları İncele
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMissingCatModal(true)}>
                    <AlertTriangle className="h-3.5 w-3.5 mr-2" />
                    Eksik Kategori Rehberi
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-5 gap-2 mb-5">
              {([
                { label: "Bağlı", value: connectedSystems.length, icon: CheckCircle2, accent: "text-success", filter: "connected" as StatusFilter },
                { label: "Kullanılabilir", value: connectors.filter(c => c.status !== "disabled").length, icon: Plug, accent: "text-muted-foreground", filter: "all" as StatusFilter },
                { label: "Aktif Sync", value: syncingIds.size, icon: RefreshCw, accent: "text-primary", filter: "all" as StatusFilter },
                { label: "Hata", value: errorSystems.length, icon: AlertCircle, accent: errorSystems.length > 0 ? "text-destructive" : "text-muted-foreground", filter: "error" as StatusFilter },
                { label: "Sağlık", value: `${avgHealth}%`, icon: TrendingUp, accent: "text-primary", filter: "all" as StatusFilter },
              ]).map(m => {
                const isActive = statusFilter === m.filter && m.filter !== "all";
                return (
                  <button
                    key={m.label}
                    onClick={() => m.filter !== "all" && handleFilterChange(m.filter)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left ${
                      isActive ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20" : "bg-white/[0.03] border-border/40 hover:border-border/60"
                    }`}
                  >
                    <div className="h-7 w-7 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                      <m.icon className={`h-3.5 w-3.5 ${m.accent}`} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-foreground leading-none">{m.value}</p>
                      <p className="text-[8px] text-muted-foreground mt-0.5">{m.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Coverage Bars */}
            <div className="grid grid-cols-2 gap-3">
              <CoverageBar label="CTO Kapsamı" subtitle="Mühendislik & Ürün" pct={ctoPct} count={`${cto.covered}/${cto.total}`} color="bg-primary" />
              <CoverageBar label="CIO Kapsamı" subtitle="Altyapı & Güvenlik" pct={cioPct} count={`${cio.covered}/${cio.total}`} color="bg-purple-500" />
            </div>

            {/* Coverage Status Panel */}
            {(missingCats.length > 0 || recommendedNext.length > 0) && (
              <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Veri Kapsam Durumu</span>
                  <span className="text-[10px] font-bold text-foreground">{overallPct}% Kapsam</span>
                </div>
                {missingCats.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    <span className="text-[9px] text-muted-foreground mr-1">Eksik:</span>
                    {missingCats.slice(0, 5).map(mc => (
                      <button
                        key={mc.category}
                        onClick={() => handleScrollToCategory(mc.category)}
                        className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20 transition-all cursor-pointer"
                      >
                        {mc.category_name_tr}
                      </button>
                    ))}
                  </div>
                )}
                {recommendedNext.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] text-muted-foreground mr-1">Önerilen:</span>
                    {recommendedNext.map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleConnect(c.id)}
                        className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
                      >
                        {c.name_tr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ═══════════ ALERTS ═══════════ */}
          {errorSystems.length > 0 ? (
            <div className="glass-card p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Aktif Uyarılar</h2>
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 ml-auto">
                  {errorSystems.length} hata
                </span>
              </div>
              <div className="space-y-1.5">
                {errorSystems.map(sys => (
                  <div key={sys.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-destructive/5 border border-destructive/15">
                    <div className="h-2 w-2 rounded-full bg-destructive animate-pulse shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-foreground">{sys.name_tr}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{sys.error_message_tr}</p>
                    </div>
                    <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">Kritik</span>
                    <button
                      onClick={() => handleConnect(sys.id)}
                      className="text-[9px] font-medium px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-all flex items-center gap-1"
                    >
                      <Zap className="h-2.5 w-2.5" /> Düzelt
                    </button>
                  </div>
                ))}
              </div>
              {missingCats.filter(mc => ["security", "iam", "waf_edge"].includes(mc.category)).length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {missingCats.filter(mc => ["security", "iam", "waf_edge"].includes(mc.category)).map(mc => (
                    <div key={mc.category} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-warning/5 border border-warning/15">
                      <div className="h-2 w-2 rounded-full bg-warning shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-foreground">{mc.category_name_tr}</p>
                        <p className="text-[9px] text-muted-foreground">Kritik kategori — bağlı sistem yok</p>
                      </div>
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-warning/10 text-warning">Uyarı</span>
                      <button
                        onClick={() => handleScrollToCategory(mc.category)}
                        className="text-[9px] font-medium px-2.5 py-1 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20 transition-all flex items-center gap-1"
                      >
                        Görüntüle
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-4 mb-5 flex items-center gap-3 border-success/15">
              <div className="h-8 w-8 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xs font-semibold text-success">Tüm Sistemler Operasyonel</p>
                <p className="text-[10px] text-muted-foreground">Aktif hata bulunmuyor.</p>
              </div>
            </div>
          )}

          {/* ═══════════ CONNECTED SYSTEMS ═══════════ */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3 px-1">
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Bağlı Teknoloji Sistemleri</h2>
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                {connectedSystems.length}
              </span>
            </div>
            {connectedSystems.length > 0 ? (
              <div className="grid gap-2">
                {connectedSystems.map(c => {
                  const cat = techCategories.find(tc => tc.id === c.category);
                  const Icon = getCatIcon(cat?.icon_name || "Database");
                  const health = computeHealthScore(c);
                  const healthDot = health.state === "green" ? "bg-success" : health.state === "yellow" ? "bg-warning" : "bg-destructive";
                  const isSyncing = syncingIds.has(c.id);

                  return (
                    <div
                      key={c.id}
                      onClick={() => handleManage(c.id)}
                      className="glass-card p-3.5 flex items-center gap-3 border-primary/10 hover:border-primary/25 transition-all cursor-pointer group"
                      style={{ boxShadow: "0 0 12px -4px hsl(var(--primary) / 0.1)" }}
                    >
                      <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">{c.name_tr}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] text-muted-foreground">{cat?.name_tr}</span>
                          {c.last_sync_at && (
                            <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                              <Clock className="h-2 w-2" />
                              {new Date(c.last_sync_at).toLocaleString("tr-TR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className={`h-2.5 w-2.5 rounded-full ${healthDot}`} />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-[10px]">
                            Sağlık: {health.score}% — {health.state === "green" ? "İyi" : health.state === "yellow" ? "Uyarı" : "Kritik"}
                          </TooltipContent>
                        </Tooltip>
                        <button
                          onClick={() => handleSync(c.id)}
                          disabled={isSyncing}
                          className="h-7 px-2.5 rounded-lg bg-secondary/60 border border-border text-[9px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center gap-1 disabled:opacity-50"
                        >
                          <RefreshCw className={`h-2.5 w-2.5 ${isSyncing ? "animate-spin" : ""}`} />
                          {isSyncing ? "..." : "Sync"}
                        </button>
                        <button
                          onClick={() => handleManage(c.id)}
                          className="h-7 px-2.5 rounded-lg bg-primary/10 border border-primary/25 text-[9px] font-medium text-primary hover:bg-primary/15 transition-all flex items-center gap-1"
                        >
                          <Settings2 className="h-2.5 w-2.5" /> Yönet
                        </button>
                        <ConnectorKebab
                          connector={c}
                          onTestConnection={() => handleTestConnection(c.id)}
                          onViewLogs={() => navigate(`/tech-data-sources/${c.id}#logs`)}
                          onPermissions={() => navigate(`/tech-data-sources/${c.id}#auth`)}
                          onDisconnect={() => handleDisconnect(c.id)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">
                  <Plug className="h-6 w-6 text-muted-foreground opacity-40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Henüz bağlı teknoloji sistemi yok</p>
                <p className="text-[10px] text-muted-foreground mb-4">İlk sisteminizi bağlayarak veri katmanınızı oluşturun.</p>
                <button
                  onClick={() => { const first = connectors.find(c => c.status === "available"); if (first) setWizardConnector(first); }}
                  className="btn-primary px-4 py-2 text-xs font-medium flex items-center gap-1.5"
                >
                  <Plug className="h-3.5 w-3.5" /> İlk Sistemi Bağla
                </button>
              </div>
            )}
          </div>

          {/* ═══════════ CATEGORY GRID ═══════════ */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3 px-1">
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Mimari Kategoriler</h2>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {techCategories.map(cat => {
                const Icon = getCatIcon(cat.icon_name);
                const cov = coverage.find(c => c.category === cat.id);
                const connCount = cov?.connected || 0;
                const totalCount = cov?.total || 0;
                const pct = cov?.percent || 0;
                const ownerColor = cat.owner === "cto" ? "text-primary bg-primary/10" : cat.owner === "cio" ? "text-purple-400 bg-purple-400/10" : "text-muted-foreground bg-white/[0.04]";
                const hasMissing = connCount === 0 && totalCount > 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleScrollToCategory(cat.id)}
                    className="glass-card p-3 text-left hover:border-primary/25 transition-all group relative"
                  >
                    {hasMissing && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className={`text-[7px] font-bold px-1 py-0.5 rounded uppercase ${ownerColor}`}>{cat.owner}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-foreground mb-1 leading-tight">{cat.name_tr}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-muted-foreground">{connCount}/{totalCount}</span>
                      <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${pct === 100 ? "bg-success" : pct > 0 ? "bg-primary" : "bg-destructive/40"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ═══════════ FILTERS + SEARCH ═══════════ */}
          <div className="flex items-center justify-between mb-3 px-1" ref={categorySectionRef}>
            <div className="flex items-center gap-1">
              {(["all", "connected", "available", "error"] as StatusFilter[]).map(f => (
                <button key={f} onClick={() => setStatusFilter(f)} className={`text-[9px] font-medium px-2 py-1 rounded-lg border transition-all ${statusFilter === f ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/[0.03] border-border/40 text-muted-foreground hover:border-border/60"}`}>
                  {f === "all" ? "Tümü" : f === "connected" ? "Bağlı" : f === "available" ? "Kullanılabilir" : "Hata"}
                </button>
              ))}
              <div className="w-px h-4 bg-border/40 mx-1" />
              {(["all", "cto", "cio", "shared"] as OwnerFilter[]).map(f => (
                <button key={f} onClick={() => setOwnerFilter(f)} className={`text-[9px] font-medium px-2 py-1 rounded-lg border transition-all ${ownerFilter === f ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/[0.03] border-border/40 text-muted-foreground hover:border-border/60"}`}>
                  {f === "all" ? "Tümü" : f.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="relative w-52">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Sistem ara..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-border/40 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {/* ═══════════ ACCORDION CATEGORIES ═══════════ */}
          {grouped.length > 0 ? (
            <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="space-y-1">
              {grouped.map(({ cat, items, connectedCount }) => {
                const Icon = getCatIcon(cat.icon_name);
                const covEntry = coverage.find(c => c.category === cat.id);
                const covPct = covEntry?.percent || 0;
                const ownerColor = cat.owner === "cto" ? "text-primary bg-primary/10" : cat.owner === "cio" ? "text-purple-400 bg-purple-400/10" : "text-muted-foreground bg-white/[0.04]";
                const riskLabel = covPct === 0 ? "Yüksek Risk" : covPct < 50 ? "Orta Risk" : covPct === 100 ? "Tam Kapsam" : "İyi";
                const riskColor = covPct === 0 ? "text-destructive bg-destructive/10" : covPct < 50 ? "text-warning bg-warning/10" : "text-success bg-success/10";

                return (
                  <AccordionItem key={cat.id} value={cat.id} id={`cat-${cat.id}`} className="border-none">
                    <AccordionTrigger className="py-2.5 px-3 rounded-xl hover:no-underline hover:bg-white/[0.03] transition-colors">
                      <div className="flex items-center gap-3 w-full">
                        <div className="h-7 w-7 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-[11px] font-semibold text-foreground">{cat.name_tr}</span>
                        <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${ownerColor}`}>{cat.owner.toUpperCase()}</span>
                        <div className="flex items-center gap-2 ml-auto mr-2">
                          <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded ${riskColor}`}>{riskLabel}</span>
                          <span className="text-[9px] text-muted-foreground">{connectedCount}/{items.length}</span>
                          <div className="w-12 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${covPct === 100 ? "bg-success" : covPct > 0 ? "bg-primary" : "bg-destructive/40"}`} style={{ width: `${covPct}%` }} />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-1 pt-0.5">
                      <div className="px-3 py-2 mb-1">
                        <p className="text-[10px] text-muted-foreground">{cat.description_tr}</p>
                      </div>
                      <div className="space-y-0.5 pl-1">
                        {items.map(c => (
                          <ConnectorRow
                            key={c.id}
                            connector={c}
                            category={cat}
                            onConnect={() => handleConnect(c.id)}
                            onSync={() => handleSync(c.id)}
                            onManage={() => handleManage(c.id)}
                            onTestConnection={() => handleTestConnection(c.id)}
                            onDisconnect={() => handleDisconnect(c.id)}
                            syncing={syncingIds.has(c.id)}
                            navigate={navigate}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="glass-card p-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-xs text-muted-foreground">Arama kriterlerine uygun sistem bulunamadı.</p>
              <button onClick={() => { setSearchQuery(""); setStatusFilter("all"); setOwnerFilter("all"); }} className="text-[10px] text-primary hover:underline mt-2">
                Filtreleri Temizle
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Connect Wizard */}
      <TechConnectWizard connector={wizardConnector} open={!!wizardConnector} onClose={() => setWizardConnector(null)} onComplete={handleWizardComplete} />

      {/* Missing Category Modal */}
      <AnimatePresence>
        {missingCatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMissingCatModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md mx-4 glass-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Eksik Kategori Rehberi</h3>
                <button onClick={() => setMissingCatModal(false)} className="p-1 rounded-lg hover:bg-secondary"><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <div className="p-5 max-h-80 overflow-y-auto space-y-2">
                {missingCats.length > 0 ? missingCats.map(mc => {
                  const cat = techCategories.find(c => c.id === mc.category);
                  return (
                    <div key={mc.category} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-warning/5 border border-warning/15">
                      <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-foreground">{mc.category_name_tr}</p>
                        <p className="text-[9px] text-muted-foreground">{cat?.description_tr}</p>
                      </div>
                      <button onClick={() => { setMissingCatModal(false); handleScrollToCategory(mc.category); }} className="text-[9px] font-medium px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all">
                        Görüntüle
                      </button>
                    </div>
                  );
                }) : (
                  <div className="text-center py-6">
                    <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                    <p className="text-xs text-success font-medium">Tüm kategorilerde en az bir bağlantı mevcut.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

/* ═══ Coverage Bar ═══ */
const CoverageBar = ({ label, subtitle, pct, count, color }: { label: string; subtitle: string; pct: number; count: string; color: string }) => (
  <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-border/40">
    <div className="flex items-center justify-between mb-1.5">
      <div>
        <span className="text-[11px] font-semibold text-foreground">{label}</span>
        <span className="text-[9px] text-muted-foreground ml-2">{subtitle}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground">{count}</span>
        <span className="text-xs font-bold text-foreground">{pct}%</span>
      </div>
    </div>
    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  </div>
);

/* ═══ Connector Row ═══ */
const ConnectorRow = ({
  connector: c, category: cat, onConnect, onSync, onManage, onTestConnection, onDisconnect, syncing, navigate,
}: {
  connector: TechConnector; category: TechConnectorCategoryDef; onConnect: () => void; onSync: () => void;
  onManage: () => void; onTestConnection: () => void; onDisconnect: () => void; syncing: boolean; navigate: (path: string) => void;
}) => {
  const isConnected = c.status === "connected";
  const isError = c.status === "error";

  return (
    <div
      onClick={() => navigate(`/tech-data-sources/${c.id}`)}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border cursor-pointer ${
        isError ? "bg-destructive/5 border-destructive/10" :
        isConnected ? "bg-primary/[0.03] border-primary/10" :
        "border-transparent hover:bg-white/[0.03] hover:border-border/40"
      }`}
    >
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
        isConnected ? "bg-primary/10" : isError ? "bg-destructive/10" : "bg-white/[0.04]"
      }`}>
        {isConnected ? <CheckCircle2 className="h-3 w-3 text-success" /> :
         isError ? <AlertCircle className="h-3 w-3 text-destructive" /> :
         <Plug className="h-3 w-3 text-muted-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-medium text-foreground">{c.name_tr}</p>
          <span className="text-[9px] text-muted-foreground">• {c.vendor}</span>
        </div>
        {isConnected && c.last_sync_at && (
          <p className="text-[9px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
            <Clock className="h-2 w-2" /> Son: {new Date(c.last_sync_at).toLocaleString("tr-TR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
        {isError && c.error_message_tr && (
          <p className="text-[9px] text-destructive truncate mt-0.5">{c.error_message_tr}</p>
        )}
        {!isConnected && !isError && (
          <p className="text-[9px] text-muted-foreground truncate mt-0.5">{c.description_tr}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
        {isConnected ? (
          <>
            <button onClick={onSync} disabled={syncing} className="text-[9px] font-medium px-2 py-1 rounded-lg bg-secondary/60 border border-border hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all flex items-center gap-1 disabled:opacity-50">
              <RefreshCw className={`h-2.5 w-2.5 ${syncing ? "animate-spin" : ""}`} /> Sync
            </button>
            <button onClick={onManage} className="text-[9px] font-medium px-2 py-1 rounded-lg bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 transition-all flex items-center gap-1">
              <Settings2 className="h-2.5 w-2.5" /> Yönet
            </button>
            <ConnectorKebab
              connector={c}
              onTestConnection={onTestConnection}
              onViewLogs={() => navigate(`/tech-data-sources/${c.id}#logs`)}
              onPermissions={() => navigate(`/tech-data-sources/${c.id}#auth`)}
              onDisconnect={onDisconnect}
            />
          </>
        ) : isError ? (
          <button onClick={onConnect} className="text-[9px] font-medium px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all flex items-center gap-1">
            <RefreshCw className="h-2.5 w-2.5" /> Yeniden Bağlan
          </button>
        ) : (
          <button onClick={onConnect} className="text-[9px] font-medium px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all flex items-center gap-1">
            <Plug className="h-2.5 w-2.5" /> Bağlan
          </button>
        )}
      </div>
    </div>
  );
};

/* ═══ Kebab Menu ═══ */
const ConnectorKebab = ({
  connector, onTestConnection, onViewLogs, onPermissions, onDisconnect,
}: {
  connector: TechConnector; onTestConnection: () => void; onViewLogs: () => void; onPermissions: () => void; onDisconnect: () => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="h-7 w-7 rounded-lg bg-white/[0.03] border border-border/40 flex items-center justify-center hover:bg-white/[0.06] transition-all">
        <MoreVertical className="h-3 w-3 text-muted-foreground" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem onClick={onTestConnection}>
        <Play className="h-3.5 w-3.5 mr-2" /> Bağlantıyı Test Et
      </DropdownMenuItem>
      {connector.status === "connected" && (
        <>
          <DropdownMenuItem onClick={onViewLogs}>
            <Eye className="h-3.5 w-3.5 mr-2" /> Logları Görüntüle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPermissions}>
            <Shield className="h-3.5 w-3.5 mr-2" /> İzinler
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDisconnect} className="text-destructive focus:text-destructive">
            <Unplug className="h-3.5 w-3.5 mr-2" /> Bağlantıyı Kes
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default TechDataSources;