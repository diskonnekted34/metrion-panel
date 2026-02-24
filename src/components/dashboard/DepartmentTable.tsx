import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, ChevronDown, Search, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FilterType = "all" | "critical" | "watch" | "stable";

interface DepartmentRow {
  name: string;
  health: number;
  risk: "Low" | "Medium" | "High" | "Critical";
  openOKR: number;
  pendingActions: number;
  delta7d: number;
  owner: string;
  slug: string;
}

const departments: DepartmentRow[] = [
  { name: "Finans", health: 82, risk: "Medium", openOKR: 4, pendingActions: 2, delta7d: +3.2, owner: "CFO Agent", slug: "finans" },
  { name: "Pazarlama", health: 74, risk: "High", openOKR: 6, pendingActions: 4, delta7d: -1.8, owner: "CMO Agent", slug: "pazarlama" },
  { name: "Operasyon", health: 68, risk: "High", openOKR: 5, pendingActions: 5, delta7d: -2.5, owner: "COO Agent", slug: "operasyon" },
  { name: "Teknoloji", health: 85, risk: "Low", openOKR: 3, pendingActions: 1, delta7d: +4.1, owner: "CTO Agent", slug: "teknoloji" },
  { name: "İnsan Kaynakları", health: 79, risk: "Medium", openOKR: 4, pendingActions: 2, delta7d: +1.2, owner: "CHRO Agent", slug: "insan-kaynaklari" },
  { name: "Satış", health: 71, risk: "Medium", openOKR: 5, pendingActions: 3, delta7d: -0.5, owner: "CSO Agent", slug: "satis" },
];

const riskColors: Record<string, string> = {
  Low: "#16C784",
  Medium: "#F59E0B",
  High: "#EF4444",
  Critical: "#DC2626",
};

const filterMap: Record<FilterType, (d: DepartmentRow) => boolean> = {
  all: () => true,
  critical: d => d.risk === "Critical" || d.risk === "High",
  watch: d => d.risk === "Medium",
  stable: d => d.risk === "Low",
};

const DepartmentTable = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<"health" | "name">("health");
  const navigate = useNavigate();

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "Tümü" },
    { id: "critical", label: "Kritik" },
    { id: "watch", label: "İzlemede" },
    { id: "stable", label: "Stabil" },
  ];

  const filtered = departments
    .filter(filterMap[filter])
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortCol === "health" ? b.health - a.health : a.name.localeCompare(b.name));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary/60" />
          <h2 className="text-lg font-semibold text-foreground">Departman Durumu</h2>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-1">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`text-[0.6rem] font-semibold px-2.5 py-1 transition-all duration-150 ${
                filter === f.id ? "bg-primary/12 text-primary" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
              style={{ borderRadius: "var(--radius-pill, 999px)" }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-auto px-2.5 py-1 bg-secondary/50 border border-border/30" style={{ borderRadius: "var(--radius-inner, 12px)" }}>
          <Search className="h-3 w-3 text-muted-foreground/40" />
          <input
            type="text"
            placeholder="Ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-[0.65rem] text-foreground outline-none w-28 placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden glass-card" style={{ padding: 0 }}>
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[0.6rem] font-semibold text-muted-foreground/50 uppercase tracking-wider border-b border-border/30">
          <button className="col-span-2 text-left flex items-center gap-1" onClick={() => setSortCol("name")}>
            Departman {sortCol === "name" && <ChevronDown className="h-2.5 w-2.5" />}
          </button>
          <button className="col-span-2 text-left flex items-center gap-1" onClick={() => setSortCol("health")}>
            Sağlık {sortCol === "health" && <ChevronDown className="h-2.5 w-2.5" />}
          </button>
          <div className="col-span-2">Risk</div>
          <div className="col-span-1">OKR</div>
          <div className="col-span-2">Bekleyen</div>
          <div className="col-span-1">7g Δ</div>
          <div className="col-span-2">Sahip</div>
        </div>

        {filtered.map((d) => {
          const rc = riskColors[d.risk];
          const healthColor = d.health >= 80 ? "#16C784" : d.health >= 60 ? "#F59E0B" : "#EF4444";
          return (
            <button
              key={d.slug}
              onClick={() => navigate(`/departments/${d.slug}`)}
              className="w-full grid grid-cols-12 gap-2 px-4 py-3 text-left hover:bg-secondary/30 transition-colors items-center border-b border-border/20"
            >
              <div className="col-span-2 text-[0.72rem] font-medium text-foreground">{d.name}</div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden max-w-20">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${d.health}%`, background: healthColor, boxShadow: `0 0 6px ${healthColor}40` }}
                  />
                </div>
                <span className="text-[0.72rem] font-semibold" style={{ color: healthColor }}>{d.health}</span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: rc, boxShadow: `0 0 4px ${rc}40` }} />
                <span className="text-[0.68rem]" style={{ color: rc }}>{d.risk}</span>
              </div>
              <div className="col-span-1 text-[0.68rem] text-muted-foreground/60">{d.openOKR}</div>
              <div className="col-span-2 text-[0.68rem] text-muted-foreground/60">{d.pendingActions} aksiyon</div>
              <div className="col-span-1 flex items-center gap-0.5">
                {d.delta7d >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-[0.65rem] font-semibold ${d.delta7d >= 0 ? "text-success" : "text-destructive"}`}>
                  {d.delta7d > 0 ? "+" : ""}{d.delta7d}%
                </span>
              </div>
              <div className="col-span-2 text-[0.65rem] text-muted-foreground/50">{d.owner}</div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DepartmentTable;
