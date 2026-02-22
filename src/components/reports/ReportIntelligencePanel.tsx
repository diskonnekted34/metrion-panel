import { useState } from "react";
import { ChevronDown, ChevronRight, Shield, TrendingUp, Scale, Users, Hash, Lock, Clock, FileText } from "lucide-react";
import type { ReportRow } from "@/data/reportsHubData";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection = ({ title, icon, defaultOpen = true, children }: CollapsibleSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/[0.04] last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2.5 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
        {icon}
        <span className="text-xs font-semibold text-foreground flex-1 text-left">{title}</span>
        {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
};

interface Props {
  report: ReportRow;
}

const mockKpiHighlights = [
  { label: "Gelir", value: "₺12.4M", delta: "+4.2%" },
  { label: "Net Kâr", value: "₺2.1M", delta: "-1.8%" },
  { label: "Katkı Marjı", value: "%34.2", delta: "+0.5pp" },
  { label: "Nakit", value: "₺8.7M", delta: "+2.1%" },
  { label: "CAC", value: "₺245", delta: "-3.1%" },
  { label: "LTV/CAC", value: "3.8x", delta: "+0.3x" },
];

const mockRisks = [
  { area: "Pazar Riski", level: "high" as const, detail: "Kanal konsantrasyon oranı %42'ye ulaştı" },
  { area: "Operasyonel Risk", level: "medium" as const, detail: "Tedarik süresi 3 gün arttı" },
  { area: "Finansal Risk", level: "low" as const, detail: "AR aging kontrol altında" },
];

const mockDecisions = [
  { title: "Pazarlama bütçesi yeniden dağılımı", kpi: "ROAS +0.8x", confidence: 87 },
  { title: "Depo genişleme kararı", kpi: "Verimlilik +12%", confidence: 82 },
  { title: "Fiyat optimizasyonu", kpi: "Marj +1.3pp", confidence: 91 },
];

const ReportIntelligencePanel = ({ report }: Props) => {
  const riskColor = {
    low: "text-success",
    medium: "text-warning",
    high: "text-destructive",
    critical: "text-destructive",
  }[report.risk];

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>
      {/* Executive Snapshot */}
      <CollapsibleSection title="Executive Snapshot" icon={<Shield className="h-3.5 w-3.5 text-primary" />}>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-2xl font-bold text-foreground">{report.healthScore}</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">Sağlık</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className={`text-sm font-bold ${riskColor} uppercase`}>{report.risk}</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">Risk</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-2xl font-bold text-foreground">14.2</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">Runway (ay)</div>
          </div>
        </div>
      </CollapsibleSection>

      {/* KPI Highlights */}
      <CollapsibleSection title="KPI Öne Çıkanlar" icon={<TrendingUp className="h-3.5 w-3.5 text-success" />}>
        <div className="space-y-2">
          {mockKpiHighlights.map(kpi => (
            <div key={kpi.label} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">{kpi.value}</span>
                <span className={`text-[10px] font-medium ${kpi.delta.startsWith("+") ? "text-success" : "text-destructive"}`}>
                  {kpi.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Risks */}
      <CollapsibleSection title="Riskler (Top 3)" icon={<Shield className="h-3.5 w-3.5 text-destructive" />}>
        <div className="space-y-2">
          {mockRisks.map(r => {
            const color = r.level === "high" ? "bg-destructive/10 border-destructive/20 text-destructive" : r.level === "medium" ? "bg-warning/10 border-warning/20 text-warning" : "bg-success/10 border-success/20 text-success";
            return (
              <div key={r.area} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-foreground">{r.area}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${color} uppercase`}>{r.level}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{r.detail}</p>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Decisions */}
      <CollapsibleSection title="Karar Etkileri (Top 3)" icon={<Scale className="h-3.5 w-3.5 text-primary" />}>
        <div className="space-y-2">
          {mockDecisions.map(d => (
            <div key={d.title} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[11px] font-medium text-foreground mb-1">{d.title}</p>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-success">{d.kpi}</span>
                <span className="text-muted-foreground">Güven: %{d.confidence}</span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Recipients */}
      <CollapsibleSection title="Alıcılar" icon={<Users className="h-3.5 w-3.5 text-muted-foreground" />} defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {report.recipients.map(r => (
            <span key={r} className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/[0.04] border border-white/[0.06] text-foreground">
              {r}
            </span>
          ))}
        </div>
      </CollapsibleSection>

      {/* Integrity */}
      <CollapsibleSection title="Bütünlük" icon={<Lock className="h-3.5 w-3.5 text-primary" />} defaultOpen={false}>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5"><Hash className="h-3 w-3" /> Hash</span>
            <span className="font-mono text-[10px] text-foreground">{report.hash}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5"><Lock className="h-3 w-3" /> Durum</span>
            <span className="text-primary font-medium text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">Immutable</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" /> Oluşturulma</span>
            <span className="text-foreground">{report.generatedAt}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5"><FileText className="h-3 w-3" /> Bölüm</span>
            <span className="text-foreground font-semibold">{report.sections}</span>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default ReportIntelligencePanel;
