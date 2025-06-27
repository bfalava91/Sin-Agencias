
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import SearchFilters from "@/components/SearchFilters";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <SearchFilters />
      <FeaturedProperties />
      <Footer />
    </div>
  );
};

export default Index;
