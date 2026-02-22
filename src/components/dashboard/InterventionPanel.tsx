import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox, Sparkles, ListChecks, Pin, PinOff, BellOff, ArrowRight,
  AlertTriangle, Banknote, TrendingUp, Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type TabId = "inbox" | "ai" | "plans";

interface InterventionItem {
  id: string;
  title: string;
  impactScore: number;
  riskLabel: string;
  expectedROI: string;
  affectedKPIs: string[];
  owner: string;
  priority: "critical" | "high" | "normal";
  tab: TabId;
}

const items: InterventionItem[] = [
  { id: "int-1", title: "Q2 Pazarlama Bütçe Artışı Onayı", impactScore: 9, riskLabel: "Revenue", expectedROI: "+$180K/Q", affectedKPIs: ["MRR", "ROAS"], owner: "CMO Agent", priority: "critical", tab: "inbox" },
  { id: "int-2", title: "Nakit Rezerv Politikası Güncelleme", impactScore: 9, riskLabel: "Risk", expectedROI: "Risk ↓35%", affectedKPIs: ["Runway", "Cash"], owner: "CFO Agent", priority: "critical", tab: "inbox" },
  { id: "int-3", title: "Stok Acil Sipariş Tetikleme", impactScore: 8, riskLabel: "Cost", expectedROI: "$120K kayıp önleme", affectedKPIs: ["COGS", "Marj"], owner: "COO Agent", priority: "critical", tab: "inbox" },
  { id: "int-4", title: "Kanal Çeşitlendirme Stratejisi", impactScore: 8, riskLabel: "Growth", expectedROI: "+15% reach", affectedKPIs: ["CAC", "LTV"], owner: "AI Öneri", priority: "high", tab: "ai" },
  { id: "int-5", title: "Tedarikçi Geçiş Planı", impactScore: 7, riskLabel: "Cost", expectedROI: "₺240K/yıl tasarruf", affectedKPIs: ["Marj", "Burn"], owner: "AI Öneri", priority: "high", tab: "ai" },
  { id: "int-6", title: "Premium Segment Genişletme", impactScore: 7, riskLabel: "Revenue", expectedROI: "+$95K/Q", affectedKPIs: ["ARPU", "LTV"], owner: "AI Öneri", priority: "normal", tab: "ai" },
  { id: "int-7", title: "Kubernetes Ölçekleme (Aktif)", impactScore: 6, riskLabel: "Tech", expectedROI: "Uptime %99.98", affectedKPIs: ["Uptime"], owner: "CTO Agent", priority: "normal", tab: "plans" },
  { id: "int-8", title: "Sadakat Programı Faz 2", impactScore: 7, riskLabel: "Growth", expectedROI: "Churn ↓0.4pp", affectedKPIs: ["Churn", "LTV"], owner: "CMO Agent", priority: "normal", tab: "plans" },
];

const priorityColors: Record<string, string> = {
  critical: "#EF4444",
  high: "#F59E0B",
  normal: "#1E6BFF",
};

const riskIcons: Record<string, React.ElementType> = {
  Revenue: TrendingUp,
  Risk: Shield,
  Cost: Banknote,
  Growth: TrendingUp,
  Tech: Sparkles,
};

const InterventionPanel = () => {
  const [activeTab, setActiveTab] = useState<TabId>("inbox");
  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const [snoozed, setSnoozed] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "inbox", label: "Onay Bekleyen", icon: Inbox },
    { id: "ai", label: "AI Önerileri", icon: Sparkles },
    { id: "plans", label: "Aktif Planlar", icon: ListChecks },
  ];

  const filtered = items
    .filter(it => it.tab === activeTab && !snoozed.has(it.id))
    .sort((a, b) => {
      if (pinned.has(a.id) && !pinned.has(b.id)) return -1;
      if (!pinned.has(a.id) && pinned.has(b.id)) return 1;
      return b.impactScore - a.impactScore;
    });

  const togglePin = (id: string) => {
    setPinned(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.5) 100%)",
        backdropFilter: "blur(18px)",
        border: "0.5px solid rgba(255,255,255,0.06)",
        borderRadius: "var(--radius-card, 16px)",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="text-[0.85rem] font-semibold text-foreground">Müdahale Paneli</h3>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-0.5" style={{ background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-inner, 12px)" }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1 flex-1 justify-center py-1.5 text-[0.6rem] font-semibold transition-all duration-150"
              style={{
                borderRadius: "var(--radius-inner, 12px)",
                background: activeTab === tab.id ? "rgba(30,107,255,0.12)" : "transparent",
                color: activeTab === tab.id ? "#1E90FF" : "rgba(255,255,255,0.4)",
              }}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => {
            const RiskIcon = riskIcons[item.riskLabel] || AlertTriangle;
            const pc = priorityColors[item.priority];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="group p-3 relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `0.5px solid ${pc}30`,
                  borderLeft: `3px solid ${pc}`,
                  borderRadius: "var(--radius-inner, 12px)",
                }}
              >
                {/* Impact Score */}
                <div className="flex items-start gap-2.5">
                  <div
                    className="h-9 w-9 flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                      background: `${pc}15`,
                      color: pc,
                      borderRadius: "var(--radius-inner, 12px)",
                    }}
                  >
                    {item.impactScore}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.72rem] font-semibold text-foreground leading-tight mb-1 truncate">{item.title}</p>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span
                        className="text-[0.5rem] font-bold px-1.5 py-0.5 flex items-center gap-0.5"
                        style={{
                          background: `${pc}15`,
                          color: pc,
                          borderRadius: "var(--radius-pill, 999px)",
                        }}
                      >
                        <RiskIcon className="h-2 w-2" />
                        {item.riskLabel}
                      </span>
                      <span className="text-[0.5rem] text-muted-foreground/50">{item.owner}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[0.55rem]">
                      <span className="text-success/80">ROI: {item.expectedROI}</span>
                      <div className="flex gap-1">
                        {item.affectedKPIs.map(k => (
                          <span key={k} className="text-muted-foreground/40 px-1 py-0.5" style={{ background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-pill, 999px)" }}>
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: "0.5px solid rgba(255,255,255,0.03)" }}>
                  <div className="flex gap-1">
                    <button
                      onClick={() => togglePin(item.id)}
                      className="p-1 rounded-lg hover:bg-white/[0.04] transition-colors"
                      title={pinned.has(item.id) ? "Unpin" : "Pin"}
                    >
                      {pinned.has(item.id) ? <PinOff className="h-3 w-3 text-primary" /> : <Pin className="h-3 w-3 text-muted-foreground/40" />}
                    </button>
                    <button
                      onClick={() => setSnoozed(prev => new Set([...prev, item.id]))}
                      className="p-1 rounded-lg hover:bg-white/[0.04] transition-colors"
                      title="Sessize Al"
                    >
                      <BellOff className="h-3 w-3 text-muted-foreground/40" />
                    </button>
                  </div>
                  <button
                    onClick={() => navigate("/decision-lab")}
                    className="flex items-center gap-1 text-[0.6rem] font-medium text-primary/70 hover:text-primary transition-colors"
                  >
                    İncele <ArrowRight className="h-2.5 w-2.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterventionPanel;
