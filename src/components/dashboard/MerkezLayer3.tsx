import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Lightbulb, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChartMock } from "./tabs/MockChart";

/* ── AI CEO Briefing ── */
const briefingItems = [
  { icon: AlertTriangle, type: "critical" as const, text: "Stok tükenme riski 3 SKU'da kritik seviyeye ulaştı — $120K gelir riski." },
  { icon: Lightbulb, type: "opportunity" as const, text: "Google Ads ROAS artış trendinde — bütçe kaydırma fırsatı mevcut." },
  { icon: TrendingUp, type: "positive" as const, text: "Katkı marjı 4 haftadır istikrarlı artışta — kümülatif iyileştirme: +$67K." },
];

const briefingStyles: Record<string, { icon: string; bg: string }> = {
  critical: { icon: "text-destructive", bg: "bg-destructive/8" },
  opportunity: { icon: "text-primary", bg: "bg-primary/8" },
  positive: { icon: "text-success", bg: "bg-success/8" },
};

const MerkezLayer3 = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {/* Trend Charts */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-base font-semibold text-foreground mb-4">Trend & Analiz</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <p className="text-xs font-medium text-foreground mb-3">Gelir Trendi (3 Ay)</p>
            <LineChartMock
              data={[180, 195, 210, 205, 225, 240, 250, 245, 260, 275, 285, 290]}
              labels={["Oca", "", "Mar", "", "May", "", "Tem", "", "Eyl", "", "Kas", ""]}
              showArea
              color="hsl(220, 100%, 56%)"
            />
          </div>
          <div className="glass-card p-5">
            <p className="text-xs font-medium text-foreground mb-3">Departman Katkı Dağılımı</p>
            <LineChartMock
              data={[42, 28, 18, 8, 4]}
              data2={[38, 30, 20, 8, 4]}
              labels={["Finans", "Paz.", "Ops.", "Tek.", "Diğer"]}
              color="hsl(220, 100%, 56%)"
              color2="hsl(160, 76%, 44%)"
            />
            <div className="flex gap-4 mt-2 text-[0.6rem]">
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-primary" /> Bu Ay</div>
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-success" /> Geçen Ay</div>
            </div>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs font-medium text-foreground mb-3">Risk Trendi</p>
            <LineChartMock
              data={[45, 48, 52, 55, 53, 50, 48, 51, 49, 47]}
              labels={["H1", "", "H3", "", "H5", "", "H7", "", "H9", ""]}
              showArea
              color="hsl(38, 92%, 50%)"
            />
          </div>
        </div>
      </motion.div>

      {/* AI CEO Briefing */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">AI CEO — Günlük Brifing</h2>
          <button
            onClick={() => navigate("/strategy")}
            className="flex items-center gap-1 text-[0.7rem] font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Tam Raporu Gör <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="glass-card p-5">
          <div className="space-y-3">
            {briefingItems.map((item, i) => {
              const s = briefingStyles[item.type];
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${s.bg}`}>
                  <item.icon className={`h-4 w-4 mt-0.5 shrink-0 ${s.icon}`} />
                  <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[0.65rem] text-muted-foreground">Oluşturulma: Bugün 09:00 · Güven: %92 · Kaynak: 14 veri noktası</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MerkezLayer3;
