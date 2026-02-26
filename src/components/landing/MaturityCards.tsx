import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const tiers = [
  {
    name: "Emerging",
    desc: "For founder-led organizations establishing structured decision clarity.",
  },
  {
    name: "Scaling",
    desc: "For structured teams requiring delegated control and risk oversight.",
  },
  {
    name: "Governed",
    desc: "For organizations operating with policy-driven executive governance.",
  },
];

const MaturityCards = () => {
  return (
    <section className="py-28 md:py-36 px-6">
      <div className="container mx-auto max-w-5xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl font-bold tracking-[-0.02em] text-foreground mb-16"
        >
          Choose your operating maturity.
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-5">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="landing-glass-card rounded-2xl p-8 text-left flex flex-col"
            >
              <h3 className="text-xl font-bold text-foreground mb-3">{tier.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">{tier.desc}</p>
              <Link
                to="/pricing"
                className="landing-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium w-fit"
              >
                See Plans <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MaturityCards;
