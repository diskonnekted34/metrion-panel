import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useOKR } from "@/core/store/OKRContext";
import { usePacks } from "@/contexts/PackContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Target, TrendingUp, TrendingDown, AlertTriangle, Shield, Zap,
  ChevronRight, Activity, BarChart3, Lock, Info, RefreshCw, Send,
  Layers, GitBranch, ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";
import { calculateKRProgress } from "@/core/engine/okr";
import { Objective, KeyResult, CorrectiveDecisionDraft } from "@/core/types/okr";
import { useState } from "react";

// ── Plan Gate ───────────────────────────────────────────
const PlanGate = () => {
  const { activateTier } = usePacks();
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">OKR Stratejik Motoru</h1>
          <p className="text-muted-foreground mb-6">
            OKR sistemi Performance veya Workforce planlarında kullanılabilir.
            Core planınız bu özelliği desteklememektedir.
          </p>
          <Button onClick={() => activateTier("performance")} className="mr-2">
            Performance'a Yükselt
          </Button>
          <Button variant="outline" onClick={() => activateTier("workforce")}>
            Workforce'a Yükselt
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

// ── Health Badge ────────────────────────────────────────
const HealthBadge = ({ score }: { score: number }) => {
  const color = score >= 70 ? "text-emerald-400" : score >= 45 ? "text-amber-400" : "text-red-400";
  const bg = score >= 70 ? "bg-emerald-400/10" : score >= 45 ? "bg-amber-400/10" : "bg-red-400/10";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color} ${bg}`}>
      {score >= 70 ? <TrendingUp className="w-3 h-3" /> : score >= 45 ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {score}
    </span>
  );
};

// ── Risk Badge ──────────────────────────────────────────
const RiskBadge = ({ score }: { score: number }) => {
  if (score < 30) return <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 text-xs">Düşük Risk</Badge>;
  if (score < 60) return <Badge variant="outline" className="text-amber-400 border-amber-400/30 text-xs">Orta Risk</Badge>;
  return <Badge variant="outline" className="text-red-400 border-red-400/30 text-xs">Yüksek Risk</Badge>;
};

// ── KR Row ──────────────────────────────────────────────
const KRRow = ({ kr }: { kr: KeyResult }) => {
  const progress = calculateKRProgress(kr);
  const statusColor = kr.status === "on_track" ? "bg-emerald-400" : kr.status === "at_risk" ? "bg-amber-400" : kr.status === "behind" ? "bg-red-400" : "bg-primary";
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
      <div className={`w-2 h-2 rounded-full ${statusColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{kr.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <Progress value={progress} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {kr.current_value.toLocaleString()} / {kr.target_value.toLocaleString()}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground">%{Math.round(progress)}</span>
    </div>
  );
};

// ── Objective Card ──────────────────────────────────────
const ObjectiveCard = ({ objective, keyResults, children, isWorkforce, onRecalculate, onCorrection }: {
  objective: Objective;
  keyResults: KeyResult[];
  children?: Objective[];
  isWorkforce: boolean;
  onRecalculate: () => void;
  onCorrection: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="bg-card/60 backdrop-blur border-border/40 hover:border-border/60 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {objective.level === "strategic" ? (
                <Layers className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <GitBranch className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <Badge variant="outline" className="text-[10px] uppercase">
                {objective.level === "strategic" ? "Stratejik" : "Taktik"}
              </Badge>
              <Badge variant="outline" className="text-[10px]">{objective.department_key}</Badge>
            </div>
            <CardTitle className="text-base leading-tight">{objective.title}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{objective.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <HealthBadge score={objective.health_score} />
            <RiskBadge score={objective.risk_score} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Scores Row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">Sağlık</p>
                <p className="text-sm font-bold">{objective.health_score}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs text-xs">
              <p className="font-medium mb-1">Sağlık Skoru Açıklaması:</p>
              <p>{objective.health_explanation.summary}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">Risk</p>
                <p className="text-sm font-bold">{objective.risk_score}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs text-xs">
              <p className="font-medium mb-1">Risk Açıklaması:</p>
              <p>{objective.risk_explanation}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">Başarı</p>
                <p className="text-sm font-bold">%{objective.probability_of_success}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs text-xs">
              <p className="font-medium mb-1">Başarı Olasılığı Açıklaması:</p>
              <p>{objective.success_explanation}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Deviation Alert */}
        {objective.deviation_flag && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-xs text-red-300">
              Sapma tespit edildi: %{objective.deviation_delta} beklenen ilerlemenin gerisinde
            </p>
          </div>
        )}

        {/* Key Results */}
        <div className="mb-2">
          <p className="text-xs font-medium text-muted-foreground mb-1">Anahtar Sonuçlar</p>
          {keyResults.map(kr => <KRRow key={kr.id} kr={kr} />)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/30">
          <Button size="sm" variant="ghost" className="text-xs h-7" onClick={onRecalculate}>
            <RefreshCw className="w-3 h-3 mr-1" /> Yeniden Hesapla
          </Button>
          {isWorkforce && objective.deviation_flag && (
            <Button size="sm" variant="ghost" className="text-xs h-7 text-amber-400" onClick={onCorrection}>
              <Zap className="w-3 h-3 mr-1" /> Düzeltici Karar Oluştur
            </Button>
          )}
          {children && children.length > 0 && (
            <Button size="sm" variant="ghost" className="text-xs h-7 ml-auto" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Gizle" : `${children.length} Alt Hedef`}
              <ChevronRight className={`w-3 h-3 ml-1 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ── Strategic Health Panel (Workforce) ──────────────────
const StrategicHealthPanel = () => {
  const { strategicHealthIndex, atRiskObjectives, departmentAlignments } = useOKR();
  const shi = strategicHealthIndex;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-card/60 backdrop-blur border-border/40 col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" /> Stratejik Sağlık Endeksi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-3">
            <div>
              <p className="text-4xl font-bold">{shi.overall_score}</p>
              <p className="text-xs text-muted-foreground">/100</p>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400">{shi.on_track_count}</p>
                <p className="text-[10px] text-muted-foreground">Yolunda</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-400">{shi.at_risk_count}</p>
                <p className="text-[10px] text-muted-foreground">Risk Altında</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-400">{shi.misalignment_count}</p>
                <p className="text-[10px] text-muted-foreground">Hizalama Sorunu</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Hız: {shi.velocity_trend === "improving" ? "↑ İyileşiyor" : shi.velocity_trend === "declining" ? "↓ Düşüyor" : "→ Stabil"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{shi.explanation}</p>
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" /> Risk Altındaki Hedefler
          </CardTitle>
        </CardHeader>
        <CardContent>
          {atRiskObjectives.length === 0 ? (
            <p className="text-xs text-muted-foreground">Risk altında hedef yok ✓</p>
          ) : (
            <div className="space-y-2">
              {atRiskObjectives.slice(0, 5).map(obj => (
                <div key={obj.id} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <p className="text-xs flex-1 truncate">{obj.title}</p>
                  <HealthBadge score={obj.health_score} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ── Corrective Drafts Panel (Workforce) ─────────────────
const CorrectiveDraftsPanel = () => {
  const { correctiveDrafts, objectives, updateCorrectionDraftStatus } = useOKR();
  const activeDrafts = correctiveDrafts.filter(d => d.status === "draft");

  if (activeDrafts.length === 0) return null;

  return (
    <Card className="bg-card/60 backdrop-blur border-amber-500/20 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" /> AI Düzeltici Karar Taslakları
          <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">{activeDrafts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeDrafts.map(draft => {
            const obj = objectives.find(o => o.id === draft.linked_objective_id);
            return (
              <div key={draft.id} className="p-3 rounded-lg bg-muted/20 border border-border/30">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-medium">{obj?.title || "Bilinmeyen Hedef"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{draft.recommended_action}</p>
                  </div>
                  <RiskBadge score={draft.risk_score} />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground line-clamp-2 cursor-help">
                      <Info className="w-3 h-3 inline mr-1" />{draft.rationale}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-sm text-xs">
                    {draft.rationale}
                  </TooltipContent>
                </Tooltip>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="text-xs h-7" onClick={() => {
                    updateCorrectionDraftStatus(draft.id, "submitted");
                    toast.success("Taslak onay sürecine gönderildi.");
                  }}>
                    <Send className="w-3 h-3 mr-1" /> Onaya Gönder
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => {
                    updateCorrectionDraftStatus(draft.id, "rejected");
                    toast.info("Taslak reddedildi.");
                  }}>
                    Reddet
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// ── Alignment Panel (Workforce) ─────────────────────────
const AlignmentPanel = () => {
  const { departmentAlignments } = useOKR();
  if (departmentAlignments.length === 0) return null;

  const deptLabels: Record<string, string> = {
    executive: "Yönetim", finance: "Finans", technology: "Teknoloji",
    marketing: "Pazarlama", operations: "Operasyon", hr: "İK",
    sales: "Satış", creative: "Kreatif", marketplace: "Pazaryeri",
  };

  return (
    <Card className="bg-card/60 backdrop-blur border-border/40 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" /> Departman Hizalama Analizi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {departmentAlignments.map(da => (
            <div key={da.department_key} className="flex items-center gap-3">
              <p className="text-xs w-20 truncate">{deptLabels[da.department_key] || da.department_key}</p>
              <Progress value={da.alignment_score} className="h-2 flex-1" />
              <span className="text-xs font-medium w-8 text-right">{da.alignment_score}</span>
              <Badge variant="outline" className={`text-[10px] ${
                da.resource_strain === "high" ? "text-red-400 border-red-400/30" :
                da.resource_strain === "medium" ? "text-amber-400 border-amber-400/30" :
                "text-emerald-400 border-emerald-400/30"
              }`}>
                {da.resource_strain === "high" ? "Yoğun" : da.resource_strain === "medium" ? "Orta" : "Normal"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ── Main OKR Page ───────────────────────────────────────
const OKRPage = () => {
  const {
    isOKREnabled, planLevel, isHierarchyEnabled, isAICorrectionEnabled, isAlignmentEnabled,
    cycles, activeCycleId, setActiveCycleId, activeCycles,
    objectivesForCycle, keyResultsForObjective,
    strategicObjectives, childObjectives,
    recalculateHealth, generateCorrectionDraft,
  } = useOKR();
  const isMobile = useIsMobile();

  if (!isOKREnabled) return <PlanGate />;

  const currentCycleId = activeCycleId || activeCycles[0]?.id || "";
  const cycleObjectives = objectivesForCycle(currentCycleId);

  // For workforce: show all objectives across active cycles
  const allActiveObjectives = activeCycles.flatMap(c => objectivesForCycle(c.id));
  const displayStrategic = strategicObjectives;
  const isWorkforce = planLevel === "workforce";

  return (
    <AppLayout>
      <div className={`${isMobile ? "p-4 max-w-lg" : "p-6 max-w-6xl"} mx-auto`}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                OKR Stratejik Motoru
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isWorkforce ? "AI-driven strategic correction engine" : "Hedef takibi ve ilerleme analizi"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {planLevel === "workforce" ? "Full Engine" : "OKR Lite"}
              </Badge>
              <Select value={currentCycleId} onValueChange={setActiveCycleId}>
                <SelectTrigger className="w-44 h-8 text-xs">
                  <SelectValue placeholder="Dönem Seç" />
                </SelectTrigger>
                <SelectContent>
                  {(isWorkforce ? cycles.filter(c => c.status !== "closed") : activeCycles).map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Workforce: Strategic Health + Corrective Drafts + Alignment */}
        {isWorkforce && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <StrategicHealthPanel />
            <CorrectiveDraftsPanel />
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs defaultValue={isWorkforce ? "strategic" : "objectives"} className="mb-6">
          <TabsList className="mb-4">
            {isWorkforce && <TabsTrigger value="strategic" className="text-xs">Stratejik Hedefler</TabsTrigger>}
            <TabsTrigger value="objectives" className="text-xs">
              {isWorkforce ? "Taktik Hedefler" : "Hedefler"}
            </TabsTrigger>
            {isWorkforce && <TabsTrigger value="alignment" className="text-xs">Hizalama</TabsTrigger>}
          </TabsList>

          {/* Strategic Tab (Workforce) */}
          {isWorkforce && (
            <TabsContent value="strategic">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayStrategic.map(obj => {
                  const krs = keyResultsForObjective(obj.id);
                  const children = childObjectives(obj.id);
                  return (
                    <div key={obj.id}>
                      <ObjectiveCard
                        objective={obj} keyResults={krs} children={children}
                        isWorkforce={isWorkforce}
                        onRecalculate={() => {
                          recalculateHealth(obj.id);
                          toast.success("Sağlık skoru yeniden hesaplandı.");
                        }}
                        onCorrection={() => {
                          const draft = generateCorrectionDraft(obj.id);
                          if (draft) toast.success("Düzeltici karar taslağı oluşturuldu.");
                          else toast.info("Bu hedef için düzeltici karar gerekmemektedir.");
                        }}
                      />
                      {/* Inline children */}
                      {children.length > 0 && (
                        <div className="ml-4 mt-2 space-y-2 border-l-2 border-primary/20 pl-3">
                          {children.map(child => (
                            <ObjectiveCard
                              key={child.id}
                              objective={child}
                              keyResults={keyResultsForObjective(child.id)}
                              isWorkforce={isWorkforce}
                              onRecalculate={() => {
                                recalculateHealth(child.id);
                                toast.success("Sağlık skoru yeniden hesaplandı.");
                              }}
                              onCorrection={() => {
                                const draft = generateCorrectionDraft(child.id);
                                if (draft) toast.success("Düzeltici karar taslağı oluşturuldu.");
                                else toast.info("Bu hedef için düzeltici karar gerekmemektedir.");
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          )}

          {/* Objectives Tab */}
          <TabsContent value="objectives">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(isWorkforce
                ? cycleObjectives.filter(o => o.level === "tactical")
                : cycleObjectives
              ).map(obj => (
                <ObjectiveCard
                  key={obj.id}
                  objective={obj}
                  keyResults={keyResultsForObjective(obj.id)}
                  isWorkforce={isWorkforce}
                  onRecalculate={() => {
                    recalculateHealth(obj.id);
                    toast.success("Sağlık skoru yeniden hesaplandı.");
                  }}
                  onCorrection={() => {
                    const draft = generateCorrectionDraft(obj.id);
                    if (draft) toast.success("Düzeltici karar taslağı oluşturuldu.");
                    else toast.info("Bu hedef için düzeltici karar gerekmemektedir.");
                  }}
                />
              ))}
            </div>
          </TabsContent>

          {/* Alignment Tab (Workforce) */}
          {isWorkforce && (
            <TabsContent value="alignment">
              <AlignmentPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default OKRPage;
