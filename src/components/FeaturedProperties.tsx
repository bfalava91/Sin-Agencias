
import PropertyCard from "./PropertyCard";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const properties = [
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
    type: "flat",
    status: "active"
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
    type: "flat",
    status: "active"
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
    type: "studio",
    status: "active"
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
    type: "flat",
    status: "active"
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
    type: "flat",
    status: "active"
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
    type: "studio",
    status: "active"
  }
];

const FeaturedProperties = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/search');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('featured.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('featured.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={handleViewAll}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {t('featured.viewAll')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
