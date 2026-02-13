import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, BarChart3, Settings, Users, Activity, TrendingUp, Clock, ChevronRight } from "lucide-react";
import { experts } from "@/data/experts";
import { useLanguage } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const statuses = ["Active", "Idle", "Running Task", "Active", "Idle", "Active"];

const Dashboard = () => {
  const { t } = useLanguage();

  const statusTranslate = (s: string) => {
    if (s === "Active") return t.dashboard.active;
    if (s === "Idle") return t.dashboard.idle;
    return t.dashboard.running;
  };

  const stats = [
    { label: t.dashboard.totalTasks, value: "124,580", icon: Activity, change: "+12%" },
    { label: t.dashboard.efficiency, value: "94.2%", icon: TrendingUp, change: "+3.1%" },
    { label: t.dashboard.activeAgents, value: "6", icon: Users, change: "" },
    { label: t.dashboard.revenue, value: "$2.4M", icon: BarChart3, change: "+18%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">{t.dashboard.welcome}</h1>
            <p className="text-muted-foreground">{t.dashboard.subtitle}</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                  {stat.change && (
                    <span className="text-xs text-green-400 font-medium">{stat.change}</span>
                  )}
                </div>
                <p className="text-2xl font-bold text-foreground mb-0.5">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* My AI Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">{t.dashboard.myTeam}</h2>
              <Link to="/" className="text-sm text-primary hover:underline flex items-center gap-1">
                {t.nav.marketplace} <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experts.map((expert, i) => {
                const status = statuses[i] || "Idle";
                return (
                  <motion.div
                    key={expert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className="glass-card p-5 group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <img src={expert.avatar} alt={expert.name} className="h-12 w-12 rounded-xl object-cover ring-2 ring-border/40" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">{expert.name}</h3>
                        <p className="text-xs text-muted-foreground">{expert.tagline}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${status === "Active" ? "bg-primary/20 text-primary" : status === "Running Task" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                        {statusTranslate(status)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>2h ago</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span>{expert.tasksCompleted.toLocaleString()} {t.expertProfile.tasksCompleted}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/expert/${expert.id}`}
                        className="flex-1 text-center text-xs py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                      >
                        {t.dashboard.open}
                      </Link>
                      <button className="flex-1 text-xs py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                        {t.dashboard.assignTask}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">{t.dashboard.tasks}</h2>
            <div className="glass-card divide-y divide-border/50">
              {[
                { agent: "Lexis", task: "Contract review for Series B", time: "12 min ago", status: "Running" },
                { agent: "Nova", task: "Q4 SEO performance report", time: "1h ago", status: "Completed" },
                { agent: "Atlas", task: "Revenue forecast model update", time: "2h ago", status: "Completed" },
                { agent: "Muse", task: "Brand voice guidelines v2", time: "4h ago", status: "Completed" },
                { agent: "Aria", task: "Supply chain bottleneck analysis", time: "5h ago", status: "Completed" },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{task.task}</p>
                      <p className="text-xs text-muted-foreground">{task.agent} · {task.time}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                    task.status === "Running" ? "bg-primary/20 text-primary" : "bg-green-500/20 text-green-400"
                  }`}>
                    {task.status}
                  </span>
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
