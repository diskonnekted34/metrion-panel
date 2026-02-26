import { motion } from "framer-motion";

const TrustStripV2 = () => {
  return (
    <section className="py-16 px-6 border-y border-white/[0.06]">
      <div className="container mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm text-muted-foreground/50 tracking-wide uppercase mb-10"
        >
          Built for teams that run serious operations.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-10 md:gap-16"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-7 w-24 rounded bg-white/[0.04] border border-white/[0.06]"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustStripV2;
