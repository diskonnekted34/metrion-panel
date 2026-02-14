import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const useCountUp = (target: number, duration: number = 2000, trigger: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return count;
};

const StatsCounter = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { value: 24800, suffix: "+", label: "Completed Tasks" },
    { value: 6, suffix: "", label: "Active AI Executives" },
    { value: 2400000, suffix: "", label: "Revenue Impact ($)", prefix: "$", format: true },
    { value: 186, suffix: "h", label: "Hours Saved / Month" },
  ];

  const count1 = useCountUp(24800, 2000, visible);
  const count2 = useCountUp(6, 800, visible);
  const count3 = useCountUp(2.4, 1500, visible);
  const count4 = useCountUp(186, 1500, visible);

  const displayValues = [
    `${count1.toLocaleString()}+`,
    `${count2}`,
    `$${count3.toFixed(1)}M`,
    `${count4}h`,
  ];

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="glass-card p-6 text-center"
            >
              <p className="text-4xl md:text-5xl font-bold text-foreground mb-1 tabular-nums">
                {displayValues[i]}
              </p>
              <div className="w-8 h-[2px] bg-primary/60 mx-auto mb-2 rounded-full" />
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
