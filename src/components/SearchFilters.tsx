
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const SearchFilters = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([500, 2000]);
  const { t } = useLanguage();

  return (
    <section className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              1,247 {t('filters.propertiesFound')}
            </h2>
            <div className="flex space-x-2">
              <Badge variant="secondary">Malasaña <X className="ml-1 h-3 w-3" /></Badge>
              <Badge variant="secondary">2+ {t('filters.bedrooms')} <X className="ml-1 h-3 w-3" /></Badge>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            {t('filters.filters')}
          </Button>
        </div>
        
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.priceRange')}
              </label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={3000}
                min={300}
                step={50}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>€{priceRange[0]}</span>
                <span>€{priceRange[1]}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.bedroomsLabel')}
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, '5+'].map((bed) => (
                  <Button key={bed} variant="outline" size="sm">
                    {bed}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.propertyTypeLabel')}
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>{t('filters.any')}</option>
                <option>{t('hero.house')}</option>
                <option>{t('hero.flat')}</option>
                <option>{t('hero.studio')}</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                {t('filters.applyFilters')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchFilters;
