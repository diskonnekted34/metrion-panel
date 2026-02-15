import { useState, useMemo } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, List, LayoutGrid, ChevronRight, X, Send, AlertTriangle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useRBAC, DepartmentId, departments } from "@/contexts/RBACContext";
import { usePacks } from "@/contexts/PackContext";
import { getDepartmentActions, getActionHistory, type ActionTemplate, type ActionStatus } from "@/data/departmentActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const riskColor = (r: string) => {
  if (r === "Yüksek") return "bg-destructive/12 text-destructive border-destructive/30";
  if (r === "Orta") return "bg-warning/12 text-warning border-warning/30";
  return "bg-success/12 text-success border-success/30";
};

const effortColor = (e: string) => {
  if (e === "Yüksek Efor") return "text-destructive/70";
  if (e === "Orta Efor") return "text-warning/70";
  return "text-success/70";
};

const statusLabel: Record<ActionStatus, string> = { draft: "Taslak", pending: "Onay Bekliyor", approved: "Onaylandı", rejected: "Reddedildi" };
const statusColor: Record<ActionStatus, string> = {
  draft: "bg-secondary text-muted-foreground",
  pending: "bg-warning/12 text-warning",
  approved: "bg-success/12 text-success",
  rejected: "bg-destructive/12 text-destructive",
};

const ActionCard = ({ action, onCompose }: { action: ActionTemplate; onCompose: (a: ActionTemplate) => void }) => {
  const Icon = action.icon;
  return (
    <div className="glass-card p-5 flex flex-col gap-3 group">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground leading-tight truncate group-hover:text-white transition-colors">{action.title}</h3>
          <p className="text-xs text-muted-foreground/65 mt-1 line-clamp-2 leading-relaxed">{action.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${riskColor(action.risk)}`}>{action.risk} Risk</span>
        <span className={`text-[10px] ${effortColor(action.effort)}`}>{action.effort}</span>
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        {action.approvers.map(a => (
          <span key={a} className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/80 text-muted-foreground border border-border/60">{a}</span>
        ))}
      </div>

      <button
        onClick={() => onCompose(action)}
        className="w-full text-center text-xs py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors mt-auto flex items-center justify-center gap-1.5 border border-primary/20"
      >
        Plan Oluştur
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
};

const ActionComposerModal = ({ action, open, onClose }: { action: ActionTemplate | null; open: boolean; onClose: () => void }) => {
  if (!action) return null;
  const Icon = action.icon;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-card border-white/[0.06]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">{action.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">{action.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex gap-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${riskColor(action.risk)}`}>{action.risk} Risk</span>
            <span className="text-[10px] text-muted-foreground">{action.effort}</span>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gerekli Bilgiler</h4>
            <div className="space-y-2">
              {action.inputs.map(input => (
                <div key={input}>
                  <label className="text-xs text-muted-foreground mb-1 block">{input}</label>
                  <input
                    type="text"
                    placeholder={`${input} girin...`}
                    className="w-full h-9 px-3 rounded-xl border border-white/[0.08] bg-secondary/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Kanıt / Ek Bilgi</h4>
            <textarea
              placeholder="İlgili verileri veya notları ekleyin..."
              className="w-full h-20 px-3 py-2 rounded-xl border border-white/[0.08] bg-secondary/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all resize-none"
            />
          </div>

          <div className="glass-card p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Oluşturulan Plan Önizlemesi</h4>
            <p className="text-xs text-muted-foreground/60 italic">Form doldurulduktan sonra AI tarafından oluşturulacak plan burada görünür.</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>Onay:</span>
              {action.approvers.map(a => (
                <span key={a} className="px-1.5 py-0.5 rounded-md bg-secondary border border-border/60">{a}</span>
              ))}
            </div>
            <Button className="gap-2">
              <Send className="h-3.5 w-3.5" />
              Onaya Gönder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DepartmentActions = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const { hasAccessToDepartment } = useRBAC();
  const { isDepartmentUnlocked } = usePacks();
  const [search, setSearch] = useState("");
  const [composerAction, setComposerAction] = useState<ActionTemplate | null>(null);

  const dept = departments.find(d => d.id === deptId);
  const deptIdTyped = dept?.id as DepartmentId | undefined;

  const actions = useMemo(() => {
    if (!deptIdTyped) return [];
    const all = getDepartmentActions(deptIdTyped);
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
  }, [deptIdTyped, search]);

  const history = getActionHistory();
  const pendingCount = history.filter(h => h.status === "pending").length;

  if (!dept) return <Navigate to="/departments" />;
  if (!isDepartmentUnlocked(dept.id as DepartmentId) || !hasAccessToDepartment(dept.id as DepartmentId)) return <Navigate to="/departments" />;

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Link to={`/departments/${dept.id}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> {dept.name}
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Aksiyonlar</h1>
              <p className="text-sm text-muted-foreground mt-1">{dept.name} için aksiyon planları ve operasyonel öneriler</p>
            </div>
            <div className="flex items-center gap-3">
              {pendingCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warning/10 border border-warning/20">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  <span className="text-xs font-medium text-warning">{pendingCount} Onay Bekliyor</span>
                </div>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Aksiyon ara..."
                  className="h-9 pl-9 pr-3 w-48 rounded-xl border border-white/[0.08] bg-secondary/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="bg-secondary/60 border border-white/[0.06]">
            <TabsTrigger value="templates" className="text-xs">Aksiyon Şablonları</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">Geçmiş Aksiyonlar</TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            {actions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions.map((action, i) => (
                  <motion.div key={action.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <ActionCard action={action} onCompose={setComposerAction} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <p className="text-sm text-muted-foreground">Bu aramaya uygun aksiyon şablonu bulunamadı.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-2">
              {history.map(item => (
                <div key={item.id} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{item.title}</h4>
                      <p className="text-[10px] text-muted-foreground">{item.createdAt} · {item.updatedBy}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${statusColor[item.status]}`}>{statusLabel[item.status]}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <ActionComposerModal action={composerAction} open={!!composerAction} onClose={() => setComposerAction(null)} />
      </div>
    </AppLayout>
  );
};

export default DepartmentActions;
