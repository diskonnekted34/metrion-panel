import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Database, Search, Filter } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import TechCategoryGrid from "@/components/tech-datasources/TechCategoryGrid";
import TechConnectorCard from "@/components/tech-datasources/TechConnectorCard";
import TechCoverageWidget from "@/components/tech-datasources/TechCoverageWidget";
import TechConnectWizard from "@/components/tech-datasources/TechConnectWizard";
import {
  TechConnectorCategory, TechConnectorStatus,
  techCategories, techConnectors as defaultConnectors,
  TechConnector,
} from "@/data/techIntegrations";
import { toast } from "sonner";

type StatusFilter = "all" | TechConnectorStatus;

const TechDataSources = () => {
  const [connectors, setConnectors] = useState<TechConnector[]>(defaultConnectors);
  const [selectedCategory, setSelectedCategory] = useState<TechConnectorCategory | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [wizardConnector, setWizardConnector] = useState<TechConnector | null>(null);

  const filtered = useMemo(() => {
    let list = connectors;
    if (selectedCategory) list = list.filter(c => c.category === selectedCategory);
    if (statusFilter !== "all") list = list.filter(c => c.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name_tr.toLowerCase().includes(q) || c.description_tr.toLowerCase().includes(q) || c.vendor.toLowerCase().includes(q));
    }
    return list;
  }, [connectors, selectedCategory, statusFilter, searchQuery]);

  const handleConnect = (id: string) => {
    const conn = connectors.find(c => c.id === id);
    if (conn) setWizardConnector(conn);
  };

  const handleWizardComplete = (id: string) => {
    setConnectors(prev => prev.map(c =>
      c.id === id ? { ...c, status: "connected" as const, last_sync_at: new Date().toISOString(), last_sync_status: "ok" as const, error_message_tr: null } : c
    ));
    setWizardConnector(null);
    const conn = connectors.find(c => c.id === id);
    toast.success(`${conn?.name_tr || id} başarıyla bağlandı.`);
  };

  const selectedCatDef = selectedCategory ? techCategories.find(c => c.id === selectedCategory) : null;
  const connectedCount = connectors.filter(c => c.status === "connected").length;

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Teknoloji Veri Kaynakları</h1>
              <p className="text-sm text-muted-foreground">CTO & CIO hatları için entegrasyon kataloğu</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-3 mt-4 mb-6 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-secondary/60">
              <span className="text-xs text-muted-foreground">{connectedCount}/{connectors.length} bağlı</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-secondary/60">
              <span className="text-xs text-muted-foreground">{techCategories.length} kategori</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
            {/* Main content */}
            <div className="space-y-6">
              {/* Category Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kategoriler</h2>
                  {selectedCategory && (
                    <button onClick={() => setSelectedCategory(null)} className="text-[10px] text-primary hover:text-primary/80 transition-colors">
                      Tümünü Göster
                    </button>
                  )}
                </div>
                <TechCategoryGrid
                  categories={techCategories}
                  connectors={connectors}
                  selected={selectedCategory}
                  onSelect={(cat) => setSelectedCategory(cat === selectedCategory ? null : cat)}
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Connector ara..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-secondary/30 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Filter className="h-3 w-3 text-muted-foreground" />
                  {(["all", "connected", "available", "error"] as StatusFilter[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`text-[10px] px-2 py-1 rounded-lg transition-colors ${
                        statusFilter === s ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {s === "all" ? "Tümü" : s === "connected" ? "Bağlı" : s === "available" ? "Kullanılabilir" : "Hata"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category title */}
              {selectedCatDef && (
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{selectedCatDef.name_tr}</h3>
                  <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${
                    selectedCatDef.owner === "cto" ? "text-primary bg-primary/10" : selectedCatDef.owner === "cio" ? "text-purple-400 bg-purple-400/10" : "text-muted-foreground bg-secondary/30"
                  }`}>
                    {selectedCatDef.owner.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-muted-foreground">— {selectedCatDef.description_tr}</span>
                </div>
              )}

              {/* Connector list */}
              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-40" />
                    <p className="text-sm text-muted-foreground">Bu filtreyle eşleşen connector bulunamadı.</p>
                    <button onClick={() => { setSelectedCategory(null); setStatusFilter("all"); setSearchQuery(""); }} className="text-xs text-primary mt-2 hover:text-primary/80">
                      Filtreleri temizle
                    </button>
                  </div>
                ) : (
                  filtered.map(c => (
                    <TechConnectorCard key={c.id} connector={c} onConnect={handleConnect} />
                  ))
                )}
              </div>
            </div>

            {/* Sidebar — Coverage */}
            <div className="space-y-4">
              <TechCoverageWidget connectors={connectors} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Connect Wizard */}
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
