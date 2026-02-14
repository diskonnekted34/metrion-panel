import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, AlertTriangle, CheckCircle2, Clock, ChevronDown, ChevronRight,
  FileText, Upload, Calendar, MessageSquare, Send, Plus, Filter
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TaskCreationModal from "@/components/TaskCreationModal";
import { executives } from "@/data/experts";
import { useIsMobile } from "@/hooks/use-mobile";

// Agent-specific modules
const agentModules: Record<string, { title: string; kpis: { label: string; value: string; trend: string }[]; recommendations: string[] }[]> = {
  cfo: [
    { title: "Marjin Analizi", kpis: [{ label: "Net Marjin", value: "12.4%", trend: "+1.2%" }, { label: "Brüt Marjin", value: "38.7%", trend: "-0.5%" }], recommendations: ["Düşük marjinli 3 ürünü fiyat revizyonuna al", "Tedarikçi B ile yeniden müzakere başlat"] },
    { title: "Başa Baş Analizi", kpis: [{ label: "Başa Baş ROAS", value: "2.8x", trend: "stabil" }, { label: "Başa Baş CPA", value: "₺142", trend: "+₺8" }], recommendations: ["CPA ₺150 üzerine çıkarsa kampanya C'yi durdur", "ROAS hedefini 3.0x'e yükselt"] },
    { title: "Nakit Akışı Tahmini", kpis: [{ label: "4 Hafta Tahmini", value: "₺2.4M", trend: "+₺180K" }, { label: "Nakit Döngüsü", value: "34 gün", trend: "-2 gün" }], recommendations: ["Hafta 3'te nakit sıkışıklığı riski — erken tahsilat başlat"] },
    { title: "Risk Özeti", kpis: [{ label: "Açık Riskler", value: "3", trend: "+1" }, { label: "Çözülen", value: "7", trend: "" }], recommendations: ["Tedarikçi A sözleşme yenileme gecikmiş — hukuk masasına yönlendir"] },
  ],
  cmo: [
    { title: "Kampanya Performansı", kpis: [{ label: "ROAS", value: "3.2x", trend: "-0.4x" }, { label: "CTR", value: "2.8%", trend: "+0.3%" }], recommendations: ["Kreatif A yorulma sinyali — yeni varyasyon üret", "Kanal D bütçesini %15 azalt"] },
    { title: "Kreatif Öneriler", kpis: [{ label: "Aktif Kreatif", value: "24", trend: "" }, { label: "Yorulan", value: "6", trend: "+2" }], recommendations: ["Video formatına geçiş test et", "UGC tarzı kreatifler %40 daha yüksek CVR gösteriyor"] },
    { title: "Funnel Analizi", kpis: [{ label: "Üst Funnel CVR", value: "4.2%", trend: "+0.5%" }, { label: "Alt Funnel CVR", value: "1.8%", trend: "-0.2%" }], recommendations: ["Checkout sayfası optimizasyonu öncelikli", "Retargeting segmentini güncelle"] },
    { title: "Optimizasyon Planı", kpis: [{ label: "Test Sayısı", value: "8", trend: "" }, { label: "Kazanan", value: "5", trend: "" }], recommendations: ["A/B test hızını artır — haftalık 3 test hedefle"] },
  ],
  ceo: [
    { title: "Haftalık Öncelikler", kpis: [{ label: "Öncelik Tamamlama", value: "67%", trend: "+12%" }, { label: "Karar Bekleniyor", value: "3", trend: "" }], recommendations: ["Fiyatlama kararı bu hafta tamamlanmalı", "Q1 OKR revizyonu gerekli"] },
    { title: "Darboğaz Tespiti", kpis: [{ label: "Aktif Darboğaz", value: "2", trend: "-1" }, { label: "Çözüm Süresi", value: "3.2 gün", trend: "" }], recommendations: ["Tedarik zinciri gecikmesi operasyonu etkiliyor", "Pazarlama-satış alignment toplantısı planla"] },
  ],
  cto: [
    { title: "Otomasyon Haritası", kpis: [{ label: "Otomasyon Fırsatı", value: "14", trend: "+3" }, { label: "Uygulanan", value: "8", trend: "+2" }], recommendations: ["Fatura işleme otomasyonu en yüksek ROI", "CRM entegrasyonu tamamlanmalı"] },
    { title: "Sistem Sağlığı", kpis: [{ label: "Uptime", value: "99.7%", trend: "" }, { label: "Hata Oranı", value: "0.3%", trend: "-0.1%" }], recommendations: ["API yanıt süresi optimize edilmeli", "Yedekleme politikası güncellenmeli"] },
  ],
  cso: [
    { title: "Büyüme Yol Haritası", kpis: [{ label: "Deney Sayısı", value: "12", trend: "+4" }, { label: "Başarı Oranı", value: "58%", trend: "+8%" }], recommendations: ["Referans programı test et", "Yeni kanal: LinkedIn organik büyüme"] },
    { title: "Funnel Optimizasyonu", kpis: [{ label: "CAC", value: "₺89", trend: "-₺12" }, { label: "LTV/CAC", value: "4.2x", trend: "+0.3x" }], recommendations: ["Onboarding akışı iyileştirmesi %20 retention artışı sağlayabilir"] },
  ],
  legal: [
    { title: "Sözleşme Risk Analizi", kpis: [{ label: "Açık Sözleşme", value: "5", trend: "" }, { label: "Yüksek Risk", value: "2", trend: "+1" }], recommendations: ["Tedarikçi A sözleşmesi yenileme öncesi revizyon gerekli", "KVKK uyumluluk kontrolü tamamlanmalı"] },
  ],
};

// Default modules for agents without specific ones
const defaultModules = [
  { title: "Performans Özeti", kpis: [{ label: "Tamamlanan Görev", value: "24", trend: "+6" }, { label: "Başarı Oranı", value: "92%", trend: "+3%" }], recommendations: ["Mevcut görevlere devam et", "Veri kaynağı bağlantısını kontrol et"] },
];

const taskTimeline = [
  { title: "ROAS düşüşü analizi", severity: "critical", status: "Aktif", eta: "2 saat", source: "İçgörü" },
  { title: "Q4 bütçe revizyonu", severity: "high", status: "Planlandı", eta: "4 saat", source: "Manuel" },
  { title: "Haftalık performans raporu", severity: "medium", status: "Aktif", eta: "1 saat", source: "Ajan" },
  { title: "Kreatif A/B test sonuçları", severity: "medium", status: "Tamamlandı", eta: "—", source: "Ajan" },
  { title: "Tedarikçi sözleşme incelemesi", severity: "high", status: "Planlandı", eta: "6 saat", source: "İçgörü" },
];

const chatMessages = [
  { role: "agent" as const, text: "Q4 kampanya performans analizi tamamlandı. ROAS 3.2x → 2.8x düşüş tespit edildi. Kreatif yorulma ve hedef kitle doygunluğu ana faktörler." },
  { role: "user" as const, text: "Hangi kanalda en fazla düşüş var?" },
  { role: "agent" as const, text: "Meta Ads kanalında %18 düşüş. Google Ads stabil. TikTok %12 artış gösteriyor. Meta bütçesinin %15'ini TikTok'a kaydırmanızı öneriyorum." },
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
  const agent = executives.find(e => e.id === agentId) || executives[0];
  const modules = agentModules[agent.id] || defaultModules;

  const [expandedModule, setExpandedModule] = useState<number>(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(!isMobile);
  const [chatInput, setChatInput] = useState("");

  const statusStyle = (s: string) => {
    if (s === "Alerting") return "text-destructive";
    if (s === "Running Task") return "text-accent";
    if (s === "Monitoring") return "text-primary";
    return "text-muted-foreground";
  };

  const filteredTasks = taskFilter === "all" ? taskTimeline : taskTimeline.filter(t => t.severity === taskFilter);

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={agent.avatar} alt={agent.role} className="h-10 w-10 rounded-xl object-cover" />
              {agent.status === "Alerting" && <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-destructive rounded-full animate-pulse" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">{agent.role}</h2>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium ${statusStyle(agent.status)}`}>{agent.status === "Monitoring" ? "İzleniyor" : agent.status === "Running Task" ? "Görev Çalışıyor" : agent.status === "Alerting" ? "Uyarı" : "Boşta"}</span>
                <span className="text-[10px] text-muted-foreground">• Skor: {agent.performanceScore}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => setTaskModalOpen(true)}>
              <Plus className="h-3 w-3" /> Görev Ata
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1">
              <FileText className="h-3 w-3" /> Rapor
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 hidden sm:flex">
              <Calendar className="h-3 w-3" /> Planla
            </Button>
          </div>
        </div>
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
                    {/* KPIs */}
                    <div className="flex gap-3">
                      {mod.kpis.map((kpi, k) => (
                        <div key={k} className="bg-white/[0.03] rounded-xl p-3 flex-1">
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
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="outline" className="h-7 text-[10px]">Öneriyi Uygula</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-primary" onClick={() => setTaskModalOpen(true)}>Göreve Dönüştür</Button>
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
          {[
            "CMO, CFO'dan marjin doğrulaması talep etti.",
            "Hukuk Masası uyumluluk riski işaretledi.",
            "CTO otomasyon fırsatını onayladı.",
          ].map((log, i) => (
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
        /* MOBILE LAYOUT */
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
        /* DESKTOP 3-COLUMN LAYOUT */
        <div className="flex h-[calc(100vh-0px)]">
          {/* Left - Task Timeline */}
          <div className="w-[260px] shrink-0 border-r border-white/[0.06] p-4 overflow-y-auto">
            <TaskPanel />
          </div>
          {/* Center - Structured Output */}
          <div className="flex-1 p-6 overflow-y-auto">
            <OutputPanel />
          </div>
          {/* Right - Chat */}
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
