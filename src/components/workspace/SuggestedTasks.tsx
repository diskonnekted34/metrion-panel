import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Edit3, Plus, Users, Zap, Lock, ShieldAlert, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { AgentPermissionContext } from "@/hooks/useAgentPermissions";

export interface ExtractedTask {
  action: string;
  agent: string;
  agentId: string;
  priority: "Kritik" | "Yüksek" | "Orta";
  impact?: string;
  crossAgent?: boolean;
}

interface SuggestedTasksProps {
  tasks: ExtractedTask[];
  onCreateTask: (task: ExtractedTask) => void;
  onEditTask: (task: ExtractedTask) => void;
  permissions?: AgentPermissionContext;
}

const priorityStyle = (p: string) => {
  if (p === "Kritik") return "bg-destructive/15 text-destructive";
  if (p === "Yüksek") return "bg-warning/15 text-warning";
  return "bg-primary/15 text-primary";
};

const SuggestedTasks = ({ tasks, onCreateTask, onEditTask, permissions }: SuggestedTasksProps) => {
  const [created, setCreated] = useState<Set<number>>(new Set());

  if (tasks.length === 0) return null;

  const canCreate = permissions?.can("task.create") ?? true;
  const canDraft = permissions?.can("action.draft.create") ?? true;
  const requiresApproval = permissions?.requiresApproval ?? false;

  const handleCreate = (task: ExtractedTask, index: number) => {
    if (!canCreate) return;
    setCreated(prev => new Set(prev).add(index));
    onCreateTask(task);
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Zap className="h-3 w-3 text-primary" /> Önerilen Görevler
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <AnimatePresence>
        {tasks.map((task, i) => {
          // Determine escalation for critical tasks
          const isEscalated = task.priority === "Kritik" && requiresApproval;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border p-3 space-y-2 ${
                created.has(i)
                  ? "border-accent/30 bg-accent/5"
                  : isEscalated
                    ? "border-destructive/20 bg-destructive/[0.03]"
                    : "border-white/[0.08] bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-foreground font-medium leading-snug flex-1">{task.action}</p>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-lg shrink-0 ${priorityStyle(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-2.5 w-2.5" /> {task.agent}
                </span>
                {task.impact && <span>Etki: {task.impact}</span>}
                {task.crossAgent && (
                  <span className="text-primary/80 font-medium">Çapraz Ajan Görevi</span>
                )}
              </div>

              {/* Escalation warning */}
              {isEscalated && (
                <div className="flex items-center gap-1.5 text-[10px] text-destructive font-medium">
                  <AlertTriangle className="h-3 w-3" />
                  Yüksek Etki — Kurucu Onayı Gerekli
                </div>
              )}

              {/* Approval notice for non-critical drafts */}
              {!isEscalated && requiresApproval && canDraft && !created.has(i) && (
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <ShieldAlert className="h-2.5 w-2.5" />
                  Bu taslak onay gerektirecektir.
                </div>
              )}

              {created.has(i) ? (
                <div className="flex items-center gap-1.5 text-[10px] text-accent font-medium">
                  <CheckCircle2 className="h-3 w-3" /> 
                  {requiresApproval ? "Taslak görev oluşturuldu — onay bekleniyor" : "Görev oluşturuldu"}
                </div>
              ) : canCreate ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-6 text-[10px] gap-1"
                    onClick={() => handleCreate(task, i)}
                  >
                    <Plus className="h-2.5 w-2.5" />
                    {requiresApproval ? "Taslak Görev Oluştur" : "Görev Oluştur"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] gap-1 text-muted-foreground"
                    onClick={() => onEditTask(task)}
                  >
                    <Edit3 className="h-2.5 w-2.5" /> Düzenle
                  </Button>
                </div>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                        <Lock className="h-2.5 w-2.5" />
                        Görev oluşturma yetkiniz yok
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-[10px]">
                      {permissions?.getDenialMessage("task.create")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default SuggestedTasks;
