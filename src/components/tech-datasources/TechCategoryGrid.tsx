import { 
  GitBranch, ListTodo, Rocket, Cloud, Container, Activity, FileText, Bug, Shield, 
  Key, ShieldCheck, Siren, Globe, DollarSign, Database, Workflow, BookOpen, 
  Headphones, MessageSquare 
} from "lucide-react";
import { TechConnectorCategory, TechConnectorCategoryDef, TechConnector } from "@/data/techIntegrations";

const iconMap: Record<string, React.ElementType> = {
  GitBranch, ListTodo, Rocket, Cloud, Container, Activity, FileText, Bug, Shield,
  Key, ShieldCheck, Siren, Globe, DollarSign, Database, Workflow, BookOpen,
  Headphones, MessageSquare,
};

interface TechCategoryGridProps {
  categories: TechConnectorCategoryDef[];
  connectors: TechConnector[];
  selected: TechConnectorCategory | null;
  onSelect: (cat: TechConnectorCategory) => void;
}

const TechCategoryGrid = ({ categories, connectors, selected, onSelect }: TechCategoryGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {categories.map(cat => {
        const Icon = iconMap[cat.icon_name] || Database;
        const items = connectors.filter(c => c.category === cat.id);
        const connected = items.filter(c => c.status === "connected").length;
        const hasError = items.some(c => c.status === "error");
        const isActive = selected === cat.id;
        const ownerColor = cat.owner === "cto" ? "text-primary" : cat.owner === "cio" ? "text-purple-400" : "text-muted-foreground";

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`relative p-3 rounded-2xl text-left transition-all duration-200 border ${
              isActive
                ? "bg-primary/10 border-primary/30"
                : "bg-white/[0.03] border-border/40 hover:bg-white/[0.06] hover:border-border/60"
            }`}
            style={isActive ? { boxShadow: "0 0 20px rgba(30,107,255,0.1)" } : {}}
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                isActive ? "bg-primary/20" : "bg-white/[0.06]"
              }`}>
                <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              {hasError && (
                <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
            </div>
            <p className="text-[11px] font-medium text-foreground leading-tight mb-0.5 line-clamp-2">{cat.name_tr}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[9px] text-muted-foreground">{connected}/{items.length}</span>
              <span className={`text-[8px] font-semibold px-1 py-0.5 rounded ${ownerColor} bg-white/[0.04]`}>
                {cat.owner.toUpperCase()}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TechCategoryGrid;
