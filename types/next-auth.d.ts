import "next-auth";

// Extend next-auth types to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "admin" | "creator";
    };
  }
}
