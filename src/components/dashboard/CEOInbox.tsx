import { motion } from "framer-motion";
import { ArrowRight, Clock, Inbox, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

type InboxPriority = "critical" | "high" | "normal";
type ImpactArea = "Revenue" | "Cost" | "Risk" | "Growth";

interface InboxItem {
  id: string;
  type: "decision_approval" | "action_approval" | "escalated_risk" | "budget_request" | "blocked_task";
  title: string;
  impactArea: ImpactArea;
  impactScore: number;
  dueDate: string;
  owner: string;
  aiRecommendation: string;
  priority: InboxPriority;
}

const typeLabels: Record<InboxItem["type"], string> = {
  decision_approval: "Karar Onayı",
  action_approval: "Aksiyon Onayı",
  escalated_risk: "Eskalasyon",
  budget_request: "Bütçe Talebi",
  blocked_task: "Bloke Görev",
};

const priorityConfig: Record<InboxPriority, { border: string; dot: string }> = {
  critical: { border: "rgba(239,68,68,0.3)", dot: "#EF4444" },
  high: { border: "rgba(245,158,11,0.3)", dot: "#F59E0B" },
  normal: { border: "rgba(30,107,255,0.2)", dot: "#1E6BFF" },
};

const mockInbox: InboxItem[] = [
  {
    id: "inbox-1",
    type: "decision_approval",
    title: "Q2 Pazarlama Bütçesini %20 Artır",
    impactArea: "Revenue",
    impactScore: 9,
    dueDate: "2026-02-22",
    owner: "CMO Agent",
    aiRecommendation: "ROAS trendi pozitif — onay önerilir.",
    priority: "critical",
  },
  {
    id: "inbox-2",
    type: "decision_approval",
    title: "Nakit Rezerv Politikası Güncelleme",
    impactArea: "Risk",
    impactScore: 9,
    dueDate: "2026-02-25",
    owner: "CFO Agent",
    aiRecommendation: "Makroekonomik belirsizlik nedeniyle 6 aylık tampon önerilir.",
    priority: "critical",
  },
  {
    id: "inbox-3",
    type: "escalated_risk",
    title: "3 SKU'da Stok Tükenme Riski %85+",
    impactArea: "Cost",
    impactScore: 8,
    dueDate: "2026-02-21",
    owner: "COO Agent",
    aiRecommendation: "Acil sipariş tetiklenmeli — tahmini kayıp $120K.",
    priority: "critical",
  },
  {
    id: "inbox-4",
    type: "budget_request",
    title: "Kıdemli Mühendis Kadro Genişletme Bütçesi",
    impactArea: "Growth",
    impactScore: 7,
    dueDate: "2026-03-01",
    owner: "CHRO Agent",
    aiRecommendation: "Sprint velocity %40 artış bekleniyor — yatırım pozitif ROI'ye sahip.",
    priority: "high",
  },
  {
    id: "inbox-5",
    type: "action_approval",
    title: "Meta Ads Bütçe Yeniden Dağıtımı",
    impactArea: "Revenue",
    impactScore: 6,
    dueDate: "2026-02-28",
    owner: "CMO Agent",
    aiRecommendation: "ROAS düşüşü durdurmak için kanal kaydırma önerilir.",
    priority: "normal",
  },
];

const CEOInbox = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Inbox className="h-4 w-4 text-primary" />
          <h2 className="text-[0.85rem] font-semibold text-foreground">CEO Inbox</h2>
          <span className="text-[0.6rem] font-medium px-2 py-0.5 rounded-full badge-error">
            {mockInbox.length} bekleyen
          </span>
        </div>
        <button
          onClick={() => navigate("/decision-lab")}
          className="text-[0.6rem] text-primary/70 hover:text-primary transition-colors flex items-center gap-1"
        >
          Tümünü Gör <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>

      <div className="space-y-2">
        {mockInbox.map((item, i) => {
          const pc = priorityConfig[item.priority];
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              onClick={() => navigate("/decision-lab")}
              className="w-full text-left group hover:-translate-y-px transition-all duration-200 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.35) 100%)",
                backdropFilter: "blur(14px)",
                border: `0.5px solid ${pc.border}`,
                borderRadius: "var(--radius-card, 16px)",
                borderLeft: `3px solid ${pc.dot}`,
              }}
            >
              <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded badge-neutral">
                        {typeLabels[item.type]}
                      </span>
                      <span
                        className="text-[0.55rem] font-semibold px-1.5 py-0.5 rounded"
                        style={{
                          background: `rgba(${item.impactArea === "Revenue" ? "30,107,255" : item.impactArea === "Risk" ? "239,68,68" : item.impactArea === "Cost" ? "245,158,11" : "22,199,132"},0.12)`,
                          color: item.impactArea === "Revenue" ? "#1E6BFF" : item.impactArea === "Risk" ? "#EF4444" : item.impactArea === "Cost" ? "#F59E0B" : "#16C784",
                        }}
                      >
                        {item.impactArea}
                      </span>
                      <span className="text-[0.55rem] text-muted-foreground/50">
                        Impact: {item.impactScore}/10
                      </span>
                    </div>
                    <p className="text-[0.8rem] font-semibold text-foreground mb-1">{item.title}</p>
                    <p className="text-[0.65rem] text-muted-foreground/70 leading-relaxed">
                      <span className="text-primary/60">AI:</span> {item.aiRecommendation}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[0.55rem] text-muted-foreground/50">
                      <span className="flex items-center gap-1"><User className="h-2.5 w-2.5" /> {item.owner}</span>
                      <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {new Date(item.dueDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 mt-1">
                    <span className="text-[0.6rem] font-medium text-primary/80 group-hover:text-primary transition-colors">
                      İncele
                    </span>
                    <ArrowRight className="h-3 w-3 text-primary/50 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CEOInbox;
