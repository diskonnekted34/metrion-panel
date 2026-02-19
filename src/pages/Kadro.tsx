import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, UserPlus, UserMinus, Bot, User, Shield, Eye, Crown,
  CheckCircle2, Zap, Brain, ChevronDown, AlertTriangle, ArrowUpRight,
  Activity, Sparkles, Lock
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import {
  executivePositions, ExecutivePosition, getModeLabel, getModeColor,
  PositionMode, getPositionsByCategory, getCategoryLabel, SeatCategory
} from "@/data/executivePositions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useRBAC } from "@/contexts/RBACContext";

const scopeLabel = (scope: string) => {
  if (scope === "global") return "Şirket Geneli";
  if (scope === "department") return "Departman";
  return "Yok";
};

const categoryIcons: Record<SeatCategory, typeof Crown> = {
  executive: Crown,
  department: Users,
  creative_intelligence: Sparkles,
};

const Kadro = () => {
  const { currentUser } = useRBAC();
  const isOwner = currentUser.role === "owner";
  const [positions, setPositions] = useState(executivePositions);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const grouped = {
    executive: positions.filter(p => p.category === "executive"),
    department: positions.filter(p => p.category === "department"),
    creative_intelligence: positions.filter(p => p.category === "creative_intelligence"),
  };

  const humanCount = positions.filter(p => p.assignedHuman).length;
  const autopilotCount = positions.filter(p => p.mode === "autopilot").length;
  const advisoryCount = positions.filter(p => p.mode === "advisory_dominant").length;
  const totalOverrides = positions.reduce((s, p) => s + p.overrideCount, 0);

  const guardOwner = (action: () => void) => {
    if (!isOwner) {
      toast.error("Bu işlem yalnızca Sahip (Owner) yetkisiyle yapılabilir.");
      return;
    }
    action();
  };

  const cycleMode = (posId: string) => {
    guardOwner(() => {
      setPositions(prev => prev.map(p => {
        if (p.id !== posId) return p;
        if (p.assignedHuman) {
          const next: PositionMode = p.mode === "advisory_dominant" ? "assisted" : "advisory_dominant";
          return { ...p, mode: next };
        }
        return p;
      }));
    });
  };

  const removeHuman = (posId: string) => {
    guardOwner(() => {
      setPositions(prev => prev.map(p =>
        p.id === posId ? { ...p, assignedHuman: undefined, mode: "autopilot" as PositionMode } : p
      ));
    });
  };

  const assignHuman = (posId: string) => {
    guardOwner(() => {
      setPositions(prev => prev.map(p =>
        p.id === posId ? { ...p, assignedHuman: { name: "Yeni Atanan", email: "yeni@company.com" }, mode: "advisory_dominant" as PositionMode } : p
      ));
    });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="min-h-screen relative">
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: "linear-gradient(rgba(30,107,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

          <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
              {[
                { label: "Toplam Pozisyon", value: positions.length, icon: Crown, accent: "text-foreground" },
                { label: "İnsan Atanmış", value: humanCount, icon: User, accent: "text-primary" },
                { label: "AI Danışman Dominant", value: advisoryCount, icon: Brain, accent: "text-violet-400" },
                { label: "Tam Otopilot", value: autopilotCount, icon: Bot, accent: "text-purple-600" },
                { label: "İnsan Override", value: totalOverrides, icon: AlertTriangle, accent: "text-warning" },
              ].map(stat => (
                <div key={stat.label} className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={`h-4 w-4 ${stat.accent}`} />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Grouped Sections */}
            {(["executive", "department", "creative_intelligence"] as SeatCategory[]).map(cat => {
              const CatIcon = categoryIcons[cat];
              const catPositions = grouped[cat];
              return (
                <section key={cat} className="mb-10">
                  <div className="flex items-center gap-2.5 mb-4">
                    <CatIcon className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">{getCategoryLabel(cat)}</h2>
                    <span className="text-[10px] text-muted-foreground">{catPositions.length} pozisyon</span>
                  </div>

                  <div className="space-y-2">
                    {catPositions.map((pos, i) => {
                      const modeClasses = getModeColor(pos.mode);
                      const isExpanded = expandedId === pos.id;
                      const hasOverrides = pos.overrideCount > 0;

                      return (
                        <motion.div
                          key={pos.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className={`glass-card overflow-hidden ${hasOverrides ? "border-warning/20" : ""}`}
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
                              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <h3 className="text-sm font-bold text-foreground">{pos.shortTitle}</h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${modeClasses}`}>
                                  {getModeLabel(pos.mode)}
                                </span>
                                {pos.approvalAuthority && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
                                    Onay Yetkisi
                                  </span>
                                )}
                                {pos.escalationPower && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                                    Escalation
                                  </span>
                                )}
                                {hasOverrides && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30 animate-pulse">
                                        {pos.overrideCount} Override
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      <p className="text-xs">İnsan, AI önerisini {pos.overrideCount} kez geçersiz kıldı</p>
                                    </TooltipContent>
                                  </Tooltip>
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
                                    <p className="text-[9px] text-muted-foreground">AI Dominant Danışmanlık</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-full bg-purple-600/10 border border-purple-600/20 flex items-center justify-center">
                                    <Bot className="h-3.5 w-3.5 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-medium text-purple-400">Tam Otopilot</p>
                                    <p className="text-[9px] text-muted-foreground">Onay kuralları dahilinde</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Metrics */}
                            <div className="hidden lg:flex items-center gap-4">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="text-center">
                                    <p className="text-[9px] text-muted-foreground">AI Challenge</p>
                                    <p className="text-[11px] font-bold text-violet-400">{pos.aiChallengeFrequency}</p>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="text-xs">AI bu koltuğa {pos.aiChallengeFrequency} kez itiraz etti</p>
                                </TooltipContent>
                              </Tooltip>
                              <div className="text-center">
                                <p className="text-[9px] text-muted-foreground">Limit</p>
                                <p className="text-[10px] font-medium text-foreground">{pos.approvalLimit}</p>
                              </div>
                            </div>

                            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </div>

                          {/* Expanded detail */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-border px-5 py-5">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Assigned Human & AI Mode */}
                                    <div>
                                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Atama & Mod</p>
                                      <div className="space-y-2 text-[11px]">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Atanan İnsan</span>
                                          <span className="text-foreground font-medium">{pos.assignedHuman?.name || "—"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">AI Modu</span>
                                          <span className={`font-bold ${modeClasses.split(" ").find(c => c.startsWith("text-")) || "text-foreground"}`}>{getModeLabel(pos.mode)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Onay Yetkisi</span>
                                          <span className="text-foreground font-medium">{pos.approvalAuthority ? "Evet" : "Hayır"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Escalation</span>
                                          <span className="text-foreground font-medium">{pos.escalationPower ? "Aktif" : "Pasif"}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Authority Scope & Threshold */}
                                    <div>
                                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Yetki Kapsamı</p>
                                      <div className="space-y-2 text-[11px]">
                                        <div className="flex justify-between"><span className="text-muted-foreground">Okuma</span><span className="text-foreground font-medium">{scopeLabel(pos.readScope)}</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">Yazma</span><span className="text-foreground font-medium">{scopeLabel(pos.writeScope)}</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">Karar Eşiği</span><span className="text-foreground font-medium">{pos.decisionThreshold}</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">Onay Limiti</span><span className="text-foreground font-medium">{pos.approvalLimit}</span></div>
                                      </div>
                                    </div>

                                    {/* Governance Metrics */}
                                    <div>
                                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Yönetişim Metrikleri</p>
                                      <div className="space-y-2 text-[11px]">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Override Sayısı</span>
                                          <span className={`font-bold ${pos.overrideCount > 0 ? "text-warning" : "text-foreground"}`}>{pos.overrideCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">AI Challenge</span>
                                          <span className="text-violet-400 font-bold">{pos.aiChallengeFrequency}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Son Aktivite</span>
                                          <span className="text-foreground font-medium">{formatDate(pos.lastStrategicActivity)}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div>
                                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pozisyon Yönetimi</p>
                                      <div className="space-y-2">
                                        {pos.assignedHuman ? (
                                          <>
                                            <button
                                              onClick={(e) => { e.stopPropagation(); removeHuman(pos.id); }}
                                              disabled={!isOwner}
                                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium border transition-colors ${isOwner ? "border-destructive/20 text-destructive hover:bg-destructive/10" : "border-border text-muted-foreground/40 cursor-not-allowed"}`}
                                            >
                                              {isOwner ? <UserMinus className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />} İnsan Atamasını Kaldır
                                            </button>
                                            <button
                                              onClick={(e) => { e.stopPropagation(); cycleMode(pos.id); }}
                                              disabled={!isOwner}
                                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium border transition-colors ${isOwner ? "border-border text-muted-foreground hover:text-foreground hover:bg-secondary" : "border-border text-muted-foreground/40 cursor-not-allowed"}`}
                                            >
                                              {isOwner ? <Brain className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                                              {pos.mode === "advisory_dominant" ? "Asiste Moda Geç" : "Danışman Dominant Moda Geç"}
                                            </button>
                                          </>
                                        ) : (
                                          <button
                                            onClick={(e) => { e.stopPropagation(); assignHuman(pos.id); }}
                                            disabled={!isOwner}
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium border transition-colors ${isOwner ? "border-primary/20 text-primary hover:bg-primary/10" : "border-border text-muted-foreground/40 cursor-not-allowed"}`}
                                          >
                                            {isOwner ? <UserPlus className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />} İnsan Ata
                                          </button>
                                        )}
                                        {!isOwner && (
                                          <p className="text-[9px] text-muted-foreground/60 mt-1">Pozisyon yönetimi yalnızca Sahip yetkisiyle yapılabilir.</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Decision Rights */}
                                  <div className="mt-5 pt-4 border-t border-border/40">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Karar Yetkileri</p>
                                        <div className="space-y-1.5">
                                          {pos.decisionRights.map((right, j) => (
                                            <div key={j} className="flex items-center gap-2">
                                              <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                                              <span className="text-[11px] text-foreground">{right}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Oto-Yürütme Kapsamı</p>
                                        <div className="space-y-1.5">
                                          {pos.autoExecutionScope.map((scope, j) => (
                                            <div key={j} className="flex items-center gap-2">
                                              <Zap className="h-3 w-3 text-primary shrink-0" />
                                              <span className="text-[11px] text-muted-foreground font-mono">{scope}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Console Navigation Button */}
                                  <div className="mt-5 flex justify-end">
                                    <Button asChild size="sm" className="gap-2">
                                      <Link to={`/workspace/${pos.agentId}`}>
                                        <Activity className="h-3.5 w-3.5" />
                                        Ajan Konsoluna Git
                                        <ArrowUpRight className="h-3 w-3" />
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </TooltipProvider>
    </AppLayout>
  );
};

export default Kadro;
