import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowRight, Check, Crown, Zap, Rocket, Shield, Lock, Eye, Sparkles,
  Play,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { executives, agents } from "@/data/experts";
import { tiers, addonPacks } from "@/data/packs";
import { usePacks } from "@/contexts/PackContext";
import UpgradeModal from "@/components/UpgradeModal";
import AgentCard from "@/components/marketplace/AgentCard";

const tierIcons = [Crown, Zap, Rocket];

const Marketplace = () => {
  const { currentTierId, isAddonActive, activateTier, activateAddon, isAgentUnlocked } = usePacks();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [demoRunsLeft] = useState(2);

  return (
    <AppLayout>
      <div className="min-h-screen relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(30,107,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">

          {/* ─── HERO ─── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-center mb-16 pt-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 text-[11px] font-semibold text-primary bg-primary/5 border border-primary/10 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Sürekli Gelişen İş Zekâsı
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Kurumsal AI İstihbarat Ajanları
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Rol eğitilmiş, sürekli güncellenen uzman zekalar. Her ajan belirli bir departman fonksiyonu için yapılandırılmıştır.
            </p>

            <div className="flex items-center justify-center gap-4">
              <a href="#agent-grid" className="btn-primary px-8 py-3 text-sm flex items-center gap-2">
                Tüm Ajanları Keşfet <ArrowRight className="h-4 w-4" />
              </a>
              <button onClick={() => toast.info("Demo modu başlatılıyor.")} className="px-8 py-3 text-sm font-medium rounded-2xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center gap-2">
                <Play className="h-4 w-4" /> Demo Modu Başlat
              </button>
            </div>
          </motion.div>

          {/* ─── DEMO MODE BADGE ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-warning/5 border border-warning/20 text-warning text-xs font-medium">
              <Eye className="h-4 w-4" />
              Demo Veri Modu — Günlük {demoRunsLeft} demo hakkınız kaldı
              <Lock className="h-3.5 w-3.5 opacity-60" />
            </div>
          </motion.div>

          {/* ─── AGENT GRID ─── */}
          <div id="agent-grid" className="mb-20">
            {/* C-Level */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">C-Level</span>
                Yönetici İstihbarat Katmanları
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-14">
              {executives.map((agent, i) => (
                <AgentCard key={agent.id} agent={agent} index={i} />
              ))}
            </div>

            {/* Specialist Agents */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent/10 text-accent">Uzman</span>
                Departman İstihbarat Ajanları
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {agents.map((agent, i) => (
                <AgentCard key={agent.id} agent={agent} index={i} />
              ))}
            </div>
          </div>

          {/* ─── SUBSCRIPTION PLANS ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center gap-2 mb-8">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Abonelik Planları</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {tiers.map((tier, i) => {
                const Icon = tierIcons[i];
                const isActive = tier.id === currentTierId;
                const isRecommended = tier.badge === "Önerilen";
                const tierIndex = tiers.findIndex(t => t.id === tier.id);
                const currentIndex = tiers.findIndex(t => t.id === currentTierId);
                const isDowngrade = tierIndex < currentIndex;

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative glass-card p-6 flex flex-col transition-all duration-300 ${
                      isRecommended ? "ring-1 ring-primary/40 shadow-[0_0_40px_rgba(30,107,255,0.08)]" : ""
                    } ${isActive ? "ring-1 ring-primary/30" : ""}`}
                  >
                    {isRecommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        Önerilen
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${isActive ? "bg-primary/10" : "bg-secondary"}`}>
                        <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{tier.name}</h3>
                        <p className="text-[10px] text-muted-foreground">{tier.tagline}</p>
                      </div>
                    </div>

                    {/* Departments */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tier.departments.map(d => (
                        <span key={d} className="text-[10px] px-2 py-0.5 rounded-lg bg-secondary text-foreground">{d}</span>
                      ))}
                    </div>

                    {/* Agents */}
                    <div className="space-y-1.5 mb-3">
                      {tier.agents.map(a => (
                        <div key={a.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="h-4 w-4 rounded-md bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary shrink-0">
                            {a.name[0]}
                          </div>
                          {a.role}
                        </div>
                      ))}
                    </div>

                    {/* Reports & Features summary */}
                    <div className="space-y-1 mb-4 flex-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Dahil Özellikler</p>
                      {tier.features.slice(0, 4).map(f => (
                        <div key={f} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-success shrink-0" />
                          <span className="text-[11px] text-muted-foreground">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Simulation access */}
                    <div className="text-[10px] text-muted-foreground mb-4 px-2 py-1.5 rounded-lg bg-secondary/50">
                      AI İşlem: <span className="text-foreground font-medium">{tier.aiProcessing}</span> · Ekip: <span className="text-foreground font-medium">{tier.teamMembers}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <div>
                        <span className="text-2xl font-bold text-foreground">${tier.monthlyPrice}</span>
                        <span className="text-xs text-muted-foreground">/ay</span>
                      </div>
                      {isActive ? (
                        <span className="text-xs font-medium text-primary flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5" /> Aktif Plan
                        </span>
                      ) : isDowngrade ? (
                        <span className="text-xs text-muted-foreground">Dahil</span>
                      ) : (
                        <button
                          onClick={() => activateTier(tier.id)}
                          className="btn-primary px-5 py-2.5 text-xs flex items-center gap-1.5"
                        >
                          Yükselt <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ─── ADD-ON PACKAGES ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-8">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">İsteğe Bağlı Ek Paketler</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {addonPacks.map((pack, i) => {
                const active = isAddonActive(pack.id);
                return (
                  <motion.div
                    key={pack.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`glass-card p-6 flex flex-col transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_30px_rgba(30,107,255,0.06)] ${
                      active ? "ring-1 ring-primary/30" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">{pack.name}</h3>
                          <p className="text-[10px] text-muted-foreground">{pack.tagline}</p>
                        </div>
                      </div>
                      {active && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-2xl bg-success/10 text-success border border-success/20">Aktif</span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">{pack.description}</p>

                    {/* Agents in pack */}
                    <div className="space-y-1.5 mb-3">
                      {pack.agents.map(a => (
                        <div key={a.id} className="flex items-center gap-2 text-xs">
                          <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
                            {a.name[0]}
                          </div>
                          <span className="text-foreground">{a.role}</span>
                        </div>
                      ))}
                    </div>

                    {/* Capabilities */}
                    <div className="space-y-1 mb-4 flex-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Yetenekler</p>
                      {pack.capabilities.slice(0, 4).map(cap => (
                        <div key={cap} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-success shrink-0" />
                          <span className="text-[11px] text-muted-foreground">{cap}</span>
                        </div>
                      ))}
                    </div>

                    {/* Simulation unlock note */}
                    <div className="text-[10px] text-muted-foreground mb-4 px-2 py-1.5 rounded-lg bg-secondary/50">
                      Simülasyon: <span className="text-foreground font-medium">Departman Senaryoları Açık</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <div>
                        <span className="text-lg font-bold text-foreground">${pack.monthlyPrice}</span>
                        <span className="text-xs text-muted-foreground">/ay</span>
                      </div>
                      {active ? (
                        <span className="text-xs font-medium text-success flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5" /> Aktif
                        </span>
                      ) : (
                        <button
                          onClick={() => activateAddon(pack.id)}
                          className="btn-primary px-5 py-2.5 text-xs flex items-center gap-1.5"
                        >
                          Plana Ekle <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </AppLayout>
  );
};

export default Marketplace;
