import { motion } from "framer-motion";
import { ListTodo, Activity, Clock, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const tasks = [
  { title: "Q4 kampanya kreatif performansını incele", agent: "AI CMO", status: "Devam Ediyor", time: "12 dk önce" },
  { title: "Son gelir verileriyle nakit akışı tahminini güncelle", agent: "AI CFO", status: "Tamamlandı", time: "1 saat önce" },
  { title: "İlk 10 otomasyon fırsatını haritalandır", agent: "AI CTO", status: "Devam Ediyor", time: "2 saat önce" },
  { title: "Tedarikçi sözleşme risklerini yenileme için puanla", agent: "Hukuk Masası", status: "Tamamlandı", time: "4 saat önce" },
  { title: "Sosyal medya içerik takvimini hazırla", agent: "Echo", status: "Devam Ediyor", time: "30 dk önce" },
  { title: "Marka tutarlılık denetimi yap", agent: "Prism", status: "Bekliyor", time: "5 saat önce" },
  { title: "Ürün yol haritası önceliklendirmesini güncelle", agent: "Forge", status: "Devam Ediyor", time: "1 saat önce" },
];

const Tasks = () => {
  const statusStyle = (s: string) => {
    if (s === "Devam Ediyor") return "bg-accent/15 text-accent";
    if (s === "Tamamlandı") return "bg-white/[0.06] text-muted-foreground";
    return "bg-primary/15 text-primary";
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Devam Ediyor", value: tasks.filter(t => t.status === "Devam Ediyor").length, icon: Activity, color: "text-accent" },
              { label: "Tamamlandı", value: tasks.filter(t => t.status === "Tamamlandı").length, icon: CheckCircle2, color: "text-muted-foreground" },
              { label: "Bekliyor", value: tasks.filter(t => t.status === "Bekliyor").length, icon: Clock, color: "text-primary" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="glass-card divide-y divide-white/[0.06]">
            {tasks.map((task, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Activity className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.agent} · {task.time}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${statusStyle(task.status)}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Tasks;
