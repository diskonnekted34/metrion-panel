import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Activity, ChevronRight, Filter, Radio } from "lucide-react";
import { useRBAC, DepartmentId } from "@/contexts/RBACContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface Task {
  title: string;
  agent: string;
  department: DepartmentId;
  severity: string;
  eta: string;
  status: string;
  time: string;
  source: "İçgörü" | "Manuel" | "Ajan";
}

const allTasks: Task[] = [
  { title: "Q4 kampanya kreatif performansını incele", agent: "AI CMO", department: "marketing", severity: "Yüksek", eta: "2s", status: "Devam Ediyor", time: "12 dk önce", source: "İçgörü" },
  { title: "8 haftalık nakit akışı tahminini güncelle", agent: "AI CFO", department: "finance", severity: "Kritik", eta: "1s", status: "Devam Ediyor", time: "28 dk önce", source: "Ajan" },
  { title: "İlk 10 otomasyon fırsatını haritalandır", agent: "AI CTO", department: "operations", severity: "Orta", eta: "4s", status: "Devam Ediyor", time: "2 saat önce", source: "Manuel" },
  { title: "Tedarikçi sözleşme risklerini puanla", agent: "Hukuk Masası", department: "legal", severity: "Orta", eta: "—", status: "Tamamlandı", time: "4 saat önce", source: "Ajan" },
  { title: "Haftalık CEO brifingini oluştur", agent: "AI CEO", department: "executive", severity: "Düşük", eta: "—", status: "Tamamlandı", time: "6 saat önce", source: "Ajan" },
];

const severityColor = (s: string) => {
  if (s === "Kritik") return "bg-destructive/15 text-destructive";
  if (s === "Yüksek") return "bg-warning/15 text-warning";
  if (s === "Orta") return "bg-primary/15 text-primary";
  return "bg-secondary text-muted-foreground";
};

const deptLabel: Record<DepartmentId, string> = {
  executive: "Yönetim", marketing: "Pazarlama", finance: "Finans",
  operations: "Operasyon", creative: "Kreatif", marketplace: "Pazaryeri", legal: "Hukuk",
};

const PrioritizedTasks = () => {
  const { viewMode } = useRBAC();
  const isMobile = useIsMobile();
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allTasks
    .filter(t => {
      if (viewMode !== "company") return t.department === viewMode;
      return true;
    })
    .filter(t => severityFilter === "all" || t.severity === severityFilter)
    .filter(t => statusFilter === "all" || t.status === statusFilter);

  if (isMobile) {
    const active = filtered.filter(t => t.status === "Devam Ediyor");
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
        <h2 className="text-base font-semibold text-foreground mb-3">Bugünün Öncelikleri</h2>
        {active.length === 0 ? (
          <div className="glass-card p-6 flex items-center justify-center gap-2">
            <Radio className="h-3.5 w-3.5 text-success" />
            <p className="text-xs text-muted-foreground">Aktif görev yok. Sistem izleme yapıyor.</p>
          </div>
        ) : (
          <div className="glass-card divide-y divide-border">
            {active.map((task, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.agent} · {task.eta}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl shrink-0 ${severityColor(task.severity)}`}>{task.severity}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Öncelikli Görevler</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-2xl transition-colors ${showFilters ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            <Filter className="h-3 w-3" /> Filtreler
          </button>
          <Link to="/tasks" className="text-sm text-primary hover:underline flex items-center gap-1">
            Tümünü Gör <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {showFilters && (
        <div className="glass-card p-4 mb-4 flex flex-wrap gap-3">
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Aciliyet</label>
            <div className="flex gap-1.5">
              {["all", "Kritik", "Yüksek", "Orta", "Düşük"].map(s => (
                <button key={s} onClick={() => setSeverityFilter(s)}
                  className={`text-[11px] px-2.5 py-1 rounded-full transition-colors ${severityFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {s === "all" ? "Tümü" : s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Durum</label>
            <div className="flex gap-1.5">
              {["all", "Devam Ediyor", "Tamamlandı"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`text-[11px] px-2.5 py-1 rounded-full transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {s === "all" ? "Tümü" : s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="glass-card p-8 flex items-center justify-center gap-3">
          <Radio className="h-4 w-4 text-success animate-pulse" />
          <p className="text-sm text-muted-foreground">Aktif görev yok. Sistem izleme yapıyor.</p>
        </div>
      ) : (
        <div className="glass-card divide-y divide-border">
          {filtered.map((task, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-8 w-8 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.agent} · {task.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{deptLabel[task.department]}</span>
                <span className="text-xs text-muted-foreground">{task.eta}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${severityColor(task.severity)}`}>{task.severity}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${
                  task.status === "Devam Ediyor" ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"
                }`}>{task.status}</span>
                <span className="text-[10px] text-muted-foreground">{task.source}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PrioritizedTasks;
