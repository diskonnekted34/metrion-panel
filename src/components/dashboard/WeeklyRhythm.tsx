import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const weeklyRhythm = [
  { day: "Pazartesi", output: "CEO Brifing", agent: "AI CEO", status: "Tamamlandı" },
  { day: "Salı", output: "Büyüme Raporu", agent: "AI CSO", status: "Tamamlandı" },
  { day: "Çarşamba", output: "Finans Raporu", agent: "AI CFO", status: "Bekliyor" },
  { day: "Perşembe", output: "Sistem Raporu", agent: "AI CTO", status: "Bekliyor" },
  { day: "Cuma", output: "Haftalık Özet", agent: "AI CEO", status: "Bekliyor" },
];

const WeeklyRhythm = () => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-10">
    <h2 className="text-lg font-semibold text-foreground mb-4">Haftalık Yönetici Ritmi</h2>
    <div className="glass-card p-6">
      <div className="grid grid-cols-5 gap-3">
        {weeklyRhythm.map((day, i) => (
          <div key={i} className={`text-center p-4 rounded-2xl transition-colors ${
            day.status === "Tamamlandı" ? "bg-success/10 border border-success/20" : "bg-secondary/50 hover:bg-secondary/80"
          }`}>
            <Calendar className="h-4 w-4 text-primary mx-auto mb-2" />
            <p className="text-xs font-semibold text-foreground mb-1">{day.day}</p>
            <p className="text-[11px] text-muted-foreground">{day.output}</p>
            <p className="text-[10px] text-accent mt-1">{day.agent}</p>
            <span className={`text-[9px] mt-2 inline-block px-1.5 py-0.5 rounded-2xl ${
              day.status === "Tamamlandı" ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"
            }`}>{day.status}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default WeeklyRhythm;
