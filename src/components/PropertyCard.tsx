
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Bath, Square, MapPin, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  title?: string;
  town?: string;
  neighborhood?: string;
  monthly_rent?: number;
  bedrooms?: number;
  bathrooms?: number;
  property_type?: string;
  furnishing?: string;
  status: string;
  move_in_date?: string;
  features?: string;
  square_meters?: number;
  images?: string[];
  original?: any;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get images from the property data - check both direct property and original data
  const getDisplayImage = () => {
    // First check if property has images directly
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    
    // Then check if original data has images
    if (property.original?.images && property.original.images.length > 0) {
      return property.original.images[0];
    }
    
    // Fallback to placeholder
    return "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop";
  };

  const displayImage = getDisplayImage();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: isLiked 
        ? `${getTitle()} eliminada de tus favoritos`
        : `${getTitle()} añadida a tus favoritos`,
    });
  };

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/message-landlord/${property.id}`);
  };

  const getTitle = () => {
    return property.title || `${property.property_type || 'Propiedad'} en ${property.town || 'ubicación'}`;
  };

  const getLocation = () => {
    const parts = [property.neighborhood, property.town].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const getAvailabilityText = () => {
    if (!property.move_in_date) return 'Disponible Ahora';
    const moveInDate = new Date(property.move_in_date);
    const today = new Date();
    if (moveInDate <= today) return 'Disponible Ahora';
    return `Disponible desde ${moveInDate.toLocaleDateString('es-ES')}`;
  };

  const getFeatures = () => {
    if (!property.features) return [];
    return property.features.split('\n').filter(feature => feature.trim() !== '').slice(0, 3);
  };

  const getMonthlyRent = () => {
    // Try to get monthly rent from the property itself or the original data
    const monthlyRent = property.monthly_rent || property.original?.monthly_rent;
    if (monthlyRent) return monthlyRent;
    
    // If no monthly rent, try to calculate from weekly rent
    const weeklyRent = property.original?.weekly_rent;
    if (weeklyRent) return weeklyRent * 4;
    
    return null;
  };

  const getSquareMeters = () => {
    return property.square_meters || property.original?.square_meters;
  };

  const monthlyRent = getMonthlyRent();
  const squareMeters = getSquareMeters();
  const location = getLocation();

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md cursor-pointer" onClick={handleViewDetails}>
      <div className="relative">
        <img 
          src={displayImage}
          alt={getTitle()}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button 
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {getAvailabilityText()}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {getTitle()}
          </h3>
          {location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {location}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-gray-900">
            {monthlyRent ? `€${monthlyRent.toLocaleString()}` : 'Precio a consultar'}
            <span className="text-sm font-normal text-gray-600">/mes</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {property.bedrooms} {property.bedrooms > 1 ? 'hab' : 'hab'}
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms} {property.bathrooms > 1 ? 'baños' : 'baño'}
            </div>
          )}
          {squareMeters && (
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {squareMeters}m²
            </div>
          )}
        </div>

        {/* Show features if available */}
        {getFeatures().length > 0 && (
          <div className="mb-4">
            <ul className="text-sm text-gray-600">
              {getFeatures().map((feature, index) => (
                <li key={index} className="flex items-center mb-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            Ver Detalles
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleContact}
          >
            Contactar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
