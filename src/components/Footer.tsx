import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-16 px-6 border-t border-white/[0.06]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[5px] bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">C</span>
            </div>
            <span className="text-sm font-semibold text-foreground">C-Levels</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">{t.footer.about}</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">{t.footer.privacy}</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">{t.footer.terms}</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">{t.footer.contact}</span>
            <span className="text-muted-foreground/40 cursor-not-allowed">{t.footer.creatorProgram}</span>
          </div>
          <p className="text-xs text-muted-foreground">{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
