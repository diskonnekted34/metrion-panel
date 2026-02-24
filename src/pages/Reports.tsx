import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Download, Bell, ArrowUpDown,
  ChevronUp, ChevronDown, FileText, Lock, Eye, Settings2,
  Building2, User, Globe, Shield
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import ReportPreviewPanel from "@/components/reports/ReportPreviewPanel";
import NotificationSettingsModal from "@/components/reports/NotificationSettingsModal";
import { toast } from "sonner";
import {
  companyReportsList, departmentReportsList, positionReportsList,
  type ReportRow, type ReportType, type ReportStatus, type ReportScope, type PackageTier
} from "@/data/reportsHubData";
import { Input } from "@/components/ui/input";

type TabId = "company" | "department" | "position";
type SortKey = "generatedAt" | "healthScore" | "risk";
type SortDir = "asc" | "desc";

const riskWeight = { low: 1, medium: 2, high: 3, critical: 4 };

const typeLabels: Record<ReportType, string> = {
  daily: "Günlük",
  weekly: "Haftalık",
  monthly: "Aylık",
  quarterly: "Çeyreklik",
  yearly: "Yıllık",
};

const statusLabels: Record<ReportStatus, string> = {
  immutable: "Immutable",
  draft: "Taslak",
  scheduled: "Planlandı",
};

const tierColors: Record<PackageTier, string> = {
  core: "text-muted-foreground bg-muted/50 border-border/30",
  growth: "text-primary bg-primary/8 border-primary/20",
  enterprise: "text-warning bg-warning/8 border-warning/20",
};

const Reports = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("company");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ReportType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("generatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<ReportRow | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [automationEnabled, setAutomationEnabled] = useState(true);

  const baseData = tab === "company" ? companyReportsList : tab === "department" ? departmentReportsList : positionReportsList;

  const filtered = useMemo(() => {
    let data = [...baseData];
    if (typeFilter !== "all") data = data.filter(r => r.type === typeFilter);
    if (statusFilter !== "all") data = data.filter(r => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.department?.toLowerCase().includes(q)) ||
        (r.positionTitle?.toLowerCase().includes(q))
      );
    }
    data.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "generatedAt") cmp = a.id.localeCompare(b.id);
      else if (sortKey === "healthScore") cmp = a.healthScore - b.healthScore;
      else if (sortKey === "risk") cmp = riskWeight[a.risk] - riskWeight[b.risk];
      return sortDir === "desc" ? -cmp : cmp;
    });
    return data;
  }, [baseData, typeFilter, statusFilter, search, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 text-muted-foreground/40" />;
    return sortDir === "desc" ? <ChevronDown className="h-3 w-3 text-primary" /> : <ChevronUp className="h-3 w-3 text-primary" />;
  };

  const RiskBadge = ({ risk }: { risk: string }) => {
    const styles = {
      low: "text-success bg-success/10 border-success/20",
      medium: "text-warning bg-warning/10 border-warning/20",
      high: "text-destructive bg-destructive/10 border-destructive/20",
      critical: "text-destructive bg-destructive/15 border-destructive/30",
    }[risk] ?? "";
    return <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${styles}`}>{risk}</span>;
  };

  const StatusBadge = ({ status }: { status: ReportStatus }) => {
    const styles = {
      immutable: "text-primary bg-primary/8 border-primary/15",
      draft: "text-warning bg-warning/8 border-warning/15",
      scheduled: "text-muted-foreground bg-muted/50 border-border/30",
    }[status];
    return (
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${styles}`}>
        {status === "immutable" && <Lock className="h-2.5 w-2.5" />}
        {statusLabels[status]}
      </span>
    );
  };

  const TierBadge = ({ tier }: { tier: PackageTier }) => (
    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${tierColors[tier]}`}>
      {tier}
    </span>
  );

  const tabs: { id: TabId; label: string; icon: React.ReactNode; count: number }[] = [
    { id: "company", label: "Şirket", icon: <Globe className="h-3.5 w-3.5" />, count: companyReportsList.length },
    { id: "department", label: "Departman", icon: <Building2 className="h-3.5 w-3.5" />, count: departmentReportsList.length },
    { id: "position", label: "Pozisyon", icon: <User className="h-3.5 w-3.5" />, count: positionReportsList.length },
  ];

  const availableTypes = [...new Set(baseData.map(r => r.type))];

  return (
    <AppLayout>
      <div className="p-6 max-w-[1440px] mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Raporlar</h1>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Shield className="h-3 w-3" />
              Kurumsal istihbarat rapor arşivi · {allReportsCount} rapor · Immutable
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Automation Toggle */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/30 bg-secondary/30">
              <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">Otomasyon</span>
              <button
                onClick={() => { setAutomationEnabled(!automationEnabled); toast.success(automationEnabled ? "Otomasyon devre dışı" : "Otomasyon aktif"); }}
                className={`relative h-5 w-9 rounded-full transition-colors ${automationEnabled ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${automationEnabled ? "left-[18px]" : "left-0.5"}`} />
              </button>
            </div>
            <button onClick={() => setNotifOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-border/30 hover:border-border/60 bg-secondary/30 text-foreground transition-all">
              <Bell className="h-3.5 w-3.5" /> Bildirimler
            </button>
            <button onClick={() => toast.info("Export Policy — yakında aktif")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-border/30 hover:border-border/60 bg-secondary/30 text-muted-foreground transition-all">
              <FileText className="h-3.5 w-3.5" /> Export
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-secondary/30 rounded-2xl p-1 border border-border/20">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelected(null); }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                tab === t.id ? "bg-primary/10 text-primary border border-primary/20" :
                "text-muted-foreground hover:text-foreground"
              }`}>
              {t.icon}
              {t.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-primary/15 text-primary" : "bg-muted/50 text-muted-foreground"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="flex flex-wrap items-center gap-2 mb-4">
          {/* Type */}
          <div className="flex gap-1">
            <button onClick={() => setTypeFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                typeFilter === "all" ? "bg-primary/12 text-primary border-primary/25" : "bg-secondary/30 text-muted-foreground border-border/20 hover:border-border/40"
              }`}>Tümü</button>
            {availableTypes.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                  typeFilter === t ? "bg-primary/12 text-primary border-primary/25" : "bg-secondary/30 text-muted-foreground border-border/20 hover:border-border/40"
                }`}>
                {typeLabels[t]}
              </button>
            ))}
          </div>
          {/* Confidentiality */}
          <div className="h-5 w-px bg-border/20" />
          <div className="flex gap-1">
            {(["all", "immutable", "draft", "scheduled"] as const).map(s => {
              if (s !== "all" && !baseData.some(r => r.status === s)) return null;
              return (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                    statusFilter === s ? "bg-primary/12 text-primary border-primary/25" : "bg-secondary/30 text-muted-foreground border-border/20 hover:border-border/40"
                  }`}>
                  {s === "all" ? "Tümü" : statusLabels[s as ReportStatus]}
                </button>
              );
            })}
          </div>
          {/* Search */}
          <div className="flex-1 min-w-[200px] max-w-[320px] ml-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rapor ID, başlık, departman ara…"
              className="pl-9 h-9 text-xs"
            />
          </div>
        </motion.div>

        {/* Main layout */}
        <div className="flex gap-4">
          {/* Table */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl border border-border/20 overflow-hidden bg-card/50 backdrop-blur-xl">
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_70px_60px_90px_60px_80px_70px_70px] gap-0 px-4 py-3 border-b border-border/20 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Rapor</span>
                <span>Tür</span>
                <span>Paket</span>
                <button onClick={() => toggleSort("healthScore")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Sağlık <SortIcon col="healthScore" />
                </button>
                <button onClick={() => toggleSort("risk")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Risk <SortIcon col="risk" />
                </button>
                <span>Güven</span>
                <span>Durum</span>
                <span>Versiyon</span>
                <span>Aksiyon</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/10">
                {filtered.length === 0 && (
                  <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Bu filtrelere uygun rapor bulunamadı.
                  </div>
                )}
                {filtered.map(row => (
                  <div
                    key={row.id}
                    onClick={() => setSelected(row)}
                    onDoubleClick={() => navigate(`/reports/${row.id}`)}
                    className={`grid grid-cols-[1fr_80px_70px_60px_90px_60px_80px_70px_70px] gap-0 px-4 py-3 cursor-pointer transition-all hover:bg-secondary/30 ${
                      selected?.id === row.id ? "bg-primary/[0.04] border-l-2 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-xs font-medium text-foreground truncate">{row.title}</span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {row.periodStart} – {row.periodEnd}
                        {row.department && ` · ${row.department}`}
                        {row.positionTitle && ` · ${row.positionTitle}`}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/50 border border-border/20 text-muted-foreground">
                        {typeLabels[row.type]}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <TierBadge tier={row.packageTier} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-foreground">{row.healthScore}</span>
                    </div>
                    <div className="flex items-center">
                      <RiskBadge risk={row.risk} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-[11px] text-muted-foreground">%{row.confidence}</span>
                    </div>
                    <div className="flex items-center">
                      <StatusBadge status={row.status} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-[10px] font-mono text-muted-foreground">v{row.version}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Link to={`/reports/${row.id}`} onClick={e => e.stopPropagation()}
                        className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary/50 transition-colors" title="Görüntüle">
                        <Eye className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </Link>
                      <button onClick={e => { e.stopPropagation(); toast.info("PDF indiriliyor..."); }}
                        className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary/50 transition-colors" title="İndir">
                        <Download className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border/20 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{filtered.length} rapor gösteriliyor</span>
                <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Tüm raporlar immutable & versiyonlu</span>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="hidden lg:block w-[360px] shrink-0 rounded-2xl border border-border/20 overflow-hidden bg-card/50 backdrop-blur-xl">
            <ReportPreviewPanel report={selected} />
          </div>
        </div>
      </div>

      <NotificationSettingsModal open={notifOpen} onClose={() => setNotifOpen(false)} />
    </AppLayout>
  );
};

const allReportsCount = companyReportsList.length + departmentReportsList.length + positionReportsList.length;

export default Reports;
