import { motion } from "framer-motion";

const integrations = [
  "Shopify", "Meta Ads", "Google Ads", "GitHub", "AWS", "Datadog", "CRM Systems",
];

const IntegrationsGrid = () => {
  return (
    <section className="py-28 md:py-36 px-6 border-t border-white/[0.06]">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-foreground mb-14"
        >
          Connect your operational reality.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {integrations.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
              className="landing-glass-card rounded-xl px-6 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {name}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default IntegrationsGrid;
