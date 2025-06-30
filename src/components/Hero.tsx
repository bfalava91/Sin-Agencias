
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [property_type, setPropertyType] = useState('any');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    
    if (location.trim()) {
      searchParams.set('location', location.trim());
    }
    if (property_type !== 'any') {
      searchParams.set('property_type', property_type);
    }
    
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
            <span className="text-blue-600 block">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder={t('hero.locationPlaceholder')} 
                  className="pl-10 h-12 text-lg"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <select 
                  className="w-full h-12 px-4 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={property_type}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="any">{t('hero.propertyType')}</option>
                  <option value="studio">Estudio</option>
                  <option value="bedsit">Bedsit</option>
                  <option value="flat">Piso</option>
                  <option value="penthouse">Ático</option>
                  <option value="maisonette">Dúplex</option>
                  <option value="detached">Casa Individual</option>
                  <option value="semi-detached">Casa Adosada</option>
                  <option value="terraced">Casa en Hilera</option>
                  <option value="bungalow">Bungalow</option>
                </select>
              </div>
              <Button type="submit" size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-5 w-5" />
                {t('hero.searchProperties')}
              </Button>
            </div>
          </form>
          
          <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {t('hero.stat1')}
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {t('hero.stat2')}
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              {t('hero.stat3')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
