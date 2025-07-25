import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ListingFormData {
  isReadvertising: boolean;
  postcode: string;
  flatNumber: string;
  addressLine2: string;
  addressLine3: string;
  town: string;
  neighborhood: string;
  advertType: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  squareMeters: string;
  furnishing: string;
  description: string;
  monthlyRent: string;
  weeklyRent: string;
  deposit: string;
  minTenancy: string;
  maxTenants: string;
  moveInDate: string;
  billsIncluded: boolean;
  gardenAccess: boolean;
  parking: boolean;
  fireplace: boolean;
  studentsAllowed: boolean;
  familiesAllowed: boolean;
  petsAllowed: boolean;
  smokersAllowed: boolean;
  studentsOnly: boolean;
  availability: string;
  remoteViewings: boolean;
  youtubeUrl: string;
  features: string;
  images: string[];
  agreedToTerms: boolean;
}

export const useListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createListing = async (formData: ListingFormData, publish = false) => {
    if (!user) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para crear un anuncio",
        variant: "destructive",
      });
      return { success: false, error: "No authenticated user" };
    }

    // Enhanced validation for required fields when publishing
    if (publish) {
      const requiredFields = ['postcode', 'town', 'advertType', 'propertyType', 'bedrooms', 'bathrooms', 'furnishing', 'flatNumber', 'addressLine2', 'minTenancy', 'moveInDate', 'availability'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof ListingFormData]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Campos obligatorios faltantes",
          description: `Por favor completa los siguientes campos: ${missingFields.join(', ')}`,
          variant: "destructive",
        });
        return { success: false, error: "Missing required fields" };
      }
      
      if (!formData.monthlyRent && !formData.weeklyRent) {
        toast({
          title: "Campo obligatorio faltante",
          description: "Debes especificar el alquiler mensual o semanal",
          variant: "destructive",
        });
        return { success: false, error: "Missing rent information" };
      }

      // Validate at least 2 features
      const featuresCount = formData.features.split('\n').filter(f => f.trim() !== '').length;
      if (featuresCount < 2) {
        toast({
          title: "Características insuficientes",
          description: "Debes añadir al menos 2 características de la propiedad",
          variant: "destructive",
        });
        return { success: false, error: "Insufficient features" };
      }

      // Validate images for publishing - must have at least one image
      if (!formData.images || formData.images.length === 0) {
        toast({
          title: "Imágenes requeridas",
          description: "Debes subir al menos una imagen para publicar el anuncio",
          variant: "destructive",
        });
        return { success: false, error: "No images provided" };
      }
    }

    setIsLoading(true);

    try {
      // Ensure images is always an array, never null - strict enforcement
      const imageUrls = Array.isArray(formData.images) ? [...formData.images] : [];
      
      const listingData = {
        user_id: user.id,
        is_readvertising: formData.isReadvertising,
        postcode: formData.postcode || null,
        flat_number: formData.flatNumber || null,
        address_line_2: formData.addressLine2 || null,
        address_line_3: formData.addressLine3 || null,
        town: formData.town || null,
        neighborhood: formData.neighborhood || null,
        advert_type: formData.advertType || null,
        property_type: formData.propertyType || null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        square_meters: formData.squareMeters ? parseInt(formData.squareMeters) : null,
        furnishing: formData.furnishing || null,
        description: formData.description || null,
        monthly_rent: formData.monthlyRent ? parseFloat(formData.monthlyRent) : null,
        weekly_rent: formData.weeklyRent ? parseFloat(formData.weeklyRent) : null,
        deposit: formData.deposit || null,
        min_tenancy: formData.minTenancy ? parseInt(formData.minTenancy) : null,
        max_tenants: formData.maxTenants ? parseInt(formData.maxTenants) : null,
        move_in_date: formData.moveInDate || null,
        bills_included: formData.billsIncluded,
        garden_access: formData.gardenAccess,
        parking: formData.parking,
        fireplace: formData.fireplace,
        students_allowed: formData.studentsAllowed,
        families_allowed: formData.familiesAllowed,
        pets_allowed: formData.petsAllowed,
        smokers_allowed: formData.smokersAllowed,
        students_only: formData.studentsOnly,
        availability: formData.availability || null,
        remote_viewings: formData.remoteViewings,
        youtube_url: formData.youtubeUrl || null,
        features: formData.features || null,
        images: imageUrls, // Always an array, never null
        status: publish ? 'active' : 'draft'
      };

      // Debug console logs before insert
      console.log('=== CREATE LISTING DEBUG ===');
      console.log('formData.images:', formData.images);
      console.log('formData.images type:', typeof formData.images);
      console.log('formData.images length:', formData.images?.length);
      console.log('listingData.images:', listingData.images);
      console.log('listingData.images type:', typeof listingData.images);
      console.log('listingData.images length:', listingData.images?.length);
      console.log('Full listingData:', listingData);
      console.log('=== END DEBUG ===');

      const { data, error } = await supabase
        .from('listings')
        .insert([listingData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Listing created successfully:', data);
      console.log('Created listing images field:', data.images);

      toast({
        title: publish ? "¡Anuncio publicado exitosamente!" : "¡Anuncio guardado como borrador!",
        description: publish ? "Tu anuncio está ahora activo y visible para inquilinos." : "Tu anuncio ha sido guardado como borrador.",
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Error creating listing:', error);
      
      toast({
        title: "Error al crear el anuncio",
        description: error.message || "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });

      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateListing = async (listingId: string, formData: ListingFormData, publish = false) => {
    if (!user) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para actualizar un anuncio",
        variant: "destructive",
      });
      return { success: false, error: "No authenticated user" };
    }

    // Enhanced validation for required fields when publishing
    if (publish) {
      const requiredFields = ['postcode', 'town', 'advertType', 'propertyType', 'bedrooms', 'bathrooms', 'furnishing', 'flatNumber', 'addressLine2', 'minTenancy', 'moveInDate', 'availability'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof ListingFormData]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Campos obligatorios faltantes",
          description: `Por favor completa los siguientes campos: ${missingFields.join(', ')}`,
          variant: "destructive",
        });
        return { success: false, error: "Missing required fields" };
      }
      
      if (!formData.monthlyRent && !formData.weeklyRent) {
        toast({
          title: "Campo obligatorio faltante",
          description: "Debes especificar el alquiler mensual o semanal",
          variant: "destructive",
        });
        return { success: false, error: "Missing rent information" };
      }

      // Validate at least 2 features
      const featuresCount = formData.features.split('\n').filter(f => f.trim() !== '').length;
      if (featuresCount < 2) {
        toast({
          title: "Características insuficientes",
          description: "Debes añadir al menos 2 características de la propiedad",
          variant: "destructive",
        });
        return { success: false, error: "Insufficient features" };
      }

      // Validate images for publishing - must have at least one image
      if (!formData.images || formData.images.length === 0) {
        toast({
          title: "Imágenes requeridas",
          description: "Debes subir al menos una imagen para publicar el anuncio",
          variant: "destructive",
        });
        return { success: false, error: "No images provided" };
      }
    }

    setIsLoading(true);

    try {
      // Ensure images is always an array, never null - strict enforcement
      const imageUrls = Array.isArray(formData.images) ? [...formData.images] : [];
      
      const listingData = {
        is_readvertising: formData.isReadvertising,
        postcode: formData.postcode || null,
        flat_number: formData.flatNumber || null,
        address_line_2: formData.addressLine2 || null,
        address_line_3: formData.addressLine3 || null,
        town: formData.town || null,
        neighborhood: formData.neighborhood || null,
        advert_type: formData.advertType || null,
        property_type: formData.propertyType || null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        square_meters: formData.squareMeters ? parseInt(formData.squareMeters) : null,
        furnishing: formData.furnishing || null,
        description: formData.description || null,
        monthly_rent: formData.monthlyRent ? parseFloat(formData.monthlyRent) : null,
        weekly_rent: formData.weeklyRent ? parseFloat(formData.weeklyRent) : null,
        deposit: formData.deposit || null,
        min_tenancy: formData.minTenancy ? parseInt(formData.minTenancy) : null,
        max_tenants: formData.maxTenants ? parseInt(formData.maxTenants) : null,
        move_in_date: formData.moveInDate || null,
        bills_included: formData.billsIncluded,
        garden_access: formData.gardenAccess,
        parking: formData.parking,
        fireplace: formData.fireplace,
        students_allowed: formData.studentsAllowed,
        families_allowed: formData.familiesAllowed,
        pets_allowed: formData.petsAllowed,
        smokers_allowed: formData.smokersAllowed,
        students_only: formData.studentsOnly,
        availability: formData.availability || null,
        remote_viewings: formData.remoteViewings,
        youtube_url: formData.youtubeUrl || null,
        features: formData.features || null,
        images: imageUrls, // Always an array, never null
        status: publish ? 'active' : 'draft',
        updated_at: new Date().toISOString()
      };

      // Debug console logs before update
      console.log('=== UPDATE LISTING DEBUG ===');
      console.log('formData.images:', formData.images);
      console.log('formData.images type:', typeof formData.images);
      console.log('formData.images length:', formData.images?.length);
      console.log('listingData.images:', listingData.images);
      console.log('listingData.images type:', typeof listingData.images);
      console.log('listingData.images length:', listingData.images?.length);
      console.log('Full listingData:', listingData);
      console.log('=== END DEBUG ===');

      const { data, error } = await supabase
        .from('listings')
        .update(listingData)
        .eq('id', listingId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Listing updated successfully:', data);
      console.log('Updated listing images field:', data.images);

      toast({
        title: publish ? "¡Anuncio actualizado y publicado!" : "¡Anuncio actualizado como borrador!",
        description: publish ? "Tu anuncio actualizado está activo y visible para inquilinos." : "Tu anuncio ha sido actualizado y guardado como borrador.",
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating listing:', error);
      
      toast({
        title: "Error al actualizar el anuncio",
        description: error.message || "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });

      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserListings = async () => {
    if (!user) return { success: false, error: "No authenticated user" };

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      return { success: false, error: error.message };
    }
  };

  const fetchSingleListing = async (listingId: string) => {
    if (!user) return { success: false, error: "No authenticated user" };

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching listing:', error);
      return { success: false, error: error.message };
    }
  };

  const checkUserHasListings = async () => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (error) throw error;

      return data && data.length > 0;
    } catch (error: any) {
      console.error('Error checking user listings:', error);
      return false;
    }
  };

  return {
    createListing,
    updateListing,
    fetchUserListings,
    fetchSingleListing,
    checkUserHasListings,
    isLoading
  };
};
