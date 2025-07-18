
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">Sin Agencias</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.forTenants')}</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.findProperty')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('nav.howItWorks')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.tenantGuide')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.areaGuides')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.forLandlords')}</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">{t('nav.listProperty')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.landlordGuide')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.propertyManagement')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.insurance')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                hola@sinagencias.es
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                91 123 4567
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Sin Agencias. {t('footer.rights')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
