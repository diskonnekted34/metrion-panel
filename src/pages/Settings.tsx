import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Building2, CreditCard, Bell, ChevronDown, ChevronUp } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const Settings = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({
    level: "critical_reco",
    email: false,
    inApp: true,
    digest: false,
  });

  const sections = [
    { icon: User, title: "Profil", desc: "Hesap bilgilerinizi ve tercihlerinizi yönetin" },
    { icon: Building2, title: "Şirket", desc: "Şirket bilgileri ve çalışma alanı ayarları" },
    { icon: CreditCard, title: "Abonelik", desc: "Plan detayları ve fatura yönetimi" },
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Ayarlar</h1>
              <p className="text-sm text-muted-foreground">Hesap ve platform ayarları</p>
            </div>
          </div>

          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.title} className="glass-card p-5 flex items-center gap-4 cursor-pointer">
                <div className="h-10 w-10 rounded-2xl bg-white/[0.06] flex items-center justify-center shrink-0">
                  <section.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{section.title}</p>
                  <p className="text-xs text-muted-foreground">{section.desc}</p>
                </div>
              </div>
            ))}

            {/* Notification Preferences */}
            <div className="glass-card overflow-hidden">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-full p-5 flex items-center gap-4 text-left"
              >
                <div className="h-10 w-10 rounded-2xl bg-white/[0.06] flex items-center justify-center shrink-0">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Bildirimler</p>
                  <p className="text-xs text-muted-foreground">Uyarı ve bildirim tercihlerini yapılandırın</p>
                </div>
                {notifOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {notifOpen && (
                <div className="px-5 pb-5 pt-0 border-t border-border space-y-4">
                  <div className="pt-4">
                    <p className="text-xs font-semibold text-foreground mb-3">Sinyal Seviyesi</p>
                    <div className="space-y-2">
                      {[
                        { value: "critical_only", label: "Yalnızca Kritik", desc: "Sadece kritik operasyonel sinyaller" },
                        { value: "critical_reco", label: "Kritik + Öneriler", desc: "Kritik sinyaller ve ajan önerileri" },
                        { value: "digest", label: "Günlük Özet", desc: "Tüm sinyaller günlük tek rapor olarak" },
                      ].map((opt) => (
                        <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-colors ${notifPrefs.level === opt.value ? "bg-primary/10 border border-primary/20" : "bg-secondary/30 hover:bg-secondary/50"}`}>
                          <input
                            type="radio"
                            name="notif_level"
                            checked={notifPrefs.level === opt.value}
                            onChange={() => setNotifPrefs({ ...notifPrefs, level: opt.value })}
                            className="mt-0.5 accent-primary"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{opt.label}</p>
                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground mb-3">Kanal Tercihleri</p>
                    <div className="space-y-2">
                      {[
                        { key: "inApp" as const, label: "Uygulama İçi", desc: "Platform içi bildirimler" },
                        { key: "email" as const, label: "E-posta Bildirimleri", desc: "Kritik sinyalleri e-posta ile alın" },
                        { key: "digest" as const, label: "Günlük Özet E-postası", desc: "Her gün 09:00'da sinyal özeti" },
                      ].map((ch) => (
                        <label key={ch.key} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
                          <div>
                            <p className="text-sm font-medium text-foreground">{ch.label}</p>
                            <p className="text-xs text-muted-foreground">{ch.desc}</p>
                          </div>
                          <div className={`w-10 h-6 rounded-full flex items-center transition-colors ${notifPrefs[ch.key] ? "bg-primary" : "bg-secondary"}`}>
                            <div
                              className={`w-4 h-4 rounded-full bg-foreground transition-transform mx-1 ${notifPrefs[ch.key] ? "translate-x-4" : ""}`}
                              onClick={(e) => { e.preventDefault(); setNotifPrefs({ ...notifPrefs, [ch.key]: !notifPrefs[ch.key] }); }}
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Settings;
