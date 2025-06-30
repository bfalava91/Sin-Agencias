import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, Loader2, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useListings, ListingFormData } from "@/hooks/useListings";
import ListingPreview from "./ListingPreview";

interface CreateListingProps {
  onBack: () => void;
  editingListing?: any;
}

const CreateListing = ({ onBack, editingListing }: CreateListingProps) => {
  const { user } = useAuth();
  const { createListing, updateListing, checkUserHasListings, isLoading } = useListings();
  const [hasExistingListings, setHasExistingListings] = useState(false);
  const [showReadvertisingQuestion, setShowReadvertisingQuestion] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<ListingFormData>({
    isReadvertising: false,
    postcode: "",
    flatNumber: "",
    addressLine2: "",
    addressLine3: "",
    town: "",
    neighborhood: "",
    advertType: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    squareMeters: "",
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
    features: "",
    agreedToTerms: false
  });

  // Individual feature fields for better UX
  const [featureFields, setFeatureFields] = useState({
    feature1: "",
    feature2: "",
    feature3: "",
    feature4: "",
    feature5: "",
    feature6: ""
  });

  useEffect(() => {
    // If editing, populate form with existing data
    if (editingListing) {
      setFormData({
        isReadvertising: editingListing.is_readvertising || false,
        postcode: editingListing.postcode || "",
        flatNumber: editingListing.flat_number || "",
        addressLine2: editingListing.address_line_2 || "",
        addressLine3: editingListing.address_line_3 || "",
        town: editingListing.town || "",
        neighborhood: editingListing.neighborhood || "",
        advertType: editingListing.advert_type || "",
        propertyType: editingListing.property_type || "",
        bedrooms: editingListing.bedrooms ? editingListing.bedrooms.toString() : "",
        bathrooms: editingListing.bathrooms ? editingListing.bathrooms.toString() : "",
        squareMeters: editingListing.square_meters ? editingListing.square_meters.toString() : "",
        furnishing: editingListing.furnishing || "",
        description: editingListing.description || "",
        monthlyRent: editingListing.monthly_rent ? editingListing.monthly_rent.toString() : "",
        weeklyRent: editingListing.weekly_rent ? editingListing.weekly_rent.toString() : "",
        deposit: editingListing.deposit || "",
        minTenancy: editingListing.min_tenancy ? editingListing.min_tenancy.toString() : "",
        maxTenants: editingListing.max_tenants ? editingListing.max_tenants.toString() : "",
        moveInDate: editingListing.move_in_date || "",
        billsIncluded: editingListing.bills_included || false,
        gardenAccess: editingListing.garden_access || false,
        parking: editingListing.parking || false,
        fireplace: editingListing.fireplace || false,
        studentsAllowed: editingListing.students_allowed || false,
        familiesAllowed: editingListing.families_allowed || false,
        dssAccepted: editingListing.dss_accepted || false,
        petsAllowed: editingListing.pets_allowed || false,
        smokersAllowed: editingListing.smokers_allowed || false,
        studentsOnly: editingListing.students_only || false,
        availability: editingListing.availability || "",
        remoteViewings: editingListing.remote_viewings || false,
        youtubeUrl: editingListing.youtube_url || "",
        features: editingListing.features || "",
        agreedToTerms: true // Already agreed when creating
      });

      // Parse features into individual fields
      if (editingListing.features) {
        const featuresArray = editingListing.features.split('\n').filter(f => f.trim());
        const newFeatureFields = { ...featureFields };
        featuresArray.forEach((feature, index) => {
          if (index < 6) {
            newFeatureFields[`feature${index + 1}` as keyof typeof featureFields] = feature.trim();
          }
        });
        setFeatureFields(newFeatureFields);
      }
    } else {
      // Check for existing listings only if not editing
      const checkExistingListings = async () => {
        if (user) {
          const hasListings = await checkUserHasListings();
          setHasExistingListings(hasListings);
          setShowReadvertisingQuestion(hasListings);
        }
      };
      checkExistingListings();
    }
  }, [user, editingListing, checkUserHasListings]);

  const handleInputChange = (field: keyof ListingFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (featureKey: keyof typeof featureFields, value: string) => {
    setFeatureFields(prev => ({ ...prev, [featureKey]: value }));
    
    // Update the main features field by combining all individual features
    const updatedFeatures = { ...featureFields, [featureKey]: value };
    const featuresArray = Object.values(updatedFeatures).filter(f => f.trim() !== '');
    setFormData(prev => ({ ...prev, features: featuresArray.join('\n') }));
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    
    if (!user) return;

    if (publish && !formData.agreedToTerms) {
      console.log('Must agree to terms to publish');
      return;
    }

    console.log('Submitting form with data:', formData);
    
    let result;
    if (editingListing) {
      result = await updateListing(editingListing.id, formData, publish);
    } else {
      result = await createListing(formData, publish);
    }
    
    if (result.success) {
      onBack();
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  if (showPreview) {
    return (
      <ListingPreview 
        formData={formData}
        onBack={() => setShowPreview(false)}
        onPublish={() => handleSubmit(new Event('submit') as any, true)}
        isLoading={isLoading}
      />
    );
  }

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
        <h1 className="text-3xl font-bold mb-2">
          {editingListing ? 'Editar Anuncio' : 'Crear Nuevo Anuncio'}
        </h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            1. Detalles de la Propiedad
          </span>
          <span className="text-gray-400">2. Vista Previa</span>
          <span className="text-gray-400">3. Publicar</span>
        </div>
      </div>

      <form className="space-y-8">
        {/* Re-advertising Question - Only show if user has existing listings and not editing */}
        {showReadvertisingQuestion && !editingListing && (
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
        )}

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Propiedad *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postcode">Código Postal *</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => handleInputChange("postcode", e.target.value)}
                  placeholder="Ej: 28001"
                  required
                  disabled={isLoading}
                />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div>
                <Label htmlFor="neighborhood">Barrio</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                  placeholder="Ej: Malasaña, Chueca, Sol"
                  disabled={isLoading}
                />
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <Label htmlFor="squareMeters">Metros Cuadrados</Label>
                <Input
                  id="squareMeters"
                  type="number"
                  value={formData.squareMeters}
                  onChange={(e) => handleInputChange("squareMeters", e.target.value)}
                  placeholder="80"
                  disabled={isLoading}
                />
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
                <Label htmlFor="monthlyRent">Alquiler Mensual (€) *</Label>
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
          <CardContent className="space-y-6">
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
            
            <div>
              <Label className="text-lg font-semibold mb-3 block">Mejores Características (opcional)</Label>
              <p className="text-sm text-gray-600 mb-4">
                Añade hasta 6 de las mejores características de tu propiedad. Estas aparecerán destacadas en tu anuncio.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <div key={num}>
                    <Label htmlFor={`feature${num}`}>Característica {num}</Label>
                    <Input
                      id={`feature${num}`}
                      value={featureFields[`feature${num}` as keyof typeof featureFields]}
                      onChange={(e) => handleFeatureChange(`feature${num}` as keyof typeof featureFields, e.target.value)}
                      placeholder={`Ej: ${num === 1 ? 'Balcón con vistas' : num === 2 ? 'Cocina moderna' : num === 3 ? 'Mucha luz natural' : num === 4 ? 'Transporte público cercano' : num === 5 ? 'Barrio tranquilo' : 'Recientemente renovado'}`}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
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
                { id: "dssAccepted", label: "DSS Aceptado" },
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

        {/* Terms - Only show if not editing */}
        {!editingListing && (
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
        )}

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
            onClick={handlePreview}
            variant="secondary"
            className="flex-1"
            disabled={isLoading}
          >
            <Eye className="mr-2 h-4 w-4" />
            Vista Previa
          </Button>
          
          {editingListing && editingListing.status === 'active' && (
            <Button 
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar Anuncio'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
