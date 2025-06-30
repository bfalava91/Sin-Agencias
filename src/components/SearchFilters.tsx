import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchFiltersProps {
  filters?: {
    postcode: string;
    town: string;
    neighborhood: string;
    property_type: string;
    monthly_rent: number[];
    weekly_rent: number[];
    bedrooms: number[];
    bathrooms: number[];
    furnishing: string;
    deposit: string;
    min_tenancy: number[];
    max_tenants: number[];
    bills_included: boolean | null;
    garden_access: boolean | null;
    parking: boolean | null;
    fireplace: boolean | null;
    students_allowed: boolean | null;
    families_allowed: boolean | null;
    dss_accepted: boolean | null;
    pets_allowed: boolean | null;
    smokers_allowed: boolean | null;
    students_only: boolean | null;
    remote_viewings: boolean | null;
  };
  onFiltersChange?: (filters: any) => void;
  resultsCount?: number;
}

const defaultFilters = {
  postcode: '',
  town: '',
  neighborhood: '',
  property_type: 'any',
  monthly_rent: [0, 5000],
  weekly_rent: [0, 1200],
  bedrooms: [0, 10],
  bathrooms: [0, 5],
  furnishing: 'any',
  deposit: 'any',
  min_tenancy: [0, 24],
  max_tenants: [1, 10],
  bills_included: null,
  garden_access: null,
  parking: null,
  fireplace: null,
  students_allowed: null,
  families_allowed: null,
  dss_accepted: null,
  pets_allowed: null,
  smokers_allowed: null,
  students_only: null,
  remote_viewings: null,
};

const SearchFilters = ({ filters, onFiltersChange, resultsCount = 0 }: SearchFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLanguage();

  const handleInputChange = (field: string, value: any) => {
    if (onFiltersChange && filters) {
      onFiltersChange({
        ...filters,
        [field]: value
      });
    }
  };

  const handleRangeChange = (field: string, newRange: number[]) => {
    if (onFiltersChange && filters) {
      onFiltersChange({
        ...filters,
        [field]: newRange
      });
    }
  };

  const handleBooleanChange = (field: string, checked: boolean) => {
    if (onFiltersChange && filters) {
      onFiltersChange({
        ...filters,
        [field]: checked ? true : null
      });
    }
  };

  const resetFilters = () => {
    if (onFiltersChange) {
      onFiltersChange(defaultFilters);
    }
  };

  const removeFilter = (field: string) => {
    if (onFiltersChange && filters) {
      let resetValue;
      if (field.includes('_rent') || field.includes('bedrooms') || field.includes('bathrooms') || field.includes('tenancy') || field.includes('tenants')) {
        resetValue = defaultFilters[field as keyof typeof defaultFilters];
      } else if (typeof defaultFilters[field as keyof typeof defaultFilters] === 'boolean') {
        resetValue = null;
      } else {
        resetValue = defaultFilters[field as keyof typeof defaultFilters];
      }
      
      onFiltersChange({
        ...filters,
        [field]: resetValue
      });
    }
  };

  const getActiveFiltersCount = () => {
    if (!filters) return 0;
    let count = 0;
    
    // Check text filters
    if (filters.postcode) count++;
    if (filters.town) count++;
    if (filters.neighborhood) count++;
    if (filters.property_type !== 'any') count++;
    if (filters.furnishing !== 'any') count++;
    if (filters.deposit !== 'any') count++;
    
    // Check range filters (only if not default)
    if (filters.monthly_rent[0] !== 0 || filters.monthly_rent[1] !== 5000) count++;
    if (filters.weekly_rent[0] !== 0 || filters.weekly_rent[1] !== 1200) count++;
    if (filters.bedrooms[0] !== 0 || filters.bedrooms[1] !== 10) count++;
    if (filters.bathrooms[0] !== 0 || filters.bathrooms[1] !== 5) count++;
    if (filters.min_tenancy[0] !== 0 || filters.min_tenancy[1] !== 24) count++;
    if (filters.max_tenants[0] !== 1 || filters.max_tenants[1] !== 10) count++;
    
    // Check boolean filters
    const booleanFields = ['bills_included', 'garden_access', 'parking', 'fireplace', 'students_allowed', 'families_allowed', 'dss_accepted', 'pets_allowed', 'smokers_allowed', 'students_only', 'remote_viewings'];
    booleanFields.forEach(field => {
      if (filters[field as keyof typeof filters] === true) count++;
    });
    
    return count;
  };

  if (!filters || !onFiltersChange) {
    return null;
  }

  return (
    <section className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {resultsCount} {t('filters.propertiesFound')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {filters.postcode && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => removeFilter('postcode')}>
                  {filters.postcode} <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {filters.town && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => removeFilter('town')}>
                  {filters.town} <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {filters.neighborhood && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => removeFilter('neighborhood')}>
                  {filters.neighborhood} <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {filters.property_type !== 'any' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => removeFilter('property_type')}>
                  {filters.property_type} <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {getActiveFiltersCount() > 0 && (
                <Badge variant="outline" className="cursor-pointer text-red-600 border-red-200" onClick={resetFilters}>
                  Clear all ({getActiveFiltersCount()}) <X className="ml-1 h-3 w-3" />
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
            {t('filters.filters')} {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </Button>
        </div>
        
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              
              {/* Location Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                <Input
                  value={filters.postcode}
                  onChange={(e) => handleInputChange('postcode', e.target.value)}
                  placeholder="Ej: 28001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                <Input
                  value={filters.town}
                  onChange={(e) => handleInputChange('town', e.target.value)}
                  placeholder="Ej: Madrid"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Barrio</label>
                <Input
                  value={filters.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  placeholder="Ej: Malasaña"
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Propiedad</label>
                <Select value={filters.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquiera</SelectItem>
                    <SelectItem value="studio">Estudio</SelectItem>
                    <SelectItem value="bedsit">Bedsit</SelectItem>
                    <SelectItem value="flat">Piso</SelectItem>
                    <SelectItem value="penthouse">Ático</SelectItem>
                    <SelectItem value="maisonette">Dúplex</SelectItem>
                    <SelectItem value="detached">Casa Individual</SelectItem>
                    <SelectItem value="semi-detached">Casa Adosada</SelectItem>
                    <SelectItem value="terraced">Casa en Hilera</SelectItem>
                    <SelectItem value="bungalow">Bungalow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Furnishing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amueblado</label>
                <Select value={filters.furnishing} onValueChange={(value) => handleInputChange('furnishing', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquiera</SelectItem>
                    <SelectItem value="furnished">Amueblado</SelectItem>
                    <SelectItem value="unfurnished">Sin Amueblar</SelectItem>
                    <SelectItem value="part-furnished">Parcialmente Amueblado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Deposit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Depósito</label>
                <Select value={filters.deposit} onValueChange={(value) => handleInputChange('deposit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquiera</SelectItem>
                    <SelectItem value="no-deposit">Sin Depósito</SelectItem>
                    <SelectItem value="1-week">1 Semana</SelectItem>
                    <SelectItem value="2-weeks">2 Semanas</SelectItem>
                    <SelectItem value="1-month">1 Mes</SelectItem>
                    <SelectItem value="6-weeks">6 Semanas</SelectItem>
                    <SelectItem value="2-months">2 Meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Range Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alquiler Mensual (€)</label>
                <Slider
                  value={filters.monthly_rent}
                  onValueChange={(value) => handleRangeChange('monthly_rent', value)}
                  max={5000}
                  min={0}
                  step={50}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>€{filters.monthly_rent[0]}</span>
                  <span>€{filters.monthly_rent[1]}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alquiler Semanal (€)</label>
                <Slider
                  value={filters.weekly_rent}
                  onValueChange={(value) => handleRangeChange('weekly_rent', value)}
                  max={1200}
                  min={0}
                  step={25}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>€{filters.weekly_rent[0]}</span>
                  <span>€{filters.weekly_rent[1]}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones</label>
                <Slider
                  value={filters.bedrooms}
                  onValueChange={(value) => handleRangeChange('bedrooms', value)}
                  max={10}
                  min={0}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{filters.bedrooms[0]}</span>
                  <span>{filters.bedrooms[1]}+</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Baños</label>
                <Slider
                  value={filters.bathrooms}
                  onValueChange={(value) => handleRangeChange('bathrooms', value)}
                  max={5}
                  min={0}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{filters.bathrooms[0]}</span>
                  <span>{filters.bathrooms[1]}+</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tenencia Mínima (meses)</label>
                <Slider
                  value={filters.min_tenancy}
                  onValueChange={(value) => handleRangeChange('min_tenancy', value)}
                  max={24}
                  min={0}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{filters.min_tenancy[0]}</span>
                  <span>{filters.min_tenancy[1]}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Máximo de Inquilinos</label>
                <Slider
                  value={filters.max_tenants}
                  onValueChange={(value) => handleRangeChange('max_tenants', value)}
                  max={10}
                  min={1}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{filters.max_tenants[0]}</span>
                  <span>{filters.max_tenants[1]}</span>
                </div>
              </div>
            </div>

            {/* Boolean Filters */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Características</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bills_included"
                    checked={filters.bills_included === true}
                    onCheckedChange={(checked) => handleBooleanChange('bills_included', checked as boolean)}
                  />
                  <label htmlFor="bills_included" className="text-sm">Facturas Incluidas</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="garden_access"
                    checked={filters.garden_access === true}
                    onCheckedChange={(checked) => handleBooleanChange('garden_access', checked as boolean)}
                  />
                  <label htmlFor="garden_access" className="text-sm">Acceso a Jardín</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parking"
                    checked={filters.parking === true}
                    onCheckedChange={(checked) => handleBooleanChange('parking', checked as boolean)}
                  />
                  <label htmlFor="parking" className="text-sm">Aparcamiento</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fireplace"
                    checked={filters.fireplace === true}
                    onCheckedChange={(checked) => handleBooleanChange('fireplace', checked as boolean)}
                  />
                  <label htmlFor="fireplace" className="text-sm">Chimenea</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="students_allowed"
                    checked={filters.students_allowed === true}
                    onCheckedChange={(checked) => handleBooleanChange('students_allowed', checked as boolean)}
                  />
                  <label htmlFor="students_allowed" className="text-sm">Estudiantes Permitidos</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="families_allowed"
                    checked={filters.families_allowed === true}
                    onCheckedChange={(checked) => handleBooleanChange('families_allowed', checked as boolean)}
                  />
                  <label htmlFor="families_allowed" className="text-sm">Familias Permitidas</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dss_accepted"
                    checked={filters.dss_accepted === true}
                    onCheckedChange={(checked) => handleBooleanChange('dss_accepted', checked as boolean)}
                  />
                  <label htmlFor="dss_accepted" className="text-sm">DSS Aceptado</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pets_allowed"
                    checked={filters.pets_allowed === true}
                    onCheckedChange={(checked) => handleBooleanChange('pets_allowed', checked as boolean)}
                  />
                  <label htmlFor="pets_allowed" className="text-sm">Mascotas Permitidas</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smokers_allowed"
                    checked={filters.smokers_allowed === true}
                    onCheckedChange={(checked) => handleBooleanChange('smokers_allowed', checked as boolean)}
                  />
                  <label htmlFor="smokers_allowed" className="text-sm">Fumadores Permitidos</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="students_only"
                    checked={filters.students_only === true}
                    onCheckedChange={(checked) => handleBooleanChange('students_only', checked as boolean)}
                  />
                  <label htmlFor="students_only" className="text-sm">Solo Estudiantes</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote_viewings"
                    checked={filters.remote_viewings === true}
                    onCheckedChange={(checked) => handleBooleanChange('remote_viewings', checked as boolean)}
                  />
                  <label htmlFor="remote_viewings" className="text-sm">Visitas Remotas</label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={resetFilters} className="flex items-center">
                <RotateCcw className="mr-2 h-4 w-4" />
                Resetear Filtros
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchFilters;
