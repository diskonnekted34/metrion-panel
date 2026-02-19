import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

interface PageMeta {
  title: string;
  subtitle?: string;
}

interface PageMetaContextType {
  meta: PageMeta;
  setPageMeta: (meta: PageMeta) => void;
}

const PageMetaContext = createContext<PageMetaContextType | null>(null);

export const usePageMeta = () => {
  const ctx = useContext(PageMetaContext);
  if (!ctx) throw new Error("usePageMeta must be used within PageMetaProvider");
  return ctx;
};

/** Hook for pages to override their title/subtitle */
export const useSetPageMeta = (title: string, subtitle?: string) => {
  const { setPageMeta } = usePageMeta();
  useEffect(() => {
    setPageMeta({ title, subtitle });
  }, [title, subtitle, setPageMeta]);
};

function getMetaFromPath(pathname: string, pageMeta: Record<string, { title: string; subtitle: string }>): PageMeta {
  // Exact match from i18n
  if (pageMeta[pathname]) return pageMeta[pathname];

  // Pattern matches
  if (pathname.startsWith("/departments/") && pathname.includes("/intelligence/"))
    return { title: pageMeta["/departments"]?.title || "Departments", subtitle: "" };
  if (pathname.startsWith("/departments/") && pathname.endsWith("/reports"))
    return { title: pageMeta["/reports"]?.title || "Reports" };
  if (pathname.startsWith("/departments/") && pathname.endsWith("/actions"))
    return { title: pageMeta["/action-center"]?.title || "Actions" };
  if (pathname.startsWith("/departments/") && pathname.endsWith("/modules"))
    return { title: pageMeta["/departments"]?.title || "Departments" };
  if (pathname.startsWith("/departments/"))
    return { title: pageMeta["/departments"]?.title || "Departments" };
  if (pathname.startsWith("/alerts/"))
    return { title: pageMeta["/alerts"]?.title || "Alerts" };
  if (pathname.startsWith("/reports/"))
    return { title: pageMeta["/reports"]?.title || "Reports" };
  if (pathname.startsWith("/intelligence/"))
    return { title: pageMeta["/dashboard"]?.title || "Command" };
  if (pathname.startsWith("/expert/"))
    return { title: pageMeta["/team"]?.title || "Team" };
  if (pathname.startsWith("/workspace/"))
    return { title: pageMeta["/kadro"]?.title || "Workforce" };
  if (pathname.startsWith("/tech-data-sources/"))
    return { title: pageMeta["/tech-data-sources"]?.title || "Tech Data Sources" };
  if (pathname.startsWith("/data-sources/"))
    return { title: pageMeta["/data-sources"]?.title || "Data Sources" };
  if (pathname.startsWith("/executive/"))
    return pageMeta[pathname] || { title: pageMeta["/executive/position-history"]?.title || "Executive" };

  return { title: "C-Levels" };
}

export const PageMetaProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const [overrideMeta, setOverrideMeta] = useState<PageMeta | null>(null);

  const routeMeta = getMetaFromPath(location.pathname, t.pageMeta);

  // Reset override on route change
  useEffect(() => {
    setOverrideMeta(null);
  }, [location.pathname]);

  const setPageMeta = useCallback((m: PageMeta) => {
    setOverrideMeta(m);
  }, []);

  const meta = overrideMeta || routeMeta;

  return (
    <PageMetaContext.Provider value={{ meta, setPageMeta }}>
      {children}
    </PageMetaContext.Provider>
  );
};
