
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Eye, Trash2, Upload } from "lucide-react";
import { useListings } from "@/hooks/useListings";
import { useToast } from "@/hooks/use-toast";

interface ManageListingsProps {
  onBack: () => void;
  onCreateNew: () => void;
}

const ManageListings = ({ onBack, onCreateNew }: ManageListingsProps) => {
  const { fetchUserListings } = useListings();
  const { toast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setIsLoading(true);
    const result = await fetchUserListings();
    
    if (result.success) {
      setListings(result.data || []);
    } else {
      toast({
        title: "Error al cargar anuncios",
        description: "No se pudieron cargar tus anuncios.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Borrador</Badge>;
      case 'active':
        return <Badge variant="default">Activo</Badge>;
      case 'paused':
        return <Badge variant="outline">Pausado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatPrice = (monthlyRent?: number, weeklyRent?: number) => {
    if (monthlyRent) return `€${monthlyRent}/mes`;
    if (weeklyRent) return `€${weeklyRent}/semana`;
    return 'Precio no especificado';
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Cargando anuncios...</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Dashboard
      </Button>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestionar Anuncios</h1>
          <p className="text-gray-600">
            {listings.length === 0 
              ? "No tienes anuncios aún" 
              : `${listings.length} anuncio${listings.length > 1 ? 's' : ''} encontrado${listings.length > 1 ? 's' : ''}`
            }
          </p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center">
          <Upload className="mr-2 h-4 w-4" />
          Crear Nuevo Anuncio
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">No hay anuncios</h3>
            <p className="text-gray-600 mb-4">
              Aún no has creado ningún anuncio. ¡Crea tu primer anuncio ahora!
            </p>
            <Button onClick={onCreateNew}>
              Crear Primer Anuncio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">
                      {listing.property_type} en {listing.town}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusBadge(listing.status)}
                      <span className="text-sm text-gray-500">
                        Creado el {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {formatPrice(listing.monthly_rent, listing.weekly_rent)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Dormitorios</span>
                    <div className="font-medium">{listing.bedrooms || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Baños</span>
                    <div className="font-medium">{listing.bathrooms || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Tipo</span>
                    <div className="font-medium">{listing.advert_type || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Amueblado</span>
                    <div className="font-medium">{listing.furnishing || 'N/A'}</div>
                  </div>
                </div>
                
                {listing.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageListings;
