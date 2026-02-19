import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Palette, Plug, RefreshCw, ExternalLink, GitBranch, Layers, Clock,
  CheckCircle2, Shield, Image, PenTool, Eye
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useIntegrations } from "@/contexts/IntegrationContext";
import { useRBAC } from "@/contexts/RBACContext";

type TabId = "canva" | "figma";

const tabs: { id: TabId; label: string; icon: typeof Palette }[] = [
  { id: "canva", label: "Canva Tasarımları", icon: Image },
  { id: "figma", label: "Figma Projeleri", icon: PenTool },
];

// Mock design items
const canvaDesigns = [
  { id: "c1", name: "Sosyal Medya Kampanyası — Q1", status: "Taslak", updatedAt: "2025-02-12T14:30:00Z", template: "Instagram Story", version: 3 },
  { id: "c2", name: "E-posta Banner — Kış İndirimi", status: "İncelemede", updatedAt: "2025-02-11T09:15:00Z", template: "Email Header", version: 2 },
  { id: "c3", name: "Ürün Lansmanı — Hero Görseli", status: "Onaylandı", updatedAt: "2025-02-10T16:45:00Z", template: "Web Banner", version: 5 },
];

const figmaProjects = [
  { id: "f1", name: "Marka Kılavuzu v3.0", status: "Düzenleniyor", updatedAt: "2025-02-13T11:00:00Z", frames: 24, components: 86 },
  { id: "f2", name: "Kampanya Landing Page", status: "Taslak", updatedAt: "2025-02-12T08:30:00Z", frames: 8, components: 34 },
  { id: "f3", name: "Mobil Uygulama UI Kit", status: "Tamamlandı", updatedAt: "2025-02-09T13:20:00Z", frames: 42, components: 128 },
];

const statusBadge = (status: string) => {
  if (status === "Onaylandı" || status === "Tamamlandı") return "bg-success/15 text-success";
  if (status === "İncelemede" || status === "Düzenleniyor") return "bg-primary/15 text-primary";
  return "bg-secondary text-muted-foreground";
};

const CreativeWorkspace = () => {
  const [activeTab, setActiveTab] = useState<TabId>("canva");
  const { isConnected, connect } = useIntegrations();
  const { canPerform } = useRBAC();
  const isAdmin = canPerform("canManageBilling");
  const canvaConnected = isConnected("canva");
  const figmaConnected = isConnected("figma");

  const currentConnected = activeTab === "canva" ? canvaConnected : figmaConnected;
  const currentId = activeTab === "canva" ? "canva" : "figma";

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header removed — title shown in Global Top Bar */}

          {/* Security Notice */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-success/5 border border-success/10 mb-6">
            <Shield className="h-4 w-4 text-success shrink-0" />
            <span className="text-xs text-success">Yalnızca taslak oluşturma. AI otomatik yayınlama yapmaz — tüm çıktılar insan onayı gerektirir.</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Not Connected State */}
          {!currentConnected && (
            <div className="glass-card p-10 text-center">
              <div className="h-16 w-16 rounded-2xl bg-secondary/60 flex items-center justify-center mx-auto mb-4">
                <Plug className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">
                {activeTab === "canva" ? "Canva" : "Figma"} Bağlı Değil
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                {activeTab === "canva"
                  ? "Canva hesabınızı bağlayarak AI tasarım ekibinin taslak oluşturmasını, marka kitinize erişmesini ve şablonlarınızı kullanmasını sağlayın."
                  : "Figma hesabınızı bağlayarak AI ekibinin taslak çerçeveler oluşturmasını, bileşen kütüphanenize erişmesini ve layout planları çıkarmasını sağlayın."
                }
              </p>
              {isAdmin ? (
                <button onClick={() => connect(currentId)} className="btn-primary px-6 py-2.5 text-sm">
                  <Plug className="h-4 w-4 mr-2 inline" />
                  {activeTab === "canva" ? "Canva" : "Figma"} Bağlan
                </button>
              ) : (
                <p className="text-xs text-muted-foreground">Bağlantı için Sahip veya Yönetici yetkisi gerekli.</p>
              )}

              {/* Permission scope preview */}
              <div className="mt-8 max-w-sm mx-auto">
                <div className="flex items-center gap-1.5 mb-3">
                  <Eye className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">İzin Kapsamı</span>
                </div>
                {activeTab === "canva" ? (
                  <div className="space-y-1">
                    {[
                      { label: "Tasarım oluşturma", access: "taslak" },
                      { label: "Şablon düzenleme", access: "okuma/yazma" },
                      { label: "Marka kiti erişimi", access: "salt okunur" },
                      { label: "Tasarım dışa aktarma", access: "salt okunur" },
                    ].map(p => (
                      <div key={p.label} className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-secondary/30">
                        <span className="text-xs text-foreground">{p.label}</span>
                        <span className="text-[10px] text-muted-foreground">{p.access}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {[
                      { label: "Dosya oluşturma", access: "taslak" },
                      { label: "Tasarım bileşenleri düzenleme", access: "okuma/yazma" },
                      { label: "Ekip kütüphanesi erişimi", access: "salt okunur" },
                    ].map(p => (
                      <div key={p.label} className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-secondary/30">
                        <span className="text-xs text-foreground">{p.label}</span>
                        <span className="text-[10px] text-muted-foreground">{p.access}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connected — Canva Designs */}
          {currentConnected && activeTab === "canva" && (
            <div className="space-y-4">
              {/* Actions Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">Canva Bağlı</span>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => toast.info("Canva senkronizasyonu başlatıldı.")} className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs text-foreground transition-colors">
                    <RefreshCw className="h-3 w-3 mr-1.5 inline" />
                    Senkronize Et
                  </button>
                  <button onClick={() => toast.info("Marka kiti seçimi açılıyor.")} className="btn-primary px-4 py-2 text-xs">
                    <Image className="h-3 w-3 mr-1.5 inline" />
                    Marka Kiti Seç
                  </button>
                  <button onClick={() => toast.info("Şablon kütüphanesi açılıyor.")} className="btn-primary px-4 py-2 text-xs">
                    <Layers className="h-3 w-3 mr-1.5 inline" />
                    Şablon Kütüphanesi
                  </button>
                </div>
              </div>

              {/* Design Cards */}
              {canvaDesigns.map(design => (
                <div key={design.id} className="glass-card p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-secondary/60 flex items-center justify-center">
                        <Image className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{design.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-muted-foreground">{design.template}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <GitBranch className="h-2.5 w-2.5" /> v{design.version}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" /> {new Date(design.updatedAt).toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${statusBadge(design.status)}`}>
                        {design.status}
                      </span>
                      <button onClick={() => toast.info("Canva'da açılıyor.")} className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs text-foreground transition-colors">
                        <ExternalLink className="h-3 w-3 mr-1.5 inline" />
                        Canva'da Aç
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create Draft CTA */}
              <button onClick={() => toast.info("Canva taslak oluşturuluyor.")} className="w-full glass-card p-4 text-center hover:bg-white/[0.03] transition-colors border-dashed border-2 border-border">
                <Image className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <span className="text-sm text-muted-foreground">Canva'da Taslak Oluştur</span>
              </button>
            </div>
          )}

          {/* Connected — Figma Projects */}
          {currentConnected && activeTab === "figma" && (
            <div className="space-y-4">
              {/* Actions Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">Figma Bağlı</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toast.info("Figma senkronizasyonu başlatıldı.")} className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs text-foreground transition-colors">
                    <RefreshCw className="h-3 w-3 mr-1.5 inline" />
                    Senkronize Et
                  </button>
                  <button onClick={() => toast.info("Ekip çalışma alanı seçimi açılıyor.")} className="btn-primary px-4 py-2 text-xs">
                    <Layers className="h-3 w-3 mr-1.5 inline" />
                    Ekip Çalışma Alanı Seç
                  </button>
                  <button onClick={() => toast.info("Bileşen senkronizasyonu başlatıldı.")} className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs text-foreground transition-colors">
                    <GitBranch className="h-3 w-3 mr-1.5 inline" />
                    Bileşen Senkronizasyonu
                  </button>
                </div>
              </div>

              {/* Project Cards */}
              {figmaProjects.map(project => (
                <div key={project.id} className="glass-card p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-secondary/60 flex items-center justify-center">
                        <PenTool className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-muted-foreground">{project.frames} çerçeve</span>
                          <span className="text-[10px] text-muted-foreground">{project.components} bileşen</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" /> {new Date(project.updatedAt).toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${statusBadge(project.status)}`}>
                        {project.status}
                      </span>
                      <button onClick={() => toast.info("Figma'da açılıyor.")} className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs text-foreground transition-colors">
                        <ExternalLink className="h-3 w-3 mr-1.5 inline" />
                        Figma'da Aç
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create Draft CTA */}
              <button onClick={() => toast.info("Figma taslak çerçeve oluşturuluyor.")} className="w-full glass-card p-4 text-center hover:bg-white/[0.03] transition-colors border-dashed border-2 border-border">
                <PenTool className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <span className="text-sm text-muted-foreground">Figma'da Taslak Çerçeve Oluştur</span>
              </button>
            </div>
          )}

          {/* Workflow Guide */}
          <div className="mt-8 glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">İş Akışı</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { step: "1", title: "Konsept", desc: "AI Kreatif Direktör yön belirler" },
                { step: "2", title: "Yönlendirme", desc: "AI Art Direktör layout planı çıkarır" },
                { step: "3", title: "Taslak", desc: "AI Grafik Tasarımcı taslak oluşturur" },
                { step: "4", title: "Senkronizasyon", desc: "Taslak Canva/Figma'ya gönderilir" },
                { step: "5", title: "Onay", desc: "İnsan inceler, düzenler ve yayınlar" },
              ].map(s => (
                <div key={s.step} className="bg-secondary/30 rounded-2xl p-4 text-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs font-bold text-primary">{s.step}</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground mb-1">{s.title}</p>
                  <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default CreativeWorkspace;
