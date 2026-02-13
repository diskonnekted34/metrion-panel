import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { experts } from "@/data/experts";

const badgeColors: Record<string, string> = {
  Elite: "bg-primary/10 text-primary",
  Pro: "bg-secondary/10 text-secondary",
  Certified: "bg-accent/10 text-accent",
};

const FeaturedExperts = () => {
  return (
    <section id="experts" className="py-24 px-6 gradient-bg">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured AI Experts
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Handpicked professionals ready to join your digital workforce.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert, i) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link to={`/expert/${expert.id}`} className="block glass-card p-6 h-full group">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/60"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-foreground truncate">{expert.name}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColors[expert.badge]}`}>
                        {expert.badge}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{expert.tagline}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{expert.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {expert.tags.map((tag) => (
                    <span key={tag} className="text-[11px] px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                    <span className="text-sm font-medium text-foreground">{expert.rating}</span>
                    <span className="text-xs text-muted-foreground">({expert.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{expert.priceModel}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View Profile <ArrowRight className="h-3.5 w-3.5" />
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
