import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { DepartmentId } from "@/contexts/RBACContext";
import { Link } from "react-router-dom";

interface Insight {
  priority: "critical" | "warning" | "info";
  text: string;
  impact: string;
  action?: string;
}

const insightsByDept: Record<DepartmentId, Insight[]> = {
  executive: [
    { priority: "critical", text: "Pazarlama departmanı sağlık skoru %68'e düştü", impact: "Yüksek", action: "Performans analizi başlat" },
    { priority: "warning", text: "Nakit pisti 11 aya geriledi", impact: "Orta", action: "Nakit akışı stres testi" },
    { priority: "info", text: "Operasyonel verimlilik %74 ile stabil", impact: "Düşük" },
  ],
  finance: [
    { priority: "critical", text: "Katkı marjı Kanal B'de %12 eridi", impact: "₺45K/ay", action: "Finans Derin Analiz başlat" },
    { priority: "warning", text: "90 günlük nakit projeksiyonu daralma sinyali", impact: "Orta", action: "Nakit akışı tahmini" },
    { priority: "info", text: "COGS oranı optimize edilebilir", impact: "₺12K/ay" },
  ],
  marketing: [
    { priority: "critical", text: "Meta ROAS son 2 haftada %22 düştü", impact: "Yüksek", action: "Kanal analizi başlat" },
    { priority: "warning", text: "CAC ₺45'e yükseldi (hedef: ₺38)", impact: "Orta", action: "CAC optimizasyonu" },
    { priority: "info", text: "Email kanalı en yüksek CVR'ı sağlıyor", impact: "Pozitif" },
  ],
  operations: [
    { priority: "critical", text: "3 SKU'da stok tükenme riski %80+", impact: "Yüksek", action: "Envanter risk taraması" },
    { priority: "warning", text: "Teslimat SLA ihlali %8'e çıktı", impact: "Orta", action: "Lojistik analizi" },
    { priority: "info", text: "İade oranı son ayda %0.3 iyileşti", impact: "Pozitif" },
  ],
  creative: [
    { priority: "warning", text: "V1 kreatifi yorgunluk eşiğine ulaştı", impact: "Orta", action: "Kreatif döngü analizi" },
    { priority: "info", text: "Marka tutarlılık skoru %85'e yükseldi", impact: "Pozitif" },
    { priority: "info", text: "UGC içerikleri en yüksek CTR'ı sağlıyor", impact: "Pozitif" },
  ],
  marketplace: [
    { priority: "warning", text: "Trendyol komisyon artışı marjı daraltıyor", impact: "₺8K/ay", action: "Komisyon etki analizi" },
    { priority: "info", text: "HepsiExpress listeleme sayısı artırılabilir", impact: "Orta" },
    { priority: "info", text: "Amazon stok dağılımı dengelendi", impact: "Pozitif" },
  ],
  legal: [
    { priority: "info", text: "2 bekleyen uyum kontrolü mevcut", impact: "Düşük" },
    { priority: "info", text: "Sözleşme inceleme SLA'sı hedefte", impact: "Pozitif" },
    { priority: "info", text: "Denetim takvimi güncel", impact: "Pozitif" },
  ],
  hr: [
    { priority: "critical", text: "Teknik ekipte %18 turnover tespit edildi", impact: "Yüksek", action: "Retention analizi başlat" },
    { priority: "warning", text: "3 C-Level pozisyonda yedek aday bulunmuyor", impact: "Yüksek", action: "Yedekleme planı oluştur" },
    { priority: "info", text: "eNPS skoru son çeyrekte 6 puan arttı", impact: "Pozitif" },
  ],
  sales: [
    { priority: "critical", text: "Q3 pipeline coverage 2.1x ile hedefin altında", impact: "Yüksek", action: "Pipeline aksiyonu başlat" },
    { priority: "warning", text: "Enterprise segment win rate %3 düştü", impact: "Orta", action: "Win/Loss analizi tetikle" },
    { priority: "info", text: "Expansion revenue %16.5'e yükseldi", impact: "Pozitif" },
  ],
  technology: [
    { priority: "warning", text: "Teknik borç oranı son çeyrekte %18 arttı", impact: "Yüksek", action: "Teknik borç analizi başlat" },
    { priority: "critical", text: "3 kritik güvenlik yaması bekliyor", impact: "Yüksek", action: "Güvenlik taraması tetikle" },
    { priority: "info", text: "Bulut maliyet optimizasyonu %12 tasarruf potansiyeli", impact: "Orta" },
  ],
};

const priorityStyles: Record<string, { bg: string; dot: string; border: string }> = {
  critical: { bg: "bg-destructive/5", dot: "bg-destructive", border: "border-l-destructive" },
  warning: { bg: "bg-warning/5", dot: "bg-warning", border: "border-l-warning" },
  info: { bg: "bg-primary/5", dot: "bg-primary", border: "border-l-primary" },
};

const DepartmentInsightStrip = ({ departmentId }: { departmentId: DepartmentId }) => {
  const insights = insightsByDept[departmentId] || [];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        İçgörüler & Aksiyonlar
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((insight, i) => {
          const style = priorityStyles[insight.priority];
          return (
            <div key={i} className={`glass-card p-4 border-l-2 ${style.border} ${style.bg}`}>
              <div className="flex items-start gap-2 mb-2">
                <div className={`h-1.5 w-1.5 rounded-full mt-1.5 ${style.dot}`} />
                <p className="text-xs text-foreground leading-relaxed flex-1">{insight.text}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {insight.priority === "critical" ? (
                    <AlertTriangle className="h-3 w-3 text-destructive" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="text-[10px] text-muted-foreground">Etki: {insight.impact}</span>
                </div>
                {insight.action && (
                  <Link
                    to={`/intelligence/${departmentId}`}
                    className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
                  >
                    {insight.action} <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DepartmentInsightStrip;