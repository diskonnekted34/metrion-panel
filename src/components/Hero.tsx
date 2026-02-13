import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { experts } from "@/data/experts";
import { useLanguage } from "@/i18n/LanguageContext";

const cardPositions = [
  { top: "5%", right: "5%", className: "float-animation" },
  { top: "25%", right: "35%", className: "float-animation-delayed" },
  { top: "50%", right: "8%", className: "float-animation-delayed-2" },
  { top: "15%", right: "55%", className: "float-animation" },
  { top: "65%", right: "40%", className: "float-animation-delayed" },
];

// SVG lines connecting the cards (center-to-center approximate)
const connectionLines = [
  { x1: "88%", y1: "12%", x2: "58%", y2: "32%" },
  { x1: "58%", y1: "32%", x2: "85%", y2: "57%" },
  { x1: "85%", y1: "57%", x2: "53%", y2: "72%" },
  { x1: "53%", y1: "72%", x2: "38%", y2: "22%" },
  { x1: "38%", y1: "22%", x2: "88%", y2: "12%" },
  { x1: "58%", y1: "32%", x2: "53%", y2: "72%" },
  { x1: "38%", y1: "22%", x2: "85%", y2: "57%" },
];

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden pt-16">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/3 blur-3xl" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-lg glass px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {t.hero.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
            >
              {t.hero.title1}{" "}
              <span className="gradient-text">{t.hero.title2}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/#experts"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] btn-glow"
              >
                {t.hero.cta1}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-lg glass px-6 py-3 text-sm font-medium text-foreground transition-all hover:shadow-md active:scale-[0.98]">
                {t.hero.cta2}
              </button>
            </motion.div>
          </div>

          {/* Right: 5 floating connected cards */}
          <div className="relative hidden lg:block h-[500px]">
            {/* Connection lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
              {connectionLines.map((line, i) => (
                <motion.line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="hsl(8 76% 47% / 0.2)"
                  strokeWidth="1"
                  strokeDasharray="6 4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                  className="animate-pulse-line"
                />
              ))}
              {/* Dot nodes at intersections */}
              {connectionLines.slice(0, 5).map((line, i) => (
                <motion.circle
                  key={`dot-${i}`}
                  cx={line.x1}
                  cy={line.y1}
                  r="3"
                  fill="hsl(8 76% 47% / 0.5)"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                />
              ))}
            </svg>

            {experts.slice(0, 5).map((expert, i) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
                className={`absolute glass-card p-4 w-56 z-10 ${cardPositions[i].className}`}
                style={{ top: cardPositions[i].top, right: cardPositions[i].right }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <img src={expert.avatar} alt={expert.name} className="h-9 w-9 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{expert.name}</p>
                    <p className="text-[11px] text-muted-foreground">{expert.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary font-medium">★ {expert.rating}</span>
                  <span className="text-xs text-muted-foreground">· {expert.reviews} reviews</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
