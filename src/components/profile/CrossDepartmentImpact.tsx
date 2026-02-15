import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import { Executive } from "@/data/experts";

const departmentMap: Record<string, string[]> = {
  ceo: ["Finans", "Pazarlama", "Operasyon", "Hukuk", "Teknoloji", "Kreatif"],
  cmo: ["CEO Brifing", "Finans", "Kreatif", "Büyüme"],
  cfo: ["CEO Brifing", "Pazarlama", "Operasyon", "Muhasebe"],
  coo: ["CEO Brifing", "Finans", "Envanter", "Lojistik"],
  legal: ["Tüm Departmanlar", "CEO Uyarı", "Uyumluluk"],
  "accounting-agent": ["CFO", "CEO Brifing", "Finans"],
  "growth-agent": ["CMO", "CEO Brifing", "Pazarlama"],
  "inventory-agent": ["COO", "CEO Brifing", "Operasyon"],
  "creative-director": ["CMO", "Görsel Üretim", "Pazarlama"],
  "graphic-designer": ["Kreatif İstihbarat", "CMO", "Pazarlama"],
  "art-director": ["Görsel Üretim", "Kreatif İstihbarat", "CMO"],
  "marketplace-agent": ["CFO", "COO", "Operasyon", "Finans"],
};

interface CrossDepartmentImpactProps {
  agent: Executive;
}

const CrossDepartmentImpact = ({ agent }: CrossDepartmentImpactProps) => {
  const departments = departmentMap[agent.id] || ["Genel"];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-primary" />
        Departmanlar Arası Etki
      </h2>
      <div className="glass-bento p-6">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* Center: Agent */}
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-primary/15 flex items-center justify-center ring-2 ring-primary/30">
              <span className="text-xs font-bold text-primary text-center leading-tight px-1">
                {agent.role.replace(" Agent", "").replace(" Ajanı", "").replace(" Masası", "")}
              </span>
            </div>
          </div>

          <div className="text-primary/40 text-lg">→</div>

          {/* Connected departments */}
          <div className="flex flex-wrap gap-2">
            {departments.map((dept, i) => (
              <motion.div
                key={dept}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/20 transition-all"
              >
                <span className="text-xs font-medium text-foreground">{dept}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Collaborations */}
        <div className="mt-5 pt-5 border-t border-white/[0.04] space-y-2">
          {agent.collaborations.map((c, i) => (
            <p key={i} className="text-[10px] text-muted-foreground flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
              {c}
            </p>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CrossDepartmentImpact;
