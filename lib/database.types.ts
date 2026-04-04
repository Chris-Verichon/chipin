// TypeScript types matching supabase/schema.sql
// Regenerate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID

export type UserRole = "admin" | "creator";
export type ParticipationStatus = "pending" | "paid" | "failed" | "refunded";
export type FeeStatus = "paid" | "refunded";

// Must be `type` (not `interface`) and include `Relationships` for supabase-js v2 generic inference
export type Database = {
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
        Relationships: [];
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
        Relationships: [
          {
            foreignKeyName: "cagnottes_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "participations_cagnotte_id_fkey";
            columns: ["cagnotte_id"];
            isOneToOne: false;
            referencedRelation: "cagnottes";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "cagnotte_fees_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cagnotte_fees_cagnotte_id_fkey";
            columns: ["cagnotte_id"];
            isOneToOne: false;
            referencedRelation: "cagnottes";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
