import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Zap, Rocket, ArrowRight, Package, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { tiers, addonPacks } from "@/data/packs";

const tierIcons = [Crown, Zap, Rocket];

const faqs = [
  { q: "Is there a free plan?", a: "No. All plans include a 30-day free trial with full access. No free-forever plan." },
  { q: "Do I need to book a demo?", a: "No. The platform is fully self-serve. You can optionally book a strategy call from your dashboard." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from Settings > Subscription at any time. No long-term contracts." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted at rest and in transit. Enterprise-grade security standards." },
  { q: "Can I add packs on top of my tier?", a: "Yes. Optional expansion packs can be activated on any tier for additional capabilities." },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Choose Your Plan</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              AI Management Operating System. 30-day free trial on all plans. No demo required.
            </p>
          </motion.div>

          {/* Tier Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {tiers.map((tier, i) => {
              const Icon = tierIcons[i];
              const isPopular = tier.badge === "Most Popular";
              const isBest = tier.badge === "Best Value";

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className={`relative overflow-hidden text-left flex flex-col ${
                    isPopular ? "glass-bento p-8" : "glass-card p-8"
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute top-4 right-4">
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-2xl uppercase tracking-wider ${
                        isPopular ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                      }`}>
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${
                      isPopular ? "bg-primary/10" : isBest ? "bg-accent/10" : "bg-secondary"
                    }`}>
                      <Icon className={`h-5 w-5 ${isPopular ? "text-primary" : isBest ? "text-accent" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{tier.name}</h2>
                      <p className="text-[11px] text-muted-foreground">{tier.tagline}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">${tier.monthlyPrice}</span>
                    <span className="text-sm text-muted-foreground ml-1">/mo</span>
                  </div>

                  {/* Included agents */}
                  <div className="mb-5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {i === 0 ? "Included Agents" : i === 1 ? "Everything in Core +" : "Everything in Performance +"}
                    </p>
                    <div className="space-y-1.5">
                      {tier.agents.map(agent => (
                        <div key={agent.id} className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
                            {agent.name[0]}
                          </div>
                          <span className="text-xs text-foreground">{agent.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Capabilities */}
                  <ul className="space-y-2 mb-8 flex-1">
                    {tier.capabilities.map(cap => (
                      <li key={cap} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground">{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3.5 rounded-2xl text-sm font-medium transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
                    isPopular
                      ? "btn-primary"
                      : "border border-border hover:bg-secondary text-foreground"
                  }`}>
                    Start 30-Day Trial <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="text-[10px] text-muted-foreground text-center mt-3">Card required. Cancel anytime.</p>
                </motion.div>
              );
            })}
          </div>

          {/* Add-on Packs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-20">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Optional Expansion Packs</h2>
              </div>
              <p className="text-sm text-muted-foreground">Activate on top of any tier for additional capabilities.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {addonPacks.map((pack, i) => (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Package className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{pack.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{pack.tagline}</p>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    {pack.agents.map(a => (
                      <p key={a.id} className="text-xs text-muted-foreground">• {a.role}</p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <span className="text-lg font-bold text-foreground">${pack.monthlyPrice}</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                    <Link to="/marketplace" className="text-xs text-primary hover:text-primary/80 transition-colors">
                      Learn More →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h2>
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
