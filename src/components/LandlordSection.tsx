
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LandlordSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStartListing = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/profile');
  };

  const handleLearnMore = () => {
    toast({
      title: "Próximamente",
      description: "Más información sobre nuestros servicios estará disponible pronto.",
    });
  };

  return (
    <Card className="overflow-hidden shadow-xl border-0 h-full">
      <CardContent className="p-8">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-6">
            <Home className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">
              Para propietarios
            </h2>
          </div>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Te encontramos inquilinos y te ayudamos con las referencias, contratos y más si te hace falta. 
            SinAgencias te ofrece las mejores posibilidades de encontrar tu inquilino ideal.
          </p>
          
          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700 font-medium">Opción de anunciarse 100% gratis</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700 font-medium">Sin comisiones escondidas</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700 font-medium">Sin comisiones de renovación</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-semibold"
              onClick={handleStartListing}
            >
              Empezar a anunciarse
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 text-lg font-semibold"
              onClick={handleLearnMore}
            >
              Cuéntame más
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandlordSection;
