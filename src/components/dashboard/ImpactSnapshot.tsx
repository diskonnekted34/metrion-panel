import { motion } from "framer-motion";
import { TrendingUp, Activity, Shield, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const impact = [
  { label: "Gelir Etkisi", value: "$2.4M", icon: TrendingUp },
  { label: "Marj İyileştirme", value: "+%3.2", icon: Activity },
  { label: "Önlenen Riskler", value: "23", icon: Shield },
  { label: "Yürütülen Otomasyonlar", value: "47", icon: Zap },
];

const ImpactSnapshot = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-base font-semibold text-foreground mb-3">Etki Özeti</h2>
        <div className="grid grid-cols-2 gap-3">
          {impact.map((item) => (
            <div key={item.label} className="glass-card p-4 text-center">
              <item.icon className="h-4 w-4 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{item.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      <h2 className="text-lg font-semibold text-foreground mb-4">Etki Özeti</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {impact.map((item) => (
          <div key={item.label} className="glass-card p-5 text-center">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{item.value}</p>
            <div className="w-6 h-[2px] bg-primary/50 mx-auto mb-2 rounded-full" />
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ImpactSnapshot;
