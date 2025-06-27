
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight,
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Heart,
  Share2,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Clock,
  Euro,
  Users,
  PawPrint,
  Cigarette,
  GraduationCap,
  Calendar as CalendarIcon,
  Eye,
  TreePine,
  Car,
  Flame,
  Sofa,
  Zap,
  MapIcon,
  Mail,
  MessageSquare,
  Home,
  UserCheck,
  Building,
  CreditCard
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
    deposit: 1850,
    billsIncluded: true,
    internet: true,
    bedrooms: 2,
    bathrooms: 1,
    area: 70,
    maxTenants: 4,
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1486304873000-235643847519?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ],
    featured: true,
    available: "Disponible Ahora",
    availableFrom: "2024-07-01",
    minimumTenancy: 6,
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
    preferences: {
      students: true,
      families: false,
      pets: true,
      smokers: false,
      dssLha: false
    },
    availability: {
      shortTerm: false,
      virtualTour: true
    },
    amenities: {
      garden: true,
      parking: true,
      fireplace: false,
      furnished: true,
      energyRating: "B"
    },
    landlord: {
      name: "María García",
      phone: "+34 666 123 456",
      email: "maria.garcia@email.com",
      verified: true,
      responseRate: 95,
      responseTime: 2
    },
    coordinates: {
      lat: 40.4267,
      lng: -3.7038
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleContact = () => {
    toast({
      title: "Contactando propietario",
      description: "Te pondremos en contacto para concertar una visita",
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = property.title;
    const text = `Echa un vistazo a esta propiedad: ${title}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`);
        break;
      case 'gmail':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text} ${url}`)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text} ${url}`)}`);
        break;
      default:
        if (navigator.share) {
          navigator.share({ title, text, url });
        } else {
          navigator.clipboard.writeText(url);
          toast({
            title: "Enlace copiado",
            description: "El enlace se ha copiado al portapapeles",
          });
        }
    }
  };

  const openMap = () => {
    const url = `https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}`;
    window.open(url, '_blank');
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
              
              {/* Navigation arrows */}
              <Button
                size="sm"
                variant="secondary"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                disabled={property.images.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                disabled={property.images.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

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
                  onClick={() => handleShare('default')}
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
            
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
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
            <Card className="mb-6">
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

            {/* Features Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="price" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="price" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Price & Bills
                    </TabsTrigger>
                    <TabsTrigger value="tenant" className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Tenant Preference
                    </TabsTrigger>
                    <TabsTrigger value="availability" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Availability
                    </TabsTrigger>
                    <TabsTrigger value="features" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Features
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="price" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Deposit</span>
                        <span className="font-semibold">€{property.deposit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Rent PCM</span>
                        <span className="font-semibold">€{property.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Bills Included</span>
                        {property.billsIncluded ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Broadband</span>
                        {property.internet ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <span className="text-blue-600 text-sm">View Offers</span>
                        }
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tenant" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Student Friendly</span>
                        {property.preferences.students ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Families Allowed</span>
                        {property.preferences.families ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Pets Allowed</span>
                        {property.preferences.pets ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Smokers Allowed</span>
                        {property.preferences.smokers ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">DSS/LHA Covers Rent</span>
                        {property.preferences.dssLha ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Máximos inquilinos</span>
                        <span className="font-semibold">{property.maxTenants}</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="availability" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Available From</span>
                        <span className="font-semibold">
                          {new Date(property.availableFrom).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Minimum Tenancy</span>
                        <span className="font-semibold">{property.minimumTenancy} Months</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Online Viewings</span>
                        {property.availability.virtualTour ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Garden</span>
                        {property.amenities.garden ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Parking</span>
                        {property.amenities.parking ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Fireplace</span>
                        {property.amenities.fireplace ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Furnishing</span>
                        <span className="text-sm text-gray-600">
                          {property.amenities.furnished ? 'Furnished' : 'At tenant choice'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">EPC Rating</span>
                        <Badge variant="secondary" className="font-semibold">
                          {property.amenities.energyRating}
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Mapa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapIcon className="h-5 w-5 mr-2" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">{property.location}</p>
                    <Button onClick={openMap} variant="outline">
                      Ver en Google Maps
                    </Button>
                  </div>
                </div>
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

                <div className="text-3xl font-bold text-gray-900 mb-2">
                  €{property.price.toLocaleString()}
                  <span className="text-lg font-normal text-gray-600">/mes</span>
                </div>
                <div className="text-sm text-green-600 font-medium mb-6">
                  <div>Sin comisiones</div>
                  <div>Sin letra pequeña</div>
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
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Responde al {property.landlord.responseRate}% de los mensajes
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Suele responder en {property.landlord.responseTime} días
                    </div>
                  </div>
                </div>

                {/* Botón de contacto */}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
                  onClick={handleContact}
                >
                  Contactar propietario o concertar visita
                </Button>

                {/* Botones de compartir */}
                <div className="border-t pt-4">
                  <h5 className="font-medium mb-3">Compartir</h5>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare('gmail')}
                      className="flex-1"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Gmail
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare('whatsapp')}
                      className="flex-1"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare('email')}
                      className="flex-1"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  </div>
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
