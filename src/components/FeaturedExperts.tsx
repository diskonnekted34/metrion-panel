import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { executives, agents } from "@/data/experts";

const FeaturedExperts = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="experts" className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center mb-4"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Departman Bazlı AI İş Gücü</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Rol Eğitimli AI Ajanları</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Her ajan belirli bir yönetici fonksiyonu için eğitilmiştir. Planınız departmanları açtıkça ajanlar otomatik aktifleşir.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium text-primary/80 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
            <Zap className="h-3.5 w-3.5" />
            Sürekli güncellenen yönetici istihbaratı ile rafine edilen ajanlar
          </span>
        </motion.div>

        {/* C-Level Executives */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-2xl bg-primary/10 text-primary">Departman Liderleri</span>
            Yönetici Kadro
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {executives.map((exec, i) => (
            <motion.div
              key={exec.id}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              onMouseEnter={() => setHoveredId(exec.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link to={`/expert/${exec.id}`} className="block glass-card p-6 h-full group">
                <div className="flex items-start gap-4 mb-4">
                  <img src={exec.avatar} alt={exec.name} className="h-14 w-14 rounded-2xl object-cover ring-1 ring-border" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-primary text-sm">{exec.role}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{exec.name}</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">Rol Eğitimli · Sürekli Güncellenen</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{exec.tagline}</p>

                {exec.capabilities && (
                  <div className="space-y-1.5 mb-4">
                    {exec.capabilities.slice(0, 3).map((cap) => (
                      <div key={cap} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground">{cap}</span>
                      </div>
                    ))}
                  </div>
                )}

                {!exec.capabilities && (
                  <div className="space-y-1.5 mb-4">
                    {exec.outputs.slice(0, 2).map((output) => (
                      <div key={output} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground">{output}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{exec.performanceScore}%</span>
                    <span className="text-xs text-muted-foreground">performans</span>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-2xl bg-accent/10 text-accent">
                    {exec.kpis[0]}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Konsolu Aç <ArrowRight className="h-3.5 w-3.5" />
                </div>

                {exec.id === "legal" && (
                  <p className="mt-3 text-[10px] text-muted-foreground italic">Yalnızca karar destek analizi. Resmi hukuki temsil değildir.</p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Standard-tier Agents */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-2xl bg-accent/10 text-accent">Uzman Ajanlar</span>
            Departman İş Gücü
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              onMouseEnter={() => setHoveredId(agent.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link to={`/expert/${agent.id}`} className="block glass-card p-6 h-full group">
                <div className="flex items-start gap-4 mb-4">
                  <img src={agent.avatar} alt={agent.name} className="h-14 w-14 rounded-2xl object-cover ring-1 ring-border" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-foreground text-sm">{agent.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{agent.role}</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">Rol Eğitimli · Sürekli Güncellenen</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{agent.tagline}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.tags?.map((tag) => (
                    <span key={tag} className="text-[11px] px-2.5 py-1 rounded-2xl border border-border text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                {agent.capabilities && (
                  <motion.div
                    initial={false}
                    animate={{ height: hoveredId === agent.id ? "auto" : 0, opacity: hoveredId === agent.id ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 mb-4">
                      {agent.capabilities.slice(0, 3).map(cap => (
                        <div key={cap} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-accent shrink-0 mt-0.5" />
                          <span className="text-[11px] text-muted-foreground">{cap}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{agent.performanceScore}%</span>
                    <span className="text-xs text-muted-foreground">performans</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{agent.kpis?.[0]}</span>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Konsolu Aç <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperts;
