import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Pause, Brain } from "lucide-react";
import { executives, agents, allExperts } from "@/data/experts";
import { useRBAC, DepartmentId, departments } from "@/contexts/RBACContext";
import { useIsMobile } from "@/hooks/use-mobile";

const agentDeptMap: Record<string, DepartmentId> = {
  ceo: "executive",
  cmo: "marketing", "growth-agent": "marketing",
  cfo: "finance", "accounting-agent": "finance",
  coo: "operations", "inventory-agent": "operations",
  "creative-director": "creative", "graphic-designer": "creative", "art-director": "creative",
  "marketplace-agent": "marketplace",
  legal: "legal",
};

const deptLabel: Record<DepartmentId, string> = {
  executive: "Yönetim", technology: "Teknoloji", marketing: "Pazarlama", finance: "Finans",
  operations: "Operasyon", creative: "Kreatif", marketplace: "Pazaryeri", legal: "Hukuk",
  hr: "İnsan Kaynakları", sales: "Satış",
};

const deptOrder: DepartmentId[] = ["executive", "technology", "marketing", "finance", "operations", "creative", "marketplace", "legal"];

const statusColor = (s: string) => {
  if (s === "Monitoring") return "bg-success/15 text-success";
  if (s === "Running Task") return "bg-primary/15 text-primary";
  if (s === "Alerting") return "bg-destructive/15 text-destructive";
  return "bg-secondary text-muted-foreground";
};

const statusLabel = (s: string) => {
  if (s === "Monitoring") return "İzleniyor";
  if (s === "Running Task") return "Görev Çalışıyor";
  if (s === "Alerting") return "Uyarı Veriyor";
  return "Boşta";
};

const TeamMatrix = () => {
  const { viewMode } = useRBAC();
  const isMobile = useIsMobile();

  // Use all experts
  const filtered = allExperts.filter(exec => {
    if (viewMode === "company") return true;
    const dept = agentDeptMap[exec.id];
    return dept === viewMode;
  });

  // Group by department
  const grouped = filtered.reduce<Record<string, typeof allExperts>>((acc, exec) => {
    const dept = agentDeptMap[exec.id] || "other";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(exec);
    return acc;
  }, {});

  // Sort departments by fixed order
  const sortedDepts = deptOrder.filter(d => grouped[d]);

  if (isMobile) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
        <h2 className="text-base font-semibold text-foreground mb-3">Ekip Durumu</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {filtered.map((exec) => (
            <div key={exec.id} className="glass-card p-4 min-w-[160px] shrink-0">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-border mb-2">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-xs font-bold text-primary">{exec.role}</h3>
              <span className="text-[10px] text-muted-foreground">{deptLabel[agentDeptMap[exec.id]]}</span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-2xl mt-1 inline-block ${statusColor(exec.status)}`}>
                {statusLabel(exec.status)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">AI Ekip Durum Matrisi</h2>
        <Link to="/team" className="text-sm text-primary hover:underline flex items-center gap-1">
          Tümünü Gör <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {sortedDepts.map((deptId) => {
        const deptAgents = grouped[deptId];
        return (
          <div key={deptId} className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {deptLabel[deptId]}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptAgents.map((exec, i) => (
                <motion.div
                  key={exec.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  className={`glass-card p-5 ${exec.status === "Alerting" ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-border shrink-0">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-primary text-sm">{exec.role}</h3>
                      <p className="text-xs text-muted-foreground truncate">{exec.intelligenceDomain || exec.name}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${statusColor(exec.status)}`}>
                      {statusLabel(exec.status)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{exec.tagline}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>%{exec.performanceScore} performans</span>
                    <span>{exec.tasksCompleted.toLocaleString()} görev</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/workspace/${exec.id}`} className="flex-1 text-center text-xs py-2 rounded-2xl border border-primary/40 text-primary hover:bg-primary/10 transition-colors">Konsolu Aç</Link>
                    <button className="flex-1 text-xs py-2 rounded-2xl bg-primary text-primary-foreground hover:brightness-110 transition-all shadow-[0_0_12px_rgba(30,107,255,0.15)]">Görev Ata</button>
                    <button className="text-xs py-2 px-3 rounded-2xl border border-border hover:bg-secondary text-muted-foreground transition-colors">
                      <Pause className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default TeamMatrix;
