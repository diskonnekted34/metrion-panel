import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, Plug, CheckCircle2, AlertCircle, Loader2, Clock, Search,
  Activity, ChevronRight, ChevronDown, RefreshCw, Settings2, Signal
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useIntegrations } from "@/contexts/IntegrationContext";
import { usePacks } from "@/contexts/PackContext";
import {
  Integration, IntegrationStatus, IntegrationCategory,
  categoryLabels, categoryOrder,
} from "@/data/integrations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ── Status config ── */
const statusConfig: Record<IntegrationStatus, { label: string; bg: string; icon: typeof CheckCircle2 }> = {
  connected:     { label: "Bağlı",              bg: "badge-success", icon: CheckCircle2 },
  syncing:       { label: "Senkronize",         bg: "badge-warning", icon: Loader2 },
  error:         { label: "Hata",               bg: "badge-error",   icon: AlertCircle },
  not_connected: { label: "Bağlı Değil",        bg: "badge-neutral", icon: Plug },
};

/* ══════════════════════════════════════════════════
   ZONE 2 — Connected Integration Card (prominent)
   ══════════════════════════════════════════════════ */
const ConnectedCard = ({ integration }: { integration: Integration }) => {
  const { syncManual } = useIntegrations();
  const navigate = useNavigate();
  const cfg = statusConfig[integration.status];
  const StatusIcon = cfg.icon;
  const isSyncing = integration.status === "syncing";

  return (
    <div className="glass-card p-4 flex items-center gap-4 group glow-blue/30 border-primary/10 hover:border-primary/25">
      {/* Icon */}
      <div className="h-11 w-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
        <Database className="h-5 w-5 text-primary" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{integration.name}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} flex items-center gap-1`}>
            <StatusIcon className={`h-2.5 w-2.5 ${isSyncing ? "animate-spin" : ""}`} />
            {cfg.label}
          </span>
          {integration.lastSync && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {new Date(integration.lastSync).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={(e) => { e.preventDefault(); syncManual(integration.id); }}
          disabled={isSyncing}
          className="h-8 px-3 rounded-xl bg-secondary/60 border border-border text-[10px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center gap-1.5 disabled:opacity-40"
        >
          <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
          Senkronize Et
        </button>
        <button
          onClick={() => navigate(`/data-sources/${integration.id}`)}
          className="h-8 px-3 rounded-xl bg-primary/10 border border-primary/25 text-[10px] font-medium text-primary hover:bg-primary/15 transition-all flex items-center gap-1.5"
        >
          <Settings2 className="h-3 w-3" />
          Yönet
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   ZONE 3 — Available Integration Row (compact)
   ══════════════════════════════════════════════════ */
const AvailableRow = ({ integration }: { integration: Integration }) => {
  const disabled = integration.comingSoon || integration.phase2;
  const isConnected = integration.status === "connected" || integration.status === "syncing";
  const cfg = statusConfig[integration.status];

  return (
    <Link
      to={disabled ? "#" : `/data-sources/${integration.id}`}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
        disabled
          ? "opacity-35 cursor-not-allowed"
          : "hover:bg-secondary/40 hover:border-primary/15"
      } border border-transparent`}
      onClick={e => disabled && e.preventDefault()}
    >
      <div className="h-8 w-8 rounded-xl bg-secondary/60 border border-border flex items-center justify-center shrink-0 group-hover:border-primary/20 transition-colors">
        <Database className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary/70 transition-colors" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-foreground">{integration.name}</p>
          {integration.comingSoon && (
            <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full badge-neutral">Yakında</span>
          )}
          {integration.phase2 && (
            <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full badge-neutral">Faz 2</span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">{integration.description}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isConnected ? (
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full badge-success flex items-center gap-1">
            <CheckCircle2 className="h-2.5 w-2.5" /> Bağlı
          </span>
        ) : !disabled ? (
          <span className="text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Bağlan →
          </span>
        ) : null}
      </div>
    </Link>
  );
};

/* ══════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════ */
const DataSources = () => {
  const { integrations, connectedCount, totalAvailable } = useIntegrations();
  const { activeTier } = usePacks();
  const [search, setSearch] = useState("");

  const connectedIntegrations = integrations.filter(
    i => i.status === "connected" || i.status === "syncing"
  );
  const errorIntegrations = integrations.filter(i => i.status === "error");

  // Filter by search
  const searchLower = search.toLowerCase();
  const filtered = search
    ? integrations.filter(i => i.name.toLowerCase().includes(searchLower))
    : integrations;

  // Group available (non-connected or all when searching) by category
  const availableFiltered = filtered.filter(
    i => i.status === "not_connected" || i.status === "error" || search
  );

  const grouped = categoryOrder.reduce((acc, cat) => {
    const items = availableFiltered.filter(i => i.category === cat);
    if (items.length > 0) acc.push({ category: cat, items });
    return acc;
  }, [] as { category: IntegrationCategory; items: Integration[] }[]);

  // Default open first category that has items
  const defaultCategory = grouped.length > 0 ? grouped[0].category : undefined;

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* ═══ ZONE 1: OVERVIEW ═══ */}
          <div className="glass-card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Entegrasyon Konsolu</h1>
                  <p className="text-[10px] text-muted-foreground">Kurumsal veri kaynağı yönetimi & izleme</p>
                </div>
              </div>
              <span className={`text-[9px] font-semibold px-2.5 py-1 rounded-full ${
                activeTier.id === "workforce" ? "badge-info" : activeTier.id === "performance" ? "badge-warning" : "badge-neutral"
              }`}>
                {activeTier.name}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: Plug, value: connectedCount, label: "Bağlı", iconClass: "text-primary", bgClass: "bg-primary/10" },
                { icon: Database, value: totalAvailable, label: "Kullanılabilir", iconClass: "text-muted-foreground", bgClass: "bg-secondary" },
                { icon: Activity, value: connectedIntegrations.length, label: "Aktif Senk.", iconClass: "text-success", bgClass: "bg-success/10" },
                { icon: AlertCircle, value: errorIntegrations.length, label: "Hata", iconClass: errorIntegrations.length > 0 ? "text-destructive" : "text-muted-foreground", bgClass: errorIntegrations.length > 0 ? "bg-destructive/10" : "bg-secondary" },
              ].map(({ icon: Icon, value, label, iconClass, bgClass }) => (
                <div key={label} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-secondary/30 border border-border">
                  <div className={`h-7 w-7 rounded-lg ${bgClass} flex items-center justify-center`}>
                    <Icon className={`h-3.5 w-3.5 ${iconClass}`} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground leading-none">{value}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ ZONE 2: CONNECTED INTEGRATIONS ═══ */}
          {connectedIntegrations.length > 0 && !search && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 px-1">
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Bağlı Entegrasyonlar</h2>
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full badge-success">{connectedIntegrations.length}</span>
              </div>
              <div className="grid gap-2">
                {connectedIntegrations.map(i => (
                  <ConnectedCard key={i.id} integration={i} />
                ))}
              </div>
            </div>
          )}

          {/* Live monitoring inactive alert */}
          {connectedCount === 0 && !search && (
            <div className="mb-6 p-3.5 rounded-2xl bg-warning/5 border border-warning/15 flex items-center gap-3">
              <Signal className="h-4 w-4 text-warning shrink-0" />
              <div>
                <p className="text-[11px] text-warning font-medium">Canlı İzleme İnaktif</p>
                <p className="text-[9px] text-muted-foreground">Veri akışını başlatmak için bir entegrasyon bağlayın.</p>
              </div>
            </div>
          )}

          {/* ═══ ZONE 3: AVAILABLE INTEGRATIONS (Grouped & Collapsible) ═══ */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {search ? "Arama Sonuçları" : "Kullanılabilir Entegrasyonlar"}
              </h2>
              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Entegrasyon ara..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-secondary/40 border border-border text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            </div>

            {grouped.length > 0 ? (
              <Accordion
                type="multiple"
                defaultValue={defaultCategory ? [defaultCategory] : []}
                className="space-y-1"
              >
                {grouped.map(({ category, items }) => {
                  const connectedInCat = items.filter(i => i.status === "connected" || i.status === "syncing").length;
                  return (
                    <AccordionItem key={category} value={category} className="border-none">
                      <AccordionTrigger className="py-2.5 px-3 rounded-xl hover:no-underline hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            {categoryLabels[category]}
                          </span>
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            {items.length}
                          </span>
                          {connectedInCat > 0 && (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full badge-success">
                              {connectedInCat} bağlı
                            </span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-1 pt-0.5">
                        <div className="space-y-0.5 pl-1">
                          {items.map(integration => (
                            <AvailableRow key={integration.id} integration={integration} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <div className="text-center py-10">
                <Database className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Arama kriterlerine uygun entegrasyon bulunamadı.</p>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DataSources;
