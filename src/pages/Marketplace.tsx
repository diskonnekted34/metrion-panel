import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Check, Crown, Zap, Lock, ArrowRight, Shield } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { corePack, addonPacks, Pack } from "@/data/packs";
import { usePacks } from "@/contexts/PackContext";
import UpgradeModal from "@/components/UpgradeModal";

const Marketplace = () => {
  const { isPackActive, isCorActive } = usePacks();
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-2xl font-bold text-foreground mb-1">Expand Your AI Workforce</h1>
          <p className="text-sm text-muted-foreground">Activate packs to unlock specialized AI agents across departments.</p>
        </motion.div>

        {/* CORE BUNDLE */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Core Bundle</h2>
          </div>

          <div className="glass-bento p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              {isPackActive(corePack.id) ? (
                <span className="text-[10px] font-bold px-3 py-1.5 rounded-2xl bg-success/15 text-success uppercase tracking-wider">Active</span>
              ) : (
                <span className="text-[10px] font-bold px-3 py-1.5 rounded-2xl bg-primary/15 text-primary uppercase tracking-wider">Required</span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{corePack.name}</h3>
                <p className="text-xs text-muted-foreground">{corePack.tagline}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">{corePack.description}</p>

            {/* Agents Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {corePack.agents.map(agent => (
                <div key={agent.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {agent.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{agent.role}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{agent.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Capabilities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
              {corePack.capabilities.map(cap => (
                <div key={cap} className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-accent shrink-0" />
                  <span className="text-xs text-muted-foreground">{cap}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-foreground">${corePack.monthlyPrice}</span>
                <span className="text-sm text-muted-foreground ml-1">/mo</span>
              </div>
              {isPackActive(corePack.id) ? (
                <span className="text-sm font-medium text-success flex items-center gap-2">
                  <Check className="h-4 w-4" /> Active
                </span>
              ) : (
                <button
                  onClick={() => setSelectedPack(corePack)}
                  className="btn-primary px-6 py-3 text-sm flex items-center gap-2"
                >
                  Activate Bundle <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ADD-ON PACKS */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Add-on Packs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addonPacks.map((pack, i) => {
              const active = isPackActive(pack.id);
              return (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <div className={`glass-card p-6 h-full flex flex-col ${!isCorActive && !active ? "opacity-60" : ""}`}>
                    {/* Header */}
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
                      {active ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-2xl bg-success/15 text-success">Active</span>
                      ) : (
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-2xl bg-secondary text-muted-foreground flex items-center gap-1">
                          <Lock className="h-2.5 w-2.5" /> Requires Core
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-4">{pack.description}</p>

                    {/* Agents */}
                    <div className="space-y-1.5 mb-4">
                      {pack.agents.map(agent => (
                        <div key={agent.id} className="flex items-center gap-2 text-xs">
                          <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                            {agent.name[0]}
                          </div>
                          <span className="text-foreground font-medium">{agent.role}</span>
                          <span className="text-muted-foreground">— {agent.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Capabilities */}
                    <div className="space-y-1 mb-6 flex-1">
                      {pack.capabilities.slice(0, 4).map(cap => (
                        <div key={cap} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-accent shrink-0" />
                          <span className="text-[11px] text-muted-foreground">{cap}</span>
                        </div>
                      ))}
                      {pack.capabilities.length > 4 && (
                        <p className="text-[10px] text-muted-foreground ml-5">+{pack.capabilities.length - 4} more</p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-xl font-bold text-foreground">${pack.monthlyPrice}</span>
                        <span className="text-xs text-muted-foreground ml-1">/mo</span>
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
                          Add to Workspace <ArrowRight className="h-3.5 w-3.5" />
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
