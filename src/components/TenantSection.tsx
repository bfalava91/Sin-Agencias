
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const TenantSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearchProperties = () => {
    navigate('/search');
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
            <Search className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">
              Para inquilinos
            </h2>
          </div>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            En Sin Agencias siempre estás en contacto directo con los propietarios. Sin comisiones, sin estafas… ¡Sin agencias! 
            Retiramos los anuncios en el momento en que se alquilan los pisos.
          </p>
          
          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700 font-medium">Sin comisiones administrativas</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700 font-medium">Sin anuncios muertos</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700 font-medium">Depósito y alquiler protegido</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg font-semibold"
              onClick={handleSearchProperties}
            >
              Buscar propiedades
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 text-lg font-semibold"
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

export default TenantSection;
