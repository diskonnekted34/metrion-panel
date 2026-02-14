import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, ChevronDown, ChevronRight,
  Send, Plus, Save, Users, Brain
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import TaskCreationModal from "@/components/TaskCreationModal";
import { allExperts } from "@/data/experts";
import { agentWorkspaceConfigs } from "@/data/agentModules";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDynamicSuggestions } from "@/hooks/useDynamicSuggestions";
import { extractTasksFromResponse } from "@/utils/taskExtractor";
import SuggestedTasks, { ExtractedTask } from "@/components/workspace/SuggestedTasks";
import IdentityPanel from "@/components/workspace/IdentityPanel";
import ContextPanel from "@/components/workspace/ContextPanel";

interface ChatMessage {
  role: "agent" | "user";
  text: string;
  recommendations?: string[];
}

const initialMessages: ChatMessage[] = [
  {
    role: "agent",
    text: "Yapılandırılmış analiz tamamlandı. Sonuçlar modüller halinde yukarıda sunulmuştur. Detaylı inceleme için herhangi bir modülü genişletin.",
    recommendations: [
      "Düşük performanslı 3 reklam setini duraklatın",
      "Retargeting pencerelerini 7 günden 3 güne daraltın",
      "Kreatif A/B testini yeniden başlatın",
      "Haftalık bütçeyi %15 azaltın, performans düzelene kadar",
    ],
  },
  { role: "user", text: "Hangi alanda en fazla risk var?" },
  {
    role: "agent",
    text: "Risk özeti modülünde detaylar mevcut. Öncelikli 2 aksiyon önerilmiştir — görev oluşturmak için 'Göreve Dönüştür' butonunu kullanın.",
    recommendations: [
      "CFO, kampanya bütçe etkisini marj analizi ile doğrulamalıdır",
      "Bütçeyi %20 azaltarak nakit akışını koruyun",
    ],
  },
];

const AgentWorkspace = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const isMobile = useIsMobile();
  const agent = allExperts.find(e => e.id === agentId) || allExperts[0];
  const config = agentWorkspaceConfigs[agent.id];
  const snapshot = config?.snapshot || [];
  const modules = config?.modules || [
    { title: "Performans Özeti", kpis: [{ label: "Tamamlanan Görev", value: "24", trend: "+6" }, { label: "Başarı Oranı", value: "92%", trend: "+3%" }], recommendations: ["Mevcut görevlere devam et", "Veri kaynağı bağlantısını kontrol et"] },
  ];

  const dynamicSuggestions = useDynamicSuggestions(agent.id, config);

  const [expandedModule, setExpandedModule] = useState<number>(0);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskModalPrefill, setTaskModalPrefill] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [memoryOpen, setMemoryOpen] = useState(!isMobile);
  const [messages] = useState<ChatMessage[]>(initialMessages);

  const handleCreateTask = useCallback((task: ExtractedTask) => {
    setTaskModalPrefill(task.action);
    setTaskModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task: ExtractedTask) => {
    setTaskModalPrefill(task.action);
    setTaskModalOpen(true);
  }, []);

  const openNewTask = useCallback(() => {
    setTaskModalPrefill("");
    setTaskModalOpen(true);
  }, []);

  // ── CENTER PANEL: Structured Modules + Conversation ──
  const CenterPanel = () => (
    <div className="space-y-4">
      {/* Snapshot KPI Bar */}
      {snapshot.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {snapshot.map((kpi, i) => (
            <div key={i} className="glass-card p-3 min-w-[130px] flex-1">
              <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              <p className="text-lg font-bold text-foreground mt-0.5">{kpi.value}</p>
              {kpi.trend && (
                <p className={`text-[10px] mt-0.5 ${kpi.trend.startsWith("+") ? "text-accent" : kpi.trend.startsWith("-") ? "text-destructive" : "text-muted-foreground"}`}>
                  {kpi.trend}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex gap-1.5 flex-wrap">
        <Button size="sm" className="h-7 text-[10px] gap-1" onClick={openNewTask}>
          <Plus className="h-3 w-3" /> Görev Ata
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1">
          <Save className="h-3 w-3" /> Rapor Kaydet
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1">
          <Users className="h-3 w-3" /> Ajana Ata
        </Button>
      </div>

      {/* Structured Analysis Modules */}
      <div className="space-y-2">
        {modules.map((mod, i) => (
          <motion.div key={i} className="glass-card overflow-hidden" layout>
            <button
              onClick={() => setExpandedModule(expandedModule === i ? -1 : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{mod.title}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedModule === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {expandedModule === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3">
                    <div className="flex gap-3 overflow-x-auto">
                      {mod.kpis.map((kpi, k) => (
                        <div key={k} className="bg-white/[0.03] rounded-xl p-3 flex-1 min-w-[100px]">
                          <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                          <p className="text-lg font-bold text-foreground">{kpi.value}</p>
                          {kpi.trend && <p className={`text-[10px] ${kpi.trend.startsWith("+") ? "text-accent" : kpi.trend.startsWith("-") ? "text-destructive" : "text-muted-foreground"}`}>{kpi.trend}</p>}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      {mod.recommendations.map((rec, r) => (
                        <div key={r} className="flex items-start gap-2 text-xs text-secondary-foreground">
                          <ChevronRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-1 flex-wrap">
                      <Button size="sm" variant="outline" className="h-7 text-[10px]">Öneriyi Uygula</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-primary" onClick={openNewTask}>Göreve Dönüştür</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-muted-foreground">
                        <Save className="h-3 w-3 mr-1" /> Rapor Olarak Kaydet
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* ── SUGGESTED TASKS ── */}
      {(() => {
        const allRecs = messages.filter(m => m.role === "agent" && m.recommendations).flatMap(m => m.recommendations!);
        return allRecs.length > 0 ? (
          <SuggestedTasks
            tasks={extractTasksFromResponse(allRecs, agent.id)}
            onCreateTask={handleCreateTask}
            onEditTask={handleEditTask}
          />
        ) : null;
      })()}

      {/* ── CONVERSATION SECTION ── */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Doğrudan Etkileşim</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Chat Messages */}
        <div className="space-y-3 mb-4">
          {messages.map((msg, i) => (
            <div key={i}>
              <div className={`${msg.role === "agent" ? "pr-8" : "pl-8"}`}>
                <div className={`rounded-xl p-3 text-xs leading-relaxed ${
                  msg.role === "agent"
                    ? "bg-white/[0.04] text-secondary-foreground"
                    : "bg-primary/10 text-foreground"
                }`}>
                  {msg.text}
                </div>
                {msg.role === "agent" && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="ghost" className="h-6 text-[9px] text-primary" onClick={openNewTask}>Göreve Dönüştür</Button>
                    <Button size="sm" variant="ghost" className="h-6 text-[9px] text-muted-foreground">
                      <Save className="h-2.5 w-2.5 mr-1" /> Rapor Kaydet
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Smart Suggestion Bubbles */}
        <div className={`flex gap-2 mb-3 ${isMobile ? "overflow-x-auto pb-2" : "flex-wrap"}`}>
          {dynamicSuggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setChatInput(s.text)}
              className={`shrink-0 text-[10px] px-3 py-1.5 rounded-full border bg-white/[0.02] hover:border-primary/40 hover:bg-primary/5 hover:text-foreground transition-all whitespace-nowrap flex items-center gap-1.5 ${
                s.urgent
                  ? "border-destructive/30 text-foreground"
                  : "border-white/[0.08] text-secondary-foreground"
              }`}
            >
              {s.urgent && <span className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />}
              {s.text}
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="space-y-1.5">
          <p className="text-[9px] text-muted-foreground">
            <span className="text-primary/70">{agent.role}</span> ile etkileşim halindesiniz
          </p>
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Doğrudan talimat girin..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground/50">
                {chatInput.length}/500
              </span>
            </div>
            <Button
              size="icon"
              className={`h-9 w-9 shrink-0 transition-all ${chatInput.length > 0 ? "bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.3)]" : ""}`}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <TaskCreationModal open={taskModalOpen} onOpenChange={setTaskModalOpen} prefillAgent={agent.id} prefillObjective={taskModalPrefill} />

      {isMobile ? (
        <div className="p-4 space-y-4">
          {/* Agent header compact */}
          <div className="glass-card p-3 flex items-center gap-3">
            <img src={agent.avatar} alt={agent.role} className="h-10 w-10 rounded-xl object-cover" />
            <div>
              <h2 className="text-sm font-bold text-foreground">{agent.role}</h2>
              <span className={`text-[10px] font-medium ${agent.status === "Alerting" ? "text-destructive" : agent.status === "Running Task" ? "text-accent" : agent.status === "Monitoring" ? "text-primary" : "text-muted-foreground"}`}>
                {agent.status === "Monitoring" ? "İzleniyor" : agent.status === "Running Task" ? "Görev Çalışıyor" : agent.status === "Alerting" ? "Uyarı" : "Boşta"}
              </span>
            </div>
          </div>
          <CenterPanel />
          {/* Memory collapsed */}
          <div className="glass-card p-3">
            <button onClick={() => setMemoryOpen(!memoryOpen)} className="w-full flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Brain className="h-3 w-3 text-primary" /> Hafıza & İşbirliği
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${memoryOpen ? "rotate-180" : ""}`} />
            </button>
            {memoryOpen && <div className="mt-3"><ContextPanel agent={agent} /></div>}
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-0px)]">
          {/* Left: Identity */}
          <div className="w-[240px] shrink-0 border-r border-white/[0.06] p-4 overflow-y-auto">
            <IdentityPanel agent={agent} onNewTask={openNewTask} />
          </div>
          {/* Center: Modules + Conversation */}
          <div className="flex-1 p-6 overflow-y-auto" style={{ maxWidth: "calc(100% - 240px - 260px)" }}>
            <CenterPanel />
          </div>
          {/* Right: Memory + Collaboration */}
          <div className="w-[260px] shrink-0 border-l border-white/[0.06] p-4 overflow-y-auto">
            <ContextPanel agent={agent} />
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default AgentWorkspace;
