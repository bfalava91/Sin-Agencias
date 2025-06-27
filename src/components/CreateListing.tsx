import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useListings, ListingFormData } from "@/hooks/useListings";

interface CreateListingProps {
  onBack: () => void;
}

const CreateListing = ({ onBack }: CreateListingProps) => {
  const { user } = useAuth();
  const { createListing, isLoading } = useListings();
  const [formData, setFormData] = useState<ListingFormData>({
    isReadvertising: false,
    postcode: "",
    flatNumber: "",
    addressLine2: "",
    addressLine3: "",
    town: "",
    advertType: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    furnishing: "",
    description: "",
    monthlyRent: "",
    weeklyRent: "",
    deposit: "",
    minTenancy: "",
    maxTenants: "",
    moveInDate: "",
    billsIncluded: false,
    gardenAccess: false,
    parking: false,
    fireplace: false,
    studentsAllowed: false,
    familiesAllowed: false,
    dssAccepted: false,
    petsAllowed: false,
    smokersAllowed: false,
    studentsOnly: false,
    availability: "",
    remoteViewings: false,
    youtubeUrl: "",
    agreedToTerms: false
  });

  const handleInputChange = (field: keyof ListingFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['postcode', 'town', 'advertType', 'propertyType', 'bedrooms', 'bathrooms', 'furnishing'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof ListingFormData]);
    
    if (missingFields.length > 0) {
      return `Por favor completa los siguientes campos obligatorios: ${missingFields.join(', ')}`;
    }
    
    if (!formData.monthlyRent && !formData.weeklyRent) {
      return "Debes especificar al menos el alquiler mensual o semanal";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    
    if (!user) {
      return;
    }

    if (publish && !formData.agreedToTerms) {
      console.log('Must agree to terms to publish');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      console.log('Validation error:', validationError);
      return;
    }

    console.log('Submitting form with data:', formData);
    
    const result = await createListing(formData, publish);
    
    if (result.success) {
      onBack();
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Acceso Restringido</h1>
        <p className="text-gray-600 mb-6">
          Debes iniciar sesión para crear un anuncio de propiedad.
        </p>
        <Button onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 flex items-center"
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Crear Nuevo Anuncio</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            1. Detalles de la Propiedad
          </span>
          <span className="text-gray-400">2. Vista Previa</span>
          <span className="text-gray-400">3. Publicar</span>
        </div>
      </div>

      <form className="space-y-8">
        {/* Re-advertising Question */}
        <Card>
          <CardHeader>
            <CardTitle>¿Vuelves a anunciar con nosotros?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Podemos ver que has anunciado con nosotros antes. Si buscas volver a anunciar, 
              podemos usar los detalles de cualquiera de tus anuncios antiguos para ahorrarte 
              tiempo.
            </p>
            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant={formData.isReadvertising ? "default" : "outline"}
                onClick={() => handleInputChange("isReadvertising", true)}
                disabled={isLoading}
              >
                Sí - Busco volver a anunciar
              </Button>
              <Button 
                type="button" 
                variant={!formData.isReadvertising ? "default" : "outline"}
                onClick={() => handleInputChange("isReadvertising", false)}
                disabled={isLoading}
              >
                No - Este es un nuevo anuncio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Propiedad *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postcode">Código Postal *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => handleInputChange("postcode", e.target.value)}
                    placeholder="Ej: 28001"
                    required
                    disabled={isLoading}
                  />
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Buscar Dirección
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="flatNumber">Número de Piso o Casa (privado)</Label>
                <Input
                  id="flatNumber"
                  value={formData.flatNumber}
                  onChange={(e) => handleInputChange("flatNumber", e.target.value)}
                  placeholder="Ej: 2A"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addressLine2">Línea de Dirección 2 (opcional)</Label>
                <Input
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="addressLine3">Línea de Dirección 3 (opcional)</Label>
                <Input
                  id="addressLine3"
                  value={formData.addressLine3}
                  onChange={(e) => handleInputChange("addressLine3", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="town">Ciudad *</Label>
              <Input
                id="town"
                value={formData.town}
                onChange={(e) => handleInputChange("town", e.target.value)}
                placeholder="Ej: Madrid"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Anuncio *</Label>
                <Select 
                  value={formData.advertType} 
                  onValueChange={(value) => handleInputChange("advertType", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whole-property">Propiedad Completa</SelectItem>
                    <SelectItem value="individual-rooms">Habitaciones Individuales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Tipo de Propiedad *</Label>
                <Select 
                  value={formData.propertyType} 
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Estudio</SelectItem>
                    <SelectItem value="bedsit">Estudio Pequeño</SelectItem>
                    <SelectItem value="detached">Casa Independiente</SelectItem>
                    <SelectItem value="semi-detached">Casa Adosada</SelectItem>
                    <SelectItem value="terraced">Casa en Hilera</SelectItem>
                    <SelectItem value="bungalow">Bungalow</SelectItem>
                    <SelectItem value="flat">Piso</SelectItem>
                    <SelectItem value="penthouse">Ático</SelectItem>
                    <SelectItem value="maisonette">Dúplex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Número de Dormitorios *</Label>
                <Select 
                  value={formData.bedrooms} 
                  onValueChange={(value) => handleInputChange("bedrooms", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Número de Baños *</Label>
                <Select 
                  value={formData.bathrooms} 
                  onValueChange={(value) => handleInputChange("bathrooms", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Amueblado *</Label>
                <Select 
                  value={formData.furnishing} 
                  onValueChange={(value) => handleInputChange("furnishing", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furnished">Amueblado</SelectItem>
                    <SelectItem value="unfurnished">Sin Amueblar</SelectItem>
                    <SelectItem value="choice">A elección del inquilino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción de la Propiedad</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={6}
                placeholder="Describe tu propiedad..."
                disabled={isLoading}
              />
              <div className="flex space-x-2 mt-2">
                <Button type="button" variant="outline" size="sm" disabled={isLoading}>
                  Escribir Descripción Ahora
                </Button>
                <Button type="button" variant="outline" size="sm" disabled={isLoading}>
                  Generar Descripción Inteligente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenancy Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de Alquiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyRent">Alquiler Mensual (€)</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange("monthlyRent", e.target.value)}
                  placeholder="1200"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="weeklyRent">Alquiler Semanal (€)</Label>
                <Input
                  id="weeklyRent"
                  type="number"
                  value={formData.weeklyRent}
                  onChange={(e) => handleInputChange("weeklyRent", e.target.value)}
                  placeholder="300"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Cantidad de Fianza</Label>
                <Select 
                  value={formData.deposit} 
                  onValueChange={(value) => handleInputChange("deposit", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin fianza</SelectItem>
                    <SelectItem value="2-weeks">2 semanas de alquiler</SelectItem>
                    <SelectItem value="1-month">1 mes de alquiler</SelectItem>
                    <SelectItem value="2-months">2 meses de alquiler</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="minTenancy">Duración Mínima de Alquiler (meses)</Label>
                <Input
                  id="minTenancy"
                  type="number"
                  value={formData.minTenancy}
                  onChange={(e) => handleInputChange("minTenancy", e.target.value)}
                  placeholder="12"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxTenants">Número Máximo de Inquilinos</Label>
                <Input
                  id="maxTenants"
                  type="number"
                  value={formData.maxTenants}
                  onChange={(e) => handleInputChange("maxTenants", e.target.value)}
                  placeholder="2"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="moveInDate">Fecha de Entrada Más Temprana</Label>
                <Input
                  id="moveInDate"
                  type="date"
                  value={formData.moveInDate}
                  onChange={(e) => handleInputChange("moveInDate", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Características</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: "billsIncluded", label: "Gastos Incluidos" },
                { id: "gardenAccess", label: "Acceso a Jardín" },
                { id: "parking", label: "Parking" },
                { id: "fireplace", label: "Chimenea" },
              ].map(feature => (
                <div key={feature.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature.id}
                    checked={formData[feature.id as keyof ListingFormData] as boolean}
                    onCheckedChange={(checked) => handleInputChange(feature.id as keyof ListingFormData, checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor={feature.id}>{feature.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tenant Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferencias de Inquilinos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: "studentsAllowed", label: "Estudiantes Permitidos" },
                { id: "familiesAllowed", label: "Familias Permitidas" },
                { id: "dssAccepted", label: "Ingresos DSS Aceptados" },
                { id: "petsAllowed", label: "Mascotas Permitidas" },
                { id: "smokersAllowed", label: "Fumadores Permitidos" },
                { id: "studentsOnly", label: "Solo Estudiantes" },
              ].map(preference => (
                <div key={preference.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={preference.id}
                    checked={formData[preference.id as keyof ListingFormData] as boolean}
                    onCheckedChange={(checked) => handleInputChange(preference.id as keyof ListingFormData, checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor={preference.id}>{preference.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Disponibilidad para Visitas (opcional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Textarea
                value={formData.availability}
                onChange={(e) => handleInputChange("availability", e.target.value)}
                rows={3}
                placeholder="Describe tu disponibilidad para mostrar la propiedad..."
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remoteViewings"
                checked={formData.remoteViewings}
                onCheckedChange={(checked) => handleInputChange("remoteViewings", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="remoteViewings">Visitas por Video Remotas</Label>
            </div>
          </CardContent>
        </Card>

        {/* Photos & Videos */}
        <Card>
          <CardHeader>
            <CardTitle>Fotos y Videos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                La funcionalidad de subida de imágenes estará disponible próximamente
              </p>
              <Button type="button" variant="outline" disabled>
                Añadir Fotos (Próximamente)
              </Button>
            </div>
            
            <div>
              <Label htmlFor="youtubeUrl">Opcional: Añadir URL de YouTube</Label>
              <Input
                id="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={(e) => handleInputChange("youtubeUrl", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Términos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-sm">
                Confirmo que no cobro tasas administrativas a los inquilinos, que no soy una agencia, 
                el propietario de esta propiedad y tengo derecho a ofrecerla en alquiler, y acepto 
                los Términos y Condiciones y la Política de Privacidad de Sin Agencias.
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button 
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar como Borrador'
            )}
          </Button>
          <Button 
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="flex-1"
            disabled={isLoading || !formData.agreedToTerms}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              'Publicar Anuncio'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
