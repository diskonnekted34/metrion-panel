import { Link } from "react-router-dom";

const FooterV2 = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/[0.06]">
      <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-foreground">Metrion<sup className="text-[8px]">®</sup></p>
          <p className="text-xs text-muted-foreground/50 mt-0.5">AI-Powered Executive Governance OS.</p>
        </div>
        <div className="flex gap-8 text-xs text-muted-foreground/50">
          <Link to="/departments" className="hover:text-foreground transition-colors">Product</Link>
          <Link to="/pricing" className="hover:text-foreground transition-colors">Plans</Link>
          <span className="hover:text-foreground transition-colors cursor-pointer">Security</span>
          <Link to="/reports" className="hover:text-foreground transition-colors">Reports</Link>
          <span className="hover:text-foreground transition-colors cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>
  );
};

export default FooterV2;
