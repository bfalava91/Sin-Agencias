
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { email, password, fullName, role } = await req.json()
    
    console.log('Register API - Starting registration for email:', email)

    // Validate required fields
    if (!email || !password || !fullName || !role) {
      console.log('Register API - Missing required fields')
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Missing required fields' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase()
    console.log('Register API - Normalized email:', normalizedEmail)

    // Create user using admin API - disable email confirmation for now
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
        role: role
      }
    })

    if (error) {
      console.log('Register API - Supabase admin createUser error:', error)
      
      // Check if it's a unique constraint violation (user already exists)
      if (error.message.includes('User already registered') || 
          error.message.includes('already been registered') ||
          error.code === 'email_exists') {
        console.log('Register API - Email already registered')
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Email already registered',
          message: 'Ya existe un usuario con este correo.'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Other errors
      return new Response(JSON.stringify({ 
        success: false,
        error: error.message || 'Registration failed' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Register API - User created successfully:', data.user?.email)

    // Create profile manually since the trigger might be failing
    if (data.user) {
      console.log('Register API - Creating profile for user:', data.user.id)
      
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: data.user.id,
          email: normalizedEmail,
          full_name: fullName,
          role: role
        })
        .select()
        .single()

      if (profileError) {
        console.log('Register API - Profile creation error:', profileError)
        // Don't fail the registration if profile creation fails
        // The user is already created in auth.users
      } else {
        console.log('Register API - Profile created successfully:', profileData)
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      user: data.user,
      message: 'Usuario registrado exitosamente'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Register API - Unexpected error:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error' 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
