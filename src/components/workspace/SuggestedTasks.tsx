import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Edit3, Plus, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

const priorityStyle = (p: string) => {
  if (p === "Kritik") return "bg-destructive/15 text-destructive";
  if (p === "Yüksek") return "bg-warning/15 text-warning";
  return "bg-primary/15 text-primary";
};

const SuggestedTasks = ({ tasks, onCreateTask, onEditTask }: SuggestedTasksProps) => {
  const [created, setCreated] = useState<Set<number>>(new Set());

  if (tasks.length === 0) return null;

  const handleCreate = (task: ExtractedTask, index: number) => {
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
        {tasks.map((task, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-xl border p-3 space-y-2 ${
              created.has(i)
                ? "border-accent/30 bg-accent/5"
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

            {created.has(i) ? (
              <div className="flex items-center gap-1.5 text-[10px] text-accent font-medium">
                <CheckCircle2 className="h-3 w-3" /> Görev oluşturuldu
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-6 text-[10px] gap-1"
                  onClick={() => handleCreate(task, i)}
                >
                  <Plus className="h-2.5 w-2.5" /> Görev Oluştur
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
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SuggestedTasks;
