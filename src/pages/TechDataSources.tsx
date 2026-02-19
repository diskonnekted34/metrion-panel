import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Database, Search, CheckCircle2, AlertCircle, Plug, Clock,
  RefreshCw, Settings2, Shield, TrendingUp, AlertTriangle,
  ChevronRight,
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

const iconMap: Record<string, React.ElementType> = {
  GitBranch, ListTodo, Rocket, Cloud, Container, Activity, FileText, Bug, Shield: ShieldCheck,
  Key, ShieldCheck, Siren, Globe, DollarSign, Database, Workflow, BookOpen,
  Headphones, MessageSquare,
};

/* ══════════════════════════════════════════════
   LAYER 1 — EXECUTIVE OVERVIEW
   ══════════════════════════════════════════════ */
const ExecutiveOverview = ({ connectors }: { connectors: TechConnector[] }) => {
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

  const metrics = [
    { label: "Bağlı Sistem", value: connected, icon: CheckCircle2, accent: "text-success" },
    { label: "Kritik Hata", value: errors, icon: AlertCircle, accent: errors > 0 ? "text-destructive" : "text-muted-foreground" },
    { label: "Eksik Kategori", value: missingCats, icon: AlertTriangle, accent: missingCats > 0 ? "text-warning" : "text-muted-foreground" },
    { label: "Ort. Senk. Sağlığı", value: `${avgHealth}%`, icon: Activity, accent: "text-primary" },
    { label: "Veri Kapsamı", value: `${overallPct}%`, icon: TrendingUp, accent: "text-primary" },
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

      {/* 5 Metrics */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {metrics.map(m => (
          <div key={m.label} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-border/40">
            <div className="h-7 w-7 rounded-lg bg-white/[0.04] flex items-center justify-center">
              <m.icon className={`h-3.5 w-3.5 ${m.accent}`} />
            </div>
            <div>
              <p className="text-base font-bold text-foreground leading-none">{m.value}</p>
              <p className="text-[8px] text-muted-foreground mt-0.5">{m.label}</p>
            </div>
          </div>
        ))}
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
   LAYER 2 — RISK & GAP RADAR
   ══════════════════════════════════════════════ */
const RiskGapRadar = ({ connectors }: { connectors: TechConnector[] }) => {
  const coverage = calculateCoverage(connectors);
  const missingCats = coverage.filter(c => c.connected === 0);
  const errorSystems = connectors.filter(c => c.status === "error");
  const highSensitivity = connectors.filter(c => c.data_sensitivity === "high" && c.status === "connected");
  const overallPct = connectors.length > 0 ? Math.round((connectors.filter(c => c.status === "connected").length / connectors.length) * 100) : 0;

  const hasIssues = missingCats.length > 0 || errorSystems.length > 0;
  if (!hasIssues && highSensitivity.length === 0) return null;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Risk & Boşluk Analizi</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Missing categories */}
        {missingCats.length > 0 && (
          <div className="p-3 rounded-xl bg-warning/5 border border-warning/15">
            <p className="text-[9px] font-semibold text-warning uppercase tracking-wider mb-2">Eksik Kritik Kategoriler</p>
            <div className="flex flex-wrap gap-1">
              {missingCats.slice(0, 8).map(c => (
                <span key={c.category} className="text-[9px] px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
                  {c.category_name_tr}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error systems */}
        {errorSystems.length > 0 && (
          <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/15">
            <p className="text-[9px] font-semibold text-destructive uppercase tracking-wider mb-2">Hata Veren Sistemler</p>
            <div className="space-y-1">
              {errorSystems.map(c => (
                <div key={c.id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  <span className="text-[10px] text-foreground">{c.name_tr}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High-sensitivity connected */}
        {highSensitivity.length > 0 && (
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/15">
            <p className="text-[9px] font-semibold text-primary uppercase tracking-wider mb-2">Yüksek Hassasiyet Sistemleri</p>
            <div className="space-y-1">
              {highSensitivity.map(c => (
                <div key={c.id} className="flex items-center gap-2">
                  <Shield className="h-2.5 w-2.5 text-primary" />
                  <span className="text-[10px] text-foreground">{c.name_tr}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Coverage heat bar */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-muted-foreground shrink-0">Kapsam</span>
        <div className="flex-1 h-2 rounded-full overflow-hidden flex">
          {coverage.map(c => (
            <div
              key={c.category}
              className={`h-full transition-all ${
                c.percent === 100 ? "bg-success" : c.percent > 0 ? "bg-warning" : "bg-destructive/40"
              }`}
              style={{ width: `${100 / coverage.length}%` }}
              title={`${c.category_name_tr}: ${c.percent}%`}
            />
          ))}
        </div>
        <span className="text-[9px] font-bold text-foreground shrink-0">{overallPct}%</span>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   LAYER 3 — CONNECTED SYSTEMS
   ══════════════════════════════════════════════ */
const ConnectedSystemCard = ({ connector, onSync }: { connector: TechConnector; onSync: () => void }) => {
  const cat = techCategories.find(c => c.id === connector.category);
  const Icon = iconMap[cat?.icon_name || "Database"] || Database;

  return (
    <div className="glass-card p-3.5 flex items-center gap-3 glow-blue/20 border-primary/10 hover:border-primary/25 transition-all group">
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
              {new Date(connector.last_sync_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="h-2 w-2 rounded-full bg-success" />
        <button
          onClick={onSync}
          className="h-7 px-2.5 rounded-lg bg-secondary/60 border border-border text-[9px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center gap-1"
        >
          <RefreshCw className="h-2.5 w-2.5" /> Sync
        </button>
        <button className="h-7 px-2.5 rounded-lg bg-primary/10 border border-primary/25 text-[9px] font-medium text-primary hover:bg-primary/15 transition-all flex items-center gap-1">
          <Settings2 className="h-2.5 w-2.5" /> Yönet
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   LAYER 4 — ARCHITECTURE CATEGORIES (Accordion)
   ══════════════════════════════════════════════ */
const CategoryAccordionRow = ({ connector, onConnect }: { connector: TechConnector; onConnect: (id: string) => void }) => {
  const isConnected = connector.status === "connected";
  const isError = connector.status === "error";

  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all border border-transparent ${
      isError ? "bg-destructive/5 border-destructive/10" : "hover:bg-white/[0.03] hover:border-border/40"
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
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isConnected ? (
          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">Bağlı</span>
        ) : isError ? (
          <button onClick={() => onConnect(connector.id)} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
            Yeniden Dene
          </button>
        ) : (
          <button onClick={() => onConnect(connector.id)} className="text-[9px] font-medium text-primary opacity-0 group-hover:opacity-100 hover:underline transition-all">
            Bağlan <ChevronRight className="h-2.5 w-2.5 inline" />
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
  const [connectors, setConnectors] = useState<TechConnector[]>(defaultConnectors);
  const [searchQuery, setSearchQuery] = useState("");
  const [wizardConnector, setWizardConnector] = useState<TechConnector | null>(null);

  const connectedSystems = useMemo(() => connectors.filter(c => c.status === "connected"), [connectors]);

  const coverage = useMemo(() => calculateCoverage(connectors), [connectors]);

  // Group all connectors by category for accordion
  const grouped = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return techCategories
      .map(cat => {
        let items = connectors.filter(c => c.category === cat.id);
        if (q) items = items.filter(c => c.name_tr.toLowerCase().includes(q) || c.vendor.toLowerCase().includes(q));
        const connectedCount = items.filter(c => c.status === "connected").length;
        return { cat, items, connectedCount };
      })
      .filter(g => g.items.length > 0);
  }, [connectors, searchQuery]);

  const handleConnect = (id: string) => {
    const conn = connectors.find(c => c.id === id);
    if (conn) setWizardConnector(conn);
  };

  const handleSync = (id: string) => {
    toast.success(`${connectors.find(c => c.id === id)?.name_tr} senkronizasyonu başlatıldı.`);
  };

  const handleWizardComplete = (id: string) => {
    setConnectors(prev => prev.map(c =>
      c.id === id ? { ...c, status: "connected" as const, last_sync_at: new Date().toISOString(), last_sync_status: "ok" as const, error_message_tr: null } : c
    ));
    setWizardConnector(null);
    toast.success(`${connectors.find(c => c.id === id)?.name_tr || id} başarıyla bağlandı.`);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* LAYER 1: Executive Overview */}
          <ExecutiveOverview connectors={connectors} />

        </motion.div>

        {/* LAYER 2: Risk & Gap Radar */}
        <RiskGapRadar connectors={connectors} />

        {/* LAYER 3: Connected Systems */}
        {connectedSystems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Bağlı Teknoloji Sistemleri</h2>
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                {connectedSystems.length}
              </span>
            </div>
            <div className="grid gap-2">
              {connectedSystems.map(c => (
                <ConnectedSystemCard key={c.id} connector={c} onSync={() => handleSync(c.id)} />
              ))}
            </div>
          </div>
        )}

        {/* LAYER 4: Architecture Categories */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Mimari Kategoriler</h2>
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Sistem ara..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-border/40 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {grouped.length > 0 ? (
            <Accordion type="multiple" className="space-y-1">
              {grouped.map(({ cat, items, connectedCount }) => {
                const Icon = iconMap[cat.icon_name] || Database;
                const covEntry = coverage.find(c => c.category === cat.id);
                const covPct = covEntry?.percent || 0;
                const ownerColor = cat.owner === "cto" ? "text-primary bg-primary/10" : cat.owner === "cio" ? "text-purple-400 bg-purple-400/10" : "text-muted-foreground bg-white/[0.04]";

                return (
                  <AccordionItem key={cat.id} value={cat.id} className="border-none">
                    <AccordionTrigger className="py-2.5 px-3 rounded-xl hover:no-underline hover:bg-white/[0.03] transition-colors group">
                      <div className="flex items-center gap-3 w-full">
                        <div className="h-7 w-7 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-[11px] font-semibold text-foreground">{cat.name_tr}</span>
                        <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${ownerColor}`}>
                          {cat.owner.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2 ml-auto mr-2">
                          <span className="text-[9px] text-muted-foreground">{connectedCount}/{items.length}</span>
                          {/* Mini coverage bar */}
                          <div className="w-12 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${covPct === 100 ? "bg-success" : covPct > 0 ? "bg-primary" : "bg-destructive/40"}`}
                              style={{ width: `${covPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-1 pt-0.5">
                      <div className="space-y-0.5 pl-1">
                        {items.map(c => (
                          <CategoryAccordionRow key={c.id} connector={c} onConnect={handleConnect} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="text-center py-10">
              <Database className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-xs text-muted-foreground">Arama kriterlerine uygun sistem bulunamadı.</p>
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
