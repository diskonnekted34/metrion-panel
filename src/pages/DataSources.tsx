import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, Plug, RefreshCw, Upload, ChevronDown, ChevronUp, Shield,
  CheckCircle2, AlertCircle, Loader2, Lock, X, Eye, Pencil, Zap
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useIntegrations } from "@/contexts/IntegrationContext";
import { useRBAC } from "@/contexts/RBACContext";
import { useActionMode } from "@/contexts/ActionModeContext";
import {
  Integration, IntegrationStatus, IntegrationCategory,
  categoryLabels, categoryOrder, hasWriteCapabilities,
} from "@/data/integrations";
import ActionModeToggle from "@/components/integrations/ActionModeToggle";
import PreConnectModal from "@/components/integrations/PreConnectModal";
import DataHealthIndicator from "@/components/integrations/DataHealthIndicator";

const statusConfig: Record<IntegrationStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  connected: { label: "Bağlı", color: "text-success", icon: CheckCircle2 },
  syncing: { label: "Senkronize Ediliyor", color: "text-warning", icon: Loader2 },
  error: { label: "Hata", color: "text-destructive", icon: AlertCircle },
  not_connected: { label: "Bağlı Değil", color: "text-muted-foreground", icon: Plug },
};

const IntegrationCard = ({ integration }: { integration: Integration }) => {
  const { connect, disconnect, syncManual, uploadCSV, isConnected } = useIntegrations();
  const { canPerform } = useRBAC();
  const [expanded, setExpanded] = useState(false);
  const [showPreConnect, setShowPreConnect] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isAdmin = canPerform("canManageBilling");
  const connected = isConnected(integration.id);
  const cfg = statusConfig[integration.status];
  const StatusIcon = cfg.icon;
  const disabled = integration.comingSoon || integration.phase2;
  const hasWrite = hasWriteCapabilities(integration.id);

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadCSV(integration.id, file.name);
  };

  const handleConnectClick = () => {
    if (integration.permissions.length > 0) {
      setShowPreConnect(true);
    } else {
      connect(integration.id);
    }
  };

  return (
    <>
      <div className={`glass-card overflow-hidden ${disabled ? "opacity-50" : ""}`}>
        <button
          onClick={() => !disabled && setExpanded(!expanded)}
          className="w-full p-4 flex items-center gap-4 text-left"
          disabled={disabled}
        >
          {/* Icon */}
          <div className="h-10 w-10 rounded-2xl bg-white/[0.06] flex items-center justify-center shrink-0">
            <Database className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{integration.name}</p>
              {integration.comingSoon && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">Yakında</span>
              )}
              {integration.phase2 && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">Faz 2</span>
              )}
              {hasWrite && !disabled && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-warning/10 border border-warning/20 text-warning flex items-center gap-0.5">
                  <Pencil className="h-2.5 w-2.5" />
                  Yazma
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{integration.description}</p>
          </div>

          {/* Health dot + Status */}
          <div className="flex items-center gap-3 shrink-0">
            {connected && (
              <DataHealthIndicator health={integration.dataHealth} compact />
            )}
            <div className="flex items-center gap-1.5">
              <StatusIcon className={`h-3.5 w-3.5 ${cfg.color} ${integration.status === "syncing" ? "animate-spin" : ""}`} />
              <span className={`text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span>
            </div>
          </div>

          {!disabled && (
            expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
        </button>

        <AnimatePresence>
          {expanded && !disabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0 border-t border-border space-y-3">
                {/* Permissions */}
                {integration.permissions.length > 0 && (
                  <div className="pt-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Erişim İzinleri</span>
                    </div>
                    <div className="space-y-1">
                      {integration.permissions.map((p) => (
                        <div key={p.label} className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-secondary/30">
                          <span className="text-xs text-foreground">{p.label}</span>
                          <span className={`text-[10px] font-medium ${p.scope === "write" ? "text-warning" : "text-muted-foreground"}`}>
                            {p.access}
                          </span>
                        </div>
                      ))}
                    </div>
                    {!hasWrite && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Shield className="h-3 w-3 text-success" />
                        <span className="text-[10px] text-success">Salt okunur erişim. Dış sistemlerde değişiklik yapılmaz.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Write Capabilities */}
                {hasWrite && integration.writeCapabilities.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Zap className="h-3 w-3 text-warning" />
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Yazma Yetenekleri</span>
                    </div>
                    <div className="space-y-1">
                      {integration.writeCapabilities.map((w) => (
                        <div key={w.action} className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-warning/5 border border-warning/10">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground">{w.label}</span>
                            {w.draftOnly && (
                              <span className="text-[8px] font-semibold px-1 py-0.5 rounded bg-primary/10 text-primary">Taslak</span>
                            )}
                          </div>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                            w.riskLevel === "high" ? "bg-destructive/10 text-destructive" :
                            w.riskLevel === "medium" ? "bg-warning/10 text-warning" :
                            "bg-success/10 text-success"
                          }`}>
                            {w.riskLevel === "high" ? "Yüksek" : w.riskLevel === "medium" ? "Orta" : "Düşük"} Risk
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Shield className="h-3 w-3 text-primary" />
                      <span className="text-[10px] text-primary">Tüm yazma işlemleri Aksiyon Merkezi onayı gerektirir.</span>
                    </div>
                  </div>
                )}

                {/* Data Health */}
                {connected && (
                  <div className="pt-2 border-t border-border">
                    <DataHealthIndicator health={integration.dataHealth} />
                  </div>
                )}

                {/* Last sync */}
                {integration.lastSync && (
                  <div className="text-[10px] text-muted-foreground">
                    Son senkronizasyon: {new Date(integration.lastSync).toLocaleString("tr-TR")}
                  </div>
                )}

                {/* Action Mode Toggle */}
                {hasWrite && connected && (
                  <div className="pt-2 border-t border-border">
                    <ActionModeToggle integrationId={integration.id} integrationName={integration.name} />
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {!connected && isAdmin && (
                    <button
                      onClick={handleConnectClick}
                      className="btn-primary px-4 py-2 text-xs"
                    >
                      <Plug className="h-3 w-3 mr-1.5 inline" />
                      Bağlan
                    </button>
                  )}

                  {connected && isAdmin && (
                    <>
                      <button
                        onClick={() => syncManual(integration.id)}
                        className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs text-foreground transition-colors"
                        disabled={integration.status === "syncing"}
                      >
                        <RefreshCw className={`h-3 w-3 mr-1.5 inline ${integration.status === "syncing" ? "animate-spin" : ""}`} />
                        Manuel Senkronizasyon
                      </button>
                      <button
                        onClick={() => disconnect(integration.id)}
                        className="px-3 py-2 rounded-xl hover:bg-destructive/10 text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3 mr-1.5 inline" />
                        Bağlantıyı Kes
                      </button>
                    </>
                  )}

                  {!connected && isAdmin && integration.csvSupported && (
                    <>
                      <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} className="hidden" />
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs text-foreground transition-colors"
                      >
                        <Upload className="h-3 w-3 mr-1.5 inline" />
                        CSV Yükle
                      </button>
                    </>
                  )}

                  {!isAdmin && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Yalnızca Sahip/Yönetici entegrasyon yönetebilir.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pre-Connect Modal */}
      <PreConnectModal
        integration={integration}
        open={showPreConnect}
        onClose={() => setShowPreConnect(false)}
        onConnect={() => {
          setShowPreConnect(false);
          connect(integration.id);
        }}
        onCSV={() => fileRef.current?.click()}
      />
    </>
  );
};

const DataSources = () => {
  const { integrations, connectedCount, totalAvailable } = useIntegrations();

  const grouped = categoryOrder.reduce((acc, cat) => {
    const items = integrations.filter(i => i.category === cat);
    if (items.length > 0) acc.push({ category: cat, items });
    return acc;
  }, [] as { category: IntegrationCategory; items: Integration[] }[]);

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Veri Kaynakları</h1>
              <p className="text-sm text-muted-foreground">Evrensel entegrasyon yönetimi ve senkronizasyon</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-6 mt-4">
            <div className="px-3 py-1.5 rounded-xl bg-secondary/60">
              <span className="text-xs text-muted-foreground">{connectedCount}/{totalAvailable} bağlı</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-secondary/60">
              <span className="text-xs text-muted-foreground">{integrations.length} toplam entegrasyon</span>
            </div>
            {connectedCount === 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warning/10 border border-warning/15">
                <AlertCircle className="h-3 w-3 text-warning" />
                <span className="text-[10px] text-warning font-medium">Canlı izleme inaktif — bir veri kaynağı bağlayın.</span>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-6">
            {grouped.map(({ category, items }) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {categoryLabels[category]}
                  </h2>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map(integration => (
                    <IntegrationCard key={integration.id} integration={integration} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DataSources;
