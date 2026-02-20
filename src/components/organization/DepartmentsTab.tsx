import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertTriangle, ListTodo, TrendingUp, TrendingDown, Minus, Lock, ChevronRight, Target } from "lucide-react";
import { useRBAC, type DepartmentId } from "@/contexts/RBACContext";
import { usePacks } from "@/contexts/PackContext";
import UpgradeModal from "@/components/UpgradeModal";

const DepartmentsTab = () => {
  const { departments, hasAccessToDepartment } = useRBAC();
  const { isDepartmentUnlocked } = usePacks();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeDeptId, setUpgradeDeptId] = useState<DepartmentId | undefined>();

  const trendIcon = (t: "up" | "down" | "stable") => {
    if (t === "up") return <TrendingUp className="h-3.5 w-3.5 text-success" />;
    if (t === "down") return <TrendingDown className="h-3.5 w-3.5 text-destructive" />;
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  const healthColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept, i) => {
          const hasAccess = hasAccessToDepartment(dept.id);
          const unlocked = isDepartmentUnlocked(dept.id);
          const isLegal = dept.id === "legal";

          return (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              {unlocked && hasAccess ? (
                <Link to={`/departments/${dept.id}`} className="block group">
                  <div className="glass-card p-5 h-full hover:border-primary/20 transition-all duration-300"
                    style={{ boxShadow: "0 0 0 0 transparent" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 20px rgba(30,107,255,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 0 transparent"; }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{dept.icon}</span>
                        <h3 className="text-sm font-semibold text-foreground">{dept.name}</h3>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-2xl font-bold ${healthColor(dept.healthScore)}`}>{dept.healthScore}</span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                      {trendIcon(dept.trend)}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-secondary/40 rounded-xl p-2.5">
                        <div className="flex items-center gap-1 mb-0.5">
                          <AlertTriangle className="h-2.5 w-2.5 text-warning" />
                          <span className="text-[9px] text-muted-foreground">Uyarı</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">{dept.activeAlerts}</span>
                      </div>
                      <div className="bg-secondary/40 rounded-xl p-2.5">
                        <div className="flex items-center gap-1 mb-0.5">
                          <ListTodo className="h-2.5 w-2.5 text-primary" />
                          <span className="text-[9px] text-muted-foreground">Görev</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">{dept.activeTasks}</span>
                      </div>
                      <div className="bg-secondary/40 rounded-xl p-2.5">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Target className="h-2.5 w-2.5 text-success" />
                          <span className="text-[9px] text-muted-foreground">OKR</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">{dept.agentIds.length}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  className="glass-card p-5 h-full relative cursor-pointer"
                  onClick={() => {
                    if (!isLegal) {
                      setUpgradeDeptId(dept.id);
                      setUpgradeOpen(true);
                    }
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Lock className="h-5 w-5 text-muted-foreground mb-2" />
                    <p className="text-xs font-medium text-muted-foreground text-center px-4">
                      {isLegal ? "Yakında" : "Planı Yükselterek Aç"}
                    </p>
                    {!isLegal && (
                      <p className="text-[10px] text-primary mt-1.5 font-medium">Yükselt →</p>
                    )}
                  </div>
                  <div className="opacity-30">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{dept.icon}</span>
                      <h3 className="text-sm font-semibold text-foreground">{dept.name}</h3>
                    </div>
                    <div className="h-20" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} departmentId={upgradeDeptId} />
    </>
  );
};

export default DepartmentsTab;
