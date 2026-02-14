import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Users, Zap, Shield, Calendar, Star } from "lucide-react";
import { executives } from "@/data/experts";
import { useLanguage } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ExpertProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const exec = executives.find((e) => e.id === id);

  if (!exec) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t.profile.notFound}</h1>
          <Link to="/marketplace" className="text-primary hover:underline">{t.profile.back}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> {t.profile.back}
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <img src={exec.avatar} alt={exec.name} className="h-28 w-28 rounded-2xl object-cover ring-4 ring-border/40 shadow-lg" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-foreground">{exec.role}</h1>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${
                    exec.badge === "C-Level" ? "bg-primary/10 text-primary" : "bg-accent text-muted-foreground"
                  }`}>{exec.badge}</span>
                </div>
                <p className="text-lg text-muted-foreground mb-1">{exec.name}</p>
                <p className="text-sm text-muted-foreground mb-4">{exec.tagline}</p>

                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">{exec.performanceScore}%</span>
                    <span>{t.profile.performanceScore}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {exec.tasksCompleted.toLocaleString()} {t.profile.tasksCompleted}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    {t.profile.weeklyDelivery}: {exec.weekday} — {exec.weekdayOutput}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/pricing" className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] btn-glow">
                    {t.profile.hireTeam}
                  </Link>
                  <span className="rounded-xl glass px-6 py-3 text-sm font-medium text-muted-foreground">
                    {t.profile.includedIn}
                  </span>
                </div>

                {exec.id === "legal" && (
                  <p className="mt-4 text-xs text-muted-foreground italic flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" /> {t.profile.legalNote}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">{exec.about}</p>
              </motion.div>

              {/* Responsibilities */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">{t.profile.responsibilities}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {exec.responsibilities.map((r) => (
                    <div key={r} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm text-muted-foreground">{r}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Structured Outputs */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">{t.profile.outputs}</h2>
                <div className="space-y-2.5">
                  {exec.outputs.map((o) => (
                    <div key={o} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">{o}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Skills */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">{t.profile.skills}</h2>
                <div className="space-y-4">
                  {exec.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-foreground font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2 rounded-lg bg-accent overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full rounded-lg bg-gradient-to-r from-primary to-primary/60"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Reviews */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">{t.profile.reviews}</h2>
                <div className="space-y-4">
                  {exec.reviews.map((review, i) => (
                    <div key={i} className="p-4 rounded-xl bg-accent/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Users className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{review.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: review.rating }).map((_, j) => (
                          <Star key={j} className="h-3 w-3 text-primary fill-primary" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t.profile.automations}</h3>
                <div className="space-y-2.5">
                  {exec.automations.map((a) => (
                    <div key={a} className="flex items-start gap-2.5">
                      <Zap className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground">{a}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t.profile.kpis}</h3>
                <div className="space-y-2">
                  {exec.kpis.map((kpi) => (
                    <div key={kpi} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {kpi}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t.profile.collaborations}</h3>
                <div className="space-y-2">
                  {exec.collaborations.map((c) => (
                    <div key={c} className="text-xs text-muted-foreground flex items-start gap-2">
                      <Users className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                      {c}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExpertProfile;
