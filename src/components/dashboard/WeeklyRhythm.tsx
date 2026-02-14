import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const weeklyRhythm = [
  { day: "Monday", output: "CEO Brief", agent: "AI CEO", status: "Completed" },
  { day: "Tuesday", output: "Growth Review", agent: "AI CSO", status: "Completed" },
  { day: "Wednesday", output: "Finance Review", agent: "AI CFO", status: "Pending" },
  { day: "Thursday", output: "Systems Review", agent: "AI CTO", status: "Pending" },
  { day: "Friday", output: "Weekly Summary", agent: "AI CEO", status: "Pending" },
];

const WeeklyRhythm = () => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-10">
    <h2 className="text-lg font-semibold text-foreground mb-4">Weekly Executive Rhythm</h2>
    <div className="glass-card p-6">
      <div className="grid grid-cols-5 gap-3">
        {weeklyRhythm.map((day, i) => (
          <div key={i} className={`text-center p-4 rounded-2xl transition-colors ${
            day.status === "Completed" ? "bg-success/10 border border-success/20" : "bg-secondary/50 hover:bg-secondary/80"
          }`}>
            <Calendar className="h-4 w-4 text-primary mx-auto mb-2" />
            <p className="text-xs font-semibold text-foreground mb-1">{day.day}</p>
            <p className="text-[11px] text-muted-foreground">{day.output}</p>
            <p className="text-[10px] text-accent mt-1">{day.agent}</p>
            <span className={`text-[9px] mt-2 inline-block px-1.5 py-0.5 rounded-2xl ${
              day.status === "Completed" ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"
            }`}>{day.status}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default WeeklyRhythm;
