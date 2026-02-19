import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Scale, Zap, Database, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";

interface PaletteItem {
  id: string;
  label: string;
  category: string;
  route: string;
  icon: React.ElementType;
}

const CommandPalette = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const cp = t.commandPalette;
  const pm = t.pageMeta;
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items = useMemo<PaletteItem[]>(() => {
    const pages: PaletteItem[] = [
      { id: "dashboard", label: pm["/dashboard"]?.title || "Dashboard", category: cp.pages, route: "/dashboard", icon: FileText },
      { id: "decision-lab", label: pm["/decision-lab"]?.title || "Decisions", category: cp.pages, route: "/decision-lab", icon: Scale },
      { id: "action-center", label: pm["/action-center"]?.title || "Actions", category: cp.pages, route: "/action-center", icon: Zap },
      { id: "kadro", label: pm["/kadro"]?.title || "Workforce", category: cp.pages, route: "/kadro", icon: FileText },
      { id: "okr", label: pm["/okr"]?.title || "OKR", category: cp.pages, route: "/okr", icon: FileText },
      { id: "data-sources", label: pm["/data-sources"]?.title || "Data Sources", category: cp.pages, route: "/data-sources", icon: Database },
      { id: "tech-data-sources", label: pm["/tech-data-sources"]?.title || "Tech Data Sources", category: cp.pages, route: "/tech-data-sources", icon: Database },
      { id: "reports", label: pm["/reports"]?.title || "Reports", category: cp.pages, route: "/reports", icon: FileText },
      { id: "tasks", label: pm["/tasks"]?.title || "Tasks", category: cp.pages, route: "/tasks", icon: FileText },
      { id: "alerts", label: pm["/alerts"]?.title || "Alerts", category: cp.pages, route: "/alerts", icon: FileText },
      { id: "departments", label: pm["/departments"]?.title || "Departments", category: cp.pages, route: "/departments", icon: FileText },
      { id: "settings", label: pm["/settings"]?.title || "Settings", category: cp.pages, route: "/settings", icon: FileText },
      { id: "marketplace", label: pm["/marketplace"]?.title || "Marketplace", category: cp.pages, route: "/marketplace", icon: FileText },
    ];

    const decisions: PaletteItem[] = lang === "tr"
      ? [
          { id: "d1", label: "Yeni Pazar Genişleme Stratejisi", category: cp.decisions, route: "/decision-lab", icon: Scale },
          { id: "d2", label: "Fiyatlama Optimizasyonu Kararı", category: cp.decisions, route: "/decision-lab", icon: Scale },
          { id: "d3", label: "Teknoloji Altyapı Yatırımı", category: cp.decisions, route: "/decision-lab", icon: Scale },
        ]
      : [
          { id: "d1", label: "New Market Expansion Strategy", category: cp.decisions, route: "/decision-lab", icon: Scale },
          { id: "d2", label: "Pricing Optimization Decision", category: cp.decisions, route: "/decision-lab", icon: Scale },
          { id: "d3", label: "Technology Infrastructure Investment", category: cp.decisions, route: "/decision-lab", icon: Scale },
        ];

    const actions: PaletteItem[] = lang === "tr"
      ? [
          { id: "a1", label: "Q1 Kampanya Bütçesi Onayı", category: cp.actions, route: "/action-center", icon: Zap },
          { id: "a2", label: "Tedarikçi Sözleşme Yenileme", category: cp.actions, route: "/action-center", icon: Zap },
        ]
      : [
          { id: "a1", label: "Q1 Campaign Budget Approval", category: cp.actions, route: "/action-center", icon: Zap },
          { id: "a2", label: "Supplier Contract Renewal", category: cp.actions, route: "/action-center", icon: Zap },
        ];

    const dataSources: PaletteItem[] = [
      { id: "ds-shopify", label: "Shopify", category: cp.dataSources, route: "/data-sources/shopify", icon: Database },
      { id: "ds-meta", label: "Meta Ads", category: cp.dataSources, route: "/data-sources/meta-ads", icon: Database },
      { id: "ds-google-ads", label: "Google Ads", category: cp.dataSources, route: "/data-sources/google-ads", icon: Database },
      { id: "ds-slack", label: "Slack", category: cp.dataSources, route: "/data-sources/slack", icon: Database },
      { id: "ds-github", label: "GitHub", category: cp.dataSources, route: "/tech-data-sources/github", icon: Database },
      { id: "ds-jira", label: "Jira", category: cp.dataSources, route: "/tech-data-sources/jira", icon: Database },
      { id: "ds-aws", label: "AWS", category: cp.dataSources, route: "/tech-data-sources/aws", icon: Database },
      { id: "ds-datadog", label: "Datadog", category: cp.dataSources, route: "/tech-data-sources/datadog", icon: Database },
    ];

    return [...pages, ...decisions, ...actions, ...dataSources];
  }, [lang, cp, pm]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(i => i.label.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
  }, [query, items]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, PaletteItem[]>();
    filtered.forEach(i => {
      if (!map.has(i.category)) map.set(i.category, []);
      map.get(i.category)!.push(i);
    });
    return map;
  }, [filtered]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        navigate(filtered[selectedIndex].route);
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, selectedIndex, navigate, onClose]);

  // Global ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose(); else onClose(); // toggle handled by parent
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="relative z-10 w-full max-w-lg bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.topBar.search}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-secondary text-[10px] text-muted-foreground border border-border font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">{cp.noResults}</p>
            </div>
          ) : (
            Array.from(grouped.entries()).map(([category, categoryItems]) => (
              <div key={category}>
                <p className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{category}</p>
                {categoryItems.map(item => {
                  const idx = flatIndex++;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { navigate(item.route); onClose(); }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        selectedIndex === idx ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CommandPalette;
