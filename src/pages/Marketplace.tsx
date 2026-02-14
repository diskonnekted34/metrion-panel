import Navbar from "@/components/Navbar";
import FeaturedExperts from "@/components/FeaturedExperts";
import Footer from "@/components/Footer";

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <FeaturedExperts />
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;
