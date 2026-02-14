import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { executives } from "@/data/experts";
import { useLanguage } from "@/i18n/LanguageContext";

const cardPositions = [
  { top: "5%", right: "5%", rotate: -2 },
  { top: "22%", right: "42%", rotate: 1.5 },
  { top: "48%", right: "3%", rotate: -1 },
  { top: "10%", right: "62%", rotate: 2 },
  { top: "62%", right: "38%", rotate: -1.5 },
];

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden pt-16">
      {/* Animated gradient blobs */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-mint-200/30 to-mint-400/20 blur-[120px] blob-move pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-mint-300/25 to-mint-200/15 blur-[100px] blob-move-2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-mint-400" />
              {t.hero.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08] mb-6"
            >
              {t.hero.title1}{" "}
              <span className="gradient-text">{t.hero.title2}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-lg text-muted-foreground leading-relaxed mb-8"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-[20px] btn-glow px-6 py-3 text-sm font-medium text-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                {t.hero.cta1}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 rounded-[20px] glass px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-border active:scale-[0.98]">
                {t.hero.cta2}
              </Link>
            </motion.div>
          </div>

          <div className="relative hidden lg:block h-[520px]">
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
              {[
                { x1: "90%", y1: "12%", x2: "52%", y2: "29%" },
                { x1: "52%", y1: "29%", x2: "92%", y2: "55%" },
                { x1: "92%", y1: "55%", x2: "55%", y2: "69%" },
                { x1: "55%", y1: "69%", x2: "32%", y2: "17%" },
                { x1: "32%", y1: "17%", x2: "90%", y2: "12%" },
              ].map((line, i) => (
                <motion.line
                  key={i}
                  x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                  stroke="rgba(150, 209, 182, 0.35)"
                  strokeWidth="1"
                  strokeDasharray="6 4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                  style={{ animation: "pulse-line 3s ease-in-out infinite" }}
                />
              ))}
            </svg>

            {/* Floating expert cards */}
            {executives.slice(0, 5).map((exec, i) => (
              <motion.div
                key={exec.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                whileHover={{ scale: 1.04, rotateY: 3, rotateX: -2 }}
                className="absolute glass-card p-4 w-52 z-10"
                style={{
                  top: cardPositions[i].top,
                  right: cardPositions[i].right,
                  transform: `rotate(${cardPositions[i].rotate}deg)`,
                  animation: `float 6s ease-in-out ${i * 1.2}s infinite`,
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <img src={exec.avatar} alt={exec.name} className="h-9 w-9 rounded-[14px] object-cover ring-2 ring-border" />
                  <div>
                    <p className="text-xs font-bold text-foreground">{exec.role}</p>
                    <p className="text-[11px] text-muted-foreground">{exec.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-[10px] ${
                    exec.status === "Monitoring" ? "bg-mint-200/30 text-mint-500" :
                    exec.status === "Alerting" ? "bg-destructive/10 text-destructive" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {exec.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Soft vignette edges */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
