import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import PainPoints from "@/components/PainPoints";
import TrustStrip from "@/components/TrustStrip";
import FeaturedExperts from "@/components/FeaturedExperts";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <PainPoints />
      <FeaturedExperts />
      <Footer />
    </div>
  );
};

export default Index;
