import { Search } from "lucide-react";
import type { DepartmentFilter, LevelFilter, SortKey } from "@/pages/PositionHistory";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  departmentFilter: DepartmentFilter;
  setDepartmentFilter: (v: DepartmentFilter) => void;
  levelFilter: LevelFilter;
  setLevelFilter: (v: LevelFilter) => void;
  sortKey: SortKey;
  setSortKey: (v: SortKey) => void;
  search: string;
  setSearch: (v: string) => void;
  toggles: { highChurn: boolean; vacant: boolean; weakHandover: boolean };
  setToggles: (v: { highChurn: boolean; vacant: boolean; weakHandover: boolean }) => void;
}

const departments: { value: DepartmentFilter; label: Record<string, string> }[] = [
  { value: "all", label: { tr: "Tümü", en: "All" } },
  { value: "Executive", label: { tr: "Yönetim", en: "Executive" } },
  { value: "Finance", label: { tr: "Finans", en: "Finance" } },
  { value: "Technology", label: { tr: "Teknoloji", en: "Technology" } },
  { value: "Marketing", label: { tr: "Pazarlama", en: "Marketing" } },
  { value: "Operations", label: { tr: "Operasyon", en: "Operations" } },
  { value: "Legal", label: { tr: "Hukuk", en: "Legal" } },
];

const levels: { value: LevelFilter; label: Record<string, string> }[] = [
  { value: "all", label: { tr: "Tümü", en: "All" } },
  { value: "C_LEVEL", label: { tr: "C-Level", en: "C-Level" } },
  { value: "DIRECTOR", label: { tr: "Direktör", en: "Director" } },
  { value: "MANAGER", label: { tr: "Müdür", en: "Manager" } },
  { value: "IC", label: { tr: "IC", en: "IC" } },
];

const sorts: { value: SortKey; label: Record<string, string> }[] = [
  { value: "recent", label: { tr: "En Son Geçiş", en: "Most Recent" } },
  { value: "stability", label: { tr: "Düşük Stabilite", en: "Lowest Stability" } },
  { value: "vacancy", label: { tr: "Boşluk Günleri", en: "Vacancy Days" } },
];

const PositionFilterBar = ({
  departmentFilter, setDepartmentFilter,
  levelFilter, setLevelFilter,
  sortKey, setSortKey,
  search, setSearch,
  toggles, setToggles,
}: Props) => {
  const { lang } = useLanguage();

  const selectClass = "px-2.5 py-2 rounded-xl bg-secondary/40 border border-border/40 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all";
  const toggleClass = (active: boolean) =>
    `px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
      active
        ? "bg-primary/15 border-primary/30 text-primary"
        : "bg-secondary/30 border-border/40 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
    }`;

  return (
    <div className="glass-card p-3 md:p-4">
      <div className="flex flex-wrap items-center gap-2 [&_select]:max-w-[160px]">
        {/* Search */}
        <div className="relative min-w-[160px] flex-1 max-w-[260px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === "tr" ? "Pozisyon ara…" : "Search positions…"}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-secondary/40 border border-border/40 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </div>

        {/* Department */}
        <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value as DepartmentFilter)} className={selectClass}>
          {departments.map(d => (
            <option key={d.value} value={d.value}>{d.label[lang]}</option>
          ))}
        </select>

        {/* Level */}
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value as LevelFilter)} className={selectClass}>
          {levels.map(l => (
            <option key={l.value} value={l.value}>{l.label[lang]}</option>
          ))}
        </select>

        {/* Sort */}
        <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)} className={selectClass}>
          {sorts.map(s => (
            <option key={s.value} value={s.value}>{s.label[lang]}</option>
          ))}
        </select>

        {/* Quick toggles */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setToggles({ ...toggles, highChurn: !toggles.highChurn })}
            className={toggleClass(toggles.highChurn)}
          >
            {lang === "tr" ? "Yüksek Değişim" : "High Churn"}
          </button>
          <button
            onClick={() => setToggles({ ...toggles, vacant: !toggles.vacant })}
            className={toggleClass(toggles.vacant)}
          >
            {lang === "tr" ? "Boş" : "Vacant"}
          </button>
          <button
            onClick={() => setToggles({ ...toggles, weakHandover: !toggles.weakHandover })}
            className={toggleClass(toggles.weakHandover)}
          >
            {lang === "tr" ? "Zayıf Devir" : "Weak Handover"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionFilterBar;
