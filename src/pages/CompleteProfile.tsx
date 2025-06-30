
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CompleteProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+34');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileText, setProfileText] = useState('');
  
  const { user, profile, updateProfile, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated, redirect to auth page
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // If profile already exists, redirect to profile page
    if (!loading && profile) {
      navigate('/profile');
      return;
    }
  }, [user, profile, loading, navigate]);

  // Show loading while checking auth status
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!fullName.trim() || !phoneNumber.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa el nombre y número de teléfono.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Combine country code and phone number
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    const { error } = await updateProfile({
      full_name: fullName.trim(),
      phone: fullPhoneNumber,
      // Only include profile text if it's not empty
      ...(profileText.trim() && { profile_text: profileText.trim() })
    });

    if (error) {
      toast({
        title: "Error al crear perfil",
        description: "No se pudo crear tu perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Perfil creado!",
        description: "Tu perfil ha sido creado correctamente.",
      });
      navigate('/profile');
    }

    setIsLoading(false);
  };

  const countryCodes = [
    { code: '+34', country: 'España' },
    { code: '+1', country: 'Estados Unidos/Canadá' },
    { code: '+44', country: 'Reino Unido' },
    { code: '+33', country: 'Francia' },
    { code: '+49', country: 'Alemania' },
    { code: '+39', country: 'Italia' },
    { code: '+351', country: 'Portugal' },
    { code: '+52', country: 'México' },
    { code: '+54', country: 'Argentina' },
    { code: '+55', country: 'Brasil' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Sin Agencias</h1>
          <p className="mt-2 text-gray-600">Completa tu perfil para continuar</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear Perfil</CardTitle>
            <CardDescription>
              Completa tu información para finalizar el registro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre completo"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Número de Teléfono *</Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode} disabled={isLoading}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="123456789"
                    required
                    disabled={isLoading}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Formato: {countryCode}123456789
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileText">Descripción (Opcional)</Label>
                <Textarea
                  id="profileText"
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  placeholder="Cuéntanos un poco sobre ti..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creando perfil...' : 'Crear Perfil'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteProfile;
