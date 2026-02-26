import LandingNav from "@/components/landing/LandingNav";
import HeroV2 from "@/components/landing/HeroV2";
import TrustStripV2 from "@/components/landing/TrustStripV2";
import ProblemSection from "@/components/landing/ProblemSection";
import GovernedLoop from "@/components/landing/GovernedLoop";
import DecisionLabSection from "@/components/landing/DecisionLabSection";
import RiskRadarSection from "@/components/landing/RiskRadarSection";
import ReportsMemory from "@/components/landing/ReportsMemory";
import GovernanceControl from "@/components/landing/GovernanceControl";
import MaturityCards from "@/components/landing/MaturityCards";
import IntegrationsGrid from "@/components/landing/IntegrationsGrid";
import FinalCTA from "@/components/landing/FinalCTA";
import FooterV2 from "@/components/landing/FooterV2";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-foreground">
      <LandingNav />
      <HeroV2 />
      <TrustStripV2 />
      <ProblemSection />
      <GovernedLoop />
      <DecisionLabSection />
      <RiskRadarSection />
      <ReportsMemory />
      <GovernanceControl />
      <MaturityCards />
      <IntegrationsGrid />
      <FinalCTA />
      <FooterV2 />
    </div>
  );
};

export default Index;
