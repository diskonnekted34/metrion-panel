import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { allExperts } from "@/data/experts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileHero from "@/components/profile/ProfileHero";
import CompetencyMatrix from "@/components/profile/CompetencyMatrix";
import StrategicOutputs from "@/components/profile/StrategicOutputs";
import ScenarioExamples from "@/components/profile/ScenarioExamples";
import CrossDepartmentImpact from "@/components/profile/CrossDepartmentImpact";
import ContinuousIntelligenceSection from "@/components/profile/ContinuousIntelligenceSection";
import TrustLayer from "@/components/profile/TrustLayer";
import ProfileSidebar from "@/components/profile/ProfileSidebar";

const ExpertProfile = () => {
  const { id } = useParams();
  const exec = allExperts.find((e) => e.id === id);

  if (!exec) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Ajan bulunamadı</h1>
          <Link to="/marketplace" className="text-primary hover:underline">Geri dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle grid bg */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(30,107,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.4) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <Navbar />

      <div className="relative z-10 pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Back link */}
          <div className="mb-8">
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Ekibi Genişlet
            </Link>
          </div>

          {/* Hero */}
          <ProfileHero agent={exec} />

          {/* Main content */}
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              <CompetencyMatrix agent={exec} />
              <StrategicOutputs agent={exec} />
              <ScenarioExamples agentId={exec.id} />
              <CrossDepartmentImpact agent={exec} />
              <ContinuousIntelligenceSection />
              <TrustLayer />
            </div>
            <ProfileSidebar agent={exec} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExpertProfile;
