import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import PropertyCard from "@/components/PropertyCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    postcode: searchParams.get('postcode') || '',
    town: searchParams.get('town') || '',
    neighborhood: searchParams.get('neighborhood') || '',
    property_type: searchParams.get('property_type') || 'any',
    monthly_rent: [0, 5000],
    weekly_rent: [0, 1200],
    bedrooms: [0, 10],
    bathrooms: [0, 5],
    furnishing: searchParams.get('furnishing') || 'any',
    deposit: searchParams.get('deposit') || 'any',
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
  });
  const { t } = useLanguage();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      console.log('Fetching listings from database...');
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Raw listings from database:', data);

      const transformedListings = data?.map(listing => {
        console.log('Transforming listing:', listing);
        
        const transformed = {
          id: listing.id,
          title: generateListingTitle(listing),
          location: generateLocationText(listing),
          price: listing.monthly_rent || (listing.weekly_rent ? listing.weekly_rent * 4 : 0),
          bedrooms: listing.bedrooms || 1,
          bathrooms: listing.bathrooms || 1,
          area: 70,
          image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
          featured: false,
          available: "Disponible Ahora",
          type: listing.property_type || 'flat',
          // Store original listing data for filtering
          original: listing
        };
        
        console.log('Transformed listing:', transformed);
        return transformed;
      }) || [];

      console.log('All transformed listings:', transformedListings);
      setAllProperties(transformedListings);
      setFilteredProperties(transformedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Applying filters:', filters);
    console.log('All properties before filtering:', allProperties);
    
    let filtered = [...allProperties];

    // Text-based filters
    if (filters.postcode) {
      filtered = filtered.filter(property => 
        property.original.postcode?.toLowerCase().includes(filters.postcode.toLowerCase())
      );
    }

    if (filters.town) {
      filtered = filtered.filter(property => 
        property.original.town?.toLowerCase().includes(filters.town.toLowerCase())
      );
    }

    if (filters.neighborhood) {
      filtered = filtered.filter(property => 
        property.original.neighborhood?.toLowerCase().includes(filters.neighborhood.toLowerCase())
      );
    }

    if (filters.property_type !== 'any') {
      filtered = filtered.filter(property => 
        property.original.property_type === filters.property_type
      );
    }

    if (filters.furnishing !== 'any') {
      filtered = filtered.filter(property => 
        property.original.furnishing === filters.furnishing
      );
    }

    if (filters.deposit !== 'any') {
      filtered = filtered.filter(property => 
        property.original.deposit === filters.deposit
      );
    }

    // Range filters
    filtered = filtered.filter(property => {
      const monthlyRent = property.original.monthly_rent || 0;
      return monthlyRent >= filters.monthly_rent[0] && monthlyRent <= filters.monthly_rent[1];
    });

    filtered = filtered.filter(property => {
      const weeklyRent = property.original.weekly_rent || 0;
      return weeklyRent >= filters.weekly_rent[0] && weeklyRent <= filters.weekly_rent[1];
    });

    filtered = filtered.filter(property => {
      const bedrooms = property.original.bedrooms || 0;
      return bedrooms >= filters.bedrooms[0] && bedrooms <= filters.bedrooms[1];
    });

    filtered = filtered.filter(property => {
      const bathrooms = property.original.bathrooms || 0;
      return bathrooms >= filters.bathrooms[0] && bathrooms <= filters.bathrooms[1];
    });

    filtered = filtered.filter(property => {
      const minTenancy = property.original.min_tenancy || 0;
      return minTenancy >= filters.min_tenancy[0] && minTenancy <= filters.min_tenancy[1];
    });

    filtered = filtered.filter(property => {
      const maxTenants = property.original.max_tenants || 1;
      return maxTenants >= filters.max_tenants[0] && maxTenants <= filters.max_tenants[1];
    });

    // Boolean filters
    const booleanFilters = [
      'bills_included', 'garden_access', 'parking', 'fireplace',
      'students_allowed', 'families_allowed', 'dss_accepted', 
      'pets_allowed', 'smokers_allowed', 'students_only', 'remote_viewings'
    ];

    booleanFilters.forEach(filterKey => {
      if (filters[filterKey as keyof typeof filters] === true) {
        filtered = filtered.filter(property => 
          property.original[filterKey] === true
        );
      }
    });

    console.log('Final filtered properties:', filtered);
    setFilteredProperties(filtered);
  }, [filters, allProperties]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando propiedades...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SearchFilters 
        filters={filters} 
        onFiltersChange={setFilters}
        resultsCount={filteredProperties.length}
      />
      
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No se encontraron propiedades
              </h3>
              <p className="text-gray-500 mb-4">
                {allProperties.length === 0 
                  ? "No hay propiedades activas en este momento."
                  : "Intenta ajustar tus filtros de búsqueda"
                }
              </p>
              <p className="text-sm text-gray-400">
                Total de propiedades activas: {allProperties.length}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

const generateListingTitle = (listing) => {
  const propertyType = getDisplayPropertyType(listing.property_type);
  const bedrooms = listing.bedrooms ? `${listing.bedrooms} hab.` : '';
  
  let location = '';
  if (listing.neighborhood) {
    location = listing.neighborhood;
  } else if (listing.town) {
    location = listing.town;
  } else if (listing.postcode) {
    location = listing.postcode;
  }
  
  let title = propertyType;
  if (bedrooms) {
    title += ` ${bedrooms}`;
  }
  if (location) {
    title += ` en ${location}`;
  }
  
  return title;
};

const generateLocationText = (listing) => {
  const parts = [];
  
  if (listing.neighborhood) {
    parts.push(listing.neighborhood);
  }
  
  if (listing.town) {
    parts.push(listing.town);
  }
  
  if (listing.postcode) {
    parts.push(listing.postcode);
  }
  
  return parts.join(', ') || 'Ubicación no especificada';
};

const getDisplayPropertyType = (dbType) => {
  const displayMapping = {
    'studio': 'Estudio',
    'bedsit': 'Estudio',
    'flat': 'Piso',
    'penthouse': 'Ático',
    'maisonette': 'Dúplex',
    'detached': 'Casa Individual',
    'semi-detached': 'Casa Adosada',
    'terraced': 'Casa en Hilera',
    'bungalow': 'Bungalow'
  };
  return displayMapping[dbType] || 'Propiedad';
};

export default Search;
