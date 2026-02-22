import { useState } from "react";
import { Plus, FileText, Globe, ChevronDown, Info } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import StrategicSnapshot from "@/components/strategy/StrategicSnapshot";
import DecisionQueue from "@/components/strategy/DecisionQueue";
import ComparativeView from "@/components/strategy/ComparativeView";
import SimulationLab from "@/components/strategy/SimulationLab";
import ProjectionCanvas from "@/components/strategy/ProjectionCanvas";
import DecisionBuilder from "@/components/strategy/DecisionBuilder";
import { scenarios } from "@/data/strategyMock";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

type TimeWindow = "daily" | "weekly" | "monthly" | "yearly";

const timeWindows: { id: TimeWindow; label: string }[] = [
  { id: "daily", label: "Günlük" },
  { id: "weekly", label: "Haftalık" },
  { id: "monthly", label: "Aylık" },
  { id: "yearly", label: "Yıllık" },
];

const Strategy = () => {
  const [selectedScenario, setSelectedScenario] = useState("current");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("monthly");
  const [builderOpen, setBuilderOpen] = useState(false);

  const handleSaveDraft = (title: string) => {
    // In a real app, this would add to the decision queue
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Strateji</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Şirket düzeyinde planlama, kıyas, simülasyon ve karar üretimi</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] font-medium cursor-help">
                    <Globe className="h-2.5 w-2.5" /> Ortak Alan
                  </span>
                </TooltipTrigger>
                <TooltipContent className="text-[10px]">Bu sayfa tüm şirket için tek strateji alanıdır.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Scenario selector */}
            <select
              value={selectedScenario}
              onChange={e => setSelectedScenario(e.target.value)}
              className="h-8 rounded-xl border border-border bg-secondary px-3 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            >
              {scenarios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            {/* Time window */}
            <div className="flex gap-0.5 bg-secondary/30 rounded-xl p-0.5">
              {timeWindows.map(tw => (
                <button key={tw.id} onClick={() => setTimeWindow(tw.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                    timeWindow === tw.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >{tw.label}</button>
              ))}
            </div>

            {/* Actions */}
            <button className="h-8 px-3 rounded-xl border border-border text-[11px] font-medium text-foreground hover:bg-secondary/50 transition-colors flex items-center gap-1.5">
              <Plus className="h-3 w-3" /> Yeni Senaryo
            </button>
            <button onClick={() => setBuilderOpen(true)}
              className="h-8 px-3 rounded-xl bg-primary text-primary-foreground text-[11px] font-medium hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <FileText className="h-3 w-3" /> Karar Taslağı Oluştur
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="space-y-5">
          {/* Row 1: Snapshot (8) + Decision Queue (4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8">
              <StrategicSnapshot />
            </div>
            <div className="lg:col-span-4">
              <DecisionQueue onOpenBuilder={() => setBuilderOpen(true)} />
            </div>
          </div>

          {/* Row 2: Comparative (7) + Simulation (5) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7">
              <ComparativeView />
            </div>
            <div className="lg:col-span-5">
              <SimulationLab />
            </div>
          </div>

          {/* Row 3: Projections (full width) */}
          <ProjectionCanvas />
        </div>

        {/* Decision Builder Drawer */}
        <DecisionBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} onSaveDraft={handleSaveDraft} />
      </div>
    </AppLayout>
  );
};

export default Strategy;
