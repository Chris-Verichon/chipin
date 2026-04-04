// Auto-generated TypeScript types matching supabase/schema.sql
// Regenerate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID

export type UserRole = "admin" | "creator";
export type ParticipationStatus = "pending" | "paid" | "failed" | "refunded";
export type FeeStatus = "paid" | "refunded";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          google_id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          google_id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          google_id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
        };
      };
      cagnottes: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          goal: number | null;
          creator_id: string;
          stripe_checkout_session_id: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          goal?: number | null;
          creator_id: string;
          stripe_checkout_session_id?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          goal?: number | null;
          creator_id?: string;
          stripe_checkout_session_id?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      participations: {
        Row: {
          id: string;
          cagnotte_id: string;
          participant_name: string;
          participant_email: string;
          amount: number;
          message: string | null;
          stripe_payment_intent_id: string | null;
          status: ParticipationStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          cagnotte_id: string;
          participant_name: string;
          participant_email: string;
          amount: number;
          message?: string | null;
          stripe_payment_intent_id?: string | null;
          status?: ParticipationStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          cagnotte_id?: string;
          participant_name?: string;
          participant_email?: string;
          amount?: number;
          message?: string | null;
          stripe_payment_intent_id?: string | null;
          status?: ParticipationStatus;
          created_at?: string;
        };
      };
      cagnotte_fees: {
        Row: {
          id: string;
          creator_id: string;
          cagnotte_id: string | null;
          stripe_checkout_session_id: string;
          amount: number;
          status: FeeStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          cagnotte_id?: string | null;
          stripe_checkout_session_id: string;
          amount?: number;
          status?: FeeStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          cagnotte_id?: string | null;
          stripe_checkout_session_id?: string;
          amount?: number;
          status?: FeeStatus;
          created_at?: string;
        };
      };
    };
  };
}
