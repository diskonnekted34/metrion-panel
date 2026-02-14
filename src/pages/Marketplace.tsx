import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Check, Crown, Zap, Rocket, Lock, ArrowRight, Shield } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { tiers, addonPacks, Pack } from "@/data/packs";
import { usePacks } from "@/contexts/PackContext";
import UpgradeModal from "@/components/UpgradeModal";

const tierIcons = [Crown, Zap, Rocket];

const Marketplace = () => {
  const { currentTierId, activeTier, isAddonActive, activateTier, activateAddon } = usePacks();
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-2xl font-bold text-foreground mb-1">Expand Your AI Workforce</h1>
          <p className="text-sm text-muted-foreground">Upgrade your tier or activate add-on packs for specialized capabilities.</p>
        </motion.div>

        {/* TIERS */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Subscription Tiers</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {tiers.map((tier, i) => {
              const Icon = tierIcons[i];
              const isActive = tier.id === currentTierId;
              const tierIndex = tiers.findIndex(t => t.id === tier.id);
              const currentIndex = tiers.findIndex(t => t.id === currentTierId);
              const isDowngrade = tierIndex < currentIndex;

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={`glass-card p-6 flex flex-col ${isActive ? "ring-1 ring-primary/30" : ""}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${isActive ? "bg-primary/10" : "bg-secondary"}`}>
                        <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{tier.name}</h3>
                        <p className="text-[10px] text-muted-foreground">{tier.tagline}</p>
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-2xl bg-primary/15 text-primary">Current</span>
                    )}
                    {tier.badge && !isActive && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-2xl bg-accent/15 text-accent">{tier.badge}</span>
                    )}
                  </div>

                  <div className="space-y-1 mb-4">
                    {tier.agents.slice(0, 4).map(a => (
                      <p key={a.id} className="text-xs text-muted-foreground">• {a.role}</p>
                    ))}
                    {tier.agents.length > 4 && (
                      <p className="text-[10px] text-muted-foreground">+{tier.agents.length - 4} more agents</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <div>
                      <span className="text-xl font-bold text-foreground">${tier.monthlyPrice}</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                    {isActive ? (
                      <span className="text-xs font-medium text-primary flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" /> Active
                      </span>
                    ) : isDowngrade ? (
                      <span className="text-xs text-muted-foreground">Included</span>
                    ) : (
                      <button
                        onClick={() => activateTier(tier.id)}
                        className="btn-primary px-5 py-2.5 text-xs flex items-center gap-1.5"
                      >
                        Upgrade <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ADD-ON PACKS */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Optional Add-on Packs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {addonPacks.map((pack, i) => {
              const active = isAddonActive(pack.id);
              return (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                >
                  <div className={`glass-card p-6 h-full flex flex-col ${active ? "ring-1 ring-accent/30" : ""}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-accent/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">{pack.name}</h3>
                          <p className="text-[10px] text-muted-foreground">{pack.tagline}</p>
                        </div>
                      </div>
                      {active && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-2xl bg-success/15 text-success">Active</span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">{pack.description}</p>

                    <div className="space-y-1.5 mb-4">
                      {pack.agents.map(agent => (
                        <div key={agent.id} className="flex items-center gap-2 text-xs">
                          <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
                            {agent.name[0]}
                          </div>
                          <span className="text-foreground">{agent.role}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 mb-4 flex-1">
                      {pack.capabilities.slice(0, 3).map(cap => (
                        <div key={cap} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-accent shrink-0" />
                          <span className="text-[11px] text-muted-foreground">{cap}</span>
                        </div>
                      ))}
                      {pack.capabilities.length > 3 && (
                        <p className="text-[10px] text-muted-foreground ml-5">+{pack.capabilities.length - 3} more</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-lg font-bold text-foreground">${pack.monthlyPrice}</span>
                        <span className="text-xs text-muted-foreground">/mo</span>
                      </div>
                      {active ? (
                        <span className="text-xs font-medium text-success flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5" /> Active
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedPack(pack)}
                          className="btn-primary px-5 py-2.5 text-xs flex items-center gap-1.5"
                        >
                          Add Pack <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <UpgradeModal
        pack={selectedPack}
        open={!!selectedPack}
        onClose={() => setSelectedPack(null)}
      />
    </AppLayout>
  );
};

export default Marketplace;
