
import PropertyCard from "./PropertyCard";

const properties = [
  {
    id: 1,
    title: "Modern 2-Bedroom Apartment",
    location: "Shoreditch, London",
    price: 1850,
    bedrooms: 2,
    bathrooms: 1,
    area: 750,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
    featured: true,
    available: "Available Now"
  },
  {
    id: 2,
    title: "Spacious Victorian House",
    location: "Clapham, London",
    price: 2400,
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
    featured: true,
    available: "Available 15th Jan"
  },
  {
    id: 3,
    title: "Contemporary Studio",
    location: "King's Cross, London",
    price: 1200,
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=400&h=300&fit=crop",
    featured: false,
    available: "Available Now"
  },
  {
    id: 4,
    title: "Luxury 2-Bed Penthouse",
    location: "Canary Wharf, London",
    price: 3200,
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=400&h=300&fit=crop",
    featured: true,
    available: "Available 1st Feb"
  },
  {
    id: 5,
    title: "Charming Garden Flat",
    location: "Notting Hill, London",
    price: 2100,
    bedrooms: 2,
    bathrooms: 1,
    area: 800,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
    featured: false,
    available: "Available Now"
  },
  {
    id: 6,
    title: "Modern City Living",
    location: "The City, London",
    price: 1650,
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
    featured: false,
    available: "Available 10th Feb"
  }
];

const FeaturedProperties = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our hand-picked selection of premium rental properties across London
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
