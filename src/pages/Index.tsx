
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
      
      {/* Side by side sections */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <LandlordSection />
            <TenantSection />
          </div>
        </div>
      </div>
      
      <FeaturedProperties />
      <Footer />
    </div>
  );
};

export default Index;
