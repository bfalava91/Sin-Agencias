
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Eye, Trash2, Upload, Play } from "lucide-react";
import { useListings } from "@/hooks/useListings";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CreateListing from "./CreateListing";
import ListingView from "./ListingView";

interface ManageListingsProps {
  onBack: () => void;
  onCreateNew: () => void;
}

const ManageListings = ({ onBack, onCreateNew }: ManageListingsProps) => {
  const { fetchUserListings, fetchSingleListing } = useListings();
  const { toast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'view' | 'edit'>('list');

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

  const handleViewListing = async (listingId: string) => {
    const result = await fetchSingleListing(listingId);
    if (result.success) {
      setSelectedListing(result.data);
      setViewMode('view');
    } else {
      toast({
        title: "Error al cargar anuncio",
        description: "No se pudo cargar el anuncio seleccionado.",
        variant: "destructive",
      });
    }
  };

  const handleEditListing = async (listingId: string) => {
    const result = await fetchSingleListing(listingId);
    if (result.success) {
      setSelectedListing(result.data);
      setViewMode('edit');
    } else {
      toast({
        title: "Error al cargar anuncio",
        description: "No se pudo cargar el anuncio para editar.",
        variant: "destructive",
      });
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedListing(null);
    loadListings(); // Reload listings to reflect any changes
  };

  const publishListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'active' })
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: "¡Anuncio publicado!",
        description: "Tu anuncio está ahora activo y visible para inquilinos.",
      });

      loadListings();
    } catch (error: any) {
      console.error('Error publishing listing:', error);
      toast({
        title: "Error al publicar",
        description: "No se pudo publicar el anuncio. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const pauseListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'paused' })
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: "Anuncio pausado",
        description: "Tu anuncio ha sido pausado y ya no es visible.",
      });

      loadListings();
    } catch (error: any) {
      console.error('Error pausing listing:', error);
      toast({
        title: "Error al pausar",
        description: "No se pudo pausar el anuncio. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const deleteListing = async (listingId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este anuncio? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: "Anuncio eliminado",
        description: "El anuncio ha sido eliminado permanentemente.",
      });

      loadListings();
    } catch (error: any) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el anuncio. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
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

  // Render edit mode
  if (viewMode === 'edit' && selectedListing) {
    return (
      <CreateListing 
        onBack={handleBackToList}
        editingListing={selectedListing}
      />
    );
  }

  // Render view mode
  if (viewMode === 'view' && selectedListing) {
    return (
      <ListingView 
        listing={selectedListing}
        onBack={handleBackToList}
        onEdit={() => setViewMode('edit')}
      />
    );
  }

  // Render list mode
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

                <div className="flex space-x-2 flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewListing(listing.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditListing(listing.id)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  
                  {listing.status === 'draft' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => publishListing(listing.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Publicar
                    </Button>
                  )}
                  
                  {listing.status === 'active' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => pauseListing(listing.id)}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      Pausar
                    </Button>
                  )}
                  
                  {listing.status === 'paused' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => publishListing(listing.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Reactivar
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => deleteListing(listing.id)}
                  >
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
