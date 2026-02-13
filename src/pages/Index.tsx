import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedExperts from "@/components/FeaturedExperts";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedExperts />
      <Footer />
    </div>
  );
};

export default Index;
