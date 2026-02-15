import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Crown, Zap, Rocket, ArrowRight, Package, ChevronDown, ChevronUp, Cpu, Shield, Users, Layers, Database } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { tiers, addonPacks, creditPacks, comparisonData } from "@/data/packs";

const tierIcons = [Crown, Zap, Rocket];

const faqs = [
  { q: "Departmanlar özelleştirilebilir mi?", a: "Hayır. Departmanlar sabit bir yapıdır ve planınıza göre otomatik olarak açılır. Bu, kurumsal düzeyde tutarlılık ve güvenlik sağlar." },
  { q: "Ücretsiz plan var mı?", a: "Hayır. Tüm planlarda tam erişimli 30 günlük ücretsiz deneme mevcuttur." },
  { q: "Fair use ne anlama geliyor?", a: "Tüm planlar sınırsız AI desteği içerir. Ağır hesaplama gerektiren işlemler AI İşlem Kredileri kullanır." },
  { q: "AI İşlem Kredileri nerelerde kullanılır?", a: "Yalnızca gelişmiş tahminleme, büyük veri analizi ve toplu işlem gibi yoğun hesaplama görevlerinde." },
  { q: "Planımın üzerine paket ekleyebilir miyim?", a: "Evet. İsteğe bağlı ek paketler (Kreatif, Pazaryeri, Gelişmiş Muhasebe) herhangi bir plana eklenebilir." },
  { q: "İstediğim zaman iptal edebilir miyim?", a: "Evet. Uzun vadeli sözleşme yoktur." },
];

const comparisonCategories = [...new Set(comparisonData.map(r => r.category))];

const CellValue = ({ value }: { value: string | boolean }) => {
  if (value === true) return <Check className="h-4 w-4 text-success mx-auto" />;
  if (value === false) return <X className="h-3.5 w-3.5 text-muted-foreground/30 mx-auto" />;
  return <span className="text-xs text-foreground">{value}</span>;
};

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">AI Workforce Operating System</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Departmanlarınızı Açın</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Her plan, sabit departmanları ve bunlara ait AI ajanlarını, veri kaynaklarını ve onay modellerini açar.
            </p>
          </motion.div>

          {/* ── TIER CARDS ── */}
          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {tiers.map((tier, i) => {
              const Icon = tierIcons[i];
              const isRecommended = tier.badge === "Önerilen";

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className={`relative overflow-hidden text-left flex flex-col ${
                    isRecommended ? "glass-bento p-8 ring-1 ring-primary/25" : "glass-card p-8"
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute top-4 right-4">
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-2xl uppercase tracking-wider ${
                        isRecommended ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent-foreground"
                      }`}>
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-5">
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${
                      isRecommended ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      <Icon className={`h-5 w-5 ${isRecommended ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{tier.name}</h2>
                      <p className="text-[11px] text-muted-foreground">{tier.tagline}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">${tier.monthlyPrice}</span>
                    <span className="text-sm text-muted-foreground ml-1">/ay</span>
                  </div>

                  {/* Departments Unlocked */}
                  <div className="mb-5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="h-3 w-3" /> Açılan Departmanlar
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tier.departments.map(d => (
                        <span key={d} className="text-[10px] px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-medium">{d}</span>
                      ))}
                    </div>
                  </div>

                  {/* Agents */}
                  <div className="mb-5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Users className="h-3 w-3" /> {i === 0 ? "Dahil Ajanlar" : "Kümülatif Ajanlar"}
                    </p>
                    <div className="space-y-1.5">
                      {(i === 0 ? tier.agents : tier.cumulativeAgentIds.map(id => {
                        const allTierAgents = tiers.flatMap(t => t.agents);
                        return allTierAgents.find(a => a.id === id) || { id, role: id, name: id };
                      })).map(agent => (
                        <div key={agent.id} className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
                            {agent.name[0]}
                          </div>
                          <span className="text-xs text-foreground">{agent.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data & Action Sources */}
                  <div className="mb-5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Database className="h-3 w-3" /> Veri & Aksiyon Kaynakları
                    </p>
                    <div className="space-y-1">
                      {tier.integrations.map(int => (
                        <p key={int.name} className="text-xs text-muted-foreground">
                          • {int.name}{int.note ? ` (${int.note})` : ""}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Key features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.features.slice(0, 6).map(f => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Summary row */}
                  <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                    <div className="bg-secondary/40 rounded-xl p-2">
                      <p className="text-xs font-bold text-foreground">{tier.teamMembers}</p>
                      <p className="text-[9px] text-muted-foreground">Ekip</p>
                    </div>
                    <div className="bg-secondary/40 rounded-xl p-2">
                      <p className="text-[10px] font-bold text-foreground">{tier.aiProcessing}</p>
                      <p className="text-[9px] text-muted-foreground">AI İşlem</p>
                    </div>
                    <div className="bg-secondary/40 rounded-xl p-2">
                      <p className="text-[10px] font-bold text-foreground">{tier.approvalModel.split(" ")[0]}</p>
                      <p className="text-[9px] text-muted-foreground">Onay</p>
                    </div>
                  </div>

                  <button className={`w-full py-3.5 rounded-2xl text-sm font-medium transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
                    isRecommended
                      ? "btn-primary"
                      : "border border-border hover:bg-secondary text-foreground"
                  }`}>
                    30 Gün Ücretsiz Dene <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="text-[10px] text-muted-foreground text-center mt-3">Kart gerekli. İstediğiniz zaman iptal edin.</p>
                </motion.div>
              );
            })}
          </div>

          {/* ── COMPARISON GRID ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-24">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-2">Detaylı Plan Karşılaştırması</h2>
              <p className="text-sm text-muted-foreground">Departmanlar, ajanlar, veri kaynakları ve özellikler arası tam karşılaştırma.</p>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-xs font-semibold text-muted-foreground w-[40%]">Özellik</th>
                      <th className="p-4 text-xs font-semibold text-foreground text-center">Core<br/><span className="text-muted-foreground font-normal">$349/ay</span></th>
                      <th className="p-4 text-xs font-semibold text-primary text-center">Performance<br/><span className="text-muted-foreground font-normal">$599/ay</span></th>
                      <th className="p-4 text-xs font-semibold text-foreground text-center">Workforce<br/><span className="text-muted-foreground font-normal">$899/ay</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonCategories.map(cat => (
                      <>
                        <tr key={`cat-${cat}`}>
                          <td colSpan={4} className="px-4 pt-5 pb-2">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{cat}</span>
                          </td>
                        </tr>
                        {comparisonData.filter(r => r.category === cat).map((row, ri) => (
                          <tr key={`${cat}-${ri}`} className="border-t border-border/50 hover:bg-secondary/20 transition-colors">
                            <td className="px-4 py-3 text-xs text-muted-foreground">{row.label}</td>
                            <td className="px-4 py-3 text-center"><CellValue value={row.core} /></td>
                            <td className="px-4 py-3 text-center bg-primary/[0.02]"><CellValue value={row.performance} /></td>
                            <td className="px-4 py-3 text-center"><CellValue value={row.workforce} /></td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* ── ADD-ON PACKS ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-24">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">İsteğe Bağlı Ek Paketler</h2>
              </div>
              <p className="text-sm text-muted-foreground">Herhangi bir plana departman ve ajan kapasitesi ekleyin.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {addonPacks.map((pack, i) => (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{pack.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{pack.tagline}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">{pack.description}</p>

                  <div className="space-y-1 mb-4">
                    {pack.agents.map(a => (
                      <p key={a.id} className="text-xs text-muted-foreground">• {a.role}</p>
                    ))}
                  </div>

                  <div className="space-y-1 mb-4">
                    {pack.capabilities.slice(0, 3).map(cap => (
                      <div key={cap} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-success shrink-0" />
                        <span className="text-[11px] text-muted-foreground">{cap}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-lg font-bold text-foreground">${pack.monthlyPrice}</span>
                      <span className="text-xs text-muted-foreground">/ay</span>
                    </div>
                    <Link to="/marketplace" className="text-xs text-primary hover:text-primary/80 transition-colors">
                      Detaylar →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── AI PROCESSING CREDITS ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-24">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Cpu className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">AI İşlem Kredileri</h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Tüm planlar sınırsız AI desteği içerir (fair use). Yoğun hesaplama gerektiren görevler için ek kapasite.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {creditPacks.map((cp, i) => (
                <motion.div
                  key={cp.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="glass-card p-6 text-center"
                >
                  <h3 className="text-sm font-bold text-foreground mb-1">{cp.name}</h3>
                  <p className="text-[11px] text-muted-foreground mb-4">{cp.description}</p>
                  <p className="text-2xl font-bold text-foreground mb-4">${cp.price}</p>
                  <button className="w-full py-2.5 rounded-xl text-xs font-medium border border-border hover:bg-secondary text-foreground transition-all">
                    Satın Al
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary/40 border border-border">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] text-muted-foreground">
                  Otomatik İşlem Yüklemesi (Auto Top-Up) — Ayarlar'dan yalnızca Sahip rolü aktifleştirebilir.
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── FAQ ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-foreground text-center mb-8">Sıkça Sorulan Sorular</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium text-foreground">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    }
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
