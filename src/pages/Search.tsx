
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
    location: searchParams.get('location') || '',
    propertyType: searchParams.get('type') || 'any',
    priceRange: [0, 200000], // Much more inclusive range
    bedrooms: 'any'
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

      // Transform database listings to match the expected format
      const transformedListings = data?.map(listing => {
        console.log('Transforming listing:', listing);
        
        const transformed = {
          id: listing.id,
          title: generateListingTitle(listing),
          location: generateLocationText(listing),
          price: listing.monthly_rent || (listing.weekly_rent ? listing.weekly_rent * 4 : 0),
          bedrooms: listing.bedrooms || 1,
          bathrooms: listing.bathrooms || 1,
          area: 70, // Default area since it's not in our database
          image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
          featured: false,
          available: "Disponible Ahora",
          type: getPropertyTypeMapping(listing.property_type)
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

  const generateListingTitle = (listing) => {
    const propertyType = getDisplayPropertyType(listing.property_type);
    const bedrooms = listing.bedrooms ? `${listing.bedrooms} hab.` : '';
    
    // Build location string with preference: neighborhood > town > postcode
    let location = '';
    if (listing.neighborhood) {
      location = listing.neighborhood;
    } else if (listing.town) {
      location = listing.town;
    } else if (listing.postcode) {
      location = listing.postcode;
    }
    
    // Build the title
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
    // Build a comprehensive location string
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

  const getPropertyTypeMapping = (dbType) => {
    // Map all property types to the filter categories
    const mapping = {
      'studio': 'studio',
      'bedsit': 'studio',
      'flat': 'flat',
      'penthouse': 'flat',
      'maisonette': 'flat',
      'detached': 'house',
      'semi-detached': 'house',
      'terraced': 'house',
      'bungalow': 'house'
    };
    return mapping[dbType] || 'flat'; // Default to 'flat' instead of undefined
  };

  useEffect(() => {
    console.log('Applying filters:', filters);
    console.log('All properties before filtering:', allProperties);
    
    let filtered = [...allProperties];

    // Filtrar por ubicación
    if (filters.location) {
      const locationFilter = filters.location.toLowerCase();
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(locationFilter) ||
        property.title.toLowerCase().includes(locationFilter)
      );
      console.log('After location filter:', filtered);
    }

    // Filtrar por tipo de propiedad
    if (filters.propertyType !== 'any') {
      filtered = filtered.filter(property => {
        console.log(`Comparing property type: ${property.type} with filter: ${filters.propertyType}`);
        return property.type === filters.propertyType;
      });
      console.log('After property type filter:', filtered);
    }

    // Filtrar por rango de precio
    filtered = filtered.filter(property => {
      const priceInRange = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
      console.log(`Price ${property.price} in range [${filters.priceRange[0]}, ${filters.priceRange[1]}]: ${priceInRange}`);
      return priceInRange;
    });
    console.log('After price filter:', filtered);

    // Filtrar por habitaciones
    if (filters.bedrooms !== 'any') {
      const bedroomCount = typeof filters.bedrooms === 'string' && filters.bedrooms.includes('+') 
        ? parseInt(filters.bedrooms) 
        : parseInt(filters.bedrooms);
      
      if (filters.bedrooms.includes('+')) {
        filtered = filtered.filter(property => property.bedrooms >= bedroomCount);
      } else {
        filtered = filtered.filter(property => property.bedrooms === bedroomCount);
      }
      console.log('After bedrooms filter:', filtered);
    }

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

export default Search;
