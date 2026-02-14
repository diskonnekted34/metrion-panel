import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Package, Zap, Users } from "lucide-react";
import { Pack } from "@/data/packs";
import { usePacks } from "@/contexts/PackContext";

interface UpgradeModalProps {
  pack: Pack | null;
  open: boolean;
  onClose: () => void;
}

const UpgradeModal = ({ pack, open, onClose }: UpgradeModalProps) => {
  const { activatePack, isCorActive, getMonthlyTotal } = usePacks();
  const [confirming, setConfirming] = useState(false);

  if (!pack) return null;

  const canActivate = pack.type === "core" || isCorActive;
  const newTotal = getMonthlyTotal() + pack.monthlyPrice;

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      activatePack(pack.id);
      setConfirming(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-lg glass-card p-8"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-secondary transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{pack.name}</h2>
                <p className="text-xs text-muted-foreground">{pack.tagline}</p>
              </div>
            </div>

            {/* Agents */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-primary" />
                Included Agents
              </p>
              <div className="space-y-2">
                {pack.agents.map(agent => (
                  <div key={agent.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/40">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {agent.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{agent.role}</p>
                      <p className="text-[10px] text-muted-foreground">{agent.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-accent" />
                Capabilities
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {pack.capabilities.slice(0, 5).map(cap => (
                  <div key={cap} className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-accent shrink-0" />
                    <span className="text-xs text-muted-foreground">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="glass-card p-4 mb-6 !bg-secondary/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{pack.name}</span>
                <span className="text-sm font-bold text-foreground">${pack.monthlyPrice}/mo</span>
              </div>
              <div className="border-t border-border pt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">New Monthly Total</span>
                <span className="text-sm font-bold text-primary">${newTotal}/mo</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Immediate activation. Billed monthly.</p>
            </div>

            {!canActivate && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 mb-4">
                <p className="text-xs text-destructive">Executive Bundle must be active before adding this pack.</p>
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={!canActivate || confirming}
              className="w-full btn-primary px-6 py-3.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {confirming ? "Activating..." : `Activate — $${pack.monthlyPrice}/mo`}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;
