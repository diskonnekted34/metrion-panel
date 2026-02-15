import { motion } from "framer-motion";
import { Zap, BarChart3, Users, CheckCircle2 } from "lucide-react";
import { Executive } from "@/data/experts";

interface ProfileSidebarProps {
  agent: Executive;
}

const ProfileSidebar = ({ agent }: ProfileSidebarProps) => (
  <div className="space-y-6">
    {/* Skills */}
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
      <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" /> Analitik Yetenekler
      </h3>
      <div className="space-y-3">
        {agent.skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-foreground font-medium">{skill.name}</span>
              <span className="text-muted-foreground">{skill.level}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, hsl(220 100% 56%), hsl(220 80% 65%))" }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>

    {/* Automations */}
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
      <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary" /> Otomasyonlar
      </h3>
      <div className="space-y-2">
        {agent.automations.map((a) => (
          <div key={a} className="flex items-start gap-2">
            <Zap className="h-3 w-3 text-primary/60 shrink-0 mt-0.5" />
            <span className="text-[10px] text-muted-foreground">{a}</span>
          </div>
        ))}
      </div>
    </motion.div>

    {/* KPIs */}
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-bento p-6">
      <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-primary" /> İzlenen KPI'lar
      </h3>
      <div className="space-y-2">
        {agent.kpis.map((kpi) => (
          <div key={kpi} className="text-[10px] text-muted-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            {kpi}
          </div>
        ))}
      </div>
    </motion.div>

    {/* Reviews */}
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
      <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" /> Operasyonel Değerlendirmeler
      </h3>
      <div className="space-y-3">
        {agent.reviews.map((review, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/[0.02]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium text-foreground">{review.name}</span>
              <span className="text-[9px] text-muted-foreground">{review.date}</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default ProfileSidebar;
