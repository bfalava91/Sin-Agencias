
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Bath, Square, MapPin, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  featured: boolean;
  available: string;
  type?: string;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: isLiked 
        ? `${property.title} eliminada de tus favoritos`
        : `${property.title} añadida a tus favoritos`,
    });
  };

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simular contacto con el propietario
    toast({
      title: "Contactando propietario",
      description: `Te pondremos en contacto para ${property.title}`,
    });
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md cursor-pointer" onClick={handleViewDetails}>
      <div className="relative">
        <img 
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          {property.featured && (
            <Badge className="bg-green-500 hover:bg-green-600">
              {t('featured.featured')}
            </Badge>
          )}
        </div>
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
            {property.available}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-gray-900">
            €{property.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-600">{t('featured.month')}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms} {property.bedrooms > 1 ? t('featured.beds') : t('featured.bed')}
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms} {property.bathrooms > 1 ? t('featured.baths') : t('featured.bath')}
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {property.area} {t('featured.sqft')}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            {t('featured.viewDetails')}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleContact}
          >
            {t('featured.contact')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
