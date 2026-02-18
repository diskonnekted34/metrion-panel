import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bell, AlertTriangle, ArrowRight, Eye, Search, CheckCircle2, Filter } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { alertsData } from "@/data/alerts";

const severityOptions = ["Tümü", "Kritik", "Yüksek", "Orta", "Düşük"];
const agentOptions = ["Tümü", "AI CMO", "AI CFO", "AI CSO", "AI CTO", "AI CEO", "Hukuk Masası"];
const statusOptions = ["Tümü", "Çözülmemiş", "Çözülmüş"];

const Alerts = () => {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("Tümü");
  const [agent, setAgent] = useState("Tümü");
  const [status, setStatus] = useState("Tümü");

  const filtered = alertsData.filter((a) => {
    if (search && !a.text.toLowerCase().includes(search.toLowerCase()) && !a.detail.toLowerCase().includes(search.toLowerCase())) return false;
    if (severity !== "Tümü" && a.urgency !== severity) return false;
    if (agent !== "Tümü" && a.agent !== agent) return false;
    if (status === "Çözülmemiş" && a.resolved) return false;
    if (status === "Çözülmüş" && !a.resolved) return false;
    return true;
  });

  const urgencyBorder = (u: string) => {
    if (u === "Kritik") return "border-l-destructive";
    if (u === "Yüksek") return "border-l-warning";
    if (u === "Orta") return "border-l-primary";
    return "border-l-muted";
  };

  const urgencyChip = (u: string) => {
    if (u === "Kritik") return "bg-destructive/15 text-destructive";
    if (u === "Yüksek") return "bg-warning/15 text-warning";
    if (u === "Orta") return "bg-primary/15 text-primary";
    return "bg-secondary text-muted-foreground";
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-destructive/15 flex items-center justify-center">
              <Bell className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Operasyonel Sinyaller</h1>
              <p className="text-sm text-muted-foreground">AI ekibinizden gelen kritik sinyaller ve öneriler</p>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-card p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Sinyal ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-2xl py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="bg-secondary/50 border border-border rounded-2xl py-2 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer">
                  {severityOptions.map((s) => <option key={s} value={s}>{s === "Tümü" ? "Aciliyet" : s}</option>)}
                </select>
                <select value={agent} onChange={(e) => setAgent(e.target.value)} className="bg-secondary/50 border border-border rounded-2xl py-2 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer">
                  {agentOptions.map((a) => <option key={a} value={a}>{a === "Tümü" ? "Ajan" : a}</option>)}
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-secondary/50 border border-border rounded-2xl py-2 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer">
                  {statusOptions.map((s) => <option key={s} value={s}>{s === "Tümü" ? "Durum" : s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="glass-card p-10 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Sistem izleme yapıyor. Kritik sinyal yok.</p>
            </div>
          )}

          {/* Alert List */}
          <div className="space-y-3">
            {filtered.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-5 border-l-[3px] ${urgencyBorder(alert.urgency)} ${alert.resolved ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="shrink-0 mt-0.5">
                      {alert.resolved ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <AlertTriangle className={`h-4 w-4 ${alert.urgency === "Kritik" ? "text-destructive" : alert.urgency === "Yüksek" ? "text-warning" : "text-primary"}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground mb-1">{alert.text}</p>
                      <p className="text-xs text-muted-foreground mb-2">{alert.detail}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[10px]">
                        <span className="text-muted-foreground">{alert.agent}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{alert.timestamp}</span>
                        <span className={`font-medium px-2 py-0.5 rounded-2xl ${urgencyChip(alert.urgency)}`}>{alert.urgency}</span>
                        <span className="text-muted-foreground">Güven: {alert.confidence}</span>
                      </div>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toast.success("Görev oluşturuldu.")} className="text-xs font-medium text-accent hover:underline flex items-center gap-1 whitespace-nowrap">
                        Göreve Dönüştür <ArrowRight className="h-3 w-3" />
                      </button>
                      <Link to={`/alerts/${alert.id}`} className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 whitespace-nowrap">
                        <Eye className="h-3 w-3" /> Analiz
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Alerts;
