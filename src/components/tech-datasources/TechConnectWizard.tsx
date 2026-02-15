import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Shield, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { TechConnector } from "@/data/techIntegrations";

interface TechConnectWizardProps {
  connector: TechConnector | null;
  open: boolean;
  onClose: () => void;
  onComplete: (id: string) => void;
}

const steps = [
  { id: "env", title: "Ortam Kapsamı", desc: "Hangi ortamlardan veri çekilecek?" },
  { id: "auth", title: "Kimlik Doğrulama", desc: "Yetkilendirme yöntemini seçin" },
  { id: "permissions", title: "İzinler", desc: "Minimum yetki ilkesine uygun erişim" },
  { id: "data", title: "Veri Seçimi", desc: "Senkronize edilecek varlık ve olaylar" },
  { id: "review", title: "Gözden Geçir & Bağlan", desc: "Seçimlerinizi doğrulayın" },
];

const TechConnectWizard = ({ connector, open, onClose, onComplete }: TechConnectWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEnvs, setSelectedEnvs] = useState<string[]>(["prod"]);
  const [connecting, setConnecting] = useState(false);

  if (!open || !connector) return null;

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      onComplete(connector.id);
      setConnecting(false);
      setCurrentStep(0);
    }, 2000);
  };

  const canNext = currentStep < steps.length - 1;
  const canBack = currentStep > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
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
                <h3 className="text-base font-semibold text-foreground">{connector.name_tr}</h3>
                <p className="text-xs text-muted-foreground">Bağlantı Sihirbazı — Adım {currentStep + 1}/{steps.length}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-secondary transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="px-5 pt-4">
            <div className="flex gap-1">
              {steps.map((s, i) => (
                <div key={s.id} className={`flex-1 h-1 rounded-full transition-colors ${
                  i <= currentStep ? "bg-primary" : "bg-secondary/50"
                }`} />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 min-h-[220px]">
            {connecting ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
                <p className="text-sm text-foreground font-medium">{connector.name_tr} bağlanıyor…</p>
                <p className="text-xs text-muted-foreground">Token değişimi ve ilk senkronizasyon başlatılıyor.</p>
              </div>
            ) : (
              <>
                <h4 className="text-sm font-semibold text-foreground mb-1">{steps[currentStep].title}</h4>
                <p className="text-xs text-muted-foreground mb-4">{steps[currentStep].desc}</p>

                {currentStep === 0 && (
                  <div className="space-y-2">
                    {connector.environments_supported.map(env => (
                      <label key={env} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedEnvs.includes(env)}
                          onChange={() => setSelectedEnvs(prev => 
                            prev.includes(env) ? prev.filter(e => e !== env) : [...prev, env]
                          )}
                          className="rounded border-border"
                        />
                        <span className="text-sm text-foreground font-medium capitalize">{env}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {env === "prod" ? "Üretim ortamı" : env === "stage" ? "Test ortamı" : "Geliştirme ortamı"}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-3">
                    <div className="px-4 py-3 rounded-xl bg-primary/5 border border-primary/15">
                      <p className="text-xs font-medium text-foreground mb-1">Yöntem: {connector.access_method.toUpperCase()}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {connector.access_method === "oauth" ? "OAuth2 ile güvenli yetkilendirme. Tarayıcıda oturum açmanız gerekecek." :
                         connector.access_method === "api_key" ? "API anahtarı ile erişim. Şifrelenerek saklanır." :
                         connector.access_method === "webhook" ? "Webhook URL ile otomatik veri aktarımı." : "Manuel dosya aktarımı."}
                      </p>
                    </div>
                    {connector.access_method === "api_key" && (
                      <div>
                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">API Anahtarı</label>
                        <input type="password" placeholder="••••••••••••" className="mt-1 w-full px-3 py-2 rounded-xl bg-secondary/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-2">
                    {connector.required_permissions.map(p => (
                      <div key={p} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/5 border border-success/10">
                        <Shield className="h-3 w-3 text-success" />
                        <code className="text-[11px] text-foreground font-mono">{p}</code>
                        <span className="text-[9px] text-success ml-auto">Salt okunur</span>
                      </div>
                    ))}
                    <p className="text-[10px] text-success mt-2">{connector.least_privilege_notes_tr}</p>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Varlıklar</p>
                      <div className="flex flex-wrap gap-1.5">
                        {connector.entities.map(e => (
                          <span key={e.name} className="text-[10px] px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/15 font-medium">
                            ✓ {e.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Olaylar</p>
                      <div className="flex flex-wrap gap-1.5">
                        {connector.events.map(e => (
                          <span key={e} className="text-[10px] px-2 py-1 rounded-lg bg-secondary/50 text-muted-foreground border border-border">
                            ✓ {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <ReviewItem label="Connector" value={connector.name_tr} />
                      <ReviewItem label="Ortamlar" value={selectedEnvs.join(", ")} />
                      <ReviewItem label="Erişim" value={connector.access_method.toUpperCase()} />
                      <ReviewItem label="Frekans" value={connector.refresh_frequency} />
                      <ReviewItem label="Varlıklar" value={`${connector.entities.length} adet`} />
                      <ReviewItem label="Hassasiyet" value={connector.data_sensitivity} />
                    </div>
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/15">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <p className="text-[11px] text-primary font-medium">Salt okunur erişim. Yazma işlemi yapılmaz.</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!connecting && (
            <div className="flex items-center justify-between p-5 border-t border-border">
              <button
                onClick={() => setCurrentStep(s => s - 1)}
                disabled={!canBack}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="h-3 w-3" />
                Geri
              </button>
              {canNext ? (
                <button
                  onClick={() => setCurrentStep(s => s + 1)}
                  className="flex items-center gap-1 btn-primary px-4 py-2 text-xs"
                >
                  İleri
                  <ChevronRight className="h-3 w-3" />
                </button>
              ) : (
                <button onClick={handleConnect} className="flex items-center gap-1 btn-primary px-4 py-2 text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  Bağlan
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ReviewItem = ({ label, value }: { label: string; value: string }) => (
  <div className="px-3 py-2 rounded-xl bg-secondary/30">
    <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className="text-[11px] font-medium text-foreground capitalize">{value}</p>
  </div>
);

export default TechConnectWizard;
