import { motion } from "framer-motion";
import { Shield, Eye, Edit, Lock, Crown, Users, Briefcase } from "lucide-react";

const PERMISSION_MATRIX = [
  { role: "CEO", level: 0, icon: Crown, budget: "Full Access", seats: "Full Access", okr: "Full Access", reports: "Full Access", decisions: "Full Access" },
  { role: "C-Level", level: 1, icon: Briefcase, budget: "Kendi Departmanı", seats: "Kendi Altı", okr: "Kendi Departmanı", reports: "Kendi Departmanı", decisions: "Departman Onay" },
  { role: "Director", level: 2, icon: Users, budget: "Salt Okunur", seats: "Kendi Altı", okr: "Kendi Takımı", reports: "Kendi Takımı", decisions: "Öneri" },
  { role: "Manager", level: 3, icon: Users, budget: "Görünmez", seats: "Kendi Altı", okr: "Kendi Takımı", reports: "Kendi Takımı", decisions: "Öneri" },
  { role: "Lead", level: 4, icon: Users, budget: "Görünmez", seats: "Salt Okunur", okr: "Kendi", reports: "Kendi", decisions: "Yok" },
  { role: "Specialist", level: 5, icon: Users, budget: "Görünmez", seats: "Salt Okunur", okr: "Kendi", reports: "Kendi", decisions: "Yok" },
  { role: "Junior", level: 6, icon: Users, budget: "Görünmez", seats: "Görünmez", okr: "Salt Okunur", reports: "Görünmez", decisions: "Yok" },
  { role: "Intern", level: 7, icon: Users, budget: "Görünmez", seats: "Görünmez", okr: "Salt Okunur", reports: "Görünmez", decisions: "Yok" },
];

const accessIcon = (access: string) => {
  if (access === "Full Access") return <Edit className="h-3 w-3 text-success" />;
  if (access.includes("Kendi") || access.includes("Departman") || access.includes("Onay")) return <Eye className="h-3 w-3 text-primary" />;
  if (access === "Salt Okunur" || access === "Öneri") return <Eye className="h-3 w-3 text-muted-foreground" />;
  if (access === "Görünmez" || access === "Yok") return <Lock className="h-3 w-3 text-muted-foreground/40" />;
  return null;
};

const PermissionsTab = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-[11px] text-muted-foreground">
          Role-based access control — Seat seviyesine göre yetki dağılımı
        </span>
      </div>

      {/* Permission matrix */}
      <div className="border border-border/40 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 gap-px bg-secondary/30 border-b border-border/40">
          {["Rol", "Bütçe", "Seat Yönetimi", "OKR", "Raporlar", "Kararlar"].map((h, i) => (
            <div key={h} className={`px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ${i === 0 ? "col-span-2" : ""}`}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {PERMISSION_MATRIX.map((row, i) => (
          <motion.div
            key={row.role}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-7 gap-px border-b border-border/20 last:border-0 hover:bg-secondary/20 transition-colors"
          >
            <div className="col-span-2 px-3 py-3 flex items-center gap-2">
              <row.icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] font-medium text-foreground">{row.role}</span>
              <span className="text-[9px] text-muted-foreground">L{row.level}</span>
            </div>
            {[row.budget, row.seats, row.okr, row.reports, row.decisions].map((access, j) => (
              <div key={j} className="px-3 py-3 flex items-center gap-1.5">
                {accessIcon(access)}
                <span className="text-[10px] text-muted-foreground">{access}</span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Future note */}
      <div className="mt-6 p-4 rounded-xl border border-border/30 bg-secondary/10">
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            Gelişmiş yetki konfigürasyonu gelecek güncellemede aktif edilecektir.
          </span>
        </div>
      </div>
    </div>
  );
};

export default PermissionsTab;
