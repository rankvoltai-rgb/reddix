export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      keywords: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_auto_generated: boolean | null
          keyword: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_auto_generated?: boolean | null
          keyword: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_auto_generated?: boolean | null
          keyword?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          author: string | null
          created_at: string | null
          discovered_at: string | null
          id: string
          intent_level: Database["public"]["Enums"]["intent_level"] | null
          intent_score: number | null
          notes: string | null
          relevance_notes: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          subreddit: string
          thread_content: string | null
          thread_title: string | null
          thread_url: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          discovered_at?: string | null
          id?: string
          intent_level?: Database["public"]["Enums"]["intent_level"] | null
          intent_score?: number | null
          notes?: string | null
          relevance_notes?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          subreddit: string
          thread_content?: string | null
          thread_title?: string | null
          thread_url: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          author?: string | null
          created_at?: string | null
          discovered_at?: string | null
          id?: string
          intent_level?: Database["public"]["Enums"]["intent_level"] | null
          intent_score?: number | null
          notes?: string | null
          relevance_notes?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          subreddit?: string
          thread_content?: string | null
          thread_title?: string | null
          thread_url?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      monitored_subreddits: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          subreddit_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          subreddit_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          subreddit_name?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auto_pilot_enabled: boolean | null
          cached_search_terms: Json | null
          common_objections: string[] | null
          company_description: string | null
          competitor_names: string[] | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          initial_setup_completed: boolean | null
          key_features: string[] | null
          last_scan_at: string | null
          next_scheduled_scan_at: string | null
          onboarding_completed: boolean | null
          pricing_model: string | null
          product_name: string | null
          product_url: string | null
          scan_frequency_hours: number | null
          search_terms_cached_at: string | null
          selected_plan: string | null
          success_stories: string | null
          target_audience: string | null
          tone: Database["public"]["Enums"]["tone_preference"] | null
          unique_differentiators: string | null
          updated_at: string | null
          value_proposition: string | null
        }
        Insert: {
          auto_pilot_enabled?: boolean | null
          cached_search_terms?: Json | null
          common_objections?: string[] | null
          company_description?: string | null
          competitor_names?: string[] | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          initial_setup_completed?: boolean | null
          key_features?: string[] | null
          last_scan_at?: string | null
          next_scheduled_scan_at?: string | null
          onboarding_completed?: boolean | null
          pricing_model?: string | null
          product_name?: string | null
          product_url?: string | null
          scan_frequency_hours?: number | null
          search_terms_cached_at?: string | null
          selected_plan?: string | null
          success_stories?: string | null
          target_audience?: string | null
          tone?: Database["public"]["Enums"]["tone_preference"] | null
          unique_differentiators?: string | null
          updated_at?: string | null
          value_proposition?: string | null
        }
        Update: {
          auto_pilot_enabled?: boolean | null
          cached_search_terms?: Json | null
          common_objections?: string[] | null
          company_description?: string | null
          competitor_names?: string[] | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          initial_setup_completed?: boolean | null
          key_features?: string[] | null
          last_scan_at?: string | null
          next_scheduled_scan_at?: string | null
          onboarding_completed?: boolean | null
          pricing_model?: string | null
          product_name?: string | null
          product_url?: string | null
          scan_frequency_hours?: number | null
          search_terms_cached_at?: string | null
          selected_plan?: string | null
          success_stories?: string | null
          target_audience?: string | null
          tone?: Database["public"]["Enums"]["tone_preference"] | null
          unique_differentiators?: string | null
          updated_at?: string | null
          value_proposition?: string | null
        }
        Relationships: []
      }
      reply_drafts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_posted: boolean | null
          lead_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_posted?: boolean | null
          lead_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_posted?: boolean | null
          lead_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reply_drafts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_history: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          hot_leads: number | null
          id: string
          leads_found: number | null
          posts_scanned: number | null
          scan_type: string
          started_at: string | null
          status: string | null
          user_id: string
          warm_leads: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          hot_leads?: number | null
          id?: string
          leads_found?: number | null
          posts_scanned?: number | null
          scan_type?: string
          started_at?: string | null
          status?: string | null
          user_id: string
          warm_leads?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          hot_leads?: number | null
          id?: string
          leads_found?: number | null
          posts_scanned?: number | null
          scan_type?: string
          started_at?: string | null
          status?: string | null
          user_id?: string
          warm_leads?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seen_posts: {
        Row: {
          first_seen_at: string | null
          id: string
          last_seen_at: string | null
          post_hash: string | null
          post_url: string
          user_id: string
        }
        Insert: {
          first_seen_at?: string | null
          id?: string
          last_seen_at?: string | null
          post_hash?: string | null
          post_url: string
          user_id: string
        }
        Update: {
          first_seen_at?: string | null
          id?: string
          last_seen_at?: string | null
          post_hash?: string | null
          post_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seen_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string | null
          updated_at: string | null
          user_id: string
          whop_membership_id: string | null
          whop_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type: string
          status?: string | null
          updated_at?: string | null
          user_id: string
          whop_membership_id?: string | null
          whop_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
          whop_membership_id?: string | null
          whop_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      intent_level: "hot" | "warm" | "research" | "low"
      lead_status: "new" | "engaged" | "replied" | "converted" | "archived"
      tone_preference:
        | "professional"
        | "casual"
        | "friendly"
        | "technical"
        | "witty"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      intent_level: ["hot", "warm", "research", "low"],
      lead_status: ["new", "engaged", "replied", "converted", "archived"],
      tone_preference: [
        "professional",
        "casual",
        "friendly",
        "technical",
        "witty",
      ],
    },
  },
} as const
