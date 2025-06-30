
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LogOut,
  User,
  Edit2,
  Save,
  X
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileSidebar from "@/components/ProfileSidebar";
import ProfileDashboard from "@/components/ProfileDashboard";
import CreateListing from "@/components/CreateListing";
import ManageListings from "@/components/ManageListings";

const Profile = () => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || ''
  });

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    navigate('/');
  };

  const handleSaveProfile = async () => {
    const { error } = await updateProfile(editForm);
    
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente.",
      });
      setIsEditingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      full_name: profile?.full_name || '',
      phone: profile?.phone || ''
    });
    setIsEditingProfile(false);
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
    if (activeTab === "account") {
      return (
        <div className="p-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Información del Perfil
                {!isEditingProfile && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/api/placeholder/80/80" />
                  <AvatarFallback className="text-xl">
                    {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {profile?.full_name || 'Usuario'}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                    {profile?.role === 'landlord' ? 'Propietario' : 'Inquilino'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Nombre Completo</Label>
                  {isEditingProfile ? (
                    <Input
                      id="full_name"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile?.full_name || 'No especificado'}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  {isEditingProfile ? (
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Número de teléfono"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile?.phone || 'No especificado'}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="role">Tipo de Usuario</Label>
                  <p className="text-gray-900 font-medium">
                    {profile?.role === 'landlord' ? 'Propietario' : 'Inquilino'}
                  </p>
                </div>
              </div>

              {isEditingProfile && (
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }
    
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
                  {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">Mi Perfil</h1>
                <p className="text-gray-600">{profile?.full_name || user.email}</p>
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
