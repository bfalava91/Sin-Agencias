
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Bed, Bath, Car, Flame, Users, Check, X, Edit, Home } from "lucide-react";

interface ListingViewProps {
  listing: any;
  onBack: () => void;
  onEdit: () => void;
}

const ListingView = ({ listing, onBack, onEdit }: ListingViewProps) => {
  const getPropertyTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'studio': 'Estudio',
      'bedsit': 'Estudio Pequeño',
      'detached': 'Casa Independiente',
      'semi-detached': 'Casa Adosada',
      'terraced': 'Casa en Hilera',
      'bungalow': 'Bungalow',
      'flat': 'Piso',
      'penthouse': 'Ático',
      'maisonette': 'Dúplex'
    };
    return types[type] || type;
  };

  const getFurnishingLabel = (furnishing: string) => {
    const labels: { [key: string]: string } = {
      'furnished': 'Amueblado',
      'unfurnished': 'Sin Amueblar',
      'choice': 'A elección del inquilino'
    };
    return labels[furnishing] || furnishing;
  };

  const getDepositLabel = (deposit: string) => {
    const labels: { [key: string]: string } = {
      'none': 'Sin fianza',
      '2-weeks': '2 semanas de alquiler',
      '1-month': '1 mes de alquiler',
      '2-months': '2 meses de alquiler',
      'custom': 'Personalizado'
    };
    return labels[deposit] || deposit;
  };

  const formatPrice = () => {
    if (listing.monthly_rent) {
      return `€${listing.monthly_rent}/mes`;
    }
    if (listing.weekly_rent) {
      return `€${listing.weekly_rent}/semana`;
    }
    return 'Precio no especificado';
  };

  const getFeaturesList = () => {
    if (!listing.features) return [];
    return listing.features.split('\n').filter((f: string) => f.trim() !== '');
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Gestionar Anuncios
        </Button>
        
        <Button onClick={onEdit} className="flex items-center">
          <Edit className="mr-2 h-4 w-4" />
          Editar Anuncio
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-2">
          <h1 className="text-3xl font-bold">Vista del Anuncio</h1>
          {getStatusBadge(listing.status)}
        </div>
        <p className="text-gray-600">
          Creado el {new Date(listing.created_at).toLocaleDateString()}
          {listing.updated_at !== listing.created_at && 
            ` • Actualizado el ${new Date(listing.updated_at).toLocaleDateString()}`
          }
        </p>
      </div>

      {/* Main Listing Card */}
      <Card className="mb-6">
        <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
          <p className="text-white text-lg font-medium">
            Imagen de la propiedad (Próximamente)
          </p>
        </div>
        
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {getPropertyTypeLabel(listing.property_type)} en {listing.neighborhood || listing.town}
              </h2>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {[listing.neighborhood, listing.town, listing.postcode]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {formatPrice()}
              </div>
              {listing.deposit && (
                <div className="text-sm text-gray-600">
                  Fianza: {getDepositLabel(listing.deposit)}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {listing.bedrooms && (
              <div className="flex items-center space-x-2">
                <Bed className="h-5 w-5 text-gray-500" />
                <span>{listing.bedrooms} dormitorio{listing.bedrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            {listing.bathrooms && (
              <div className="flex items-center space-x-2">
                <Bath className="h-5 w-5 text-gray-500" />
                <span>{listing.bathrooms} baño{listing.bathrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            {listing.square_meters && (
              <div className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-gray-500" />
                <span>{listing.square_meters} m²</span>
              </div>
            )}
            {listing.parking && (
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-gray-500" />
                <span>Parking</span>
              </div>
            )}
            {listing.fireplace && (
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-gray-500" />
                <span>Chimenea</span>
              </div>
            )}
          </div>

          {listing.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

          {getFeaturesList().length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Características Destacadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getFeaturesList().map((feature: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Property Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Detalles de la Propiedad</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-500">Tipo de Anuncio</span>
                <div className="font-medium">
                  {listing.advert_type === 'whole-property' ? 'Propiedad Completa' : 'Habitaciones Individuales'}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Amueblado</span>
                <div className="font-medium">{getFurnishingLabel(listing.furnishing)}</div>
              </div>
              {listing.square_meters && (
                <div>
                  <span className="text-sm text-gray-500">Superficie</span>
                  <div className="font-medium">{listing.square_meters} m²</div>
                </div>
              )}
              {listing.min_tenancy && (
                <div>
                  <span className="text-sm text-gray-500">Duración Mínima</span>
                  <div className="font-medium">{listing.min_tenancy} meses</div>
                </div>
              )}
              {listing.max_tenants && (
                <div>
                  <span className="text-sm text-gray-500">Max. Inquilinos</span>
                  <div className="font-medium">{listing.max_tenants}</div>
                </div>
              )}
              {listing.move_in_date && (
                <div>
                  <span className="text-sm text-gray-500">Disponible desde</span>
                  <div className="font-medium">{new Date(listing.move_in_date).toLocaleDateString()}</div>
                </div>
              )}
              {listing.flat_number && (
                <div>
                  <span className="text-sm text-gray-500">Número de Piso</span>
                  <div className="font-medium">{listing.flat_number}</div>
                </div>
              )}
            </div>
          </div>

          {/* Address Details */}
          {(listing.address_line_2 || listing.address_line_3) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Dirección Completa</h3>
              <div className="space-y-1">
                {listing.address_line_2 && <p className="text-gray-700">{listing.address_line_2}</p>}
                {listing.address_line_3 && <p className="text-gray-700">{listing.address_line_3}</p>}
                <p className="text-gray-700">{listing.town}, {listing.postcode}</p>
              </div>
            </div>
          )}

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Características Incluidas</h3>
            <div className="flex flex-wrap gap-2">
              {listing.bills_included && <Badge variant="secondary">Gastos Incluidos</Badge>}
              {listing.garden_access && <Badge variant="secondary">Acceso a Jardín</Badge>}
              {listing.parking && <Badge variant="secondary">Parking</Badge>}
              {listing.fireplace && <Badge variant="secondary">Chimenea</Badge>}
              {listing.remote_viewings && <Badge variant="secondary">Visitas Remotas</Badge>}
            </div>
          </div>

          {/* Tenant Preferences */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Preferencias de Inquilinos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                {listing.students_allowed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">Estudiantes</span>
              </div>
              <div className="flex items-center space-x-2">
                {listing.families_allowed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">Familias</span>
              </div>
              <div className="flex items-center space-x-2">
                {listing.pets_allowed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">Mascotas</span>
              </div>
              <div className="flex items-center space-x-2">
                {listing.smokers_allowed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">Fumadores</span>
              </div>
              <div className="flex items-center space-x-2">
                {listing.dss_accepted ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">DSS</span>
              </div>
              {listing.students_only && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Solo Estudiantes</span>
                </div>
              )}
            </div>
          </div>

          {listing.availability && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Disponibilidad para Visitas</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.availability}</p>
            </div>
          )}

          {listing.youtube_url && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Video de YouTube</h3>
              <a 
                href={listing.youtube_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {listing.youtube_url}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingView;
