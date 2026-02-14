import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Clock, ChevronDown, ChevronRight,
  FileText, Calendar, MessageSquare, Send, Plus, Save, Users
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import TaskCreationModal from "@/components/TaskCreationModal";
import { allExperts } from "@/data/experts";
import { agentWorkspaceConfigs } from "@/data/agentModules";
import { useIsMobile } from "@/hooks/use-mobile";

const taskTimeline = [
  { title: "ROAS düşüşü analizi", severity: "critical", status: "Aktif", eta: "2 saat", source: "İçgörü" },
  { title: "Q4 bütçe revizyonu", severity: "high", status: "Planlandı", eta: "4 saat", source: "Manuel" },
  { title: "Haftalık performans raporu", severity: "medium", status: "Aktif", eta: "1 saat", source: "Ajan" },
  { title: "Kreatif A/B test sonuçları", severity: "medium", status: "Tamamlandı", eta: "—", source: "Ajan" },
  { title: "Tedarikçi sözleşme incelemesi", severity: "high", status: "Planlandı", eta: "6 saat", source: "İçgörü" },
];

const chatMessages = [
  { role: "agent" as const, text: "Yapılandırılmış analiz tamamlandı. Sonuçlar modüller halinde yukarıda sunulmuştur. Detaylı inceleme için herhangi bir modülü genişletin." },
  { role: "user" as const, text: "Hangi alanda en fazla risk var?" },
  { role: "agent" as const, text: "Risk özeti modülünde detaylar mevcut. Öncelikli 2 aksiyon önerilmiştir — görev oluşturmak için 'Göreve Dönüştür' butonunu kullanın." },
];

const severityColor = (s: string) => {
  if (s === "critical") return "border-l-destructive";
  if (s === "high") return "border-l-warning";
  return "border-l-primary";
};

const severityChip = (s: string) => {
  if (s === "critical") return "bg-destructive/15 text-destructive";
  if (s === "high") return "bg-warning/15 text-warning";
  return "bg-primary/15 text-primary";
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

  const [expandedModule, setExpandedModule] = useState<number>(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(!isMobile);
  const [chatInput, setChatInput] = useState("");

  const statusLabel = (s: string) => {
    if (s === "Monitoring") return "İzleniyor";
    if (s === "Running Task") return "Görev Çalışıyor";
    if (s === "Alerting") return "Uyarı";
    return "Boşta";
  };

  const statusStyle = (s: string) => {
    if (s === "Alerting") return "text-destructive";
    if (s === "Running Task") return "text-accent";
    if (s === "Monitoring") return "text-primary";
    return "text-muted-foreground";
  };

  const filteredTasks = taskFilter === "all" ? taskTimeline : taskTimeline.filter(t => t.severity === taskFilter);

  // Collaboration log — role-specific
  const collaborationLogs = agent.collaborations?.slice(0, 3).map(c => c) || [
    "Ajanlar arası veri paylaşımı aktif.",
  ];

  // LEFT PANEL — Task Timeline
  const TaskPanel = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Görev Zaman Çizelgesi</h3>
        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-primary" onClick={() => setTaskModalOpen(true)}>
          <Plus className="h-3 w-3" /> Yeni
        </Button>
      </div>
      <div className="flex gap-1">
        {[{ l: "Tümü", v: "all" }, { l: "Kritik", v: "critical" }, { l: "Yüksek", v: "high" }].map(f => (
          <button
            key={f.v}
            onClick={() => setTaskFilter(f.v)}
            className={`text-[10px] px-2 py-1 rounded-lg transition-colors ${taskFilter === f.v ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-white/[0.04]"}`}
          >
            {f.l}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        {filteredTasks.map((t, i) => (
          <div key={i} className={`glass-card p-3 border-l-2 ${severityColor(t.severity)}`}>
            <p className="text-xs font-medium text-foreground">{t.title}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-[9px] px-1.5 py-0.5 rounded-lg ${severityChip(t.severity)}`}>{t.status}</span>
              {t.eta !== "—" && <span className="text-[9px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{t.eta}</span>}
              <span className="text-[9px] text-muted-foreground">{t.source}</span>
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs text-muted-foreground">AI ajan izleme modunda. Görev atayın veya uyarı bekleyin.</p>
          </div>
        )}
      </div>
    </div>
  );

  // CENTER PANEL — Structured Output
  const OutputPanel = () => (
    <div className="space-y-4">
      {/* Agent header */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={agent.avatar} alt={agent.role} className="h-10 w-10 rounded-xl object-cover" />
              {agent.status === "Alerting" && <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-destructive rounded-full animate-pulse" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">{agent.role}</h2>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium ${statusStyle(agent.status)}`}>{statusLabel(agent.status)}</span>
                <span className="text-[10px] text-muted-foreground">• Skor: {agent.performanceScore}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => setTaskModalOpen(true)}>
              <Plus className="h-3 w-3" /> Görev Ata
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1">
              <Save className="h-3 w-3" /> Rapor Kaydet
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1">
              <Users className="h-3 w-3" /> Ajana Ata
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 hidden sm:flex">
              <Calendar className="h-3 w-3" /> Planla
            </Button>
          </div>
        </div>
      </div>

      {/* Snapshot KPI Bar */}
      {snapshot.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {snapshot.map((kpi, i) => (
            <div key={i} className="glass-card p-3 min-w-[140px] flex-1">
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
                    {/* KPIs */}
                    <div className="flex gap-3 overflow-x-auto">
                      {mod.kpis.map((kpi, k) => (
                        <div key={k} className="bg-white/[0.03] rounded-xl p-3 flex-1 min-w-[100px]">
                          <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                          <p className="text-lg font-bold text-foreground">{kpi.value}</p>
                          {kpi.trend && <p className={`text-[10px] ${kpi.trend.startsWith("+") ? "text-accent" : kpi.trend.startsWith("-") ? "text-destructive" : "text-muted-foreground"}`}>{kpi.trend}</p>}
                        </div>
                      ))}
                    </div>
                    {/* Recommendations */}
                    <div className="space-y-1.5">
                      {mod.recommendations.map((rec, r) => (
                        <div key={r} className="flex items-start gap-2 text-xs text-secondary-foreground">
                          <ChevronRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2 pt-1 flex-wrap">
                      <Button size="sm" variant="outline" className="h-7 text-[10px]">Öneriyi Uygula</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-primary" onClick={() => setTaskModalOpen(true)}>Göreve Dönüştür</Button>
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

      {/* Collaboration Log */}
      <div className="glass-card p-4 space-y-2">
        <h3 className="text-xs font-semibold text-foreground">İşbirliği Günlüğü</h3>
        <div className="space-y-1.5">
          {collaborationLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <div className="h-1 w-1 rounded-full bg-primary/50" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // RIGHT PANEL — Chat
  const ChatPanel = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Konuşma</h3>
        {isMobile && (
          <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => setChatOpen(false)}>Kapat</Button>
        )}
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto min-h-0 mb-3">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`${msg.role === "agent" ? "pr-6" : "pl-6"}`}>
            <div className={`rounded-xl p-3 text-xs leading-relaxed ${
              msg.role === "agent"
                ? "bg-white/[0.04] text-secondary-foreground"
                : "bg-primary/10 text-foreground"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          placeholder="Mesaj yaz..."
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />
        <Button size="icon" className="h-8 w-8 shrink-0">
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <TaskCreationModal open={taskModalOpen} onOpenChange={setTaskModalOpen} prefillAgent={agent.id} />

      {isMobile ? (
        <div className="p-4 space-y-4">
          <OutputPanel />
          <div className="glass-card p-4">
            <button onClick={() => setTimelineOpen(!timelineOpen)} className="w-full flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Görevler</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${timelineOpen ? "rotate-180" : ""}`} />
            </button>
            {timelineOpen && <div className="mt-3"><TaskPanel /></div>}
          </div>
          {!chatOpen ? (
            <Button variant="outline" className="w-full gap-2" onClick={() => setChatOpen(true)}>
              <MessageSquare className="h-4 w-4" /> Konuşmayı Aç
            </Button>
          ) : (
            <div className="glass-card p-4 h-[350px]">
              <ChatPanel />
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-[calc(100vh-0px)]">
          <div className="w-[260px] shrink-0 border-r border-white/[0.06] p-4 overflow-y-auto">
            <TaskPanel />
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <OutputPanel />
          </div>
          <div className="w-[280px] shrink-0 border-l border-white/[0.06] p-4 flex flex-col">
            {!chatOpen ? (
              <button
                onClick={() => setChatOpen(true)}
                className="glass-card p-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="h-4 w-4" /> Konuşmayı Aç
              </button>
            ) : (
              <ChatPanel />
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default AgentWorkspace;
