
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="text-blue-600 block">Rental Property</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover thousands of verified rental properties. No fees, no hassle, just the perfect home waiting for you.
          </p>
          
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Enter location (e.g., London, Manchester)" 
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <div className="flex-1">
                <select className="w-full h-12 px-4 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Property Type</option>
                  <option>House</option>
                  <option>Flat</option>
                  <option>Studio</option>
                  <option>Room</option>
                </select>
              </div>
              <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-5 w-5" />
                Search Properties
              </Button>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Over 10,000 Properties
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Verified Landlords
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              No Hidden Fees
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
