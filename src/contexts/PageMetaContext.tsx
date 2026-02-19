import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

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

const routeTitles: Record<string, PageMeta> = {
  "/dashboard": { title: "Komuta", subtitle: "Stratejik karar merkezi · Kontrollü otomasyon · Sürekli güncellenen zekâ" },
  "/decision-lab": { title: "Karar Merkezi", subtitle: "Stratejik kararlar, onay süreçleri ve yaşam döngüsü yönetimi" },
  "/action-center": { title: "Aksiyon Merkezi", subtitle: "Operasyonel aksiyonlar ve uygulama takibi" },
  "/okr": { title: "OKR", subtitle: "Hedefler ve anahtar sonuçlar" },
  "/kadro": { title: "Kadro", subtitle: "AI yönetici kadrosu ve uzman haritası" },
  "/tasks": { title: "Görevler", subtitle: "Atanmış görevler ve ilerleme takibi" },
  "/reports": { title: "Raporlar", subtitle: "Stratejik ve operasyonel raporlar" },
  "/alerts": { title: "Uyarılar", subtitle: "Kritik sinyaller ve bildirimler" },
  "/departments": { title: "Departmanlar", subtitle: "Organizasyonel yapı ve departman sağlığı" },
  "/team": { title: "Ekip", subtitle: "AI uzman ekibi ve performans görünümü" },
  "/marketplace": { title: "Pazar Yeri", subtitle: "Ajan ve modül genişletme kataloğu" },
  "/settings": { title: "Ayarlar", subtitle: "Hesap, organizasyon ve sistem yapılandırması" },
  "/data-sources": { title: "Veri Kaynakları", subtitle: "İş zekâsı entegrasyonları ve veri bağlantıları" },
  "/tech-data-sources": { title: "Teknoloji Veri Kaynakları", subtitle: "CTO & CIO hatları için entegrasyon kataloğu" },
  "/creative-workspace": { title: "Kreatif Çalışma Alanı", subtitle: "İçerik üretimi ve kreatif yönetim" },
  "/pricing": { title: "Fiyatlandırma", subtitle: "Paketler ve planlar" },
};

function getMetaFromPath(pathname: string): PageMeta {
  // Exact match
  if (routeTitles[pathname]) return routeTitles[pathname];

  // Pattern matches
  if (pathname.startsWith("/departments/") && pathname.includes("/intelligence/"))
    return { title: "Departman İstihbarat", subtitle: "Metrik detayı ve analiz" };
  if (pathname.startsWith("/departments/") && pathname.endsWith("/reports"))
    return { title: "Departman Raporları" };
  if (pathname.startsWith("/departments/") && pathname.endsWith("/actions"))
    return { title: "Departman Aksiyonları" };
  if (pathname.startsWith("/departments/") && pathname.endsWith("/modules"))
    return { title: "Departman Modülleri" };
  if (pathname.startsWith("/departments/"))
    return { title: "Departman Detayı" };
  if (pathname.startsWith("/alerts/"))
    return { title: "Uyarı Detayı" };
  if (pathname.startsWith("/reports/"))
    return { title: "Rapor Görüntüleyici" };
  if (pathname.startsWith("/intelligence/"))
    return { title: "İstihbarat Görünümü" };
  if (pathname.startsWith("/expert/"))
    return { title: "Uzman Profili" };
  if (pathname.startsWith("/workspace/"))
    return { title: "Ajan Çalışma Alanı" };
  if (pathname.startsWith("/tech-data-sources/"))
    return { title: "Connector Yönetimi", subtitle: "Bağlantı, senkronizasyon ve güvenlik yapılandırması" };
  if (pathname.startsWith("/data-sources/"))
    return { title: "Entegrasyon Detayı" };

  return { title: "C-Levels" };
}

export const PageMetaProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [overrideMeta, setOverrideMeta] = useState<PageMeta | null>(null);

  const routeMeta = getMetaFromPath(location.pathname);

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
