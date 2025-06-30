
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchFiltersProps {
  filters?: {
    location: string;
    property_type: string;
    monthly_rent: number[];
    bedrooms: string;
  };
  onFiltersChange?: (filters: any) => void;
  resultsCount?: number;
}

const SearchFilters = ({ filters, onFiltersChange, resultsCount = 1247 }: SearchFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLanguage();

  const handleMonthlyRentChange = (newRange: number[]) => {
    if (onFiltersChange && filters) {
      onFiltersChange({
        ...filters,
        monthly_rent: newRange
      });
    }
  };

  const handleBedroomChange = (bedrooms: string) => {
    if (onFiltersChange && filters) {
      onFiltersChange({
        ...filters,
        bedrooms
      });
    }
  };

  const handlePropertyTypeChange = (property_type: string) => {
    if (onFiltersChange && filters) {
      onFiltersChange({
        ...filters,
        property_type
      });
    }
  };

  const removeLocationFilter = () => {
    if (onFiltersChange && filters) {
      onFiltersChange({
        ...filters,
        location: ''
      });
    }
  };

  const removeBedroomFilter = () => {
    if (onFiltersChange && filters) {
      onFiltersChange({
        ...filters,
        bedrooms: 'any'
      });
    }
  };

  return (
    <section className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {resultsCount} {t('filters.propertiesFound')}
            </h2>
            <div className="flex space-x-2">
              {filters?.location && (
                <Badge variant="secondary" className="cursor-pointer" onClick={removeLocationFilter}>
                  {filters.location} <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {filters?.bedrooms && filters.bedrooms !== 'any' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={removeBedroomFilter}>
                  {filters.bedrooms} {t('filters.bedrooms')} <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
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
        
        {showFilters && filters && onFiltersChange && (
          <div className="bg-gray-50 rounded-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alquiler mensual (€)
              </label>
              <Slider
                value={filters.monthly_rent}
                onValueChange={handleMonthlyRentChange}
                max={3000}
                min={300}
                step={50}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>€{filters.monthly_rent[0]}</span>
                <span>€{filters.monthly_rent[1]}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habitaciones
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, '5+'].map((bed) => (
                  <Button 
                    key={bed} 
                    variant={filters.bedrooms === bed.toString() ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleBedroomChange(bed.toString())}
                  >
                    {bed}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de propiedad
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.property_type}
                onChange={(e) => handlePropertyTypeChange(e.target.value)}
              >
                <option value="any">Cualquiera</option>
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
            
            <div className="flex items-end">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Aplicar filtros
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchFilters;
