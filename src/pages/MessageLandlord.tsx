
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
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

const MessageLandlord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [availability, setAvailability] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock property data - in real app would come from API
  const property = {
    title: "1 Bed Flat, Cornelyn Manor, LL58",
    landlord: {
      name: "Nick and Dawn S.",
      joinedDate: "4 years ago",
      email: "bosco.fach@gmail.com",
      phone: "+447889548955",
      availability: "We are not able to start arranging viewings until the week starting June 30."
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

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado al propietario. Te responderán pronto.",
      });
      setIsSubmitting(false);
      navigate(-1);
    }, 1000);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

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
                <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
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
                  <h4 className="font-semibold text-lg">{property.landlord.name}</h4>
                  <Badge variant="secondary" className="mt-1">
                    Se unió hace {property.landlord.joinedDate}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {property.landlord.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {property.landlord.phone}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-sm mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Disponibilidad para visitas:
                  </h5>
                  <p className="text-sm text-gray-700">{property.landlord.availability}</p>
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
