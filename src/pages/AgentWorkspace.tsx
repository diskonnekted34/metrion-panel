import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, ChevronDown, ChevronRight,
  Send, Plus, Save, Users, Brain, ShieldAlert, Lock, AlertTriangle, Info
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TaskCreationModal from "@/components/TaskCreationModal";
import { allExperts } from "@/data/experts";
import { agentWorkspaceConfigs } from "@/data/agentModules";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDynamicSuggestions } from "@/hooks/useDynamicSuggestions";
import { useAgentPermissions } from "@/hooks/useAgentPermissions";
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

/** Disabled button with tooltip wrapper */
const PermissionButton = ({
  allowed,
  denialMessage,
  children,
  ...buttonProps
}: {
  allowed: boolean;
  denialMessage: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof Button>) => {
  if (allowed) {
    return <Button {...buttonProps}>{children}</Button>;
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <Button {...buttonProps} disabled className="opacity-40 cursor-not-allowed pointer-events-auto">
              {children}
              <Lock className="h-2.5 w-2.5 ml-1 opacity-60" />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-[10px] max-w-[200px]">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="h-3 w-3 text-destructive shrink-0" />
            <span>{denialMessage}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const AgentWorkspace = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const isMobile = useIsMobile();
  const agent = allExperts.find(e => e.id === agentId) || allExperts[0];
  const config = agentWorkspaceConfigs[agent.id];
  const snapshot = config?.snapshot || [];
  const modules = config?.modules || [
    { title: "Performans Özeti", kpis: [{ label: "Tamamlanan Görev", value: "24", trend: "+6" }, { label: "Başarı Oranı", value: "92%", trend: "+3%" }], recommendations: ["Mevcut görevlere devam et", "Veri kaynağı bağlantısını kontrol et"] },
  ];

  const permissions = useAgentPermissions(agent.id);
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

  // ── ACCESS DENIED STATE ──
  if (!permissions.hasDepartmentAccess) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="glass-card p-8 text-center max-w-md space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
              <ShieldAlert className="h-7 w-7 text-destructive" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Erişim Engellendi</h2>
            <p className="text-sm text-muted-foreground">
              Bu ajan departmanına erişim yetkiniz bulunmamaktadır. Erişim için çalışma alanı yöneticinizle iletişime geçin.
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              Mevcut rol: {permissions.roleLabel}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── APPROVAL BANNER ──
  const ApprovalBanner = () => {
    if (!permissions.requiresApproval) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-primary/20 p-3 flex items-center gap-3"
      >
        <Info className="h-4 w-4 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-[11px] text-foreground font-medium">{permissions.getApprovalMessage()}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Tüm yazma işlemleri taslak olarak oluşturulur ve onay gerektirir.
          </p>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">
          {permissions.roleLabel}
        </span>
      </motion.div>
    );
  };

  // ── ESCALATION INDICATOR ──
  const EscalationIndicator = ({ riskLevel }: { riskLevel: "low" | "medium" | "high" }) => {
    const level = permissions.getEscalationLevel(riskLevel);
    if (level === "none") return null;
    return (
      <div className={`flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-lg ${
        level === "high_impact"
          ? "bg-destructive/10 text-destructive border border-destructive/20"
          : "bg-warning/10 text-warning border border-warning/20"
      }`}>
        <AlertTriangle className="h-3 w-3" />
        {level === "high_impact"
          ? "Yüksek Etki — Kurucu Onayı Gerekli"
          : "Bu taslak onay gerektirecektir."}
      </div>
    );
  };

  // ── CENTER PANEL: Structured Modules + Conversation ──
  const CenterPanel = () => (
    <div className="space-y-4">
      {/* Approval Banner */}
      <ApprovalBanner />

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

      {/* Action Bar — Permission-aware */}
      <div className="flex gap-1.5 flex-wrap">
        <PermissionButton
          size="sm"
          className="h-7 text-[10px] gap-1"
          onClick={openNewTask}
          allowed={permissions.can("task.create")}
          denialMessage={permissions.getDenialMessage("task.create")}
        >
          <Plus className="h-3 w-3" /> {permissions.getDraftLabel("Görev Ata")}
        </PermissionButton>
        <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1">
          <Save className="h-3 w-3" /> Rapor Kaydet
        </Button>
        <PermissionButton
          size="sm"
          variant="outline"
          className="h-7 text-[10px] gap-1"
          allowed={permissions.can("task.assign")}
          denialMessage={permissions.getDenialMessage("task.assign")}
        >
          <Users className="h-3 w-3" /> Ajana Ata
        </PermissionButton>
      </div>

      {/* Structured Analysis Modules */}
      <div className="space-y-2">
        {modules.map((mod, i) => {
          // Filter recommendations based on permissions
          const filteredRecs = permissions.filterRecommendations(mod.recommendations);

          return (
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
                        {filteredRecs.map((rec, r) => (
                          <div key={r} className="flex items-start gap-2 text-xs text-secondary-foreground">
                            <ChevronRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ))}
                        {filteredRecs.length === 0 && (
                          <p className="text-[10px] text-muted-foreground italic">
                            Bu modül için yalnızca analiz görüntüleyebilirsiniz.
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 pt-1 flex-wrap">
                        {permissions.can("action.draft.create") && (
                          <PermissionButton
                            size="sm"
                            variant="outline"
                            className="h-7 text-[10px]"
                            allowed={permissions.can("action.draft.create")}
                            denialMessage={permissions.getDenialMessage("action.draft.create")}
                          >
                            {permissions.getDraftLabel("Öneriyi Uygula")}
                          </PermissionButton>
                        )}
                        {permissions.can("task.create") && (
                          <Button size="sm" variant="ghost" className="h-7 text-[10px] text-primary" onClick={openNewTask}>
                            Göreve Dönüştür
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] text-muted-foreground">
                          <Save className="h-3 w-3 mr-1" /> Rapor Olarak Kaydet
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ── SUGGESTED TASKS (permission-filtered) ── */}
      {permissions.can("task.create") && (() => {
        const allRecs = messages.filter(m => m.role === "agent" && m.recommendations).flatMap(m => m.recommendations!);
        const filteredRecs = permissions.filterRecommendations(allRecs);
        return filteredRecs.length > 0 ? (
          <SuggestedTasks
            tasks={extractTasksFromResponse(filteredRecs, agent.id)}
            onCreateTask={handleCreateTask}
            onEditTask={handleEditTask}
            permissions={permissions}
          />
        ) : null;
      })()}

      {/* Viewer-only notice */}
      {!permissions.can("task.create") && !permissions.can("action.draft.create") && (
        <div className="glass-card border-muted/20 p-3 flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground">
            İzleyici modundasınız. Analiz ve raporları görüntüleyebilir, ancak aksiyon başlatamazsınız.
          </p>
        </div>
      )}

      {/* ── CONVERSATION SECTION ── */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Doğrudan Etkileşim</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Chat Messages — filtered recommendations */}
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
                {msg.role === "agent" && permissions.can("task.create") && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="ghost" className="h-6 text-[9px] text-primary" onClick={openNewTask}>Göreve Dönüştür</Button>
                    <Button size="sm" variant="ghost" className="h-6 text-[9px] text-muted-foreground">
                      <Save className="h-2.5 w-2.5 mr-1" /> Rapor Kaydet
                    </Button>
                  </div>
                )}
                {msg.role === "agent" && !permissions.can("task.create") && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="ghost" className="h-6 text-[9px] text-muted-foreground">
                      <Save className="h-2.5 w-2.5 mr-1" /> Rapor Kaydet
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Smart Suggestion Bubbles — permission-filtered */}
        <div className={`flex gap-2 mb-3 ${isMobile ? "overflow-x-auto pb-2" : "flex-wrap"}`}>
          {dynamicSuggestions.map((s, i) => {
            // Filter suggestions through permission system
            const filtered = permissions.filterRecommendations([s.text]);
            if (filtered.length === 0) return null;
            const displayText = filtered[0];
            return (
              <button
                key={i}
                onClick={() => setChatInput(displayText)}
                className={`shrink-0 text-[10px] px-3 py-1.5 rounded-full border bg-white/[0.02] hover:border-primary/40 hover:bg-primary/5 hover:text-foreground transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  s.urgent
                    ? "border-destructive/30 text-foreground"
                    : "border-white/[0.08] text-secondary-foreground"
                }`}
              >
                {s.urgent && <span className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />}
                {displayText}
              </button>
            );
          })}
        </div>

        {/* Prompt Input */}
        <div className="space-y-1.5">
          <p className="text-[9px] text-muted-foreground">
            <span className="text-primary/70">{agent.role}</span> ile etkileşim halindesiniz
            {permissions.requiresApproval && (
              <span className="text-muted-foreground/60"> · Taslak modu</span>
            )}
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
            <div className="flex-1">
              <h2 className="text-sm font-bold text-foreground">{agent.role}</h2>
              <span className={`text-[10px] font-medium ${agent.status === "Alerting" ? "text-destructive" : agent.status === "Running Task" ? "text-accent" : agent.status === "Monitoring" ? "text-primary" : "text-muted-foreground"}`}>
                {agent.status === "Monitoring" ? "İzleniyor" : agent.status === "Running Task" ? "Görev Çalışıyor" : agent.status === "Alerting" ? "Uyarı" : "Boşta"}
              </span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {permissions.roleLabel}
            </span>
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
