
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
  dssAccepted: boolean;
  petsAllowed: boolean;
  smokersAllowed: boolean;
  studentsOnly: boolean;
  availability: string;
  remoteViewings: boolean;
  youtubeUrl: string;
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

    setIsLoading(true);

    try {
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
        dss_accepted: formData.dssAccepted,
        pets_allowed: formData.petsAllowed,
        smokers_allowed: formData.smokersAllowed,
        students_only: formData.studentsOnly,
        availability: formData.availability || null,
        remote_viewings: formData.remoteViewings,
        youtube_url: formData.youtubeUrl || null,
        status: publish ? 'active' : 'draft'
      };

      console.log('Creating listing with data:', listingData);

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

  return {
    createListing,
    fetchUserListings,
    isLoading
  };
};
