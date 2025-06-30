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
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase()
    console.log('Register API - Normalized email:', normalizedEmail)

    // Create user using admin API
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
          error.code === '23505') {
        console.log('Register API - Email already registered')
        return new Response(JSON.stringify({ 
          error: 'Email already registered',
          message: 'Ya existe un usuario con este correo.'
        }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Other errors
      return new Response(JSON.stringify({ 
        error: error.message || 'Registration failed' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Register API - User created successfully:', data.user?.email)

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
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
