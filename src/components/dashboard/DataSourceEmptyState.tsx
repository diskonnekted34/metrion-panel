import { motion } from "framer-motion";
import { Radio, Upload, ShoppingBag, BarChart3, Globe } from "lucide-react";

const DataSourceEmptyState = () => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mb-10">
    <div className="glass-card p-10 text-center">
      <Radio className="h-8 w-8 text-muted-foreground mx-auto mb-4 animate-pulse" />
      <h3 className="text-lg font-semibold text-foreground mb-2">Veri & Aksiyon Kaynakları Bağlanmadı</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Rol eğitimli AI ajanlarınızın gerçek verilerle çalışabilmesi için departman bazlı veri kaynaklarınızı bağlayın.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-primary/40 text-primary hover:bg-primary/10 text-sm transition-colors">
          <ShoppingBag className="h-4 w-4" /> Shopify Bağla
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-primary/40 text-primary hover:bg-primary/10 text-sm transition-colors">
          <Globe className="h-4 w-4" /> Meta Ads Bağla
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-primary/40 text-primary hover:bg-primary/10 text-sm transition-colors">
          <BarChart3 className="h-4 w-4" /> Google Ads Bağla
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-primary/40 text-primary hover:bg-primary/10 text-sm transition-colors">
          <Upload className="h-4 w-4" /> CSV Yükle
        </button>
      </div>
    </div>
  </motion.div>
);

export default DataSourceEmptyState;
