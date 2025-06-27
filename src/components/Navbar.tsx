
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";

const Navbar = () => {
  const { t } = useLanguage();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">Sin Agencias</h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  {t('nav.findProperty')}
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  {t('nav.listProperty')}
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  {t('nav.howItWorks')}
                </a>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            <Button variant="ghost" size="sm">
              {t('nav.signIn')}
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              {t('nav.signUp')}
            </Button>
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
