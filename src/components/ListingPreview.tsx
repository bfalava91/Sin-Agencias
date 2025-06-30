
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Bed, Bath, Car, Flame, Users, Check, X, Loader2 } from "lucide-react";
import { ListingFormData } from "@/hooks/useListings";

interface ListingPreviewProps {
  formData: ListingFormData;
  onBack: () => void;
  onPublish: () => void;
  isLoading: boolean;
}

const ListingPreview = ({ formData, onBack, onPublish, isLoading }: ListingPreviewProps) => {
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
    if (formData.monthlyRent) {
      return `€${formData.monthlyRent}/mes`;
    }
    if (formData.weeklyRent) {
      return `€${formData.weeklyRent}/semana`;
    }
    return 'Precio no especificado';
  };

  const getFeaturesList = () => {
    if (!formData.features) return [];
    return formData.features.split('\n').filter(f => f.trim() !== '');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 flex items-center"
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Editar
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vista Previa del Anuncio</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="text-gray-400">1. Detalles de la Propiedad</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            2. Vista Previa
          </span>
          <span className="text-gray-400">3. Publicar</span>
        </div>
      </div>

      {/* Main Listing Card */}
      <Card className="mb-6">
        {/* Image Section */}
        <div className="relative h-64 rounded-t-lg overflow-hidden">
          {formData.images && formData.images.length > 0 ? (
            <div className="w-full h-full">
              <img
                src={formData.images[0]}
                alt="Imagen principal de la propiedad"
                className="w-full h-full object-cover"
              />
              {formData.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                  +{formData.images.length - 1} más
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center h-full">
              <p className="text-white text-lg font-medium">
                Sin imágenes subidas
              </p>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {getPropertyTypeLabel(formData.propertyType)} en {formData.neighborhood || formData.town}
              </h2>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {[formData.neighborhood, formData.town, formData.postcode]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {formatPrice()}
              </div>
              {formData.deposit && (
                <div className="text-sm text-gray-600">
                  Fianza: {getDepositLabel(formData.deposit)}
                </div>
              )}
            </div>
          </div>

          {/* Additional Images Grid */}
          {formData.images && formData.images.length > 1 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Galería de Imágenes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Imagen ${index + 2} de la propiedad`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                ))}
                {formData.images.length > 5 && (
                  <div className="flex items-center justify-center bg-gray-100 rounded-lg h-24">
                    <span className="text-gray-600 text-sm font-medium">
                      +{formData.images.length - 5} más
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {formData.bedrooms && (
              <div className="flex items-center space-x-2">
                <Bed className="h-5 w-5 text-gray-500" />
                <span>{formData.bedrooms} dormitorio{parseInt(formData.bedrooms) > 1 ? 's' : ''}</span>
              </div>
            )}
            {formData.bathrooms && (
              <div className="flex items-center space-x-2">
                <Bath className="h-5 w-5 text-gray-500" />
                <span>{formData.bathrooms} baño{parseInt(formData.bathrooms) > 1 ? 's' : ''}</span>
              </div>
            )}
            {formData.parking && (
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-gray-500" />
                <span>Parking</span>
              </div>
            )}
            {formData.fireplace && (
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-gray-500" />
                <span>Chimenea</span>
              </div>
            )}
          </div>

          {formData.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
            </div>
          )}

          {getFeaturesList().length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Características Destacadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getFeaturesList().map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Property Features */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Detalles de la Propiedad</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-500">Tipo de Anuncio</span>
                <div className="font-medium">
                  {formData.advertType === 'whole-property' ? 'Propiedad Completa' : 'Habitaciones Individuales'}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Amueblado</span>
                <div className="font-medium">{getFurnishingLabel(formData.furnishing)}</div>
              </div>
              {formData.minTenancy && (
                <div>
                  <span className="text-sm text-gray-500">Duración Mínima</span>
                  <div className="font-medium">{formData.minTenancy} meses</div>
                </div>
              )}
              {formData.maxTenants && (
                <div>
                  <span className="text-sm text-gray-500">Max. Inquilinos</span>
                  <div className="font-medium">{formData.maxTenants}</div>
                </div>
              )}
              {formData.moveInDate && (
                <div>
                  <span className="text-sm text-gray-500">Disponible desde</span>
                  <div className="font-medium">{new Date(formData.moveInDate).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Características Incluidas</h3>
            <div className="flex flex-wrap gap-2">
              {formData.billsIncluded && <Badge variant="secondary">Gastos Incluidos</Badge>}
              {formData.gardenAccess && <Badge variant="secondary">Acceso a Jardín</Badge>}
              {formData.parking && <Badge variant="secondary">Parking</Badge>}
              {formData.fireplace && <Badge variant="secondary">Chimenea</Badge>}
              {formData.remoteViewings && <Badge variant="secondary">Visitas Remotas</Badge>}
            </div>
          </div>

          {/* Tenant Preferences */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Preferencias de Inquilinos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                {formData.studentsAllowed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">Estudiantes</span>
              </div>
              <div className="flex items-center space-x-2">
                {formData.familiesAllowed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">Familias</span>
              </div>
              <div className="flex items-center space-x-2">
                {formData.petsAllowed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">Mascotas</span>
              </div>
              <div className="flex items-center space-x-2">
                {formData.smokersAllowed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">Fumadores</span>
              </div>
              {formData.studentsOnly && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Solo Estudiantes</span>
                </div>
              )}
            </div>
          </div>

          {formData.availability && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Disponibilidad para Visitas</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{formData.availability}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publish Button */}
      <div className="flex justify-center">
        <Button 
          onClick={onPublish}
          size="lg"
          className="px-8 py-3 text-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Publicando...
            </>
          ) : (
            'Publicar Anuncio'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ListingPreview;
