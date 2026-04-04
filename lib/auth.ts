import { getServerSession as nextAuthGetServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Typed helper for use in server components and API routes
export const getServerSession = () =>
  nextAuthGetServerSession(authOptions);

export { authOptions };
