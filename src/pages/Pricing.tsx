import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import PublicNav from "@/components/PublicNav";
import Footer from "@/components/Footer";
import { plans, faqs } from "@/config/plans";
import { persistPlan } from "@/lib/checkoutMachine";

const Pricing = () => {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Simple, transparent pricing
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose your plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Start free for 14 days. No credit card required.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 rounded-2xl bg-secondary/40 border border-border p-1.5">
              <button
                onClick={() => setYearly(false)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  !yearly
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  yearly
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <span className="ml-1.5 text-[10px] font-bold text-success">-20%</span>
              </button>
            </div>
          </motion.div>

          {/* Plan cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-28">
            {plans.map((plan, i) => {
              const isPopular = plan.badge === "Most popular";
              const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
              const isEnterprise = plan.id === "enterprise";

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className={`relative flex flex-col rounded-2xl p-8 ${
                    isPopular
                      ? "glass-bento ring-1 ring-primary/25"
                      : "glass-card"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute top-4 right-4">
                      <span className="text-[10px] font-bold px-3 py-1.5 rounded-2xl uppercase tracking-wider bg-primary/15 text-primary">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <h2 className="text-lg font-bold text-foreground mb-1">{plan.name}</h2>
                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    {isEnterprise ? (
                      <span className="text-3xl font-bold text-foreground">Custom</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-foreground">${price}</span>
                        <span className="text-sm text-muted-foreground ml-1">
                          /mo{yearly ? " billed yearly" : ""}
                        </span>
                      </>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5">
                        {f.included ? (
                          <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-sm ${
                            f.included ? "text-foreground" : "text-muted-foreground/40"
                          }`}
                        >
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/checkout?plan=${plan.id}`}
                    onClick={() => persistPlan(plan.id)}
                    className={`w-full py-3.5 rounded-2xl text-sm font-medium transition-all active:scale-[0.99] text-center block ${
                      plan.ctaVariant === "primary"
                        ? "btn-primary"
                        : "border border-border hover:bg-secondary text-foreground"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-10">
              Frequently asked questions
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium text-foreground">{faq.question}</span>
                    {openFaq === i ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
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
