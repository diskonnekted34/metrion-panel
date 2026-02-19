import { useState, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Bell, ExternalLink } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useRBAC, type DepartmentId, departments } from "@/contexts/RBACContext";
import { usePacks } from "@/contexts/PackContext";
import { getDepartmentModules, filterModules, type ModuleFilter, type DepartmentModule, type RoadmapQuarter } from "@/data/departmentModules";

const filterOptions: ModuleFilter[] = ["Tümü", "Aktif", "Mevcut", "Yakında"];
const quarters: RoadmapQuarter[] = ["Q1", "Q2", "Q3", "Q4"];

const statusConfig: Record<string, { label: string; color: string; cta: string }> = {
  enabled: { label: "Aktif", color: "bg-success/12 text-success border-success/30", cta: "Aç" },
  available: { label: "Mevcut", color: "bg-primary/12 text-primary border-primary/30", cta: "Etkinleştir" },
  coming_soon: { label: "Yakında", color: "bg-secondary text-muted-foreground border-border", cta: "Bildir" },
};

const ModuleCard = ({ module }: { module: DepartmentModule }) => {
  const Icon = module.icon;
  const config = statusConfig[module.status];
  return (
    <div className="glass-card p-5 flex flex-col gap-3 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            module.status === "enabled" ? "bg-success/10 group-hover:bg-success/20" : "bg-primary/10 group-hover:bg-primary/20"
          }`}>
            <Icon className={`h-4 w-4 ${module.status === "enabled" ? "text-success" : "text-primary"}`} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground leading-tight truncate group-hover:text-white transition-colors">{module.title}</h3>
          </div>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${config.color}`}>{config.label}</span>
      </div>

      <p className="text-xs text-muted-foreground/65 line-clamp-2 leading-relaxed">{module.description}</p>

      <div className="flex items-center gap-1 flex-wrap">
        {module.requiredSources.map(src => (
          <span key={src} className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/80 text-muted-foreground border border-border/60">{src}</span>
        ))}
      </div>

      {module.quarter && (
        <span className="text-[10px] text-muted-foreground/50">{module.quarter} 2025 planlanıyor</span>
      )}

      <button className={`w-full text-center text-xs py-2 rounded-xl transition-colors mt-auto flex items-center justify-center gap-1.5 ${
        module.status === "enabled"
          ? "bg-success/10 hover:bg-success/20 text-success border border-success/20"
          : module.status === "available"
          ? "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
          : "bg-secondary hover:bg-secondary/80 text-muted-foreground border border-border/60"
      }`}>
        {module.status === "enabled" && <ExternalLink className="h-3 w-3" />}
        {module.status === "available" && <CheckCircle2 className="h-3 w-3" />}
        {module.status === "coming_soon" && <Bell className="h-3 w-3" />}
        {config.cta}
      </button>
    </div>
  );
};

const DepartmentModules = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const { hasAccessToDepartment } = useRBAC();
  const { isDepartmentUnlocked } = usePacks();
  const [filter, setFilter] = useState<ModuleFilter>("Tümü");

  const dept = departments.find(d => d.id === deptId);
  const deptIdTyped = dept?.id as DepartmentId | undefined;

  const modules = useMemo(() => {
    if (!deptIdTyped) return [];
    const all = getDepartmentModules(deptIdTyped);
    return filterModules(all, filter);
  }, [deptIdTyped, filter]);

  const comingSoonModules = useMemo(() => {
    if (!deptIdTyped) return [];
    return getDepartmentModules(deptIdTyped).filter(m => m.status === "coming_soon");
  }, [deptIdTyped]);

  if (!dept) return <Navigate to="/departments" />;
  if (!isDepartmentUnlocked(dept.id as DepartmentId) || !hasAccessToDepartment(dept.id as DepartmentId)) return <Navigate to="/departments" />;

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header — title shown in Global Top Bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6" />

        {/* Filters */}
        <div className="flex gap-1.5 mb-6 flex-wrap">
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-secondary/60 text-muted-foreground border border-white/[0.06] hover:border-white/[0.12]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => (
              <motion.div key={mod.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <ModuleCard module={mod} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-sm text-muted-foreground">Bu filtreye uygun modül bulunamadı.</p>
          </div>
        )}

        {/* Roadmap Strip */}
        {comingSoonModules.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
            <h2 className="text-sm font-semibold text-foreground mb-4">Yol Haritası</h2>
            <div className="glass-card p-5">
              <div className="flex gap-4 overflow-x-auto">
                {quarters.map(q => {
                  const qModules = comingSoonModules.filter(m => m.quarter === q);
                  return (
                    <div key={q} className="min-w-[180px] flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">{q} 2025</span>
                      </div>
                      <div className="space-y-2">
                        {qModules.length > 0 ? qModules.map(m => (
                          <div key={m.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                            <span className="truncate">{m.title}</span>
                          </div>
                        )) : (
                          <p className="text-[10px] text-muted-foreground/40 italic">Planlanıyor</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default DepartmentModules;
