
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
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
  MapIcon,
  Mail,
  MessageSquare,
  UserCheck,
  Building,
  CreditCard,
  Calendar as CalendarIcon,
  Home,
  Send
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Listing {
  id: string;
  title?: string;
  description: string;
  postcode: string;
  town: string;
  neighborhood: string;
  address_line_2?: string;
  address_line_3?: string;
  monthly_rent: number;
  deposit: string;
  bedrooms: number;
  bathrooms: number;
  square_meters?: number;
  property_type: string;
  furnishing: string;
  bills_included: boolean;
  garden_access: boolean;
  parking: boolean;
  fireplace: boolean;
  students_allowed: boolean;
  families_allowed: boolean;
  pets_allowed: boolean;
  smokers_allowed: boolean;
  students_only: boolean;
  max_tenants: number;
  min_tenancy: number;
  move_in_date: string;
  remote_viewings: boolean;
  features: string;
  status: string;
  user_id: string;
  images?: string[] | null;
  profiles?: {
    full_name: string;
    email: string;
  };
}

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      try {
        // First fetch the listing
        const { data: listingData, error: listingError } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .eq('status', 'active')
          .single();

        if (listingError) {
          console.error('Error fetching listing:', listingError);
          toast({
            title: "Error",
            description: "No se pudo cargar la propiedad",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Then fetch the profile separately if we have a user_id
        let profileData = null;
        if (listingData?.user_id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', listingData.user_id)
            .single();

          if (!profileError && profile) {
            profileData = profile;
          }
        }

        // Combine the data
        const listingWithProfiles = {
          ...listingData,
          profiles: profileData
        };

        setListing(listingWithProfiles);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar la propiedad",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate, toast]);

  // Get the actual images from the listing
  const getListingImages = () => {
    if (!listing) return [];
    
    // Handle images safely - always return an array
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
      return listing.images;
    }
    
    // Return fallback image if no images
    return ["https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop"];
  };

  const listingImages = getListingImages();

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === listingImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? listingImages.length - 1 : prev - 1
    );
  };

  const handleContact = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Prevent user from messaging their own listing
    if (user.id === listing?.user_id) {
      toast({
        title: "No puedes contactar",
        description: "No puedes enviar mensajes a tu propio anuncio",
        variant: "destructive",
      });
      return;
    }
    
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = async () => {
    if (!user || !listing || !messageText.trim()) return;

    setIsSendingMessage(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            from_user_id: user.id,
            to_user_id: listing.user_id,
            listing_id: listing.id,
            body: messageText.trim()
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado al propietario",
      });

      setMessageText('');
      setIsMessageModalOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = listing?.title || getTitle();
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
    if (listing?.postcode || listing?.town) {
      const addressParts = [
        listing.address_line_2,
        listing.address_line_3,
        listing.neighborhood,
        listing.town,
        listing.postcode
      ].filter(Boolean);
      
      const query = addressParts.join(', ');
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      window.open(url, '_blank');
    }
  };

  const formatAddress = () => {
    if (!listing) return '';
    const parts = [listing.neighborhood, listing.town].filter(Boolean);
    return parts.join(', ');
  };

  const getFullAddress = () => {
    if (!listing) return '';
    const parts = [
      listing.address_line_2,
      listing.address_line_3,
      listing.neighborhood,
      listing.town,
      listing.postcode
    ].filter(Boolean);
    return parts.join(', ');
  };

  const getTitle = () => {
    if (!listing) return '';
    return listing.title || `${listing.property_type || 'Propiedad'} en ${listing.town || 'ubicación'}`;
  };

  const getAvailabilityText = () => {
    if (!listing?.move_in_date) return 'Disponible Ahora';
    const moveInDate = new Date(listing.move_in_date);
    const today = new Date();
    if (moveInDate <= today) return 'Disponible Ahora';
    return `Disponible desde ${moveInDate.toLocaleDateString('es-ES')}`;
  };

  const parseFeatures = () => {
    if (!listing?.features) return [];
    return listing.features.split('\n').filter(feature => feature.trim() !== '').slice(0, 6);
  };

  const isOwnListing = user && listing && user.id === listing.user_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Propiedad no encontrada</h1>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
        <Footer />
      </div>
    );
  }

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
                src={listingImages[currentImageIndex]}
                alt={getTitle()}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  // Fallback to default image if image fails to load
                  e.currentTarget.src = "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop";
                }}
              />
              
              {/* Navigation arrows */}
              <Button
                size="sm"
                variant="secondary"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                disabled={listingImages.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                disabled={listingImages.length <= 1}
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
            </div>
            
            {/* Show thumbnail gallery if multiple images */}
            {listingImages.length > 1 && (
              <div className="flex space-x-2 mb-6 overflow-x-auto">
                {listingImages.map((image, index) => (
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
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Descripción */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Descripción</h3>
                {listing.description ? (
                  <p className="text-gray-600 mb-6">{listing.description}</p>
                ) : (
                  <p className="text-gray-400 mb-6">No hay descripción disponible</p>
                )}
                
                {parseFeatures().length > 0 && (
                  <>
                    <h4 className="text-lg font-semibold mb-3">Características</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {parseFeatures().map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Detalles de la Propiedad</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Price & Bills */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                      Precio y Gastos
                    </h4>
                    <div className="space-y-3">
                      {listing.deposit && (
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-gray-600">Depósito</span>
                          <span className="font-semibold">{listing.deposit}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Alquiler PCM</span>
                        <span className="font-semibold">€{listing.monthly_rent?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Gastos incluidos</span>
                        {listing.bills_included ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                    </div>
                  </div>

                  {/* Tenant Preference */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4 flex items-center">
                      <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                      Preferencias de Inquilino
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Acepta estudiantes</span>
                        {listing.students_allowed ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Familias permitidas</span>
                        {listing.families_allowed ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Mascotas permitidas</span>
                        {listing.pets_allowed ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Fumadores permitidos</span>
                        {listing.smokers_allowed ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      {listing.max_tenants && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Máximos inquilinos</span>
                          <span className="font-semibold">{listing.max_tenants}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4 flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Disponibilidad
                    </h4>
                    <div className="space-y-3">
                      {listing.move_in_date && (
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-gray-600">Disponible desde</span>
                          <span className="font-semibold">
                            {new Date(listing.move_in_date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                      {listing.min_tenancy && (
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-gray-600">Duración mínima</span>
                          <span className="font-semibold">{listing.min_tenancy} Meses</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Visitas virtuales</span>
                        {listing.remote_viewings ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-blue-600" />
                      Características
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Jardín</span>
                        {listing.garden_access ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Aparcamiento</span>
                        {listing.parking ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Chimenea</span>
                        {listing.fireplace ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      {listing.furnishing && (
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-gray-600">Amueblado</span>
                          <span className="text-sm text-gray-600">
                            {listing.furnishing === 'furnished' ? 'Amueblado' : 
                             listing.furnishing === 'unfurnished' ? 'Sin amueblar' : 
                             'A elección del inquilino'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mapa con Google Maps iframe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapIcon className="h-5 w-5 mr-2" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">{getFullAddress()}</p>
                </div>
                {(listing.postcode || listing.town) && (
                  <div className="h-64 rounded-lg overflow-hidden mb-4">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO5A3xOKRlHHcI&q=${encodeURIComponent(getFullAddress())}`}
                      allowFullScreen
                    />
                  </div>
                )}
                <Button onClick={openMap} variant="outline" className="w-full">
                  Ver en Google Maps
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Información de la propiedad */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {getTitle()}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {formatAddress()}
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-2">
                  €{listing.monthly_rent?.toLocaleString()}
                  <span className="text-lg font-normal text-gray-600">/mes</span>
                </div>
                <div className="text-sm text-green-600 font-medium mb-6">
                  <div>Sin comisiones</div>
                  <div>Sin letra pequeña</div>
                </div>

                <div className="flex items-center space-x-6 mb-6 text-gray-600">
                  {listing.bedrooms && (
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 mr-2" />
                      {listing.bedrooms} hab
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="h-5 w-5 mr-2" />
                      {listing.bathrooms} baño{listing.bathrooms > 1 ? 's' : ''}
                    </div>
                  )}
                  {listing.square_meters && (
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2" />
                      {listing.square_meters} m²
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Calendar className="h-3 w-3 mr-1" />
                    {getAvailabilityText()}
                  </Badge>
                </div>

                {/* Información del propietario */}
                <div className="border-t pt-6 mb-6">
                  <h4 className="font-semibold mb-3">Propietario</h4>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">
                        {listing.profiles?.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{listing.profiles?.full_name || 'Usuario'}</p>
                      <Badge variant="secondary" className="text-xs">
                        Verificado
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Responde a los mensajes
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Suele responder pronto
                    </div>
                  </div>
                </div>

                {/* Botón de contacto */}
                <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
                      onClick={handleContact}
                      disabled={isOwnListing}
                    >
                      {isOwnListing ? 'Tu propio anuncio' : 'Contactar propietario o concertar visita'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Enviar mensaje al propietario</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Enviando mensaje sobre: {getTitle()}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          Para: {listing.profiles?.full_name || 'Usuario'}
                        </p>
                      </div>
                      <Textarea
                        placeholder="Escribe tu mensaje aquí..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        rows={4}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsMessageModalOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!messageText.trim() || isSendingMessage}
                        >
                          {isSendingMessage ? (
                            "Enviando..."
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Enviar mensaje
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

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
