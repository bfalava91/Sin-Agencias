
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
    toast({
      title: "Próximamente",
      description: "La funcionalidad para publicar propiedades estará disponible pronto.",
    });
  };

  const handleLearnMore = () => {
    toast({
      title: "Próximamente",
      description: "Más información sobre nuestros servicios estará disponible pronto.",
    });
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden shadow-xl border-0">
          <CardContent className="p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <Home className="h-8 w-8 text-blue-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    Para propietarios – Anuncia tu propiedad en alquiler
                  </h2>
                </div>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Te encontramos inquilinos y te ayudamos con las referencias, contratos y más si te hace falta. 
                  SinAgencias te ofrece las mejores posibilidades de encontrar tu inquilino ideal, sin perder el control en ningún momento.
                </p>
                
                <div className="space-y-4 mb-8">
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
                    onClick={handleStartListing}
                  >
                    Empezar a anunciarse
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold"
                    onClick={handleLearnMore}
                  >
                    Cuéntame más
                  </Button>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl transform rotate-3"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                    <div className="text-center">
                      <Home className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Tu propiedad</h3>
                      <p className="text-gray-600">Encuentra el inquilino perfecto</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LandlordSection;
