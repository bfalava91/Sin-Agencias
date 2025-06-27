
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import PropertyCard from "@/components/PropertyCard";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock data - en una aplicación real vendría de una API
const allProperties = [
  {
    id: 1,
    title: "Moderno Apartamento 2 Habitaciones",
    location: "Malasaña, Madrid",
    price: 1850,
    bedrooms: 2,
    bathrooms: 1,
    area: 70,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
    featured: true,
    available: "Disponible Ahora",
    type: "flat"
  },
  {
    id: 2,
    title: "Espacioso Piso Victoriano",
    location: "Chueca, Madrid",
    price: 2400,
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
    featured: true,
    available: "Disponible 15 Ene",
    type: "flat"
  },
  {
    id: 3,
    title: "Estudio Contemporáneo",
    location: "La Latina, Madrid",
    price: 1200,
    bedrooms: 1,
    bathrooms: 1,
    area: 42,
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=400&h=300&fit=crop",
    featured: false,
    available: "Disponible Ahora",
    type: "studio"
  },
  {
    id: 4,
    title: "Ático de Lujo 2 Habitaciones",
    location: "Salamanca, Madrid",
    price: 3200,
    bedrooms: 2,
    bathrooms: 2,
    area: 88,
    image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=400&h=300&fit=crop",
    featured: true,
    available: "Disponible 1 Feb",
    type: "flat"
  },
  {
    id: 5,
    title: "Encantador Piso con Terraza",
    location: "Retiro, Madrid",
    price: 2100,
    bedrooms: 2,
    bathrooms: 1,
    area: 74,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
    featured: false,
    available: "Disponible Ahora",
    type: "flat"
  },
  {
    id: 6,
    title: "Moderno Loft Urbano",
    location: "Chamberí, Madrid",
    price: 1650,
    bedrooms: 1,
    bathrooms: 1,
    area: 56,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
    featured: false,
    available: "Disponible 10 Feb",
    type: "studio"
  },
  {
    id: 7,
    title: "Casa Familiar en Zona Residencial",
    location: "Chamartín, Madrid",
    price: 2800,
    bedrooms: 4,
    bathrooms: 3,
    area: 120,
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&h=300&fit=crop",
    featured: false,
    available: "Disponible Ahora",
    type: "house"
  },
  {
    id: 8,
    title: "Habitación en Piso Compartido",
    location: "Moncloa, Madrid",
    price: 650,
    bedrooms: 1,
    bathrooms: 1,
    area: 15,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    featured: false,
    available: "Disponible Ahora",
    type: "room"
  }
];

const Search = () => {
  const [searchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState(allProperties);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    propertyType: searchParams.get('type') || 'any',
    priceRange: [500, 2000],
    bedrooms: 'any'
  });
  const { t } = useLanguage();

  useEffect(() => {
    let filtered = allProperties;

    // Filtrar por ubicación
    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filtrar por tipo de propiedad
    if (filters.propertyType !== 'any') {
      filtered = filtered.filter(property => property.type === filters.propertyType);
    }

    // Filtrar por rango de precio
    filtered = filtered.filter(property => 
      property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    );

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
    }

    setFilteredProperties(filtered);
  }, [filters]);

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
              <p className="text-gray-500">
                Intenta ajustar tus filtros de búsqueda
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
