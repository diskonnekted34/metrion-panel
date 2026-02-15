import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Eye, Pencil, FileText, ExternalLink, Upload, X, AlertTriangle } from "lucide-react";
import { Integration, IntegrationPermission } from "@/data/integrations";

interface PreConnectModalProps {
  integration: Integration;
  open: boolean;
  onClose: () => void;
  onConnect: () => void;
  onCSV: () => void;
}

const PreConnectModal = ({ integration, open, onClose, onConnect, onCSV }: PreConnectModalProps) => {
  const [step, setStep] = useState<"permissions" | "connecting">("permissions");

  const readPerms = integration.permissions.filter(p => p.scope === "read");
  const writePerms = integration.permissions.filter(p => p.scope === "write");
  const hasWrite = writePerms.length > 0;

  const handleConnect = () => {
    setStep("connecting");
    setTimeout(() => {
      onConnect();
      setStep("permissions");
    }, 1800);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg mx-4 glass-card border border-border rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{integration.name} Bağlantısı</h3>
                <p className="text-xs text-muted-foreground">OAuth2 yetkilendirme akışı</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-secondary transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {step === "permissions" ? (
            <div className="p-5 space-y-4">
              {/* Description */}
              <p className="text-sm text-secondary-foreground">{integration.description}</p>

              {/* Read Permissions */}
              {readPerms.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Okuma Erişimi</span>
                  </div>
                  <div className="space-y-1">
                    {readPerms.map((p) => (
                      <PermRow key={p.label} perm={p} />
                    ))}
                  </div>
                </div>
              )}

              {/* Write Permissions */}
              {hasWrite && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Pencil className="h-3.5 w-3.5 text-warning" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Yazma Erişimi</span>
                  </div>
                  <div className="space-y-1">
                    {writePerms.map((p) => (
                      <PermRow key={p.label} perm={p} isWrite />
                    ))}
                  </div>
                </div>
              )}

              {/* Safety notice */}
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 space-y-2">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-[11px] text-foreground font-medium">
                    Onay olmadan hiçbir değişiklik yapılmaz. Tüm yazma işlemleri Aksiyon Merkezi'nden onay gerektirir.
                  </p>
                </div>
                <div className="flex flex-col gap-1 pl-6">
                  <SecurityNote icon={Lock} text="Token'lar şifreli olarak saklanır" />
                  <SecurityNote icon={X} text="İstediğiniz zaman bağlantıyı kesebilirsiniz" />
                  <SecurityNote icon={FileText} text="Tüm işlemler denetim günlüğüne kaydedilir" />
                </div>
              </div>

              {/* Warning for write-capable */}
              {hasWrite && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-warning/5 border border-warning/15">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                  <p className="text-[10px] text-warning">
                    Yazma erişimi sadece Aksiyon Modu etkinken ve onay sürecinden geçtikten sonra kullanılır.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button onClick={handleConnect} className="btn-primary flex-1 py-2.5 text-sm font-medium">
                  <ExternalLink className="h-4 w-4 mr-2 inline" />
                  {integration.name} ile Devam Et
                </button>
                {integration.csvSupported && (
                  <button
                    onClick={() => { onCSV(); onClose(); }}
                    className="px-4 py-2.5 rounded-2xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-1.5 inline" />
                    CSV
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <ExternalLink className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-foreground font-medium">{integration.name} ile bağlantı kuruluyor…</p>
              <p className="text-xs text-muted-foreground">OAuth2 yetkilendirme ve token değişimi yapılıyor.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const PermRow = ({ perm, isWrite }: { perm: IntegrationPermission; isWrite?: boolean }) => (
  <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-secondary/30">
    <span className="text-xs text-foreground">{perm.label}</span>
    <span className={`text-[10px] font-medium ${isWrite ? "text-warning" : "text-muted-foreground"}`}>
      {perm.access}
    </span>
  </div>
);

const SecurityNote = ({ icon: Icon, text }: { icon: typeof Lock; text: string }) => (
  <div className="flex items-center gap-1.5">
    <Icon className="h-3 w-3 text-success" />
    <span className="text-[10px] text-success">{text}</span>
  </div>
);

export default PreConnectModal;
