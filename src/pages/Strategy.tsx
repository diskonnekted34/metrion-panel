import { useState } from "react";
import { motion } from "framer-motion";
import { Target, BarChart3, TrendingUp, FileText, Brain, ChevronRight, Calendar } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { OkrService } from "@/services/OkrService";
import { GovernanceIntelligenceService } from "@/services/GovernanceIntelligenceService";
import type { Objective } from "@/core/types/okr";

type TabId = "okr" | "reports" | "trends";

const Strategy = () => {
  const [activeTab, setActiveTab] = useState<TabId>("okr");
  const objectives = OkrService.getObjectives();
  const keyResults = OkrService.getKeyResults();
  const aggStats = GovernanceIntelligenceService.getAggregateStats();

  const tabs = [
    { id: "okr" as const, label: "OKR", icon: Target },
    { id: "reports" as const, label: "Raporlar", icon: BarChart3 },
    { id: "trends" as const, label: "Trend Analizi", icon: TrendingUp },
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-lg font-bold text-foreground">Strateji</h1>
            <p className="text-[11px] text-muted-foreground">OKR yönetimi, raporlar ve trend analizi</p>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mb-6 bg-secondary/30 rounded-2xl p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* OKR Tab */}
          {activeTab === "okr" && (
            <div className="space-y-3">
              {/* Summary strip */}
              <div className="flex items-center gap-6 text-[10px] mb-4">
                <div className="flex items-center gap-1.5">
                  <Target className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">Hedefler</span>
                  <span className="font-semibold text-foreground">{objectives.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Anahtar Sonuçlar</span>
                  <span className="font-semibold text-foreground">{keyResults.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">OKR'sız Koltuk</span>
                  <span className={`font-semibold ${aggStats.seats_without_okr > 0 ? "text-amber-400" : "text-foreground"}`}>{aggStats.seats_without_okr}</span>
                </div>
              </div>

              {objectives.map((obj) => {
                const linkedKRs = keyResults.filter(kr => kr.objective_id === obj.id);
                const avgProgress = linkedKRs.length > 0
                  ? Math.round(linkedKRs.reduce((s, kr) => s + (kr.target_value > 0 ? (kr.current_value / kr.target_value) * 100 : 0), 0) / linkedKRs.length)
                  : 0;
                return (
                  <div key={obj.id} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-semibold text-foreground">{obj.title}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{obj.owner_seat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full ${obj.deviation_flag ? "bg-amber-400/10 text-amber-400" : "bg-emerald-400/10 text-emerald-400"}`}>
                          {obj.deviation_flag ? "Sapma" : "Yolunda"}
                        </span>
                        <span className="text-xs font-bold text-foreground">%{avgProgress}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-3">
                      <div className={`h-full rounded-full transition-all ${avgProgress >= 60 ? "bg-emerald-400" : avgProgress >= 30 ? "bg-amber-400" : "bg-destructive"}`} style={{ width: `${avgProgress}%` }} />
                    </div>
                    {linkedKRs.length > 0 && (
                      <div className="space-y-1.5">
                        {linkedKRs.map(kr => {
                          const krProgress = kr.target_value > 0 ? Math.round((kr.current_value / kr.target_value) * 100) : 0;
                          return (
                            <div key={kr.id} className="flex items-center gap-3 text-[10px]">
                              <ChevronRight className="h-2.5 w-2.5 text-muted-foreground" />
                              <span className="flex-1 text-muted-foreground">{kr.title}</span>
                              <span className="text-foreground font-medium">{kr.current_value}/{kr.target_value}</span>
                              <span className="w-8 text-right font-medium text-foreground">%{krProgress}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              {/* AI CEO Report cards */}
              {["Günlük", "Haftalık", "Aylık", "Yıllık"].map((period) => (
                <div key={period} className="glass-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">AI CEO {period} Raporu</h3>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-400/10 text-violet-400 border border-violet-400/20">AI</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Punta Visual · Yönetim · {period} · {new Date().toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <Brain className="h-3 w-3 text-violet-400" />
                      <span className="text-violet-400 font-medium">Confidence: %{85 + Math.floor(Math.random() * 10)}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-[11px] text-muted-foreground">
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                      <p className="font-medium text-foreground mb-1">Executive Summary</p>
                      <p>Genel performans hedeflerin %{75 + Math.floor(Math.random() * 15)} üzerinde seyrediyor. Kritik KPI'larda sapma tespit edilmedi.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                  </div>
                  <button className="mt-3 text-[10px] text-primary hover:underline flex items-center gap-1">
                    Tam Raporu Görüntüle <ChevronRight className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === "trends" && (
            <div className="glass-card p-8 text-center">
              <TrendingUp className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Trend Analizi</h3>
              <p className="text-xs text-muted-foreground">KPI bazlı trend analizi yakında aktif olacak.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Strategy;
