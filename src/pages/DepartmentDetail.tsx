import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, AlertTriangle, TrendingUp, TrendingDown, Minus, Database, Brain, FileText } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useRBAC, DepartmentId } from "@/contexts/RBACContext";
import { usePacks } from "@/contexts/PackContext";
import { executives, agents } from "@/data/experts";
import { departmentIntegrationMap } from "@/data/packs";
import { integrations } from "@/data/integrations";
import { useIntegrations } from "@/contexts/IntegrationContext";
import DepartmentHeroCharts from "@/components/department/DepartmentHeroCharts";
import DepartmentInsightStrip from "@/components/department/DepartmentInsightStrip";

const allAgents = [...executives, ...agents];

const DepartmentDetail = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const { departments, hasAccessToDepartment, hasAccessToAgent } = useRBAC();
  const { isAgentUnlocked, isDepartmentUnlocked } = usePacks();
  const { connectedIds } = useIntegrations();

  const dept = departments.find(d => d.id === deptId);
  if (!dept) return <Navigate to="/departments" />;

  if (!isDepartmentUnlocked(dept.id as DepartmentId)) {
    return <Navigate to="/departments" />;
  }

  if (!hasAccessToDepartment(dept.id as DepartmentId)) {
    return (
      <AppLayout>
        <div className="p-6 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <div className="glass-card p-10 text-center">
            <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">Erişim Engellendi</h2>
            <p className="text-sm text-muted-foreground mb-4">Bu departmanı görüntüleme yetkiniz yok.</p>
            <Link to="/departments" className="btn-primary px-6 py-2.5 mt-6 inline-block text-sm">
              Departmanlara Dön
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const deptAgents = allAgents.filter(a => dept.agentIds.includes(a.id));
  const deptIntegrationIds = departmentIntegrationMap[dept.id] || [];
  const deptIntegrations = integrations.filter(i => deptIntegrationIds.includes(i.id));
  const activeIntegrations = deptIntegrations.filter(i => !i.comingSoon && !i.phase2);

  const healthColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const trendIcon = (t: "up" | "down" | "stable") => {
    if (t === "up") return <TrendingUp className="h-4 w-4 text-success" />;
    if (t === "down") return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const statusColor = (s: string) => {
    if (s === "Monitoring") return "bg-success/15 text-success";
    if (s === "Running Task") return "bg-primary/15 text-primary";
    if (s === "Alerting") return "bg-destructive/15 text-destructive";
    return "bg-secondary text-muted-foreground";
  };

  const statusLabel = (s: string) => {
    if (s === "Monitoring") return "İzleniyor";
    if (s === "Running Task") return "Çalışıyor";
    if (s === "Alerting") return "Uyarı";
    return "Beklemede";
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Genel Bakış
          </Link>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{dept.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{dept.name}</h1>
                  <p className="text-sm text-muted-foreground">{dept.agentIds.length} İstihbarat Modülü · {deptIntegrationIds.length} Veri Katmanı</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-3xl font-bold ${healthColor(dept.healthScore)}`}>{dept.healthScore}</span>
                    {trendIcon(dept.trend)}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Sağlık Skoru</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1.5 justify-center">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-2xl font-bold text-foreground">{dept.activeAlerts}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Aktif Uyarılar</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-foreground">{dept.activeTasks}</span>
                  <p className="text-[10px] text-muted-foreground mt-1">Aktif Görevler</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Hero Charts */}
        <DepartmentHeroCharts departmentId={dept.id as DepartmentId} />

        {/* Insight Strip */}
        <DepartmentInsightStrip departmentId={dept.id as DepartmentId} />

        {/* Agent Grid */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">İstihbarat Modülleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {deptAgents.map((agent, i) => {
              const canAccess = hasAccessToAgent(agent.id);
              const unlocked = isAgentUnlocked(agent.id);
              return (
                <motion.div key={agent.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.04 }}>
                  {canAccess && unlocked ? (
                    <div className="glass-card p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-primary text-sm">{agent.role}</h3>
                          <p className="text-[10px] text-muted-foreground">{agent.intelligenceDomain || "İstihbarat Katmanı"}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${statusColor(agent.status)}`}>
                          {statusLabel(agent.status)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{agent.tagline}</p>
                      {agent.reports && agent.reports.length > 0 && (
                        <div className="space-y-1 mb-3">
                          {agent.reports.slice(0, 2).map(r => (
                            <div key={r} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <FileText className="h-2.5 w-2.5 text-primary shrink-0" />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>{agent.performanceScore}% performans</span>
                        <span>{agent.tasksCompleted.toLocaleString()} görev</span>
                      </div>
                      <Link to={`/workspace/${agent.id}`} className="w-full text-center text-xs py-2 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors block">
                        Konsolu Aç
                      </Link>
                    </div>
                  ) : (
                    <div className="glass-card p-5 opacity-50 relative">
                      <div className="absolute inset-0 rounded-2xl bg-background/60 flex items-center justify-center z-10">
                        <div className="text-center">
                          <Lock className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                          <p className="text-[10px] text-muted-foreground">Erişim Kısıtlı</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-11 w-11 rounded-2xl bg-secondary" />
                        <div><h3 className="font-bold text-muted-foreground text-sm">{agent.role}</h3></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Connected Data Layers */}
        {activeIntegrations.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Bağlı Veri Katmanları
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {activeIntegrations.map(integ => (
                <div key={integ.id} className="glass-card p-3 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${connectedIds.includes(integ.id) ? "bg-success" : "bg-muted-foreground/30"}`} />
                  <span className="text-xs text-foreground">{integ.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default DepartmentDetail;
