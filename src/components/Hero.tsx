import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { experts } from "@/data/experts";

const Hero = () => {
  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden pt-16">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              The Future of Work is Here
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
            >
              Build Your{" "}
              <span className="gradient-text">AI Workforce</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8"
            >
              Hire intelligent AI professionals. Build your own digital team.
              Deploy expertise instantly across legal, finance, marketing, and more.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/#experts"
                className="inline-flex items-center gap-2 rounded-2xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-90 active:scale-[0.98] btn-glow"
              >
                Explore Experts
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-2xl glass px-6 py-3 text-sm font-medium text-foreground transition-all hover:shadow-md active:scale-[0.98]">
                Create Your Assistant
              </button>
            </motion.div>
          </div>

          {/* Right floating cards */}
          <div className="relative hidden lg:block h-[500px]">
            {experts.slice(0, 3).map((expert, i) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                className={`absolute glass-card p-4 w-64 ${
                  i === 0 ? "top-4 right-8 float-animation" :
                  i === 1 ? "top-40 right-40 float-animation-delayed" :
                  "bottom-12 right-12 float-animation"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img src={expert.avatar} alt={expert.name} className="h-10 w-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{expert.name}</p>
                    <p className="text-xs text-muted-foreground">{expert.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary font-medium">★ {expert.rating}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{expert.reviews} reviews</span>
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
