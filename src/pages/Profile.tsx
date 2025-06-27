
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Heart, 
  Search, 
  MessageSquare, 
  LogOut,
  User,
  Settings,
  Building2,
  Plus
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileSidebar from "@/components/ProfileSidebar";
import ProfileDashboard from "@/components/ProfileDashboard";
import CreateListing from "@/components/CreateListing";
import ManageListings from "@/components/ManageListings";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    navigate('/');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  const topNavItems = [
    { id: "dashboard", label: "Dashboard", active: activeTab === "dashboard" },
    { id: "account", label: "Account", active: activeTab === "account" },
    { id: "services", label: "Property Services", active: activeTab === "services" },
    { id: "listings", label: "My Listings", active: activeTab === "listings" },
  ];

  const renderContent = () => {
    if (activeTab === "dashboard") {
      if (activeSection === "create-listing") {
        return <CreateListing onBack={() => setActiveSection("dashboard")} />;
      }
      if (activeSection === "manage-listings") {
        return <ManageListings 
          onBack={() => setActiveSection("dashboard")} 
          onCreateNew={() => setActiveSection("create-listing")}
        />;
      }
      return <ProfileDashboard 
        onCreateListing={() => setActiveSection("create-listing")}
        onManageListings={() => setActiveSection("manage-listings")}
      />;
    }
    
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">
          {topNavItems.find(item => item.id === activeTab)?.label}
        </h2>
        <p className="text-gray-600">Esta sección estará disponible próximamente.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Profile and Top Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/api/placeholder/48/48" />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">Mi Perfil</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
          
          {/* Top Navigation */}
          <div className="flex space-x-8 px-6">
            {topNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setActiveSection("dashboard");
                }}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  item.active
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex gap-6">
          <ProfileSidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          
          <div className="flex-1 bg-white rounded-lg shadow-sm">
            {renderContent()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
