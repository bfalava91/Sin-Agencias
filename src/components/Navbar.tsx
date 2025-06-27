
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import LanguageToggle from "./LanguageToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFindProperty = () => {
    navigate('/search');
  };

  const handleListProperty = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/profile');
  };

  const handleHowItWorks = () => {
    toast({
      title: "Próximamente",
      description: "La página 'Cómo Funciona' estará disponible pronto.",
    });
  };

  const handleAboutUsClick = (action: string) => {
    toast({
      title: "Próximamente",
      description: `La página '${action}' estará disponible pronto.`,
    });
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 
                className="text-2xl font-bold text-blue-600 cursor-pointer" 
                onClick={handleHome}
              >
                Sin Agencias
              </h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                <button 
                  onClick={handleFindProperty}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {t('nav.findProperty')}
                </button>
                <button 
                  onClick={handleListProperty}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {t('nav.listProperty')}
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                      Precios y servicios
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-white shadow-lg border">
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
                      Paquetes para propietarios
                    </div>
                    <DropdownMenuItem onClick={() => handleAboutUsClick('Anuncia tu piso')} className="cursor-pointer">
                      Anuncia tu piso
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAboutUsClick('Servicio completo alquiler')} className="cursor-pointer">
                      Servicio completo alquiler
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAboutUsClick('Ver todos los precios')} className="cursor-pointer">
                      Ver todos los precios
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
                      Servicios
                    </div>
                    <DropdownMenuItem onClick={() => handleAboutUsClick('Referencias Inquilinos')} className="cursor-pointer">
                      Referencias Inquilinos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAboutUsClick('Gestión de Alquileres')} className="cursor-pointer">
                      Gestión de Alquileres
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAboutUsClick('Inventario')} className="cursor-pointer">
                      Inventario
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAboutUsClick('Fotos y planos')} className="cursor-pointer">
                      Fotos y planos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAboutUsClick('Visitas')} className="cursor-pointer">
                      Visitas
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAboutUsClick('Apoyo legal')} className="cursor-pointer">
                      Apoyo legal
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button 
                  onClick={handleHowItWorks}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {t('nav.howItWorks')}
                </button>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-sm text-gray-600">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfile} className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleSignIn}>
                  {t('nav.signIn')}
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSignIn}>
                  {t('nav.signUp')}
                </Button>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center space-x-2">
            <LanguageToggle />
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
