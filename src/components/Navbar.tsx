import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Globe } from "lucide-react";

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
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
          <button
            onClick={() => setLang(lang === "en" ? "tr" : "en")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-accent"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "en" ? "TR" : "EN"}
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            {t.nav.signIn}
          </button>
          <Link to="/pricing" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]">
            {t.nav.getStarted}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
