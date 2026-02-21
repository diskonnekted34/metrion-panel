/**
 * ExecutionConfirmModal — Confirmation dialog before executing an action.
 */

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Send, X, Shield } from "lucide-react";

interface ExecutionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  riskLevel: string;
  estimatedImpact: string;
}

const ExecutionConfirmModal = ({ isOpen, onClose, onConfirm, title, riskLevel, estimatedImpact }: ExecutionConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#0A0F1F] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-warning" />
                <h3 className="text-sm font-semibold text-foreground">Yürütme Onayı</h3>
              </div>
              <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-secondary flex items-center justify-center">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Aşağıdaki aksiyonu harici sisteme yayınlamak üzeresiniz. Bu işlem geri alınamayabilir.
              </p>

              <div className="p-3 rounded-xl bg-secondary/30 border border-white/[0.06] space-y-2">
                <p className="text-xs font-medium text-foreground">{title}</p>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className={`font-semibold px-2 py-0.5 rounded-full ${
                    riskLevel === "high" ? "bg-destructive/10 text-destructive" :
                    riskLevel === "medium" ? "bg-warning/10 text-warning" :
                    "bg-emerald-400/10 text-emerald-400"
                  }`}>
                    Risk: {riskLevel === "high" ? "Yüksek" : riskLevel === "medium" ? "Orta" : "Düşük"}
                  </span>
                  <span className="text-muted-foreground">{estimatedImpact}</span>
                </div>
              </div>

              {riskLevel === "high" && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-warning/5 border border-warning/15">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                  <p className="text-[10px] text-warning">
                    Bu yüksek riskli bir işlemdir. Yürütme sonrası geri alma planını kontrol edin.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-colors">
                İptal
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" /> Yürüt
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExecutionConfirmModal;
