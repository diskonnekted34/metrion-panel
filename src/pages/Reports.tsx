import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3, Search, Filter, Download, Bell, Shield, ArrowUpDown,
  ChevronUp, ChevronDown, FileText, Clock, Lock, Eye, Calendar
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import ReportPreviewPanel from "@/components/reports/ReportPreviewPanel";
import NotificationSettingsModal from "@/components/reports/NotificationSettingsModal";
import { toast } from "sonner";
import {
  companyReportsList, departmentReportsList,
  type ReportRow, type ReportType, type ReportStatus, type SortMode, type TimeFilter
} from "@/data/reportsHubData";
import { Input } from "@/components/ui/input";

type TabId = "company" | "department" | "personal";
type SortKey = "generatedAt" | "healthScore" | "risk";
type SortDir = "asc" | "desc";

const riskWeight = { low: 1, medium: 2, high: 3, critical: 4 };

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

  const baseData = tab === "company" ? companyReportsList : departmentReportsList;

  const filtered = useMemo(() => {
    let data = [...baseData];
    if (typeFilter !== "all") data = data.filter(r => r.type === typeFilter);
    if (statusFilter !== "all") data = data.filter(r => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.department?.toLowerCase().includes(q))
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

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      sent: "text-success bg-success/8 border-success/15",
      generated: "text-primary bg-primary/8 border-primary/15",
      archived: "text-muted-foreground bg-white/[0.03] border-white/[0.06]",
    }[status] ?? "";
    const labels: Record<string, string> = { sent: "Gönderildi", generated: "Hazırlandı", archived: "Arşiv" };
    return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styles}`}>{labels[status] ?? status}</span>;
  };

  const tabs: { id: TabId; label: string; disabled?: boolean }[] = [
    { id: "company", label: "Şirket Raporları" },
    { id: "department", label: "Departman Raporları" },
    { id: "personal", label: "Kişisel Raporlar", disabled: true },
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-[1440px] mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Raporlar</h1>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Lock className="h-3 w-3" />
              Şirket ve departman rapor arşivi. Raporlar değiştirilemez (immutable).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setNotifOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-white/[0.08] hover:border-white/[0.16] bg-white/[0.02] text-foreground transition-all">
              <Bell className="h-3.5 w-3.5" /> Bildirim Ayarları
            </button>
            <button onClick={() => toast.info("Export Policy — yakında aktif")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-white/[0.08] hover:border-white/[0.16] bg-white/[0.02] text-muted-foreground transition-all">
              <FileText className="h-3.5 w-3.5" /> Export Policy
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-white/[0.02] rounded-2xl p-1 border border-white/[0.04]">
          {tabs.map(t => (
            <button key={t.id} onClick={() => !t.disabled && setTab(t.id)}
              disabled={t.disabled}
              className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                t.disabled ? "text-muted-foreground/40 cursor-not-allowed" :
                tab === t.id ? "bg-primary/10 text-primary border border-primary/20" :
                "text-muted-foreground hover:text-foreground"
              }`}>
              {t.label}
              {t.disabled && <span className="ml-1.5 text-[9px] opacity-50">Coming soon</span>}
            </button>
          ))}
        </div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="flex flex-wrap items-center gap-2 mb-4">
          {/* Type */}
          <div className="flex gap-1">
            {(["all", "weekly", "monthly", "yearly"] as const).map(t => {
              const labels: Record<string, string> = { all: "Tümü", weekly: "Haftalık", monthly: "Aylık", yearly: "Yıllık" };
              return (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                    typeFilter === t
                      ? "bg-primary/12 text-primary border-primary/25"
                      : "bg-white/[0.02] text-muted-foreground border-white/[0.06] hover:border-white/[0.12]"
                  }`}>
                  {labels[t]}
                </button>
              );
            })}
          </div>
          {/* Status */}
          <div className="h-5 w-px bg-white/[0.06]" />
          <div className="flex gap-1">
            {(["all", "sent", "generated", "archived"] as const).map(s => {
              const labels: Record<string, string> = { all: "Tümü", sent: "Gönderildi", generated: "Hazırlandı", archived: "Arşiv" };
              return (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                    statusFilter === s
                      ? "bg-primary/12 text-primary border-primary/25"
                      : "bg-white/[0.02] text-muted-foreground border-white/[0.06] hover:border-white/[0.12]"
                  }`}>
                  {labels[s]}
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

        {/* Main layout: Table + Preview */}
        <div className="flex gap-4">
          {/* Table */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl border border-white/[0.06] overflow-hidden"
              style={{ background: "rgba(255,255,255,0.015)", backdropFilter: "blur(16px)" }}>
              {/* Table header */}
              <div className={`grid ${tab === "department" ? "grid-cols-[1fr_100px_80px_80px_80px_90px_80px_90px_80px]" : "grid-cols-[1fr_100px_80px_80px_100px_80px_80px_80px]"} gap-0 px-4 py-3 border-b border-white/[0.06] text-[11px] font-semibold text-muted-foreground uppercase tracking-wider`}>
                <span>Dönem</span>
                <span>Tür</span>
                {tab === "department" && <span>Departman</span>}
                <button onClick={() => toggleSort("healthScore")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Sağlık <SortIcon col="healthScore" />
                </button>
                <button onClick={() => toggleSort("risk")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Risk <SortIcon col="risk" />
                </button>
                <span>KPI Delta</span>
                <span>Alıcı</span>
                <span>Durum</span>
                <span>Aksiyon</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/[0.03]">
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
                    className={`grid ${tab === "department" ? "grid-cols-[1fr_100px_80px_80px_80px_90px_80px_90px_80px]" : "grid-cols-[1fr_100px_80px_80px_100px_80px_80px_80px]"} gap-0 px-4 py-3 cursor-pointer transition-all hover:bg-white/[0.03] ${
                      selected?.id === row.id ? "bg-primary/[0.04] border-l-2 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-xs font-medium text-foreground truncate">{row.periodStart} – {row.periodEnd}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{row.title}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-muted-foreground">
                        {{ weekly: "Haftalık", monthly: "Aylık", yearly: "Yıllık" }[row.type]}
                      </span>
                    </div>
                    {tab === "department" && (
                      <div className="flex items-center">
                        <span className="text-[11px] text-foreground truncate">{row.department}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-foreground">{row.healthScore}</span>
                    </div>
                    <div className="flex items-center">
                      <RiskBadge risk={row.risk} />
                    </div>
                    <div className="flex items-center">
                      <span className={`text-xs font-semibold ${row.kpiDelta.startsWith("+") ? "text-success" : "text-destructive"}`}>
                        {row.kpiDelta}
                      </span>
                      <span className="text-[9px] text-muted-foreground ml-1">{row.kpiLabel}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground">{row.recipientsCount}</span>
                    </div>
                    <div className="flex items-center">
                      <StatusBadge status={row.status} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Link to={`/reports/${row.id}`} onClick={e => e.stopPropagation()}
                        className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors" title="Görüntüle">
                        <Eye className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </Link>
                      <button onClick={e => { e.stopPropagation(); toast.info("PDF indiriliyor..."); }}
                        className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors" title="İndir">
                        <Download className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{filtered.length} rapor gösteriliyor</span>
                <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Tüm raporlar immutable</span>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="hidden lg:block w-[360px] shrink-0 rounded-2xl border border-white/[0.06] overflow-hidden"
            style={{ background: "rgba(255,255,255,0.015)", backdropFilter: "blur(16px)" }}>
            <ReportPreviewPanel report={selected} />
          </div>
        </div>
      </div>

      <NotificationSettingsModal open={notifOpen} onClose={() => setNotifOpen(false)} />
    </AppLayout>
  );
};

export default Reports;
