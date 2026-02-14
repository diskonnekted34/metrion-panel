import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import HowItWorks from "@/components/HowItWorks";
import StatsCounter from "@/components/StatsCounter";
import FeatureTabs from "@/components/FeatureTabs";
import PainPoints from "@/components/PainPoints";
import FeaturedExperts from "@/components/FeaturedExperts";
import LegalHighlight from "@/components/LegalHighlight";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <StatsCounter />
      <FeatureTabs />
      <FeaturedExperts />
      <LegalHighlight />
      <PainPoints />
      <Footer />
    </div>
  );
};

export default Index;
