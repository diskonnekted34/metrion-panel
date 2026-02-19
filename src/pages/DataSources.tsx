import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, Plug, RefreshCw, Upload, Shield, CheckCircle2, AlertCircle,
  Loader2, Lock, X, Eye, Pencil, Zap, ChevronRight, Search, Filter,
  Activity, Globe, Clock, Signal, ExternalLink, Server
} from "lucide-react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useIntegrations } from "@/contexts/IntegrationContext";
import { useRBAC } from "@/contexts/RBACContext";
import { usePacks } from "@/contexts/PackContext";
import {
  Integration, IntegrationStatus, IntegrationCategory,
  categoryLabels, categoryOrder, hasWriteCapabilities,
} from "@/data/integrations";

const statusConfig: Record<IntegrationStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  connected:     { label: "Bağlı",               color: "text-success",          bg: "badge-success", icon: CheckCircle2 },
  syncing:       { label: "Senkronize Ediliyor",  color: "text-warning",          bg: "badge-warning", icon: Loader2 },
  error:         { label: "Hata",                 color: "text-destructive",      bg: "badge-error",   icon: AlertCircle },
  not_connected: { label: "Bağlı Değil",          color: "text-muted-foreground", bg: "badge-neutral", icon: Plug },
};

const IntegrationRow = ({ integration }: { integration: Integration }) => {
  const { isConnected, getDataHealth } = useIntegrations();
  const connected = isConnected(integration.id);
  const hasWrite = hasWriteCapabilities(integration.id);
  const cfg = statusConfig[integration.status];
  const StatusIcon = cfg.icon;
  const disabled = integration.comingSoon || integration.phase2;
  const health = getDataHealth(integration.id);

  return (
    <Link
      to={disabled ? "#" : `/data-sources/${integration.id}`}
      className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
        disabled
          ? "opacity-40 cursor-not-allowed bg-white/[0.01]"
          : "glass-card hover:border-primary/25 hover:shadow-[0_0_32px_rgba(30,107,255,0.1)]"
      }`}
      onClick={e => disabled && e.preventDefault()}
    >
      {/* Icon */}
      <div className="h-10 w-10 rounded-2xl bg-white/[0.04] flex items-center justify-center shrink-0 border border-white/[0.06] group-hover:border-primary/20 transition-colors">
        <Database className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">{integration.name}</p>
          {integration.comingSoon && (
            <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full badge-neutral">Yakında</span>
          )}
          {integration.phase2 && (
            <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full badge-neutral">Faz 2</span>
          )}
          {hasWrite && !disabled && (
            <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full badge-warning flex items-center gap-0.5">
              <Pencil className="h-2 w-2" /> Yazma
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground truncate mt-0.5">{integration.description}</p>
      </div>

      {/* Health indicators */}
      <div className="flex items-center gap-3 shrink-0">
        {connected && health.apiHealth !== "unknown" && (
          <div className="flex items-center gap-1">
            <div className={`h-1.5 w-1.5 rounded-full ${
              health.apiHealth === "operational" ? "bg-success" : health.apiHealth === "degraded" ? "bg-warning" : "bg-destructive"
            }`} />
            <span className="text-[9px] text-muted-foreground">API</span>
          </div>
        )}
        {connected && integration.lastSync && (
          <span className="text-[9px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {new Date(integration.lastSync).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}

        {/* Status badge */}
        <span className={`text-[9px] font-semibold px-2 py-1 rounded-full ${cfg.bg} flex items-center gap-1`}>
          <StatusIcon className={`h-3 w-3 ${integration.status === "syncing" ? "animate-spin" : ""}`} />
          {cfg.label}
        </span>

        {!disabled && (
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
        )}
      </div>
    </Link>
  );
};

const DataSources = () => {
  const { integrations, connectedCount, totalAvailable } = useIntegrations();
  const { activeTier } = usePacks();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | IntegrationStatus>("all");

  const filtered = integrations.filter(i => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && i.status !== filterStatus) return false;
    return true;
  });

  const grouped = categoryOrder.reduce((acc, cat) => {
    const items = filtered.filter(i => i.category === cat);
    if (items.length > 0) acc.push({ category: cat, items });
    return acc;
  }, [] as { category: IntegrationCategory; items: Integration[] }[]);

  const connectedIntegrations = integrations.filter(i => i.status === "connected" || i.status === "syncing");
  const errorIntegrations = integrations.filter(i => i.status === "error");

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Entegrasyon Konsolu</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Kurumsal düzeyde veri kaynağı yönetimi & izleme</p>
              </div>
            </div>
            <span className={`text-[9px] font-semibold px-2.5 py-1 rounded-full ${
              activeTier.id === "workforce" ? "badge-info" : activeTier.id === "performance" ? "badge-warning" : "badge-neutral"
            }`}>
              {activeTier.name} Plan
            </span>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="glass-card p-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plug className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{connectedCount}</p>
                <p className="text-[10px] text-muted-foreground">Bağlı</p>
              </div>
            </div>
            <div className="glass-card p-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-secondary flex items-center justify-center">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{totalAvailable}</p>
                <p className="text-[10px] text-muted-foreground">Kullanılabilir</p>
              </div>
            </div>
            <div className="glass-card p-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-success/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{connectedIntegrations.length}</p>
                <p className="text-[10px] text-muted-foreground">Aktif Senk.</p>
              </div>
            </div>
            <div className="glass-card p-3 flex items-center gap-3">
              <div className={`h-8 w-8 rounded-xl ${errorIntegrations.length > 0 ? "bg-destructive/10" : "bg-secondary"} flex items-center justify-center`}>
                <AlertCircle className={`h-4 w-4 ${errorIntegrations.length > 0 ? "text-destructive" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{errorIntegrations.length}</p>
                <p className="text-[10px] text-muted-foreground">Hata</p>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Entegrasyon ara..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-1.5">
              {(["all", "connected", "syncing", "error", "not_connected"] as const).map(status => (
                <button key={status} onClick={() => setFilterStatus(status)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-medium transition-all ${
                    filterStatus === status ? "bg-primary/10 border border-primary/30 text-primary" : "bg-secondary/40 border border-border text-muted-foreground hover:bg-secondary/60"
                  }`}>
                  {status === "all" ? "Tümü" : statusConfig[status].label}
                </button>
              ))}
            </div>
          </div>

          {/* Live monitoring alert */}
          {connectedCount === 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-warning/5 border border-warning/15 flex items-center gap-3">
              <Signal className="h-5 w-5 text-warning shrink-0" />
              <div>
                <p className="text-xs text-warning font-medium">Canlı İzleme İnaktif</p>
                <p className="text-[10px] text-muted-foreground">Veri akışını başlatmak için bir entegrasyon bağlayın.</p>
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="space-y-6">
            {grouped.map(({ category, items }) => (
              <div key={category}>
                <div className="sticky top-0 z-10 flex items-center gap-2 py-2 px-1 bg-background/80 backdrop-blur-xl mb-2">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {categoryLabels[category]}
                  </h2>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    {items.length}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {items.filter(i => i.status === "connected" || i.status === "syncing").length} bağlı
                  </span>
                </div>
                <div className="space-y-1.5">
                  {items.map(integration => (
                    <IntegrationRow key={integration.id} integration={integration} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Database className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Arama kriterlerine uygun entegrasyon bulunamadı.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DataSources;
