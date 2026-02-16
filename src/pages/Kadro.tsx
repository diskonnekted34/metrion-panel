import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, UserPlus, UserMinus, Bot, User, Shield, Eye, Pencil, Crown,
  ArrowRight, CheckCircle2, Zap, Brain, ChevronDown
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import {
  executivePositions, ExecutivePosition, getModeLabel, getModeColor, PositionMode
} from "@/data/executivePositions";

const scopeLabel = (scope: string) => {
  if (scope === "global") return "Şirket Geneli";
  if (scope === "department") return "Departman";
  return "Yok";
};

const Kadro = () => {
  const [positions, setPositions] = useState(executivePositions);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const humanCount = positions.filter(p => p.assignedHuman).length;
  const autopilotCount = positions.filter(p => p.mode === "autopilot").length;
  const advisoryCount = positions.filter(p => p.mode === "advisory").length;

  const toggleMode = (posId: string) => {
    setPositions(prev => prev.map(p => {
      if (p.id !== posId) return p;
      if (p.assignedHuman) {
        // Has human: toggle advisory ↔ hybrid
        return { ...p, mode: p.mode === "advisory" ? "hybrid" as PositionMode : "advisory" as PositionMode };
      }
      // No human: always autopilot
      return p;
    }));
  };

  const removeHuman = (posId: string) => {
    setPositions(prev => prev.map(p =>
      p.id === posId ? { ...p, assignedHuman: undefined, mode: "autopilot" as PositionMode } : p
    ));
  };

  const assignHuman = (posId: string) => {
    setPositions(prev => prev.map(p =>
      p.id === posId ? { ...p, assignedHuman: { name: "Yeni Atanan", email: "yeni@company.com" }, mode: "advisory" as PositionMode } : p
    ));
  };

  return (
    <AppLayout>
      <div className="min-h-screen relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "linear-gradient(rgba(30,107,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-2xl font-bold text-foreground mb-1">Kadro</h1>
            <p className="text-sm text-muted-foreground">Yönetici pozisyonları, yetki kapsamları ve insan-AI görev dağılımı.</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Toplam Pozisyon", value: positions.length, icon: Crown, accent: "text-primary" },
              { label: "İnsan Atanmış", value: humanCount, icon: User, accent: "text-primary" },
              { label: "AI Otopilot", value: autopilotCount, icon: Bot, accent: "text-purple-400" },
              { label: "Danışman Mod", value: advisoryCount, icon: Brain, accent: "text-primary" },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.accent}`} />
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Position Cards */}
          <div className="space-y-3">
            {positions.map((pos, i) => {
              const modeClasses = getModeColor(pos.mode);
              const isExpanded = expandedId === pos.id;

              return (
                <motion.div
                  key={pos.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass-card overflow-hidden"
                >
                  {/* Main row */}
                  <div
                    className="p-5 flex items-center gap-4 cursor-pointer hover:bg-secondary/20 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : pos.id)}
                  >
                    {/* Mode indicator */}
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border ${modeClasses}`}>
                      {pos.assignedHuman ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-foreground">{pos.shortTitle}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${modeClasses}`}>
                          {getModeLabel(pos.mode)}
                        </span>
                        {pos.approvalAuthority && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
                            Onay Yetkisi
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{pos.title}</p>
                    </div>

                    {/* Authority badge */}
                    <div className="hidden md:flex items-center gap-4">
                      {pos.assignedHuman ? (
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <User className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div>
                            <p className="text-[11px] font-medium text-foreground">{pos.assignedHuman.name}</p>
                            <p className="text-[9px] text-muted-foreground">Final Karar Yetkisi</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
                            <Bot className="h-3.5 w-3.5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-[11px] font-medium text-purple-400">AI Otopilot Aktif</p>
                            <p className="text-[9px] text-muted-foreground">Onay kuralları dahilinde</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Scope */}
                    <div className="hidden lg:flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-[9px] text-muted-foreground">Okuma</p>
                        <p className="text-[10px] font-medium text-foreground">{scopeLabel(pos.readScope)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] text-muted-foreground">Yazma</p>
                        <p className="text-[10px] font-medium text-foreground">{scopeLabel(pos.writeScope)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] text-muted-foreground">Limit</p>
                        <p className="text-[10px] font-medium text-foreground">{pos.approvalLimit}</p>
                      </div>
                    </div>

                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="border-t border-border px-5 py-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Decision Rights */}
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Karar Yetkileri</p>
                          <div className="space-y-2">
                            {pos.decisionRights.map((right, j) => (
                              <div key={j} className="flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                                <span className="text-[11px] text-foreground">{right}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Auto-execution scope */}
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Otomatik Yürütme Kapsamı</p>
                          <div className="space-y-2">
                            {pos.autoExecutionScope.map((scope, j) => (
                              <div key={j} className="flex items-center gap-2">
                                <Zap className="h-3 w-3 text-primary shrink-0" />
                                <span className="text-[11px] text-muted-foreground font-mono">{scope}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pozisyon Yönetimi</p>
                          <div className="space-y-2">
                            {pos.assignedHuman ? (
                              <>
                                <button
                                  onClick={() => removeHuman(pos.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                  <UserMinus className="h-3.5 w-3.5" /> İnsan Atamasını Kaldır
                                </button>
                                <button
                                  onClick={() => toggleMode(pos.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                >
                                  <Brain className="h-3.5 w-3.5" /> {pos.mode === "advisory" ? "Hibrit Moda Geç" : "Danışman Moda Geç"}
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => assignHuman(pos.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium border border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                              >
                                <UserPlus className="h-3.5 w-3.5" /> İnsan Ata
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Kadro;
