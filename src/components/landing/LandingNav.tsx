import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 transition-all duration-300 ${
        scrolled ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent"
      }`}
    >
      <Link to="/" className="flex items-center gap-0.5">
        <span className="text-base font-bold tracking-tight text-foreground">Metrion</span>
        <sup className="text-[7px] text-muted-foreground/50">®</sup>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-[13px] text-muted-foreground/60">
        <Link to="/departments" className="hover:text-foreground transition-colors">Product</Link>
        <Link to="/pricing" className="hover:text-foreground transition-colors">Plans</Link>
        <span className="hover:text-foreground transition-colors cursor-pointer">Security</span>
        <Link to="/reports" className="hover:text-foreground transition-colors">Reports</Link>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="hidden md:block text-[13px] text-muted-foreground/60 hover:text-foreground transition-colors">
          Sign in
        </Link>
        <Link
          to="/pricing"
          className="landing-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
        >
          Get a Demo <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.nav>
  );
};

export default LandingNav;
