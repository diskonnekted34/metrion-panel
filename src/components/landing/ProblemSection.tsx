import { motion } from "framer-motion";
import { Clock, EyeOff, Archive } from "lucide-react";

const cards = [
  { icon: Clock, title: "Approval Delays", text: "Critical decisions slow down when ownership and governance are unclear." },
  { icon: EyeOff, title: "Invisible Risk", text: "Risks remain unquantified until they become operational damage." },
  { icon: Archive, title: "No Institutional Memory", text: "Strategic decisions disappear into documents, chats, and scattered tools." },
];

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const ProblemSection = () => {
  return (
    <section className="py-28 md:py-36 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="text-4xl md:text-6xl font-bold tracking-[-0.02em] text-foreground mb-16 text-center"
        >
          Decisions are expensive.
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="landing-glass-card rounded-2xl p-7"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
