export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
        }
      }
      merits: {
        Row: {
          id: string
          created_at: string
          awarded_by: Database['public']['Tables']['teachers']['Row']
          points: number
          student: Database['public']['Tables']['students']['Row']
          type: string
        }
        Insert: {
          id?: string
          created_at?: string
          awarded_by: string
          points: number
          student: string
          type?: string
        }
        Update: {
          id: string
          created_at?: string
          awarded_by?: string
          points?: number
          student?: string
          type?: string
        }
      }
      merits_type: {
        Row: {
          id: string
          created_at: string
        }
        Insert: {
          id?: string
          created_at?: string
        }
        Update: {
          id?: string
          created_at?: string
        }
      }
      post_likes: {
        Row: {
          post_id: string
          profile_id: Database['public']['Tables']['profiles']['Row']
          created_at: string
        }
        Insert: {
          post_id: string
          profile_id: string
          created_at?: string
        }
        Update: {
          post_id: string
          profile_id: string
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          image: string
          profile: Database['public']['Tables']['profiles']['Row']
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          image?: string
          profile: string
        }
        Update: {
          id: string
          created_at?: string
          title?: string
          description?: string
          image?: string
          profile?: string
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string
          first_name: string
          last_name: string
          avatar_url: string
          email: string
        }
        Insert: {
          id?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          avatar_url?: string
          email?: string
        }
        Update: {
          id?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          avatar_url?: string
          email?: string
        }
      }
      provinces: {
        Row: {
          id: string
          created_at: string
          name: string
        }
        Insert: {
          id?: string
          created_at?: string
          name?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
        }
      }
      schools: {
        Row: {
          id: string
          created_at: string
          name: string
          street_address: string
          city: string
          province: Database['public']['Tables']['provinces']['Row']
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          street_address: string
          city: string
          province: string
        }
        Update: {
          id: string
          created_at?: string
          name?: string
          street_address?: string
          city?: string
          province?: string
        }
      }
      students: {
        Row: {
          id: string
          created_at: string
          profile: {
            id: string
            updated_at: string
            first_name: string
            last_name: string
            avatar_url: string
            email: string
          }
          school: {
            id: string
            created_at: string
            name: string
            street_address: string
            city: string
            province: string
          }
        }
        Insert: {
          id?: string
          created_at?: string
          profile?: string
          school?: string
        }
        Update: {
          id: string
          created_at?: string
          profile?: string
          school?: string
        }
      }
      teachers: {
        Row: {
          id: string
          created_at: string | null
          profile: Database['public']['Tables']['profiles']['Row']
          school: Database['public']['Tables']['schools']['Row']
          admin: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          profile: string
          school: string
          admin?: boolean
        }
        Update: {
          id: string
          created_at?: string
          profile?: string
          school?: string
          admin?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_school_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

