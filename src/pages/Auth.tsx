import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  
  const { signIn, signUp, user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/profile');
    }
  }, [user, loading, navigate]);

  // Don't render anything while loading or if user is authenticated
  if (loading || user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">Cargando...</div>
    </div>;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message === 'Invalid login credentials' 
          ? "Credenciales inválidas. Verifica tu email y contraseña."
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!email || !password || !confirmPassword || !fullName) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check if passwords match BEFORE submitting
    if (password !== confirmPassword) {
      toast({
        title: "Error en contraseñas",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check password length
    if (password.length < 6) {
      toast({
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    console.log('Frontend - Submitting registration form');
    const { error } = await signUp(email, password, fullName, role);

    if (error) {
      if (error.message === 'User already registered') {
        toast({
          title: "Usuario ya registrado",
          description: error.details || "Ya existe un usuario con este correo.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error al registrarse",
          description: error.message || "Ocurrió un error inesperado.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente. Redirigiendo al perfil...",
      });
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setRole('tenant');
      
      // Redirect to profile page after successful registration
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotPasswordLoading(true);

    if (!forgotPasswordEmail) {
      toast({
        title: "Email requerido",
        description: "Por favor, ingresa tu email.",
        variant: "destructive",
      });
      setIsForgotPasswordLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
      redirectTo: `${window.location.origin}/auth`,
    });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el email de recuperación. Verifica tu dirección de correo.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email enviado",
        description: "Revisa tu email para restablecer tu contraseña.",
      });
      setShowForgotPasswordDialog(false);
      setForgotPasswordEmail('');
    }

    setIsForgotPasswordLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Sin Agencias</h1>
          <p className="mt-2 text-gray-600">Encuentra tu hogar ideal sin intermediarios</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accede a tu cuenta</CardTitle>
            <CardDescription>
              Inicia sesión o regístrate para comenzar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Contraseña</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                  
                  <div className="text-center">
                    <Dialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
                      <DialogTrigger asChild>
                        <Button variant="link" className="text-sm text-blue-600 hover:text-blue-800">
                          ¿Olvidaste tu contraseña?
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Recuperar contraseña</DialogTitle>
                          <DialogDescription>
                            Ingresa tu email para recibir un enlace de recuperación de contraseña.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="forgot-email">Email</Label>
                            <Input
                              id="forgot-email"
                              type="email"
                              value={forgotPasswordEmail}
                              onChange={(e) => setForgotPasswordEmail(e.target.value)}
                              placeholder="tu@email.com"
                              required
                              disabled={isForgotPasswordLoading}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowForgotPasswordDialog(false)}
                              className="flex-1"
                              disabled={isForgotPasswordLoading}
                            >
                              Cancelar
                            </Button>
                            <Button
                              type="submit"
                              className="flex-1"
                              disabled={isForgotPasswordLoading}
                            >
                              {isForgotPasswordLoading ? 'Enviando...' : 'Enviar'}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nombre Completo</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Tipo de Usuario</Label>
                    <RadioGroup 
                      value={role} 
                      onValueChange={(value) => setRole(value as 'tenant' | 'landlord')}
                      disabled={isLoading}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tenant" id="tenant" />
                        <Label htmlFor="tenant">Inquilino - Busco propiedad</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="landlord" id="landlord" />
                        <Label htmlFor="landlord">Propietario - Ofrezco propiedad</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Registrarse'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
