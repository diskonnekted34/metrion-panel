import { useState } from "react";
import { X, Bell, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const roles = ["CEO", "C-Level", "Director", "Manager"] as const;

const NotificationSettingsModal = ({ open, onClose }: NotificationSettingsModalProps) => {
  const [weeklyOn, setWeeklyOn] = useState(true);
  const [monthlyOn, setMonthlyOn] = useState(true);
  const [yearlyOn, setYearlyOn] = useState(true);
  const [deptOn, setDeptOn] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["CEO", "C-Level"]);

  if (!open) return null;

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const handleSave = () => {
    toast.success("Rapor gönderim politikası güncellendi.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-white/[0.08] overflow-hidden"
        style={{
          background: "rgba(8,8,12,0.95)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 0 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)",
          borderImage: "linear-gradient(135deg, rgba(0,229,255,0.12), rgba(139,92,246,0.12)) 1",
        }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <Bell className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Rapor Gönderim Politikası</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Report toggles */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Rapor Türleri</p>
            {[
              { label: "Haftalık Şirket Raporu", value: weeklyOn, set: setWeeklyOn },
              { label: "Aylık Şirket Raporu", value: monthlyOn, set: setMonthlyOn },
              { label: "Yıllık Şirket Raporu", value: yearlyOn, set: setYearlyOn },
              { label: "Departman Raporları", value: deptOn, set: setDeptOn },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-sm text-foreground">{item.label}</span>
                <Switch checked={item.value} onCheckedChange={item.set} />
              </div>
            ))}
          </div>

          {/* Recipients */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Alıcılar (Rol Bazlı)</p>
            <div className="flex flex-wrap gap-2">
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedRoles.includes(role)
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-white/[0.03] text-muted-foreground border-white/[0.06] hover:border-white/[0.12]"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Teslimat</p>
            <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary/60" />
                <span className="text-sm text-foreground">PDF mail olarak gönder</span>
              </div>
              <span className="text-[10px] text-primary font-medium px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">Aktif</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-foreground">Günlük digest</span>
              </div>
              <Switch checked={dailyDigest} onCheckedChange={setDailyDigest} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground border border-white/[0.06] hover:border-white/[0.12] transition-all">
            İptal
          </button>
          <button onClick={handleSave} className="px-5 py-2 rounded-xl text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-all"
            style={{ boxShadow: "0 0 20px rgba(30,107,255,0.25)" }}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsModal;
