import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return false;

      const googleId = account.providerAccountId;
      const email = user.email!;
      const name = user.name ?? null;
      const avatarUrl = user.image ?? null;

      // Determine role: admin if email matches ADMIN_EMAIL, otherwise creator
      const role =
        email === process.env.ADMIN_EMAIL ? "admin" : "creator";

      // Upsert user in Supabase on every login
      const { error } = await supabase
        .from("users")
        .upsert(
          { google_id: googleId, email, name, avatar_url: avatarUrl, role },
          { onConflict: "google_id", ignoreDuplicates: false }
        );

      if (error) {
        console.error("[auth] Failed to upsert user:", error.message);
        return false;
      }

      // Track login event
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("google_id", googleId)
        .single();
      if (userData?.id) {
        await supabase.from("login_events").insert({ user_id: userData.id });
      }

      return true;
    },

    async session({ session, token }) {
      if (!session.user?.email) return session;

      // Fetch role and id from Supabase to attach to session
      const { data } = await supabase
        .from("users")
        .select("id, role")
        .eq("email", session.user.email)
        .single();

      if (data) {
        session.user.id = data.id;
        session.user.role = data.role as "admin" | "creator";
      }

      return session;
    },

    async jwt({ token, account }) {
      if (account) {
        token.googleId = account.providerAccountId;
      }

      // Always refresh role from DB so proxy.ts has the correct value
      if (token.email) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("email", token.email as string)
          .single();
        if (data) token.role = data.role;
      }

      return token;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
