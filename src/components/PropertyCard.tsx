
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Bath, Square, MapPin, Heart } from "lucide-react";
import { useState } from "react";

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
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md">
      <div className="relative">
        <img 
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          {property.featured && (
            <Badge className="bg-green-500 hover:bg-green-600">
              Featured
            </Badge>
          )}
        </div>
        <button 
          onClick={() => setIsLiked(!isLiked)}
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
            £{property.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-600">/month</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {property.area} sqft
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            View Details
          </Button>
          <Button variant="outline" className="flex-1">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
