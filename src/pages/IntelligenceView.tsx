import { useState } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Download, Share2, FileText, Brain, Clock, Zap, BarChart3, TrendingUp,
  Settings2, Shield, LineChart, ChevronRight, RefreshCw, AlertTriangle
} from "lucide-react";
import { LineChartMock, BarChartMock, DonutChartMock, GaugeMock, HeatmapMock, AlertItem } from "@/components/dashboard/tabs/MockChart";

interface ReportTab {
  id: string;
  label: string;
  agent: string;
  icon: React.ElementType;
}

const allTabs: Record<string, ReportTab> = {
  finans: { id: "finans", label: "Finans İstihbaratı", agent: "CFO Agent", icon: BarChart3 },
  buyume: { id: "buyume", label: "Büyüme İstihbaratı", agent: "CMO Agent", icon: TrendingUp },
  operasyon: { id: "operasyon", label: "Operasyon İstihbaratı", agent: "COO Agent", icon: Settings2 },
  risk: { id: "risk", label: "Risk İstihbaratı", agent: "CEO Agent", icon: Shield },
  tahminler: { id: "tahminler", label: "Tahmin İstihbaratı", agent: "CEO Agent", icon: LineChart },
};

const timestamp = "15 Şub 2026, 09:45";

// Report sections per cluster
const reportSections: Record<string, React.ReactNode> = {
  finans: <FinansReport />,
  buyume: <BuyumeReport />,
  operasyon: <OperasyonReport />,
  risk: <RiskReport />,
  tahminler: <TahminlerReport />,
};

const IntelligenceView = () => {
  const { clusterId } = useParams<{ clusterId: string }>();
  const navigate = useNavigate();
  const [openTabs, setOpenTabs] = useState<string[]>([clusterId || "finans"]);
  const [activeTab, setActiveTab] = useState(clusterId || "finans");

  const addTab = (id: string) => {
    if (!openTabs.includes(id)) {
      if (openTabs.length >= 5) return;
      setOpenTabs(prev => [...prev, id]);
    }
    setActiveTab(id);
  };

  const closeTab = (id: string) => {
    const next = openTabs.filter(t => t !== id);
    if (next.length === 0) {
      navigate("/dashboard");
      return;
    }
    setOpenTabs(next);
    if (activeTab === id) setActiveTab(next[next.length - 1]);
  };

  const currentTab = allTabs[activeTab];
  if (!currentTab) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Top bar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-5 shrink-0 glass-strong">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <currentTab.icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">{currentTab.label}</h1>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Brain className="h-3 w-3" />
              <span>{currentTab.agent}</span>
              <span>·</span>
              <Clock className="h-3 w-3" />
              <span>Data Snapshot: {timestamp}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-medium">
                Advanced Processing
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => toast.info("Güncel veriyle yeniden çalıştırılıyor.")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <RefreshCw className="h-3 w-3" /> Güncel Veriyle Yeniden Çalıştır
          </button>
          <button onClick={() => toast.info("Dışa aktarılıyor.")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Download className="h-3 w-3" /> Dışa Aktar
          </button>
          <button onClick={() => toast.info("Paylaşım bağlantısı kopyalandı.")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Share2 className="h-3 w-3" /> Paylaş
          </button>
          <button
            onClick={() => navigate("/action-center")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
          >
            <Zap className="h-3 w-3" /> Aksiyon Taslağı Oluştur
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="h-10 border-b border-border flex items-center px-2 gap-1 shrink-0 bg-secondary/20 overflow-x-auto">
        {openTabs.map((tabId) => {
          const tab = allTabs[tabId];
          if (!tab) return null;
          return (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                activeTab === tabId
                  ? "bg-background text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(tabId); }}
                className="ml-1 p-0.5 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </button>
          );
        })}

        {/* Add tab menu */}
        {openTabs.length < 5 && (
          <div className="relative group ml-1">
            <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-xs">
              +
            </button>
            <div className="absolute top-full left-0 mt-1 glass-card p-2 hidden group-hover:block z-10 min-w-[180px]">
              {Object.values(allTabs)
                .filter(t => !openTabs.includes(t.id))
                .map(t => (
                  <button
                    key={t.id}
                    onClick={() => addTab(t.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <t.icon className="h-3 w-3" />
                    {t.label}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Report content */}
      <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {reportSections[activeTab] || <p className="text-muted-foreground">Rapor yükleniyor...</p>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// ── Report Components ──

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <ChevronRight className="h-3.5 w-3.5 text-primary" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function FinansReport() {
  const costStructure = [
    { label: "COGS", value: 42, color: "hsl(220, 100%, 56%)" },
    { label: "Pazarlama", value: 22, color: "hsl(38, 92%, 50%)" },
    { label: "Lojistik", value: 18, color: "hsl(160, 76%, 44%)" },
    { label: "Genel Gider", value: 12, color: "hsl(280, 60%, 55%)" },
    { label: "Diğer", value: 6, color: "hsl(var(--muted-foreground))" },
  ];

  return (
    <>
      <ReportSection title="Yönetici Özeti">
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Son 30 günlük finansal performans analizi güçlü bir gelir artışı (+12.4%) göstermektedir. Net kâr marjı %15.8 seviyesinde stabil kalmış,
            nakit pozisyon $890K ile güvenli bölgede seyretmektedir. Kargo maliyet optimizasyonu $18K tasarruf sağlamış, ancak iade oranındaki artış
            (+2.1%) marj üzerinde $18K baskı oluşturmuştur. Genel finansal stabilite skoru: <span className="text-success font-bold">82/100</span>.
          </p>
        </div>
      </ReportSection>

      <ReportSection title="Temel Bulgular">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Gelir vs Net Kâr Trendi</p>
            <LineChartMock data={[180, 195, 210, 205, 225, 240, 250]} data2={[28, 32, 35, 30, 38, 42, 45]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} showArea />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Maliyet Yapısı</p>
            <DonutChartMock segments={costStructure} centerLabel="%100" />
          </div>
        </div>
      </ReportSection>

      <ReportSection title="Risk Değerlendirmesi">
        <div className="space-y-2">
          <AlertItem level="warning" text="İade oranı marj üzerinde $18K baskı oluşturuyor." />
          <AlertItem level="info" text="Kargo maliyetlerinde %4 iyileşme — yeni sözleşme etkisi." />
          <AlertItem level="critical" text="Kampanya bazlı indirimler net marjı %1.8 aşındırdı." />
        </div>
      </ReportSection>

      <ReportSection title="Önerilen Aksiyonlar">
        <div className="space-y-2">
          {["İade oranı analizi için kök neden araştırması başlat", "İndirim politikası revizyon taslağı oluştur", "30 günlük nakit akış simülasyonu çalıştır"].map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 glass-card">
              <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-xs text-foreground">{a}</span>
              <button onClick={() => toast.success("Taslak oluşturuldu.")} className="ml-auto text-[10px] text-primary font-medium hover:underline">Taslak Oluştur</button>
            </div>
          ))}
        </div>
      </ReportSection>
    </>
  );
}

function BuyumeReport() {
  return (
    <>
      <ReportSection title="Yönetici Özeti">
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Büyüme momentumu pozitif. Organik büyüme oranı %18.7 ile hedefin üzerinde. CAC $32'ye düşerken LTV/CAC oranı 4.2x'e yükseldi.
            Meta Ads kanalında ROAS düşüşü gözlemleniyor — kanal doygunluk eşiğine yaklaşıyor.
          </p>
        </div>
      </ReportSection>

      <ReportSection title="Görsel Analiz">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">ROAS vs Kâr Overlay</p>
            <LineChartMock data={[3.8, 3.6, 3.5, 3.4, 3.3, 3.2, 3.2]} data2={[38, 40, 42, 43, 44, 45, 45]} labels={["Hft1", "Hft2", "Hft3", "Hft4", "Hft5", "Hft6", "Hft7"]} showArea />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">CAC Trendi</p>
            <LineChartMock data={[42, 40, 38, 36, 35, 33, 32]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} color="hsl(160, 76%, 44%)" showArea />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Kanal Performans</p>
            <HeatmapMock
              rows={["Meta", "Google", "TikTok", "Organik"]}
              cols={["ROAS", "CTR", "CPC", "CVR", "Hacim"]}
              data={[[85, 72, 45, 68, 90], [70, 80, 55, 75, 60], [60, 65, 70, 50, 40], [40, 55, 0, 82, 35]]}
            />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Ölçekleme Risk Göstergesi</p>
            <GaugeMock value={62} label="Ölçekleme Riski" />
          </div>
        </div>
      </ReportSection>

      <ReportSection title="Önerilen Aksiyonlar">
        <div className="space-y-2">
          {["Meta Ads bütçe yeniden dağıtım taslağı", "Google Ads ölçekleme senaryosu çalıştır", "Yeni kanal testi pilot programı başlat"].map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 glass-card">
              <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-xs text-foreground">{a}</span>
              <button onClick={() => toast.success("Taslak oluşturuldu.")} className="ml-auto text-[10px] text-primary font-medium hover:underline">Taslak Oluştur</button>
            </div>
          ))}
        </div>
      </ReportSection>
    </>
  );
}

function OperasyonReport() {
  return (
    <>
      <ReportSection title="Yönetici Özeti">
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Operasyonel verimlilik skoru 79/100. Sipariş karşılama süresi 1.8 güne düşmüş. 3 SKU'da stok tükenme riski %85'i aşmış durumda.
            Lojistik maliyetler son çeyrekte %4 iyileşme gösterdi. Kapasite kullanım oranı %78.
          </p>
        </div>
      </ReportSection>

      <ReportSection title="Görsel Analiz">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Envanter Hız Grafiği</p>
            <LineChartMock data={[12, 14, 13, 15, 16, 15, 17]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} showArea />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Stok Tükenme Olasılığı</p>
            <GaugeMock value={85} label="Stok Riski" />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Kargo Maliyet Trendi</p>
            <LineChartMock data={[8.2, 7.9, 7.8, 7.5, 7.3, 7.1, 7.0]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} color="hsl(38, 92%, 50%)" showArea />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Kapasite Kullanım</p>
            <GaugeMock value={78} label="Kapasite" />
          </div>
        </div>
      </ReportSection>

      <ReportSection title="Risk Uyarıları">
        <div className="space-y-2">
          <AlertItem level="critical" text="SKU-1042, SKU-1088, SKU-2301: 12 gün içinde stok tükenme riski." />
          <AlertItem level="warning" text="İade oranı %4.2'ye yükseldi — son 14 günlük artış %0.3pp." />
        </div>
      </ReportSection>
    </>
  );
}

function RiskReport() {
  return (
    <>
      <ReportSection title="Yönetici Özeti">
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Genel risk maruziyeti "Orta" seviyesinde. Ana risk faktörleri: kanal konsantrasyonu (tek kanal gelirin %58'i), nakit akış stres
            olasılığı (%18) ve marj erozyonu (kampanya bazlı indirimler). Departmanlar arası risk korelasyonu analizi yapıldı.
          </p>
        </div>
      </ReportSection>

      <ReportSection title="Risk Matrisi">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Risk Isı Haritası</p>
            <HeatmapMock
              rows={["Finans", "Pazarlama", "Operasyon", "Kreatif"]}
              cols={["Marj", "Nakit", "Büyüme", "Ops", "Genel"]}
              data={[[35, 18, 50, 25, 32], [60, 30, 72, 40, 55], [45, 22, 35, 65, 42], [20, 15, 28, 30, 22]]}
            />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Nakit Stres Olasılığı</p>
            <GaugeMock value={18} label="Stres %" />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Marj Erozyonu Riski</p>
            <GaugeMock value={35} label="Marj Riski" />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Kanal Konsantrasyon Riski</p>
            <GaugeMock value={72} label="Konsantrasyon" />
          </div>
        </div>
      </ReportSection>

      <ReportSection title="Çapraz Departman Risk Korelasyonu">
        <div className="space-y-2">
          <AlertItem level="critical" text="Pazarlama kanal yoğunlaşması + Operasyon stok riski = birleşik gelir tehlikesi." />
          <AlertItem level="warning" text="Finans marj erozyonu + Pazarlama ROAS düşüşü = kârlılık baskısı." />
        </div>
      </ReportSection>
    </>
  );
}

function TahminlerReport() {
  return (
    <>
      <ReportSection title="Yönetici Özeti">
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            30 günlük kâr projeksiyonu $410K (+7.9%). 60 günlük nakit pozisyon $830K'ya düşüş eğiliminde (-6.7%).
            Büyüme sürdürülebilirlik projeksiyonu %19.2 ile hedef dahilinde. Senaryo simülasyonları 3 farklı model üzerinden çalıştırıldı.
          </p>
        </div>
      </ReportSection>

      <ReportSection title="Projeksiyon Grafikleri">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">30 Günlük Kâr Tahmini</p>
            <LineChartMock data={[380, 385, 390, 395, 400, 405, 410]} labels={["Hft1", "Hft2", "Hft3", "Hft4", "Hft5", "Hft6", "Hft7"]} showArea />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">60 Günlük Nakit Projeksiyonu</p>
            <LineChartMock data={[890, 870, 850, 840, 830, 825, 830]} labels={["Bugün", "10g", "20g", "30g", "40g", "50g", "60g"]} color="hsl(38, 92%, 50%)" showArea />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Büyüme Sürdürülebilirlik</p>
            <LineChartMock data={[17.5, 18.0, 18.3, 18.5, 18.8, 19.0, 19.2]} labels={["Hft1", "Hft2", "Hft3", "Hft4", "Hft5", "Hft6", "Hft7"]} color="hsl(160, 76%, 44%)" showArea />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-medium text-foreground mb-3">Senaryo Karşılaştırması</p>
            <BarChartMock data={[
              { label: "İyimser", value: 92 },
              { label: "Baz", value: 74, color: "hsl(220, 100%, 56%)" },
              { label: "Kötümser", value: 48, color: "hsl(0, 84%, 60%)" },
            ]} />
          </div>
        </div>
      </ReportSection>

      <ReportSection title="Hassasiyet Analizi">
        <div className="glass-card p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "CAC +20%", impact: "-$45K kâr", risk: "warning" },
              { label: "ROAS -30%", impact: "-$120K gelir", risk: "critical" },
              { label: "Maliyet +10%", impact: "-$68K marj", risk: "warning" },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-xl bg-secondary/30">
                <p className="text-xs font-medium text-foreground mb-1">{s.label}</p>
                <p className={`text-sm font-bold ${s.risk === "critical" ? "text-destructive" : "text-warning"}`}>{s.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </ReportSection>
    </>
  );
}

export default IntelligenceView;
