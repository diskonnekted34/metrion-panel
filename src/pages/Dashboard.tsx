import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Activity, TrendingUp, Clock, ChevronRight, AlertTriangle, ArrowRight, Shield, Calendar } from "lucide-react";
import { executives } from "@/data/experts";
import { useLanguage } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const { t } = useLanguage();

  const statusColor = (s: string) => {
    if (s === "Monitoring") return "bg-accent/15 text-accent";
    if (s === "Running Task") return "bg-white/[0.06] text-muted-foreground";
    if (s === "Alerting") return "bg-destructive/15 text-destructive";
    return "bg-white/[0.06] text-muted-foreground";
  };

  const statusLabel = (s: string) => {
    if (s === "Monitoring") return t.dashboard.monitoring;
    if (s === "Running Task") return t.dashboard.runningTask;
    if (s === "Alerting") return t.dashboard.alerting;
    return t.dashboard.idle;
  };

  const insights = [
    { text: "ROAS dropped 18% on Meta campaigns in the last 48 hours", urgency: "High", confidence: "94%", agent: "AI CMO" },
    { text: "Product margin on SKU-1247 fell below break-even threshold", urgency: "Critical", confidence: "97%", agent: "AI CFO" },
    { text: "3 supplier contracts expire within 14 days — clause review recommended", urgency: "Medium", confidence: "89%", agent: "Legal Desk" },
  ];

  const weeklyRhythm = [
    { day: t.weekdays.monday, output: "CEO Brief", agent: "AI CEO" },
    { day: t.weekdays.tuesday, output: "Growth Plan", agent: "AI CSO" },
    { day: t.weekdays.wednesday, output: "Finance Brief", agent: "AI CFO" },
    { day: t.weekdays.thursday, output: "Systems Brief", agent: "AI CTO" },
    { day: t.weekdays.friday, output: "Weekly Wrap", agent: "AI CEO" },
  ];

  const tasks = [
    { title: "Review Q4 campaign creative performance", agent: "AI CMO", status: "In Progress", time: "12 min ago" },
    { title: "Update cashflow forecast with latest revenue data", agent: "AI CFO", status: "Completed", time: "1h ago" },
    { title: "Map top 10 automation opportunities", agent: "AI CTO", status: "In Progress", time: "2h ago" },
    { title: "Score supplier contract risk for renewal", agent: "Legal Desk", status: "Completed", time: "4h ago" },
  ];

  const impact = [
    { label: t.dashboard.revenueImpact, value: "$2.4M", icon: TrendingUp },
    { label: t.dashboard.hoursSaved, value: "186h", icon: Clock },
    { label: t.dashboard.risksMitigated, value: "23", icon: Shield },
    { label: t.dashboard.automationsRun, value: "47", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.2, 0.8, 0.2, 1] }} className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t.dashboard.welcome}</h1>
            <p className="text-muted-foreground">{t.dashboard.subtitle}</p>
          </motion.div>

          {/* Insight Bar */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t.dashboard.insightBar}</h2>
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <div key={i} className={`${i === 1 ? "glass-bento" : "glass-card"} p-5 flex items-center justify-between gap-4`}>
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`rounded-[14px] p-2 shrink-0 ${insight.urgency === "Critical" ? "bg-destructive/15" : insight.urgency === "High" ? "bg-primary/15" : "bg-white/[0.06]"}`}>
                      <AlertTriangle className={`h-4 w-4 ${insight.urgency === "Critical" ? "text-destructive" : "text-primary"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{insight.text}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{insight.agent}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-[10px] ${
                          insight.urgency === "Critical" ? "bg-destructive/15 text-destructive" :
                          insight.urgency === "High" ? "bg-primary/15 text-primary" :
                          "bg-white/[0.06] text-muted-foreground"
                        }`}>{t.dashboard.urgency}: {insight.urgency}</span>
                        <span className="text-[10px] text-muted-foreground">{t.dashboard.confidence}: {insight.confidence}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-accent hover:underline whitespace-nowrap flex items-center gap-1">
                    {t.dashboard.convertToTask} <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Team Status */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">{t.dashboard.teamStatus}</h2>
              <Link to="/marketplace" className="text-sm text-primary hover:underline flex items-center gap-1">
                {t.dashboard.myTeam} <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {executives.map((exec, i) => (
                <motion.div
                  key={exec.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                  className="glass-card p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img src={exec.avatar} alt={exec.name} className="h-11 w-11 rounded-[14px] object-cover ring-2 ring-white/[0.08]" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-primary text-sm">{exec.role}</h3>
                      <p className="text-xs text-muted-foreground truncate">{exec.name}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-[10px] ${statusColor(exec.status)}`}>
                      {statusLabel(exec.status)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{exec.performanceScore}% performance</span>
                    <span>{exec.tasksCompleted.toLocaleString()} tasks</span>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/expert/${exec.id}`} className="flex-1 text-center text-xs py-2 rounded-[14px] bg-white/[0.05] hover:bg-white/[0.08] text-foreground transition-colors">
                      {t.dashboard.open}
                    </Link>
                    <button className="flex-1 text-xs py-2 rounded-[14px] bg-primary/15 hover:bg-primary/25 text-primary transition-colors">
                      {t.dashboard.assign}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Rhythm */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t.dashboard.weeklyRhythm}</h2>
            <div className="glass-bento p-6">
              <div className="grid grid-cols-5 gap-3">
                {weeklyRhythm.map((day, i) => (
                  <div key={i} className="text-center p-4 rounded-[20px] bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs font-semibold text-foreground mb-1">{day.day}</p>
                    <p className="text-[11px] text-muted-foreground">{day.output}</p>
                    <p className="text-[10px] text-accent mt-1">{day.agent}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Priority Tasks */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t.dashboard.topTasks}</h2>
            <div className="glass-card divide-y divide-white/[0.06]">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-[14px] bg-primary/10 flex items-center justify-center">
                      <Activity className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.agent} · {task.time}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-[10px] ${
                    task.status === "In Progress" ? "bg-accent/15 text-accent" : "bg-white/[0.06] text-muted-foreground"
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Impact Snapshot */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">{t.dashboard.impactSnapshot}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {impact.map((item, i) => (
                <div key={item.label} className={`${i === 0 || i === 3 ? "glass-bento" : "glass-card"} p-5 text-center`}>
                  <div className="mx-auto w-10 h-10 rounded-[16px] bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
