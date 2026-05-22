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
          provider: string | null
          email_verified: boolean
          local_imported_at: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          provider?: string | null
          email_verified?: boolean
          local_imported_at?: string | null
          onboarding_completed?: boolean
        }
        Update: {
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          provider?: string | null
          email_verified?: boolean
          local_imported_at?: string | null
          onboarding_completed?: boolean
        }
      }
      user_progress: {
        Row: {
          user_id: string
          total_xp: number
          current_streak: number
          last_practice_date: string | null
          best_wpm: number
          best_accuracy: number
          total_sessions: number
          updated_at: string
        }
        Insert: {
          user_id: string
          total_xp?: number
          current_streak?: number
          last_practice_date?: string | null
          best_wpm?: number
          best_accuracy?: number
          total_sessions?: number
        }
        Update: {
          total_xp?: number
          current_streak?: number
          last_practice_date?: string | null
          best_wpm?: number
          best_accuracy?: number
          total_sessions?: number
        }
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
      }
      typing_sessions: {
        Row: {
          id: string
          user_id: string
          language_id: string
          snippet_id: string
          wpm: number
          accuracy: number
          errors: number
          duration: number
          difficulty: string
          xp_earned: number
          created_at: string
        }
        Insert: {
          user_id: string
          language_id: string
          snippet_id: string
          wpm: number
          accuracy: number
          errors: number
          duration: number
          difficulty: string
          xp_earned: number
          created_at?: string
        }
        Update: {
          language_id?: string
          snippet_id?: string
          wpm?: number
          accuracy?: number
          errors?: number
          duration?: number
          difficulty?: string
          xp_earned?: number
          created_at?: string
        }
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
      }
      feed_events: {
        Row: {
          id: number
          user_id: string
          event_type: 'session' | 'achievement' | 'level_up'
          payload: Json
          created_at: string
        }
        Insert: {
          user_id: string
          event_type: 'session' | 'achievement' | 'level_up'
          payload: Json
        }
        Update: never
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
        }
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
        }
      }
    }
  }
}
