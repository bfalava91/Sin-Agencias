
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  es: {
    // Navbar
    'nav.findProperty': 'Buscar Propiedad',
    'nav.listProperty': 'Publicar Propiedad',
    'nav.howItWorks': 'Cómo Funciona',
    'nav.signIn': 'Iniciar Sesión',
    'nav.signUp': 'Registrarse',
    
    // Hero
    'hero.title': 'Encuentra Tu',
    'hero.titleHighlight': 'Propiedad de Alquiler Perfecta',
    'hero.subtitle': 'Descubre miles de propiedades de alquiler verificadas en Madrid. Sin comisiones, sin complicaciones, solo el hogar perfecto esperándote.',
    'hero.locationPlaceholder': 'Introduce ubicación (ej. Malasaña, Chueca)',
    'hero.propertyType': 'Tipo de Propiedad',
    'hero.house': 'Casa',
    'hero.flat': 'Piso',
    'hero.studio': 'Estudio',
    'hero.room': 'Habitación',
    'hero.searchProperties': 'Buscar Propiedades',
    'hero.stat1': 'Más de 10,000 Propiedades',
    'hero.stat2': 'Propietarios Verificados',
    'hero.stat3': 'Sin Comisiones Ocultas',
    
    // Search Filters
    'filters.propertiesFound': 'propiedades encontradas',
    'filters.bedrooms': 'habitaciones',
    'filters.filters': 'Filtros',
    'filters.priceRange': 'Rango de Precio (€/mes)',
    'filters.bedroomsLabel': 'Habitaciones',
    'filters.propertyTypeLabel': 'Tipo de Propiedad',
    'filters.any': 'Cualquiera',
    'filters.applyFilters': 'Aplicar Filtros',
    
    // Featured Properties
    'featured.title': 'Propiedades Destacadas',
    'featured.subtitle': 'Descubre nuestra selección de propiedades de alquiler premium en Madrid',
    'featured.viewAll': 'Ver Todas las Propiedades',
    'featured.featured': 'Destacada',
    'featured.availableNow': 'Disponible Ahora',
    'featured.available': 'Disponible',
    'featured.month': '/mes',
    'featured.bed': 'hab',
    'featured.beds': 'habs',
    'featured.bath': 'baño',
    'featured.baths': 'baños',
    'featured.sqft': 'm²',
    'featured.viewDetails': 'Ver Detalles',
    'featured.contact': 'Contactar',
    
    // Footer
    'footer.description': 'La plataforma líder de alquiler de propiedades en Madrid. Encuentra tu hogar perfecto sin comisiones, con propietarios verificados y miles de propiedades para elegir.',
    'footer.forTenants': 'Para Inquilinos',
    'footer.findProperty': 'Buscar Propiedad',
    'footer.tenantGuide': 'Guía del Inquilino',
    'footer.areaGuides': 'Guías de Barrios',
    'footer.forLandlords': 'Para Propietarios',
    'footer.landlordGuide': 'Guía del Propietario',
    'footer.propertyManagement': 'Gestión de Propiedades',
    'footer.insurance': 'Seguros',
    'footer.rights': 'Todos los derechos reservados.'
  },
  en: {
    // Navbar
    'nav.findProperty': 'Find a Property',
    'nav.listProperty': 'List Property',
    'nav.howItWorks': 'How it Works',
    'nav.signIn': 'Sign In',
    'nav.signUp': 'Sign Up',
    
    // Hero
    'hero.title': 'Find Your Perfect',
    'hero.titleHighlight': 'Rental Property',
    'hero.subtitle': 'Discover thousands of verified rental properties in Madrid. No fees, no hassle, just the perfect home waiting for you.',
    'hero.locationPlaceholder': 'Enter location (e.g., Malasaña, Chueca)',
    'hero.propertyType': 'Property Type',
    'hero.house': 'House',
    'hero.flat': 'Flat',
    'hero.studio': 'Studio',
    'hero.room': 'Room',
    'hero.searchProperties': 'Search Properties',
    'hero.stat1': 'Over 10,000 Properties',
    'hero.stat2': 'Verified Landlords',
    'hero.stat3': 'No Hidden Fees',
    
    // Search Filters
    'filters.propertiesFound': 'properties found',
    'filters.bedrooms': 'bedrooms',
    'filters.filters': 'Filters',
    'filters.priceRange': 'Price Range (€/month)',
    'filters.bedroomsLabel': 'Bedrooms',
    'filters.propertyTypeLabel': 'Property Type',
    'filters.any': 'Any',
    'filters.applyFilters': 'Apply Filters',
    
    // Featured Properties
    'featured.title': 'Featured Properties',
    'featured.subtitle': 'Discover our hand-picked selection of premium rental properties in Madrid',
    'featured.viewAll': 'View All Properties',
    'featured.featured': 'Featured',
    'featured.availableNow': 'Available Now',
    'featured.available': 'Available',
    'featured.month': '/month',
    'featured.bed': 'bed',
    'featured.beds': 'beds',
    'featured.bath': 'bath',
    'featured.baths': 'baths',
    'featured.sqft': 'sqft',
    'featured.viewDetails': 'View Details',
    'featured.contact': 'Contact',
    
    // Footer
    'footer.description': 'Madrid\'s leading property rental platform. Find your perfect home with no fees, verified landlords, and thousands of properties to choose from.',
    'footer.forTenants': 'For Tenants',
    'footer.findProperty': 'Find Property',
    'footer.tenantGuide': 'Tenant Guide',
    'footer.areaGuides': 'Area Guides',
    'footer.forLandlords': 'For Landlords',
    'footer.landlordGuide': 'Landlord Guide',
    'footer.propertyManagement': 'Property Management',
    'footer.insurance': 'Insurance',
    'footer.rights': 'All rights reserved.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
