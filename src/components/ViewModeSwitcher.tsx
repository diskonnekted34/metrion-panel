import { useState, useRef, useEffect } from "react";
import { ChevronDown, Building2, Eye } from "lucide-react";
import { useRBAC, DepartmentId } from "@/contexts/RBACContext";

const ViewModeSwitcher = () => {
  const { currentUser, viewMode, setViewMode, departments, hasAccessToDepartment } = useRBAC();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const canSwitchCompany = currentUser.role === "owner" || currentUser.role === "admin";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLabel = viewMode === "company"
    ? "Şirket Görünümü"
    : departments.find(d => d.id === viewMode)?.name || viewMode;

  const currentIcon = viewMode === "company"
    ? "🏢"
    : departments.find(d => d.id === viewMode)?.icon || "📁";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/60 hover:bg-secondary transition-colors text-sm"
      >
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-foreground font-medium">{currentIcon} {currentLabel}</span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 right-0 glass-strong rounded-2xl border border-border py-2 min-w-[200px] shadow-xl z-50">
          <p className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Görünüm Modu</p>

          {canSwitchCompany && (
            <button
              onClick={() => { setViewMode("company"); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${viewMode === "company" ? "text-primary bg-primary/10" : "text-foreground hover:bg-secondary"}`}
            >
              <Building2 className="h-4 w-4" />
              <span>Şirket Görünümü</span>
            </button>
          )}

          <div className="h-px bg-border mx-3 my-1" />

          {departments.map(dept => {
            const accessible = hasAccessToDepartment(dept.id);
            return (
              <button
                key={dept.id}
                disabled={!accessible}
                onClick={() => { setViewMode(dept.id as DepartmentId); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  !accessible
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : viewMode === dept.id
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <span>{dept.icon}</span>
                <span>{dept.name}</span>
                {!accessible && <span className="ml-auto text-[10px] text-muted-foreground">🔒</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewModeSwitcher;
