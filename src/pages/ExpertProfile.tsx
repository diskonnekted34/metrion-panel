import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowLeft, CheckCircle2, Users, Zap, Shield } from "lucide-react";
import { experts } from "@/data/experts";
import { useLanguage } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ExpertProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const expert = experts.find((e) => e.id === id);

  if (!expert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t.expertProfile.notFound}</h1>
          <Link to="/" className="text-primary hover:underline">{t.expertProfile.back}</Link>
        </div>
      </div>
    );
  }

  const badgeColors: Record<string, string> = {
    Elite: "bg-primary/15 text-primary",
    Pro: "bg-secondary text-secondary-foreground",
    Certified: "bg-muted text-muted-foreground",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> {t.expertProfile.back}
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <img
                src={expert.avatar}
                alt={expert.name}
                className="h-28 w-28 rounded-2xl object-cover ring-4 ring-border/40 shadow-lg"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{expert.name}</h1>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-md ${badgeColors[expert.badge]}`}>
                    {expert.badge}
                  </span>
                </div>
                <p className="text-lg text-muted-foreground mb-4">{expert.tagline}</p>

                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    <span className="font-semibold text-foreground">{expert.rating}</span>
                    <span className="text-sm text-muted-foreground">({expert.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    {expert.tasksCompleted.toLocaleString()} {t.expertProfile.tasksCompleted}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {expert.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground">{tag}</span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] btn-glow">
                    {t.expertProfile.hireAssistant}
                  </button>
                  <button className="rounded-lg glass px-6 py-3 text-sm font-medium text-foreground transition-all hover:shadow-md active:scale-[0.98]">
                    {t.expertProfile.addToTeam}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">{t.expertProfile.about}</h2>
                <p className="text-muted-foreground leading-relaxed">{expert.about}</p>
              </motion.div>

              {/* Capabilities */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">{t.expertProfile.capabilities}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {expert.capabilities.map((cap) => (
                    <div key={cap} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm text-muted-foreground">{cap}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Skills */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">{t.expertProfile.skills}</h2>
                <div className="space-y-4">
                  {expert.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-foreground font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2 rounded-md bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full rounded-md bg-gradient-to-r from-primary to-primary/60"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Reviews */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">{t.expertProfile.reviews}</h2>
                <div className="space-y-4">
                  {expert.userReviews.map((review, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
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
                <h3 className="text-lg font-semibold text-foreground mb-4">{t.expertProfile.pricing}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{t.expertProfile.perTask}</span>
                    <span className="text-sm font-semibold text-foreground">{expert.pricing.credits}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{t.expertProfile.subscription}</span>
                    <span className="text-sm font-semibold text-foreground">{expert.pricing.subscription}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-muted-foreground">{t.expertProfile.enterprise}</span>
                    <span className="text-sm font-semibold text-foreground">{expert.pricing.enterprise}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t.expertProfile.industries}</h3>
                <div className="flex flex-wrap gap-2">
                  {expert.industries.map((ind) => (
                    <span key={ind} className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground">{ind}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t.expertProfile.tools}</h3>
                <div className="flex flex-wrap gap-2">
                  {expert.tools.map((tool) => (
                    <span key={tool} className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium">{tool}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">{t.expertProfile.trust}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.expertProfile.trustDesc}</p>
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
