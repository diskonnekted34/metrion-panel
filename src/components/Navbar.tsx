import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-2xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">C</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">C-Levels</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.overview}</Link>
          <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.team}</Link>
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.pricing}</Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.dashboard}</Link>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            {t.nav.signIn}
          </button>
          <Link to="/pricing" className="btn-primary px-5 py-2 active:scale-[0.98]">
            {t.nav.getStarted}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
