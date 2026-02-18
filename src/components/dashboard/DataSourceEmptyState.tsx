import { motion } from "framer-motion";
import { toast } from "sonner";
import { Radio, Upload, ShoppingBag, BarChart3, Globe, Lock } from "lucide-react";
import { useRBAC } from "@/contexts/RBACContext";

const DataSourceEmptyState = () => {
  const { currentUser } = useRBAC();
  const canConnect = currentUser.role === "owner" || currentUser.role === "admin";

  const handleConnect = (label: string) => {
    if (!canConnect) {
      toast.error("Entegrasyon bağlama yetkiniz yok. Çalışma alanı sahibiyle iletişime geçin.");
      return;
    }
    toast.info(`${label} bağlantısı başlatılıyor.`);
  };

  const btnClass = canConnect
    ? "flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-primary/40 text-primary hover:bg-primary/10 text-sm transition-colors"
    : "flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border text-muted-foreground/50 text-sm cursor-not-allowed";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mb-10">
      <div className="glass-card p-10 text-center">
        <Radio className="h-8 w-8 text-muted-foreground mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Veri & Aksiyon Kaynakları Bağlanmadı</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Rol eğitimli AI ajanlarınızın gerçek verilerle çalışabilmesi için departman bazlı veri kaynaklarınızı bağlayın.
        </p>
        {!canConnect && (
          <div className="flex items-center justify-center gap-1.5 mb-4 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            Entegrasyon bağlamak için Sahip veya Yönetici yetkisi gereklidir.
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
           <button onClick={() => handleConnect("Shopify")} disabled={!canConnect} className={btnClass}>
             <ShoppingBag className="h-4 w-4" /> Shopify Bağla
           </button>
           <button onClick={() => handleConnect("Meta Ads")} disabled={!canConnect} className={btnClass}>
             <Globe className="h-4 w-4" /> Meta Ads Bağla
           </button>
           <button onClick={() => handleConnect("Google Ads")} disabled={!canConnect} className={btnClass}>
             <BarChart3 className="h-4 w-4" /> Google Ads Bağla
           </button>
           <button onClick={() => handleConnect("CSV")} disabled={!canConnect} className={btnClass}>
             <Upload className="h-4 w-4" /> CSV Yükle
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DataSourceEmptyState;
