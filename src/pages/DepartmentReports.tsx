import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Filter, Star, Clock, Calendar, ChevronRight, X, Play } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useRBAC, DepartmentId, departments } from "@/contexts/RBACContext";
import { usePacks } from "@/contexts/PackContext";
import { getDepartmentReports, filterReports, type ReportFilter, type DepartmentReport } from "@/data/departmentReports";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const filterOptions: ReportFilter[] = ["Tümü", "Favoriler", "Otomatik", "Önerilen"];

const frequencyColor = (f: string) => {
  if (f === "Günlük") return "bg-success/12 text-success border-success/30";
  if (f === "Haftalık") return "bg-primary/12 text-primary border-primary/30";
  if (f === "Aylık") return "bg-warning/12 text-warning border-warning/30";
  return "bg-secondary text-muted-foreground border-border";
};

const ReportCard = ({ report, onOpen }: { report: DepartmentReport; onOpen: (r: DepartmentReport) => void }) => {
  const Icon = report.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 flex flex-col gap-3 group cursor-pointer"
      onClick={() => onOpen(report)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground leading-tight truncate group-hover:text-white transition-colors">{report.title}</h3>
            <p className="text-xs text-muted-foreground/65 mt-1 line-clamp-2 leading-relaxed">{report.description}</p>
          </div>
        </div>
        {report.isFavorite && <Star className="h-3.5 w-3.5 text-warning shrink-0 fill-warning" />}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {report.dataSources.slice(0, 3).map(ds => (
          <span key={ds} className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/80 text-muted-foreground border border-border/60">{ds}</span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${frequencyColor(report.frequency)}`}>{report.frequency}</span>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
          <Clock className="h-2.5 w-2.5" />
          <span>{report.lastUpdated}</span>
        </div>
      </div>

      <button onClick={() => toast.info("Rapor açılıyor.")} className="w-full text-center text-xs py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors mt-1 flex items-center justify-center gap-1.5">
        Raporu Aç
        <ChevronRight className="h-3 w-3" />
      </button>
    </motion.div>
  );
};

const ReportDetailDrawer = ({ report, open, onClose }: { report: DepartmentReport | null; open: boolean; onClose: () => void }) => {
  if (!report) return null;
  const Icon = report.icon;
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="bg-card border-border w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <SheetTitle className="text-lg font-semibold text-foreground">{report.title}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-5 mt-4">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Özet</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">{report.description}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Dahil Metrikler</h4>
            <div className="flex flex-wrap gap-1.5">
              {report.metrics.map(m => (
                <span key={m} className="text-xs px-2.5 py-1 rounded-lg bg-primary/8 text-primary border border-primary/20">{m}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Veri Kaynakları</h4>
            <div className="flex flex-wrap gap-1.5">
              {report.dataSources.map(ds => (
                <span key={ds} className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground border border-border/60">{ds}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Çıktı Formatları</h4>
            <div className="flex gap-1.5">
              {report.outputFormats.map(f => (
                <span key={f} className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground border border-border/60">{f}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Frekans: {report.frequency}</span>
            <span>Son güncelleme: {report.lastUpdated}</span>
          </div>

          <Button onClick={() => toast.success("Rapor çalıştırılıyor.")} className="w-full gap-2 mt-2">
            <Play className="h-4 w-4" />
            Çalıştır
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const DepartmentReports = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const { hasAccessToDepartment } = useRBAC();
  const { isDepartmentUnlocked } = usePacks();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ReportFilter>("Tümü");
  const [selectedReport, setSelectedReport] = useState<DepartmentReport | null>(null);

  const dept = departments.find(d => d.id === deptId);
  const deptIdTyped = dept?.id as DepartmentId | undefined;

  const reports = useMemo(() => {
    if (!deptIdTyped) return [];
    const all = getDepartmentReports(deptIdTyped);
    return filterReports(all, filter, search);
  }, [deptIdTyped, filter, search]);

  if (!dept) return <Navigate to="/departments" />;
  if (!isDepartmentUnlocked(dept.id as DepartmentId) || !hasAccessToDepartment(dept.id as DepartmentId)) return <Navigate to="/departments" />;

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header — title shown in Global Top Bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div />
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rapor ara..."
                  className="h-9 pl-9 pr-3 w-48 rounded-xl border border-white/[0.08] bg-secondary/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>
          </div>
        </motion.div>

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
        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report, i) => (
              <motion.div key={report.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <ReportCard report={report} onOpen={setSelectedReport} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-sm text-muted-foreground">Bu filtreye uygun rapor bulunamadı.</p>
          </div>
        )}

        <ReportDetailDrawer report={selectedReport} open={!!selectedReport} onClose={() => setSelectedReport(null)} />
      </div>
    </AppLayout>
  );
};

export default DepartmentReports;
