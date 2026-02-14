import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Building2, CreditCard, Bell } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const Settings = () => {
  const sections = [
    { icon: User, title: "Profil", desc: "Hesap bilgilerinizi ve tercihlerinizi yönetin" },
    { icon: Building2, title: "Şirket", desc: "Şirket bilgileri ve çalışma alanı ayarları" },
    { icon: CreditCard, title: "Abonelik", desc: "Plan detayları ve fatura yönetimi" },
    { icon: Bell, title: "Bildirimler", desc: "Uyarı ve bildirim tercihlerini yapılandırın" },
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
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Settings;
