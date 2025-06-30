import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: 'tenant' | 'landlord' | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  signUp: (email: string, password: string, fullName: string, role: 'tenant' | 'landlord') => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile when user logs in
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'tenant' | 'landlord') => {
    try {
      console.log('Frontend - Starting signup process for:', email);
      
      // Call the Supabase edge function directly
      const { data, error } = await supabase.functions.invoke('register', {
        body: {
          email,
          password,
          fullName,
          role
        }
      });

      console.log('Frontend - Register function response:', data);
      console.log('Frontend - Register function error:', error);

      // Handle function invocation errors (network, etc.)
      if (error) {
        console.log('Frontend - Function invocation failed:', error);
        return { 
          error: { 
            message: 'Network error or server unavailable' 
          } 
        };
      }

      // Handle application-level errors from the function
      if (!data?.success) {
        console.log('Frontend - Registration failed:', data?.error);
        
        if (data?.error === 'Email already registered') {
          return { 
            error: { 
              message: 'User already registered',
              details: data.message || 'Ya existe un usuario con este correo.'
            } 
          };
        }
        
        return { 
          error: { 
            message: data?.error || 'Registration failed' 
          } 
        };
      }

      console.log('Frontend - Registration successful');
      return { error: null };
      
    } catch (error) {
      console.error('Frontend - Unexpected error during signup:', error);
      return { error: { message: 'Network error or server unavailable' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
    }
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    } else {
      // Clear the state immediately
      setSession(null);
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: { message: 'No authenticated user' } };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return { error };
      }

      setProfile(data);
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    signUp,
    signIn,
    signOut,
    updateProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
