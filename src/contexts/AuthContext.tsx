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

  const checkExistingUser = async (email: string) => {
    try {
      // Normalize email to avoid false negatives
      const normalizedEmail = email.trim().toLowerCase();
      console.log('Checking if user exists for normalized email:', normalizedEmail);
      
      // Attempt to sign in with a dummy password to check if user exists
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: 'dummy-password-that-will-never-match-123456789'
      });
      
      console.log('Dummy sign-in response - data:', data);
      console.log('Dummy sign-in response - error:', error);
      
      // If we get a valid session (user exists and dummy password somehow matched)
      if (data?.session && data?.user) {
        console.log('Valid session returned - user exists');
        // Sign out immediately to clean up the accidental login
        await supabase.auth.signOut();
        return true;
      }
      
      // If error is "Invalid login credentials", user doesn't exist
      if (error && error.message === 'Invalid login credentials') {
        console.log('Invalid login credentials error - user does not exist, safe to sign up');
        return false;
      }
      
      // If we get any other error, assume user exists to be safe
      console.log('Other error or unexpected response - assuming user exists to be safe');
      return true;
      
    } catch (error) {
      console.error('Unexpected error checking if user exists:', error);
      // If we can't determine, assume user exists to prevent duplicate signups
      return true;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'tenant' | 'landlord') => {
    try {
      console.log('Starting signup process for:', email);
      
      // First check if user already exists using dummy password attempt
      const userExists = await checkExistingUser(email);
      
      if (userExists) {
        console.log('User already exists, blocking signup');
        return { 
          error: { 
            message: 'User already registered',
            details: 'Este email ya está registrado. Intenta iniciar sesión.' 
          } 
        };
      }

      console.log('User does not exist, proceeding with signup');
      
      // Normalize email for signup as well
      const normalizedEmail = email.trim().toLowerCase();
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      
      console.log('Supabase signUp response - data:', data);
      console.log('Supabase signUp response - error:', error);
      
      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      console.log('Signup successful:', data);
      return { error: null };
      
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      return { error };
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
