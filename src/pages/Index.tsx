
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import SearchFilters from "@/components/SearchFilters";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandlordSection from "@/components/LandlordSection";
import TenantSection from "@/components/TenantSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <SearchFilters />
      <LandlordSection />
      <FeaturedProperties />
      <TenantSection />
      <Footer />
    </div>
  );
};

export default Index;
