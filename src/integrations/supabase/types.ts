export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      listings: {
        Row: {
          address_line_2: string | null
          address_line_3: string | null
          advert_type: string | null
          availability: string | null
          bathrooms: number | null
          bedrooms: number | null
          bills_included: boolean | null
          created_at: string
          deposit: string | null
          description: string | null
          dss_accepted: boolean | null
          families_allowed: boolean | null
          features: string | null
          fireplace: boolean | null
          flat_number: string | null
          furnishing: string | null
          garden_access: boolean | null
          id: string
          is_readvertising: boolean | null
          max_tenants: number | null
          min_tenancy: number | null
          monthly_rent: number | null
          move_in_date: string | null
          neighborhood: string | null
          parking: boolean | null
          pets_allowed: boolean | null
          postcode: string | null
          property_type: string | null
          remote_viewings: boolean | null
          smokers_allowed: boolean | null
          status: string | null
          students_allowed: boolean | null
          students_only: boolean | null
          town: string | null
          updated_at: string
          user_id: string
          weekly_rent: number | null
          youtube_url: string | null
        }
        Insert: {
          address_line_2?: string | null
          address_line_3?: string | null
          advert_type?: string | null
          availability?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          bills_included?: boolean | null
          created_at?: string
          deposit?: string | null
          description?: string | null
          dss_accepted?: boolean | null
          families_allowed?: boolean | null
          features?: string | null
          fireplace?: boolean | null
          flat_number?: string | null
          furnishing?: string | null
          garden_access?: boolean | null
          id?: string
          is_readvertising?: boolean | null
          max_tenants?: number | null
          min_tenancy?: number | null
          monthly_rent?: number | null
          move_in_date?: string | null
          neighborhood?: string | null
          parking?: boolean | null
          pets_allowed?: boolean | null
          postcode?: string | null
          property_type?: string | null
          remote_viewings?: boolean | null
          smokers_allowed?: boolean | null
          status?: string | null
          students_allowed?: boolean | null
          students_only?: boolean | null
          town?: string | null
          updated_at?: string
          user_id: string
          weekly_rent?: number | null
          youtube_url?: string | null
        }
        Update: {
          address_line_2?: string | null
          address_line_3?: string | null
          advert_type?: string | null
          availability?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          bills_included?: boolean | null
          created_at?: string
          deposit?: string | null
          description?: string | null
          dss_accepted?: boolean | null
          families_allowed?: boolean | null
          features?: string | null
          fireplace?: boolean | null
          flat_number?: string | null
          furnishing?: string | null
          garden_access?: boolean | null
          id?: string
          is_readvertising?: boolean | null
          max_tenants?: number | null
          min_tenancy?: number | null
          monthly_rent?: number | null
          move_in_date?: string | null
          neighborhood?: string | null
          parking?: boolean | null
          pets_allowed?: boolean | null
          postcode?: string | null
          property_type?: string | null
          remote_viewings?: boolean | null
          smokers_allowed?: boolean | null
          status?: string | null
          students_allowed?: boolean | null
          students_only?: boolean | null
          town?: string | null
          updated_at?: string
          user_id?: string
          weekly_rent?: number | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          from_user_id: string
          id: string
          listing_id: string
          sent_at: string
          to_user_id: string
        }
        Insert: {
          body: string
          from_user_id: string
          id?: string
          listing_id: string
          sent_at?: string
          to_user_id: string
        }
        Update: {
          body?: string
          from_user_id?: string
          id?: string
          listing_id?: string
          sent_at?: string
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          price: number | null
          rooms: number | null
          status: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          price?: number | null
          rooms?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          price?: number | null
          rooms?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "tenant" | "landlord"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["tenant", "landlord"],
    },
  },
} as const
