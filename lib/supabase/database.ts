export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          provider: string | null
          email_verified: boolean
          is_super_user: boolean
          local_imported_at: string | null
          onboarding_completed: boolean
          intro_tour_version_seen: number | null
          stats_reconciled_at: string | null
          social_seeded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          provider?: string | null
          email_verified?: boolean
          is_super_user?: boolean
          local_imported_at?: string | null
          onboarding_completed?: boolean
          intro_tour_version_seen?: number | null
          stats_reconciled_at?: string | null
          social_seeded_at?: string | null
        }
        Update: {
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          provider?: string | null
          email_verified?: boolean
          is_super_user?: boolean
          local_imported_at?: string | null
          onboarding_completed?: boolean
          intro_tour_version_seen?: number | null
          stats_reconciled_at?: string | null
          social_seeded_at?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          user_id: string
          total_xp: number
          current_streak: number
          last_practice_date: string | null
          last_activity_at: string | null
          last_streak_at: string | null
          best_wpm: number
          best_accuracy: number
          total_sessions: number
          ranked_score: number
          ranked_sessions: number
          completed_track_ids: string[] | null
          updated_at: string
        }
        Insert: {
          user_id: string
          total_xp?: number
          current_streak?: number
          last_practice_date?: string | null
          last_activity_at?: string | null
          last_streak_at?: string | null
          best_wpm?: number
          best_accuracy?: number
          total_sessions?: number
          ranked_score?: number
          ranked_sessions?: number
          completed_track_ids?: string[] | null
        }
        Update: {
          total_xp?: number
          current_streak?: number
          last_practice_date?: string | null
          last_activity_at?: string | null
          last_streak_at?: string | null
          best_wpm?: number
          best_accuracy?: number
          total_sessions?: number
          ranked_score?: number
          ranked_sessions?: number
          completed_track_ids?: string[] | null
        }
        Relationships: []
      }
      user_language_progress: {
        Row: {
          user_id: string
          language_id: string
          completed_snippet_ids: Json
          best_wpm: number
          best_accuracy: number
          total_sessions: number
          updated_at: string
        }
        Insert: {
          user_id: string
          language_id: string
          completed_snippet_ids?: Json
          best_wpm?: number
          best_accuracy?: number
          total_sessions?: number
        }
        Update: {
          completed_snippet_ids?: Json
          best_wpm?: number
          best_accuracy?: number
          total_sessions?: number
        }
        Relationships: []
      }
      typing_sessions: {
        Row: {
          id: string
          user_id: string
          language_id: string
          snippet_id: string
          wpm: number
          raw_wpm: number
          accuracy: number
          errors: number
          duration: number
          difficulty: string
          xp_earned: number
          ranked_points: number
          ranked_eligible: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          language_id: string
          snippet_id: string
          wpm: number
          raw_wpm?: number
          accuracy: number
          errors: number
          duration: number
          difficulty: string
          xp_earned: number
          ranked_points?: number
          ranked_eligible?: boolean
          created_at?: string
        }
        Update: {
          language_id?: string
          snippet_id?: string
          wpm?: number
          raw_wpm?: number
          accuracy?: number
          errors?: number
          duration?: number
          difficulty?: string
          xp_earned?: number
          ranked_points?: number
          ranked_eligible?: boolean
          created_at?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          id: string
          category: string
          threshold: number | null
          icon: string
          name_pt: string
          name_en: string
          description_pt: string
          description_en: string
          created_at: string
        }
        Insert: {
          id: string
          category: string
          threshold?: number | null
          icon: string
          name_pt: string
          name_en: string
          description_pt: string
          description_en: string
        }
        Update: {
          category?: string
          threshold?: number | null
          icon?: string
          name_pt?: string
          name_en?: string
          description_pt?: string
          description_en?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          user_id: string
          achievement_id: string
          unlocked_at?: string
        }
        Update: {
          unlocked_at?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
        }
        Update: never
        Relationships: []
      }
      feed_events: {
        Row: {
          id: number
          user_id: string
          event_type: 'session' | 'achievement' | 'achievement_unlock' | 'level_up' | 'follow' | 'track_completed' | 'manual_post'
          payload: Json
          created_at: string
        }
        Insert: {
          user_id: string
          event_type: 'session' | 'achievement' | 'achievement_unlock' | 'level_up' | 'follow' | 'track_completed' | 'manual_post'
          payload: Json
          created_at?: string
        }
        Update: never
        Relationships: []
      }
      billing_checkouts: {
        Row: {
          id: string
          user_id: string
          provider: 'asaas'
          purpose: 'plus_subscription' | 'sandbox_test'
          external_reference: string
          provider_checkout_id: string | null
          provider_customer_id: string | null
          status: 'creating' | 'active' | 'paid' | 'canceled' | 'expired' | 'failed'
          amount: number
          currency: 'BRL'
          sandbox: boolean
          checkout_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider?: 'asaas'
          purpose: 'plus_subscription' | 'sandbox_test'
          external_reference: string
          provider_checkout_id?: string | null
          provider_customer_id?: string | null
          status?: 'creating' | 'active' | 'paid' | 'canceled' | 'expired' | 'failed'
          amount: number
          currency?: 'BRL'
          sandbox?: boolean
          checkout_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          provider?: 'asaas'
          purpose?: 'plus_subscription' | 'sandbox_test'
          provider_checkout_id?: string | null
          provider_customer_id?: string | null
          status?: 'creating' | 'active' | 'paid' | 'canceled' | 'expired' | 'failed'
          amount?: number
          currency?: 'BRL'
          sandbox?: boolean
          checkout_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      billing_subscriptions: {
        Row: {
          id: string
          user_id: string
          provider: 'asaas'
          purpose: 'plus_subscription' | 'sandbox_test'
          provider_subscription_id: string
          provider_customer_id: string | null
          status: string
          cycle: string | null
          amount: number | null
          next_due_date: string | null
          sandbox: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider?: 'asaas'
          purpose?: 'plus_subscription' | 'sandbox_test'
          provider_subscription_id: string
          provider_customer_id?: string | null
          status: string
          cycle?: string | null
          amount?: number | null
          next_due_date?: string | null
          sandbox?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          provider?: 'asaas'
          purpose?: 'plus_subscription' | 'sandbox_test'
          provider_subscription_id?: string
          provider_customer_id?: string | null
          status?: string
          cycle?: string | null
          amount?: number | null
          next_due_date?: string | null
          sandbox?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      user_entitlements: {
        Row: {
          id: string
          user_id: string
          plan_id: 'plus'
          status: 'active' | 'manual_grant' | 'past_due' | 'overdue' | 'cancelled' | 'expired'
          source: 'asaas' | 'manual_grant' | 'system'
          provider: string | null
          provider_customer_id: string | null
          provider_subscription_id: string | null
          granted_by: string | null
          reason: string | null
          starts_at: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id?: 'plus'
          status: 'active' | 'manual_grant' | 'past_due' | 'overdue' | 'cancelled' | 'expired'
          source: 'asaas' | 'manual_grant' | 'system'
          provider?: string | null
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          granted_by?: string | null
          reason?: string | null
          starts_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          plan_id?: 'plus'
          status?: 'active' | 'manual_grant' | 'past_due' | 'overdue' | 'cancelled' | 'expired'
          source?: 'asaas' | 'manual_grant' | 'system'
          provider?: string | null
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          granted_by?: string | null
          reason?: string | null
          starts_at?: string
          expires_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      entitlement_audit_events: {
        Row: {
          id: number
          actor_user_id: string | null
          target_user_id: string
          action: string
          plan_id: string
          source: string
          reason: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          actor_user_id?: string | null
          target_user_id: string
          action: string
          plan_id?: string
          source: string
          reason?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: never
        Relationships: []
      }
      billing_events: {
        Row: {
          id: number
          provider: string
          provider_event_id: string
          event_type: string
          payload: Json
          received_at: string
          processed_at: string | null
          processing_error: string | null
        }
        Insert: {
          provider: string
          provider_event_id: string
          event_type: string
          payload: Json
          received_at?: string
          processed_at?: string | null
          processing_error?: string | null
        }
        Update: {
          processed_at?: string | null
          processing_error?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      global_leaderboard: {
        Row: {
          user_id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          total_xp: number
          best_wpm: number
          current_streak: number
          total_sessions: number
          ranked_score: number
          ranked_sessions: number
        }
        Relationships: []
      }
      leaderboard_with_score: {
        Row: {
          user_id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          total_xp: number
          best_wpm: number
          avg_wpm: number
          current_streak: number
          total_sessions: number
          level: number
          score: number
          ranked_sessions: number
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
