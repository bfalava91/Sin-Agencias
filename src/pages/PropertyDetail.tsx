
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Heart,
  Phone,
  Mail,
  Share2,
  Calendar
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

// Mock data - en una aplicación real vendría de una API
const propertyDetails = {
  1: {
    id: 1,
    title: "Moderno Apartamento 2 Habitaciones",
    location: "Malasaña, Madrid",
    price: 1850,
    bedrooms: 2,
    bathrooms: 1,
    area: 70,
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1486304873000-235643847519?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop"
    ],
    featured: true,
    available: "Disponible Ahora",
    type: "flat",
    description: "Hermoso apartamento moderno en el corazón de Malasaña. Completamente renovado con acabados de alta calidad. Ubicación perfecta cerca de tiendas, restaurantes y transporte público.",
    features: [
      "Completamente amueblado",
      "Aire acondicionado",
      "Calefacción central",
      "Internet de alta velocidad",
      "Electrodomésticos nuevos",
      "Balcón privado"
    ],
    landlord: {
      name: "María García",
      phone: "+34 666 123 456",
      email: "maria.garcia@email.com",
      verified: true
    }
  }
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const property = propertyDetails[parseInt(id || '1') as keyof typeof propertyDetails] || propertyDetails[1];

  const handleContact = (type: 'phone' | 'email') => {
    if (type === 'phone') {
      window.open(`tel:${property.landlord.phone}`);
    } else {
      window.open(`mailto:${property.landlord.email}?subject=Consulta sobre ${property.title}`);
    }
    
    toast({
      title: type === 'phone' ? "Llamando..." : "Abriendo email...",
      description: type === 'phone' 
        ? `Llamando a ${property.landlord.name}` 
        : `Enviando email a ${property.landlord.name}`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Echa un vistazo a esta propiedad: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Enlace copiado",
        description: "El enlace se ha copiado al portapapeles",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Galería de imágenes */}
          <div className="lg:col-span-2">
            <div className="relative mb-4">
              <img 
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsLiked(!isLiked)}
                  className="bg-white/90 hover:bg-white"
                >
                  <Heart 
                    className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleShare}
                  className="bg-white/90 hover:bg-white"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              {property.featured && (
                <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">
                  {t('featured.featured')}
                </Badge>
              )}
            </div>
            
            <div className="flex space-x-2 mb-6">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Descripción */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Descripción</h3>
                <p className="text-gray-600 mb-6">{property.description}</p>
                
                <h4 className="text-lg font-semibold mb-3">Características</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Información de la propiedad */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-6">
                  €{property.price.toLocaleString()}
                  <span className="text-lg font-normal text-gray-600">/mes</span>
                </div>

                <div className="flex items-center space-x-6 mb-6 text-gray-600">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2" />
                    {property.bedrooms} hab
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2" />
                    {property.bathrooms} baño
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2" />
                    {property.area} m²
                  </div>
                </div>

                <div className="mb-6">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Calendar className="h-3 w-3 mr-1" />
                    {property.available}
                  </Badge>
                </div>

                {/* Información del propietario */}
                <div className="border-t pt-6 mb-6">
                  <h4 className="font-semibold mb-3">Propietario</h4>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">
                        {property.landlord.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{property.landlord.name}</p>
                      {property.landlord.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verificado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botones de contacto */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleContact('phone')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Llamar
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleContact('email')}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
