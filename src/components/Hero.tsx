import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { executives } from "@/data/experts";

const cardPositions = [
  { top: "5%", right: "5%", rotate: -2 },
  { top: "22%", right: "42%", rotate: 1.5 },
  { top: "48%", right: "3%", rotate: -1 },
  { top: "10%", right: "62%", rotate: 2 },
  { top: "62%", right: "38%", rotate: -1.5 },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden pt-16">
      {/* Subtle gradient blobs */}
      <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] rounded-full blur-[150px] blob-move pointer-events-none" style={{ background: "rgba(76,141,255,0.05)" }} />
      <div className="absolute bottom-[15%] right-[5%] w-[400px] h-[400px] rounded-full blur-[120px] blob-move-2 pointer-events-none" style={{ background: "rgba(126,242,198,0.03)" }} />
      <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(76,141,255,0.03)" }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-flex items-center gap-2 rounded-2xl glass px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI Workforce Operating System
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08] mb-6"
            >
              Rol Eğitimli{" "}
              <span className="gradient-text">AI İş Gücünüz</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-lg text-muted-foreground leading-relaxed mb-4"
            >
              Her biri belirli bir yönetici fonksiyonu için eğitilmiş, gerçek iş verilerinizi anlayan ve risk kontrolleri içinde çalışan departman bazlı AI ajanları.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-sm text-muted-foreground/70 mb-8 flex items-center gap-2"
            >
              <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
              Sürekli güncellenen yönetici istihbaratı ile rafine edilen ajanlar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <Link
                to="/departments"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 active:scale-[0.98]"
              >
                Departmanları Keşfet
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 rounded-2xl glass px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/20 active:scale-[0.98]">
                Planları İncele
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4 text-xs text-muted-foreground/60"
            >
              <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-primary/50" /> Kontrollü Otomasyon</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-primary/50" /> Risk Motoru Koruması</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-primary/50" /> Taslak-Önce Yürütme</span>
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
                  stroke="rgba(76,141,255,0.15)"
                  strokeWidth="1"
                  strokeDasharray="6 4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                  style={{ animation: "pulse-line 3s ease-in-out infinite" }}
                />
              ))}
            </svg>

            {/* Floating OS-style cards */}
            {executives.slice(0, 5).map((exec, i) => (
              <motion.div
                key={exec.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                whileHover={{ scale: 1.04 }}
                className="absolute glass-card p-4 w-52 z-10"
                style={{
                  top: cardPositions[i].top,
                  right: cardPositions[i].right,
                  transform: `rotate(${cardPositions[i].rotate}deg)`,
                  animation: `float 6s ease-in-out ${i * 1.2}s infinite`,
                  boxShadow: "0 0 1px rgba(76,141,255,0.15), 0 4px 24px rgba(0,0,0,0.4)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <img src={exec.avatar} alt={exec.name} className="h-9 w-9 rounded-2xl object-cover ring-1 ring-border" />
                  <div>
                    <p className="text-xs font-bold text-primary">{exec.role}</p>
                    <p className="text-[11px] text-muted-foreground">{exec.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${
                    exec.status === "Monitoring" ? "bg-success/15 text-success" :
                    exec.status === "Alerting" ? "bg-destructive/15 text-destructive" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {exec.status === "Monitoring" ? "İzleniyor" : exec.status === "Alerting" ? "Uyarı" : exec.status === "Running Task" ? "Çalışıyor" : "Boşta"}
                  </span>
                  <span className="text-[9px] text-muted-foreground/50">Rol Eğitimli</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
