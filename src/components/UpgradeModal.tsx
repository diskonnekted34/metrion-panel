import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Lock, Layers, Users, Database, ArrowRight } from "lucide-react";
import { usePacks } from "@/contexts/PackContext";
import { tiers } from "@/data/packs";
import { departments, type DepartmentId } from "@/contexts/RBACContext";
import { departmentIntegrationMap } from "@/data/packs";

interface UpgradeModalProps {
  departmentId?: DepartmentId;
  open: boolean;
  onClose: () => void;
}

const UpgradeModal = ({ departmentId, open, onClose }: UpgradeModalProps) => {
  const { activateTier, currentTierId, getRequiredTierForDepartment } = usePacks();
  const [confirming, setConfirming] = useState(false);

  const dept = departmentId ? departments.find(d => d.id === departmentId) : null;
  const requiredTier = departmentId ? getRequiredTierForDepartment(departmentId) : null;

  // Find the minimum tier that unlocks this department
  const targetTier = requiredTier || tiers[tiers.length - 1];
  const currentTierIndex = tiers.findIndex(t => t.id === currentTierId);
  const targetTierIndex = tiers.findIndex(t => t.id === targetTier.id);
  const isUpgrade = targetTierIndex > currentTierIndex;

  const _deptAgents = dept ? targetTier.agents.filter(() => true) : [];
  const integrationIds = departmentId ? (departmentIntegrationMap[departmentId] || []) : [];

  const handleUpgrade = () => {
    setConfirming(true);
    setTimeout(() => {
      activateTier(targetTier.id);
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

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                {dept ? (
                  <span className="text-2xl">{dept.icon}</span>
                ) : (
                  <Lock className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {dept ? `${dept.name} Departmanını Aç` : "Planınızı Yükseltin"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {targetTier.name} planına yükselterek erişim sağlayın
                </p>
              </div>
            </div>

            {/* Department description */}
            {dept && (
              <div className="glass-card !bg-secondary/30 p-4 mb-6">
                <p className="text-sm text-muted-foreground">{dept.description}</p>
              </div>
            )}

            {/* Included agents */}
            {dept && (
              <div className="mb-5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Users className="h-3 w-3" /> Dahil Ajanlar
                </p>
                <div className="space-y-2">
                  {dept.agentIds.map(agentId => {
                    const _agentInfo = targetTier.cumulativeAgentIds.includes(agentId);
                    return (
                      <div key={agentId} className="flex items-center gap-2.5 p-2 rounded-xl bg-secondary/40">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                          AI
                        </div>
                        <span className="text-xs text-foreground capitalize">{agentId.replace(/-/g, " ")}</span>
                        <Check className="h-3 w-3 text-success ml-auto" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Data sources */}
            {integrationIds.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Database className="h-3 w-3" /> Veri & Aksiyon Kaynakları
                </p>
                <p className="text-xs text-muted-foreground">
                  {integrationIds.length} entegrasyon bu departmanla birlikte aktifleşir
                </p>
              </div>
            )}

            {/* Plan details */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="h-3 w-3" /> Plan Detayları
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-secondary/40 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{targetTier.teamMembers}</p>
                  <p className="text-[10px] text-muted-foreground">Ekip Üyesi</p>
                </div>
                <div className="bg-secondary/40 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-foreground">{targetTier.approvalModel}</p>
                  <p className="text-[10px] text-muted-foreground">Onay Modeli</p>
                </div>
                <div className="bg-secondary/40 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-foreground">{targetTier.aiProcessing}</p>
                  <p className="text-[10px] text-muted-foreground">AI İşlem</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="glass-card !bg-secondary/30 p-4 mb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">{targetTier.name} Plan</span>
                <span className="text-sm font-bold text-foreground">${targetTier.monthlyPrice}/ay</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Anında aktifleştirilir. Aylık faturalandırılır.</p>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={!isUpgrade || confirming}
              className="w-full btn-primary px-6 py-3.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {confirming ? "Yükseltiliyor..." : (
                <>
                  {targetTier.name} Planına Yükselt <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;
