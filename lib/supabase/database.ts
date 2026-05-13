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
    }
  }
}
