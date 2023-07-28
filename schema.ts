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
          profile_id: Database['public']['Tables']['profiles']['Row']
          type: string
        }
        Insert: {
          id?: string
          created_at?: string
          awarded_by: string
          points: number
          student: string
          profile_id: string
          type?: string
        }
        Update: {
          id: string
          created_at?: string
          awarded_by?: string
          points?: number
          student?: string
          profile_id?: string
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
      merits_view: {
        Row: {
          type: string | null
          sum: number | null
          profile_id: string | null
          id: string | null
          first_name: string | null
          last_name: string | null
        }
      }
      students_profiles_view: {
        Row: {
          student_id: string | null
          school_id: string | null
          school_name: string | null
          city: string | null
          street_address: string | null
          profile_id: string | null
          first_name: string | null
          last_name: string | null
        }
      }
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
      my_total_points: {
        Args: { student_id: string }
        Returns: number
      }
      sum_points_by_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

