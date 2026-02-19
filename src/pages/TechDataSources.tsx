import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, Search, CheckCircle2, AlertCircle, Plug, Clock,
  RefreshCw, Settings2, Shield, TrendingUp, AlertTriangle,
  ChevronRight, Zap, ExternalLink, ArrowDown, Filter,
} from "lucide-react";
import {
  GitBranch, ListTodo, Rocket, Cloud, Container, Activity, FileText, Bug,
  Key, ShieldCheck, Siren, Globe, DollarSign, Workflow, BookOpen,
  Headphones, MessageSquare,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import TechConnectWizard from "@/components/tech-datasources/TechConnectWizard";
import {
  TechConnectorCategory, TechConnector,
  techCategories, techConnectors as defaultConnectors,
  calculateCoverage, getCTOImpact, getCIOImpact,
} from "@/data/techIntegrations";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const iconMap: Record<string, React.ElementType> = {
  GitBranch, ListTodo, Rocket, Cloud, Container, Activity, FileText, Bug,
  Shield: ShieldCheck, Key, ShieldCheck, Siren, Globe, DollarSign, Database,
  Workflow, BookOpen, Headphones, MessageSquare,
};

type StatusFilter = "all" | "connected" | "error" | "available";

/* ══════════════════════════════════════════════
   LAYER 1 — EXECUTIVE OVERVIEW (Clickable Metrics)
   ══════════════════════════════════════════════ */
const ExecutiveOverview = ({
  connectors,
  activeFilter,
  onFilterChange,
}: {
  connectors: TechConnector[];
  activeFilter: StatusFilter;
  onFilterChange: (f: StatusFilter) => void;
}) => {
  const connected = connectors.filter(c => c.status === "connected").length;
  const errors = connectors.filter(c => c.status === "error").length;
  const coverage = calculateCoverage(connectors);
  const missingCats = coverage.filter(c => c.connected === 0).length;
  const avgHealth = coverage.length > 0
    ? Math.round(coverage.reduce((s, c) => s + c.percent, 0) / coverage.length)
    : 0;
  const overallPct = connectors.length > 0
    ? Math.round((connected / connectors.length) * 100)
    : 0;
  const cto = getCTOImpact(connectors);
  const cio = getCIOImpact(connectors);
  const ctoPct = cto.total > 0 ? Math.round((cto.covered / cto.total) * 100) : 0;
  const cioPct = cio.total > 0 ? Math.round((cio.covered / cio.total) * 100) : 0;

  const metrics: { label: string; value: string | number; icon: React.ElementType; accent: string; filter: StatusFilter }[] = [
    { label: "Bağlı Sistem", value: connected, icon: CheckCircle2, accent: "text-success", filter: "connected" },
    { label: "Kritik Hata", value: errors, icon: AlertCircle, accent: errors > 0 ? "text-destructive" : "text-muted-foreground", filter: "error" },
    { label: "Eksik Kategori", value: missingCats, icon: AlertTriangle, accent: missingCats > 0 ? "text-warning" : "text-muted-foreground", filter: "all" },
    { label: "Ort. Sağlık", value: `${avgHealth}%`, icon: Activity, accent: "text-primary", filter: "all" },
    { label: "Veri Kapsamı", value: `${overallPct}%`, icon: TrendingUp, accent: "text-primary", filter: "all" },
  ];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Database className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Teknoloji İstihbarat Konsolu</h1>
          <p className="text-[10px] text-muted-foreground">CTO & CIO veri katmanı izleme ve yönetim merkezi</p>
        </div>
      </div>

      {/* 5 Clickable Metrics */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {metrics.map(m => {
          const isActive = activeFilter === m.filter && m.filter !== "all";
          return (
            <button
              key={m.label}
              onClick={() => onFilterChange(m.filter === activeFilter ? "all" : m.filter)}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left ${
                isActive
                  ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20"
                  : "bg-white/[0.03] border-border/40 hover:border-border/60 hover:bg-white/[0.05]"
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

      {/* CTO / CIO Coverage Bars */}
      <div className="grid grid-cols-2 gap-3">
        <CoverageBar label="CTO Kapsamı" subtitle="Mühendislik & Ürün" pct={ctoPct} count={`${cto.covered}/${cto.total}`} color="bg-primary" />
        <CoverageBar label="CIO Kapsamı" subtitle="Altyapı & Güvenlik" pct={cioPct} count={`${cio.covered}/${cio.total}`} color="bg-purple-500" />
      </div>
    </div>
  );
};

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

/* ══════════════════════════════════════════════
   LAYER 2 — ACTIVE ALERTS & RISK PANEL
   ══════════════════════════════════════════════ */
const ActiveAlertsPanel = ({
  connectors,
  onConnect,
  onScrollToCategory,
}: {
  connectors: TechConnector[];
  onConnect: (id: string) => void;
  onScrollToCategory: (cat: TechConnectorCategory) => void;
}) => {
  const coverage = calculateCoverage(connectors);
  const missingCritical = coverage.filter(c => c.connected === 0);
  const errorSystems = connectors.filter(c => c.status === "error");
  const highSensitivity = connectors.filter(c => c.data_sensitivity === "high" && c.status === "connected");

  const alerts: { id: string; name: string; type: string; severity: "critical" | "warning" | "info"; action: () => void; actionLabel: string }[] = [];

  errorSystems.forEach(sys => {
    alerts.push({
      id: `err-${sys.id}`,
      name: sys.name_tr,
      type: sys.error_message_tr || "Bağlantı hatası",
      severity: "critical",
      action: () => onConnect(sys.id),
      actionLabel: "Düzelt",
    });
  });

  missingCritical.forEach(mc => {
    const criticalCats: TechConnectorCategory[] = ["vcs", "cicd", "cloud", "observability", "security"];
    if (criticalCats.includes(mc.category)) {
      alerts.push({
        id: `miss-${mc.category}`,
        name: mc.category_name_tr,
        type: "Kritik kategori — bağlı sistem yok",
        severity: "warning",
        action: () => onScrollToCategory(mc.category),
        actionLabel: "Görüntüle",
      });
    }
  });

  if (alerts.length === 0) {
    return (
      <div className="glass-card p-4 flex items-center gap-3 border-success/15">
        <div className="h-8 w-8 rounded-xl bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="h-4 w-4 text-success" />
        </div>
        <div>
          <p className="text-xs font-semibold text-success">Tüm Sistemler Operasyonel</p>
          <p className="text-[10px] text-muted-foreground">Aktif hata veya kritik boşluk bulunmuyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Aktif Uyarılar & Risk</h2>
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 ml-auto">
          {alerts.length} uyarı
        </span>
      </div>
      <div className="space-y-1.5">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
              alert.severity === "critical"
                ? "bg-destructive/5 border-destructive/15"
                : "bg-warning/5 border-warning/15"
            }`}
          >
            <div className={`h-2 w-2 rounded-full shrink-0 ${
              alert.severity === "critical" ? "bg-destructive animate-pulse" : "bg-warning"
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-foreground">{alert.name}</p>
              <p className="text-[9px] text-muted-foreground truncate">{alert.type}</p>
            </div>
            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
              alert.severity === "critical" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
            }`}>
              {alert.severity === "critical" ? "Kritik" : "Uyarı"}
            </span>
            <button
              onClick={alert.action}
              className={`text-[9px] font-medium px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                alert.severity === "critical"
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                  : "bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20"
              }`}
            >
              <Zap className="h-2.5 w-2.5" />
              {alert.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   LAYER 3 — CONNECTED SYSTEMS
   ══════════════════════════════════════════════ */
const ConnectedSystemCard = ({
  connector,
  onSync,
  syncing,
  onManage,
}: {
  connector: TechConnector;
  onSync: () => void;
  syncing: boolean;
  onManage: () => void;
}) => {
  const cat = techCategories.find(c => c.id === connector.category);
  const Icon = iconMap[cat?.icon_name || "Database"] || Database;
  const healthColor = connector.last_sync_status === "ok" ? "bg-success" :
    connector.last_sync_status === "partial" ? "bg-warning" : "bg-destructive";

  return (
    <div className="glass-card p-3.5 flex items-center gap-3 border-primary/10 hover:border-primary/25 transition-all group"
      style={{ boxShadow: "0 0 12px -4px hsl(var(--primary) / 0.1)" }}
    >
      <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground">{connector.name_tr}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[9px] text-muted-foreground">{cat?.name_tr}</span>
          {connector.last_sync_at && (
            <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
              <Clock className="h-2 w-2" />
              {new Date(connector.last_sync_at).toLocaleString("tr-TR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`h-2 w-2 rounded-full ${healthColor}`} title={connector.last_sync_status || "unknown"} />
        <button
          onClick={onSync}
          disabled={syncing}
          className="h-7 px-2.5 rounded-lg bg-secondary/60 border border-border text-[9px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center gap-1 disabled:opacity-50"
        >
          <RefreshCw className={`h-2.5 w-2.5 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "..." : "Sync"}
        </button>
        <button
          onClick={onManage}
          className="h-7 px-2.5 rounded-lg bg-primary/10 border border-primary/25 text-[9px] font-medium text-primary hover:bg-primary/15 transition-all flex items-center gap-1"
        >
          <Settings2 className="h-2.5 w-2.5" /> Yönet
        </button>
      </div>
    </div>
  );
};

const ConnectedEmptyState = ({ onConnect }: { onConnect: () => void }) => (
  <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
    <div className="h-12 w-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">
      <Plug className="h-6 w-6 text-muted-foreground opacity-40" />
    </div>
    <p className="text-sm font-medium text-muted-foreground mb-1">Henüz bağlı teknoloji sistemi yok</p>
    <p className="text-[10px] text-muted-foreground mb-4">İlk sisteminizi bağlayarak veri katmanınızı oluşturun.</p>
    <button
      onClick={onConnect}
      className="btn-primary px-4 py-2 text-xs font-medium flex items-center gap-1.5"
    >
      <Plug className="h-3.5 w-3.5" />
      İlk Sistemi Bağla
    </button>
  </div>
);

/* ══════════════════════════════════════════════
   LAYER 4 — ARCHITECTURE CATEGORIES (Actionable)
   ══════════════════════════════════════════════ */
const CategoryAccordionRow = ({
  connector,
  onConnect,
  onManage,
  onSync,
  syncing,
}: {
  connector: TechConnector;
  onConnect: (id: string) => void;
  onManage: (id: string) => void;
  onSync: (id: string) => void;
  syncing: boolean;
}) => {
  const isConnected = connector.status === "connected";
  const isError = connector.status === "error";
  const Icon = iconMap[connector.ui_assets.icon_name] || Database;

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border ${
      isError ? "bg-destructive/5 border-destructive/10" :
      isConnected ? "bg-primary/[0.03] border-primary/10" :
      "border-transparent hover:bg-white/[0.03] hover:border-border/40"
    }`}>
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
        isConnected ? "bg-primary/10" : isError ? "bg-destructive/10" : "bg-white/[0.04]"
      }`}>
        {isConnected ? <CheckCircle2 className="h-3 w-3 text-success" /> :
         isError ? <AlertCircle className="h-3 w-3 text-destructive" /> :
         <Plug className="h-3 w-3 text-muted-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-foreground">{connector.name_tr}</p>
        {isConnected && connector.last_sync_at && (
          <p className="text-[9px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
            <Clock className="h-2 w-2" />
            Son: {new Date(connector.last_sync_at).toLocaleString("tr-TR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
        {isError && connector.error_message_tr && (
          <p className="text-[9px] text-destructive truncate mt-0.5">{connector.error_message_tr}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {isConnected ? (
          <>
            <span className="h-2 w-2 rounded-full bg-success" />
            <button
              onClick={() => onSync(connector.id)}
              disabled={syncing}
              className="text-[9px] font-medium px-2 py-1 rounded-lg bg-secondary/60 border border-border hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`h-2.5 w-2.5 ${syncing ? "animate-spin" : ""}`} />
              Sync
            </button>
            <button
              onClick={() => onManage(connector.id)}
              className="text-[9px] font-medium px-2 py-1 rounded-lg bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 transition-all flex items-center gap-1"
            >
              <Settings2 className="h-2.5 w-2.5" /> Yönet
            </button>
          </>
        ) : isError ? (
          <button
            onClick={() => onConnect(connector.id)}
            className="text-[9px] font-medium px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all flex items-center gap-1"
          >
            <RefreshCw className="h-2.5 w-2.5" /> Yeniden Bağlan
          </button>
        ) : (
          <button
            onClick={() => onConnect(connector.id)}
            className="text-[9px] font-medium px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all flex items-center gap-1"
          >
            <Plug className="h-2.5 w-2.5" /> Bağlan
          </button>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
const TechDataSources = () => {
  const navigate = useNavigate();
  const [connectors, setConnectors] = useState<TechConnector[]>(defaultConnectors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [wizardConnector, setWizardConnector] = useState<TechConnector | null>(null);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const accordionRef = useRef<HTMLDivElement>(null);

  const connectedSystems = useMemo(() => connectors.filter(c => c.status === "connected"), [connectors]);
  const coverage = useMemo(() => calculateCoverage(connectors), [connectors]);

  // Group connectors by category with search + status filter
  const grouped = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return techCategories
      .map(cat => {
        let items = connectors.filter(c => c.category === cat.id);
        if (q) items = items.filter(c => c.name_tr.toLowerCase().includes(q) || c.vendor.toLowerCase().includes(q));
        if (statusFilter === "connected") items = items.filter(c => c.status === "connected");
        else if (statusFilter === "error") items = items.filter(c => c.status === "error");
        else if (statusFilter === "available") items = items.filter(c => c.status === "available");
        const connectedCount = items.filter(c => c.status === "connected").length;
        return { cat, items, connectedCount };
      })
      .filter(g => g.items.length > 0);
  }, [connectors, searchQuery, statusFilter]);

  const handleConnect = useCallback((id: string) => {
    const conn = connectors.find(c => c.id === id);
    if (conn) setWizardConnector(conn);
  }, [connectors]);

  const handleConnectFirst = useCallback(() => {
    // Open first available connector
    const first = connectors.find(c => c.status === "available");
    if (first) setWizardConnector(first);
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
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success(`${conn.name_tr} senkronizasyonu tamamlandı.`, { id: `sync-${id}` });
    }, 2000);
  }, [connectors]);

  const handleManage = useCallback((id: string) => {
    navigate(`/tech-data-sources/${id}`);
  }, [navigate]);

  const handleWizardComplete = useCallback((id: string) => {
    setConnectors(prev => prev.map(c =>
      c.id === id ? { ...c, status: "connected" as const, last_sync_at: new Date().toISOString(), last_sync_status: "ok" as const, error_message_tr: null } : c
    ));
    setWizardConnector(null);
    const name = connectors.find(c => c.id === id)?.name_tr || id;
    toast.success(`${name} başarıyla bağlandı.`);
  }, [connectors]);

  const handleScrollToCategory = useCallback((cat: TechConnectorCategory) => {
    setOpenAccordions(prev => prev.includes(cat) ? prev : [...prev, cat]);
    setTimeout(() => {
      const el = document.getElementById(`cat-${cat}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  }, []);

  const handleFilterChange = useCallback((f: StatusFilter) => {
    setStatusFilter(f);
    // Scroll to relevant section
    if (f === "connected" && connectedSystems.length > 0) {
      document.getElementById("connected-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (f === "error") {
      document.getElementById("alerts-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [connectedSystems]);

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        {/* LAYER 1: Executive Overview */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <ExecutiveOverview connectors={connectors} activeFilter={statusFilter} onFilterChange={handleFilterChange} />
        </motion.div>

        {/* LAYER 2: Active Alerts & Risk Panel */}
        <div id="alerts-section">
          <ActiveAlertsPanel connectors={connectors} onConnect={handleConnect} onScrollToCategory={handleScrollToCategory} />
        </div>

        {/* LAYER 3: Connected Systems */}
        <div id="connected-section">
          {connectedSystems.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Bağlı Teknoloji Sistemleri</h2>
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                  {connectedSystems.length}
                </span>
              </div>
              <div className="grid gap-2">
                {connectedSystems.map(c => (
                  <ConnectedSystemCard
                    key={c.id}
                    connector={c}
                    onSync={() => handleSync(c.id)}
                    syncing={syncingIds.has(c.id)}
                    onManage={() => handleManage(c.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <ConnectedEmptyState onConnect={handleConnectFirst} />
          )}
        </div>

        {/* LAYER 4: Architecture Categories */}
        <div ref={accordionRef}>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Mimari Kategoriler</h2>
            <div className="flex items-center gap-2">
              {/* Status filter pills */}
              <div className="flex items-center gap-1">
                {([
                  { key: "all" as StatusFilter, label: "Tümü" },
                  { key: "connected" as StatusFilter, label: "Bağlı" },
                  { key: "available" as StatusFilter, label: "Kullanılabilir" },
                  { key: "error" as StatusFilter, label: "Hata" },
                ]).map(f => (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`text-[9px] font-medium px-2 py-1 rounded-lg border transition-all ${
                      statusFilter === f.key
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-white/[0.03] border-border/40 text-muted-foreground hover:border-border/60"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="relative w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Sistem ara..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-border/40 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
          </div>

          {grouped.length > 0 ? (
            <Accordion
              type="multiple"
              value={openAccordions}
              onValueChange={setOpenAccordions}
              className="space-y-1"
            >
              {grouped.map(({ cat, items, connectedCount }) => {
                const Icon = iconMap[cat.icon_name] || Database;
                const covEntry = coverage.find(c => c.category === cat.id);
                const covPct = covEntry?.percent || 0;
                const ownerColor = cat.owner === "cto"
                  ? "text-primary bg-primary/10"
                  : cat.owner === "cio"
                  ? "text-purple-400 bg-purple-400/10"
                  : "text-muted-foreground bg-white/[0.04]";
                const riskLevel = covPct === 0 ? "Yüksek Risk" : covPct < 50 ? "Orta Risk" : covPct === 100 ? "Tam Kapsam" : "İyi";
                const riskColor = covPct === 0 ? "text-destructive bg-destructive/10" : covPct < 50 ? "text-warning bg-warning/10" : "text-success bg-success/10";

                return (
                  <AccordionItem key={cat.id} value={cat.id} id={`cat-${cat.id}`} className="border-none">
                    <AccordionTrigger className="py-2.5 px-3 rounded-xl hover:no-underline hover:bg-white/[0.03] transition-colors">
                      <div className="flex items-center gap-3 w-full">
                        <div className="h-7 w-7 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-[11px] font-semibold text-foreground">{cat.name_tr}</span>
                        <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${ownerColor}`}>
                          {cat.owner.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2 ml-auto mr-2">
                          <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded ${riskColor}`}>
                            {riskLevel}
                          </span>
                          <span className="text-[9px] text-muted-foreground">{connectedCount}/{items.length}</span>
                          <div className="w-12 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                covPct === 100 ? "bg-success" : covPct > 0 ? "bg-primary" : "bg-destructive/40"
                              }`}
                              style={{ width: `${covPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-1 pt-0.5">
                      {/* Category description */}
                      <div className="px-3 py-2 mb-1">
                        <p className="text-[10px] text-muted-foreground">{cat.description_tr}</p>
                      </div>
                      {/* Coverage indicator */}
                      <div className="px-3 py-2 mb-2 flex items-center gap-3 rounded-xl bg-white/[0.02] border border-border/30 mx-1">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] text-muted-foreground">Kategori Kapsamı</span>
                            <span className="text-[9px] font-bold text-foreground">{covPct}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                covPct === 100 ? "bg-success" : covPct > 0 ? "bg-primary" : "bg-destructive/40"
                              }`}
                              style={{ width: `${covPct}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[9px] text-muted-foreground">Bağlı: <span className="text-foreground font-semibold">{connectedCount}</span></p>
                          <p className="text-[9px] text-muted-foreground">Toplam: <span className="text-foreground font-semibold">{items.length}</span></p>
                        </div>
                      </div>
                      {/* System cards */}
                      <div className="space-y-0.5 pl-1">
                        {items.map(c => (
                          <CategoryAccordionRow
                            key={c.id}
                            connector={c}
                            onConnect={handleConnect}
                            onManage={handleManage}
                            onSync={handleSync}
                            syncing={syncingIds.has(c.id)}
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
              <button
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                className="text-[10px] text-primary hover:underline mt-2"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </div>

      <TechConnectWizard
        connector={wizardConnector}
        open={!!wizardConnector}
        onClose={() => setWizardConnector(null)}
        onComplete={handleWizardComplete}
      />
    </AppLayout>
  );
};

export default TechDataSources;
