
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft,
  User,
  Calendar,
  Home,
  MessageSquare,
  Phone,
  Mail
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Listing {
  id: string;
  user_id: string;
  address_line_2?: string;
  town?: string;
  postcode?: string;
  property_type?: string;
  bedrooms?: number;
}

interface LandlordProfile {
  full_name?: string;
  email: string;
  phone?: string;
  created_at: string;
}

const MessageLandlord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [availability, setAvailability] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);
  const [landlordProfile, setLandlordProfile] = useState<LandlordProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (id) {
      fetchListingAndLandlord();
    }
  }, [user, id]);

  const fetchListingAndLandlord = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      
      // Fetch listing details
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('id, user_id, address_line_2, town, postcode, property_type, bedrooms')
        .eq('id', id)
        .single();

      if (listingError) {
        console.error('Error fetching listing:', listingError);
        toast({
          title: "Error",
          description: "No se pudo cargar la información de la propiedad",
          variant: "destructive",
        });
        return;
      }

      setListing(listingData);

      // Fetch landlord profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, phone, created_at')
        .eq('id', listingData.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching landlord profile:', profileError);
        // Continue without landlord details - we still have the listing
      } else {
        setLandlordProfile(profileData);
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar los datos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Por favor, escribe un mensaje",
        variant: "destructive",
      });
      return;
    }

    if (!user || !listing) {
      toast({
        title: "Error",
        description: "Información de usuario o propiedad no disponible",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine availability and message
      const fullMessage = availability.trim() 
        ? `Disponibilidad para visitas: ${availability}\n\n${message}`
        : message;

      const { error } = await supabase
        .from('messages')
        .insert({
          from_user_id: user.id,
          to_user_id: listing.user_id,
          listing_id: listing.id,
          body: fullMessage
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado al propietario. Te responderán pronto.",
      });
      
      navigate('/messages?tab=sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar el mensaje",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información...</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Propiedad no encontrada</h2>
            <p className="text-gray-600">La propiedad que buscas no existe o no está disponible.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Format property title
  const propertyTitle = `${listing.property_type || 'Propiedad'} ${listing.bedrooms ? `de ${listing.bedrooms} dormitorio${listing.bedrooms > 1 ? 's' : ''}` : ''}, ${listing.town || 'Ubicación'}, ${listing.postcode || ''}`.trim();

  // Calculate how long ago the landlord joined
  const getJoinedTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = Math.floor(diffDays / 365);
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffYears > 0) {
      return `${diffYears} año${diffYears > 1 ? 's' : ''}`;
    } else if (diffMonths > 0) {
      return `${diffMonths} mes${diffMonths > 1 ? 'es' : ''}`;
    } else {
      return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property and Landlord Info */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Propiedad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{propertyTitle}</h3>
                {listing.address_line_2 && (
                  <p className="text-sm text-gray-600">{listing.address_line_2}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Propietario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">
                    {landlordProfile?.full_name || 'Propietario'}
                  </h4>
                  {landlordProfile && (
                    <Badge variant="secondary" className="mt-1">
                      Se unió hace {getJoinedTime(landlordProfile.created_at)}
                    </Badge>
                  )}
                </div>

                {landlordProfile && (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {landlordProfile.email}
                    </div>
                    {landlordProfile.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {landlordProfile.phone}
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-sm mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Disponibilidad para visitas:
                  </h5>
                  <p className="text-sm text-gray-700">
                    El propietario responderá sobre la disponibilidad para visitas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Mensaje al Propietario / Solicitar Visita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="availability">
                    ¿Cuándo estás disponible para visitas? (máx. 200 caracteres)
                  </Label>
                  <Input
                    id="availability"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    maxLength={200}
                    placeholder="Ej: Disponible de lunes a viernes por las tardes"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {availability.length}/200 caracteres
                  </p>
                </div>

                <div>
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    rows={6}
                    className="mt-2"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Nota:</strong> Para evitar consultas repetidas a los propietarios, 
                    solo podrás enviar este formulario una vez por propiedad.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Handle message without viewing request
                      toast({
                        title: "Función disponible próximamente",
                        description: "Esta opción estará disponible en breve",
                      });
                    }}
                    className="flex-1"
                  >
                    Enviar mensaje sin solicitar visita
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

export default MessageLandlord;
