
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2 } from "lucide-react";
import { useListings } from "@/hooks/useListings";

interface ProfileDashboardProps {
  onCreateListing: () => void;
  onManageListings: () => void;
}

const ProfileDashboard = ({ onCreateListing, onManageListings }: ProfileDashboardProps) => {
  const { fetchUserListings } = useListings();
  const [stats, setStats] = useState({
    activeListings: 0,
    totalViews: 0,
    contacts: 0,
    favorites: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const result = await fetchUserListings();
    
    if (result.success && result.data) {
      const activeListings = result.data.filter(listing => listing.status === 'active').length;
      setStats(prev => ({
        ...prev,
        activeListings
      }));
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Gestiona tus propiedades y anuncios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onCreateListing}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Crear Nuevo Anuncio</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Publica tu propiedad y encuentra inquilinos de calidad
            </p>
            <Button className="w-full">
              Crear Anuncio
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onManageListings}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Gestionar Anuncios</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Edita, pausa o elimina tus anuncios existentes
            </p>
            <Button variant="outline" className="w-full">
              Ver Anuncios
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Estadísticas Recientes</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.activeListings}</div>
              <div className="text-sm text-gray-600">Anuncios Activos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalViews}</div>
              <div className="text-sm text-gray-600">Vistas Totales</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.contacts}</div>
              <div className="text-sm text-gray-600">Contactos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.favorites}</div>
              <div className="text-sm text-gray-600">Favoritos</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
