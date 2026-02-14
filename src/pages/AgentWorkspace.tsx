import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Clock, ChevronDown, ChevronRight,
  FileText, MessageSquare, Send, Plus, Save, Users,
  Brain, Zap, History
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
  const suggestions = config?.suggestions || [
    "Genel performans özetini oluştur.",
    "Aktif görevlerin durumunu kontrol et.",
    "Risk analizi çalıştır.",
    "Haftalık rapor hazırla.",
  ];

  const [expandedModule, setExpandedModule] = useState<number>(0);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [memoryOpen, setMemoryOpen] = useState(!isMobile);

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

  const collaborationLogs = agent.collaborations?.slice(0, 3) || [
    "Ajanlar arası veri paylaşımı aktif.",
  ];

  // ── LEFT PANEL: Identity + Capabilities + Recent Tasks ──
  const IdentityPanel = () => (
    <div className="space-y-4">
      {/* Agent Identity */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <img src={agent.avatar} alt={agent.role} className="h-12 w-12 rounded-xl object-cover" />
            {agent.status === "Alerting" && <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-destructive rounded-full animate-pulse" />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">{agent.role}</h2>
            <span className={`text-[10px] font-medium ${statusStyle(agent.status)}`}>{statusLabel(agent.status)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Skor: {agent.performanceScore}</span>
          <span>•</span>
          <span>{agent.tasksCompleted} görev</span>
        </div>
      </div>

      {/* Capabilities */}
      <div className="glass-card p-4 space-y-2">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-primary" /> Yetenekler
        </h3>
        <div className="space-y-1.5">
          {agent.skills?.slice(0, 5).map((skill, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[10px] text-secondary-foreground">{skill.name}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full bg-primary/60" style={{ width: `${skill.level}%` }} />
                </div>
                <span className="text-[9px] text-muted-foreground w-6 text-right">{skill.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="glass-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <History className="h-3 w-3 text-primary" /> Son Görevler
          </h3>
          <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1 text-primary" onClick={() => setTaskModalOpen(true)}>
            <Plus className="h-3 w-3" /> Yeni
          </Button>
        </div>
        <div className="space-y-1.5">
          {taskTimeline.slice(0, 4).map((t, i) => (
            <div key={i} className={`p-2.5 rounded-xl border-l-2 bg-white/[0.02] ${severityColor(t.severity)}`}>
              <p className="text-[10px] font-medium text-foreground leading-tight">{t.title}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`text-[8px] px-1.5 py-0.5 rounded-lg ${severityChip(t.severity)}`}>{t.status}</span>
                {t.eta !== "—" && <span className="text-[8px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-2 w-2" />{t.eta}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
        <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => setTaskModalOpen(true)}>
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

      {/* ── CONVERSATION SECTION ── */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Doğrudan Etkileşim</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Chat Messages */}
        <div className="space-y-3 mb-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`${msg.role === "agent" ? "pr-8" : "pl-8"}`}>
              <div className={`rounded-xl p-3 text-xs leading-relaxed ${
                msg.role === "agent"
                  ? "bg-white/[0.04] text-secondary-foreground"
                  : "bg-primary/10 text-foreground"
              }`}>
                {msg.text}
              </div>
              {msg.role === "agent" && i === chatMessages.length - 1 && (
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="ghost" className="h-6 text-[9px] text-primary" onClick={() => setTaskModalOpen(true)}>Göreve Dönüştür</Button>
                  <Button size="sm" variant="ghost" className="h-6 text-[9px] text-muted-foreground">
                    <Save className="h-2.5 w-2.5 mr-1" /> Rapor Kaydet
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Smart Suggestion Bubbles */}
        <div className={`flex gap-2 mb-3 ${isMobile ? "overflow-x-auto pb-2" : "flex-wrap"}`}>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setChatInput(s)}
              className="shrink-0 text-[10px] px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-secondary-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground transition-all whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="space-y-1.5">
          <p className="text-[9px] text-muted-foreground">
            <span className="text-primary/70">{agent.role}</span> ile etkileşim halindsiniz
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

  // ── RIGHT PANEL: Memory + Collaboration Log ──
  const ContextPanel = () => (
    <div className="space-y-4">
      {/* Memory */}
      <div className="glass-card p-4 space-y-2">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Brain className="h-3 w-3 text-primary" /> Hafıza
        </h3>
        <div className="space-y-1.5">
          <div className="bg-white/[0.03] rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground">Son Analiz</p>
            <p className="text-[10px] text-secondary-foreground mt-0.5">{agent.weekdayOutput} — {agent.weekday}</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground">Uzmanlık Alanı</p>
            <p className="text-[10px] text-secondary-foreground mt-0.5">{agent.tagline}</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground">Çıktı Formatı</p>
            <p className="text-[10px] text-secondary-foreground mt-0.5">Özet → Bulgular → Riskler → Öneriler → Sonraki Adımlar</p>
          </div>
        </div>
      </div>

      {/* Collaboration Log */}
      <div className="glass-card p-4 space-y-2">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Users className="h-3 w-3 text-primary" /> İşbirliği Günlüğü
        </h3>
        <div className="space-y-1.5">
          {collaborationLogs.map((log, i) => (
            <div key={i} className="flex items-start gap-2 text-[10px] text-muted-foreground">
              <div className="h-1 w-1 rounded-full bg-primary/50 mt-1.5 shrink-0" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Responsibilities */}
      <div className="glass-card p-4 space-y-2">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <FileText className="h-3 w-3 text-primary" /> Sorumluluklar
        </h3>
        <div className="space-y-1">
          {agent.responsibilities?.slice(0, 5).map((r, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
              <ChevronRight className="h-2.5 w-2.5 text-primary/50 mt-0.5 shrink-0" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <TaskCreationModal open={taskModalOpen} onOpenChange={setTaskModalOpen} prefillAgent={agent.id} />

      {isMobile ? (
        <div className="p-4 space-y-4">
          {/* Agent header compact */}
          <div className="glass-card p-3 flex items-center gap-3">
            <img src={agent.avatar} alt={agent.role} className="h-10 w-10 rounded-xl object-cover" />
            <div>
              <h2 className="text-sm font-bold text-foreground">{agent.role}</h2>
              <span className={`text-[10px] font-medium ${statusStyle(agent.status)}`}>{statusLabel(agent.status)}</span>
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
            {memoryOpen && <div className="mt-3"><ContextPanel /></div>}
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-0px)]">
          {/* Left: Identity */}
          <div className="w-[240px] shrink-0 border-r border-white/[0.06] p-4 overflow-y-auto">
            <IdentityPanel />
          </div>
          {/* Center: Modules + Conversation */}
          <div className="flex-1 p-6 overflow-y-auto" style={{ maxWidth: "calc(100% - 240px - 260px)" }}>
            <CenterPanel />
          </div>
          {/* Right: Memory + Collaboration */}
          <div className="w-[260px] shrink-0 border-l border-white/[0.06] p-4 overflow-y-auto">
            <ContextPanel />
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default AgentWorkspace;
